// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import {
    registerParticleRenderer,
    getParticleRenderer,
    hasParticleRenderer,
    circleRenderer,
    orbRenderer,
    beamRenderer,
    pulseRenderer,
    imageRenderer,
} from './particle-renderers';
import type { ParticleRenderer, ParticleRenderState } from '../core/types';

const NS = 'http://www.w3.org/2000/svg';

/** Minimal valid render state for testing update() calls. */
const baseState: ParticleRenderState = {
    x: 10,
    y: 20,
    progress: 0.5,
    velocity: { x: 1, y: 0 },
    pathLength: 100,
    elapsed: 500,
};

describe('Particle renderer registry', () => {
    it('circle renderer is registered by default', () => {
        expect(hasParticleRenderer('circle')).toBe(true);
        expect(getParticleRenderer('circle')).toBe(circleRenderer);
    });

    it('getParticleRenderer returns undefined for unknown name', () => {
        expect(getParticleRenderer('nonexistent')).toBeUndefined();
    });

    it('registers and retrieves a custom renderer', () => {
        const custom: ParticleRenderer = {
            create: () => document.createElementNS(NS, 'rect'),
            update: () => {},
            destroy: (el) => el.remove(),
        };
        registerParticleRenderer('custom-test', custom);
        expect(getParticleRenderer('custom-test')).toBe(custom);
    });

    it('overwrites existing renderer with same name', () => {
        const replacement: ParticleRenderer = {
            create: () => document.createElementNS(NS, 'ellipse'),
            update: () => {},
            destroy: (el) => el.remove(),
        };
        registerParticleRenderer('custom-test', replacement);
        expect(getParticleRenderer('custom-test')).toBe(replacement);
    });
});

describe('Orb renderer', () => {
    it('is registered under "orb"', () => {
        expect(hasParticleRenderer('orb')).toBe(true);
        expect(getParticleRenderer('orb')).toBe(orbRenderer);
    });

    it('creates a <g> with two child circles', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = orbRenderer.create(svg, { size: 8, color: '#ff0000' });
        expect(el.tagName).toBe('g');
        expect(el.children.length).toBe(2);
        expect(el.children[0].tagName).toBe('circle');
        expect(el.children[1].tagName).toBe('circle');
    });

    it('outer circle uses size * 1.5 and inner uses size', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = orbRenderer.create(svg, { size: 8 });
        expect(el.children[0].getAttribute('r')).toBe('12');
        expect(el.children[1].getAttribute('r')).toBe('8');
    });

    it('applies default color when none provided', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = orbRenderer.create(svg, {});
        expect(el.children[0].getAttribute('fill')).toBe('#8B5CF6');
    });

    it('update() sets transform containing translate', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = orbRenderer.create(svg, {});
        orbRenderer.update(el, baseState);
        const transform = el.getAttribute('transform') ?? '';
        expect(transform).toContain('translate(10,20)');
        expect(transform).toContain('scale(');
    });

    it('destroy() removes the element from the DOM', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = orbRenderer.create(svg, {});
        expect(svg.contains(el)).toBe(true);
        orbRenderer.destroy(el);
        expect(svg.contains(el)).toBe(false);
    });
});

