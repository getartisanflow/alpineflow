import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AnimationEngine } from '../../animate/engine';
import type { ParticleHandle, XYPosition, FlowAnimationHandle } from '../../core/types';

/**
 * Minimal SVG path mock — getPointAtLength returns linear interpolation
 * along x-axis from 0 to 100, getTotalLength returns 100.
 */
function makeMockPathEl(): SVGPathElement {
  const el = {
    getTotalLength: () => 100,
    getPointAtLength: (len: number) => ({ x: len, y: 0 }),
    getAttribute: (attr: string) => {
      if (attr === 'd') return 'M0,0 L100,0';
      return null;
    },
  };
  return el as unknown as SVGPathElement;
}

/** Minimal SVG group element mock (for gEl.appendChild). */
function makeMockGEl() {
  const children: any[] = [];
  return {
    appendChild(child: any) { children.push(child); child._parent = this; },
    children,
  };
}

/**
 * Build a minimal canvas-like object that has the particle + follow methods
 * extracted from flow-canvas.ts, wired to a real AnimationEngine.
 */
function makeParticleCanvas() {
  const eng = new AnimationEngine();
  const pathEl = makeMockPathEl();
  const gEl = makeMockGEl();

  const edges = [{ id: 'e1', source: 'a', target: 'b' }];

  const canvas = {
    edges,
    viewport: { x: 0, y: 0, zoom: 1 } as { x: number; y: number; zoom: number },
    _container: { clientWidth: 800, clientHeight: 600 },
    _activeParticles: new Set<any>(),
    _particleEngineHandle: null as any,
    _followHandle: null as any,
    _containerStyles: {
      getPropertyValue: () => '',
    },
    _edgeSvgElements: new Map<string, any>(),

    getNode(id: string) {
      if (id === 'a') return { id: 'a', position: { x: 0, y: 0 }, data: {}, dimensions: { width: 100, height: 40 } };
      if (id === 'b') return { id: 'b', position: { x: 200, y: 0 }, data: {}, dimensions: { width: 100, height: 40 } };
      return undefined;
    },

    getAbsolutePosition(nodeId: string): XYPosition {
      const n = this.getNode(nodeId);
      return n ? { ...n.position } : { x: 0, y: 0 };
    },

    getEdgePathElement(_edgeId: string) { return pathEl; },
    getEdgeElement(_edgeId: string) { return gEl; },

    _tickParticles(): boolean {
      const now = performance.now();

      for (const particle of this._activeParticles) {
        const progress = (now - particle.t0) / particle.ms;
        if (progress >= 1 || !particle.circle._parent) {
          clearTimeout(particle.safetyTimer);
          // Simulate circle.remove()
          particle.circle._parent = null;
          if (typeof particle.onComplete === 'function') {
            particle.onComplete();
          }
          this._activeParticles.delete(particle);
          continue;
        }

        const len = particle.pathEl.getTotalLength();
        const pt = particle.pathEl.getPointAtLength(progress * len);
        particle.circle.setAttribute('cx', String(pt.x));
        particle.circle.setAttribute('cy', String(pt.y));
      }

      if (this._activeParticles.size === 0) {
        this._particleEngineHandle = null;
        return true;
      }
      return false;
    },

    sendParticle(edgeId: string, options: Record<string, any> = {}): ParticleHandle | undefined {
      const svg = this._edgeSvgElements.get(edgeId);
      if (svg && svg.style?.display === 'none') return undefined;

      const edge = this.edges.find((e: any) => e.id === edgeId);
      if (!edge) return undefined;

      const pe = this.getEdgePathElement(edgeId);
      if (!pe) return undefined;
      if (!pe.getAttribute('d')) return undefined;

      const ge = this.getEdgeElement(edgeId);
      if (!ge) return undefined;

      const duration = options.duration ?? '2s';
      const ms = parseDurationMs(duration);

      // Create mock circle
      const attrs: Record<string, string> = {};
      const circle = {
        setAttribute(k: string, v: string) { attrs[k] = v; },
        getAttribute(k: string) { return attrs[k] ?? null; },
        classList: { add() {} },
        remove() { this._parent = null; },
        _parent: null as any,
      };
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', '#64748b');

      const startPt = pe.getPointAtLength(0);
      circle.setAttribute('cx', String(startPt.x));
      circle.setAttribute('cy', String(startPt.y));
      ge.appendChild(circle);

      const t0 = performance.now();

      let resolveHandleFinished: () => void;
      const handleFinished = new Promise<void>((r) => { resolveHandleFinished = r; });

      const wrappedOnComplete = () => {
        options.onComplete?.();
        resolveHandleFinished!();
      };

      const safetyTimer = setTimeout(() => {
        this._activeParticles.delete(particle);
        circle.remove();
        wrappedOnComplete();
      }, ms * 2);

      const particle = { circle, pathEl: pe, t0, ms, safetyTimer, onComplete: wrappedOnComplete };
      this._activeParticles.add(particle);

      if (!this._particleEngineHandle) {
        this._particleEngineHandle = eng.register(() => this._tickParticles());
      }

      const self = this;
      const handle: ParticleHandle = {
        getCurrentPosition(): XYPosition | null {
          if (!self._activeParticles.has(particle)) return null;
          const cx = parseFloat(circle.getAttribute('cx') || '0');
          const cy = parseFloat(circle.getAttribute('cy') || '0');
          return { x: cx, y: cy };
        },
        stop() {
          if (!self._activeParticles.has(particle)) return;
          clearTimeout(safetyTimer);
          circle.remove();
          self._activeParticles.delete(particle);
          wrappedOnComplete();
        },
        get finished() { return handleFinished; },
      };

      return handle;
    },

    follow(
      target: string | FlowAnimationHandle | ParticleHandle | XYPosition,
      options: { zoom?: number } = {},
    ): FlowAnimationHandle {
      if (this._followHandle) {
        this._followHandle.stop();
      }

      let resolveFinished: () => void;
      const finished = new Promise<void>((r) => { resolveFinished = r; });
      let stopped = false;
      const self = this;
      const targetZoom = options.zoom;

      const engineHandle = eng.register(() => {
        if (stopped) return true;

        let pos: XYPosition | null = null;

        if (typeof target === 'string') {
          const node = self.getNode(target);
          if (node) {
            pos = { ...node.position };
            if (node.dimensions) {
              pos.x += node.dimensions.width / 2;
              pos.y += node.dimensions.height / 2;
            }
          }
        } else if ('getCurrentPosition' in target && typeof (target as any).getCurrentPosition === 'function') {
          const particlePos = (target as ParticleHandle).getCurrentPosition();
          if (particlePos) {
            pos = particlePos;
          } else {
            stopped = true;
            engineHandle.stop();
            self._followHandle = null;
            resolveFinished!();
            return true;
          }
        } else if ('x' in target && 'y' in target) {
          pos = target as XYPosition;
        }

        if (!pos) return false;

        const dims = self._container
          ? { width: self._container.clientWidth, height: self._container.clientHeight }
          : { width: 800, height: 600 };
        const zoom = targetZoom ?? self.viewport.zoom;
        const vpX = dims.width / 2 - pos.x * zoom;
        const vpY = dims.height / 2 - pos.y * zoom;

        const lerp = 0.08;
        self.viewport.x += (vpX - self.viewport.x) * lerp;
        self.viewport.y += (vpY - self.viewport.y) * lerp;
        if (targetZoom) {
          self.viewport.zoom += (targetZoom - self.viewport.zoom) * lerp;
        }

        return false;
      });

      this._followHandle = engineHandle;

      const handle: FlowAnimationHandle = {
        pause: () => {},
        resume: () => {},
        stop: () => {
          stopped = true;
          engineHandle.stop();
          self._followHandle = null;
          resolveFinished!();
        },
        reverse: () => {},
        get finished() { return finished; },
      };

      return handle;
    },
  };

  return { canvas, engine: eng };
}

