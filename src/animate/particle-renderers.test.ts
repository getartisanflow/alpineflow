import { describe, it, expect } from 'vitest';
import { registerParticleRenderer, getParticleRenderer, hasParticleRenderer, circleRenderer } from './particle-renderers';
import type { ParticleRenderer } from '../core/types';

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
            create: () => document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
            update: () => {},
            destroy: (el) => el.remove(),
        };
        registerParticleRenderer('custom-test', custom);
        expect(getParticleRenderer('custom-test')).toBe(custom);
    });

    it('overwrites existing renderer with same name', () => {
        const replacement: ParticleRenderer = {
            create: () => document.createElementNS('http://www.w3.org/2000/svg', 'ellipse'),
            update: () => {},
            destroy: (el) => el.remove(),
        };
        registerParticleRenderer('custom-test', replacement);
        expect(getParticleRenderer('custom-test')).toBe(replacement);
    });
});
