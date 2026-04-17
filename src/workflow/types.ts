// ============================================================================
// alpinejs-flow/workflow — Type Definitions
//
// Full API surface for the workflow execution addon.
// Implementations are added in Tasks W2–W5.
// ============================================================================

import type { FlowNode } from '../core/types';

export interface FlowRunHandlers {
    onEnter?: (node: FlowNode, context: FlowRunContext) => Promise<Record<string, any> | void> | Record<string, any> | void;
    onExit?: (node: FlowNode, context: FlowRunContext) => Promise<Record<string, any> | void> | Record<string, any> | void;
    pickBranch?: (node: FlowNode, outgoingEdges: any[], context: FlowRunContext) => Promise<string | null> | string | null;
    onComplete?: (context: FlowRunContext) => void;
    onError?: (error: Error, node: FlowNode, context: FlowRunContext) => void;
}

export interface FlowRunOptions {
    payload?: Record<string, any>;
    defaultDurationMs?: number;
    particleOnEdges?: boolean;
    lock?: boolean;
    muteUntakenBranches?: boolean;
    logLimit?: number;
}

export interface FlowRunContext {
    payload: Record<string, any>;
    nodeResults: Record<string, any>;
    currentNodeId: string | null;
    startedAt: number;
}

export interface FlowRunHandle {
    pause(): void;
    resume(): void;
    stop(): void;
    readonly finished: Promise<FlowRunContext>;
    readonly isPaused: boolean;
    readonly isStopped: boolean;
}

export type FlowRunLogEntryType =
    | 'run:started' | 'run:complete' | 'run:error' | 'run:stopped'
    | 'node:enter' | 'node:exit'
    | 'edge:taken' | 'edge:untaken'
    | 'branch:chosen'
    | 'wait:start' | 'wait:end';

export interface FlowRunLogEntry {
    t: number;
    type: FlowRunLogEntryType;
    nodeId?: string;
    edgeId?: string;
    payload?: Record<string, any>;
    runtimeMs?: number;
    outputs?: Record<string, any>;
}

export interface FlowCondition {
    field: string;
    op: 'equals' | 'notEquals' | 'in' | 'notIn' | 'greaterThan' | 'lessThan'
      | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'exists' | 'matches';
    value?: any;
}

// Module augmentation — extends FlowInstance when the workflow addon is imported
declare module '../core/types' {
    interface FlowInstance {
        run(startId: string, handlers: FlowRunHandlers, options?: FlowRunOptions): Promise<FlowRunHandle>;
        executionLog: FlowRunLogEntry[];
        resetExecutionLog(): void;
    }
}
