// ============================================================================
// canvas-particles — Particle system mixin for flow-canvas
//
// Public API: sendParticle, sendParticleAlongPath, sendParticleBetween.
// Internal:   _tickParticles, _fireParticleOnPath, destroyParticles.
//
// Manages SVG particles that travel along edge paths via
// getPointAtLength. Particles share a single AnimationEngine registration
// so multiple concurrent particles use one tick callback.
//
// Cross-mixin deps (via ctx): getEdge, getNode, getEdgePathElement,
//   getEdgeElement, getEdgeSvgElement, _edgeSvgElements, _containerStyles,
//   _activeParticles, _particleEngineHandle.
// ============================================================================

import type { CanvasContext } from './canvas-context';
import type {
  BurstOptions,
  ConvergingHandle,
  ConvergingOptions,
  ParticleBurstHandle,
  ParticleHandle,
  ParticleOptions,
  ParticleRenderState,
  XYPosition,
} from '../../core/types';
import { engine } from '../../animate/engine';
import { debug } from '../../core/debug';
import { CONNECTION_ACTIVE_COLOR } from '../../core/constants';
import { getParticleRenderer } from '../../animate/particle-renderers';

// ── Local utility ───────────────────────────────────────────────────────────

/** Parse a CSS duration string (e.g. '2s', '300ms') to milliseconds. */
function parseDurationMs(dur: string): number {
  const match = dur.match(/^([\d.]+)(ms|s)?$/);
  if (!match) return 2000;
  const val = parseFloat(match[1]);
  return match[2] === 'ms' ? val : val * 1000;
}

/**
 * Resolve final particle duration in ms from options, path length, and fallback.
 *
 * Priority:
 *  1. `speed` (SVG units/s) → `pathLength / speed * 1000`. Wins over `duration`.
 *  2. `duration` as a number → treated directly as milliseconds.
 *  3. `duration` as a CSS time string → parsed via `parseDurationMs`.
 *  4. `fallback` CSS time string.
 */
export function resolveDurationMs(
  options: ParticleOptions,
  pathLength: number,
  fallback: string,
): number {
  if (options.speed !== undefined && options.speed > 0) {
    if (options.duration !== undefined) {
      console.warn('[AlpineFlow] Both speed and duration provided for particle; speed takes precedence.');
    }
    return (pathLength / options.speed) * 1000;
  }

  const raw = options.duration ?? fallback;
  if (typeof raw === 'number') {
    return raw;
  }
  return parseDurationMs(raw);
}

// ── Mixin factory ───────────────────────────────────────────────────────────