function parseDurationMs(dur: string): number {
  const match = dur.match(/^([\d.]+)(ms|s)?$/);
  if (!match) return 2000;
  const val = parseFloat(match[1]);
  return match[2] === 'ms' ? val : val * 1000;
}

async function advanceTimers(ms: number, stepMs = 16): Promise<void> {
  const steps = Math.ceil(ms / stepMs) + 1;
  for (let i = 0; i < steps; i++) {
    await vi.advanceTimersByTimeAsync(stepMs);
  }
}

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe('ParticleHandle', () => {
  it('sendParticle returns handle with correct shape', () => {
    const { canvas } = makeParticleCanvas();
    const handle = canvas.sendParticle('e1', { duration: '1s' });

    expect(handle).toBeDefined();
    expect(typeof handle!.getCurrentPosition).toBe('function');
    expect(typeof handle!.stop).toBe('function');
    expect(handle!.finished).toBeInstanceOf(Promise);
  });

  it('getCurrentPosition reads cx/cy from circle', () => {
    const { canvas } = makeParticleCanvas();
    const handle = canvas.sendParticle('e1', { duration: '2s' })!;

    // Initially at start of path (x=0, y=0)
    const pos = handle.getCurrentPosition();
    expect(pos).not.toBeNull();
    expect(pos!.x).toBe(0);
    expect(pos!.y).toBe(0);
  });

  it('getCurrentPosition updates as particle moves', async () => {
    const { canvas } = makeParticleCanvas();
    const handle = canvas.sendParticle('e1', { duration: '2s' })!;

    // Advance time so particle moves along path
    await advanceTimers(1000);

    const pos = handle.getCurrentPosition();
    expect(pos).not.toBeNull();
    expect(pos!.x).toBeGreaterThan(0);
  });

  it('getCurrentPosition returns null after particle completes', async () => {
    const { canvas } = makeParticleCanvas();
    const handle = canvas.sendParticle('e1', { duration: '500ms' })!;

    await advanceTimers(600);

    expect(handle.getCurrentPosition()).toBeNull();
  });

  it('stop() removes particle immediately', () => {
    const { canvas } = makeParticleCanvas();
    const handle = canvas.sendParticle('e1', { duration: '5s' })!;

    expect(canvas._activeParticles.size).toBe(1);
    handle.stop();
    expect(canvas._activeParticles.size).toBe(0);
    expect(handle.getCurrentPosition()).toBeNull();
  });

  it('finished resolves on natural completion', async () => {
    const { canvas } = makeParticleCanvas();
    const handle = canvas.sendParticle('e1', { duration: '500ms' })!;

    let resolved = false;
    handle.finished.then(() => { resolved = true; });

    await advanceTimers(300);
    expect(resolved).toBe(false);

    await advanceTimers(400);
    // Flush microtasks
    await vi.advanceTimersByTimeAsync(0);
    expect(resolved).toBe(true);
  });

  it('finished resolves on stop()', async () => {
    const { canvas } = makeParticleCanvas();
    const handle = canvas.sendParticle('e1', { duration: '5s' })!;

    let resolved = false;
    handle.finished.then(() => { resolved = true; });

    handle.stop();
    await vi.advanceTimersByTimeAsync(0);
    expect(resolved).toBe(true);
  });

  it('sendParticle returns undefined for missing edge', () => {
    const { canvas } = makeParticleCanvas();
    const handle = canvas.sendParticle('nonexistent');
    expect(handle).toBeUndefined();
  });

  it('onComplete callback is still called', async () => {
    const { canvas } = makeParticleCanvas();
    const onComplete = vi.fn();
    const handle = canvas.sendParticle('e1', { duration: '500ms', onComplete })!;

    await advanceTimers(600);
    await vi.advanceTimersByTimeAsync(0);

    expect(onComplete).toHaveBeenCalledOnce();
  });
});

