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

export type { FlowRunHandlers, FlowRunOptions, FlowRunContext, FlowRunHandle, FlowRunLogEntry, FlowRunLogEntryType, FlowCondition, ReplayHandle, ReplayOptions } from './types';

export default function AlpineFlowWorkflow(Alpine: any): void {
    registerAddon('workflow', {
        setup(canvas: any) {
            canvas.run = createRunExecutor(canvas);
            canvas.replayExecution = createReplayExecutor(canvas);
            canvas.executionLog = [];
            canvas.resetExecutionLog = function () { this.executionLog = []; };
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
