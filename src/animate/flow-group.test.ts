import { describe, it, expect, vi } from 'vitest';
import { FlowGroup } from './flow-group';
import type { FlowGroupHost } from './flow-group';
import type { FlowAnimationHandle, StopOptions } from '../core/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeHandle(): FlowAnimationHandle {
    return {
        pause: vi.fn(),
        resume: vi.fn(),
        stop: vi.fn(),
        reverse: vi.fn(),
        play: vi.fn(),
        playForward: vi.fn(),
        playBackward: vi.fn(),
        restart: vi.fn(),
        direction: 'forward',
        isFinished: false,
        currentValue: new Map(),
        finished: Promise.resolve(),
    };
}

function makeHost(overrides: Partial<FlowGroupHost> = {}): FlowGroupHost {
    const defaultHandle = makeHandle();
    return {
        animate: vi.fn().mockReturnValue(defaultHandle),
        update: vi.fn().mockReturnValue(defaultHandle),
        sendParticle: vi.fn().mockReturnValue({ getCurrentPosition: vi.fn(), stop: vi.fn(), finished: Promise.resolve() }),
        timeline: vi.fn().mockReturnValue({}),
        getHandles: vi.fn().mockReturnValue([defaultHandle]),
        cancelAll: vi.fn(),
        pauseAll: vi.fn(),
        resumeAll: vi.fn(),
        ...overrides,
    };
}

// ── FlowGroup Tests ───────────────────────────────────────────────────────────

