// ============================================================================
// canvas-animation — Animation, timeline, and follow mixin for flow-canvas
//
// Public API: animate, timeline, registerAnimation, unregisterAnimation,
//             playAnimation, follow, sendParticle.
// Internal:   _syncAnimationState, _tickParticles.
//
// Covers the core animation engine wiring, the timeline factory, named
// animation registry, and viewport follow tracking. Particle effects are
// delegated to the canvas-particles sub-mixin.
//
// Cross-mixin deps (via ctx): getNode, getEdge, getEdgePathElement,
//   getEdgeElement, getAbsolutePosition, _flushNodePositions,
//   _flushNodeStyles, _flushEdgeStyles, _flushViewport, _refreshEdgePaths,
//   _suspendHistory, _resumeHistory.
// ============================================================================

import { getAlpine } from '../alpine-ref';
import type { CanvasContext } from './canvas-context';
import type {
  FlowNode,
  FlowEdge,
  XYPosition,
  AnimateTargets,
  AnimateOptions,
  FlowAnimationHandle,
  FollowOptions,
  ParticleHandle,
} from '../../core/types';
import type { Animator, PropertyEntry } from '../../animate/animator';
import { parseStyle, interpolateStyle } from '../../animate/interpolators';
import { checkReducedMotion } from '../../animate/easing';
import { FlowTimeline, type TimelineStep } from '../../animate/timeline';
import { type PathFunction, svgPathToFunction } from '../../animate/paths';
import { engine } from '../../animate/engine';
import { debug } from '../../core/debug';
import { DEFAULT_STROKE_COLOR } from '../../core/constants';
import { createParticleMixin } from './canvas-particles';

// ── Mixin factory ───────────────────────────────────────────────────────────

