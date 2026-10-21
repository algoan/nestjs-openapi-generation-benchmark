import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export const ROOT: string = resolve(import.meta.dirname, '../..');
export const APP_DIR: string = join(ROOT, 'app');
export const VARIANTS_DIR: string = join(ROOT, 'variants');
export const EXPECTED_FILE: string = join(ROOT, 'expected/openapi.yaml');
export const RESULTS_DIR: string = join(ROOT, 'bench/results');

export interface Step {
  /** Label shown in the report (`build`, `generate`, …) */
  name: string;
  /** Shell command, run from the variant directory */
  command: string;
}

/** Content of `variants/<name>/bench.json` */
export interface VariantConfig {
  /** Display name of the tool, e.g. `@nestjs/swagger` */
  tool: string;
  /** npm packages of the tool, their installed versions are reported */
  packages: string[];
  /** How the tool gets the information: `runtime` (boots the app), `static` (reads the sources), `compiler` (TS transform) */
  approach: 'runtime' | 'static' | 'compiler';
  /** Generated document, relative to the variant directory */
  output: string;
  /** Commands producing `output` from the sources, measured by the perf benchmark */
  steps: Step[];
  /** Command run before each measured run, to start from a clean state (e.g. `rm -rf dist`) */
  clean?: string;
  /** Generated files/directories that must not count as hand-written changes */
  generated?: string[];
  /** Free-form remarks shown in the report */
  notes?: string[];
}

export interface Variant {
  name: string;
  dir: string;
  config: VariantConfig;
}

export const loadVariants = (only?: string[]): Variant[] => {
  if (!existsSync(VARIANTS_DIR)) {
    return [];
  }

  return readdirSync(VARIANTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(VARIANTS_DIR, entry.name, 'bench.json')))
    .filter((entry) => only === undefined || only.includes(entry.name))
    .map((entry): Variant => {
      const dir: string = join(VARIANTS_DIR, entry.name);

      return { name: entry.name, dir, config: JSON.parse(readFileSync(join(dir, 'bench.json'), 'utf8')) as VariantConfig };
    })
    .sort((a: Variant, b: Variant): number => a.name.localeCompare(b.name));
};

/** Installed version of a package, read from the variant's node_modules */
export const installedVersion = (dir: string, pkg: string): string | undefined => {
  const file: string = join(dir, 'node_modules', pkg, 'package.json');

  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')).version as string) : undefined;
};