export function createParticleMixin(ctx: CanvasContext) {

  // ── Shared core: fire particle on a path element (closure-scoped) ────

  /**
   * Core particle-firing logic shared by sendParticle, sendParticleAlongPath,
   * and sendParticleBetween. Creates a particle element, registers it with
   * the engine, and returns a handle.
   *
   * @param pathEl   - SVG path element to travel along
   * @param svgLayer - SVG element to host the particle element
   * @param options  - Particle visual/behavioral options
   * @param extra    - Optional hooks: onComplete wrapper, size/color/duration overrides
   */
  function _fireParticleOnPath(
    pathEl: SVGPathElement,
    svgLayer: SVGElement,
    options: ParticleOptions = {},
    extra: {
      size?: number;
      color?: string;
      durationFallback?: string;
      wrapOnComplete?: (original: () => void) => () => void;
    } = {},
  ): ParticleHandle | undefined {
    // Resolve renderer
    const rendererName = options.renderer ?? 'circle';
    const renderer = getParticleRenderer(rendererName);
    if (!renderer) {
      debug('particle', `_fireParticleOnPath: unknown renderer "${rendererName}"`);
      return undefined;
    }

    const styles = ctx._containerStyles;

    const size = options.size
      ?? extra.size
      ?? (parseFloat(styles?.getPropertyValue('--flow-edge-dot-size').trim() ?? '4') || 4);
    const color = options.color
      ?? extra.color
      ?? styles?.getPropertyValue('--flow-edge-dot-fill').trim()
      ?? CONNECTION_ACTIVE_COLOR;
    const durationFallback = extra.durationFallback
      ?? styles?.getPropertyValue('--flow-edge-dot-duration').trim()
      ?? '2s';

    const pathLength = pathEl.getTotalLength();
    const ms = resolveDurationMs(options, pathLength, durationFallback);

    // Delegate element creation to the renderer
    const resolvedOptions: ParticleOptions = { ...options, size, color };
    const el = renderer.create(svgLayer, resolvedOptions);

    // Position at path start immediately — no origin flash.
    const startPt = pathEl.getPointAtLength(0);
    const initialState: ParticleRenderState = {
      x: startPt.x,
      y: startPt.y,
      progress: 0,
      velocity: { x: 0, y: 0 },
      pathLength,
      elapsed: 0,
    };
    renderer.update(el, initialState);

    // Promise for handle.finished
    let resolveHandleFinished: () => void;
    const handleFinished = new Promise<void>((r) => { resolveHandleFinished = r; });

    const baseOnComplete = () => {
      if (typeof options.onComplete === 'function') {
        options.onComplete();
      }
      resolveHandleFinished!();
    };

    const wrappedOnComplete = extra.wrapOnComplete
      ? extra.wrapOnComplete(baseOnComplete)
      : baseOnComplete;

    const particle = {
      element: el,
      renderer,
      pathEl,
      startElapsed: -1,    // set on first engine tick
      ms,
      onComplete: wrappedOnComplete,
      currentPosition: { x: startPt.x, y: startPt.y },
    };
    ctx._activeParticles.add(particle);

    // Register on shared AnimationEngine if not already running
    if (!ctx._particleEngineHandle) {
      ctx._particleEngineHandle = engine.register((elapsed) => ctx._tickParticles(elapsed));
    }

    const handle: ParticleHandle = {
      getCurrentPosition(): XYPosition | null {
        if (!ctx._activeParticles.has(particle)) return null;
        return { ...particle.currentPosition };
      },
      stop() {
        if (!ctx._activeParticles.has(particle)) return;
        particle.renderer.destroy(particle.element);
        ctx._activeParticles.delete(particle);
        wrappedOnComplete();
      },
      get finished() { return handleFinished; },
    };

    return handle;
  }

  /**
   * Fire a particle along an arbitrary SVG path string.
   * Closure-scoped so both sendParticleAlongPath and sendParticleBetween
   * can call it without `this` binding issues.
   */
  function _sendParticleAlongPath(svgPath: string, options: ParticleOptions = {}): ParticleHandle | undefined {
    const svgLayer = ctx.getEdgeSvgElement?.();
    if (!svgLayer) {
      debug('particle', 'sendParticleAlongPath: SVG layer unavailable');
      return undefined;
    }

    // Create a temporary hidden <path> element for getPointAtLength
    const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempPath.setAttribute('d', svgPath);
    tempPath.style.display = 'none';
    svgLayer.appendChild(tempPath);

    const handle = _fireParticleOnPath(tempPath, svgLayer, options, {
      wrapOnComplete: (original) => () => {
        original();
        tempPath.remove();
      },
    });

    if (!handle) {
      // Cleanup temp path if _fireParticleOnPath failed
      tempPath.remove();
      return undefined;
    }

    debug('particle', 'sendParticleAlongPath', { path: svgPath.slice(0, 40) });

    return handle;
  }

  return {
    // ── Particle tick loop ────────────────────────────────────────────────

    /**
     * Engine tick callback — processes all active particles in one pass.
     * Receives `elapsed` (ms since engine registration) from the engine.
     * Returns true to unregister from engine when all particles are done.
     */
    _tickParticles(elapsed: number): boolean {
      const lengthCache = new Map<SVGPathElement, number>();

      for (const particle of ctx._activeParticles) {
        // Set startElapsed on first tick (deferred from sendParticle)
        if (particle.startElapsed < 0) {
          particle.startElapsed = elapsed;
        }

        const progress = (elapsed - particle.startElapsed) / particle.ms;

        // Complete particle if progress finished or if the DOM element was detached.
        if (progress >= 1 || !particle.element.parentNode) {
          particle.renderer.destroy(particle.element);
          if (typeof particle.onComplete === 'function') {
            particle.onComplete();
          }
          ctx._activeParticles.delete(particle);
          continue;
        }

        let len = lengthCache.get(particle.pathEl);
        if (len === undefined) {
          len = particle.pathEl.getTotalLength();
          lengthCache.set(particle.pathEl, len);
        }

        const pt = particle.pathEl.getPointAtLength(progress * len);

        // Compute render state for the pluggable renderer
        const renderState: ParticleRenderState = {
          x: pt.x,
          y: pt.y,
          progress,
          velocity: {
            x: pt.x - particle.currentPosition.x,
            y: pt.y - particle.currentPosition.y,
          },
          pathLength: len,
          elapsed: elapsed - particle.startElapsed,
        };

        particle.renderer.update(particle.element, renderState);

        // Track position internally so getCurrentPosition() doesn't need DOM reads
        particle.currentPosition = { x: pt.x, y: pt.y };
      }

      // Return true to unregister from engine when all particles are done
      if (ctx._activeParticles.size === 0) {
        ctx._particleEngineHandle = null;
        return true;
      }
      return false;
    },

    // ── Send particle along edge ──────────────────────────────────────────

    /**
     * Fire a particle along an edge path. The particle is an SVG element
     * that follows the edge's `<path>` element using `getPointAtLength`.
     */
    sendParticle(edgeId: string, options: ParticleOptions = {}): ParticleHandle | undefined {
      // Skip particles on culled (hidden) edges — zero wasted work off-screen
      const svg = ctx._edgeSvgElements.get(edgeId);
      if (svg && svg.style.display === 'none') return undefined;

      const edge = ctx.getEdge(edgeId);
      if (!edge) {
        debug('particle', `sendParticle: edge "${edgeId}" not found`);
        return undefined;
      }

      const pathEl = ctx.getEdgePathElement(edgeId);
      if (!pathEl) {
        debug('particle', `sendParticle: no path element for edge "${edgeId}"`);
        return undefined;
      }

      const pathD = pathEl.getAttribute('d');
      if (!pathD) {
        debug('particle', `sendParticle: edge "${edgeId}" path has no d attribute`);
        return undefined;
      }

      const gEl = ctx.getEdgeElement(edgeId);
      if (!gEl) return undefined;

      // Resolve cascade: options -> edge properties -> CSS variables
      const styles = ctx._containerStyles;

      const size = options.size
        ?? edge.particleSize
        ?? (parseFloat(styles?.getPropertyValue('--flow-edge-dot-size').trim() ?? '4') || 4);
      const color = options.color
        ?? edge.particleColor
        ?? styles?.getPropertyValue('--flow-edge-dot-fill').trim()
        ?? CONNECTION_ACTIVE_COLOR;
      const durationFallback = edge.animationDuration
        ?? styles?.getPropertyValue('--flow-edge-dot-duration').trim()
        ?? '2s';

      const handle = _fireParticleOnPath(pathEl, gEl as SVGElement, options, {
        size,
        color,
        durationFallback,
      });

      if (handle) {
        debug('particle', `sendParticle on edge "${edgeId}"`, { size, color, duration: options.duration });
      }

      return handle;
    },

    // ── Send particle along arbitrary SVG path ───────────────────────────

    /**
     * Fire a particle along an arbitrary SVG path string, not tied to an
     * existing edge. A temporary invisible `<path>` element is injected
     * into the edge SVG layer and removed when the particle finishes.
     */
    sendParticleAlongPath(svgPath: string, options: ParticleOptions = {}): ParticleHandle | undefined {
      return _sendParticleAlongPath(svgPath, options);
    },

    // ── Send particle between two nodes ──────────────────────────────────

    /**
     * Fire a particle along a straight line between two node centers.
     * Delegates to sendParticleAlongPath after computing the SVG path.
     */
    sendParticleBetween(sourceNodeId: string, targetNodeId: string, options: ParticleOptions = {}): ParticleHandle | undefined {
      const sourceNode = ctx.getNode(sourceNodeId);
      if (!sourceNode) {
        debug('particle', `sendParticleBetween: source node "${sourceNodeId}" not found`);
        return undefined;
      }

      const targetNode = ctx.getNode(targetNodeId);
      if (!targetNode) {
        debug('particle', `sendParticleBetween: target node "${targetNodeId}" not found`);
        return undefined;
      }

      // Compute center positions
      const sx = sourceNode.position.x + (sourceNode.dimensions?.width ?? 150) / 2;
      const sy = sourceNode.position.y + (sourceNode.dimensions?.height ?? 40) / 2;
      const tx = targetNode.position.x + (targetNode.dimensions?.width ?? 150) / 2;
      const ty = targetNode.position.y + (targetNode.dimensions?.height ?? 40) / 2;

      const pathD = `M ${sx} ${sy} L ${tx} ${ty}`;

      debug('particle', `sendParticleBetween "${sourceNodeId}" -> "${targetNodeId}"`, { path: pathD });

      return _sendParticleAlongPath(pathD, options);
    },

    // ── Burst: sequenced multi-particle emission ─────────────────────────

    /**
     * Fire multiple particles along a single edge with staggered timing.
     * An optional `variant` function customizes each particle individually.
     */
    sendParticleBurst(edgeId: string, options: BurstOptions): ParticleBurstHandle {
      const { count, stagger = 100, variant, ...baseOptions } = options;
      const handles: (ParticleHandle | undefined)[] = [];
      const pendingTimers: ReturnType<typeof setTimeout>[] = [];

      for (let i = 0; i < count; i++) {
        const particleOptions: ParticleOptions = variant
          ? { ...baseOptions, ...variant(i, count) }
          : { ...baseOptions };

        if (i === 0) {
          handles.push(this.sendParticle(edgeId, particleOptions));
        } else {
          const timer = setTimeout(() => {
            handles.push(this.sendParticle(edgeId, particleOptions));
          }, i * stagger);
          pendingTimers.push(timer);
        }
      }

      const validHandles = () => handles.filter((h): h is ParticleHandle => h != null);

      return {
        get handles() { return validHandles(); },
        get finished() {
          return new Promise<void>((resolve) => {
            // Wait for all staggered particles to be created, then await all
            setTimeout(() => {
              Promise.all(validHandles().map(h => h.finished)).then(() => resolve());
            }, count * stagger + 50);
          });
        },
        stopAll() {
          for (const timer of pendingTimers) {
            clearTimeout(timer);
          }
          for (const h of validHandles()) {
            h.stop();
          }
        },
      };
    },

    // ── Converging: fan-in particle visualization ───────────────────────

    /**
     * Fire particles from multiple edges that all arrive at (or depart from)
     * a target node simultaneously. For 'arrival' synchronization, shorter
     * paths get shorter durations and delayed starts so all particles reach
     * the target at the same time.
     */
    sendConverging(sourceEdgeIds: string[], options: ConvergingOptions): ConvergingHandle {
      const { targetNodeId: _targetNodeId, synchronize = 'arrival', onAllArrived, ...particleOptions } = options;
      const handles: ParticleHandle[] = [];
      const pendingTimers: ReturnType<typeof setTimeout>[] = [];

      if (synchronize === 'arrival') {
        // Compute path lengths for proportional timing
        const edgeData = sourceEdgeIds.map(id => {
          const pathEl = ctx.getEdgePathElement(id);
          const length = pathEl?.getTotalLength() ?? 0;
          return { id, length };
        }).filter(d => d.length > 0);

        if (edgeData.length === 0) {
          const emptyFinished = Promise.resolve();
          return { get handles() { return []; }, finished: emptyFinished, stopAll() {} };
        }

        const maxLength = Math.max(...edgeData.map(d => d.length));
        const baseDuration = resolveDurationMs(particleOptions, maxLength, '2s');

        for (const { id, length } of edgeData) {
          const ratio = length / maxLength;
          const adjustedDuration = baseDuration * ratio;
          const delay = baseDuration - adjustedDuration;

          if (delay <= 0) {
            const h = this.sendParticle(id, { ...particleOptions, duration: adjustedDuration });
            if (h) {
              handles.push(h);
            }
          } else {
            const timer = setTimeout(() => {
              const h = this.sendParticle(id, { ...particleOptions, duration: adjustedDuration });
              if (h) {
                handles.push(h);
              }
            }, delay);
            pendingTimers.push(timer);
          }
        }
      } else {
        // departure: all start simultaneously with their default durations
        for (const edgeId of sourceEdgeIds) {
          const h = this.sendParticle(edgeId, particleOptions);
          if (h) {
            handles.push(h);
          }
        }
      }

      const finished = new Promise<void>((resolve) => {
        // Small buffer for staggered particles to register
        const waitTime = synchronize === 'arrival' ? 100 : 0;
        setTimeout(() => {
          Promise.all(handles.map(h => h.finished)).then(() => {
            onAllArrived?.();
            resolve();
          });
        }, waitTime);
      });

      return {
        get handles() { return handles; },
        finished,
        stopAll() {
          for (const timer of pendingTimers) {
            clearTimeout(timer);
          }
          for (const h of handles) {
            h.stop();
          }
        },
      };
    },

    // ── Cleanup ───────────────────────────────────────────────────────────

    /**
     * Stop the particle engine and remove all active particles from the DOM.
     * Called during canvas destroy().
     */
    destroyParticles(): void {
      ctx._particleEngineHandle?.stop();
      ctx._particleEngineHandle = null;
      for (const p of ctx._activeParticles) {
        p.renderer.destroy(p.element);
      }
      ctx._activeParticles.clear();
    },
  };
}
