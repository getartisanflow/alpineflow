import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { fixDeclarationDirectory, rewriteDeclarationSpecifiers } from './fix-dts-extensions.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('rewriteDeclarationSpecifiers', () => {
  const file = '/pkg/dist/types/lib/core.d.ts';
  const existing = new Set([
    '/pkg/dist/types/src/index.d.ts',
    '/pkg/dist/types/src/core/types.d.ts',
    '/pkg/dist/types/src/schema/index.d.ts',
    '/pkg/dist/types/lib/index.d.ts',
  ]);
  const exists = (candidate: string): boolean => existing.has(candidate);
  const rewrite = (source: string) => rewriteDeclarationSpecifiers(source, file, exists);

  it('adds .js to a relative import of a declaration file', () => {
    const result = rewrite("export * from '../src/index';\nexport { default } from '../src/index';\n");

    expect(result.output).toBe("export * from '../src/index.js';\nexport { default } from '../src/index.js';\n");
    expect(result.rewritten).toBe(2);
    expect(result.unresolved).toEqual([]);
  });

  it('points a directory import at its index.js', () => {
    expect(rewrite("export * from '../src/schema';").output).toBe("export * from '../src/schema/index.js';");
    expect(rewrite("import './';").output).toBe("import './index.js';");
  });

  it('rewrites side-effect imports, import() types and module augmentations', () => {
    const source = [
      "import './index';",
      "import type { FlowNode } from '../src/core/types';",
      "export type Node = import('../src/core/types').FlowNode;",
      "declare module '../src/core/types' {",
      '    interface FlowNode { extra?: string }',
      '}',
    ].join('\n');

    const result = rewrite(source);

    expect(result.output).toContain("import './index.js';");
    expect(result.output).toContain("from '../src/core/types.js';");
    expect(result.output).toContain("import('../src/core/types.js')");
    expect(result.output).toContain("declare module '../src/core/types.js' {");
    expect(result.rewritten).toBe(4);
  });

  it('leaves package imports and specifiers that already carry an extension alone', () => {
    const source = [
      "import type { Alpine } from 'alpinejs';",
      "import 'd3-transition';",
      "export * from '../src/index.js';",
      "import messages from '../locales/en.json';",
    ].join('\n');

    const result = rewrite(source);

    expect(result.output).toBe(source);
    expect(result.rewritten).toBe(0);
    expect(result.unresolved).toEqual([]);
  });

  it('does not touch specifiers that only appear in comments', () => {
    const source = "/**\n * @example\n * import AlpineFlow from './missing';\n */\nexport * from '../src/index';\n";

    const result = rewrite(source);

    expect(result.output).toContain("import AlpineFlow from './missing';");
    expect(result.output).toContain("export * from '../src/index.js';");
    expect(result.unresolved).toEqual([]);
  });

  it('keeps the original quote style', () => {
    expect(rewrite('export * from "../src/index";').output).toBe('export * from "../src/index.js";');
  });

  it('reports relative specifiers that match no declaration', () => {
    const result = rewrite("export * from '../src/gone';");

    expect(result.output).toBe("export * from '../src/gone';");
    expect(result.unresolved).toEqual(['../src/gone']);
  });
});

/**
 * Type-checks a consumer project against the package's real declaration
 * output, imported by package name through the `exports` map, the way an
 * npm user resolves it.
 */
