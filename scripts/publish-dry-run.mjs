import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const { version } = JSON.parse(readFileSync('projects/machetico-ui/package.json', 'utf8'));
const result = spawnSync(
  process.execPath,
  [
    process.env.npm_execpath,
    'publish',
    `./artifacts/machetico-ui-${version}.tgz`,
    '--dry-run',
    '--access',
    'public',
    '--registry=https://registry.npmjs.org/',
  ],
  { stdio: 'inherit' },
);
process.exitCode = result.status ?? 1;
