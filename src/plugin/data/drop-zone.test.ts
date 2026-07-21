// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { isOverlayDropTarget } from './flow-canvas';

/**
 * The drop zone listens on the flow container, and the floating overlays live
 * inside it with `pointer-events: auto`, so their drag events bubble to that same
 * listener. `isOverlayDropTarget` is what tells the two apart; the full DragEvent
 * path can't be driven in jsdom (no real drag source), so the predicate is tested
 * directly against the DOM shapes it has to classify.
 */
/**
 * Build a flow container holding the canvas surface plus the three overlays, as
 * the directives render them, and hand back the elements a drag event could target.
 */
function mountCanvas() {
  const container = document.createElement('div');
  container.setAttribute('data-flow-canvas', '');

  const viewport = document.createElement('div');
  viewport.classList.add('flow-viewport');
  const node = document.createElement('div');
  node.setAttribute('data-flow-node-id', 'n1');
  viewport.appendChild(node);

  const panel = document.createElement('div');
  panel.classList.add('flow-panel', 'flow-panel-top-left');
  const paletteItem = document.createElement('button');
  panel.appendChild(paletteItem);

  const controls = document.createElement('div');
  controls.classList.add('flow-controls');
  const controlsButton = document.createElement('button');
  controls.appendChild(controlsButton);

  const minimap = document.createElement('div');
  minimap.classList.add('flow-minimap');
  const minimapSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  minimap.appendChild(minimapSvg);

  container.append(viewport, panel, controls, minimap);
  return { container, viewport, node, panel, paletteItem, controls, controlsButton, minimap, minimapSvg };
}

describe('isOverlayDropTarget — overlays are not part of the droppable surface', () => {
  it('returns false for a null target', () => {
    expect(isOverlayDropTarget(null)).toBe(false);
  });

  it('returns false for the container and the bare canvas surface', () => {
    const { container, viewport } = mountCanvas();
    expect(isOverlayDropTarget(container)).toBe(false);
    expect(isOverlayDropTarget(viewport)).toBe(false);
  });

  it('returns false for a node on the canvas, so drops onto nodes still work', () => {
    const { node } = mountCanvas();
    expect(isOverlayDropTarget(node)).toBe(false);
  });

  it('returns true for the panel and for a palette item inside it', () => {
    // The regression: dragging an item out and releasing it back over the palette
    // must cancel, not add a node at the position behind the panel.
    const { panel, paletteItem } = mountCanvas();
    expect(isOverlayDropTarget(panel)).toBe(true);
    expect(isOverlayDropTarget(paletteItem)).toBe(true);
  });

  it('returns true for the controls overlay and its buttons', () => {
    const { controls, controlsButton } = mountCanvas();
    expect(isOverlayDropTarget(controls)).toBe(true);
    expect(isOverlayDropTarget(controlsButton)).toBe(true);
  });

  it('returns true for the minimap overlay and its contents', () => {
    const { minimap, minimapSvg } = mountCanvas();
    expect(isOverlayDropTarget(minimap)).toBe(true);
    expect(isOverlayDropTarget(minimapSvg)).toBe(true);
  });
});
