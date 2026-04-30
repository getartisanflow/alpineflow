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
}