describe('Beam renderer', () => {
    it('is registered under "beam"', () => {
        expect(hasParticleRenderer('beam')).toBe(true);
        expect(getParticleRenderer('beam')).toBe(beamRenderer);
    });

    it('creates a <g> container', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = beamRenderer.create(svg, {});
        expect(el.tagName).toBe('g');
    });

    it('path-aware mode: clones the path and sets stroke-dasharray', () => {
        const svg = document.createElementNS(NS, 'svg');
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', 'M 0 0 L 100 0');
        svg.appendChild(path);

        const el = beamRenderer.create(svg, { length: 20, width: 5, color: '#f00' });
        beamRenderer.update(el, { ...baseState, pathEl: path as SVGPathElement, pathLength: 100 });

        const clone = el.querySelector('path') as SVGPathElement;
        expect(clone).not.toBeNull();
        expect(clone.getAttribute('d')).toBe('M 0 0 L 100 0');
        // Stroke/width applied via inline style to outrank theme CSS rules.
        expect(clone.style.stroke).toBe('rgb(255, 0, 0)');
        expect(clone.style.strokeWidth).toBe('5');
        expect(clone.style.fill).toBe('none');
        // Gap is the full pathLength so the pattern can't wrap inside the path.
        expect(clone!.getAttribute('stroke-dasharray')).toBe('20 100');
    });

    it('path-aware mode: stroke-dashoffset advances with progress (incl. follow-through)', () => {
        const svg = document.createElementNS(NS, 'svg');
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', 'M 0 0 L 100 0');
        svg.appendChild(path);

        const el = beamRenderer.create(svg, { length: 20 });
        // Head travels 0→(pathLength+length)=120 over the particle lifetime so
        // the tail catches up after the head reaches the target.

        // progress 0: head at 0, dashoffset = 20 - 0 = 20.
        beamRenderer.update(el, { ...baseState, pathEl: path as SVGPathElement, pathLength: 100, progress: 0 });
        expect(el.querySelector('path')!.getAttribute('stroke-dashoffset')).toBe('20');

        // progress 0.5 on 100-unit path w/ length=20: head=60, dashoffset=-40.
        beamRenderer.update(el, { ...baseState, pathEl: path as SVGPathElement, pathLength: 100, progress: 0.5 });
        expect(el.querySelector('path')!.getAttribute('stroke-dashoffset')).toBe('-40');

        // progress 1: head at 120 (past target), dashoffset=-100. Beam exited.
        beamRenderer.update(el, { ...baseState, pathEl: path as SVGPathElement, pathLength: 100, progress: 1 });
        expect(el.querySelector('path')!.getAttribute('stroke-dashoffset')).toBe('-100');
    });

    it('path-aware mode: builds a linearGradient when `gradient` stops are provided', () => {
        const svg = document.createElementNS(NS, 'svg');
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', 'M 0 0 L 100 0');
        // JSDOM doesn't implement getPointAtLength — stub for a horizontal line.
        (path as any).getPointAtLength = (len: number) => ({ x: len, y: 0 });
        svg.appendChild(path);

        const el = beamRenderer.create(svg, {
            length: 20,
            gradient: [
                { offset: 0, color: '#000', opacity: 0 },
                { offset: 1, color: '#fff', opacity: 1 },
            ],
        });
        beamRenderer.update(el, { ...baseState, pathEl: path as SVGPathElement, pathLength: 100, progress: 0.5 });

        const linearGradient = el.querySelector('linearGradient');
        expect(linearGradient).not.toBeNull();
        expect(linearGradient!.getAttribute('gradientUnits')).toBe('userSpaceOnUse');
        const stops = linearGradient!.querySelectorAll('stop');
        expect(stops.length).toBe(2);
        expect(stops[0].getAttribute('stop-color')).toBe('#000');
        expect(stops[1].getAttribute('stop-color')).toBe('#fff');

        // Path stroke references the gradient, not a solid color.
        const clone = el.querySelector('path') as SVGPathElement;
        expect(clone.style.stroke).toMatch(/url\(["']?#afbeam-/);

        // Gradient endpoints set to tail→head chord. At progress 0.5 on a 100-unit
        // horizontal path with length 20, head is at x=60 (progress*(pathLen+length))
        // and tail at x=40 (head-length), both in path user coords.
        expect(linearGradient!.getAttribute('x1')).toBe('40');
        expect(linearGradient!.getAttribute('x2')).toBe('60');
    });

    it('followThrough:false disables follow-through (pre-v0.1.3 semantics)', () => {
        const svg = document.createElementNS(NS, 'svg');
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', 'M 0 0 L 100 0');
        svg.appendChild(path);

        const el = beamRenderer.create(svg, { length: 20, followThrough: false });
        // progress 0.5 with follow-through off: head = 0.5 * 100 = 50, dashoffset = -30
        beamRenderer.update(el, { ...baseState, pathEl: path as SVGPathElement, pathLength: 100, progress: 0.5 });
        expect(el.querySelector('path')!.getAttribute('stroke-dashoffset')).toBe('-30');

        // progress 1: head at 100 (exactly at target), dashoffset = -80
        beamRenderer.update(el, { ...baseState, pathEl: path as SVGPathElement, pathLength: 100, progress: 1 });
        expect(el.querySelector('path')!.getAttribute('stroke-dashoffset')).toBe('-80');
    });

    it('fallback mode: renders an oriented rect when no pathEl is provided', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = beamRenderer.create(svg, { length: 30, width: 4 });
        beamRenderer.update(el, { ...baseState, x: 10, y: 20, velocity: { x: 1, y: 0 } });
        const rect = el.querySelector('rect');
        expect(rect).not.toBeNull();
        expect(rect!.getAttribute('width')).toBe('30');
        expect(rect!.getAttribute('height')).toBe('4');
        const transform = rect!.getAttribute('transform') ?? '';
        expect(transform).toContain('translate(');
        expect(transform).toContain('rotate(0,');
    });

    it('destroy() removes the element from the DOM', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = beamRenderer.create(svg, {});
        expect(svg.contains(el)).toBe(true);
        beamRenderer.destroy(el);
        expect(svg.contains(el)).toBe(false);
    });
});

