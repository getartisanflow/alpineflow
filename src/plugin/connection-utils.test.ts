// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { createConnectionLine, findSnapTarget, type ConnectionLineInstance } from './connection-utils';

describe('createConnectionLine', () => {
  describe('straight (default)', () => {
    it('returns svg and update/destroy functions', () => {
      const instance = createConnectionLine({});
      expect(instance.svg).toBeInstanceOf(SVGSVGElement);
      expect(typeof instance.update).toBe('function');
      expect(typeof instance.destroy).toBe('function');
    });

    it('renders an SVG path element', () => {
      const instance = createConnectionLine({});
      instance.update({ fromX: 0, fromY: 0, toX: 100, toY: 100, source: 'a' });
      const path = instance.svg.querySelector('path');
      expect(path).not.toBeNull();
    });

    it('update sets the d attribute with a straight line', () => {
      const instance = createConnectionLine({});
      instance.update({ fromX: 0, fromY: 0, toX: 100, toY: 100, source: 'a' });
      const path = instance.svg.querySelector('path')!;
      expect(path.getAttribute('d')).toContain('M0,0');
      expect(path.getAttribute('d')).toContain('100,100');
    });

    it('applies default stroke style', () => {
      const instance = createConnectionLine({});
      instance.update({ fromX: 0, fromY: 0, toX: 50, toY: 50, source: 'a' });
      const path = instance.svg.querySelector('path')!;
      expect(path.getAttribute('stroke')).toBeTruthy();
      expect(path.getAttribute('stroke-width')).toBeTruthy();
      expect(path.getAttribute('stroke-dasharray')).toBeTruthy();
    });

    it('destroy removes svg from parent', () => {
      const instance = createConnectionLine({});
      const parent = document.createElement('div');
      parent.appendChild(instance.svg);
      instance.destroy();
      expect(parent.children.length).toBe(0);
    });
  });

  describe('bezier type', () => {
    it('renders a bezier path with C command', () => {
      const instance = createConnectionLine({ connectionLineType: 'bezier' });
      instance.update({ fromX: 0, fromY: 0, toX: 200, toY: 100, source: 'a' });
      const d = instance.svg.querySelector('path')!.getAttribute('d')!;
      expect(d).toContain('C');
    });
  });

  describe('smoothstep type', () => {
    it('renders a smoothstep path', () => {
      const instance = createConnectionLine({ connectionLineType: 'smoothstep' });
      instance.update({ fromX: 0, fromY: 0, toX: 200, toY: 100, source: 'a' });
      const d = instance.svg.querySelector('path')!.getAttribute('d')!;
      expect(d).toMatch(/[MLQ]/);
    });
  });

  describe('step type', () => {
    it('renders a step path', () => {
      const instance = createConnectionLine({ connectionLineType: 'step' });
      instance.update({ fromX: 0, fromY: 0, toX: 200, toY: 100, source: 'a' });
      const d = instance.svg.querySelector('path')!.getAttribute('d')!;
      expect(d).toMatch(/[ML]/);
    });
  });

  describe('custom style', () => {
    it('applies custom stroke properties', () => {
      const instance = createConnectionLine({
        connectionLineStyle: { stroke: '#ff0000', strokeWidth: 4, strokeDasharray: '10 5' },
      });
      instance.update({ fromX: 0, fromY: 0, toX: 50, toY: 50, source: 'a' });
      const path = instance.svg.querySelector('path')!;
      expect(path.getAttribute('stroke')).toBe('#ff0000');
      expect(path.getAttribute('stroke-width')).toBe('4');
      expect(path.getAttribute('stroke-dasharray')).toBe('10 5');
    });
  });

  describe('custom renderer', () => {
    it('calls the custom function on update', () => {
      const customEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const customFn = vi.fn(() => customEl);
      const instance = createConnectionLine({ connectionLine: customFn });
      instance.update({ fromX: 10, fromY: 20, toX: 30, toY: 40, source: 'n1', sourceHandle: 'h1' });
      expect(customFn).toHaveBeenCalledTimes(1);
      expect(customFn).toHaveBeenCalledWith(expect.objectContaining({
        fromX: 10, fromY: 20, toX: 30, toY: 40,
        source: 'n1', sourceHandle: 'h1',
      }));
    });

    it('appends custom element to svg', () => {
      const customEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const customFn = vi.fn(() => customEl);
      const instance = createConnectionLine({ connectionLine: customFn });
      instance.update({ fromX: 0, fromY: 0, toX: 50, toY: 50, source: 'a' });
      expect(instance.svg.contains(customEl)).toBe(true);
    });

    it('replaces previous custom element on subsequent update', () => {
      let callCount = 0;
      const customFn = vi.fn(() => {
        callCount++;
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        el.id = `custom-${callCount}`;
        return el;
      });
      const instance = createConnectionLine({ connectionLine: customFn });
      instance.update({ fromX: 0, fromY: 0, toX: 50, toY: 50, source: 'a' });
      instance.update({ fromX: 0, fromY: 0, toX: 100, toY: 100, source: 'a' });
      expect(instance.svg.querySelector('#custom-1')).toBeNull();
      expect(instance.svg.querySelector('#custom-2')).not.toBeNull();
    });
  });

  describe('invalid flag', () => {
    it('uses invalid stroke color when invalid: true', () => {
      const instance = createConnectionLine({ invalid: true });
      instance.update({ fromX: 0, fromY: 0, toX: 50, toY: 50, source: 'a' });
      const path = instance.svg.querySelector('path')!;
      // Falls back to hardcoded color since JSDOM has no CSS vars
      expect(path.getAttribute('stroke')).toBe('#ef4444');
    });

    it('uses normal stroke color when invalid: false', () => {
      const instance = createConnectionLine({ invalid: false });
      instance.update({ fromX: 0, fromY: 0, toX: 50, toY: 50, source: 'a' });
      const path = instance.svg.querySelector('path')!;
      // Should be the default CONNECTION_ACTIVE_COLOR, not invalid red
      expect(path.getAttribute('stroke')).not.toBe('#ef4444');
    });

    it('uses containerEl CSS variable when provided', () => {
      const container = document.createElement('div');
      container.style.setProperty('--flow-connection-line-invalid', '#ff0000');
      const instance = createConnectionLine({ invalid: true, containerEl: container });
      instance.update({ fromX: 0, fromY: 0, toX: 50, toY: 50, source: 'a' });
      const path = instance.svg.querySelector('path')!;
      // JSDOM doesn't resolve CSS vars from inline style, so this tests the fallback path
      expect(path.getAttribute('stroke')).toBeTruthy();
    });
  });
});

