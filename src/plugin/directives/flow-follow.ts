// ============================================================================
// x-flow-follow Directive
//
// Declarative camera tracking.
//
// Usage:
//   <button x-flow-follow="'node-1'">Track Node 1</button>
//   <button x-flow-follow.toggle="'node-1'">Toggle Tracking</button>
//   <button x-flow-follow="{ target: 'node-1', zoom: 1.5, speed: 0.1 }">Track</button>
// ============================================================================

import type { Alpine } from 'alpinejs';

interface FollowOptions {
  target: string;
  zoom?: number;
  speed?: number;
}

export function parseFollowExpression(value: unknown): FollowOptions | null {
  if (typeof value === 'string') {
    return { target: value };
  }
  if (value && typeof value === 'object' && 'target' in value) {
    const obj = value as Record<string, unknown>;
    return {
      target: obj.target as string,
      zoom: typeof obj.zoom === 'number' ? obj.zoom : undefined,
      speed: typeof obj.speed === 'number' ? obj.speed : undefined,
    };
  }
  return null;
}

export function registerFlowFollowDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-follow',
    (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
      const isToggle = modifiers.includes('toggle');

      const canvasEl = el.closest('[data-flow-canvas]') as HTMLElement;
      if (!canvasEl) return;

      const canvas = Alpine.$data(canvasEl) as any;
      if (!canvas?.follow) return;

      let followHandle: { stop: () => void; finished?: Promise<void> } | null = null;

      const updateState = (active: boolean) => {
        el.classList.toggle('flow-following', active);
        el.setAttribute('aria-pressed', String(active));
      };

      const onClick = () => {
        if (!expression) return;
        const value = evaluate(expression);
        const opts = parseFollowExpression(value);
        if (!opts) return;

        // Toggle: stop if already following
        if (isToggle && followHandle) {
          followHandle.stop();
          followHandle = null;
          updateState(false);
          return;
        }

        // Stop any existing follow before starting new one
        if (followHandle) {
          followHandle.stop();
        }

        const followOpts: Record<string, unknown> = {};
        if (opts.zoom !== undefined) followOpts.zoom = opts.zoom;
        if (opts.speed !== undefined) followOpts.speed = opts.speed;

        followHandle = canvas.follow(opts.target, followOpts);
        updateState(true);

        // Listen for follow completion
        if (followHandle?.finished) {
          followHandle.finished.then(() => {
            followHandle = null;
            updateState(false);
          });
        }
      };

      el.addEventListener('click', onClick);

      cleanup(() => {
        el.removeEventListener('click', onClick);
        if (followHandle) {
          followHandle.stop();
          followHandle = null;
        }
      });
    },
  );
}
