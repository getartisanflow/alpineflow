// ============================================================================
// alpinejs-flow/workflow — Core Run Executor
//
// createRunExecutor(canvas) returns a $flow.run() function that walks the
// graph node-by-node, manages runState transitions, fires onEnter/onExit
// handlers, and returns a FlowRunHandle for pause/resume/stop control.
//
// Parallel branches: when a node has multiple outgoing edges and no
// pickBranch/condition handler selects a single edge, ALL edges are followed
// concurrently via Promise.all. A shared visited Set prevents convergence
// nodes from running twice (fan-in). A shared InternalRunState lets
// pause/resume/stop work uniformly across all branches.
// ============================================================================

import type { FlowRunHandlers, FlowRunOptions, FlowRunContext, FlowRunHandle, FlowRunLogEntry } from './types';
import { evaluateCondition } from './condition';
import { setEdgeEntering, setEdgeCompleted, setEdgeTaken, setEdgeUntaken, setEdgeFailed } from './edge-state';

function pushLog(
    canvas: any,
    entry: Omit<FlowRunLogEntry, 't'>,
    logLimit: number,
): void {
    const log = canvas.executionLog as FlowRunLogEntry[];
    const full: FlowRunLogEntry = { t: Date.now(), ...entry };
    log.push(full);
    // FIFO eviction
    while (log.length > logLimit) {
        log.shift();
    }
}

/**
 * Shared mutable state for pause/resume/stop across all concurrent branches.
 */
