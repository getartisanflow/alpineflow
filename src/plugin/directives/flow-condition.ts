// ============================================================================
// x-flow-condition Directive
//
// Renders a workflow condition node:
//   - .flow-condition-node host
//   - .flow-condition-header with node.data.label (default "Condition")
//   - .flow-condition-body with prettyPrintCondition(condition) OR
//     evaluateLabel / "[custom evaluator]" when node.data.evaluate is used
//   - 3 handles: target + true + false (sourceHandle stamped on each)
//
// Reactive: re-renders when node.data.condition / label / evaluate /
// evaluateLabel / direction / _branchTaken mutate. The host is also
// stamped with `data-flow-condition-direction` and (when set)
// `data-flow-condition-branch-taken` so themes can decorate the chosen
// branch and mute the other.
//
// Usage:
//   <div x-flow-node="node" x-flow-condition="'horizontal'"></div>
//
// The directive value (Alpine expression) is the direction — defaults to
// 'horizontal'. Pass `'vertical'` to flip the layout.
//
// XSS-safe: all dynamic text uses textContent; no innerHTML anywhere.
// ============================================================================

import type { Alpine } from 'alpinejs';
import { prettyPrintCondition } from '../../workflow/condition-pretty-print';

type ConditionData = {
    label?: string;
    condition?: { field: string; op: string; value?: unknown };
    evaluate?: (...args: any[]) => unknown;
    evaluateLabel?: string;
    direction?: 'horizontal' | 'vertical';
    _branchTaken?: 'true' | 'false' | string | null;
    [k: string]: unknown;
};
type NodeRef = { id?: unknown; data?: ConditionData } | undefined | null;

function clearChildren(el: HTMLElement): void {
    while (el.firstChild) el.removeChild(el.firstChild);
}

function resolveDirection(value: unknown, fallback: ConditionData['direction']): 'horizontal' | 'vertical' {
    if (value === 'vertical' || value === 'horizontal') return value;
    if (fallback === 'vertical' || fallback === 'horizontal') return fallback;
    return 'horizontal';
}

export function registerFlowConditionDirective(Alpine: Alpine) {
    Alpine.directive('flow-condition', (el, { expression }, { evaluate, effect, cleanup }) => {
        const host = el as HTMLElement;

        const readNode = (): NodeRef => {
            try {
                // Alpine re-throws expression errors asynchronously, so this
                // catch can't stop a missing/torn-down `node` scope from
                // surfacing as an uncaught "node is not defined". See issue #21.
                return (evaluate("typeof node !== 'undefined' ? node : null") as NodeRef) ?? null;
            } catch {
                return null;
            }
        };

        const evaluateDirective = (): unknown => {
            if (!expression) return undefined;
            try {
                return evaluate(expression);
            } catch {
                return expression;
            }
        };

        host.classList.add('flow-condition-node');

        const render = (): void => {
            const node = readNode();
            const data = node?.data ?? {};

            const direction = resolveDirection(evaluateDirective(), data.direction);
            host.setAttribute('data-flow-condition-direction', direction);

            const branchTaken = data._branchTaken;
            if (branchTaken === 'true' || branchTaken === 'false') {
                host.setAttribute('data-flow-condition-branch-taken', branchTaken);
            } else {
                host.removeAttribute('data-flow-condition-branch-taken');
            }

            clearChildren(host);

            const label = typeof data.label === 'string' && data.label ? data.label : 'Condition';
            const header = document.createElement('div');
            header.className = 'flow-condition-header';
            header.textContent = label;
            host.appendChild(header);

            const body = document.createElement('div');
            body.className = 'flow-condition-body';
            if (data.condition && typeof data.condition === 'object') {
                body.textContent = prettyPrintCondition(data.condition as any);
            } else if (typeof data.evaluate === 'function') {
                body.textContent = typeof data.evaluateLabel === 'string' && data.evaluateLabel
                    ? data.evaluateLabel
                    : '[custom evaluator]';
            } else {
                body.textContent = '';
            }
            host.appendChild(body);

            const target = document.createElement('div');
            target.className = 'flow-condition-handle-target';
            target.setAttribute('data-flow-handle-direction', 'target');
            target.setAttribute('x-flow-handle:target', JSON.stringify('in'));
            host.appendChild(target);

            const trueHandle = document.createElement('div');
            trueHandle.className = 'flow-condition-handle-source flow-condition-handle--true';
            trueHandle.setAttribute('data-flow-handle-direction', 'source');
            trueHandle.setAttribute('data-source-handle', 'true');
            trueHandle.setAttribute('x-flow-handle:source', JSON.stringify('true'));
            host.appendChild(trueHandle);

            const falseHandle = document.createElement('div');
            falseHandle.className = 'flow-condition-handle-source flow-condition-handle--false';
            falseHandle.setAttribute('data-flow-handle-direction', 'source');
            falseHandle.setAttribute('data-source-handle', 'false');
            falseHandle.setAttribute('x-flow-handle:source', JSON.stringify('false'));
            host.appendChild(falseHandle);

            // Activate freshly-stamped x-flow-handle directives.
            Alpine.initTree(host);
        };

        effect(() => {
            // Skip detached elements: a Livewire morph (or teardown) can flush
            // this effect after the node element leaves the DOM, and
            // evaluate('node') then throws (scope gone). See issue #21.
            if (!host.isConnected) return;

            const data = readNode()?.data;
            // Touch reactive fields so Alpine subscribes.
            void data?.label;
            void data?.condition;
            void (data?.condition as any)?.field;
            void (data?.condition as any)?.op;
            void (data?.condition as any)?.value;
            void data?.evaluate;
            void data?.evaluateLabel;
            void data?.direction;
            void data?._branchTaken;
            render();
        });

        cleanup(() => {
            clearChildren(host);
            host.classList.remove('flow-condition-node');
            host.removeAttribute('data-flow-condition-direction');
            host.removeAttribute('data-flow-condition-branch-taken');
        });
    });
}
