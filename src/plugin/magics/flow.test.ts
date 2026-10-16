// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowMagic } from './flow';

describe('$flow magic', () => {
    beforeAll(() => {
        registerFlowMagic(Alpine);
    });

    it('exposes the canvas t() to descendant templates', () => {
        document.body.innerHTML = '';
        const canvas = document.createElement('div');
        canvas.setAttribute('data-flow-canvas', '');
        canvas.setAttribute('x-data', "{ t(key, values) { return key + ':' + (values?.count ?? '-'); } }");
        const label = document.createElement('span');
        label.setAttribute('x-text', "$flow.t('announce.nodesSelected', { count: 2 })");
        canvas.appendChild(label);
        document.body.appendChild(canvas);
        Alpine.initTree(canvas);
        expect(label.textContent).toBe('announce.nodesSelected:2');
    });
});
