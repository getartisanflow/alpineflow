// ============================================================================
// x-flow-wait Directive
//
// Renders a wait node: header (icon? + label + formatted duration), top target
// handle, bottom source handle. Reads `node.data.durationMs`,
// `node.data.label`, and `node.data.icon` from the bound scope.
//
// Usage:
//   <div x-flow-node="node" x-flow-wait></div>
//
// The directive fully owns the element's children. Consumers who want
// custom rendering should skip this directive and render manually.
// ============================================================================

import type { Alpine } from 'alpinejs';

type WaitData = {
    durationMs?: number;
    label?: string;
    icon?: string;
    [k: string]: unknown;
};
type NodeRef = { id?: unknown; data?: WaitData } | undefined | null;

/**
 * Format a duration in milliseconds as a compact human-readable string:
 *   <1s    → "{n}ms"          (e.g. 500ms)
 *   <1m    → "{n}s" / "{n.n}s" (e.g. 3s, 2.5s)
 *   else   → "{n}m" / "{n}m {s}s" (e.g. 2m, 1m 30s)
 */
export function formatWaitDuration(ms: number): string {
    if (!Number.isFinite(ms) || ms < 0) return '';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60_000) {
        const seconds = ms / 1000;
        return ms % 1000 === 0 ? `${seconds}s` : `${seconds.toFixed(1)}s`;
    }
    const minutes = Math.floor(ms / 60_000);
    const seconds = Math.floor((ms % 60_000) / 1000);
    return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`;
}

/** Remove every child from an element without using innerHTML (XSS-safe). */
function clearChildren(el: HTMLElement): void {
    while (el.firstChild) el.removeChild(el.firstChild);
}

export function registerFlowWaitDirective(Alpine: Alpine) {
    Alpine.directive('flow-wait', (el, _spec, { evaluate, effect, cleanup }) => {
        const host = el as HTMLElement;

        const readNode = (): NodeRef => {
            try {
                return evaluate('node') as NodeRef;
            } catch {
                return null;
            }
        };

        host.classList.add('flow-wait-node');
        host.setAttribute('data-flow-wait', 'true');

        const render = (): void => {
            clearChildren(host);

            const node = readNode();
            const data = node?.data;
            if (!data) return;

            const label = typeof data.label === 'string' && data.label ? data.label : 'Wait';
            const icon = typeof data.icon === 'string' && data.icon ? data.icon : '';
            const ms = typeof data.durationMs === 'number' ? data.durationMs : NaN;

            const header = document.createElement('div');
            header.className = 'flow-wait-header';

            if (icon) {
                const iconEl = document.createElement('span');
                iconEl.className = 'flow-wait-icon';
                iconEl.textContent = icon;
                header.appendChild(iconEl);
            }

            const labelEl = document.createElement('span');
            labelEl.className = 'flow-wait-label';
            labelEl.textContent = label;
            header.appendChild(labelEl);

            const durationEl = document.createElement('span');
            durationEl.className = 'flow-wait-duration';
            durationEl.textContent = formatWaitDuration(ms);
            header.appendChild(durationEl);

            host.appendChild(header);

            const target = document.createElement('div');
            target.className = 'flow-wait-handle flow-wait-handle--target';
            target.setAttribute('x-flow-handle:target.top', JSON.stringify('in'));
            host.appendChild(target);

            const source = document.createElement('div');
            source.className = 'flow-wait-handle flow-wait-handle--source';
            source.setAttribute('x-flow-handle:source.bottom', JSON.stringify('out'));
            host.appendChild(source);

            // Activate the freshly stamped x-flow-handle directives.
            Alpine.initTree(host);
        };

        effect(() => {
            // Touch reactive data so Alpine subscribes to changes.
            const data = readNode()?.data;
            void data?.durationMs;
            void data?.label;
            void data?.icon;
            render();
        });

        cleanup(() => {
            clearChildren(host);
            host.classList.remove('flow-wait-node');
            host.removeAttribute('data-flow-wait');
        });
    });
}
