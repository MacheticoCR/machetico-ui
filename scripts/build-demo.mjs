import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'vite';
const license = await readFile('LICENSE', 'utf8');
process.env.VITE_DOCS_REVISION = process.env.GITHUB_SHA?.slice(0, 7) ?? 'local';
await build({
  root: resolve('demo'),
  configFile: resolve('demo/vite.config.mjs'),
  base: '/machetico-ui/',
  build: { outDir: resolve('artifacts/pages'), emptyOutDir: true, sourcemap: false },
  plugins: [
    {
      name: 'documentation-license',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'license', source: license });
        this.emitFile({ type: 'asset', fileName: '.nojekyll', source: '' });
      },
    },
  ],
});
