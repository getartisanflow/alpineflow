// @vitest-environment jsdom
// ============================================================================
// Workflow Alpine.data factories — DOM-order timing regression coverage.
//
// When a button is rendered as a sibling/ancestor of the .flow-container in
// DOM order, Alpine processes the button before the canvas. The button's
// init() resolves canvas via Alpine.$data() and gets back a stale empty proxy
// (the canvas's _x_dataStack hasn't been populated yet). Without the lazy
// re-resolution helper, the cached proxy is missing run/stopRun/etc. forever
// and click-time method calls throw TypeError.
//
// These tests stub the canvas data scope with vi.fn() spies baked directly
// onto the data factory return object, so the spies are reachable through any
// Alpine.$data() proxy reference (no proxy/spyOn identity issues).
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlowWorkflow from './index';
import { _resetRegistry } from '../core/registry';

interface CanvasSpies {
    run: ReturnType<typeof vi.fn>;
    stopRun: ReturnType<typeof vi.fn>;
    resetStates: ReturnType<typeof vi.fn>;
    resetExecutionLog: ReturnType<typeof vi.fn>;
    replayExecution: ReturnType<typeof vi.fn>;
    runState: 'idle' | 'running' | 'paused' | 'stopped';
    executionLog: any[];
}

interface MockCanvasOpts {
    seedExecutionLog?: any[];
    initialRunState?: CanvasSpies['runState'];
}

/**
 * Register a flowCanvas data factory whose canvas methods are pre-baked
 * vi.fn() spies. Returns the spy bag so tests can assert against them. The
 * `runState` is exposed as a getter that reads from the spy bag, allowing
 * tests to mutate it post-mount and observe the change through the button's
 * `isRunning` getter.
 */
function registerMockCanvas(opts: MockCanvasOpts = {}): CanvasSpies {
    const spies: CanvasSpies = {
        run: vi.fn().mockResolvedValue(null),
        stopRun: vi.fn(),
        resetStates: vi.fn(),
        resetExecutionLog: vi.fn(),
        replayExecution: vi.fn().mockReturnValue({ play: vi.fn(), pause: vi.fn(), stop: vi.fn() }),
        runState: opts.initialRunState ?? 'idle',
        executionLog: opts.seedExecutionLog ?? [],
    };

    Alpine.data('flowCanvas', () => ({
        run: spies.run,
        stopRun: spies.stopRun,
        resetStates: spies.resetStates,
        resetExecutionLog: spies.resetExecutionLog,
        replayExecution: spies.replayExecution,
        get runState() { return spies.runState; },
        get executionLog() { return spies.executionLog; },
    }));

    return spies;
}

function makeEl(tag: string, attrs: Record<string, string> = {}, id?: string): HTMLElement {
    const el = document.createElement(tag);
    if (id) el.id = id;
    for (const [k, v] of Object.entries(attrs)) {
        el.setAttribute(k, v);
    }
    return el;
}

function clearBody(): void {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
}

interface MountResult {
    root: HTMLElement;
    button: HTMLElement;
    canvasEl: HTMLElement;
}

function mountWithOrder(button: HTMLElement, buttonFirst: boolean): MountResult {
    clearBody();
    const root = makeEl('div');
    const canvasEl = makeEl('div', { 'x-data': 'flowCanvas' });
    canvasEl.classList.add('flow-container');
    if (buttonFirst) {
        root.appendChild(button);
        root.appendChild(canvasEl);
    } else {
        root.appendChild(canvasEl);
        root.appendChild(button);
    }
    document.body.appendChild(root);
    Alpine.initTree(root);
    return { root, button, canvasEl };
}

beforeEach(() => {
    _resetRegistry();
    AlpineFlowWorkflow(Alpine as any);
    if (!(Alpine as any).__started) {
        Alpine.start();
        (Alpine as any).__started = true;
    }
});

afterEach(() => {
    clearBody();
});

describe('flowRunButton — DOM order tolerance', () => {
    it('button-before-canvas: onClick triggers canvas.run via lazy re-resolution', async () => {
        const spies = registerMockCanvas();
        const button = makeEl('button', {
            'x-data': "flowRunButton({ startId: 'a', options: {}, handlersKey: '__h', target: null })",
        }, 'run');
        mountWithOrder(button, /* buttonFirst */ true);

        await (Alpine.$data(button) as any).onClick();
        expect(spies.run).toHaveBeenCalledTimes(1);
        expect(spies.run.mock.calls[0][0]).toBe('a');
    });

    it('button-after-canvas (regression check): conventional ordering still works', async () => {
        const spies = registerMockCanvas();
        const button = makeEl('button', {
            'x-data': "flowRunButton({ startId: 'a', options: {}, handlersKey: '__h', target: null })",
        }, 'run');
        mountWithOrder(button, /* buttonFirst */ false);

        await (Alpine.$data(button) as any).onClick();
        expect(spies.run).toHaveBeenCalledTimes(1);
    });
});

