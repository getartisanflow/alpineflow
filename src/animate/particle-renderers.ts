import type { ParticleRenderer, ParticleOptions, ParticleRenderState } from '../core/types';

const RENDERER_REGISTRY = new Map<string, ParticleRenderer>();

export function registerParticleRenderer(name: string, renderer: ParticleRenderer): void {
    RENDERER_REGISTRY.set(name, renderer);
}

export function getParticleRenderer(name: string): ParticleRenderer | undefined {
    return RENDERER_REGISTRY.get(name);
}

export function hasParticleRenderer(name: string): boolean {
    return RENDERER_REGISTRY.has(name);
}

// Built-in: circle (default, back-compat)
const NS = 'http://www.w3.org/2000/svg';

export const circleRenderer: ParticleRenderer = {
    create(svgLayer, options) {
        const el = document.createElementNS(NS, 'circle');
        el.setAttribute('r', String(options.size ?? 4));
        el.setAttribute('fill', options.color ?? '#8B5CF6');
        el.classList.add('flow-edge-particle');
        if (options.class) {
            for (const cls of options.class.split(' ')) {
                if (cls) { el.classList.add(cls); }
            }
        }
        svgLayer.appendChild(el);
        return el;
    },
    update(el, { x, y }: ParticleRenderState) {
        el.setAttribute('cx', String(x));
        el.setAttribute('cy', String(y));
    },
    destroy(el) {
        el.remove();
    },
};

/** Orb renderer — two-circle group with pulsing scale driven by elapsed time. */
export const orbRenderer: ParticleRenderer = {
    create(svgLayer, options) {
        const g = document.createElementNS(NS, 'g');
        const size = options.size ?? 6;
        const color = options.color ?? '#8B5CF6';

        const outer = document.createElementNS(NS, 'circle');
        outer.setAttribute('r', String(size * 1.5));
        outer.setAttribute('fill', color);
        outer.setAttribute('opacity', '0.3');
        g.appendChild(outer);

        const inner = document.createElementNS(NS, 'circle');
        inner.setAttribute('r', String(size));
        inner.setAttribute('fill', color);
        g.appendChild(inner);

        svgLayer.appendChild(g);
        return g;
    },
    update(el, { x, y, elapsed }) {
        const pulseRate = 2; // Hz — can be made configurable via data attributes later
        const pulseScale = 1 + 0.2 * Math.sin(elapsed * 0.001 * pulseRate * Math.PI * 2);
        el.setAttribute('transform', `translate(${x},${y}) scale(${pulseScale})`);
    },
    destroy(el) {
        el.remove();
    },
};

/** Beam renderer — elongated rectangle oriented along the travel tangent. */
export const beamRenderer: ParticleRenderer = {
    create(svgLayer, options) {
        const el = document.createElementNS(NS, 'rect');
        const length = options.length ?? 30;
        const width = options.width ?? 4;
        el.setAttribute('width', String(length));
        el.setAttribute('height', String(width));
        el.setAttribute('rx', String(width / 2));
        el.setAttribute('fill', options.color ?? '#8B5CF6');
        el.setAttribute('opacity', '0.8');
        svgLayer.appendChild(el);
        return el;
    },
    update(el, { x, y, velocity }) {
        const angle = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI);
        const length = parseFloat(el.getAttribute('width') ?? '30');
        const height = parseFloat(el.getAttribute('height') ?? '4');
        el.setAttribute('transform',
            `translate(${x - length / 2},${y - height / 2}) rotate(${angle},${length / 2},${height / 2})`);
    },
    destroy(el) {
        el.remove();
    },
};

/** Pulse renderer — expanding ripple ring that fades out over the particle lifetime. */
export const pulseRenderer: ParticleRenderer = {
    create(svgLayer, options) {
        const el = document.createElementNS(NS, 'circle');
        el.setAttribute('r', String(options.size ?? 6));
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke', options.color ?? '#8B5CF6');
        el.setAttribute('stroke-width', '2');
        svgLayer.appendChild(el);
        return el;
    },
    update(el, { x, y, progress }) {
        const maxScale = 3;
        const scale = 1 + progress * (maxScale - 1);
        const opacity = Math.max(0, 1 - progress);
        el.setAttribute('cx', '0');
        el.setAttribute('cy', '0');
        el.setAttribute('transform', `translate(${x},${y}) scale(${scale})`);
        el.setAttribute('opacity', String(opacity));
    },
    destroy(el) {
        el.remove();
    },
};

/** Image renderer — renders a user-provided SVG symbol (`#id`) or external image URL. */
export const imageRenderer: ParticleRenderer = {
    create(svgLayer, options) {
        const size = options.size ?? 16;
        const href = options.href ?? '';
        let el: SVGElement;

        if (href.startsWith('#')) {
            el = document.createElementNS(NS, 'use');
            el.setAttribute('href', href);
            el.setAttribute('width', String(size));
            el.setAttribute('height', String(size));
        } else {
            el = document.createElementNS(NS, 'image') as SVGElement;
            el.setAttribute('href', href);
            el.setAttribute('width', String(size));
            el.setAttribute('height', String(size));
        }

        svgLayer.appendChild(el);
        return el;
    },
    update(el, { x, y }) {
        const size = parseFloat(el.getAttribute('width') ?? '16');
        el.setAttribute('x', String(x - size / 2));
        el.setAttribute('y', String(y - size / 2));
    },
    destroy(el) {
        el.remove();
    },
};

registerParticleRenderer('circle', circleRenderer);
registerParticleRenderer('orb', orbRenderer);
registerParticleRenderer('beam', beamRenderer);
registerParticleRenderer('pulse', pulseRenderer);
registerParticleRenderer('image', imageRenderer);
