// ============================================================================
// Controls Panel
//
// A floating toolbar overlay with zoom in/out, fit view, and interactivity
// lock toggle buttons. Follows the same DOM injection pattern as MiniMap.
// ============================================================================

export interface ControlsPanelOptions {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  orientation: 'vertical' | 'horizontal';
  showZoom: boolean;
  showFitView: boolean;
  showInteractive: boolean;
  showResetPanels: boolean;
  external?: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onToggleInteractive: () => void;
  onResetPanels: () => void;
}

export interface ControlsPanelInstance {
  /** Update the interactive toggle icon to reflect current state */
  update(state: { isInteractive: boolean }): void;
  /** Remove the panel from the DOM */
  destroy(): void;
}

// ── SVG Icon Paths ──────────────────────────────────────────────────────
const ICON_ZOOM_IN = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';

const ICON_ZOOM_OUT = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>';

const ICON_FIT_VIEW = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';

const ICON_UNLOCK = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';

const ICON_LOCK = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

const ICON_RESET_PANELS = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>';

export function createControlsPanel(
  container: HTMLElement,
  options: ControlsPanelOptions,
): ControlsPanelInstance {
  const {
    position,
    orientation,
    showZoom,
    showFitView,
    showInteractive,
    showResetPanels,
    external,
    onZoomIn,
    onZoomOut,
    onFitView,
    onToggleInteractive,
    onResetPanels,
  } = options;

  // ── Build DOM ──────────────────────────────────────────────────────
  const wrapper = document.createElement('div');
  const classes = [
    'flow-controls',
    `flow-controls-${orientation}`,
  ];
  if (external) {
    classes.push('flow-controls-external');
  } else {
    classes.push(`flow-controls-${position}`);
  }
  wrapper.className = classes.join(' ');
  wrapper.setAttribute('role', 'toolbar');
  wrapper.setAttribute('aria-label', 'Flow controls');

  let interactiveBtn: HTMLButtonElement | null = null;

  if (showZoom) {
    const zoomInBtn = createButton(ICON_ZOOM_IN, 'Zoom in', onZoomIn);
    const zoomOutBtn = createButton(ICON_ZOOM_OUT, 'Zoom out', onZoomOut);
    wrapper.appendChild(zoomInBtn);
    wrapper.appendChild(zoomOutBtn);
  }

  if (showFitView) {
    const fitBtn = createButton(ICON_FIT_VIEW, 'Fit view', onFitView);
    wrapper.appendChild(fitBtn);
  }

  if (showInteractive) {
    interactiveBtn = createButton(ICON_UNLOCK, 'Toggle interactivity', onToggleInteractive);
    wrapper.appendChild(interactiveBtn);
  }

  if (showResetPanels) {
    const resetBtn = createButton(ICON_RESET_PANELS, 'Reset panels', onResetPanels);
    wrapper.appendChild(resetBtn);
  }

  // Prevent pan/zoom from triggering when interacting with buttons
  wrapper.addEventListener('mousedown', (e) => e.stopPropagation());
  wrapper.addEventListener('pointerdown', (e) => e.stopPropagation());
  wrapper.addEventListener('wheel', (e) => e.stopPropagation(), { passive: false });

  container.appendChild(wrapper);

  // ── API ────────────────────────────────────────────────────────────
  function update(state: { isInteractive: boolean }): void {
    if (interactiveBtn) {
      interactiveBtn.innerHTML = state.isInteractive ? ICON_UNLOCK : ICON_LOCK;
      const interactiveTitle = state.isInteractive ? 'Lock interactivity' : 'Unlock interactivity';
      interactiveBtn.title = interactiveTitle;
      interactiveBtn.setAttribute('aria-label', interactiveTitle);
    }
  }

  function destroy(): void {
    wrapper.remove();
  }

  return { update, destroy };
}

function createButton(icon: string, title: string, onClick: () => void): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerHTML = icon;
  btn.title = title;
  btn.setAttribute('aria-label', title);
  btn.addEventListener('click', onClick);
  return btn;
}