describe('follow() with ParticleHandle', () => {
  it('viewport lerps toward particle position', async () => {
    const { canvas } = makeParticleCanvas();
    const handle = canvas.sendParticle('e1', { duration: '2s' })!;

    canvas.viewport.x = 0;
    canvas.viewport.y = 0;

    const followHandle = canvas.follow(handle);

    // Advance so particle moves and follow updates viewport
    await advanceTimers(500);

    const pos = handle.getCurrentPosition();
    expect(pos).not.toBeNull();

    // Viewport should have shifted (lerp toward centering on particle)
    // The exact value depends on lerp factor, just verify it moved
    expect(canvas.viewport.x !== 0 || canvas.viewport.y !== 0).toBe(true);

    followHandle.stop();
  });

  it('auto-stops when particle completes', async () => {
    const { canvas } = makeParticleCanvas();
    const handle = canvas.sendParticle('e1', { duration: '500ms' })!;

    let followFinished = false;
    const followHandle = canvas.follow(handle);
    followHandle.finished.then(() => { followFinished = true; });

    // Let particle complete
    await advanceTimers(600);
    // One more tick for follow to detect null position
    await advanceTimers(50);
    await vi.advanceTimersByTimeAsync(0);

    expect(handle.getCurrentPosition()).toBeNull();
    expect(followFinished).toBe(true);
  });

  it('follow with zoom option adjusts viewport zoom', async () => {
    const { canvas } = makeParticleCanvas();
    const handle = canvas.sendParticle('e1', { duration: '2s' })!;

    canvas.viewport.zoom = 1;
    const followHandle = canvas.follow(handle, { zoom: 1.5 });

    await advanceTimers(200);

    // Zoom should have started lerping toward 1.5
    expect(canvas.viewport.zoom).toBeGreaterThan(1);
    expect(canvas.viewport.zoom).toBeLessThan(1.5);

    followHandle.stop();
  });
});
