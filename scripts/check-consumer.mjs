import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const source = JSON.parse(readFileSync('projects/machetico-ui/package.json', 'utf8'));
const tarball = resolve(`artifacts/machetico-ui-${source.version}.tgz`);
const fingerprint = createHash('sha256').update(readFileSync(tarball)).digest('hex').slice(0, 12);
const root = resolve('artifacts/consumer-install', fingerprint);
mkdirSync(root, { recursive: true });
cpSync('tests/consumer', root, { recursive: true });

const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
manifest.dependencies['machetico-ui'] =
  'file:' + resolve(`artifacts/machetico-ui-${source.version}.tgz`).replaceAll('\\', '/');
writeFileSync(resolve(root, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');
const install = spawnSync(
  process.execPath,
  [
    process.env.npm_execpath,
    'install',
    '--ignore-scripts',
    '--strict-peer-deps',
    '--no-audit',
    '--no-fund',
  ],
  { cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
);
writeFileSync(resolve(root, 'install.log'), install.stdout + install.stderr);
assert.equal(install.status, 0, install.stdout + install.stderr);
const build = spawnSync(
  process.execPath,
  [resolve('node_modules/@angular/cli/bin/ng.js'), 'build', '--configuration', 'production'],
  { cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
);
writeFileSync(resolve(root, 'build.log'), build.stdout + build.stderr);
assert.equal(build.status, 0, build.stdout + build.stderr);
const installed = JSON.parse(
  readFileSync(resolve(root, 'node_modules/machetico-ui/package.json'), 'utf8'),
);
assert.equal(installed.version, source.version);
assert.equal(
  readFileSync(resolve(root, 'node_modules/machetico-ui/fesm2022/machetico-ui.mjs'), 'utf8'),
  readFileSync('dist/machetico-ui/fesm2022/machetico-ui.mjs', 'utf8'),
);
assert.equal(installed.license, 'MIT');
for (const file of readdirSync('dist/machetico-ui/fesm2022').filter((file) =>
  file.endsWith('.mjs'),
)) {
  assert.equal(
    readFileSync(resolve(root, 'node_modules/machetico-ui/fesm2022', file), 'utf8'),
    readFileSync(resolve('dist/machetico-ui/fesm2022', file), 'utf8'),
    `Installed secondary entry differs: ${file}`,
  );
}
const html = readFileSync(resolve(root, 'dist/consumer/browser/index.html'), 'utf8');
assert.match(html, /Packaged consumer ready/);
assert.match(html, /Synthetic person/);
assert.match(html, /ngh=/);
assert.ok(readdirSync(resolve(root, 'dist/consumer/browser')).some((file) => file.endsWith('.js')));
console.log(
  'Isolated npm install + strict production AOT + SSR passed for the common Angular 22.2.6 baseline. UI and optional API imports resolved without peer bypasses.',
);
