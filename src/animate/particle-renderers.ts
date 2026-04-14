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

        if (options.class) {
            for (const cls of options.class.split(' ')) {
                if (cls) { g.classList.add(cls); }
            }
        }
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

let beamUid = 0;

/**
 * Beam renderer — a traveling segment of the particle's path with an optional
 * multi-stop gradient painted along its length (tail→head). Clones the
 * backing SVG path and drives `stroke-dasharray`/`stroke-dashoffset` so the
 * beam bends with the path's curvature. A per-instance `<linearGradient>`
 * whose orientation vector is updated each frame paints the gradient along
 * the chord from the beam's tail point to its head point.
 *
 * Options:
 *   - `length`:   beam length in SVG user units (default 30)
 *   - `width`:    beam thickness (stroke-width) in SVG user units (default 4)
 *   - `color`:    solid stroke color (used when `gradient` is not provided)
 *   - `gradient`: array of `{ offset, color, opacity? }` stops (tail→head)
 *
 * Falls back to an oriented rectangle when no `pathEl` is available on the
 * render state (solid color only, gradient is ignored in fallback).
 */
export const beamRenderer: ParticleRenderer = {
    create(svgLayer, options) {
        const g = document.createElementNS(NS, 'g');
        (g as any).__beamLength = options.length ?? 30;
        (g as any).__beamWidth = options.width ?? 4;
        (g as any).__beamColor = options.color ?? '#8B5CF6';
        (g as any).__beamGradient = options.gradient;
        (g as any).__beamFollowThrough = options.followThrough ?? true;
        (g as any).__beamUid = `afbeam-${++beamUid}`;
        if (options.class) {
            for (const cls of options.class.split(' ')) {
                if (cls) { g.classList.add(cls); }
            }
        }
        svgLayer.appendChild(g);
        return g;
    },
    update(el, state) {
        const g = el as SVGGElement;
        const length = (g as any).__beamLength as number;
        const width = (g as any).__beamWidth as number;
        const color = (g as any).__beamColor as string;
        const gradient = (g as any).__beamGradient as ParticleOptions['gradient'];
        const uid = (g as any).__beamUid as string;

        if (state.pathEl) {
            let clone = (g as any).__pathClone as SVGPathElement | undefined;
            let gradientEl = (g as any).__gradient as SVGLinearGradientElement | undefined;

            if (!clone) {
                // Build the optional gradient def first so we can reference it
                // from the path's stroke attribute.
                let stroke = color;
                if (gradient && gradient.length > 0) {
                    const defs = document.createElementNS(NS, 'defs');
                    gradientEl = document.createElementNS(NS, 'linearGradient');
                    gradientEl.setAttribute('id', uid);
                    gradientEl.setAttribute('gradientUnits', 'userSpaceOnUse');
                    for (const stop of gradient) {
                        const stopEl = document.createElementNS(NS, 'stop');
                        stopEl.setAttribute('offset', String(stop.offset));
                        stopEl.setAttribute('stop-color', stop.color);
                        if (stop.opacity !== undefined) {
                            stopEl.setAttribute('stop-opacity', String(stop.opacity));
                        }
                        gradientEl.appendChild(stopEl);
                    }
                    defs.appendChild(gradientEl);
                    g.appendChild(defs);
                    stroke = `url(#${uid})`;
                    (g as any).__gradient = gradientEl;
                }

                clone = document.createElementNS(NS, 'path');
                clone.setAttribute('d', state.pathEl.getAttribute('d') ?? '');
                clone.setAttribute('fill', 'none');
                // Use inline styles (not presentation attributes) so a default
                // `.flow-edges path { stroke: var(--flow-edge-stroke); … }`
                // theme rule cannot override the beam's stroke.
                clone.style.stroke = stroke;
                clone.style.strokeWidth = String(width);
                clone.style.strokeLinecap = 'round';
                clone.style.fill = 'none';
                if (!gradient) {
                    clone.style.opacity = '0.85';
                }
                // Gap is the whole path length so the dash pattern period
                // (length + pathLength) never wraps within the visible path.
                // A shorter gap (e.g. pathLength - length) makes a phantom
                // copy of the dash appear at the opposite end at low progress.
                clone.setAttribute('stroke-dasharray', `${length} ${state.pathLength}`);
                g.appendChild(clone);
                (g as any).__pathClone = clone;
            }

            // Head travels from 0 to `pathLength + length` across the particle
            // lifetime so the tail can "follow through" after the head has
            // reached the target — the beam shrinks from the back as it exits
            // instead of vanishing the instant its head hits the endpoint.
            // When `followThrough: false`, fall back to the pre-v0.1.3 mapping
            // where `progress=1` means the head has just reached the target.
            const followThrough = (g as any).__beamFollowThrough as boolean;
            const headAt = followThrough
                ? state.progress * (state.pathLength + length)
                : state.progress * state.pathLength;
            const dashoffset = length - headAt;
            clone.setAttribute('stroke-dashoffset', String(dashoffset));

            // If we have a gradient, reorient it each frame to point from the
            // beam's tail to its head so the stops paint along the chord.
            // getPointAtLength naturally clamps at the path endpoints, which
            // keeps the bright head color at the target during the follow-
            // through phase.
            if (gradientEl) {
                const headLen = Math.max(0, Math.min(state.pathLength, headAt));
                const tailLen = Math.max(0, Math.min(state.pathLength, headAt - length));
                const headPt = state.pathEl.getPointAtLength(headLen);
                const tailPt = state.pathEl.getPointAtLength(tailLen);
                gradientEl.setAttribute('x1', String(tailPt.x));
                gradientEl.setAttribute('y1', String(tailPt.y));
                gradientEl.setAttribute('x2', String(headPt.x));
                gradientEl.setAttribute('y2', String(headPt.y));
            }
            return;
        }

        // Fallback: oriented rectangle for callers without a pathEl.
        let rect = (g as any).__fallbackRect as SVGRectElement | undefined;
        if (!rect) {
            rect = document.createElementNS(NS, 'rect');
            rect.setAttribute('width', String(length));
            rect.setAttribute('height', String(width));
            rect.setAttribute('rx', String(width / 2));
            rect.setAttribute('fill', color);
            rect.setAttribute('opacity', '0.8');
            g.appendChild(rect);
            (g as any).__fallbackRect = rect;
        }
        const angle = Math.atan2(state.velocity.y, state.velocity.x) * (180 / Math.PI);
        rect.setAttribute(
            'transform',
            `translate(${state.x - length / 2},${state.y - width / 2}) rotate(${angle},${length / 2},${width / 2})`,
        );
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
        if (options.class) {
            for (const cls of options.class.split(' ')) {
                if (cls) { el.classList.add(cls); }
            }
        }
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

        if (options.class) {
            for (const cls of options.class.split(' ')) {
                if (cls) { el.classList.add(cls); }
            }
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
