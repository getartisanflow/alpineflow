// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockCtx } from './__test-utils';
import { createParticleMixin, resolveDurationMs } from './canvas-particles';
import type { FlowEdge } from '../../core/types';

// ── Mock engine ──────────────────────────────────────────────────────────────

vi.mock('../../animate/engine', () => ({
  engine: {
    register: vi.fn(() => ({ stop: vi.fn() })),
  },
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeEdge(id: string, overrides: Partial<FlowEdge> = {}): FlowEdge {
  return { id, source: 'a', target: 'b', ...overrides };
}

function makePathEl(totalLength = 200): SVGPathElement {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  el.setAttribute('d', 'M0,0 L100,100');
  (el as any).getTotalLength = vi.fn(() => totalLength);
  (el as any).getPointAtLength = vi.fn(() => ({ x: 0, y: 0 }));
  return el;
}

function makeGEl(): SVGGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGElement;
}

/** Get the single active particle from ctx, asserting it exists. */
function getActiveParticle(ctx: ReturnType<typeof mockCtx>) {
  const particles = [...ctx._activeParticles];
  expect(particles).toHaveLength(1);
  return particles[0];
}

// ═══════════════════════════════════════════════════════════════════════════════
// resolveDurationMs (unit tests on the exported helper)
// ═══════════════════════════════════════════════════════════════════════════════

describe('resolveDurationMs', () => {
  it('returns numeric duration directly as ms', () => {
    const result = resolveDurationMs({ duration: 500 }, 200, '2s');
    expect(result).toBe(500);
  });

  it('parses CSS second string', () => {
    const result = resolveDurationMs({ duration: '2s' }, 200, '1s');
    expect(result).toBe(2000);
  });

  it('parses CSS millisecond string', () => {
    const result = resolveDurationMs({ duration: '300ms' }, 200, '1s');
    expect(result).toBe(300);
  });

  it('falls through to fallback CSS string when no duration option', () => {
    const result = resolveDurationMs({}, 200, '3s');
    expect(result).toBe(3000);
  });

  it('computes duration from speed and path length', () => {
    // path 200 units, speed 100 units/s → 2000ms
    const result = resolveDurationMs({ speed: 100 }, 200, '2s');
    expect(result).toBe(2000);
  });

  it('speed takes precedence over duration', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // speed: 100, path: 400 → 4000ms; duration: 500 is ignored
    const result = resolveDurationMs({ speed: 100, duration: 500 }, 400, '2s');
    expect(result).toBe(4000);
    warnSpy.mockRestore();
  });

  it('logs a warning when both speed and duration are provided', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    resolveDurationMs({ speed: 100, duration: '1s' }, 200, '2s');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[AlpineFlow]'),
    );
    warnSpy.mockRestore();
  });

  it('ignores speed=0 and falls back to duration', () => {
    const result = resolveDurationMs({ speed: 0, duration: '1s' }, 200, '2s');
    expect(result).toBe(1000);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// particle duration resolution — integration via sendParticle
// ═══════════════════════════════════════════════════════════════════════════════

describe('particle duration resolution', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('accepts numeric duration in ms', () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];
    const pathEl = makePathEl(300);
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);
    (ctx.getEdgeElement as any).mockReturnValue(makeGEl());

    const mixin = createParticleMixin(ctx);
    mixin.sendParticle('e1', { duration: 800 });

    const particle = getActiveParticle(ctx);
    expect(particle.ms).toBe(800);
  });

  it('accepts CSS time string duration (existing behavior)', () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];
    const pathEl = makePathEl(300);
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);
    (ctx.getEdgeElement as any).mockReturnValue(makeGEl());

    const mixin = createParticleMixin(ctx);
    mixin.sendParticle('e1', { duration: '2s' });

    const particle = getActiveParticle(ctx);
    expect(particle.ms).toBe(2000);
  });

  it('speed computes duration from path length', () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];
    // Path length = 200, speed = 100 → 200/100*1000 = 2000ms
    const pathEl = makePathEl(200);
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);
    (ctx.getEdgeElement as any).mockReturnValue(makeGEl());

    const mixin = createParticleMixin(ctx);
    mixin.sendParticle('e1', { speed: 100 });

    const particle = getActiveParticle(ctx);
    expect(particle.ms).toBe(2000);
  });

  it('speed takes precedence when both speed and duration given', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];
    // Path length = 400, speed = 100 → 4000ms; duration: 500 is ignored
    const pathEl = makePathEl(400);
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);
    (ctx.getEdgeElement as any).mockReturnValue(makeGEl());

    const mixin = createParticleMixin(ctx);
    mixin.sendParticle('e1', { speed: 100, duration: 500 });

    const particle = getActiveParticle(ctx);
    expect(particle.ms).toBe(4000);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[AlpineFlow]'));

    warnSpy.mockRestore();
  });

  it('falls back to edge animationDuration when no options set', () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1', { animationDuration: '3s' })];
    const pathEl = makePathEl(200);
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);
    (ctx.getEdgeElement as any).mockReturnValue(makeGEl());

    const mixin = createParticleMixin(ctx);
    mixin.sendParticle('e1');

    const particle = getActiveParticle(ctx);
    expect(particle.ms).toBe(3000);
  });

  it('defaults to 2000ms when no duration or speed is given', () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];
    const pathEl = makePathEl(200);
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);
    (ctx.getEdgeElement as any).mockReturnValue(makeGEl());

    const mixin = createParticleMixin(ctx);
    mixin.sendParticle('e1');

    const particle = getActiveParticle(ctx);
    expect(particle.ms).toBe(2000);
  });
});
