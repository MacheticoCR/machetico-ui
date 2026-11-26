import { readFile, readdir } from 'node:fs/promises';
import { join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import {
  TSDocConfiguration,
  TSDocParser,
  TSDocTagDefinition,
  TSDocTagSyntaxKind,
} from '@microsoft/tsdoc';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const policy = JSON.parse(await readFile(join(root, 'tsdoc.json'), 'utf8'));
const configuration = new TSDocConfiguration();

for (const definition of policy.tagDefinitions) {
  configuration.addTagDefinition(
    new TSDocTagDefinition({
      tagName: definition.tagName,
      syntaxKind:
        definition.syntaxKind === 'modifier'
          ? TSDocTagSyntaxKind.ModifierTag
          : TSDocTagSyntaxKind.BlockTag,
      allowMultiple: definition.allowMultiple ?? false,
    }),
  );
}

const parser = new TSDocParser(configuration);
const failures = [];
let blocks = 0;
let files = 0;

async function inspect(directory) {
  const entries = await readdir(join(root, directory), { withFileTypes: true });

  for (const entry of entries) {
    const name = join(directory, entry.name);

    if (entry.isDirectory()) {
      await inspect(name);
      continue;
    }

    if (!/\.(ts|js)$/.test(name) || /\.(spec|test|d)\.ts$/.test(name)) continue;

    await inspectFile(name);
  }
}

async function inspectFile(name) {
  const source = await readFile(join(root, name), 'utf8');
  const file = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true);
  files++;

  function report(node, message) {
    const line = file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;
    failures.push(`${name}:${line}: ${message}`);
  }

  function visit(node) {
    const callable =
      (ts.isFunctionDeclaration(node) && !!node.name) ||
      ts.isMethodDeclaration(node) ||
      ts.isGetAccessor(node) ||
      ts.isSetAccessor(node) ||
      ts.isConstructorDeclaration(node);
    const property = ts.isPropertySignature(node) || ts.isPropertyDeclaration(node);
    const contract =
      ts.isInterfaceDeclaration(node) ||
      ts.isTypeAliasDeclaration(node) ||
      ts.isClassDeclaration(node);

    if ((callable || property || contract) && !node.jsDoc?.length) {
      report(node, 'Falta un bloque TSDoc multilínea para este contrato.');
    }

    for (const comment of node.jsDoc ?? []) {
      const text = comment.getText(file);
      blocks++;

      if (!text.includes('\n')) report(node, 'TSDoc no permite documentación de una sola línea.');
      if (/@returns?\s+(?:\{void\}|void|Promise<void>)(?:\s|$)/.test(text)) {
        report(node, 'Omití @returns cuando la operación no devuelve un valor.');
      }

      for (const message of parser.parseString(text).log.messages) {
        report(node, `${message.messageId}: ${message.unformattedText}`);
      }

      if (callable && !/@function\b/.test(text)) {
        report(node, 'La función requiere @function y una explicación de su responsabilidad.');
      }

      if (property && !/@property\b/.test(text)) {
        report(node, 'La propiedad requiere @property y una explicación de su significado.');
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(file);
}

const coverage = JSON.parse(await readFile(join(root, 'documentation.json'), 'utf8'));

for (const source of coverage.sourceRoots) {
  if (source.endsWith('.ts')) await inspectFile(source);
  else await inspect(source);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`TSDoc validado: ${blocks} bloques en ${files} archivos.`);
}
