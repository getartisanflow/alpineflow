// ============================================================================
// canvas-particles — Particle system mixin for flow-canvas
//
// Public API: sendParticle.
// Internal:   _tickParticles, destroyParticles.
//
// Manages SVG circle particles that travel along edge paths via
// getPointAtLength. Particles share a single AnimationEngine registration
// so multiple concurrent particles use one tick callback.
//
// Cross-mixin deps (via ctx): getEdge, getEdgePathElement, getEdgeElement,
//   _edgeSvgElements, _containerStyles, _activeParticles,
//   _particleEngineHandle.
// ============================================================================

import type { CanvasContext } from './canvas-context';
import type {
  ParticleHandle,
  ParticleOptions,
  XYPosition,
} from '../../core/types';
import { engine } from '../../animate/engine';
import { debug } from '../../core/debug';
import { CONNECTION_ACTIVE_COLOR } from '../../core/constants';

// ── Local utility ───────────────────────────────────────────────────────────

/** Parse a CSS duration string (e.g. '2s', '300ms') to milliseconds. */
function parseDurationMs(dur: string): number {
  const match = dur.match(/^([\d.]+)(ms|s)?$/);
  if (!match) return 2000;
  const val = parseFloat(match[1]);
  return match[2] === 'ms' ? val : val * 1000;
}

// ── Mixin factory ───────────────────────────────────────────────────────────

export function createParticleMixin(ctx: CanvasContext) {
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
        if (progress >= 1 || !particle.circle.parentNode) {
          particle.circle.remove();
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
        particle.circle.setAttribute('cx', String(pt.x));
        particle.circle.setAttribute('cy', String(pt.y));

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
     * Fire a particle along an edge path. The particle is an SVG circle
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

      // Resolve cascade: options -> edge properties -> CSS variables
      const styles = ctx._containerStyles;

      const size = options.size
        ?? edge.particleSize
        ?? (parseFloat(styles?.getPropertyValue('--flow-edge-dot-size').trim() ?? '4') || 4);
      const color = options.color
        ?? edge.particleColor
        ?? styles?.getPropertyValue('--flow-edge-dot-fill').trim()
        ?? CONNECTION_ACTIVE_COLOR;
      const duration = options.duration
        ?? edge.animationDuration
        ?? styles?.getPropertyValue('--flow-edge-dot-duration').trim()
        ?? '2s';

      // Create circle and animate via getPointAtLength + setAttribute.
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', String(size));
      circle.setAttribute('fill', color);
      circle.classList.add('flow-edge-particle');
      if (options.class) {
        for (const cls of options.class.split(' ')) {
          if (cls) circle.classList.add(cls);
        }
      }

      const gEl = ctx.getEdgeElement(edgeId);
      if (!gEl) return undefined;

      const ms = parseDurationMs(duration);

      // Position at path start immediately — no origin flash.
      const startPt = pathEl.getPointAtLength(0);
      circle.setAttribute('cx', String(startPt.x));
      circle.setAttribute('cy', String(startPt.y));
      gEl.appendChild(circle);

      // Promise for handle.finished
      let resolveHandleFinished: () => void;
      const handleFinished = new Promise<void>((r) => { resolveHandleFinished = r; });

      const wrappedOnComplete = () => {
        if (typeof options.onComplete === 'function') {
          options.onComplete();
        }
        resolveHandleFinished!();
      };

      const particle = {
        circle,
        pathEl,
        startElapsed: -1,    // set on first engine tick
        ms,
        onComplete: wrappedOnComplete,
        currentPosition: { x: startPt.x, y: startPt.y },
      };
      ctx._activeParticles.add(particle);
      debug('particle', `sendParticle on edge "${edgeId}"`, { size, color, duration: ms });

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
          circle.remove();
          ctx._activeParticles.delete(particle);
          wrappedOnComplete();
        },
        get finished() { return handleFinished; },
      };

      return handle;
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
        p.circle.remove();
      }
      ctx._activeParticles.clear();
    },
  };
}