export function createAnimationMixin(ctx: CanvasContext) {
  // Delegate particle system to the dedicated sub-mixin
  const particles = createParticleMixin(ctx);

  return {
    // ── Internal: Sync animation lock state ───────────────────────────────

    /**
     * Synchronize the `_animationLocked` flag from active timelines and
     * manage history suspension while any timeline is playing.
     */
    _syncAnimationState(): void {
      const anyLocked = [...ctx._activeTimelines].some((tl) => tl.locked);
      ctx._animationLocked = anyLocked;
      if (ctx._activeTimelines.size === 0) {
        ctx._resumeHistory();
      } else {
        ctx._suspendHistory();
      }
    },

    // ── Timeline factory ──────────────────────────────────────────────────

    /**
     * Create a new FlowTimeline wired to this canvas. Lock flag and
     * history suspension are automatically managed via timeline events.
     */
    timeline(): FlowTimeline {
      const tl = new FlowTimeline(ctx, engine);

      tl.on('play', () => {
        ctx._activeTimelines.add(tl);
        ctx._syncAnimationState();
      });

      tl.on('resume', () => {
        ctx._activeTimelines.add(tl);
        ctx._syncAnimationState();
      });

      for (const event of ['pause', 'stop', 'complete'] as const) {
        tl.on(event, () => {
          ctx._activeTimelines.delete(tl);
          ctx._syncAnimationState();
        });
      }

      return tl;
    },

    // ── Named animation registry ──────────────────────────────────────────

    /**
     * Register a named animation (used by x-flow-animate directive).
     */
    registerAnimation(name: string, steps: any[]): void {
      ctx._animationRegistry.set(name, steps);
    },

    /**
     * Unregister a named animation.
     */
    unregisterAnimation(name: string): void {
      ctx._animationRegistry.delete(name);
    },

    /**
     * Play a named animation registered via x-flow-animate directive.
     */
    async playAnimation(name: string): Promise<void> {
      const steps = ctx._animationRegistry.get(name);
      if (!steps) {
        debug('animation', `Named animation "${name}" not found`);
        return;
      }
      const tl = ctx.timeline();
      for (const s of steps) {
        if (s.parallel) {
          tl.parallel(s.parallel as TimelineStep[]);
        } else {
          tl.step(s as TimelineStep);
        }
      }
      await tl.play();
    },

    // ── Core update/animate API ─────────────────────────────────────────

    /**
     * Update nodes, edges, and/or the viewport.
     *
     * The core method for applying property changes. When duration is 0
     * (the default), changes are applied instantly via DOM flushing.
     * When duration > 0, transitions are delegated to the Animator for
     * frame-by-frame interpolation.
     *
     * Use `animate()` for a convenience wrapper that defaults to smooth
     * transitions (duration: 300ms).
     */
    update(
      targets: AnimateTargets,
      options: AnimateOptions = {},
    ): FlowAnimationHandle {
      const duration = options.duration ?? 0;
      const entries: PropertyEntry[] = [];
      const movedNodeIds = new Set<string>();
      const styledNodeIds = new Set<string>();
      const styledEdgeIds = new Set<string>();

      // Debug logging
      const nodeCount = targets.nodes ? Object.keys(targets.nodes).length : 0;
      const edgeCount = targets.edges ? Object.keys(targets.edges).length : 0;
      debug('animate', `update() called`, {
        nodes: nodeCount,
        edges: edgeCount,
        viewport: !!targets.viewport,
        duration,
        easing: options.easing ?? 'default',
        instant: duration === 0,
      });

      // ── Node targets ────────────────────────────────────────────
      if (targets.nodes) {
        for (const [nodeId, target] of Object.entries(targets.nodes)) {
          const node = ctx._nodeMap.get(nodeId) as FlowNode | undefined;
          if (!node) continue;

          const elemDuration = target._duration ?? duration;
          const isInstant = elemDuration === 0;

          // followPath — curved motion overrides position
          if (target.followPath && !isInstant) {
            let pathFn: PathFunction | null = null;
            if (typeof target.followPath === 'function') {
              pathFn = target.followPath;
            } else {
              pathFn = svgPathToFunction(target.followPath);
            }

            // Guide path overlay for SVG path strings
            let guidePathEl: SVGPathElement | null = null;
            if (
              target.guidePath?.visible &&
              typeof target.followPath === 'string' &&
              typeof document !== 'undefined'
            ) {
              const svgContainer = (ctx as any).getEdgeSvgElement?.();
              if (svgContainer) {
                guidePathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                guidePathEl.setAttribute('d', target.followPath);
                guidePathEl.classList.add('flow-guide-path');
                if (target.guidePath.class) {
                  guidePathEl.classList.add(target.guidePath.class);
                }
                svgContainer.appendChild(guidePathEl);
              }
            }

            if (pathFn) {
              const capturedPathFn = pathFn;
              const capturedGuide = guidePathEl;
              const autoRemove = target.guidePath?.autoRemove !== false;
              entries.push({
                key: `node:${nodeId}:followPath`,
                from: 0,
                to: 1,
                apply: (t) => {
                  const n = ctx._nodeMap.get(nodeId);
                  if (!n) return;
                  const pos = capturedPathFn(t as number);
                  getAlpine().raw(n).position.x = pos.x;
                  getAlpine().raw(n).position.y = pos.y;
                  movedNodeIds.add(nodeId);
                  // Clean up guide path on completion
                  if ((t as number) >= 1 && capturedGuide && autoRemove) {
                    capturedGuide.remove();
                  }
                },
              });
            }
          } else if (target.position) {
            // Position animation (linear interpolation)
            const rawNode = getAlpine().raw(node);
            const fromPos = rawNode.position;
            if (target.position.x !== undefined) {
              const toX = target.position.x;
              if (isInstant) {
                fromPos.x = toX;
              } else {
                const fromX = fromPos.x;
                entries.push({
                  key: `node:${nodeId}:position.x`,
                  from: fromX,
                  to: toX,
                  apply: (v) => {
                    const n = ctx._nodeMap.get(nodeId);
                    if (!n) return;
                    getAlpine().raw(n).position.x = v as number;
                    movedNodeIds.add(nodeId);
                  },
                });
              }
            }
            if (target.position.y !== undefined) {
              const toY = target.position.y;
              if (isInstant) {
                fromPos.y = toY;
              } else {
                const fromY = fromPos.y;
                entries.push({
                  key: `node:${nodeId}:position.y`,
                  from: fromY,
                  to: toY,
                  apply: (v) => {
                    const n = ctx._nodeMap.get(nodeId);
                    if (n) getAlpine().raw(n).position.y = v as number;
                    movedNodeIds.add(nodeId);
                  },
                });
              }
            }
            if (isInstant) movedNodeIds.add(nodeId);
          }

          // Instant-only properties (data, class, selected, zIndex)
          if (target.data !== undefined) Object.assign(node.data, target.data);
          if (target.class !== undefined) node.class = target.class;
          if (target.selected !== undefined) node.selected = target.selected;
          if (target.zIndex !== undefined) node.zIndex = target.zIndex;

          // Style animation
          if (target.style !== undefined) {
            if (isInstant) {
              node.style = target.style;
              styledNodeIds.add(nodeId);
            } else {
              const fromStyle = parseStyle(node.style || {});
              const toStyle = parseStyle(target.style);
              // Fill missing "from" values from the DOM computed style
              const nodeEl = ctx._nodeElements.get(nodeId);
              if (nodeEl) {
                const computed = getComputedStyle(nodeEl);
                for (const key of Object.keys(toStyle)) {
                  if (fromStyle[key] === undefined) {
                    fromStyle[key] = computed.getPropertyValue(key);
                  }
                }
              }
              entries.push({
                key: `node:${nodeId}:style`,
                from: 0,
                to: 1,
                apply: (t) => {
                  const n = ctx._nodeMap.get(nodeId);
                  if (!n) return;
                  getAlpine().raw(n).style = interpolateStyle(fromStyle, toStyle as Record<string, string>, t as number);
                  styledNodeIds.add(nodeId);
                },
              });
            }
          }

          // Dimensions animation
          if (target.dimensions && node.dimensions) {
            if (target.dimensions.width !== undefined) {
              if (isInstant) {
                node.dimensions.width = target.dimensions.width;
              } else {
                entries.push({
                  key: `node:${nodeId}:dimensions.width`,
                  from: node.dimensions.width,
                  to: target.dimensions.width,
                  apply: (v) => { node.dimensions!.width = v as number; },
                });
              }
            }
            if (target.dimensions.height !== undefined) {
              if (isInstant) {
                node.dimensions.height = target.dimensions.height;
              } else {
                entries.push({
                  key: `node:${nodeId}:dimensions.height`,
                  from: node.dimensions.height,
                  to: target.dimensions.height,
                  apply: (v) => { node.dimensions!.height = v as number; },
                });
              }
            }
          }
        }
      }

      // ── Edge targets ────────────────────────────────────────────
      if (targets.edges) {
        for (const [edgeId, target] of Object.entries(targets.edges)) {
          const edge = ctx._edgeMap.get(edgeId) as FlowEdge | undefined;
          if (!edge) continue;

          const elemDuration = target._duration ?? duration;
          const isInstant = elemDuration === 0;

          // Color (string or gradient object)
          if (target.color !== undefined) {
            if (typeof target.color === 'object') {
              // Gradient: apply directly (CSS handles transitions)
              (edge as any).color = target.color;
            } else if (isInstant) {
              edge.color = target.color;
              styledEdgeIds.add(edgeId);
            } else {
              const fromColor = (typeof edge.color === 'string' && edge.color)
                || getComputedStyle(ctx._container!).getPropertyValue('--flow-edge-stroke').trim()
                || DEFAULT_STROKE_COLOR;
              entries.push({
                key: `edge:${edgeId}:color`,
                from: fromColor,
                to: target.color,
                apply: (v) => {
                  const e = ctx._edgeMap.get(edgeId);
                  if (!e) return;
                  getAlpine().raw(e).color = v as string;
                  styledEdgeIds.add(edgeId);
                },
              });
            }
          }

          // StrokeWidth
          if (target.strokeWidth !== undefined) {
            if (isInstant) {
              edge.strokeWidth = target.strokeWidth;
              styledEdgeIds.add(edgeId);
            } else {
              const fromWidth = edge.strokeWidth
                ?? (parseFloat(getComputedStyle(ctx._container!).getPropertyValue('--flow-edge-stroke-width').trim() || '1')
                || 1);
              entries.push({
                key: `edge:${edgeId}:strokeWidth`,
                from: fromWidth,
                to: target.strokeWidth,
                apply: (v) => {
                  const e = ctx._edgeMap.get(edgeId);
                  if (!e) return;
                  getAlpine().raw(e).strokeWidth = v as number;
                  styledEdgeIds.add(edgeId);
                },
              });
            }
          }

          // Instant-only edge properties
          if (target.label !== undefined) edge.label = target.label;
          if (target.animated !== undefined) edge.animated = target.animated;
          if (target.class !== undefined) edge.class = target.class;
        }
      }

      // ── Viewport target ─────────────────────────────────────────
      if (targets.viewport) {
        const vp = targets.viewport;
        const elemDuration = vp._duration ?? duration;
        const isInstant = elemDuration === 0;
        const currentVp = ctx.viewport;

        if (vp.pan?.x !== undefined) {
          if (isInstant) {
            currentVp.x = vp.pan.x;
          } else {
            entries.push({
              key: 'viewport:pan.x',
              from: currentVp.x,
              to: vp.pan.x,
              apply: (v) => { currentVp.x = v as number; },
            });
          }
        }
        if (vp.pan?.y !== undefined) {
          if (isInstant) {
            currentVp.y = vp.pan.y;
          } else {
            entries.push({
              key: 'viewport:pan.y',
              from: currentVp.y,
              to: vp.pan.y,
              apply: (v) => { currentVp.y = v as number; },
            });
          }
        }
        if (vp.zoom !== undefined) {
          if (isInstant) {
            currentVp.zoom = vp.zoom;
          } else {
            entries.push({
              key: 'viewport:zoom',
              from: currentVp.zoom,
              to: vp.zoom,
              apply: (v) => { currentVp.zoom = v as number; },
            });
          }
        }
      }

      // ── Handle instant case ─────────────────────────────────────
      if (entries.length === 0) {
        // All changes were instant — flush DOM and notify Alpine
        if (movedNodeIds.size > 0) {
          ctx._flushNodePositions(movedNodeIds);
          ctx._refreshEdgePaths(movedNodeIds);
        }
        if (styledNodeIds.size > 0) {
          ctx._flushNodeStyles(styledNodeIds);
        }
        if (styledEdgeIds.size > 0) {
          ctx._flushEdgeStyles(styledEdgeIds);
        }

        const noop: FlowAnimationHandle = {
          pause: () => {},
          resume: () => {},
          stop: () => {},
          reverse: () => {},
          play: () => {},
          playForward: () => {},
          playBackward: () => {},
          restart: () => {},
          get direction(): 'forward' | 'backward' { return 'forward'; },
          get isFinished() { return true; },
          get currentValue() { return new Map(); },
          finished: Promise.resolve(),
          _targetNodeIds: targets.nodes ? Object.keys(targets.nodes) : undefined,
        };
        options.onComplete?.();
        return noop;
      }

      // ── Animated case ───────────────────────────────────────────

      // Unwrap the Alpine proxy so the Animator's internal Maps/Sets use
      // correct reference equality (Proxy(obj) !== obj breaks _cleanup).
      const rawAnimator = getAlpine().raw(ctx._animator!) as Animator;
      const handle = rawAnimator.animate(entries, {
        duration,
        easing: options.easing,
        delay: options.delay,
        loop: options.loop,
        startAt: options.startAt,
        onProgress(progress) {
          // Flush moved nodes to DOM each frame
          if (movedNodeIds.size > 0) {
            ctx._flushNodePositions(movedNodeIds);
            ctx._refreshEdgePaths(movedNodeIds);
            movedNodeIds.clear();
          }
          // Flush styled nodes to DOM each frame
          if (styledNodeIds.size > 0) {
            ctx._flushNodeStyles(styledNodeIds);
            styledNodeIds.clear();
          }
          // Flush styled edges to DOM each frame
          if (styledEdgeIds.size > 0) {
            ctx._flushEdgeStyles(styledEdgeIds);
            styledEdgeIds.clear();
          }
          // Flush viewport transform when animating pan/zoom
          if (targets.viewport) {
            ctx._flushViewport();
          }
          options.onProgress?.(progress);
        },
        onComplete() {
          // Final frame: sync Alpine reactive state from the raw values
          // that the animator already applied (respects reverse direction).
          if (targets.nodes) {
            for (const [nodeId, target] of Object.entries(targets.nodes)) {
              const node = ctx._nodeMap.get(nodeId);
              if (!node) continue;
              const raw = getAlpine().raw(node);
              if (target.followPath || target.position?.x !== undefined) node.position.x = raw.position.x;
              if (target.followPath || target.position?.y !== undefined) node.position.y = raw.position.y;
              if (target.style !== undefined) node.style = raw.style;
            }
          }
          // Final frame: sync Alpine reactive state for edges
          if (targets.edges) {
            for (const [edgeId, target] of Object.entries(targets.edges)) {
              const edge = ctx._edgeMap.get(edgeId);
              if (!edge) continue;
              const raw = getAlpine().raw(edge);
              if (target.color !== undefined && typeof target.color === 'string') edge.color = raw.color;
              if (target.strokeWidth !== undefined) edge.strokeWidth = raw.strokeWidth;
            }
          }
          options.onComplete?.();
        },
      });

      // Attach target node IDs so follow() can resolve position
      if (targets.nodes) {
        (handle as FlowAnimationHandle)._targetNodeIds = Object.keys(targets.nodes);
      }

      return handle;
    },

    /**
     * Animate nodes, edges, and/or the viewport with smooth transitions.
     *
     * Convenience wrapper around `update()` that defaults to 300ms duration.
     * Pass `duration: 0` for instant changes, or use `update()` directly.
     *
     * When `respectReducedMotion` is active (via config or OS media query),
     * the effective duration is collapsed to 0 for an instant snap.
     */
    animate(
      targets: AnimateTargets,
      options: AnimateOptions = {},
    ): FlowAnimationHandle {
      const effectiveDuration = checkReducedMotion(ctx._config?.respectReducedMotion) ? 0 : (options.duration ?? 300);
      return this.update(targets, { ...options, duration: effectiveDuration });
    },

    // ── Follow (viewport tracking) ────────────────────────────────────────

    /**
     * Track a target with the viewport camera. The target can be a node ID,
     * a ParticleHandle, an animation handle, or a static XYPosition.
     * The viewport smoothly follows via engine tick with linear interpolation.
     */
    follow(
      target: string | FlowAnimationHandle | ParticleHandle | XYPosition,
      options: FollowOptions = {},
    ): FlowAnimationHandle {
      // Stop any existing follow
      if (ctx._followHandle) {
        ctx._followHandle.stop();
      }

      let resolveFinished: () => void;
      const finished = new Promise<void>((r) => { resolveFinished = r; });
      let stopped = false;

      const targetZoom = options.zoom;

      const engineHandle = engine.register(() => {
        if (stopped) return true;

        let pos: XYPosition | null = null;

        if (typeof target === 'string') {
          const node = ctx._nodeMap.get(target);
          if (node) {
            pos = node.parentId ? ctx.getAbsolutePosition(target) : { ...node.position };
            const followOrig = node.nodeOrigin ?? ctx._config.nodeOrigin ?? [0, 0];
            if (node.dimensions) {
              pos.x += node.dimensions.width * (0.5 - followOrig[0]);
              pos.y += node.dimensions.height * (0.5 - followOrig[1]);
            }
          }
        } else if ('_targetNodeIds' in target && (target as FlowAnimationHandle)._targetNodeIds?.length) {
          // FlowAnimationHandle — follow the first animated node's reactive position
          const animNodeId = (target as FlowAnimationHandle)._targetNodeIds![0];
          const node = ctx._nodeMap.get(animNodeId);
          if (node) {
            pos = node.parentId ? ctx.getAbsolutePosition(animNodeId) : { ...node.position };
            const followOrig = node.nodeOrigin ?? ctx._config.nodeOrigin ?? [0, 0];
            if (node.dimensions) {
              pos.x += node.dimensions.width * (0.5 - followOrig[0]);
              pos.y += node.dimensions.height * (0.5 - followOrig[1]);
            }
          }
        } else if ('getCurrentPosition' in target && typeof (target as any).getCurrentPosition === 'function') {
          const particlePos = (target as ParticleHandle).getCurrentPosition();
          if (particlePos) {
            pos = particlePos;
          } else {
            // Particle completed — auto-stop follow
            stopped = true;
            engineHandle.stop();
            ctx._followHandle = null;
            resolveFinished!();
            return true;
          }
        } else if ('x' in target && 'y' in target) {
          pos = target as XYPosition;
        }

        if (!pos) return false;

        const dims = ctx._container
          ? { width: ctx._container.clientWidth, height: ctx._container.clientHeight }
          : { width: 800, height: 600 };
        const zoom = targetZoom ?? ctx.viewport.zoom;
        const vpX = dims.width / 2 - pos.x * zoom;
        const vpY = dims.height / 2 - pos.y * zoom;

        const lerp = 0.08;
        ctx.viewport.x += (vpX - ctx.viewport.x) * lerp;
        ctx.viewport.y += (vpY - ctx.viewport.y) * lerp;
        if (targetZoom) {
          ctx.viewport.zoom += (targetZoom - ctx.viewport.zoom) * lerp;
        }

        ctx._flushViewport();
        return false;
      });

      ctx._followHandle = engineHandle;

      // Auto-stop follow when animation handle finishes
      if (typeof target === 'object' && '_targetNodeIds' in target && (target as FlowAnimationHandle).finished) {
        (target as FlowAnimationHandle).finished.then(() => {
          if (!stopped) {
            stopped = true;
            engineHandle.stop();
            ctx._followHandle = null;
            resolveFinished!();
          }
        });
      }

      const handle: FlowAnimationHandle = {
        pause: () => {},
        resume: () => {},
        stop: () => {
          stopped = true;
          engineHandle.stop();
          ctx._followHandle = null;
          resolveFinished!();
        },
        reverse: () => {},
        play: () => {},
        playForward: () => {},
        playBackward: () => {},
        restart: () => {},
        get direction(): 'forward' | 'backward' { return 'forward'; },
        get isFinished() { return stopped; },
        get currentValue() { return new Map(); },
        get finished() { return finished; },
      };

      return handle;
    },

    // ── Cleanup lifecycle ─────────────────────────────────────────────────

    /**
     * Stop all in-flight animations, particles, and timelines.
     * Called by the canvas destroy() lifecycle hook when the element is
     * removed from the DOM.
     */
    destroy(): void {
      if (ctx._animator) {
        ctx._animator.stopAll();
      }
      particles.destroyParticles();
      for (const tl of ctx._activeTimelines) {
        tl.stop();
      }
      ctx._activeTimelines.clear();
    },

    // ── Particle system (delegated to canvas-particles sub-mixin) ────────

    _tickParticles: particles._tickParticles,
    sendParticle: particles.sendParticle,
    destroyParticles: particles.destroyParticles,
  };
}
