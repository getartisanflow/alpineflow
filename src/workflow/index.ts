// ============================================================================
// alpinejs-flow/workflow — Workflow Execution Addon
//
// Registers via the W0 setup callback mechanism. Real execution methods
// are injected in Tasks W2–W5.
// ============================================================================

import { registerAddon } from '../core/registry';

export type { FlowRunHandlers, FlowRunOptions, FlowRunContext, FlowRunHandle, FlowRunLogEntry, FlowRunLogEntryType, FlowCondition } from './types';

export default function AlpineFlowWorkflow(_Alpine: any): void {
    registerAddon('workflow', {
        setup(canvas: any) {
            // Placeholder — real methods injected in Tasks W2–W5
            canvas.executionLog = [];
            canvas.resetExecutionLog = function () { this.executionLog = []; };
        },
    });
}
