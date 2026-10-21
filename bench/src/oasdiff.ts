/**
 * Optional second opinion on correctness: the oasdiff changelog from the expected document to the generated one.
 * "Breaking" changes (level ERR) are the ones that would break a client written against the expected document.
 */
import { spawnSync } from 'node:child_process';

export interface OasdiffResult {
  available: boolean;
  error?: string;
  errors: number;
  warnings: number;
  infos: number;
  total: number;
  byId: Record<string, number>;
}

interface Change {
  id: string;
  level: number;
}

export const runOasdiff = (expectedFile: string, actualFile: string, prefix?: string): OasdiffResult => {
  const empty: OasdiffResult = { available: false, errors: 0, warnings: 0, infos: 0, total: 0, byId: {} };
  const args: string[] = [
    'changelog',
    expectedFile,
    actualFile,
    '-f',
    'json',
    '--flatten-allof',
    '--flatten-params',
    '--auto-upgrade',
    ...(prefix !== undefined ? ['--prefix-revision', prefix] : []),
  ];
  const res = spawnSync('oasdiff', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (res.error !== undefined) {
    return { ...empty, error: 'oasdiff is not installed (https://github.com/oasdiff/oasdiff)' };
  }
  if (res.status !== 0) {
    return { ...empty, available: true, error: res.stderr.trim().split('\n').slice(0, 3).join(' ') };
  }

  const changes: Change[] = JSON.parse(res.stdout || '[]') ?? [];
  const byId: Record<string, number> = {};
  for (const change of changes) {
    byId[change.id] = (byId[change.id] ?? 0) + 1;
  }

  return {
    available: true,
    errors: changes.filter((c: Change): boolean => c.level === 3).length,
    warnings: changes.filter((c: Change): boolean => c.level === 2).length,
    infos: changes.filter((c: Change): boolean => c.level === 1).length,
    total: changes.length,
    byId,
  };
};
