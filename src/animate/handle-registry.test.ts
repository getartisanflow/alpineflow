import { describe, it, expect, vi } from 'vitest';
import { HandleRegistry } from './handle-registry';
import type { Taggable } from './handle-registry';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeHandle(tags?: string[], finished = false): Taggable {
  return {
    _tags: tags,
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    get isFinished() { return finished; },
  };
}

function makeFinishedHandle(tags?: string[]): Taggable {
  return makeHandle(tags, true);
}

// ── HandleRegistry Tests ─────────────────────────────────────────────────────

describe('HandleRegistry', () => {
  it('registers and retrieves handles', () => {
    const registry = new HandleRegistry();
    const h1 = makeHandle();
    const h2 = makeHandle();

    registry.register(h1);
    registry.register(h2);

    expect(registry.size).toBe(2);
    expect(registry.getHandles()).toContain(h1);
    expect(registry.getHandles()).toContain(h2);
  });

  it('filters by tag', () => {
    const registry = new HandleRegistry();
    const h1 = makeHandle(['animation', 'entrance']);
    const h2 = makeHandle(['exit']);
    const h3 = makeHandle();

    registry.register(h1);
    registry.register(h2);
    registry.register(h3);

    const result = registry.getHandles({ tag: 'animation' });
    expect(result).toContain(h1);
    expect(result).not.toContain(h2);
    expect(result).not.toContain(h3);
  });

  it('filters by multiple tags', () => {
    const registry = new HandleRegistry();
    const h1 = makeHandle(['entrance']);
    const h2 = makeHandle(['exit']);
    const h3 = makeHandle(['idle']);
    const h4 = makeHandle();

    registry.register(h1);
    registry.register(h2);
    registry.register(h3);
    registry.register(h4);

    const result = registry.getHandles({ tags: ['entrance', 'exit'] });
    expect(result).toContain(h1);
    expect(result).toContain(h2);
    expect(result).not.toContain(h3);
    expect(result).not.toContain(h4);
  });

  it('cancelAll stops matching handles', () => {
    const registry = new HandleRegistry();
    const h1 = makeHandle(['move']);
    const h2 = makeHandle(['move']);
    const h3 = makeHandle(['fade']);

    registry.register(h1);
    registry.register(h2);
    registry.register(h3);

    registry.cancelAll({ tag: 'move' }, { mode: 'freeze' });

    expect(h1.stop).toHaveBeenCalledWith({ mode: 'freeze' });
    expect(h2.stop).toHaveBeenCalledWith({ mode: 'freeze' });
    expect(h3.stop).not.toHaveBeenCalled();
  });

  it('cancelAll skips finished handles', () => {
    const registry = new HandleRegistry();
    const active = makeHandle(['group']);
    const finished = makeFinishedHandle(['group']);

    registry.register(active);
    registry.register(finished);

    registry.cancelAll({ tag: 'group' });

    expect(active.stop).toHaveBeenCalled();
    expect(finished.stop).not.toHaveBeenCalled();
  });

  it('pauseAll pauses matching handles', () => {
    const registry = new HandleRegistry();
    const h1 = makeHandle(['ui']);
    const h2 = makeHandle(['ui']);
    const h3 = makeHandle(['bg']);

    registry.register(h1);
    registry.register(h2);
    registry.register(h3);

    registry.pauseAll({ tag: 'ui' });

    expect(h1.pause).toHaveBeenCalled();
    expect(h2.pause).toHaveBeenCalled();
    expect(h3.pause).not.toHaveBeenCalled();
  });

  it('pauseAll skips finished handles', () => {
    const registry = new HandleRegistry();
    const active = makeHandle(['group']);
    const finished = makeFinishedHandle(['group']);

    registry.register(active);
    registry.register(finished);

    registry.pauseAll({ tag: 'group' });

    expect(active.pause).toHaveBeenCalled();
    expect(finished.pause).not.toHaveBeenCalled();
  });

  it('resumeAll resumes matching handles', () => {
    const registry = new HandleRegistry();
    const h1 = makeHandle(['ui']);
    const h2 = makeHandle(['bg']);

    registry.register(h1);
    registry.register(h2);

    registry.resumeAll({ tag: 'ui' });

    expect(h1.resume).toHaveBeenCalled();
    expect(h2.resume).not.toHaveBeenCalled();
  });

  it('unregister removes a handle', () => {
    const registry = new HandleRegistry();
    const h1 = makeHandle(['group']);
    const h2 = makeHandle(['group']);

    registry.register(h1);
    registry.register(h2);
    registry.unregister(h1);

    expect(registry.size).toBe(1);
    expect(registry.getHandles()).not.toContain(h1);
    expect(registry.getHandles()).toContain(h2);
  });

  it('clear removes all handles', () => {
    const registry = new HandleRegistry();
    registry.register(makeHandle(['a']));
    registry.register(makeHandle(['b']));

    registry.clear();

    expect(registry.size).toBe(0);
    expect(registry.getHandles()).toHaveLength(0);
  });

  it('getHandles returns all handles when no filter provided', () => {
    const registry = new HandleRegistry();
    const h1 = makeHandle(['a']);
    const h2 = makeHandle();

    registry.register(h1);
    registry.register(h2);

    const all = registry.getHandles();
    expect(all).toHaveLength(2);
  });

  it('tag and tags filters can be combined', () => {
    const registry = new HandleRegistry();
    const h1 = makeHandle(['a']);
    const h2 = makeHandle(['b']);
    const h3 = makeHandle(['c']);

    registry.register(h1);
    registry.register(h2);
    registry.register(h3);

    const result = registry.getHandles({ tag: 'a', tags: ['b'] });
    expect(result).toContain(h1);
    expect(result).toContain(h2);
    expect(result).not.toContain(h3);
  });
});