describe('flowStopButton — DOM order tolerance', () => {
    it('button-before-canvas: onClick invokes canvas.stopRun via lazy resolution', () => {
        const spies = registerMockCanvas();
        const button = makeEl('button', {
            'x-data': 'flowStopButton({ target: null, alwaysVisible: true })',
        }, 'stop');
        mountWithOrder(button, true);

        (Alpine.$data(button) as any).onClick();
        expect(spies.stopRun).toHaveBeenCalledTimes(1);
    });

    it('isRunning getter re-resolves canvas on read', () => {
        const spies = registerMockCanvas({ initialRunState: 'running' });
        const button = makeEl('button', {
            'x-data': 'flowStopButton({ target: null, alwaysVisible: false })',
        }, 'stop');
        mountWithOrder(button, true);

        // Without re-resolution, this would still see the stale empty proxy.
        // ensureCanvas('__any__') in the getter rebinds to the freshly
        // initialized canvas scope, allowing runState to flow through.
        expect((Alpine.$data(button) as any).isRunning).toBe(true);

        spies.runState = 'idle';
        expect((Alpine.$data(button) as any).isRunning).toBe(false);
    });
});

describe('flowResetButton — DOM order tolerance', () => {
    it('button-before-canvas: onClick invokes canvas.resetStates via lazy resolution', () => {
        const spies = registerMockCanvas();
        const button = makeEl('button', {
            'x-data': 'flowResetButton({ target: null })',
        }, 'reset');
        mountWithOrder(button, true);

        (Alpine.$data(button) as any).onClick();
        expect(spies.resetStates).toHaveBeenCalledTimes(1);
        expect(spies.resetExecutionLog).toHaveBeenCalledTimes(1);
    });

    it('no canvas in DOM: bails silently without throwing', () => {
        registerMockCanvas();
        clearBody();
        const root = makeEl('div');
        const button = makeEl('button', {
            'x-data': 'flowResetButton({ target: null })',
        }, 'reset');
        root.appendChild(button);
        document.body.appendChild(root);
        Alpine.initTree(root);
        expect(() => (Alpine.$data(button) as any).onClick()).not.toThrow();
    });
});

describe('flowExecutionLog — DOM order tolerance', () => {
    it('reads executionLog from canvas at getter time, even when mounted before canvas', () => {
        const seedLog = [
            { t: 1000, type: 'run:started' },
            { t: 1100, type: 'node:enter', nodeId: 'a' },
            { t: 1200, type: 'run:complete' },
        ];
        registerMockCanvas({ seedExecutionLog: seedLog });

        const logEl = makeEl('div', {
            'x-data': "flowExecutionLog({ sourceExpr: null, target: null, initialFilter: 'all', maxEvents: 50 })",
        }, 'log');
        const refBody = makeEl('div', { 'x-ref': 'body' });
        logEl.appendChild(refBody);
        mountWithOrder(logEl, true);

        const events = (Alpine.$data(logEl) as any).filteredEvents;
        expect(events).toHaveLength(3);
        expect(events[0].type).toBe('run:started');
    });

    it('returns empty array when canvas executionLog is empty (post-resolution)', () => {
        registerMockCanvas({ seedExecutionLog: [] });
        const logEl = makeEl('div', {
            'x-data': "flowExecutionLog({ sourceExpr: null, target: null, initialFilter: 'all', maxEvents: 50 })",
        }, 'log');
        const refBody = makeEl('div', { 'x-ref': 'body' });
        logEl.appendChild(refBody);
        mountWithOrder(logEl, true);

        expect((Alpine.$data(logEl) as any).filteredEvents).toEqual([]);
    });
});

describe('flowReplayControls — DOM order tolerance', () => {
    it('hasPlayableSource re-resolves canvas to detect executionLog after init', () => {
        registerMockCanvas({ seedExecutionLog: [{ t: 0, type: 'run:started' }] });
        const ctlEl = makeEl('div', {
            'x-data': 'flowReplayControls({ handleExpr: null, target: null })',
        }, 'ctl');
        mountWithOrder(ctlEl, true);

        expect((Alpine.$data(ctlEl) as any).hasPlayableSource).toBe(true);
    });

    it('_ensureHandle constructs replay handle on demand from canvas executionLog', () => {
        const spies = registerMockCanvas({ seedExecutionLog: [{ t: 0, type: 'run:started' }, { t: 100, type: 'run:complete' }] });
        const ctlEl = makeEl('div', {
            'x-data': 'flowReplayControls({ handleExpr: null, target: null })',
        }, 'ctl');
        mountWithOrder(ctlEl, true);

        const scope = Alpine.$data(ctlEl) as any;
        expect(scope._ensureHandle()).toBe(true);
        expect(spies.replayExecution).toHaveBeenCalledTimes(1);
    });
});