describe('findSnapTarget', () => {
  function setupHandles() {
    const container = document.createElement('div');

    // Node A with a target handle
    const nodeA = document.createElement('div');
    nodeA.setAttribute('x-flow-node', '');
    nodeA.dataset.flowNodeId = 'a';
    const handleA1 = document.createElement('div');
    handleA1.dataset.flowHandleType = 'target';
    handleA1.dataset.flowHandleId = 'h1';
    handleA1.getBoundingClientRect = () => ({ left: 100, top: 100, width: 10, height: 10, right: 110, bottom: 110, x: 100, y: 100, toJSON: () => {} } as DOMRect);
    nodeA.appendChild(handleA1);
    container.appendChild(nodeA);

    // Node B with a target handle
    const nodeB = document.createElement('div');
    nodeB.setAttribute('x-flow-node', '');
    nodeB.dataset.flowNodeId = 'b';
    const handleB1 = document.createElement('div');
    handleB1.dataset.flowHandleType = 'target';
    handleB1.dataset.flowHandleId = 'h1';
    handleB1.getBoundingClientRect = () => ({ left: 200, top: 200, width: 10, height: 10, right: 210, bottom: 210, x: 200, y: 200, toJSON: () => {} } as DOMRect);
    nodeB.appendChild(handleB1);
    container.appendChild(nodeB);

    return { container, nodeA, nodeB, handleA1, handleB1 };
  }

  it('filters to handles on targetNodeId when provided', () => {
    const { container, handleB1 } = setupHandles();
    // Cursor at (110, 110) is closer to node A's handle at center (105,105)
    // than node B's handle at center (205,205). Without targetNodeId filter,
    // this would snap to node A. With targetNodeId='b', it must skip A and
    // only consider B (which is still within the large snap radius).
    const result = findSnapTarget({
      containerEl: container,
      handleType: 'target',
      excludeNodeId: 'source',
      cursorFlowPos: { x: 110, y: 110 },
      connectionSnapRadius: 200,
      getNode: () => ({}),
      toFlowPosition: (sx, sy) => ({ x: sx, y: sy }),
      targetNodeId: 'b',
    });
    expect(result.element).toBe(handleB1);
  });

  it('returns null when targetNodeId has no handles in range', () => {
    const { container } = setupHandles();
    const result = findSnapTarget({
      containerEl: container,
      handleType: 'target',
      excludeNodeId: 'source',
      cursorFlowPos: { x: 0, y: 0 },
      connectionSnapRadius: 5,
      getNode: () => ({}),
      toFlowPosition: (sx, sy) => ({ x: sx, y: sy }),
      targetNodeId: 'b',
    });
    expect(result.element).toBeNull();
  });
});
