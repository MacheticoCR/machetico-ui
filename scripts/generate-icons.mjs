import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import ts from 'typescript';
import * as prettier from 'prettier';
const contract = 'projects/machetico-ui/core/src/lib/interfaces/icon-name.type.ts';
const source = ts.createSourceFile(
  contract,
  readFileSync(contract, 'utf8'),
  ts.ScriptTarget.Latest,
  true,
);
const alias = source.statements.find(ts.isTypeAliasDeclaration);
const names = alias.type.types.map((type) => type.literal.text);
const paths = names.map((name) => {
  const svg = readFileSync(`node_modules/lucide-static/icons/${name}.svg`, 'utf8');
  const body = svg.match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/)[1].trim();
  return { name, body };
});
const template =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">@switch(name()) {' +
  paths.map(({ name, body }) => `@case ('${name}') {${body}}`).join('') +
  '}</svg>';
const target = 'projects/machetico-ui/icon/src/lib/components/icon/icon.html';
writeFileSync(
  target,
  await prettier.format(template, { ...(await prettier.resolveConfig(target)), filepath: target }),
);
writeFileSync(
  'projects/machetico-ui/assets/icons.svg',
  '<svg xmlns="http://www.w3.org/2000/svg">' +
    paths
      .map(({ name, body }) => `<symbol id="${name}" viewBox="0 0 24 24">${body}</symbol>`)
      .join('') +
    '</svg>\n',
);
copyFileSync(
  'node_modules/lucide-static/LICENSE',
  'projects/machetico-ui/assets/ICONS-LICENSE.txt',
);
console.log(`Generated ${names.length} Lucide SVG icons; public icon names preserved.`);