describe('published declarations resolve for a TypeScript consumer', () => {
  let workDir: string;
  let declarationDir: string;
  let consumerEntry: string;

  const consumerSource = `
import AlpineFlow, {
  registerMarker,
  getBezierPath,
  type FlowNode,
  type FlowEdge,
  type Viewport,
} from '@getartisanflow/alpineflow';
import AlpineFlowSchema, { schemaToJSON } from '@getartisanflow/alpineflow/schema';
import AlpineFlowWorkflow from '@getartisanflow/alpineflow/workflow';
import AlpineFlowWhiteboard from '@getartisanflow/alpineflow/whiteboard';
import AlpineFlowCollab from '@getartisanflow/alpineflow/collab';
import AlpineFlowDagre from '@getartisanflow/alpineflow/dagre';
import AlpineFlowForce from '@getartisanflow/alpineflow/force';
import AlpineFlowHierarchy from '@getartisanflow/alpineflow/hierarchy';
import AlpineFlowElk from '@getartisanflow/alpineflow/elk';

// Each plugin takes Alpine, so calling it bare is an error, unless the
// default export silently resolved to \`any\`, which leaves these unused.
// @ts-expect-error
AlpineFlow();
// @ts-expect-error
AlpineFlowSchema();
// @ts-expect-error
AlpineFlowWorkflow();
// @ts-expect-error
AlpineFlowWhiteboard();
// @ts-expect-error
AlpineFlowCollab();
// @ts-expect-error
AlpineFlowDagre();
// @ts-expect-error
AlpineFlowForce();
// @ts-expect-error
AlpineFlowHierarchy();
// @ts-expect-error
AlpineFlowElk();

void registerMarker;
void getBezierPath;
void schemaToJSON;

export type Check = [FlowNode, FlowEdge, Viewport];
`;

  const resolutionModes = {
    nodenext: { module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext },
    node16: { module: ts.ModuleKind.Node16, moduleResolution: ts.ModuleResolutionKind.Node16 },
    bundler: { module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler },
  };

  const typeCheck = (mode: keyof typeof resolutionModes, libraryCheck: boolean): string[] => {
    const program = ts.createProgram([consumerEntry], {
      ...resolutionModes[mode],
      target: ts.ScriptTarget.ES2022,
      lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
      strict: true,
      noEmit: true,
      types: [],
      skipLibCheck: !libraryCheck,
      // Alpine ships no type declarations of its own, so a library check
      // without @types/alpinejs reports TS7016 for every `from 'alpinejs'`.
      // That is an implicit-any diagnostic about Alpine, not about our files.
      ...(libraryCheck ? { noImplicitAny: false } : {}),
    });

    return ts.getPreEmitDiagnostics(program).map((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      const location = diagnostic.file ? `${path.relative(workDir, diagnostic.file.fileName)}: ` : '';
      return `${location}TS${diagnostic.code} ${message}`;
    });
  };

  beforeAll(() => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alpineflow-dts-'));

    // The package as npm ships it: package.json plus dist/types, with the
    // repo's node_modules standing in for its installed peer dependencies.
    const packageDir = path.join(workDir, 'package');
    declarationDir = path.join(packageDir, 'dist', 'types');
    fs.mkdirSync(packageDir, { recursive: true });
    fs.copyFileSync(path.join(repoRoot, 'package.json'), path.join(packageDir, 'package.json'));
    fs.symlinkSync(path.join(repoRoot, 'node_modules'), path.join(packageDir, 'node_modules'), 'dir');

    execFileSync(
      path.join(repoRoot, 'node_modules', '.bin', 'tsc'),
      ['-p', path.join(repoRoot, 'tsconfig.json'), '--declarationDir', declarationDir, '--outDir', declarationDir],
      { cwd: repoRoot, stdio: 'pipe' },
    );

    const consumerDir = path.join(workDir, 'consumer');
    fs.mkdirSync(path.join(consumerDir, 'node_modules', '@getartisanflow'), { recursive: true });
    fs.symlinkSync(packageDir, path.join(consumerDir, 'node_modules', '@getartisanflow', 'alpineflow'), 'dir');
    fs.writeFileSync(path.join(consumerDir, 'package.json'), JSON.stringify({ type: 'module' }));
    consumerEntry = path.join(consumerDir, 'index.ts');
    fs.writeFileSync(consumerEntry, consumerSource);
  }, 60_000);

  afterAll(() => {
    fs.rmSync(workDir, { recursive: true, force: true });
  });

  it('fails under nodenext before the rewrite (the bug this guards against)', () => {
    const diagnostics = typeCheck('nodenext', false);

    expect(diagnostics.some((diagnostic) => diagnostic.includes('TS2614'))).toBe(true);
  }, 60_000);

  it('rewrites every relative specifier in the emitted declarations', () => {
    const result = fixDeclarationDirectory(declarationDir);

    expect(result.unresolved).toEqual([]);
    expect(result.rewritten).toBeGreaterThan(0);
    expect(fs.readFileSync(path.join(declarationDir, 'lib', 'core.d.ts'), 'utf8'))
      .toBe("export { default } from '../src/index.js';\nexport * from '../src/index.js';\n");
  }, 60_000);

  it.each([
    ['nodenext', false],
    ['nodenext', true],
    ['node16', false],
    ['node16', true],
    ['bundler', false],
    ['bundler', true],
  ] as const)('type-checks cleanly under %s (library check: %s)', (mode, libraryCheck) => {
    expect(typeCheck(mode, libraryCheck)).toEqual([]);
  }, 60_000);
});
