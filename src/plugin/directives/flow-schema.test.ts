// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowSchemaDirective } from './flow-schema';
import { registerFlowHandleDirective } from './flow-handle';
import { registerFlowNodeDirective } from './flow-node';

/**
 * Clear a DOM node without using innerHTML (XSS-safe pattern).
 */
function clearChildren(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

describe('x-flow-schema directive', () => {
  beforeEach(() => {
    // flow-schema stamps x-flow-handle attributes onto each row; in production
    // both directives are always registered together.
    registerFlowHandleDirective(Alpine);
    registerFlowSchemaDirective(Alpine);
  });

  /**
   * Mount a minimal scope that exposes `node` with data.label and data.fields.
   * Doesn't require the full flowCanvas scope — the directive only reads
   * node.data from its bound element's parent.
   */
  function mount(data: { label: string; fields: Array<Record<string, unknown>>; kind?: string }) {
    clearChildren(document.body);
    const host = document.createElement('div');
    host.setAttribute('x-data', `{ node: { id: 't', data: ${JSON.stringify(data)} } }`);
    const target = document.createElement('div');
    target.setAttribute('x-flow-schema', '');
    target.className = 'flow-node';
    target.setAttribute('data-flow-node-id', 't');
    host.appendChild(target);
    document.body.appendChild(host);
    Alpine.initTree(host);
    return target;
  }

  it('renders a header with the node label', () => {
    const el = mount({ label: 'User', fields: [] });
    const header = el.querySelector('.flow-schema-header');
    expect(header).not.toBeNull();
    expect(header?.textContent).toContain('User');
  });

  it('renders one .flow-schema-row per field', () => {
    const el = mount({
      label: 'User',
      fields: [
        { name: 'id', type: 'uuid' },
        { name: 'email', type: 'text' },
        { name: 'team_id', type: 'uuid' },
      ],
    });
    expect(el.querySelectorAll('.flow-schema-row').length).toBe(3);
  });

  it('each row renders real target+source handles plus opposite-side mirrors', () => {
    const el = mount({
      label: 'User',
      fields: [{ name: 'id', type: 'uuid' }],
    });
    const row = el.querySelector('.flow-schema-row')!;
    // Count handles — should be 4: target-left (real), source-right (real),
    // target-right (mirror), source-left (mirror).
    const allHandles = row.querySelectorAll('[data-flow-handle-id]');
    expect(allHandles.length).toBe(4);

    // Real primary handles keep their positions
    const realTarget = row.querySelector('.flow-schema-handle--target:not(.flow-schema-handle--mirror)');
    const realSource = row.querySelector('.flow-schema-handle--source:not(.flow-schema-handle--mirror)');
    expect(realTarget?.getAttribute('data-flow-handle-position')).toBe('left');
    expect(realSource?.getAttribute('data-flow-handle-position')).toBe('right');
    expect(realTarget?.getAttribute('data-flow-handle-id')).toBe('id');
    expect(realSource?.getAttribute('data-flow-handle-id')).toBe('id');

    // Mirrors are on the opposite sides with matching ids
    const mirrorTarget = row.querySelector('.flow-schema-handle--target.flow-schema-handle--mirror');
    const mirrorSource = row.querySelector('.flow-schema-handle--source.flow-schema-handle--mirror');
    expect(mirrorTarget?.getAttribute('data-flow-handle-position')).toBe('right');
    expect(mirrorTarget?.getAttribute('data-flow-handle-id')).toBe('id');
    expect(mirrorSource?.getAttribute('data-flow-handle-position')).toBe('left');
    expect(mirrorSource?.getAttribute('data-flow-handle-id')).toBe('id');
  });

  it('renders the field name and type pill per row', () => {
    const el = mount({
      label: 'User',
      fields: [{ name: 'email', type: 'text' }],
    });
    const row = el.querySelector('.flow-schema-row')!;
    expect(row.querySelector('.flow-schema-row-name')?.textContent).toBe('email');
    expect(row.querySelector('.flow-schema-row-type')?.textContent).toBe('text');
  });

  it('adds --pk class for key:primary fields', () => {
    const el = mount({
      label: 'User',
      fields: [{ name: 'id', type: 'uuid', key: 'primary' }],
    });
    expect(el.querySelector('.flow-schema-row')?.classList.contains('flow-schema-row--pk')).toBe(true);
  });

  it('adds --fk class for key:foreign fields', () => {
    const el = mount({
      label: 'User',
      fields: [{ name: 'team_id', type: 'uuid', key: 'foreign' }],
    });
    expect(el.querySelector('.flow-schema-row')?.classList.contains('flow-schema-row--fk')).toBe(true);
  });

  it('adds --required class for required fields', () => {
    const el = mount({
      label: 'User',
      fields: [{ name: 'email', type: 'text', required: true }],
    });
    expect(el.querySelector('.flow-schema-row')?.classList.contains('flow-schema-row--required')).toBe(true);
  });

  it('renders an icon prefix when field.icon is set', () => {
    const el = mount({
      label: 'User',
      fields: [{ name: 'email', type: 'text', icon: '✉️' }],
    });
    expect(el.querySelector('.flow-schema-row-icon')?.textContent).toBe('✉️');
  });

  it('stamps x-flow-row-select on each row with the nodeId.fieldName convention', () => {
    const el = mount({
      label: 'User',
      fields: [
        { name: 'id', type: 'uuid' },
        { name: 'email', type: 'text' },
      ],
    });
    const rows = Array.from(el.querySelectorAll('.flow-schema-row'));
    expect(rows).toHaveLength(2);
    expect(rows[0].getAttribute('x-flow-row-select')).toBe(JSON.stringify('t.id'));
    expect(rows[1].getAttribute('x-flow-row-select')).toBe(JSON.stringify('t.email'));
  });

  it('re-renders when node.data.fields mutates reactively', async () => {
    clearChildren(document.body);
    const host = document.createElement('div');
    host.setAttribute(
      'x-data',
      `{ node: { id: 't', data: { label: 'User', fields: [{ name: 'id', type: 'uuid' }] } } }`,
    );
    const target = document.createElement('div');
    target.setAttribute('x-flow-schema', '');
    target.setAttribute('data-flow-node-id', 't');
    host.appendChild(target);
    document.body.appendChild(host);
    Alpine.initTree(host);

    expect(target.querySelectorAll('.flow-schema-row').length).toBe(1);

    const scope = (Alpine as any).$data(host);
    scope.node.data.fields.push({ name: 'email', type: 'text' });
    await new Promise((r) => setTimeout(r, 20));

    expect(target.querySelectorAll('.flow-schema-row').length).toBe(2);
  });

  // Issue #21 — the directive's reactive effect must not raise an Alpine
  // expression error when the `node` scope is absent (mounted without one) or
  // torn down (Livewire morph detaches the element before the effect re-runs).
  // Alpine.handleError console.warns "Alpine Expression Error: ..." synchronously
  // before its async re-throw, so we assert that sentinel is never emitted.
  const alpineExprErrors = (spy: ReturnType<typeof vi.spyOn>) =>
    spy.mock.calls.filter((c) => String(c[0]).includes('Alpine Expression Error'));

  it('raises no Alpine expression error when node is missing (issue #21, mode A)', async () => {
    clearChildren(document.body);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const host = document.createElement('div');
    host.setAttribute('x-data', `{}`); // no `node` in scope
    const target = document.createElement('div');
    target.setAttribute('x-flow-schema', '');
    host.appendChild(target);
    document.body.appendChild(host);
    Alpine.initTree(host);
    // The effect runs asynchronously, so flush before asserting.
    await new Promise((r) => setTimeout(r, 20));

    expect(alpineExprErrors(warnSpy)).toEqual([]);
    expect(target.querySelector('.flow-schema-header')).toBeNull();
    warnSpy.mockRestore();
  });

  it('raises no Alpine expression error when the element is detached before a reactive update (issue #21, mode B)', async () => {
    clearChildren(document.body);
    const host = document.createElement('div');
    host.setAttribute(
      'x-data',
      `{ node: { id: 't', data: { label: 'User', fields: [{ name: 'id', type: 'uuid' }] } } }`,
    );
    const target = document.createElement('div');
    target.setAttribute('x-flow-schema', '');
    target.setAttribute('data-flow-node-id', 't');
    host.appendChild(target);
    document.body.appendChild(host);
    Alpine.initTree(host);
    expect(target.querySelectorAll('.flow-schema-row').length).toBe(1);

    const scope = (Alpine as any).$data(host);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Simulate a Livewire morph removing the node subtree, then mutating the
    // watched data before Alpine tears the effect down. The isConnected guard
    // must bail: no expression error, no new row rendered on the dead element.
    host.remove();
    scope.node.data.fields.push({ name: 'email', type: 'text' });
    await new Promise((r) => setTimeout(r, 20));

    expect(alpineExprErrors(warnSpy)).toEqual([]);
    expect(target.querySelectorAll('.flow-schema-row').length).toBe(1);
    warnSpy.mockRestore();
  });

  it('silently no-ops when node or node.data is missing', () => {
    clearChildren(document.body);
    const host = document.createElement('div');
    host.setAttribute('x-data', `{}`);
    const target = document.createElement('div');
    target.setAttribute('x-flow-schema', '');
    host.appendChild(target);
    document.body.appendChild(host);
    expect(() => Alpine.initTree(host)).not.toThrow();
    expect(target.querySelector('.flow-schema-header')).toBeNull();
  });

  it('stamps data-flow-schema-kind on the host when node.data.kind is set', () => {
    const el = mount({ label: 'User', kind: 'entity', fields: [{ name: 'id', type: 'uuid', key: 'primary' }] });
    expect(el.getAttribute('data-flow-schema-kind')).toBe('entity');
  });

  it('omits data-flow-schema-kind when node.data.kind is absent', () => {
    const el = mount({ label: 'User', fields: [] });
    expect(el.hasAttribute('data-flow-schema-kind')).toBe(false);
  });

  it('clears data-flow-schema-kind when node.data.kind is set to empty string', () => {
    const el = mount({ label: 'User', kind: '', fields: [] });
    expect(el.hasAttribute('data-flow-schema-kind')).toBe(false);
  });

  // ── Task 13: keyed row reconciliation ──────────────────────────────────────
  // Reconcile rows keyed by field.name instead of tearing down + re-stamping
  // every row on any tracked change.

  function mountReactive(data: { label: string; fields: Array<Record<string, unknown>>; kind?: string }) {
    clearChildren(document.body);
    const host = document.createElement('div');
    host.setAttribute('x-data', `{ node: { id: 't', data: ${JSON.stringify(data)} } }`);
    const target = document.createElement('div');
    target.setAttribute('x-flow-schema', '');
    target.className = 'flow-node';
    target.setAttribute('data-flow-node-id', 't');
    host.appendChild(target);
    document.body.appendChild(host);
    Alpine.initTree(host);
    const scope = (Alpine as any).$data(host);
    return { target, scope };
  }
  const nextFlush = () => new Promise((r) => setTimeout(r, 20));

  it('changing one field type keeps the other row elements identical', async () => {
    const { target, scope } = mountReactive({
      label: 'User',
      fields: [
        { name: 'id', type: 'uuid' },
        { name: 'email', type: 'text' },
        { name: 'name', type: 'text' },
      ],
    });
    const rows = () => Array.from(target.querySelectorAll('.flow-schema-row'));
    const before = rows();
    scope.node.data.fields[1].type = 'string';
    await nextFlush();
    const after = rows();
    expect(after[0]).toBe(before[0]);
    expect(after[2]).toBe(before[2]);
    // The changed row keeps identity too, and its type text updates in place.
    expect(after[1]).toBe(before[1]);
    expect(after[1].querySelector('.flow-schema-row-type')?.textContent).toBe('string');
  });

  it('adding a field appends exactly one new row, keeping existing rows', async () => {
    const { target, scope } = mountReactive({
      label: 'User',
      fields: [
        { name: 'id', type: 'uuid' },
        { name: 'email', type: 'text' },
        { name: 'name', type: 'text' },
      ],
    });
    const before = Array.from(target.querySelectorAll('.flow-schema-row'));
    scope.node.data.fields.push({ name: 'created_at', type: 'timestamp' });
    await nextFlush();
    const after = Array.from(target.querySelectorAll('.flow-schema-row')) as HTMLElement[];
    expect(after.length).toBe(before.length + 1);
    before.forEach((el, i) => expect(after[i]).toBe(el));
    expect(after[3].dataset.flowSchemaField).toBe('created_at');
    // The new row is wired: its handles were initialized via Alpine.initTree.
    expect(after[3].querySelectorAll('[data-flow-handle-id]').length).toBe(4);
  });

  it('label change updates header text without touching rows', async () => {
    const { target, scope } = mountReactive({
      label: 'User',
      fields: [{ name: 'id', type: 'uuid' }],
    });
    const row0 = target.querySelector('.flow-schema-row');
    scope.node.data.label = 'Users (renamed)';
    await nextFlush();
    expect(target.querySelector('.flow-schema-header')!.textContent).toBe('Users (renamed)');
    expect(target.querySelector('.flow-schema-row')).toBe(row0);
  });

  it('removing a field drops exactly that row, keeping the rest in order', async () => {
    const { target, scope } = mountReactive({
      label: 'User',
      fields: [
        { name: 'id', type: 'uuid' },
        { name: 'email', type: 'text' },
        { name: 'name', type: 'text' },
      ],
    });
    const before = Array.from(target.querySelectorAll('.flow-schema-row')) as HTMLElement[];
    const idRow = before[0];
    const nameRow = before[2];
    scope.node.data.fields.splice(1, 1); // remove email
    await nextFlush();
    const after = Array.from(target.querySelectorAll('.flow-schema-row')) as HTMLElement[];
    expect(after.map((r) => r.dataset.flowSchemaField)).toEqual(['id', 'name']);
    expect(after[0]).toBe(idRow);
    expect(after[1]).toBe(nameRow);
  });

  it('reorders existing rows to match a new field order without re-creating them', async () => {
    const { target, scope } = mountReactive({
      label: 'User',
      fields: [
        { name: 'id', type: 'uuid' },
        { name: 'email', type: 'text' },
        { name: 'name', type: 'text' },
      ],
    });
    const before = Array.from(target.querySelectorAll('.flow-schema-row')) as HTMLElement[];
    // Reverse the field order in place.
    scope.node.data.fields.reverse();
    await nextFlush();
    const after = Array.from(target.querySelectorAll('.flow-schema-row')) as HTMLElement[];
    expect(after.map((r) => r.dataset.flowSchemaField)).toEqual(['name', 'email', 'id']);
    // Same three element objects, just reordered (reference identity, not a rebuild).
    expect(after).toHaveLength(before.length);
    after.forEach((r) => expect(before).toContain(r));
  });

  it('destroys tracked row scopes when node data goes away (no orphaned scopes)', async () => {
    const { target, scope } = mountReactive({
      label: 'User',
      fields: [{ name: 'id', type: 'uuid' }],
    });
    const row = target.querySelector('.flow-schema-row') as HTMLElement;
    const destroySpy = vi.spyOn(Alpine, 'destroyTree');
    // The node loses its data (e.g. reactive clear). The rows must be torn down,
    // not merely detached — a detached-but-alive row keeps its handle/row-select
    // directives subscribed to reactive state forever.
    scope.node.data = null;
    await nextFlush();
    expect(destroySpy).toHaveBeenCalledWith(row);
    expect(target.querySelectorAll('.flow-schema-row').length).toBe(0);
    expect(target.querySelector('.flow-schema-header')).toBeNull();
    destroySpy.mockRestore();
  });

  // ── Task G1: schema metrics cache ───────────────────────────────────────
  // Field row `i`'s handle centers are a deterministic offset of the node.
  // The canvas needs this geometry measured ONCE, from the first schema node
  // that renders, so later edge-geometry work can derive endpoints from
  // state instead of measuring handle DOM per edge.

  describe('schema metrics cache (Task G1)', () => {
    const NODE_WIDTH = 200;
    const BORDER = 1;
    const HEADER_HEIGHT = 30;
    const ROW_HEIGHT = 24;
    const HANDLE_SIZE = 10;

    const EXPECTED_METRICS = {
      headerHeight: HEADER_HEIGHT,
      rowHeight: ROW_HEIGHT,
      insetLeft: BORDER,
      insetRight: BORDER,
      insetTop: BORDER,
      insetBottom: BORDER,
      handleWidth: HANDLE_SIZE,
      handleHeight: HANDLE_SIZE,
    };

    let restoreRect: (() => void) | null = null;

    function fakeRect(left: number, top: number, width: number, height: number): DOMRect {
      return {
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
        x: left,
        y: top,
        toJSON: () => {},
      } as DOMRect;
    }

    /**
     * Stub `getBoundingClientRect` to emulate a realistic schema-node layout:
     * a node border-box at (0,0), 200px wide, with a 1px border, a 30px header,
     * uniform 24px rows, and 10x10 handles centered on each row's left/right
     * edge. jsdom has no layout engine, so this is the only way to exercise the
     * measurement path in a unit test. Follows the `getBoundingClientRect`
     * stubbing pattern used by flow-easy-connect.test.ts /
     * flow-handle-keyboard.test.ts.
     *
     * The NODE border box is keyed on `data-flow-node-id`, not on the
     * `.flow-schema-node` class — those are the same element under directive
     * markup (`x-flow-node` + `x-flow-schema`), but under WireFlow's SLOT markup
     * the schema host is a CHILD of the node element and fills its content box.
     * Metrics insets are consumed against `node.position`/`node.dimensions`
     * (the node border box), so both shapes must measure identically.
     */
    function stubSchemaLayout(rowCount: number): void {
      const original = HTMLElement.prototype.getBoundingClientRect;
      restoreRect = () => {
        HTMLElement.prototype.getBoundingClientRect = original;
      };
      HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement): DOMRect {
        if (this.hasAttribute('data-flow-node-id')) {
          const height = BORDER * 2 + HEADER_HEIGHT + ROW_HEIGHT * rowCount;
          return fakeRect(0, 0, NODE_WIDTH, height);
        }
        // Only reached in slot markup: the schema host is a block child filling
        // the node's content box (inside the border).
        if (this.classList.contains('flow-schema-node')) {
          return fakeRect(BORDER, BORDER, NODE_WIDTH - BORDER * 2, HEADER_HEIGHT + ROW_HEIGHT * rowCount);
        }
        if (this.classList.contains('flow-schema-header')) {
          return fakeRect(BORDER, BORDER, NODE_WIDTH - BORDER * 2, HEADER_HEIGHT);
        }
        if (this.classList.contains('flow-schema-body')) {
          const rows = this.children.length;
          return fakeRect(BORDER, BORDER + HEADER_HEIGHT, NODE_WIDTH - BORDER * 2, ROW_HEIGHT * rows);
        }
        if (this.classList.contains('flow-schema-row')) {
          const siblings = Array.from(this.parentElement?.children ?? []);
          const index = siblings.indexOf(this);
          const top = BORDER + HEADER_HEIGHT + index * ROW_HEIGHT;
          return fakeRect(BORDER, top, NODE_WIDTH - BORDER * 2, ROW_HEIGHT);
        }
        if (this.classList.contains('flow-schema-handle')) {
          return fakeRect(0, 0, HANDLE_SIZE, HANDLE_SIZE);
        }
        return fakeRect(0, 0, 0, 0);
      } as unknown as typeof HTMLElement.prototype.getBoundingClientRect;
    }

    afterEach(() => {
      restoreRect?.();
      restoreRect = null;
    });

    /**
     * Mount a schema node inside a `.flow-container` scope carrying
     * `_schemaMetrics` + `viewport`, mirroring the harness used by
     * `keyboard-nav.test.ts` for `_config` resolution — the schema
     * directive resolves the canvas the same way for both.
     */
    function mountWithCanvas(
      data: { label: string; fields: Array<Record<string, unknown>> },
      zoom = 1,
    ) {
      clearChildren(document.body);
      const container = document.createElement('div');
      container.classList.add('flow-container');
      container.setAttribute(
        'x-data',
        `{ _schemaMetrics: null, viewport: { zoom: ${zoom} }, node: { id: 't', data: ${JSON.stringify(data)} } }`,
      );
      const target = document.createElement('div');
      target.setAttribute('x-flow-schema', '');
      target.className = 'flow-node';
      target.setAttribute('data-flow-node-id', 't');
      container.appendChild(target);
      document.body.appendChild(container);
      Alpine.initTree(container);
      return { target, canvas: (Alpine as any).$data(container) };
    }

    /**
     * WireFlow's SLOT markup: `x-flow-schema` sits on a CHILD of the `.flow-node`
     * element (see wireflow's `components/schema-node.blade.php`, and the
     * `.flow-node:has(> .flow-schema-node)` rule in css/structural.css), not on
     * the node element itself.
     */
    function mountSlotMarkup(data: { label: string; fields: Array<Record<string, unknown>> }) {
      clearChildren(document.body);
      const container = document.createElement('div');
      container.classList.add('flow-container');
      container.setAttribute(
        'x-data',
        `{ _schemaMetrics: null, viewport: { zoom: 1 }, node: { id: 't', data: ${JSON.stringify(data)} } }`,
      );
      const nodeEl = document.createElement('div');
      nodeEl.className = 'flow-node';
      nodeEl.setAttribute('data-flow-node-id', 't');
      const target = document.createElement('div');
      target.setAttribute('x-flow-schema', '');
      nodeEl.appendChild(target);
      container.appendChild(nodeEl);
      document.body.appendChild(container);
      Alpine.initTree(container);
      return { nodeEl, target, canvas: (Alpine as any).$data(container) };
    }

    it('measures header/row/handle metrics once, from the first schema node render', async () => {
      stubSchemaLayout(1);
      const { canvas } = mountWithCanvas({
        label: 'User',
        fields: [{ name: 'id', type: 'uuid' }],
      });
      // Measurement is deferred one tick past the render that triggers it
      // (see the reactivity-safety test below for why): the guard read, the
      // zoom read, and the `_schemaMetrics` write all run outside the
      // directive's effect, via `Alpine.nextTick`.
      await nextFlush();
      expect(canvas._schemaMetrics).toEqual(EXPECTED_METRICS);
    });

    it('stamps data-flow-schema-node on the node element under real x-flow-node markup', async () => {
      // Edge code's schema fast path is gated on this attribute (it is how a node
      // whose rows THIS directive laid out is told apart from a hand-rolled node
      // carrying the same `data.fields`). The stamp resolves the node element via
      // `closest('[data-flow-node-id]')` — and that attribute is written by
      // `x-flow-node`'s own effect, not by the markup. So the whole fast path silently
      // becomes a no-op if `x-flow-schema` were ever to initialize FIRST. Nothing else
      // in the suite mounts the two directives together, so pin the ordering here.
      registerFlowNodeDirective(Alpine);
      stubSchemaLayout(1);

      clearChildren(document.body);
      const container = document.createElement('div');
      container.className = 'flow-container';
      container.setAttribute('data-flow-canvas', '');
      const node = { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'User', fields: [{ name: 'id', type: 'uuid' }] } };
      (window as any).__schemaStampCanvas = () => ({
        viewport: { x: 0, y: 0, zoom: 1 },
        _schemaMetrics: null,
        _config: {},
        _nodeMap: new Map(),
        _nodeElements: new Map(),
        selectedNodes: new Set(),
        nodes: [node],
        getNode(id: string) {
          return this.nodes.find((n: { id: string }) => n.id === id);
        },
      });
      container.setAttribute('x-data', '__schemaStampCanvas()');

      const nodeEl = document.createElement('div');
      nodeEl.className = 'flow-node';
      nodeEl.setAttribute('x-flow-node', 'nodes[0]');
      nodeEl.setAttribute('x-flow-schema', '');
      nodeEl.setAttribute('x-data', '{ node: nodes[0] }');
      container.appendChild(nodeEl);
      document.body.appendChild(container);
      Alpine.initTree(container);

      // x-flow-node stamps the id; x-flow-schema must run after it and find it.
      expect(nodeEl.getAttribute('data-flow-node-id')).toBe('n1');
      expect(nodeEl.hasAttribute('data-flow-schema-node')).toBe(true);

      // And it is removed when the directive tears down.
      Alpine.destroyTree(container);
      expect(nodeEl.hasAttribute('data-flow-schema-node')).toBe(false);
    });

    it('still stamps data-flow-schema-node when x-flow-schema is declared BEFORE x-flow-node on the same element', async () => {
      // Same-element markup (`<div x-flow-node x-flow-schema>`) is a documented
      // pattern, but the stamp resolves the node element via
      // `closest('[data-flow-node-id]')`, and that attribute is written by
      // `x-flow-node`'s OWN init-time effect — not by the markup. Custom
      // directives on one element run in attribute-declaration order, so if a
      // consumer reverses the order (`x-flow-schema` before `x-flow-node`),
      // `x-flow-schema` resolves BEFORE `x-flow-node`'s effect has stamped
      // `data-flow-node-id`, and a purely-synchronous `closest()` lookup would
      // find nothing — the fast path silently degrades forever, with zero
      // signal. This must still stamp, one tick later.
      registerFlowNodeDirective(Alpine);
      stubSchemaLayout(1);

      clearChildren(document.body);
      const container = document.createElement('div');
      container.className = 'flow-container';
      container.setAttribute('data-flow-canvas', '');
      const node = { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'User', fields: [{ name: 'id', type: 'uuid' }] } };
      (window as any).__schemaStampCanvasReversed = () => ({
        viewport: { x: 0, y: 0, zoom: 1 },
        _schemaMetrics: null,
        _config: {},
        _nodeMap: new Map(),
        _nodeElements: new Map(),
        selectedNodes: new Set(),
        nodes: [node],
        getNode(id: string) {
          return this.nodes.find((n: { id: string }) => n.id === id);
        },
      });
      container.setAttribute('x-data', '__schemaStampCanvasReversed()');

      const nodeEl = document.createElement('div');
      nodeEl.className = 'flow-node';
      // Reversed order relative to the test above: x-flow-schema FIRST.
      nodeEl.setAttribute('x-flow-schema', '');
      nodeEl.setAttribute('x-flow-node', 'nodes[0]');
      nodeEl.setAttribute('x-data', '{ node: nodes[0] }');
      container.appendChild(nodeEl);
      document.body.appendChild(container);
      Alpine.initTree(container);

      // x-flow-node still stamps its own id synchronously (its init-time effect
      // doesn't depend on x-flow-schema), regardless of declaration order.
      expect(nodeEl.getAttribute('data-flow-node-id')).toBe('n1');

      await nextFlush();
      expect(nodeEl.hasAttribute('data-flow-schema-node')).toBe(true);

      // And it is still removed when the directive tears down.
      Alpine.destroyTree(container);
      expect(nodeEl.hasAttribute('data-flow-schema-node')).toBe(false);
    });

    it('anchors the insets to the .flow-node border box under WireFlow slot markup', async () => {
      // The insets are documented — and consumed by edge code — as offsets from the
      // NODE border box, because they get added to `node.position` / `node.dimensions`,
      // which describe the `.flow-node` element. Measuring them from the `x-flow-schema`
      // HOST is only equivalent under directive markup, where host === node element.
      // Under slot markup the host sits one border-width inside the node, so a
      // host-anchored measurement yields insetLeft/Right/Top = 0 and shifts every
      // state-derived endpoint by the node's border. Same node, same layout ⇒ the
      // metrics must be byte-identical to the directive-markup case.
      stubSchemaLayout(1);
      const { target, nodeEl, canvas } = mountSlotMarkup({
        label: 'User',
        fields: [{ name: 'id', type: 'uuid' }],
      });
      // Precondition: the directive really did bind to a CHILD of the node element.
      expect(target).not.toBe(nodeEl);
      expect(target.parentElement).toBe(nodeEl);

      await nextFlush();
      expect(canvas._schemaMetrics).toEqual(EXPECTED_METRICS);
    });

    it('leaves _schemaMetrics null when the row has zero height (no layout / jsdom default)', async () => {
      // No stubSchemaLayout() call — jsdom's default getBoundingClientRect
      // returns an all-zero rect, so rowHeight is 0 and caching must bail
      // rather than poison every later edge with zeros.
      const { canvas } = mountWithCanvas({
        label: 'User',
        fields: [{ name: 'id', type: 'uuid' }],
      });
      await nextFlush();
      expect(canvas._schemaMetrics).toBeNull();
    });

    it('re-measures on the next render after the cache is nulled (colorMode-change invalidation)', async () => {
      stubSchemaLayout(1);
      const { canvas } = mountWithCanvas({
        label: 'User',
        fields: [{ name: 'id', type: 'uuid' }],
      });
      await nextFlush();
      expect(canvas._schemaMetrics).toEqual(EXPECTED_METRICS);

      // Simulate the theme/colorMode-change invalidation hook — mirrors the
      // `_bgGapCache` contract (see flow-canvas.ts canvas init).
      canvas._schemaMetrics = null;

      // Force a reactive re-render.
      canvas.node.data.label = 'Users';
      await new Promise((r) => setTimeout(r, 20));

      expect(canvas._schemaMetrics).toEqual(EXPECTED_METRICS);
    });

    // ── Reactivity-safety regression ──────────────────────────────────────
    // `canvas` is Alpine's merge-scope proxy (`Alpine.$data(el)`), and
    // `Alpine.raw()` does NOT unwrap that proxy — it returns the same proxy
    // back (flow-canvas.ts:515-517). A property GET/SET through
    // `Alpine.raw(canvas)` still tracks/triggers the underlying reactive
    // object when it runs inside an active Alpine effect (flow-edge.ts:
    // 1134-1136, flow-edge.test.ts:126-132 document the same hazard for
    // `_obstacleSnapshot`). If `measureSchemaMetrics` ran its guard read,
    // zoom read, or write synchronously inside the directive's `effect()`,
    // every mounted schema node's render effect would subscribe to
    // `_schemaMetrics`, and ANY write to it — including an unrelated node's
    // first successful measurement, or a colorMode invalidation — would
    // re-run every one of them. These tests mount TWO schema nodes on one
    // canvas and assert that doesn't happen.

    /**
     * Mount TWO schema nodes as siblings under one shared `.flow-container`.
     * Each node's `node` scope lives on its own wrapper element — mirroring
     * how a real canvas nests one Alpine scope per `x-flow-node`, distinct
     * from the canvas root that owns `_schemaMetrics` / `viewport` — so that
     * mutating one node's data can never be conflated with the other's scope.
     */
    function mountTwoSchemaNodes(
      fieldsA: Array<Record<string, unknown>>,
      fieldsB: Array<Record<string, unknown>>,
    ) {
      clearChildren(document.body);
      const container = document.createElement('div');
      container.classList.add('flow-container');
      container.setAttribute('x-data', `{ _schemaMetrics: null, viewport: { zoom: 1 } }`);

      const wrapperA = document.createElement('div');
      wrapperA.setAttribute(
        'x-data',
        `{ node: { id: 'a', data: { label: 'A', kind: 'entity', fields: ${JSON.stringify(fieldsA)} } } }`,
      );
      const targetA = document.createElement('div');
      targetA.setAttribute('x-flow-schema', '');
      targetA.className = 'flow-node';
      targetA.setAttribute('data-flow-node-id', 'a');
      wrapperA.appendChild(targetA);
      container.appendChild(wrapperA);

      const wrapperB = document.createElement('div');
      wrapperB.setAttribute(
        'x-data',
        `{ node: { id: 'b', data: { label: 'B', kind: 'entity', fields: ${JSON.stringify(fieldsB)} } } }`,
      );
      const targetB = document.createElement('div');
      targetB.setAttribute('x-flow-schema', '');
      targetB.className = 'flow-node';
      targetB.setAttribute('data-flow-node-id', 'b');
      wrapperB.appendChild(targetB);
      container.appendChild(wrapperB);

      document.body.appendChild(container);
      Alpine.initTree(container);

      return {
        canvas: (Alpine as any).$data(container),
        targetA,
        targetB,
        scopeA: (Alpine as any).$data(wrapperA),
      };
    }

    /**
     * Count `data-flow-schema-kind` attribute writes on a schema node's host.
     * `render()` unconditionally calls `setAttribute` on every render when
     * `node.data.kind` is set — regardless of whether the value actually
     * changed — so, mirroring the `d`-attribute effect-run counter in
     * flow-edge.test.ts, this counts render-effect re-runs.
     */
    function observeAttr(el: Element, attr: string) {
      let n = 0;
      const obs = new MutationObserver((records) => {
        for (const r of records) if (r.attributeName === attr) n++;
      });
      obs.observe(el, { attributes: true, attributeFilter: [attr] });
      return {
        count(): number {
          for (const r of obs.takeRecords()) if (r.attributeName === attr) n++;
          return n;
        },
        disconnect(): void {
          obs.disconnect();
        },
      };
    }

    it("a metrics write from one schema node's measurement does not re-run another node's render effect", async () => {
      // Both nodes render for the first time with NO layout stub, so their
      // measurement attempt bails on a zero-height row and `_schemaMetrics`
      // stays null. In the unfixed code, the guard read still happens
      // synchronously inside each node's render effect, subscribing BOTH
      // nodes to `_schemaMetrics` even though neither measurement succeeds.
      const { canvas, targetA, targetB, scopeA } = mountTwoSchemaNodes(
        [{ name: 'id', type: 'uuid' }],
        [{ name: 'id', type: 'uuid' }],
      );
      await nextFlush();
      expect(canvas._schemaMetrics).toBeNull();

      // A real layout becomes available.
      stubSchemaLayout(1);

      const countsA = observeAttr(targetA, 'data-flow-schema-kind');
      const countsB = observeAttr(targetB, 'data-flow-schema-kind');

      // Re-render ONLY node A (its own label changes). This is the render
      // whose measurement succeeds and WRITES `_schemaMetrics`.
      scopeA.node.data.label = 'A renamed';
      await nextFlush();

      expect(canvas._schemaMetrics).toEqual(EXPECTED_METRICS);
      expect(countsA.count()).toBeGreaterThan(0); // A legitimately re-rendered
      expect(countsB.count()).toBe(0); // B must NOT re-render just because A wrote the cache
      countsA.disconnect();
      countsB.disconnect();
    });

    it('invalidating _schemaMetrics does not re-run unrelated schema nodes\' render effects', async () => {
      const { canvas, targetA, targetB, scopeA } = mountTwoSchemaNodes(
        [{ name: 'id', type: 'uuid' }],
        [{ name: 'id', type: 'uuid' }],
      );
      stubSchemaLayout(1);
      // Let node A actually measure first, so `_schemaMetrics` is non-null
      // and both nodes have rendered at least once against a real layout.
      scopeA.node.data.label = 'A renamed';
      await nextFlush();
      expect(canvas._schemaMetrics).toEqual(EXPECTED_METRICS);

      const countsA = observeAttr(targetA, 'data-flow-schema-kind');
      const countsB = observeAttr(targetB, 'data-flow-schema-kind');

      // Invalidation (colorMode change) nulls the cache without touching
      // either node's own data — neither node's render effect should re-run.
      canvas._schemaMetrics = null;
      await nextFlush();

      expect(countsA.count()).toBe(0);
      expect(countsB.count()).toBe(0);
      countsA.disconnect();
      countsB.disconnect();
    });
  });
});
