// ============================================================================
// alpinejs-flow/workflow — Workflow Execution Addon
//
// Registers via the W0 setup callback mechanism. Extends every flowCanvas
// with $flow.run(), $flow.replayExecution(), $flow.executionLog, and
// $flow.resetExecutionLog().
//
// Also registers the $workflowRun Alpine magic so parent scopes can invoke
// $flow.run() without DOM traversal — it finds the nearest canvas (ancestor
// or descendant) automatically.
// ============================================================================

import { registerAddon } from '../core/registry';
import { createRunExecutor } from './run';
import { createReplayExecutor } from './replay';
import { validateWorkflow } from './validate';
import type { WorkflowRunState } from './types';

export type { FlowRunHandlers, FlowRunOptions, FlowRunContext, FlowRunHandle, FlowRunLogEntry, FlowRunLogEntryType, FlowCondition, ReplayHandle, ReplayOptions, WorkflowRunState } from './types';
export { validateWorkflow } from './validate';
export type { WorkflowIssueCode, WorkflowValidationIssue, WorkflowValidationResult } from './validate';

export default function AlpineFlowWorkflow(Alpine: any): void {
    registerAddon('workflow', {
        setup(canvas: any) {
            canvas.run = createRunExecutor(canvas);
            canvas.replayExecution = createReplayExecutor(canvas);
            canvas.executionLog = [];
            canvas.resetExecutionLog = function () { this.executionLog = []; };
            canvas.validateWorkflow = function () {
                return validateWorkflow(this);
            };

            // Canvas-level run tracking — populated by createRunExecutor when a
            // run is in flight. Drives the workflow UI primitives (run/stop
            // buttons, replay controls) without forcing consumers to track the
            // handle themselves.
            canvas._currentRunHandle = null;
            Object.defineProperty(canvas, 'runState', {
                get(): WorkflowRunState {
                    const h = this._currentRunHandle;
                    if (!h) return 'idle';
                    if (h.isStopped) return 'stopped';
                    if (h.isPaused) return 'paused';
                    return 'running';
                },
                configurable: true,
            });
            canvas.stopRun = function (): void {
                this._currentRunHandle?.stop?.();
            };

            // Wrap any pre-existing resetStates() so workflow-condition nodes
            // also have their `_branchTaken` cleared. Defensive — if core
            // doesn't expose resetStates, define a minimal one.
            const originalReset = typeof canvas.resetStates === 'function'
                ? canvas.resetStates.bind(canvas)
                : null;
            canvas.resetStates = function (...args: any[]) {
                if (originalReset) originalReset(...args);
                if (Array.isArray(this.nodes)) {
                    for (const node of this.nodes) {
                        if (node && node.type === 'flow-condition' && node.data) {
                            delete node.data._branchTaken;
                        }
                    }
                }
            };
        },
    });

    // $workflowRun magic — lets any Alpine scope invoke $flow.run() on the
    // nearest canvas without manual DOM traversal. Searches up (ancestor) then
    // down (descendant) for a .flow-container element.
    //
    // Usage from a parent scope:
    //   <button @click="$workflowRun('trigger', { onEnter: ... }, { payload: ... })">
    //
    // Usage from inside a canvas scope (equivalent to $flow.run):
    //   <button @click="$workflowRun('trigger', handlers, options)">
    Alpine.magic('workflowRun', (el: HTMLElement) => {
        return async (startId: string, handlers: any, options: any) => {
            // Find the nearest canvas — first check ancestors, then descendants
            const canvasEl = el.closest('.flow-container') as HTMLElement
                ?? el.querySelector('.flow-container') as HTMLElement
                ?? document.querySelector('.flow-container') as HTMLElement;

            if (!canvasEl) {
                console.warn('[workflow] $workflowRun: no .flow-container found');
                return null;
            }

            const canvas = Alpine.$data(canvasEl);
            if (typeof canvas?.run !== 'function') {
                console.warn('[workflow] $workflowRun: canvas.run not available — is the workflow addon registered?');
                return null;
            }

            return canvas.run(startId, handlers, options);
        };
    });

    // ── Alpine.data factories for the workflow UI primitives ────────────────
    // Registered with the workflow addon so they ship with it (animate-extraction
    // safety) but live alongside Alpine.magic (global) — not inside per-canvas
    // setup, where they would re-register on every canvas mount.

    /**
     * Resolve the canvas Alpine scope from either an explicit selector or by
     * walking up the DOM from a component element.
     */
    const resolveCanvas = (el: HTMLElement, target: string | null): { canvas: any; el: HTMLElement | null } => {
        const containerEl = target
            ? (document.querySelector(target) as HTMLElement | null)
            : (el.closest('.flow-container') as HTMLElement | null
                ?? document.querySelector('.flow-container') as HTMLElement | null);
        return {
            canvas: containerEl ? Alpine.$data(containerEl) : null,
            el: containerEl,
        };
    };

    Alpine.data('flowReplayControls', (config: { handleExpr: string | null; target: string | null }) => ({
        _handle: null as any,
        _canvas: null as any,
        _pollHandle: 0 as any,
        _runStart: 0,
        _scrubbing: false,
        isPlaying: false,
        speed: 1 as number,
        canScrub: false,
        hasNativeTime: false,
        currentTimeMs: 0,
        durationMs: 0,
        get hasPlayableSource(): boolean {
            if (this._handle) return true;
            return Array.isArray(this._canvas?.executionLog) && this._canvas.executionLog.length > 0;
        },
        get progressPercent(): number {
            if (this.durationMs <= 0) return 0;
            return Math.min(100, (this.currentTimeMs / this.durationMs) * 100);
        },
        init() {
            const { canvas } = resolveCanvas((this as any).$el as HTMLElement, config.target);
            this._canvas = canvas;
            if (config.handleExpr && this._canvas) {
                this._handle = this._canvas[config.handleExpr] ?? null;
            }
            if (!this._handle && this._canvas?.lastReplayHandle) {
                this._handle = this._canvas.lastReplayHandle;
            }
            this._detectCapabilities();
        },
        _detectCapabilities() {
            if (!this._handle) {
                this.canScrub = false;
                this.hasNativeTime = false;
                return;
            }
            this.canScrub = typeof this._handle.scrubTo === 'function';
            this.hasNativeTime = typeof this._handle.currentTime !== 'undefined'
                && typeof this._handle.duration !== 'undefined';
        },
        _ensureHandle(): boolean {
            if (this._handle) return true;
            const log = this._canvas?.executionLog;
            if (Array.isArray(log) && log.length > 0 && typeof this._canvas.replayExecution === 'function') {
                this._handle = this._canvas.replayExecution(log, { speed: this.speed });
                this._detectCapabilities();
                if (Array.isArray(log) && log.length > 0) {
                    this.durationMs = (log[log.length - 1]?.t ?? 0) - (log[0]?.t ?? 0);
                }
                return true;
            }
            return false;
        },
        formatTime(ms: number): string {
            if (!Number.isFinite(ms) || ms < 0) ms = 0;
            if (ms < 1000) return `0:${String(Math.floor(ms / 100)).padStart(2, '0')}`;
            const totalSec = Math.floor(ms / 1000);
            const m = Math.floor(totalSec / 60);
            const s = totalSec % 60;
            return `${m}:${String(s).padStart(2, '0')}`;
        },
        _startPolling() {
            if (this._pollHandle) return;
            this._runStart = performance.now();
            this._pollHandle = setInterval(() => {
                if (!this._handle) return;
                if (this.hasNativeTime) {
                    this.currentTimeMs = this._handle.currentTime;
                    this.durationMs = this._handle.duration;
                } else {
                    this.currentTimeMs = (performance.now() - this._runStart) * this.speed;
                    if (this.durationMs > 0 && this.currentTimeMs >= this.durationMs) {
                        this.isPlaying = false;
                        this._stopPolling();
                    }
                }
            }, 100);
        },
        _stopPolling() {
            if (this._pollHandle) {
                clearInterval(this._pollHandle);
                this._pollHandle = 0;
            }
        },
        onPlayPause() {
            if (!this._ensureHandle()) return;
            if (this.isPlaying) {
                this._handle.pause?.();
                this.isPlaying = false;
                this._stopPolling();
            } else {
                (this._handle.play ?? this._handle.resume)?.call(this._handle);
                this.isPlaying = true;
                this._startPolling();
            }
        },
        onRestart() {
            if (!this._ensureHandle()) return;
            this._handle.stop?.();
            this._handle = null;
            this._stopPolling();
            this.currentTimeMs = 0;
            if (!this._ensureHandle()) return;
            (this._handle.play ?? this._handle.resume)?.call(this._handle);
            this.isPlaying = true;
            this._startPolling();
        },
        onSpeedChange() {
            if (this._handle && typeof this._handle.speed !== 'undefined') {
                this._handle.speed = this.speed;
            }
        },
        onScrubStart(ev: PointerEvent) {
            if (!this.canScrub) return;
            this._scrubbing = true;
            this._applyScrub(ev);
        },
        onScrubMove(ev: PointerEvent) {
            if (!this._scrubbing) return;
            this._applyScrub(ev);
        },
        onScrubEnd(ev: PointerEvent) {
            if (!this._scrubbing) return;
            this._scrubbing = false;
            this._applyScrub(ev);
        },
        _applyScrub(ev: PointerEvent) {
            const target = ((this as any).$el as HTMLElement).querySelector('.flow-replay-scrubber') as HTMLElement | null;
            if (!target || !this._handle?.scrubTo) return;
            const rect = target.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
            this._handle.scrubTo(ratio * this.durationMs);
            this.currentTimeMs = ratio * this.durationMs;
        },
    }));

    Alpine.data('flowExecutionLog', (config: {
        sourceExpr: string | null;
        target: string | null;
        initialFilter: string;
        maxEvents: number;
    }) => ({
        _canvas: null as any,
        _source: [] as any[],
        _autoScroll: true,
        filter: config.initialFilter || 'all',
        baseTime: 0,
        init() {
            const self = this as any;
            const { canvas } = resolveCanvas(self.$el as HTMLElement, config.target);
            this._canvas = canvas;
            if (config.sourceExpr && this._canvas) {
                this._source = this._canvas[config.sourceExpr] ?? [];
            } else {
                this._source = this._canvas?.executionLog ?? [];
            }
            // Auto-scroll to the bottom whenever the visible event list grows
            // — but only when the user hasn't manually scrolled away from the
            // tail. onUserScroll() resets the flag based on scroll position.
            self.$watch('filteredEvents', () => {
                if (this._autoScroll) self.$nextTick(() => this._scrollToBottom());
            });
        },
        get filteredEvents(): any[] {
            const events = this._source ?? [];
            if (events.length === 0) return [];
            this.baseTime = events[0]?.t ?? 0;
            let filtered: any[] = events;
            if (this.filter === 'errors') {
                filtered = events.filter((e: any) => e.type === 'run:error' || e.type === 'edge:failed');
            } else if (this.filter === 'lifecycle') {
                const types = new Set(['run:started', 'run:complete', 'run:stopped', 'node:enter', 'node:exit']);
                filtered = events.filter((e: any) => types.has(e.type));
            }
            return filtered.slice(-config.maxEvents);
        },
        formatTime(deltaMs: number): string {
            if (!Number.isFinite(deltaMs) || deltaMs < 0) deltaMs = 0;
            if (deltaMs < 1000) return `+${Math.round(deltaMs)}ms`;
            if (deltaMs < 60_000) return `+${(deltaMs / 1000).toFixed(1)}s`;
            const m = Math.floor(deltaMs / 60_000);
            const s = Math.floor((deltaMs % 60_000) / 1000);
            return `+${m}m${s ? ` ${s}s` : ''}`;
        },
        iconFor(type: string): string {
            const map: Record<string, string> = {
                'run:started': '▶', 'run:complete': '✓', 'run:stopped': '◼', 'run:error': '!',
                'node:enter': '→', 'node:exit': '←', 'edge:taken': '─', 'edge:failed': '×',
                'edge:untaken': '·', 'parallel:fork': '⊥', 'wait:start': '⏱', 'wait:end': '⏱',
                'branch:chosen': '?',
            };
            return map[type] ?? '·';
        },
        iconClassFor(type: string): string {
            const map: Record<string, string> = {
                'run:started': 'flow-execution-log-icon--start',
                'run:complete': 'flow-execution-log-icon--complete',
                'run:stopped': 'flow-execution-log-icon--start',
                'run:error': 'flow-execution-log-icon--error',
                'edge:failed': 'flow-execution-log-icon--error',
                'node:enter': 'flow-execution-log-icon--enter',
                'node:exit': 'flow-execution-log-icon--exit',
                'edge:taken': 'flow-execution-log-icon--edge-taken',
                'parallel:fork': 'flow-execution-log-icon--fork',
            };
            return map[type] ?? '';
        },
        onRowClick(event: any) {
            if (event?.nodeId) {
                ((this as any).$el as HTMLElement).dispatchEvent(new CustomEvent('flow:highlight-node', {
                    detail: { nodeId: event.nodeId },
                    bubbles: true,
                }));
            }
        },
        onUserScroll() {
            const body = (this as any).$refs?.body as HTMLElement | undefined;
            if (!body) return;
            const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 5;
            this._autoScroll = atBottom;
        },
        _scrollToBottom() {
            const body = (this as any).$refs?.body as HTMLElement | undefined;
            if (body) body.scrollTop = body.scrollHeight;
        },
    }));

    Alpine.data('flowRunButton', (config: {
        startId: string;
        options: any;
        handlersKey: string;
        target: string | null;
    }) => ({
        _canvas: null as any,
        _canvasEl: null as HTMLElement | null,
        init() {
            const { canvas, el } = resolveCanvas((this as any).$el as HTMLElement, config.target);
            this._canvas = canvas;
            this._canvasEl = el;
        },
        get isRunning(): boolean {
            const state = this._canvas?.runState;
            return state === 'running' || state === 'paused';
        },
        async onClick() {
            if (this.isRunning) return;
            if (!this._canvas) {
                console.warn('[wireflow] <x-flow-run-button>: no canvas found');
                return;
            }
            const handlers = (this._canvasEl as any)?.[config.handlersKey] ?? {};
            await this._canvas.run(config.startId, handlers, config.options ?? {});
        },
    }));

    Alpine.data('flowStopButton', (config: { target: string | null; alwaysVisible: boolean }) => ({
        _canvas: null as any,
        alwaysVisible: !!config.alwaysVisible,
        init() {
            const { canvas } = resolveCanvas((this as any).$el as HTMLElement, config.target);
            this._canvas = canvas;
        },
        get isRunning(): boolean {
            const state = this._canvas?.runState;
            return state === 'running' || state === 'paused';
        },
        onClick() {
            this._canvas?.stopRun?.();
        },
    }));

    Alpine.data('flowResetButton', (config: { target: string | null }) => ({
        _canvas: null as any,
        init() {
            const { canvas } = resolveCanvas((this as any).$el as HTMLElement, config.target);
            this._canvas = canvas;
        },
        onClick() {
            this._canvas?.resetStates?.();
            this._canvas?.resetExecutionLog?.();
        },
    }));
}
