import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
mkdirSync('artifacts', { recursive: true });
const result = spawnSync(
  process.execPath,
  [process.env.npm_execpath, 'pack', './dist/machetico-ui', '--pack-destination', 'artifacts'],
  { stdio: 'inherit' },
);
process.exitCode = result.status ?? 1;
