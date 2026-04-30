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
            const { canvas } = resolveCanvas(this.$el as HTMLElement, config.target);
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
            const target = (this.$el as HTMLElement).querySelector('.flow-replay-scrubber') as HTMLElement | null;
            if (!target || !this._handle?.scrubTo) return;
            const rect = target.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
            this._handle.scrubTo(ratio * this.durationMs);
            this.currentTimeMs = ratio * this.durationMs;
        },
    }));
}
