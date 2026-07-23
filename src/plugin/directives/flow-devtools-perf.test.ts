// @vitest-environment jsdom
// ============================================================================
// x-flow-devtools — perf behaviour (mounted directive)
//
// The pure config helpers are covered in flow-devtools.test.ts. These mount the
// real directive with Alpine to verify the per-frame work reductions:
//   • the event log does no work while the panel is collapsed
//   • a viewport change does not re-serialize the current selection
// ============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowDevtoolsDirective } from './flow-devtools';

function clearChildren(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

let mountCounter = 0;

function baseCanvas(): () => Record<string, any> {
  return () => ({
    nodes: [{ id: 'n1', position: { x: 1, y: 2 }, data: { label: 'N1' } }],
    edges: [] as any[],
    viewport: { x: 0, y: 0, zoom: 1 },
    selectedNodes: new Set<string>(),
    selectedEdges: new Set<string>(),
    getNode(id: string) {
      return (this.nodes as any[]).find((n) => n.id === id);
    },
  });
}

function mount(configExpr: string, canvasFactory = baseCanvas()) {
  clearChildren(document.body);
  const host = document.createElement('div');
  host.classList.add('flow-container');
  const dataName = `canvas${++mountCounter}`;
  host.setAttribute('x-data', dataName);

  const devtools = document.createElement('div');
  devtools.setAttribute('x-flow-devtools', configExpr);
  host.appendChild(devtools);

  Alpine.data(dataName, canvasFactory);
  document.body.appendChild(host);
  Alpine.initTree(host);

  return { host, devtools, scope: () => Alpine.$data(host) as any };
}

beforeEach(() => {
  registerFlowDevtoolsDirective(Alpine);
  if (!(Alpine as any).__started) {
    Alpine.start();
    (Alpine as any).__started = true;
  }
});

describe('x-flow-devtools perf behaviour', () => {
  it('renders the selected node JSON in the state panel (reactivity precondition)', async () => {
    const { devtools, scope } = mount('{ state: true }');
    scope().selectedNodes = new Set(['n1']);
    await Alpine.nextTick();

    const stateContent = devtools.querySelector('.flow-devtools-state-content');
    expect(stateContent?.textContent).toContain('n1');
  });

  it('does not append event-log rows while collapsed', () => {
    const { host, devtools } = mount('{ events: { max: 30 } }');
    // panel starts collapsed
    host.dispatchEvent(new CustomEvent('flow-viewport-change', { detail: { viewport: { x: 1 } } }));
    host.dispatchEvent(new CustomEvent('flow-node-add', { detail: {} }));

    const rows = devtools.querySelectorAll('.flow-devtools-event-entry');
    expect(rows.length).toBe(0);
  });

  it('still appends event-log rows when expanded (append path intact)', () => {
    const { host, devtools } = mount('{ events: { max: 30 } }');
    const toggle = devtools.querySelector('.flow-devtools-toggle') as HTMLElement;
    toggle.dispatchEvent(new MouseEvent('click')); // expand

    host.dispatchEvent(new CustomEvent('flow-viewport-change', { detail: { viewport: { x: 1 } } }));

    const rows = devtools.querySelectorAll('.flow-devtools-event-entry');
    expect(rows.length).toBe(1);
  });

  it('does not re-serialize the selected node when the viewport changes', async () => {
    const { scope } = mount('{ viewport: true, state: true }');
    scope().selectedNodes = new Set(['n1']);
    await Alpine.nextTick();

    const spy = vi.spyOn(JSON, 'stringify');
    scope().viewport.x = 250;
    scope().viewport.zoom = 1.5;
    await Alpine.nextTick();

    const selectionSerializations = spy.mock.calls.filter(
      ([v]) => v && (v as any).id === 'n1',
    );
    spy.mockRestore();
    expect(selectionSerializations.length).toBe(0);
  });
});
