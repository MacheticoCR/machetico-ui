import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, basename, dirname } from 'node:path';
import ts from 'typescript';
import * as prettier from 'prettier';
import { componentExamples, directiveExamples } from '../demo/example-markup.js';
const root = 'projects/machetico-ui/src/lib';
const walk = (path) =>
  readdirSync(path, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(resolve(path, entry.name)) : [resolve(path, entry.name)],
  );
const config = ts.readConfigFile('projects/machetico-ui/tsconfig.lib.json', ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  resolve('projects/machetico-ui'),
);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();
const base = program.getSourceFile(resolve(`${root}/components/form-control/form-control.ts`));
const baseClass = base.statements.find(ts.isClassDeclaration);
/**
 * Reads public signal inputs, models and outputs from a concrete declaration.
 * @function rows
 * @param declaration - Class declaration owning the public fields.
 * @param ast - Source file used to preserve verified type and default expressions.
 * @returns Public API rows for a consumer-owned reference table.
 */
function rows(declaration, ast) {
  return declaration.members.flatMap((member) => {
    if (
      !ts.isPropertyDeclaration(member) ||
      !member.initializer ||
      !ts.isCallExpression(member.initializer)
    )
      return [];
    const call = member.initializer;
    const factory = call.expression.getText(ast).split('.')[0];
    if (!['input', 'model', 'output'].includes(factory)) return [];
    const name = member.name.getText(ast);
    const signalType = checker.getTypeAtLocation(member);
    const signature = checker.getSignaturesOfType(signalType, ts.SignatureKind.Call)[0];
    const valueType = signature
      ? checker.getReturnTypeOfSignature(signature)
      : signalType.typeArguments?.[0];
    const options = call.arguments.find(ts.isObjectLiteralExpression);
    const alias = options?.properties.find(
      (p) => ts.isPropertyAssignment(p) && p.name.getText(ast) === 'alias',
    );
    const comment = member.jsDoc?.[0]?.comment;
    return [
      {
        name: alias?.initializer.text ?? name,
        kind: factory === 'output' ? 'Salida' : factory === 'model' ? 'Modelo' : 'Entrada',
        type: valueType
          ? checker.typeToString(valueType, member, ts.TypeFormatFlags.NoTruncation)
          : (call.typeArguments?.map((t) => t.getText(ast)).join(', ') ?? 'unknown'),
        default: call.expression.getText(ast).includes('.required')
          ? 'requerido'
          : (call.arguments[0]?.getText(ast) ?? '—'),
        description: typeof comment === 'string' ? comment : 'Contrato público del control.',
      },
    ];
  });
}
/**
 * Collects concrete decorated library declarations without inventing runtime contracts.
 * @function catalog
 * @param group - Owning components or directives directory.
 * @param decorator - Angular decorator identifying the public declaration kind.
 * @returns Sorted documentation entries derived from source metadata and TSDoc.
 */
function catalog(group, decorator) {
  return walk(resolve(root, group))
    .filter((file) => file.endsWith('.ts') && !file.endsWith('index.ts'))
    .flatMap((file) => {
      const ast = program.getSourceFile(file);
      return ast.statements.filter(ts.isClassDeclaration).flatMap((declaration) => {
        if (
          !ts.getDecorators(declaration)?.some((d) => d.getText(ast).startsWith(`@${decorator}(`))
        )
          return [];
        const id = basename(dirname(file));
        let inputs = rows(declaration, ast);
        if (['input', 'textarea'].includes(id)) inputs = [...rows(baseClass, base), ...inputs];
        const comment = declaration.jsDoc?.[0]?.comment;
        return [
          {
            id,
            name: declaration.name.text,
            description: typeof comment === 'string' ? comment : 'Reusable headless control.',
            api: inputs,
            methods: declaration.members
              .filter(
                (member) =>
                  ts.isMethodDeclaration(member) &&
                  !/^ng(On|After|Do)/.test(member.name.getText(ast)) &&
                  !member.modifiers?.some((modifier) =>
                    [ts.SyntaxKind.PrivateKeyword, ts.SyntaxKind.ProtectedKeyword].includes(
                      modifier.kind,
                    ),
                  ),
              )
              .map((member) => ({
                name: member.name.getText(ast),
                signature:
                  member.name.getText(ast) +
                  '(' +
                  member.parameters.map((parameter) => parameter.getText(ast)).join(', ') +
                  '): ' +
                  (member.type?.getText(ast) ?? 'void'),
                description:
                  typeof member.jsDoc?.[0]?.comment === 'string' ? member.jsDoc[0].comment : '',
              })),
          },
        ];
      });
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
const iconSource = ts.createSourceFile(
  'icons.ts',
  readFileSync(`${root}/interfaces/icon-name.type.ts`, 'utf8'),
  ts.ScriptTarget.Latest,
  true,
);
const iconNames = iconSource.statements
  .find(ts.isTypeAliasDeclaration)
  .type.types.map((type) => type.literal.text);
const components = catalog('components', 'Component');
const directives = catalog('directives', 'Directive');
for (const [entries, examples] of [
  [components, componentExamples],
  [directives, directiveExamples],
]) {
  for (const entry of entries) {
    if (typeof examples[entry.id] !== 'string' || !examples[entry.id].trim())
      throw new Error(`Missing executable documentation example: ${entry.name}`);
  }
}

const codeOptions = {
  ...(await prettier.resolveConfig('demo/example.html')),
  parser: 'angular',
  printWidth: 80,
  singleAttributePerLine: true,
  htmlWhitespaceSensitivity: 'ignore',
};
const componentCode = Object.fromEntries(
  await Promise.all(
    Object.entries(componentExamples).map(async ([id, markup]) => [
      id,
      await prettier.format(markup, codeOptions),
    ]),
  ),
);
const directiveCode = Object.fromEntries(
  await Promise.all(
    Object.entries(directiveExamples).map(async ([id, markup]) => [
      id,
      await prettier.format(markup, codeOptions),
    ]),
  ),
);
writeFileSync(
  'demo/catalog.generated.js',
  `// Generated from library public metadata by npm run docs:catalog.\nexport const componentCatalog = ${JSON.stringify(components, null, 2)};\nexport const directiveCatalog = ${JSON.stringify(directives, null, 2)};\nexport const iconNames = ${JSON.stringify(iconNames)};\nexport const componentCode = ${JSON.stringify(componentCode)};\nexport const directiveCode = ${JSON.stringify(directiveCode)};\n`,
);
console.log(
  `Documentation: ${components.length} concrete components and ${directives.length} directives.`,
);