describe('Pulse renderer', () => {
    it('is registered under "pulse"', () => {
        expect(hasParticleRenderer('pulse')).toBe(true);
        expect(getParticleRenderer('pulse')).toBe(pulseRenderer);
    });

    it('creates a <circle> with stroke and no fill', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = pulseRenderer.create(svg, { size: 10, color: '#00ff00' });
        expect(el.tagName).toBe('circle');
        expect(el.getAttribute('fill')).toBe('none');
        expect(el.getAttribute('stroke')).toBe('#00ff00');
        expect(el.getAttribute('r')).toBe('10');
    });

    it('defaults to size=6 and color=#8B5CF6', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = pulseRenderer.create(svg, {});
        expect(el.getAttribute('r')).toBe('6');
        expect(el.getAttribute('stroke')).toBe('#8B5CF6');
    });

    it('update() scales and fades based on progress', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = pulseRenderer.create(svg, {});
        // At progress=0: scale=1, opacity=1
        pulseRenderer.update(el, { ...baseState, x: 5, y: 15, progress: 0 });
        expect(el.getAttribute('transform')).toContain('translate(5,15)');
        expect(el.getAttribute('transform')).toContain('scale(1)');
        expect(el.getAttribute('opacity')).toBe('1');

        // At progress=1: scale=3, opacity=0
        pulseRenderer.update(el, { ...baseState, x: 5, y: 15, progress: 1 });
        expect(el.getAttribute('transform')).toContain('scale(3)');
        expect(el.getAttribute('opacity')).toBe('0');
    });

    it('destroy() removes the element from the DOM', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = pulseRenderer.create(svg, {});
        expect(svg.contains(el)).toBe(true);
        pulseRenderer.destroy(el);
        expect(svg.contains(el)).toBe(false);
    });
});

describe('Image renderer', () => {
    it('is registered under "image"', () => {
        expect(hasParticleRenderer('image')).toBe(true);
        expect(getParticleRenderer('image')).toBe(imageRenderer);
    });

    it('creates a <use> element when href starts with #', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = imageRenderer.create(svg, { href: '#my-symbol', size: 24 });
        expect(el.tagName).toBe('use');
        expect(el.getAttribute('href')).toBe('#my-symbol');
        expect(el.getAttribute('width')).toBe('24');
        expect(el.getAttribute('height')).toBe('24');
    });

    it('creates an <image> element for a URL href', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = imageRenderer.create(svg, { href: 'https://example.com/icon.svg', size: 16 });
        expect(el.tagName).toBe('image');
        expect(el.getAttribute('href')).toBe('https://example.com/icon.svg');
    });

    it('defaults to size=16 and empty href', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = imageRenderer.create(svg, {});
        // empty href → image element
        expect(el.tagName).toBe('image');
        expect(el.getAttribute('width')).toBe('16');
    });

    it('update() positions element centered on x,y', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = imageRenderer.create(svg, { href: '#icon', size: 16 });
        imageRenderer.update(el, baseState);
        // x - size/2 = 10 - 8 = 2, y - size/2 = 20 - 8 = 12
        expect(el.getAttribute('x')).toBe('2');
        expect(el.getAttribute('y')).toBe('12');
    });

    it('destroy() removes the element from the DOM', () => {
        const svg = document.createElementNS(NS, 'svg');
        const el = imageRenderer.create(svg, { href: '#icon' });
        expect(svg.contains(el)).toBe(true);
        imageRenderer.destroy(el);
        expect(svg.contains(el)).toBe(false);
    });
});
