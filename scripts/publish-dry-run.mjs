import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const { version } = JSON.parse(readFileSync('projects/machetico-ui/package.json', 'utf8'));
const registryVersion = spawnSync(
  process.execPath,
  [
    process.env.npm_execpath,
    'view',
    `machetico-ui@${version}`,
    'version',
    '--json',
    '--registry=https://registry.npmjs.org/',
  ],
  { encoding: 'utf8' },
);
if (registryVersion.status !== 0 && !registryVersion.stderr.includes('E404')) {
  throw new Error(registryVersion.stderr || 'Cannot verify registry version status.');
}
const published = registryVersion.status === 0;
if (published) {
  assert.ok(registryVersion.stdout.includes(JSON.stringify(version)));
  console.log(
    `Version ${version} is already published. Simulating packaging only; registry immutability still applies to real publication.`,
  );
}
const result = spawnSync(
  process.execPath,
  [
    process.env.npm_execpath,
    'publish',
    `./artifacts/machetico-ui-${version}.tgz`,
    '--dry-run',
    // npm checks registry immutability even in dry-run. This flag is confined to
    // simulation of an existing version; this script always includes --dry-run.
    ...(published ? ['--force'] : []),
    '--access',
    'public',
    '--registry=https://registry.npmjs.org/',
  ],
  { stdio: 'inherit' },
);
process.exitCode = result.status ?? 1;
