// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowContextMenuDirective } from './flow-context-menu';

beforeAll(() => {
  registerFlowContextMenuDirective(Alpine);
});

const mountedHosts: HTMLElement[] = [];
afterEach(() => {
  while (mountedHosts.length > 0) {
    mountedHosts.pop()?.remove();
  }
  vi.restoreAllMocks();
});

/** Flush Alpine's reactive scheduler so directive effects run. */
function flush(): Promise<void> {
  return new Promise<void>((resolve) => Alpine.nextTick(() => resolve()));
}

/**
 * Mount a `.node` context-menu directive inside a reactive canvas scope that
 * exposes the `contextMenu` state + `closeContextMenu()` the directive reads.
 * Returns the reactive data plus the menu element and an external trigger.
 */
function mount() {
  const host = document.createElement('div');

  const canvas = {
    contextMenu: { show: false, type: null as string | null, x: 0, y: 0 },
    closeContextMenu() {
      this.contextMenu = { show: false, type: null, x: 0, y: 0 };
    },
  };
  (window as any).cmCanvasScope = () => canvas;
  host.setAttribute('x-data', 'cmCanvasScope()');

  // External trigger that holds focus before the menu opens.
  const trigger = document.createElement('button');
  trigger.textContent = 'trigger';
  host.appendChild(trigger);

  const menu = document.createElement('div');
  menu.setAttribute('x-flow-context-menu.node', '');
  const item = document.createElement('button');
  item.textContent = 'Delete';
  menu.appendChild(item);
  host.appendChild(menu);

  document.body.appendChild(host);
  mountedHosts.push(host);
  Alpine.initTree(host);

  return { host, menu, trigger, data: Alpine.$data(host) as any };
}

describe('x-flow-context-menu focus management', () => {
  it('focuses the menu container with preventScroll when the menu opens', async () => {
    const { menu, data } = mount();
    const focusSpy = vi.spyOn(menu, 'focus');

    data.contextMenu = { show: true, type: 'node', x: 40, y: 40 };
    await flush();

    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('restores focus to the previously-focused element with preventScroll on close', async () => {
    const { menu, trigger, data } = mount();
    trigger.focus();
    const triggerFocusSpy = vi.spyOn(trigger, 'focus');
    const menuFocusSpy = vi.spyOn(menu, 'focus');

    // Open (captures `trigger` as previousFocus), then close.
    data.contextMenu = { show: true, type: 'node', x: 40, y: 40 };
    await flush();
    expect(menuFocusSpy).toHaveBeenCalledWith({ preventScroll: true });

    data.contextMenu = { show: false, type: null, x: 0, y: 0 };
    await flush();

    expect(triggerFocusSpy).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('does not steal scroll position: every focus call passes preventScroll', async () => {
    const { menu, trigger, data } = mount();
    trigger.focus();
    const focusCalls: unknown[] = [];
    vi.spyOn(menu, 'focus').mockImplementation((opts?: unknown) => focusCalls.push(opts));
    vi.spyOn(trigger, 'focus').mockImplementation((opts?: unknown) => focusCalls.push(opts));

    data.contextMenu = { show: true, type: 'node', x: 40, y: 40 };
    await flush();
    data.contextMenu = { show: false, type: null, x: 0, y: 0 };
    await flush();

    expect(focusCalls.length).toBeGreaterThan(0);
    for (const opts of focusCalls) {
      expect(opts).toEqual({ preventScroll: true });
    }
  });
});
