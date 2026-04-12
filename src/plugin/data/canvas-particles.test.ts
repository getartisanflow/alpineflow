// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { mockCtx } from './__test-utils';
import { createParticleMixin, resolveDurationMs } from './canvas-particles';
import type { FlowEdge, FlowNode } from '../../core/types';
import { registerParticleRenderer } from '../../animate/particle-renderers';

// ── Mock engine ──────────────────────────────────────────────────────────────

vi.mock('../../animate/engine', () => ({
  engine: {
    register: vi.fn(() => ({ stop: vi.fn() })),
  },
}));

// ── Polyfill SVG path methods & register circle renderer ─────────────────────

// jsdom doesn't implement getTotalLength / getPointAtLength on SVG paths.
// Wrap createElementNS to add stubs on any <path> element.
const _origCreateElementNS = document.createElementNS.bind(document);
document.createElementNS = function (ns: string, tag: string) {
  const el = _origCreateElementNS(ns, tag);
  if (tag === 'path') {
    (el as any).getTotalLength = () => 200;
    (el as any).getPointAtLength = () => ({ x: 0, y: 0 });
  }
  return el;
} as typeof document.createElementNS;

beforeAll(() => {
  registerParticleRenderer('circle', {
    create(svgLayer, options) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      el.setAttribute('r', String(options.size ?? 4));
      el.setAttribute('fill', options.color ?? '#8B5CF6');
      el.classList.add('flow-edge-particle');
      svgLayer.appendChild(el);
      return el;
    },
    update(el, { x, y }) {
      el.setAttribute('cx', String(x));
      el.setAttribute('cy', String(y));
    },
    destroy(el) {
      el.remove();
    },
  });
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeEdge(id: string, overrides: Partial<FlowEdge> = {}): FlowEdge {
  return { id, source: 'a', target: 'b', ...overrides };
}

function makeNode(id: string, overrides: Partial<FlowNode> = {}): FlowNode {
  return {
    id,
    position: { x: 100, y: 200 },
    data: {},
    dimensions: { width: 150, height: 40 },
    ...overrides,
  };
}

function makeSvgLayer(): SVGSVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', 'svg');
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

// ═══════════════════════════════════════════════════════════════════════════════
// sendParticleAlongPath
// ═══════════════════════════════════════════════════════════════════════════════

describe('sendParticleAlongPath', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fires a particle along an arbitrary SVG path', () => {
    const ctx = mockCtx();
    const svgLayer = makeSvgLayer();
    (ctx.getEdgeSvgElement as any).mockReturnValue(svgLayer);

    const mixin = createParticleMixin(ctx);
    const handle = mixin.sendParticleAlongPath('M 0 0 L 200 200');

    expect(handle).toBeDefined();
    expect(handle!.getCurrentPosition).toBeTypeOf('function');
    expect(handle!.stop).toBeTypeOf('function');
    expect(handle!.finished).toBeInstanceOf(Promise);
    expect(ctx._activeParticles.size).toBe(1);
  });

  it('removes the temp path after particle completes via stop()', () => {
    const ctx = mockCtx();
    const svgLayer = makeSvgLayer();
    (ctx.getEdgeSvgElement as any).mockReturnValue(svgLayer);

    const onComplete = vi.fn();
    const mixin = createParticleMixin(ctx);
    const handle = mixin.sendParticleAlongPath('M 0 0 L 100 100', { onComplete });

    expect(handle).toBeDefined();

    // The temp path should be in the SVG layer (hidden)
    const tempPaths = svgLayer.querySelectorAll('path');
    expect(tempPaths.length).toBe(1);
    expect(tempPaths[0].style.display).toBe('none');
    expect(tempPaths[0].getAttribute('d')).toBe('M 0 0 L 100 100');

    // Stop the particle
    handle!.stop();

    // Temp path should be removed
    expect(svgLayer.querySelectorAll('path').length).toBe(0);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('removes the temp path on natural completion via onComplete', () => {
    const ctx = mockCtx();
    const svgLayer = makeSvgLayer();
    (ctx.getEdgeSvgElement as any).mockReturnValue(svgLayer);

    const mixin = createParticleMixin(ctx);
    mixin.sendParticleAlongPath('M 0 0 L 100 100');

    // Grab the particle and manually trigger onComplete (simulating engine completion)
    const particle = [...ctx._activeParticles][0];
    expect(particle).toBeDefined();
    particle.onComplete?.();

    // Temp path should be removed from SVG layer
    expect(svgLayer.querySelectorAll('path').length).toBe(0);
  });

  it('returns undefined when SVG layer is unavailable', () => {
    const ctx = mockCtx();
    // getEdgeSvgElement returns null by default in mockCtx

    const mixin = createParticleMixin(ctx);
    const handle = mixin.sendParticleAlongPath('M 0 0 L 100 100');

    expect(handle).toBeUndefined();
    expect(ctx._activeParticles.size).toBe(0);
  });

  it('injects a hidden temp path element into the SVG layer', () => {
    const ctx = mockCtx();
    const svgLayer = makeSvgLayer();
    (ctx.getEdgeSvgElement as any).mockReturnValue(svgLayer);

    const mixin = createParticleMixin(ctx);
    mixin.sendParticleAlongPath('M 10 20 L 300 400');

    const paths = svgLayer.querySelectorAll('path');
    expect(paths.length).toBe(1);
    expect(paths[0].getAttribute('d')).toBe('M 10 20 L 300 400');
    expect(paths[0].style.display).toBe('none');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// sendParticleBetween
// ═══════════════════════════════════════════════════════════════════════════════

describe('sendParticleBetween', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fires a particle between two node centers', () => {
    const ctx = mockCtx();
    const svgLayer = makeSvgLayer();
    (ctx.getEdgeSvgElement as any).mockReturnValue(svgLayer);

    const nodeA = makeNode('a', { position: { x: 0, y: 0 }, dimensions: { width: 100, height: 40 } });
    const nodeB = makeNode('b', { position: { x: 200, y: 100 }, dimensions: { width: 100, height: 40 } });
    (ctx.getNode as any).mockImplementation((id: string) => {
      if (id === 'a') return nodeA;
      if (id === 'b') return nodeB;
      return undefined;
    });

    const mixin = createParticleMixin(ctx);
    const handle = mixin.sendParticleBetween('a', 'b');

    expect(handle).toBeDefined();
    expect(handle!.getCurrentPosition).toBeTypeOf('function');
    expect(ctx._activeParticles.size).toBe(1);

    // Center of A: (0 + 100/2, 0 + 40/2) = (50, 20)
    // Center of B: (200 + 100/2, 100 + 40/2) = (250, 120)
    const tempPath = svgLayer.querySelector('path');
    expect(tempPath).not.toBeNull();
    expect(tempPath!.getAttribute('d')).toBe('M 50 20 L 250 120');
  });

  it('returns undefined for missing source node', () => {
    const ctx = mockCtx();
    const svgLayer = makeSvgLayer();
    (ctx.getEdgeSvgElement as any).mockReturnValue(svgLayer);

    const nodeB = makeNode('b');
    (ctx.getNode as any).mockImplementation((id: string) => {
      if (id === 'b') return nodeB;
      return undefined;
    });

    const mixin = createParticleMixin(ctx);
    const handle = mixin.sendParticleBetween('nonexistent', 'b');

    expect(handle).toBeUndefined();
    expect(ctx._activeParticles.size).toBe(0);
  });

  it('returns undefined for missing target node', () => {
    const ctx = mockCtx();
    const svgLayer = makeSvgLayer();
    (ctx.getEdgeSvgElement as any).mockReturnValue(svgLayer);

    const nodeA = makeNode('a');
    (ctx.getNode as any).mockImplementation((id: string) => {
      if (id === 'a') return nodeA;
      return undefined;
    });

    const mixin = createParticleMixin(ctx);
    const handle = mixin.sendParticleBetween('a', 'nonexistent');

    expect(handle).toBeUndefined();
    expect(ctx._activeParticles.size).toBe(0);
  });

  it('uses default dimensions when node has no dimensions', () => {
    const ctx = mockCtx();
    const svgLayer = makeSvgLayer();
    (ctx.getEdgeSvgElement as any).mockReturnValue(svgLayer);

    const nodeA = makeNode('a', { position: { x: 0, y: 0 }, dimensions: undefined });
    const nodeB = makeNode('b', { position: { x: 200, y: 100 }, dimensions: undefined });
    (ctx.getNode as any).mockImplementation((id: string) => {
      if (id === 'a') return nodeA;
      if (id === 'b') return nodeB;
      return undefined;
    });

    const mixin = createParticleMixin(ctx);
    const handle = mixin.sendParticleBetween('a', 'b');

    expect(handle).toBeDefined();

    // Default dimensions: width=150, height=40
    // Center of A: (0 + 150/2, 0 + 40/2) = (75, 20)
    // Center of B: (200 + 150/2, 100 + 40/2) = (275, 120)
    const tempPath = svgLayer.querySelector('path');
    expect(tempPath!.getAttribute('d')).toBe('M 75 20 L 275 120');
  });

  it('returns undefined when SVG layer is unavailable', () => {
    const ctx = mockCtx();
    // getEdgeSvgElement returns null by default

    const nodeA = makeNode('a');
    const nodeB = makeNode('b');
    (ctx.getNode as any).mockImplementation((id: string) => {
      if (id === 'a') return nodeA;
      if (id === 'b') return nodeB;
      return undefined;
    });

    const mixin = createParticleMixin(ctx);
    const handle = mixin.sendParticleBetween('a', 'b');

    expect(handle).toBeUndefined();
  });
});
