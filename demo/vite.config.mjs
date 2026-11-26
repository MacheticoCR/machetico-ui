import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^machetico-ui$/,
        replacement: fileURLToPath(
          new URL('../dist/machetico-ui/fesm2022/machetico-ui.mjs', import.meta.url),
        ),
      },
    ],
  },
  optimizeDeps: {
    include: [
      '@angular/core',
      '@angular/common',
      '@angular/common/http',
      '@angular/compiler',
      '@angular/forms',
      '@angular/platform-browser',
      '@angular/router',
      '@angular/aria/combobox',
      '@angular/aria/listbox',
      '@angular/aria/toolbar',
      '@angular/aria/tabs',
      '@angular/aria/accordion',
      '@angular/localize/init',
    ],
  },
  ssr: { noExternal: ['machetico-ui'] },
});
