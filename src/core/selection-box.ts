// ============================================================================
// Selection Box
//
// A translucent rectangle drawn over the canvas during shift+drag to select
// multiple nodes at once. Follows the same DOM injection pattern as MiniMap
// and Controls Panel.
// ============================================================================

import type { Rect, Viewport } from './types';

export interface SelectionBoxInstance {
  /** Start a new selection at a position relative to the container */
  start(containerX: number, containerY: number, mode?: 'partial' | 'full'): void;
  /** Update the selection box to a new position relative to the container */
  update(containerX: number, containerY: number): void;
  /** Finish selection and return the rect in flow coordinates */
  end(viewport: Viewport): Rect | null;
  /** Whether a selection is in progress */
  isActive(): boolean;
  /** Remove from DOM */
  destroy(): void;
}

const MIN_SELECTION_SIZE = 5;

export function createSelectionBox(container: HTMLElement): SelectionBoxInstance {
  const el = document.createElement('div');
  el.className = 'flow-selection-box';
  container.appendChild(el);

  let active = false;
  let originX = 0;
  let originY = 0;
  let currentX = 0;
  let currentY = 0;

  function start(containerX: number, containerY: number, mode: 'partial' | 'full' = 'partial'): void {
    originX = containerX;
    originY = containerY;
    currentX = containerX;
    currentY = containerY;
    active = true;

    el.style.left = `${containerX}px`;
    el.style.top = `${containerY}px`;
    el.style.width = '0px';
    el.style.height = '0px';
    el.classList.remove('flow-selection-partial', 'flow-selection-full');
    el.classList.add('flow-selection-box-active', `flow-selection-${mode}`);
  }

  function update(containerX: number, containerY: number): void {
    if (!active) {
      return;
    }

    currentX = containerX;
    currentY = containerY;

    const left = Math.min(originX, currentX);
    const top = Math.min(originY, currentY);
    const width = Math.abs(currentX - originX);
    const height = Math.abs(currentY - originY);

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
  }

  function end(viewport: Viewport): Rect | null {
    if (!active) {
      return null;
    }

    active = false;
    el.classList.remove('flow-selection-box-active');
    el.classList.remove('flow-selection-partial', 'flow-selection-full');

    const screenWidth = Math.abs(currentX - originX);
    const screenHeight = Math.abs(currentY - originY);

    if (screenWidth < MIN_SELECTION_SIZE && screenHeight < MIN_SELECTION_SIZE) {
      return null;
    }

    // Convert screen-space rect (relative to container) to flow coordinates
    const left = Math.min(originX, currentX);
    const top = Math.min(originY, currentY);

    const flowX = (left - viewport.x) / viewport.zoom;
    const flowY = (top - viewport.y) / viewport.zoom;
    const flowWidth = screenWidth / viewport.zoom;
    const flowHeight = screenHeight / viewport.zoom;

    return { x: flowX, y: flowY, width: flowWidth, height: flowHeight };
  }

  function isActive(): boolean {
    return active;
  }

  function destroy(): void {
    el.remove();
  }

  return { start, update, end, isActive, destroy };
}
