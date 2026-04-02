// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FlowAnnouncer, defaultFormatAnnouncement } from './announcer';

describe('FlowAnnouncer', () => {
  let container: HTMLElement;
  let announcer: FlowAnnouncer;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    announcer = new FlowAnnouncer(container);
  });

  afterEach(() => {
    announcer.destroy();
    container.remove();
  });

  it('creates a visually-hidden live region in the container', () => {
    const el = container.querySelector('[aria-live="polite"]');
    expect(el).not.toBeNull();
    expect(el!.getAttribute('aria-atomic')).toBe('true');
    expect((el as HTMLElement).style.position).toBe('absolute');
  });

  it('announce() sets textContent on the live region', () => {
    announcer.announce('hello');
    const el = container.querySelector('[aria-live="polite"]');
    expect(el!.textContent).toBe('hello');
  });

  it('keeps announcement text for at least 500ms', () => {
    vi.useFakeTimers();
    announcer.announce('Test message');
    const el = container.querySelector('[aria-live="polite"]');
    expect(el!.textContent).toBe('Test message');
    vi.advanceTimersByTime(499);
    expect(el!.textContent).toBe('Test message');
    vi.advanceTimersByTime(501);
    expect(el!.textContent).toBe('');
    vi.useRealTimers();
  });

  it('clears textContent after the delay so repeated messages fire', () => {
    vi.useFakeTimers();
    announcer.announce('first');
    vi.advanceTimersByTime(1001);
    const el = container.querySelector('[aria-live="polite"]');
    expect(el!.textContent).toBe('');
    vi.useRealTimers();
  });

  it('handleEvent() announces for mapped events', () => {
    const spy = vi.spyOn(announcer, 'announce');
    announcer.handleEvent('nodes-change', { type: 'add', nodes: [{ id: 'n1', data: { label: 'Login' } }] });
    expect(spy).toHaveBeenCalledWith('Added node: Login');
  });

  it('handleEvent() ignores unmapped events', () => {
    const spy = vi.spyOn(announcer, 'announce');
    announcer.handleEvent('node-click', { nodeId: 'n1' });
    expect(spy).not.toHaveBeenCalled();
  });

  it('uses formatMessage override when provided', () => {
    const custom = new FlowAnnouncer(container, (event) => `custom: ${event}`);
    const spy = vi.spyOn(custom, 'announce');
    custom.handleEvent('fit-view', {});
    expect(spy).toHaveBeenCalledWith('custom: fit-view');
    custom.destroy();
  });

  it('suppresses announcement when formatMessage returns null', () => {
    const custom = new FlowAnnouncer(container, () => null);
    const spy = vi.spyOn(custom, 'announce');
    custom.handleEvent('fit-view', {});
    expect(spy).not.toHaveBeenCalled();
    custom.destroy();
  });

  it('destroy() removes the live region element', () => {
    announcer.destroy();
    expect(container.querySelector('[aria-live="polite"]')).toBeNull();
  });
});

describe('defaultFormatAnnouncement', () => {
  it('nodes-change add single', () => {
    expect(defaultFormatAnnouncement('nodes-change', {
      type: 'add', nodes: [{ id: 'n1', data: { label: 'Start' } }],
    })).toBe('Added node: Start');
  });

  it('nodes-change add multiple', () => {
    expect(defaultFormatAnnouncement('nodes-change', {
      type: 'add', nodes: [{ id: 'n1', data: {} }, { id: 'n2', data: {} }],
    })).toBe('Added 2 nodes');
  });

  it('nodes-change remove single', () => {
    expect(defaultFormatAnnouncement('nodes-change', {
      type: 'remove', nodes: [{ id: 'n1', data: { label: 'End' } }],
    })).toBe('Removed node: End');
  });

  it('nodes-change remove multiple', () => {
    expect(defaultFormatAnnouncement('nodes-change', {
      type: 'remove', nodes: [{ id: 'n1', data: {} }, { id: 'n2', data: {} }, { id: 'n3', data: {} }],
    })).toBe('Removed 3 nodes');
  });

  it('edges-change add', () => {
    expect(defaultFormatAnnouncement('edges-change', {
      type: 'add', edges: [{ id: 'e1', source: 'A', target: 'B' }],
    })).toBe('Connected A to B');
  });

  it('edges-change add multiple', () => {
    expect(defaultFormatAnnouncement('edges-change', {
      type: 'add', edges: [{ id: 'e1', source: 'A', target: 'B' }, { id: 'e2', source: 'C', target: 'D' }],
    })).toBe('Added 2 connections');
  });

  it('edges-change remove', () => {
    expect(defaultFormatAnnouncement('edges-change', {
      type: 'remove', edges: [{ id: 'e1', source: 'A', target: 'B' }],
    })).toBe('Removed connection from A to B');
  });

  it('edges-change remove multiple', () => {
    expect(defaultFormatAnnouncement('edges-change', {
      type: 'remove', edges: [{ id: 'e1' }, { id: 'e2' }],
    })).toBe('Removed 2 connections');
  });

  it('selection-change with items', () => {
    expect(defaultFormatAnnouncement('selection-change', {
      nodes: ['n1', 'n2'], edges: ['e1'],
    })).toBe('2 nodes and 1 edge selected');
  });

  it('selection-change cleared', () => {
    expect(defaultFormatAnnouncement('selection-change', {
      nodes: [], edges: [],
    })).toBe('Selection cleared');
  });

  it('viewport-move-end', () => {
    expect(defaultFormatAnnouncement('viewport-move-end', {
      viewport: { x: 0, y: 0, zoom: 1.5 },
    })).toBe('Viewport: zoom 150%');
  });

  it('fit-view', () => {
    expect(defaultFormatAnnouncement('fit-view', {})).toBe('Fitted view to content');
  });

  it('node-reparent into parent', () => {
    expect(defaultFormatAnnouncement('node-reparent', {
      node: { id: 'n1', data: { label: 'Card' } },
      oldParentId: null,
      newParentId: 'group1',
    })).toBe('Moved Card into group1');
  });

  it('node-reparent detach', () => {
    expect(defaultFormatAnnouncement('node-reparent', {
      node: { id: 'n1', data: { label: 'Card' } },
      oldParentId: 'group1',
      newParentId: null,
    })).toBe('Detached Card from group1');
  });

  it('returns null for unmapped events', () => {
    expect(defaultFormatAnnouncement('node-click', {})).toBeNull();
  });
});