describe('FlowGroup', () => {
    it('injects tag into animate() calls', () => {
        const host = makeHost();
        const group = new FlowGroup('my-group', host);

        group.animate({ nodes: { a: { position: { x: 100 } } } });

        expect(host.animate).toHaveBeenCalledWith(
            { nodes: { a: { position: { x: 100 } } } },
            expect.objectContaining({ tag: 'my-group' }),
        );
    });

    it('injects tag into update() calls', () => {
        const host = makeHost();
        const group = new FlowGroup('my-group', host);

        group.update({ nodes: { b: { position: { x: 200, y: 50 } } } });

        expect(host.update).toHaveBeenCalledWith(
            { nodes: { b: { position: { x: 200, y: 50 } } } },
            expect.objectContaining({ tag: 'my-group' }),
        );
    });

    it('injects tag into sendParticle() calls', () => {
        const host = makeHost();
        const group = new FlowGroup('my-group', host);

        group.sendParticle('edge-1', { color: 'red' });

        expect(host.sendParticle).toHaveBeenCalledWith(
            'edge-1',
            expect.objectContaining({ tag: 'my-group', color: 'red' }),
        );
    });

    it('cancelAll() delegates with tag filter', () => {
        const host = makeHost();
        const group = new FlowGroup('my-group', host);
        const stopOptions: StopOptions = { mode: 'freeze' };

        group.cancelAll(stopOptions);

        expect(host.cancelAll).toHaveBeenCalledWith({ tag: 'my-group' }, stopOptions);
    });

    it('pauseAll() delegates with tag filter', () => {
        const host = makeHost();
        const group = new FlowGroup('my-group', host);

        group.pauseAll();

        expect(host.pauseAll).toHaveBeenCalledWith({ tag: 'my-group' });
    });

    it('resumeAll() delegates with tag filter', () => {
        const host = makeHost();
        const group = new FlowGroup('my-group', host);

        group.resumeAll();

        expect(host.resumeAll).toHaveBeenCalledWith({ tag: 'my-group' });
    });

    it('handles getter filters by tag', () => {
        const h1 = makeHandle();
        const h2 = makeHandle();
        const host = makeHost({ getHandles: vi.fn().mockReturnValue([h1, h2]) });
        const group = new FlowGroup('my-group', host);

        const result = group.handles;

        expect(host.getHandles).toHaveBeenCalledWith({ tag: 'my-group' });
        expect(result).toEqual([h1, h2]);
    });

    it('preserves existing options when injecting tag', () => {
        const host = makeHost();
        const group = new FlowGroup('my-group', host);

        group.animate(
            { nodes: { c: { position: { x: 0, y: 0 } } } },
            { duration: 500, easing: 'easeIn', delay: 100 },
        );

        expect(host.animate).toHaveBeenCalledWith(
            { nodes: { c: { position: { x: 0, y: 0 } } } },
            expect.objectContaining({ duration: 500, easing: 'easeIn', delay: 100, tag: 'my-group' }),
        );
    });

    it('timeline() delegates to host', () => {
        const timelineResult = { play: vi.fn() };
        const host = makeHost({ timeline: vi.fn().mockReturnValue(timelineResult) });
        const group = new FlowGroup('my-group', host);

        const result = group.timeline();

        expect(host.timeline).toHaveBeenCalled();
        expect(result).toBe(timelineResult);
    });

    it('timeline() sets the group tag on the returned timeline', () => {
        const mockTimeline = { setTag: vi.fn() };
        const host = makeHost({ timeline: vi.fn().mockReturnValue(mockTimeline) });
        const group = new FlowGroup('my-group', host);

        const tl = group.timeline();
        expect(mockTimeline.setTag).toHaveBeenCalledWith('my-group');
        expect(tl).toBe(mockTimeline);
    });

    it('sendParticle() returns undefined when host has no sendParticle', () => {
        const host = makeHost();
        delete (host as any).sendParticle;
        const group = new FlowGroup('my-group', host);

        const result = group.sendParticle('edge-1');

        expect(result).toBeUndefined();
    });

    it('cancelAll() delegates with no stop options when none provided', () => {
        const host = makeHost();
        const group = new FlowGroup('my-group', host);

        group.cancelAll();

        expect(host.cancelAll).toHaveBeenCalledWith({ tag: 'my-group' }, undefined);
    });

    it('exposes the group name', () => {
        const host = makeHost();
        const group = new FlowGroup('entrance', host);

        expect(group.name).toBe('entrance');
    });

    it('preserves user-provided tag in tags array for animate()', () => {
        const host = makeHost();
        const group = new FlowGroup('my-group', host);

        group.animate(
            { nodes: { a: { position: { x: 100 } } } },
            { tag: 'custom', duration: 500 },
        );

        expect(host.animate).toHaveBeenCalledWith(
            { nodes: { a: { position: { x: 100 } } } },
            expect.objectContaining({
                tag: 'my-group',
                tags: expect.arrayContaining(['custom']),
            }),
        );
    });

    it('merges user tags array with group tag for animate()', () => {
        const host = makeHost();
        const group = new FlowGroup('my-group', host);

        group.animate(
            { nodes: { a: { position: { x: 100 } } } },
            { tag: 'custom', tags: ['extra'], duration: 500 },
        );

        const calledOptions = (host.animate as any).mock.calls[0][1];
        expect(calledOptions.tag).toBe('my-group');
        expect(calledOptions.tags).toContain('custom');
        expect(calledOptions.tags).toContain('extra');
    });

    it('preserves user-provided tag in tags array for update()', () => {
        const host = makeHost();
        const group = new FlowGroup('my-group', host);

        group.update(
            { nodes: { b: { position: { x: 200 } } } },
            { tag: 'user-tag', duration: 300 },
        );

        expect(host.update).toHaveBeenCalledWith(
            { nodes: { b: { position: { x: 200 } } } },
            expect.objectContaining({
                tag: 'my-group',
                tags: expect.arrayContaining(['user-tag']),
            }),
        );
    });

    it('passes empty tags array when user provides no tag or tags for animate()', () => {
        const host = makeHost();
        const group = new FlowGroup('my-group', host);

        group.animate(
            { nodes: { a: { position: { x: 100 } } } },
            { duration: 500 },
        );

        const calledOptions = (host.animate as any).mock.calls[0][1];
        expect(calledOptions.tag).toBe('my-group');
        expect(calledOptions.tags).toEqual([]);
    });
});
