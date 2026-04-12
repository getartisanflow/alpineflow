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

registerParticleRenderer('circle', circleRenderer);
