/// <reference types="vite/client" />
/**
 * REAL-BROWSER proof for the schema render hooks (class resolvers + decorators).
 *
 * The unit suite (`src/plugin/directives/flow-schema.test.ts`) injects a hand-built
 * `_config` onto the canvas scope via a window factory, because a JSON `x-data`
 * string can't carry function values. That verifies the directive's behaviour but
 * NOT the path a real consumer uses: `flowCanvas({ schemaRowClass, … })` persisting
 * the hooks onto `_config` for the directive to read. This file closes that hole —
 * real Alpine, real `flowCanvas()`, real `x-flow-schema` rows, real stylesheets —
 * so a regression in the config plumbing can't stay green.
 */
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import structuralCss from '../../css/structural.css?raw';
import themeCss from '../../css/theme-default.css?raw';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';

/** Inject the shipped stylesheets so schema rows get real geometry (see the parity test). */
function injectRealStylesheets(): void {
  if (document.getElementById('alpineflow-hooks-css')) return;
  const style = document.createElement('style');
  style.id = 'alpineflow-hooks-css';
  style.textContent = `${structuralCss}\n${themeCss}`;
  document.head.appendChild(style);
}

/** A viewport that renders each node through the `x-flow-schema` directive. */
function schemaTemplate(): HTMLElement {
  const viewport = document.createElement('div');
  viewport.setAttribute('x-flow-viewport', '');
  const template = document.createElement('template');
  template.setAttribute('x-for', 'node in nodes');
  template.setAttribute(':key', 'node.id');
  const node = document.createElement('div');
  node.setAttribute('x-flow-node', 'node');
  node.setAttribute('x-flow-schema', '');
  template.content.appendChild(node);
  viewport.appendChild(template);
  return viewport;
}

const nodes = [
  {
    id: 'user',
    position: { x: 0, y: 0 },
    data: {
      label: 'User',
      kind: 'entity',
      fields: [
        { name: 'id', type: 'uuid', key: 'primary' },
        { name: 'email', type: 'text', description: 'contact address', required: true },
      ],
    },
  },
];

describe('schema render hooks — real flowCanvas() path', () => {
  beforeAll(() => injectRealStylesheets());
  afterEach(() => unmountAll());

  it('resolves class resolvers + decorators off the real canvas config and applies them', async () => {
    const { canvas } = await mountCanvas(
      {
        nodes,
        edges: [],
        // Declarative styling — pure functions of the data.
        schemaRowClass: ({ field }: any) => (field.name === 'email' ? 'row-email' : null),
        schemaNodeClass: ({ node }: any) => `kind-${node.data.kind}`,
        // Imperative DOM — render a description the base row omits + a header badge.
        schemaRowDecorator: ({ row, field, slots }: any) => {
          if (!field.description) return;
          let d = row.querySelector('.row-desc');
          if (!d) {
            d = document.createElement('span');
            d.className = 'row-desc';
            slots.type.after(d);
          }
          d.textContent = field.description;
        },
        schemaNodeDecorator: ({ header, node }: any) => {
          let badge = header.querySelector('.field-count');
          if (!badge) {
            badge = document.createElement('span');
            badge.className = 'field-count';
            header.appendChild(badge);
          }
          badge.textContent = String(node.data.fields.length);
        },
      },
      schemaTemplate(),
    );
    await nextFrame(2);

    const host = canvas.querySelector('.flow-schema-node') as HTMLElement;
    expect(host).not.toBeNull();

    // schemaNodeClass → host
    expect(host.classList.contains('kind-entity')).toBe(true);
    // schemaNodeDecorator → header badge
    expect(host.querySelector('.flow-schema-header .field-count')?.textContent).toBe('2');

    const rows = Array.from(canvas.querySelectorAll('.flow-schema-row')) as HTMLElement[];
    expect(rows.length).toBe(2);
    const emailRow = rows.find(
      (r) => r.querySelector('.flow-schema-row-name')?.textContent === 'email',
    )!;
    expect(emailRow).toBeTruthy();
    // schemaRowClass → the email row only
    expect(emailRow.classList.contains('row-email')).toBe(true);
    const idRow = rows.find((r) => r.querySelector('.flow-schema-row-name')?.textContent === 'id')!;
    expect(idRow.classList.contains('row-email')).toBe(false);
    // schemaRowDecorator → description rendered after the type pill
    expect(emailRow.querySelector('.row-desc')?.textContent).toBe('contact address');
    // Structural class untouched by the resolver.
    expect(emailRow.classList.contains('flow-schema-row')).toBe(true);
  });

  it('reconciles a class the resolver stops returning after a data change', async () => {
    const { canvas, scope } = await mountCanvas(
      {
        nodes: [
          { id: 't', position: { x: 0, y: 0 }, data: { label: 'T', fields: [{ name: 'status', type: 'text' }] } },
        ],
        edges: [],
        schemaRowClass: ({ field }: any) => `type-${field.type}`,
      },
      schemaTemplate(),
    );
    await nextFrame(2);

    const row = canvas.querySelector('.flow-schema-row') as HTMLElement;
    expect(row.classList.contains('type-text')).toBe(true);

    scope.nodes[0].data.fields[0].type = 'enum';
    await nextFrame(2);

    expect(row.classList.contains('type-enum')).toBe(true);
    expect(row.classList.contains('type-text')).toBe(false); // stale class reconciled away
  });
});
