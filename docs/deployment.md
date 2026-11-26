# Documentation deployment

The public demo is hosted at https://macheticocr.github.io/machetico-ui/ using GitHub Pages. `.github/workflows/pages.yml` builds and deploys every push to `master`; pull requests to `dev` or `master` build and test without deployment. A manual run may deploy `master` again. No deployment branch or npm credential is needed.

The build uses Node 24, the committed lockfile, partial-AOT library output, generated reference tables and consumer Tailwind CSS. Package version comes from the library manifest; the header revision comes from `GITHUB_SHA`. Pages uses CSR, repository-relative assets and hash routes, for example `/machetico-ui/#/components/select`. The documentation's existing JavaScript templates require Angular JIT in this demo bundle. The compiler increases download size; this is not the production bootstrap recipe for consuming applications. No sourcemaps, SSR server, private application sources or environment files are uploaded.

```sh
npm ci --ignore-scripts
npm run demo:build
npm run test:pages
```

The static output is `artifacts/pages`. Browser tests serve it beneath `/machetico-ui/` with no SPA server fallback and verify individual views, reloads, controls, consumer design changes, skip navigation, license and video assets. The regular `npm run test:e2e` separately retains local SSR/hydration and CSR coverage.

The workflow uses `configure-pages`, `upload-pages-artifact` and `deploy-pages`; the deployment job has only Pages write and OIDC permissions. The `github-pages` environment permits deployment from `master`. Concurrent production deployments cancel superseded runs.

To roll back documentation, use the normal reviewed `dev` → `master` workflow to restore the desired source and let Pages rebuild. GitHub Actions retains deployment history and links from the `github-pages` environment. A documentation rollback does not change the npm registry. Published npm versions are immutable and have their own release process; this workflow does not bump or publish them.

Official reference: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
