// ============================================================================
// x-flow-animate Directive
//
// Fires a one-shot animation in response to a DOM event or programmatic call.
// Supports named animations (for playAnimation()), event modifiers, queuing,
// auto-reverse, and once-only playback.
//
// Syntax:
//   <button x-flow-animate="{ nodes: ['a'], position: { x: 300 }, duration: 500 }">
//   <button x-flow-animate.click="stepOrSteps">
//   <div x-flow-animate.mouseenter.reverse="steps">
//   <div x-flow-animate:intro="introSteps">  <!-- named, no auto-trigger -->
//
// Modifiers:
//   .click        — trigger on click (default if no event modifier)
//   .mouseenter   — trigger on mouseenter
//   .once         — play only once, ignore subsequent triggers
//   .reverse      — auto-reverse on opposing event (mouseenter→mouseleave, click toggle)
//   .queue        — queue behind running animation instead of cancelling
// ============================================================================

import type { Alpine } from 'alpinejs';
import type { TimelineStep } from '../../animate/timeline';
import { FlowTimeline } from '../../animate/timeline';

const REVERSE_EVENTS: Record<string, string> = {
  mouseenter: 'mouseleave',
  click: 'click', // toggle behavior
};

export function registerFlowAnimateDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-animate',
    (
      el: HTMLElement,
      { value, modifiers, expression }: { value: string; modifiers: string[]; expression: string },
      { evaluate, effect, cleanup }: { evaluate: (expr: string) => any; effect: (fn: () => void) => void; cleanup: (fn: () => void) => void },
    ) => {
      const modSet = new Set(modifiers);
      const isOnce = modSet.has('once');
      const isReverse = modSet.has('reverse');
      const isQueue = modSet.has('queue');
      const animationName = value || ''; // argument from x-flow-animate:name

      // Determine trigger event
      let triggerEvent = 'click';
      if (modSet.has('mouseenter')) triggerEvent = 'mouseenter';
      else if (modSet.has('click')) triggerEvent = 'click';

      // State
      let activeTl: FlowTimeline | null = null;
      let queue: Array<() => Promise<void>> = [];
      let isProcessingQueue = false;
      let hasPlayed = false;
      let isReversed = false; // for click-toggle reverse

      /**
       * Resolve the expression into an array of TimelineStep objects.
       */
      function resolveSteps(): TimelineStep[] {
        const raw = evaluate(expression);
        if (Array.isArray(raw)) return raw;
        if (raw && typeof raw === 'object') return [raw];
        return [];
      }

      /**
       * Find the canvas data component from the DOM hierarchy.
       */
      function getCanvas(): any {
        const dataEl = el.closest('[x-data]') as HTMLElement | null;
        return dataEl ? Alpine.$data(dataEl) : null;
      }

      /**
       * Build and play a timeline from the given steps.
       */
      function playSteps(steps: TimelineStep[], reversed = false): Promise<void> {
        const canvas = getCanvas();
        if (!canvas?.timeline) return Promise.resolve();

        const tl: FlowTimeline = canvas.timeline();

        if (reversed) {
          // Reverse: play steps in reverse order
          for (let i = steps.length - 1; i >= 0; i--) {
            tl.step(steps[i]);
          }
          tl.reverse();
        } else {
          for (const s of steps) {
            if ((s as any).parallel) {
              tl.parallel((s as any).parallel);
            } else {
              tl.step(s);
            }
          }
        }

        activeTl = tl;
        return tl.play().then(() => {
          if (activeTl === tl) activeTl = null;
        });
      }

      /**
       * Enqueue or execute animation based on queue/cancel mode.
       */
      function triggerAnimation(reversed = false): void {
        if (isOnce && hasPlayed) return;
        hasPlayed = true;

        const steps = resolveSteps();
        if (steps.length === 0) return;

        const run = () => playSteps(steps, reversed);

        if (isQueue) {
          queue.push(run);
          processQueue();
        } else {
          // Cancel running animation
          activeTl?.stop();
          activeTl = null;
          queue = [];
          isProcessingQueue = false;
          run();
        }
      }

      /**
       * Process the queue sequentially.
       */
      async function processQueue(): Promise<void> {
        if (isProcessingQueue) return;
        isProcessingQueue = true;
        while (queue.length > 0) {
          const next = queue.shift()!;
          await next();
        }
        isProcessingQueue = false;
      }

      // ── Named animation registration ──────────────────────────────────
      // If argument is provided (x-flow-animate:name), register with canvas
      // and don't bind a trigger event (triggered via playAnimation).
      if (animationName) {
        effect(() => {
          const steps = resolveSteps();
          const canvas = getCanvas();
          if (canvas?.registerAnimation) {
            canvas.registerAnimation(animationName, steps);
          }
        });

        cleanup(() => {
          const canvas = getCanvas();
          if (canvas?.unregisterAnimation) {
            canvas.unregisterAnimation(animationName);
          }
        });
        return;
      }

      // ── Event-triggered animation ─────────────────────────────────────
      const onTrigger = () => {
        if (isReverse && triggerEvent === 'click') {
          // Toggle: alternate forward/reverse
          triggerAnimation(isReversed);
          isReversed = !isReversed;
        } else {
          triggerAnimation(false);
        }
      };

      el.addEventListener(triggerEvent, onTrigger);

      // Reverse modifier: bind opposing event
      let reverseListener: (() => void) | null = null;
      let reverseEvent: string | null = null;

      if (isReverse && triggerEvent !== 'click') {
        reverseEvent = REVERSE_EVENTS[triggerEvent] ?? null;
        if (reverseEvent) {
          reverseListener = () => triggerAnimation(true);
          el.addEventListener(reverseEvent, reverseListener);
        }
      }

      cleanup(() => {
        activeTl?.stop();
        el.removeEventListener(triggerEvent, onTrigger);
        if (reverseEvent && reverseListener) {
          el.removeEventListener(reverseEvent, reverseListener);
        }
      });
    },
  );
}
