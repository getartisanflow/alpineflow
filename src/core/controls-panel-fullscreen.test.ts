// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createControlsPanel, type ControlsPanelOptions } from './controls-panel';

function baseOptions(): ControlsPanelOptions {
  return {
    position: 'bottom-left',
    orientation: 'vertical',
    showZoom: true,
    showFitView: true,
    showInteractive: true,
    showResetPanels: false,
    onZoomIn: () => {},
    onZoomOut: () => {},
    onFitView: () => {},
    onToggleInteractive: () => {},
    onResetPanels: () => {},
  };
}

describe('controls panel — fullscreen button', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('does not render fullscreen button when onToggleFullscreen is not provided', () => {
    createControlsPanel(container, baseOptions());
    expect(container.querySelector('.flow-controls-button-fullscreen')).toBeNull();
  });

  it('renders fullscreen button when onToggleFullscreen is provided', () => {
    createControlsPanel(container, { ...baseOptions(), onToggleFullscreen: () => {} });
    const btn = container.querySelector('.flow-controls-button-fullscreen');
    expect(btn).not.toBeNull();
    expect(btn?.getAttribute('aria-label')).toBe('Toggle fullscreen');
  });

  it('clicking the fullscreen button invokes the handler', () => {
    const handler = vi.fn();
    createControlsPanel(container, { ...baseOptions(), onToggleFullscreen: handler });
    (container.querySelector('.flow-controls-button-fullscreen') as HTMLElement)?.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('update({ isFullscreen: true }) adds active class and swaps aria-label', () => {
    const instance = createControlsPanel(container, { ...baseOptions(), onToggleFullscreen: () => {} });
    const btn = container.querySelector('.flow-controls-button-fullscreen') as HTMLElement;
    expect(btn.classList.contains('flow-controls-button-fullscreen--active')).toBe(false);

    instance.update({ isFullscreen: true });
    expect(btn.classList.contains('flow-controls-button-fullscreen--active')).toBe(true);
    expect(btn.getAttribute('aria-label')).toBe('Exit fullscreen');

    instance.update({ isFullscreen: false });
    expect(btn.classList.contains('flow-controls-button-fullscreen--active')).toBe(false);
    expect(btn.getAttribute('aria-label')).toBe('Enter fullscreen');
  });

  it('update() preserves interactivity behavior independently of fullscreen', () => {
    const instance = createControlsPanel(container, { ...baseOptions(), onToggleFullscreen: () => {} });
    // Setting only isInteractive should not affect fullscreen button
    const fsBtn = container.querySelector('.flow-controls-button-fullscreen') as HTMLElement;
    instance.update({ isInteractive: false });
    expect(fsBtn.classList.contains('flow-controls-button-fullscreen--active')).toBe(false);
  });

  it('destroy() removes the panel from the DOM', () => {
    const instance = createControlsPanel(container, { ...baseOptions(), onToggleFullscreen: () => {} });
    expect(container.querySelector('.flow-controls')).not.toBeNull();
    instance.destroy();
    expect(container.querySelector('.flow-controls')).toBeNull();
  });
});

describe('controls panel — the canvas gestures underneath', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  // The panel already swallows mousedown, pointerdown and wheel so the canvas does not pan or
  // zoom under it. Double-click was the one it let through: two quick presses of zoom-in are a
  // double-click to the container, so the canvas jumped to the double-click level instead of
  // taking a second step under the cursor.
  it.each([
    ['mousedown', () => new MouseEvent('mousedown', { bubbles: true, cancelable: true })],
    ['pointerdown', () => new MouseEvent('pointerdown', { bubbles: true, cancelable: true })],
    ['wheel', () => new WheelEvent('wheel', { bubbles: true, cancelable: true })],
    ['dblclick', () => new MouseEvent('dblclick', { bubbles: true, cancelable: true })],
  ])('keeps %s inside the panel', (type, make) => {
    createControlsPanel(container, baseOptions());
    let reachedCanvas = 0;
    container.addEventListener(type, () => { reachedCanvas++; });

    container.querySelector('.flow-controls button')!.dispatchEvent(make());

    expect(reachedCanvas).toBe(0);
  });

  it('still runs the button\'s own handler on a double-click\'s first press', () => {
    // Swallowing the event at the panel must not disarm the control it landed on.
    const onZoomIn = vi.fn();
    createControlsPanel(container, { ...baseOptions(), onZoomIn });

    const btn = container.querySelector('.flow-controls button') as HTMLElement;
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    btn.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true }));

    expect(onZoomIn).toHaveBeenCalledTimes(2);
  });
});

