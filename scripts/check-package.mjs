import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const manifest = JSON.parse(readFileSync('dist/machetico-ui/package.json', 'utf8'));
assert.equal(manifest.name, 'machetico-ui');
assert.equal(manifest.license, 'MIT');
assert.equal(manifest.private, undefined);
assert.equal(manifest.sideEffects, false);
assert.equal(manifest.publishConfig.access, 'public');
assert.equal(manifest.publishConfig.registry, 'https://registry.npmjs.org/');
assert.equal(manifest.peerDependencies['@angular/aria'], '22.2.6');
assert.equal(manifest.peerDependencies['@angular/localize'], '^22.2.6');
assert.deepEqual(Object.keys(manifest.dependencies), ['tslib']);
assert.ok(manifest.exports['.'].types && manifest.exports['./api'].types);
assert.equal(manifest.scripts, undefined);
const result = spawnSync(
  process.execPath,
  [process.env.npm_execpath, 'pack', './dist/machetico-ui', '--dry-run', '--json'],
  { encoding: 'utf8' },
);
assert.equal(result.status, 0, result.stderr);
const output = JSON.parse(result.stdout);
const archive = Array.isArray(output) ? output[0] : output[manifest.name];
assert.equal(archive.name, manifest.name);
assert.ok(Array.isArray(archive.files));
for (const file of archive.files) {
  assert.match(
    file.path,
    /^(?:package\.json|README\.md|LICENSE|THIRD_PARTY_NOTICES\.md|(?:fesm2022|types|assets|docs)\/)/,
  );
  assert.doesNotMatch(
    file.path,
    /(?:^|\/)(?:node_modules|src|demo|tests|e2e|\.env)(?:\/|$)|\.css$|\.pem$|\.key$/,
  );
}
const root = readFileSync('dist/machetico-ui/fesm2022/machetico-ui.mjs', 'utf8');
assert.doesNotMatch(root, /@angular\/common\/http|DEMO_APPEARANCE|liquid-glass|CallToAction/);
assert.match(readFileSync('dist/machetico-ui/LICENSE', 'utf8'), /Copyright \(c\) 2026 MacheTico/);
console.log(
  `Package verified: ${archive.files.length} files, ${archive.size} bytes; public MIT APF, isolated API, no consumer CSS or application source.`,
);
