// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowWaitDirective } from './flow-wait';
import { registerFlowHandleDirective } from './flow-handle';

function clearChildren(el: HTMLElement): void {
    while (el.firstChild) el.removeChild(el.firstChild);
}

describe('x-flow-wait directive', () => {
    beforeEach(() => {
        registerFlowHandleDirective(Alpine);
        registerFlowWaitDirective(Alpine);
    });

    function mount(data: Record<string, unknown>) {
        clearChildren(document.body);
        const host = document.createElement('div');
        host.setAttribute('x-data', `{ node: { id: 'w', data: ${JSON.stringify(data)} } }`);
        const target = document.createElement('div');
        target.setAttribute('x-flow-wait', '');
        target.className = 'flow-node';
        target.setAttribute('data-flow-node-id', 'w');
        host.appendChild(target);
        document.body.appendChild(host);
        Alpine.initTree(host);
        return target;
    }

    it('stamps .flow-wait-node class and data-flow-wait attribute on the host', () => {
        const el = mount({ durationMs: 500 });
        expect(el.classList.contains('flow-wait-node')).toBe(true);
        expect(el.getAttribute('data-flow-wait')).toBe('true');
    });

    it('renders the default "Wait" label when node.data.label is absent', () => {
        const el = mount({ durationMs: 500 });
        const label = el.querySelector('.flow-wait-label');
        expect(label).not.toBeNull();
        expect(label?.textContent).toBe('Wait');
    });

    it('renders a custom node.data.label when provided', () => {
        const el = mount({ durationMs: 500, label: 'Cooldown' });
        const label = el.querySelector('.flow-wait-label');
        expect(label?.textContent).toBe('Cooldown');
    });

    it('formats sub-second durations as ms', () => {
        const el = mount({ durationMs: 500 });
        const dur = el.querySelector('.flow-wait-duration');
        expect(dur?.textContent).toBe('500ms');
    });

    it('formats fractional-second durations as decimal seconds', () => {
        const el = mount({ durationMs: 2500 });
        const dur = el.querySelector('.flow-wait-duration');
        expect(dur?.textContent).toBe('2.5s');
    });

    it('formats whole-second durations without a decimal', () => {
        const el = mount({ durationMs: 3000 });
        const dur = el.querySelector('.flow-wait-duration');
        expect(dur?.textContent).toBe('3s');
    });

    it('formats minute-scale durations as "Nm Ns"', () => {
        const el = mount({ durationMs: 90000 });
        const dur = el.querySelector('.flow-wait-duration');
        expect(dur?.textContent).toBe('1m 30s');
    });

    it('formats whole-minute durations without trailing seconds', () => {
        const el = mount({ durationMs: 120000 });
        const dur = el.querySelector('.flow-wait-duration');
        expect(dur?.textContent).toBe('2m');
    });

    it('renders a top target handle and a bottom source handle', () => {
        const el = mount({ durationMs: 500 });
        const handles = el.querySelectorAll('[data-flow-handle-id]');
        expect(handles.length).toBe(2);
        const target = el.querySelector('.flow-wait-handle--target');
        const source = el.querySelector('.flow-wait-handle--source');
        expect(target?.getAttribute('data-flow-handle-position')).toBe('top');
        expect(source?.getAttribute('data-flow-handle-position')).toBe('bottom');
        expect(target?.getAttribute('data-flow-handle-type')).toBe('target');
        expect(source?.getAttribute('data-flow-handle-type')).toBe('source');
    });

    it('renders an icon span when node.data.icon is provided (textContent only — XSS-safe)', () => {
        const el = mount({ durationMs: 500, icon: '⏱' });
        const icon = el.querySelector('.flow-wait-icon');
        expect(icon).not.toBeNull();
        expect(icon?.textContent).toBe('⏱');
        // Confirm no markup leaked through innerHTML
        expect(icon?.innerHTML).toBe('⏱');
    });

    it('omits the icon span when node.data.icon is absent', () => {
        const el = mount({ durationMs: 500 });
        expect(el.querySelector('.flow-wait-icon')).toBeNull();
    });

    it('renders nothing structural when node.data is missing', () => {
        clearChildren(document.body);
        const host = document.createElement('div');
        host.setAttribute('x-data', `{ node: { id: 'w' } }`);
        const target = document.createElement('div');
        target.setAttribute('x-flow-wait', '');
        host.appendChild(target);
        document.body.appendChild(host);
        Alpine.initTree(host);
        expect(target.querySelector('.flow-wait-header')).toBeNull();
        expect(target.classList.contains('flow-wait-node')).toBe(true);
    });
});
