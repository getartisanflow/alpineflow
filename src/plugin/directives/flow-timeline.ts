// ============================================================================
// x-flow-timeline Directive
//
// Binds a reactive timeline definition from Alpine data. Watches the steps
// array for changes and automatically plays new steps. Supports cursor
// tracking, overflow strategies, looping, lock mode, and an API surface
// exposed on the element as el.__timeline.
//
// Usage:
//   <div x-flow-timeline="timelineConfig"></div>
//
// Config:
//   {
//     steps: TimelineStep[],
//     autoplay?: boolean,      // default true
//     loop?: boolean | number, // default false
//     lock?: boolean,          // default false
//     speed?: number,          // default 1
//     overflow?: 'queue' | 'latest', // default 'queue'
//     autoFitView?: boolean,   // Phase 5
//     fitViewPadding?: number, // Phase 5
//     respectReducedMotion?: boolean, // Phase 6
//   }
// ============================================================================

import type { Alpine } from 'alpinejs';
import type { TimelineStep, TimelineState } from '../../animate/timeline';
import { FlowTimeline } from '../../animate/timeline';
import type { Viewport, FlowNode } from '../../core/types';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from '../../core/geometry';

interface TimelineConfig {
  steps: TimelineStep[];
  autoplay?: boolean;
  loop?: boolean | number;
  lock?: boolean;
  speed?: number;
  overflow?: 'queue' | 'latest';
  autoFitView?: boolean;
  fitViewPadding?: number;
  respectReducedMotion?: boolean;
}

interface TimelineAPI {
  play(): Promise<void>;
  stop(): void;
  reset(replay?: boolean): Promise<void> | void;
  readonly state: TimelineState;
}

/**
 * Check if a node's final position (after step is applied) is visible within
 * the current viewport bounds.
 */
function isNodeInViewport(
  node: FlowNode,
  step: TimelineStep,
  viewport: Viewport,
  containerWidth: number,
  containerHeight: number,
): boolean {
  // Compute the node's final position after the step
  const x = step.position?.x ?? node.position.x;
  const y = step.position?.y ?? node.position.y;
  const w = node.dimensions?.width ?? DEFAULT_NODE_WIDTH;
  const h = node.dimensions?.height ?? DEFAULT_NODE_HEIGHT;

  // Convert node bounds to screen coordinates
  const screenLeft = x * viewport.zoom + viewport.x;
  const screenTop = y * viewport.zoom + viewport.y;
  const screenRight = (x + w) * viewport.zoom + viewport.x;
  const screenBottom = (y + h) * viewport.zoom + viewport.y;

  // Check if any part of the node is outside the container
  return screenRight > 0 && screenLeft < containerWidth
    && screenBottom > 0 && screenTop < containerHeight;
}

/**
 * Determine if a step needs autoFitView injection because one or more
 * targeted nodes will end up outside the viewport.
 */
function stepNeedsAutoFit(
  step: TimelineStep,
  canvas: any,
  viewport: Viewport,
  containerWidth: number,
  containerHeight: number,
): boolean {
  const nodeIds = step.nodes;
  if (!nodeIds || nodeIds.length === 0) return false;

  for (const id of nodeIds) {
    const node = canvas.getNode?.(id) ?? canvas.nodes?.find((n: FlowNode) => n.id === id);
    if (!node) continue;
    if (!isNodeInViewport(node, step, viewport, containerWidth, containerHeight)) {
      return true;
    }
  }
  return false;
}

