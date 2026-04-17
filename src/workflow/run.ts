// ============================================================================
// alpinejs-flow/workflow — Core Run Executor
//
// createRunExecutor(canvas) returns a $flow.run() function that walks the
// graph node-by-node, manages runState transitions, fires onEnter/onExit
// handlers, and returns a FlowRunHandle for pause/resume/stop control.
// ============================================================================

import type { FlowRunHandlers, FlowRunOptions, FlowRunContext, FlowRunHandle } from './types';
import { evaluateCondition } from './condition';
import { setEdgeEntering, setEdgeCompleted, setEdgeTaken, setEdgeUntaken } from './edge-state';

export function createRunExecutor(canvas: any) {
    return async function run(
        startId: string,
        handlers: FlowRunHandlers = {},
        options: FlowRunOptions = {},
    ): Promise<FlowRunHandle> {
        const context: FlowRunContext = {
            payload: { ...(options.payload ?? {}) },
            nodeResults: {},
            currentNodeId: null,
            startedAt: Date.now(),
        };

        let isPaused = false;
        let isStopped = false;
        let pauseResolve: (() => void) | null = null;

        const handle: FlowRunHandle = {
            get isPaused() { return isPaused; },
            get isStopped() { return isStopped; },
            pause() {
                if (!isPaused && !isStopped) { isPaused = true; }
            },
            resume() {
                if (isPaused) {
                    isPaused = false;
                    pauseResolve?.();
                    pauseResolve = null;
                }
            },
            stop() {
                isStopped = true;
                isPaused = false;
                pauseResolve?.();
                pauseResolve = null;
            },
            finished: null as any,
        };

        const execution = (async () => {
            // Yield one microtask tick so the caller always receives the handle
            // before execution begins. This prevents TDZ issues in patterns like:
            //   const handle = await run('a', { onExit: () => handle.pause() });
            await Promise.resolve();

            if (options.lock) { canvas.toggleInteractive?.(); }

            let currentId: string | null = startId;

            try {
                while (currentId) {
                    if (isStopped) { break; }

                    // Pause gate — await until resume() or stop() resolves the promise
                    if (isPaused) {
                        await new Promise<void>(r => { pauseResolve = r; });
                        if (isStopped) { break; }
                    }

                    const node = canvas.getNode(currentId);
                    if (!node) { break; }

                    context.currentNodeId = currentId;

                    // Mark incoming edges as entering
                    const incomingEdges = (canvas.edges ?? []).filter((e: any) => e.target === currentId);
                    for (const edge of incomingEdges) {
                        setEdgeEntering(canvas, edge.id);
                    }

                    // flow-wait node — sleep without calling onEnter/onExit
                    if (node.type === 'flow-wait') {
                        canvas.setNodeState(currentId, 'running');
                        const waitMs = node.data?.durationMs ?? options.defaultDurationMs ?? 1000;
                        await sleep(waitMs);
                        canvas.setNodeState(currentId, 'completed');
                        for (const edge of incomingEdges) {
                            setEdgeCompleted(canvas, edge.id);
                        }
                        currentId = await resolveNextNode(canvas, node, currentId, handlers, options, context);
                        continue;
                    }

                    canvas.setNodeState(currentId, 'running');

                    // onEnter — result merged into payload and nodeResults (Option C)
                    try {
                        const result = await handlers.onEnter?.(node, context);
                        if (result && typeof result === 'object') {
                            context.nodeResults[currentId] = result;
                            Object.assign(context.payload, result);
                        }
                    } catch (err) {
                        canvas.setNodeState(currentId, 'failed');
                        handlers.onError?.(err as Error, node, context);
                        throw err;
                    }

                    // Pacing delay — skipped when undefined or 0
                    if (options.defaultDurationMs) {
                        await sleep(options.defaultDurationMs);
                    }

                    // Mark complete
                    canvas.setNodeState(currentId, 'completed');

                    // Mark incoming edges as completed
                    for (const edge of incomingEdges) {
                        setEdgeCompleted(canvas, edge.id);
                    }

                    // onExit — result also merged into payload and nodeResults
                    const exitResult = await handlers.onExit?.(node, context);
                    if (exitResult && typeof exitResult === 'object') {
                        context.nodeResults[`${currentId}:exit`] = exitResult;
                        Object.assign(context.payload, exitResult);
                    }

                    currentId = await resolveNextNode(canvas, node, currentId, handlers, options, context);
                }

                context.currentNodeId = null;
                if (!isStopped) { handlers.onComplete?.(context); }
            } finally {
                if (options.lock) { canvas.toggleInteractive?.(); }
            }

            return context;
        })();

        (handle as any).finished = execution;
        return handle;
    };
}

/**
 * Determine the next node ID to visit after completing `currentId`.
 * Handles edge state mirroring (taken/untaken) and particle emission.
 */
async function resolveNextNode(
    canvas: any,
    node: any,
    currentId: string,
    handlers: FlowRunHandlers,
    options: FlowRunOptions,
    context: FlowRunContext,
): Promise<string | null> {
    const outgoingEdges = (canvas.edges ?? []).filter((e: any) => e.source === currentId);

    if (outgoingEdges.length === 0) {
        return null;
    }

    let chosenEdge: any = null;

    if (handlers.pickBranch) {
        // Custom pickBranch handler (async allowed)
        const chosenEdgeId = await handlers.pickBranch(node, outgoingEdges, context);
        chosenEdge = chosenEdgeId ? outgoingEdges.find((e: any) => e.id === chosenEdgeId) : null;
    } else if (node.type === 'flow-condition') {
        // Declarative condition evaluation
        const targetId = resolveConditionBranch(node, outgoingEdges, context.payload);
        chosenEdge = targetId ? outgoingEdges.find((e: any) => e.target === targetId) : null;
    } else {
        // Linear default: follow first outgoing edge
        chosenEdge = outgoingEdges[0] ?? null;
    }

    // Mark taken/untaken edges
    if (chosenEdge) {
        setEdgeTaken(canvas, chosenEdge.id);
        if (options.muteUntakenBranches) {
            for (const siblingEdge of outgoingEdges) {
                if (siblingEdge.id !== chosenEdge.id) {
                    setEdgeUntaken(canvas, siblingEdge.id);
                }
            }
        }
    }

    // Particle emission on traversed edge
    if (options.particleOnEdges && chosenEdge) {
        canvas.sendParticle?.(chosenEdge.id, {});
    }

    return chosenEdge?.target ?? null;
}

function resolveConditionBranch(
    node: any,
    outgoingEdges: any[],
    payload: Record<string, any>,
): string | null {
    let result: boolean;

    if (typeof node.data?.evaluate === 'function') {
        // Custom evaluate function
        result = !!node.data.evaluate(payload);
    } else if (node.data?.condition) {
        // Declarative condition
        result = evaluateCondition(node.data.condition, payload);
    } else {
        // No condition defined — follow first edge
        return outgoingEdges[0]?.target ?? null;
    }

    // Pick the edge with sourceHandle matching the result
    const handle = result ? 'true' : 'false';
    const edge = outgoingEdges.find((e: any) => e.sourceHandle === handle);
    return edge?.target ?? null;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
