// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../../index';
import type { FlowCanvasConfig } from '../../core/types';

let registered = false;
const mounted: HTMLElement[] = [];
beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') (globalThis as any).CSS = {};
  if (typeof CSS.escape !== 'function') CSS.escape = (v: string) => String(v);
  if (typeof document.elementFromPoint !== 'function') document.elementFromPoint = () => null;
});
function mount(config: Partial<FlowCanvasConfig>): any {
  if (!registered) { (window as any).Alpine = Alpine; Alpine.plugin(AlpineFlow); Alpine.start(); registered = true; }
  const wrapper = document.createElement('div');
  (wrapper as any).__config = { fitViewOnInit: false, controls: false, minimap: false, ...config };
  const el = document.createElement('div');
  el.setAttribute('x-data', 'flowCanvas($root.parentElement.__config)');
  el.className = 'flow-container';
  el.innerHTML = `<div x-flow-viewport><template x-for="node in nodes" :key="node.id"><div x-flow-node="node"><div x-flow-handle:source></div></div></template></div>`;
  wrapper.appendChild(el); document.body.appendChild(wrapper); mounted.push(wrapper); Alpine.initTree(wrapper);
  return Alpine.$data(el);
}
afterEach(() => { for (const el of mounted) { Alpine.destroyTree(el); el.remove(); } mounted.length = 0; vi.restoreAllMocks(); });

const CFG: Partial<FlowCanvasConfig> = {
  nodes: [
    { id: 'a', position: { x: 0, y: 0 }, data: {} },
    { id: 'b', position: { x: 100, y: 0 }, data: {} },
  ],
  edges: [{ id: 'e1', source: 'a', target: 'b' }],
};

describe('public selection / node-flag API', () => {
  it('selectNodes selects the given nodes and clears prior selection', () => {
    const c = mount(CFG);
    c.selectNodes(['a']);
    expect(c.selectedNodes.has('a')).toBe(true);
    expect(c.getNode('a').selected).toBe(true);
    c.selectNodes(['b']);
    expect(c.selectedNodes.has('a')).toBe(false);
    expect(c.getNode('a').selected).toBe(false);
    expect(c.selectedNodes.has('b')).toBe(true);
  });

  it('selectEdges selects the given edges', () => {
    const c = mount(CFG);
    c.selectEdges(['e1']);
    expect(c.selectedEdges.has('e1')).toBe(true);
    expect(c.getEdge('e1').selected).toBe(true);
  });

  it('selectNodes emits selection-change once on change, and not at all when unchanged', () => {
    const onSelectionChange = vi.fn();
    const c = mount({ ...CFG, onSelectionChange });
    onSelectionChange.mockClear(); // ignore any init-time emits

    c.selectNodes(['a']); // {} -> {a}
    expect(onSelectionChange).toHaveBeenCalledTimes(1);

    onSelectionChange.mockClear();
    c.selectNodes(['b']); // {a} -> {b}: one net change, not two (clear + set)
    expect(onSelectionChange).toHaveBeenCalledTimes(1);

    onSelectionChange.mockClear();
    c.selectNodes(['b']); // {b} -> {b}: no change, no emit — this is what breaks the round-trip
    expect(onSelectionChange).toHaveBeenCalledTimes(0);
  });

  it('selectNodes([]) on an empty selection emits nothing', () => {
    const onSelectionChange = vi.fn();
    const c = mount({ ...CFG, onSelectionChange });
    onSelectionChange.mockClear();
    c.selectNodes([]);
    expect(onSelectionChange).toHaveBeenCalledTimes(0);
  });

  it('selectEdges emits selection-change once on change, and not when unchanged', () => {
    const onSelectionChange = vi.fn();
    const c = mount({ ...CFG, onSelectionChange });
    onSelectionChange.mockClear();
    c.selectEdges(['e1']); // {} -> {e1}
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    onSelectionChange.mockClear();
    c.selectEdges(['e1']); // unchanged
    expect(onSelectionChange).toHaveBeenCalledTimes(0);
  });

  it('setNodeLocked / setNodeHidden set the node flags', () => {
    const c = mount(CFG);
    c.setNodeLocked('a', true);
    expect(c.getNode('a').locked).toBe(true);
    c.setNodeLocked('a', false);
    expect(c.getNode('a').locked).toBe(false);
    c.setNodeHidden('b', true);
    expect(c.getNode('b').hidden).toBe(true);
  });

  it('setNodeLocked on an unknown id is a no-op (no throw)', () => {
    const c = mount(CFG);
    expect(() => c.setNodeLocked('missing', true)).not.toThrow();
  });
});