export function registerFlowTimelineDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-timeline',
    (
      el: HTMLElement,
      { expression }: { expression: string },
      { evaluate, effect, cleanup }: { evaluate: (expr: string) => any; effect: (fn: () => void) => void; cleanup: (fn: () => void) => void },
    ) => {
      // State
      let cursor = 0;
      let activeTl: FlowTimeline | null = null;
      let pendingSteps: TimelineStep[] = [];
      let isPlaying = false;
      let state: TimelineState = 'idle';
      let lastStepsLength = 0;

      /**
       * Find the canvas data component from the DOM hierarchy.
       */
      function getCanvas(): any {
        const dataEl = el.closest('[x-data]') as HTMLElement | null;
        return dataEl ? Alpine.$data(dataEl) : null;
      }

      /**
       * Build and play a timeline from the given steps with config applied.
       */
      function buildAndPlay(steps: TimelineStep[], config: TimelineConfig): Promise<void> {
        const canvas = getCanvas();
        if (!canvas?.timeline) return Promise.resolve();

        const tl: FlowTimeline = canvas.timeline();

        // Apply speed multiplier
        const speed = config.speed ?? 1;

        // autoFitView: check viewport bounds before each step
        const autoFit = config.autoFitView === true;
        const fitPadding = config.fitViewPadding ?? 0.1;
        const viewport = canvas.viewport as Viewport | undefined;
        const dims = canvas.getContainerDimensions?.() as { width: number; height: number } | undefined;

        for (const s of steps) {
          const adjusted = speed !== 1
            ? {
              ...s,
              duration: s.duration !== undefined ? s.duration / speed : undefined,
              delay: s.delay !== undefined ? s.delay / speed : undefined,
            }
            : s;

          if ((adjusted as any).parallel) {
            const parallelSteps = ((adjusted as any).parallel as TimelineStep[]).map((ps) =>
              speed !== 1
                ? {
                  ...ps,
                  duration: ps.duration !== undefined ? ps.duration / speed : undefined,
                  delay: ps.delay !== undefined ? ps.delay / speed : undefined,
                }
                : ps,
            );
            tl.parallel(parallelSteps);
          } else if (autoFit && viewport && dims && stepNeedsAutoFit(adjusted, canvas, viewport, dims.width, dims.height)) {
            // Inject a parallel fitView alongside the original step
            const fitStep: TimelineStep = {
              fitView: true,
              fitViewPadding: fitPadding,
              duration: adjusted.duration,
              easing: adjusted.easing,
            };
            tl.parallel([adjusted, fitStep]);
          } else {
            tl.step(adjusted);
          }
        }

        // Apply config
        if (config.lock) tl.lock(true);
        if (config.loop !== undefined && config.loop !== false) {
          const count = config.loop === true ? 0 : config.loop;
          tl.loop(count);
        }
        if (config.respectReducedMotion !== undefined) {
          tl.respectReducedMotion(config.respectReducedMotion);
        }

        activeTl = tl;
        state = 'playing';
        isPlaying = true;

        return tl.play().then(() => {
          if (activeTl === tl) {
            activeTl = null;
            state = 'idle';
            isPlaying = false;
          }
        });
      }

      /**
       * Play new steps from the cursor position.
       */
      async function playNewSteps(config: TimelineConfig): Promise<void> {
        if (pendingSteps.length === 0) return;

        const overflow = config.overflow ?? 'queue';

        if (overflow === 'latest' && isPlaying) {
          // Cancel current animation and skip to latest step
          activeTl?.stop();
          activeTl = null;
          isPlaying = false;
          state = 'idle';

          // Only play the last pending step
          const latest = [pendingSteps[pendingSteps.length - 1]];
          cursor += pendingSteps.length;
          pendingSteps = [];
          await buildAndPlay(latest, config);
        } else {
          // Queue mode: play all pending steps sequentially
          const stepsToPlay = [...pendingSteps];
          cursor += stepsToPlay.length;
          pendingSteps = [];

          if (isPlaying) {
            // Wait for current animation, then play new steps
            const waitForCurrent = new Promise<void>((resolve) => {
              if (activeTl) {
                activeTl.on('complete', () => resolve());
                activeTl.on('stop', () => resolve());
              } else {
                resolve();
              }
            });
            await waitForCurrent;
          }

          await buildAndPlay(stepsToPlay, config);
        }
      }

      // ── API surface on element ────────────────────────────────────────
      const api: TimelineAPI = {
        async play(): Promise<void> {
          const config = evaluate(expression) as TimelineConfig;
          const steps = config.steps ?? [];
          if (cursor < steps.length) {
            pendingSteps = steps.slice(cursor);
            await playNewSteps(config);
          }
        },

        stop(): void {
          activeTl?.stop();
          activeTl = null;
          isPlaying = false;
          state = 'stopped';
          pendingSteps = [];
        },

        reset(replay?: boolean): Promise<void> | void {
          activeTl?.stop();
          activeTl = null;
          isPlaying = false;
          state = 'idle';
          cursor = 0;
          pendingSteps = [];
          lastStepsLength = 0;

          if (replay) {
            const config = evaluate(expression) as TimelineConfig;
            const steps = config.steps ?? [];
            if (steps.length > 0) {
              pendingSteps = [...steps];
              return playNewSteps(config);
            }
          }
        },

        get state(): TimelineState {
          return state;
        },
      };

      (el as any).__timeline = api;

      // ── Reactive watcher ──────────────────────────────────────────────
      effect(() => {
        const config = evaluate(expression) as TimelineConfig;
        if (!config || !config.steps) return;

        const steps = config.steps;
        const autoplay = config.autoplay !== false; // default true

        // Detect new steps appended past the cursor
        if (steps.length > lastStepsLength) {
          const newSteps = steps.slice(Math.max(cursor, lastStepsLength));
          lastStepsLength = steps.length;

          if (newSteps.length > 0 && autoplay) {
            pendingSteps.push(...newSteps);
            playNewSteps(config);
          }
        } else {
          lastStepsLength = steps.length;
        }
      });

      cleanup(() => {
        activeTl?.stop();
        delete (el as any).__timeline;
      });
    },
  );
}
