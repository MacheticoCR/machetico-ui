import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import ts from 'typescript';
const root = resolve('projects/machetico-ui');
const walk = (path) =>
  readdirSync(path, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(resolve(path, entry.name)) : [resolve(path, entry.name)],
  );
const sources = [...walk(resolve(root, 'src')), ...walk(resolve(root, 'api/src'))];
const files = sources.filter((file) => file.endsWith('.ts'));
const graph = new Map();
const referenced = new Set();
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const edges = [];
  const contracts = ast.statements.filter(
    (node) => ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node),
  );
  assert.ok(contracts.length <= 1, `One contract per file: ${file}`);
  if (contracts.length)
    assert.ok(
      file.replaceAll('\\', '/').includes('/interfaces/'),
      `Contract outside interfaces: ${file}`,
    );
  for (const node of ast.statements) {
    if (!ts.isImportDeclaration(node) && !ts.isExportDeclaration(node)) continue;
    const spec = node.moduleSpecifier?.text;
    if (!spec) continue;
    assert.ok(!/^rxjs(?:\/|$)|^@angular\/core\/rxjs-interop$/.test(spec), `RxJS import: ${file}`);
    assert.ok(!spec.includes('/private'), `Private framework API: ${file}`);
    if (spec.startsWith('.')) {
      const path = resolve(dirname(file), spec);
      const target = [path + '.ts', resolve(path, 'index.ts')].find(existsSync);
      assert.ok(
        target && relative(root, target) && !relative(root, target).startsWith('..'),
        `External application import: ${file}: ${spec}`,
      );
      referenced.add(target);
      if (!node.isTypeOnly && !node.importClause?.isTypeOnly) edges.push(target);
    }
  }
  for (const node of ast.statements.filter(ts.isClassDeclaration)) {
    const decorators =
      ts
        .getDecorators(node)
        ?.map((d) => d.getText(ast))
        .join(' ') ?? '';
    if (/@Service\(/.test(decorators))
      assert.ok(
        file.replaceAll('\\', '/').includes('/services/'),
        `Root service location: ${file}`,
      );
    if (!/@Component\(/.test(decorators)) continue;
    assert.match(text, /templateUrl:/, `External template: ${file}`);
    assert.match(text, /ChangeDetectionStrategy.OnPush/, `OnPush: ${file}`);
    const constructor = node.members.find(ts.isConstructorDeclaration);
    for (const statement of constructor?.body?.statements ?? [])
      assert.ok(
        ts.isExpressionStatement(statement) &&
          ts.isCallExpression(statement.expression) &&
          ['effect', 'afterRenderEffect'].includes(statement.expression.expression.getText(ast)),
        `Use lifecycle hooks for initialization: ${file}`,
      );
    for (const member of node.members) {
      assert.ok(
        member.modifiers?.some((m) =>
          [
            ts.SyntaxKind.PublicKeyword,
            ts.SyntaxKind.PrivateKeyword,
            ts.SyntaxKind.ProtectedKeyword,
          ].includes(m.kind),
        ),
        `Explicit member visibility: ${file}`,
      );
      if (ts.isMethodDeclaration(member)) assert.ok(member.type, `Explicit return: ${file}`);
      if (ts.isPropertyDeclaration(member))
        assert.ok(
          !/^effect\(/.test(member.initializer?.getText(ast) ?? ''),
          `Field effect: ${file}`,
        );
    }
  }
  assert.doesNotMatch(text, /@Injectable\(\{\s*providedIn:/, `Use @Service(): ${file}`);
  graph.set(file, edges);
}
for (const file of files.filter(
  (file) => file.endsWith('/index.ts') || file.endsWith('\\index.ts'),
))
  assert.ok(referenced.has(file), `Unused barrel: ${file}`);
const visiting = new Set(),
  visited = new Set();
function visit(file) {
  if (visited.has(file)) return;
  assert.ok(!visiting.has(file), `Runtime cycle: ${file}`);
  visiting.add(file);
  for (const next of graph.get(file) ?? []) visit(next);
  visiting.delete(file);
  visited.add(file);
}
for (const file of graph.keys()) visit(file);
for (const file of sources) {
  assert.ok(!file.endsWith('.css'), `Styles belong to applications: ${file}`);
  if (file.endsWith('.html'))
    assert.doesNotMatch(
      readFileSync(file, 'utf8'),
      /\sclass="|\[class\.(?:bg|text|border|rounded|p-|m-)/,
      `Library-owned visual classes: ${file}`,
    );
}
console.log(`Architecture verified across ${files.length} library source files.`);