interface InternalRunState {
    isPaused: boolean;
    isStopped: boolean;
    pausePromise: Promise<void> | null;
    pauseResolve: (() => void) | null;
}

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

        const state: InternalRunState = {
            isPaused: false,
            isStopped: false,
            pausePromise: null,
            pauseResolve: null,
        };

        const handle: FlowRunHandle = {
            get isPaused() { return state.isPaused; },
            get isStopped() { return state.isStopped; },
            pause() {
                if (!state.isPaused && !state.isStopped) {
                    state.isPaused = true;
                    state.pausePromise = new Promise(r => { state.pauseResolve = r; });
                }
            },
            resume() {
                if (state.isPaused) {
                    state.isPaused = false;
                    state.pauseResolve?.();
                    state.pausePromise = null;
                    state.pauseResolve = null;
                }
            },
            stop() {
                state.isStopped = true;
                state.isPaused = false;
                state.pauseResolve?.();
                state.pausePromise = null;
                state.pauseResolve = null;
            },
            finished: null as any,
        };

        const logLimit = options.logLimit ?? 500;
        // Shared visited set prevents convergence (fan-in) nodes from running twice
        const visited = new Set<string>();

        const execution = (async () => {
            // Yield one microtask tick so the caller always receives the handle
            // before execution begins. This prevents TDZ issues in patterns like:
            //   const handle = await run('a', { onExit: () => handle.pause() });
            await Promise.resolve();

            // Auto-reset: clear all node states and edge classes from any previous
            // run so the canvas starts clean. Consumers don't need to call
            // resetStates() or manually clear edge.class before each run.
            if (typeof canvas.resetStates === 'function') canvas.resetStates();
            if (Array.isArray(canvas.edges)) {
                for (const edge of canvas.edges) edge.class = undefined;
            }
            if (typeof canvas.resetExecutionLog === 'function') canvas.resetExecutionLog();

            if (options.lock) { canvas.toggleInteractive?.(); }

            pushLog(canvas, { type: 'run:started', payload: context.payload }, logLimit);

            try {
                await walkBranch(canvas, startId, context, handlers, options, state, visited, logLimit);

                context.currentNodeId = null;
                if (!state.isStopped) {
                    pushLog(canvas, { type: 'run:complete', payload: context.payload }, logLimit);
                    handlers.onComplete?.(context);
                }
            } catch (err) {
                // Ensure other branches are cancelled on error
                state.isStopped = true;
                state.pauseResolve?.();
                throw err;
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
 * Walk a single branch starting from `startId`. Shared state (pause/stop/visited)
 * allows multiple concurrent branches to coordinate correctly.
 */
async function walkBranch(
    canvas: any,
    startId: string,
    context: FlowRunContext,
    handlers: FlowRunHandlers,
    options: FlowRunOptions,
    state: InternalRunState,
    visited: Set<string>,
    logLimit: number,
): Promise<void> {
    let currentId: string | null = startId;

    while (currentId) {
        if (state.isStopped) {
            pushLog(canvas, { type: 'run:stopped', nodeId: context.currentNodeId ?? undefined }, logLimit);
            break;
        }

        // Fan-in: claim this node atomically. If another branch already claimed
        // it (or is currently running it), skip — JavaScript's single-threaded
        // event loop ensures the check+add is atomic between microtask yields.
        if (visited.has(currentId)) {
            break;
        }
        visited.add(currentId);

        // Pause gate — await until resume() or stop() resolves the promise
        if (state.isPaused && state.pausePromise) {
            await state.pausePromise;
            if (state.isStopped) {
                pushLog(canvas, { type: 'run:stopped', nodeId: context.currentNodeId ?? undefined }, logLimit);
                break;
            }
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
            pushLog(canvas, { type: 'wait:start', nodeId: currentId }, logLimit);
            const waitStart = Date.now();
            await sleep(waitMs);
            pushLog(canvas, { type: 'wait:end', nodeId: currentId, runtimeMs: Date.now() - waitStart }, logLimit);
            canvas.setNodeState(currentId, 'completed');
            for (const edge of incomingEdges) {
                setEdgeCompleted(canvas, edge.id);
            }
            const nextIds = await resolveNextNodes(canvas, node, currentId, handlers, options, context, logLimit);
            if (nextIds.length === 0) {
                break;
            } else if (nextIds.length === 1) {
                currentId = nextIds[0];
            } else {
                pushLog(canvas, { type: 'parallel:fork', nodeId: currentId, payload: { branches: nextIds } }, logLimit);
                await Promise.all(nextIds.map(nextId =>
                    walkBranch(canvas, nextId, { ...context, payload: { ...context.payload } }, handlers, options, state, visited, logLimit),
                ));
                break;
            }
            continue;
        }

        canvas.setNodeState(currentId, 'running');

        const nodeStartTime = Date.now();
        pushLog(canvas, { type: 'node:enter', nodeId: currentId }, logLimit);

        // onEnter — result merged into payload and nodeResults (Option C)
        try {
            const result = await handlers.onEnter?.(node, context);
            if (result && typeof result === 'object') {
                context.nodeResults[currentId] = result;
                Object.assign(context.payload, result);
            }
        } catch (err) {
            canvas.setNodeState(currentId, 'failed');
            // Mark incoming edges as failed (red)
            for (const edge of incomingEdges) {
                setEdgeFailed(canvas, edge.id);
            }
            pushLog(canvas, { type: 'run:error', nodeId: currentId, payload: { error: (err as Error).message } }, logLimit);
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

        pushLog(canvas, { type: 'node:exit', nodeId: currentId, runtimeMs: Date.now() - nodeStartTime, outputs: context.nodeResults[currentId] }, logLimit);

        const nextIds = await resolveNextNodes(canvas, node, currentId, handlers, options, context, logLimit);

        if (nextIds.length === 0) {
            break;
        } else if (nextIds.length === 1) {
            currentId = nextIds[0];
        } else {
            // Parallel fork — run all branches concurrently
            pushLog(canvas, { type: 'parallel:fork', nodeId: currentId, payload: { branches: nextIds } }, logLimit);
            await Promise.all(nextIds.map(nextId =>
                walkBranch(canvas, nextId, { ...context, payload: { ...context.payload } }, handlers, options, state, visited, logLimit),
            ));
            break; // this branch's walk is done; children handled the rest
        }
    }
}

/**
 * Determine the next node IDs to visit after completing `currentId`.
 * Returns an empty array to stop, a single-element array for linear traversal,
 * or a multi-element array for a parallel fork.
 */
async function resolveNextNodes(
    canvas: any,
    node: any,
    currentId: string,
    handlers: FlowRunHandlers,
    options: FlowRunOptions,
    context: FlowRunContext,
    logLimit: number,
): Promise<string[]> {
    const outgoingEdges = (canvas.edges ?? []).filter((e: any) => e.source === currentId);

    if (outgoingEdges.length === 0) {
        return [];
    }

    if (handlers.pickBranch) {
        // Custom pickBranch handler (async allowed).
        // Returns an edge ID to follow, or null to fall through to default behavior.
        const chosenEdgeId = await handlers.pickBranch(node, outgoingEdges, context);
        if (chosenEdgeId) {
            const chosenEdge = outgoingEdges.find((e: any) => e.id === chosenEdgeId) ?? null;
            if (chosenEdge) {
                setEdgeTaken(canvas, chosenEdge.id);
                pushLog(canvas, { type: 'edge:taken', edgeId: chosenEdge.id }, logLimit);
                if (options.muteUntakenBranches) {
                    for (const siblingEdge of outgoingEdges) {
                        if (siblingEdge.id !== chosenEdge.id) {
                            setEdgeUntaken(canvas, siblingEdge.id);
                            pushLog(canvas, { type: 'edge:untaken', edgeId: siblingEdge.id }, logLimit);
                        }
                    }
                }
                if (options.particleOnEdges) {
                    canvas.sendParticle?.(chosenEdge.id, options.particleOptions ?? {});
                }
                return [chosenEdge.target];
            }
            return [];
        }
        // null = no preference → fall through to default behavior below
    }

    if (node.type === 'flow-condition') {
        // Declarative condition evaluation
        const targetId = resolveConditionBranch(node, outgoingEdges, context.payload);
        const chosenEdge = targetId ? outgoingEdges.find((e: any) => e.target === targetId) : null;

        if (chosenEdge) {
            pushLog(canvas, { type: 'branch:chosen', nodeId: currentId, edgeId: chosenEdge.id }, logLimit);
            setEdgeTaken(canvas, chosenEdge.id);
            pushLog(canvas, { type: 'edge:taken', edgeId: chosenEdge.id }, logLimit);
            if (options.muteUntakenBranches) {
                for (const siblingEdge of outgoingEdges) {
                    if (siblingEdge.id !== chosenEdge.id) {
                        setEdgeUntaken(canvas, siblingEdge.id);
                        pushLog(canvas, { type: 'edge:untaken', edgeId: siblingEdge.id }, logLimit);
                    }
                }
            }
            if (options.particleOnEdges) {
                canvas.sendParticle?.(chosenEdge.id, options.particleOptions ?? {});
            }
            return [chosenEdge.target];
        }
        return [];
    }

    // Default: single edge = linear; multiple edges = parallel fork
    if (outgoingEdges.length === 1) {
        const edge = outgoingEdges[0];
        setEdgeTaken(canvas, edge.id);
        pushLog(canvas, { type: 'edge:taken', edgeId: edge.id }, logLimit);
        if (options.particleOnEdges) {
            canvas.sendParticle?.(edge.id, options.particleOptions ?? {});
        }
        return [edge.target];
    }

    // Multiple edges, no handler → PARALLEL FORK
    // Mark all edges as taken and fire particles on all
    for (const edge of outgoingEdges) {
        setEdgeTaken(canvas, edge.id);
        pushLog(canvas, { type: 'edge:taken', edgeId: edge.id }, logLimit);
        if (options.particleOnEdges) {
            canvas.sendParticle?.(edge.id, options.particleOptions ?? {});
        }
    }
    return outgoingEdges.map((e: any) => e.target);
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
