/**
 * Ease of use: what had to change in the baseline app (`app/`) to get the document out of a tool.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, lstatSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { APP_DIR } from './variants.ts';
import type { Variant } from './variants.ts';

/** Never part of the comparison: dependencies, build output, lock files, the contract tests of the app */
const IGNORED_NAMES: Set<string> = new Set([
  'node_modules',
  'dist',
  '.git',
  'coverage',
  'test',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  '.DS_Store',
  'bench.json',
  'README.md',
  'tsconfig.tsbuildinfo',
  'tsconfig.build.tsbuildinfo',
]);

export interface FileChange {
  file: string;
  status: 'added' | 'removed' | 'modified';
  added: number;
  removed: number;
  kind: 'source' | 'config';
}

export interface EaseResult {
  filesTouched: number;
  filesAdded: number;
  linesAdded: number;
  linesRemoved: number;
  /** Lines changed (added + removed) */
  linesChanged: number;
  sourceFilesTouched: number;
  sourceLinesChanged: number;
  configLinesChanged: number;
  /** Source files of the app, to read `sourceFilesTouched` against */
  sourceFilesTotal: number;
  dependenciesAdded: string[];
  dependenciesRemoved: string[];
  /** node_modules size difference with the app, in MB */
  installFootprintMb?: number;
  /** Size difference of the production dependency tree (`npm ls --omit=dev`) with the app, in MB: what ships with the service */
  productionFootprintMb?: number;
  changes: FileChange[];
}

const listFiles = (root: string, ignored: Set<string>): string[] => {
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full: string = join(dir, entry.name);
      const rel: string = relative(root, full);
      if (IGNORED_NAMES.has(entry.name) || ignored.has(rel) || rel.endsWith('.log')) {
        continue;
      }
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        out.push(rel);
      }
    }
  };
  walk(root);

  return out.sort();
};

/** `git diff --numstat` works outside of a repository with --no-index */
const numstat = (a: string, b: string): { added: number; removed: number } => {
  const res = spawnSync('git', ['diff', '--no-index', '--numstat', '--ignore-cr-at-eol', '--', a, b], { encoding: 'utf8' });
  const line: string = res.stdout.trim().split('\n')[0] ?? '';
  const [added, removed] = line.split('\t');

  return { added: Number(added) || 0, removed: Number(removed) || 0 };
};

const dependencies = (dir: string): Set<string> => {
  const file: string = join(dir, 'package.json');
  if (!existsSync(file)) {
    return new Set();
  }
  const pkg = JSON.parse(readFileSync(file, 'utf8'));

  return new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})]);
};

const folderSizeMb = (dir: string): number | undefined => {
  if (!existsSync(dir)) {
    return undefined;
  }
  try {
    const kb: number = Number(execFileSync('du', ['-sk', dir], { encoding: 'utf8' }).split('\t')[0]);

    return kb / 1024;
  } catch {
    return undefined;
  }
};

/** Disk usage of a directory (like `du`), without its nested node_modules */
const packageSizeBytes = (dir: string): number => {
  let bytes: number = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') {
      continue;
    }
    const full: string = join(dir, entry.name);
    bytes += entry.isDirectory() ? packageSizeBytes(full) : lstatSync(full).blocks * 512;
  }

  return bytes;
};

/** Size of the installed production dependency tree: the packages a `npm ci --omit=dev` would keep */
const productionSizeMb = (dir: string): number | undefined => {
  if (!existsSync(join(dir, 'node_modules'))) {
    return undefined;
  }
  // npm ls exits with 1 on extraneous or invalid packages, the list is still printed
  const res = spawnSync('npm', ['ls', '--omit=dev', '--all', '--parseable'], { cwd: dir, encoding: 'utf8' });
  const packages: string[] = [...new Set(res.stdout.trim().split('\n'))].filter(
    (p: string): boolean => p !== '' && p !== dir && existsSync(p),
  );
  if (packages.length === 0) {
    return undefined;
  }

  return packages.reduce((acc: number, p: string): number => acc + packageSizeBytes(p), 0) / 1024 / 1024;
};

const isSource = (file: string): boolean => file.startsWith('src/');

export const measureEase = (variant: Variant): EaseResult => {
  const ignored: Set<string> = new Set([variant.config.output, ...(variant.config.generated ?? [])]);
  const appFiles: Set<string> = new Set(listFiles(APP_DIR, new Set()));
  const variantFiles: Set<string> = new Set(listFiles(variant.dir, ignored));
  const changes: FileChange[] = [];

  for (const file of new Set([...appFiles, ...variantFiles])) {
    const inApp: boolean = appFiles.has(file);
    const inVariant: boolean = variantFiles.has(file);
    const kind: FileChange['kind'] = isSource(file) ? 'source' : 'config';
    if (inApp && inVariant) {
      const a: string = join(APP_DIR, file);
      const b: string = join(variant.dir, file);
      if (statSync(a).size === statSync(b).size && readFileSync(a).equals(readFileSync(b))) {
        continue;
      }
      changes.push({ file, status: 'modified', kind, ...numstat(a, b) });
    } else if (inVariant) {
      changes.push({ file, status: 'added', kind, ...numstat('/dev/null', join(variant.dir, file)) });
    } else {
      changes.push({ file, status: 'removed', kind, ...numstat(join(APP_DIR, file), '/dev/null') });
    }
  }

  const appDeps: Set<string> = dependencies(APP_DIR);
  const variantDeps: Set<string> = dependencies(variant.dir);
  const appSize: number | undefined = folderSizeMb(join(APP_DIR, 'node_modules'));
  const variantSize: number | undefined = folderSizeMb(join(variant.dir, 'node_modules'));
  const appProdSize: number | undefined = productionSizeMb(APP_DIR);
  const variantProdSize: number | undefined = productionSizeMb(variant.dir);
  const sum = (list: FileChange[], f: (c: FileChange) => number): number => list.reduce((acc, c) => acc + f(c), 0);
  const source: FileChange[] = changes.filter((c: FileChange): boolean => c.kind === 'source');
  const config: FileChange[] = changes.filter((c: FileChange): boolean => c.kind === 'config');

  return {
    filesTouched: changes.length,
    filesAdded: changes.filter((c: FileChange): boolean => c.status === 'added').length,
    linesAdded: sum(changes, (c) => c.added),
    linesRemoved: sum(changes, (c) => c.removed),
    linesChanged: sum(changes, (c) => c.added + c.removed),
    sourceFilesTouched: source.length,
    sourceLinesChanged: sum(source, (c) => c.added + c.removed),
    configLinesChanged: sum(config, (c) => c.added + c.removed),
    sourceFilesTotal: [...appFiles].filter(isSource).length,
    dependenciesAdded: [...variantDeps].filter((d: string): boolean => !appDeps.has(d)).sort(),
    dependenciesRemoved: [...appDeps].filter((d: string): boolean => !variantDeps.has(d)).sort(),
    installFootprintMb: appSize !== undefined && variantSize !== undefined ? variantSize - appSize : undefined,
    productionFootprintMb:
      appProdSize !== undefined && variantProdSize !== undefined ? variantProdSize - appProdSize : undefined,
    changes: changes.sort((a: FileChange, b: FileChange): number => a.file.localeCompare(b.file)),
  };
};
