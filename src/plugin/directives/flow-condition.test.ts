// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowConditionDirective } from './flow-condition';
import { registerFlowHandleDirective } from './flow-handle';

function clearChildren(el: HTMLElement): void {
    while (el.firstChild) el.removeChild(el.firstChild);
}

describe('x-flow-condition directive', () => {
    beforeEach(() => {
        registerFlowHandleDirective(Alpine);
        registerFlowConditionDirective(Alpine);
    });

    function mount(data: Record<string, unknown>, directionExpr?: string): HTMLElement {
        clearChildren(document.body);
        const host = document.createElement('div');
        host.setAttribute('x-data', `{ node: { id: 'c1', type: 'flow-condition', data: ${JSON.stringify(data)} } }`);
        const target = document.createElement('div');
        target.setAttribute('x-flow-condition', directionExpr ?? '');
        target.className = 'flow-node';
        target.setAttribute('data-flow-node-id', 'c1');
        host.appendChild(target);
        document.body.appendChild(host);
        Alpine.initTree(host);
        return target;
    }

    it('stamps .flow-condition-node and direction attribute (default horizontal)', () => {
        const el = mount({ condition: { field: 'plan', op: 'equals', value: 'annual' } });
        expect(el.classList.contains('flow-condition-node')).toBe(true);
        expect(el.getAttribute('data-flow-condition-direction')).toBe('horizontal');
    });

    it('honors explicit direction="vertical" via the directive expression', () => {
        const el = mount({ condition: { field: 'x', op: 'equals', value: 1 } }, "'vertical'");
        expect(el.getAttribute('data-flow-condition-direction')).toBe('vertical');
    });

    it('falls back to node.data.direction when the expression is omitted', () => {
        const el = mount({ direction: 'vertical', condition: { field: 'x', op: 'equals', value: 1 } });
        expect(el.getAttribute('data-flow-condition-direction')).toBe('vertical');
    });

    it('renders header with node.data.label when set', () => {
        const el = mount({ label: 'Plan check', condition: { field: 'plan', op: 'equals', value: 'annual' } });
        expect(el.querySelector('.flow-condition-header')?.textContent).toBe('Plan check');
    });

    it('falls back to "Condition" header label when none provided', () => {
        const el = mount({ condition: { field: 'x', op: 'equals', value: 1 } });
        expect(el.querySelector('.flow-condition-header')?.textContent).toBe('Condition');
    });

    it('renders pretty-printed condition body', () => {
        const el = mount({ condition: { field: 'plan', op: 'equals', value: 'annual' } });
        expect(el.querySelector('.flow-condition-body')?.textContent).toBe("plan == 'annual'");
    });

    it('uses evaluateLabel override in body when present (with no condition)', () => {
        // Mount manually with a function (JSON.stringify drops it)
        clearChildren(document.body);
        const host = document.createElement('div');
        host.setAttribute('x-data', `{ node: { id: 'c1', type: 'flow-condition', data: { evaluate: () => true, evaluateLabel: 'Custom: amount > $1k' } } }`);
        const target = document.createElement('div');
        target.setAttribute('x-flow-condition', '');
        host.appendChild(target);
        document.body.appendChild(host);
        Alpine.initTree(host);

        expect(target.querySelector('.flow-condition-body')?.textContent).toBe('Custom: amount > $1k');
    });

    it('falls back to "[custom evaluator]" when only evaluate is set', () => {
        clearChildren(document.body);
        const host = document.createElement('div');
        host.setAttribute('x-data', `{ node: { id: 'c1', type: 'flow-condition', data: { evaluate: () => true } } }`);
        const target = document.createElement('div');
        target.setAttribute('x-flow-condition', '');
        host.appendChild(target);
        document.body.appendChild(host);
        Alpine.initTree(host);

        expect(target.querySelector('.flow-condition-body')?.textContent).toBe('[custom evaluator]');
    });

    it('renders three handles with correct dataset attrs', () => {
        const el = mount({ condition: { field: 'x', op: 'equals', value: 1 } });
        expect(el.querySelector('.flow-condition-handle-target')).toBeTruthy();
        const trueHandle = el.querySelector('.flow-condition-handle--true');
        const falseHandle = el.querySelector('.flow-condition-handle--false');
        expect(trueHandle?.getAttribute('data-source-handle')).toBe('true');
        expect(falseHandle?.getAttribute('data-source-handle')).toBe('false');
    });

    it('reflects _branchTaken="true" via attribute on the host', () => {
        const el = mount({ condition: { field: 'x', op: 'equals', value: 1 }, _branchTaken: 'true' });
        expect(el.getAttribute('data-flow-condition-branch-taken')).toBe('true');
    });

    it('reflects _branchTaken="false" via attribute on the host', () => {
        const el = mount({ condition: { field: 'x', op: 'equals', value: 1 }, _branchTaken: 'false' });
        expect(el.getAttribute('data-flow-condition-branch-taken')).toBe('false');
    });

    it('removes branch-taken attribute when _branchTaken is absent', () => {
        const el = mount({ condition: { field: 'x', op: 'equals', value: 1 } });
        expect(el.hasAttribute('data-flow-condition-branch-taken')).toBe(false);
    });
});
