import { copyFileSync, cpSync, mkdirSync } from 'node:fs';
const root = 'projects/machetico-ui';
copyFileSync('README.md', `${root}/README.md`);
copyFileSync('LICENSE', `${root}/LICENSE`);
mkdirSync(`${root}/package-docs`, { recursive: true });
copyFileSync('THIRD_PARTY_NOTICES.md', `${root}/package-docs/THIRD_PARTY_NOTICES.md`);
cpSync('docs', `${root}/package-docs/docs`, { recursive: true });
