// @ts-check
// ============================================================================
// fix-dts-extensions — make emitted declarations resolvable under node16/nodenext
//
// tsc emits `dist/types/` with `moduleResolution: "bundler"`, which leaves
// relative specifiers extensionless (`export * from '../src/index'`). The
// package is `"type": "module"`, so a consumer on `moduleResolution: "node16"`
// or `"nodenext"` treats those `.d.ts` files as ES modules and refuses
// extensionless relative imports — every named export fails to resolve.
//
// This rewrites each relative specifier to the `.js` path Node would load
// (`../src/index.js`, or `./dir/index.js` for a directory import). Bundler
// and node10 resolution accept the `.js` form too, so nothing changes for
// them. Only real module specifiers are touched (parsed with the TypeScript
// AST, so doc comments are left alone), and a specifier that matches no
// emitted declaration fails the build instead of shipping broken types.
//
// Usage: node scripts/fix-dts-extensions.mjs [dir]   (default: dist/types)
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const RELATIVE = /^\.\.?(\/|$)/;
const HAS_RUNTIME_EXTENSION = /\.(m|c)?js$|\.json$/;

/**
 * Collect the string-literal module specifiers in a declaration file:
 * import/export declarations (including side-effect imports), `import('…')`
 * types, `import x = require('…')` and `declare module '…'` augmentations.
 *
 * @param {ts.SourceFile} sourceFile
 * @returns {ts.StringLiteral[]}
 */
function collectSpecifiers(sourceFile) {
  /** @type {ts.StringLiteral[]} */
  const specifiers = [];

  /** @param {ts.Node} node */
  const visit = (node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node))
      && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      specifiers.push(node.moduleSpecifier);
    } else if (ts.isImportTypeNode(node)
      && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) {
      specifiers.push(node.argument.literal);
    } else if (ts.isModuleDeclaration(node) && ts.isStringLiteral(node.name)) {
      specifiers.push(node.name);
    } else if (ts.isExternalModuleReference(node) && ts.isStringLiteral(node.expression)) {
      specifiers.push(node.expression);
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return specifiers;
}

/**
 * Rewrite the relative specifiers of one declaration file.
 *
 * @param {string} source  The `.d.ts` file contents.
 * @param {string} filePath  Its path, used to resolve relative specifiers.
 * @param {(candidate: string) => boolean} [fileExists]
 * @returns {{ output: string, rewritten: number, unresolved: string[] }}
 */
export function rewriteDeclarationSpecifiers(source, filePath, fileExists = fs.existsSync) {
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const directory = path.dirname(filePath);
  /** @type {string[]} */
  const unresolved = [];
  /** @type {{ start: number, end: number, text: string }[]} */
  const edits = [];

  for (const literal of collectSpecifiers(sourceFile)) {
    const specifier = literal.text;
    if (!RELATIVE.test(specifier) || HAS_RUNTIME_EXTENSION.test(specifier)) {
      continue;
    }

    const target = path.resolve(directory, specifier);
    const trimmed = specifier.replace(/\/$/, '');
    let replacement = null;
    if (fileExists(`${target}.d.ts`)) {
      replacement = `${trimmed}.js`;
    } else if (fileExists(path.join(target, 'index.d.ts'))) {
      replacement = `${trimmed}/index.js`;
    }

    if (replacement === null) {
      unresolved.push(specifier);
      continue;
    }

    // Replace inside the quotes, keeping the original quote style.
    edits.push({ start: literal.getStart(sourceFile) + 1, end: literal.getEnd() - 1, text: replacement });
  }

  let output = source;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
  }

  return { output, rewritten: edits.length, unresolved };
}

/**
 * Rewrite every `.d.ts` file under a directory in place.
 *
 * @param {string} directory
 * @returns {{ files: number, rewritten: number, unresolved: string[] }}
 */
export function fixDeclarationDirectory(directory) {
  const files = fs.readdirSync(directory, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.d.ts'))
    .map((file) => path.join(directory, file));

  let rewritten = 0;
  /** @type {string[]} */
  const unresolved = [];

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const result = rewriteDeclarationSpecifiers(source, file);
    rewritten += result.rewritten;
    unresolved.push(...result.unresolved.map((specifier) => `${path.relative(directory, file)}: '${specifier}'`));
    if (result.output !== source) {
      fs.writeFileSync(file, result.output);
    }
  }

  return { files: files.length, rewritten, unresolved };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = path.resolve(process.argv[2] ?? 'dist/types');
  const { files, rewritten, unresolved } = fixDeclarationDirectory(directory);

  if (unresolved.length > 0) {
    console.error(`[fix-dts-extensions] ${unresolved.length} relative specifier(s) match no emitted declaration:`);
    for (const entry of unresolved) {
      console.error(`  ${entry}`);
    }
    process.exit(1);
  }

  console.log(`[fix-dts-extensions] ${rewritten} specifier(s) rewritten across ${files} declaration file(s)`);
}
