// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderCursors, CURSOR_CLASS } from './flow-cursors';
import type { CollabAwarenessState } from '../types';

describe('renderCursors', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('creates cursor elements for remote users', () => {
    const states = new Map<number, CollabAwarenessState>([
      [100, {
        user: { name: 'Bob', color: '#22c55e' },
        cursor: { x: 100, y: 200 },
        selectedNodes: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      }],
    ]);

    renderCursors(container, states, 1);

    const cursors = container.querySelectorAll(`.${CURSOR_CLASS}`);
    expect(cursors.length).toBe(1);
  });

  it('positions cursors using transform', () => {
    const states = new Map<number, CollabAwarenessState>([
      [100, {
        user: { name: 'Bob', color: '#22c55e' },
        cursor: { x: 150, y: 250 },
        selectedNodes: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      }],
    ]);

    renderCursors(container, states, 1);

    const cursor = container.querySelector(`.${CURSOR_CLASS}`) as HTMLElement;
    expect(cursor.style.transform).toContain('150');
    expect(cursor.style.transform).toContain('250');
  });

  it('removes cursors for disconnected users', () => {
    const states1 = new Map<number, CollabAwarenessState>([
      [100, {
        user: { name: 'Bob', color: '#22c55e' },
        cursor: { x: 100, y: 200 },
        selectedNodes: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      }],
    ]);
    renderCursors(container, states1, 1);
    expect(container.querySelectorAll(`.${CURSOR_CLASS}`).length).toBe(1);

    renderCursors(container, new Map(), 1);
    expect(container.querySelectorAll(`.${CURSOR_CLASS}`).length).toBe(0);
  });

  it('skips users with null cursor', () => {
    const states = new Map<number, CollabAwarenessState>([
      [100, {
        user: { name: 'Bob', color: '#22c55e' },
        cursor: null,
        selectedNodes: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      }],
    ]);

    renderCursors(container, states, 1);
    expect(container.querySelectorAll(`.${CURSOR_CLASS}`).length).toBe(0);
  });

  it('updates existing cursor positions without recreating elements', () => {
    const states = new Map<number, CollabAwarenessState>([
      [100, {
        user: { name: 'Bob', color: '#22c55e' },
        cursor: { x: 100, y: 200 },
        selectedNodes: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      }],
    ]);

    renderCursors(container, states, 1);
    const firstEl = container.querySelector(`.${CURSOR_CLASS}`);

    states.get(100)!.cursor = { x: 300, y: 400 };
    renderCursors(container, states, 1);
    const secondEl = container.querySelector(`.${CURSOR_CLASS}`);

    expect(firstEl).toBe(secondEl); // Same DOM element reused
  });

  it('applies user color to cursor', () => {
    const states = new Map<number, CollabAwarenessState>([
      [100, {
        user: { name: 'Bob', color: '#ff0000' },
        cursor: { x: 0, y: 0 },
        selectedNodes: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      }],
    ]);

    renderCursors(container, states, 1);
    const cursor = container.querySelector(`.${CURSOR_CLASS}`) as HTMLElement;
    const arrow = cursor.querySelector('.flow-collab-cursor-arrow');
    expect(arrow?.getAttribute('fill')).toBe('#ff0000');
    const label = cursor.querySelector('.flow-collab-cursor-label') as HTMLElement;
    expect(label.style.background).toBe('rgb(255, 0, 0)');
  });
});
