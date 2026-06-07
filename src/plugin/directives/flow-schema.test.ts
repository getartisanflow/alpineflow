// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowSchemaDirective } from './flow-schema';
import { registerFlowHandleDirective } from './flow-handle';

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
});
