// ============================================================================
// alpinejs-flow/workflow — Execution Replay
//
// createReplayExecutor(canvas) returns a $flow.replayExecution() function that plays
// back a recorded FlowRunLogEntry[] as a visual animation. It reads the
// timestamps in the log, applies state changes with scaled delays, and
// returns a ReplayHandle for pause/resume/stop control.
//
// No handlers run during replay — it is purely visual playback. Useful for
// replaying server-side execution traces on the canvas.
// ============================================================================

import type { FlowRunLogEntry, ReplayOptions, ReplayHandle } from './types';
import { setEdgeEntering, setEdgeCompleted, setEdgeTaken, setEdgeUntaken, setEdgeFailed } from './edge-state';

export function createReplayExecutor(canvas: any) {
    return async function replay(
        log: FlowRunLogEntry[],
        options: ReplayOptions = {},
    ): Promise<ReplayHandle> {
        const speed = options.speed ?? 1;

        let isPaused = false;
        let isStopped = false;
        let pauseResolve: (() => void) | null = null;

        const handle: ReplayHandle = {
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
            // Yield so caller always gets the handle before execution begins
            await Promise.resolve();

            // Reset canvas to a clean state before replaying
            if (typeof canvas.resetStates === 'function') canvas.resetStates();
            if (Array.isArray(canvas.edges)) {
                for (const edge of canvas.edges) edge.class = undefined;
            }

            let prevT = log[0]?.t ?? Date.now();

            for (const entry of log) {
                if (isStopped) break;

                // Pause gate
                if (isPaused) {
                    await new Promise<void>(r => { pauseResolve = r; });
                    if (isStopped) break;
                }

                // Wait based on timestamp delta scaled by speed
                const delay = (entry.t - prevT) / speed;
                if (delay > 10) {
                    await sleep(delay);
                }
                prevT = entry.t;

                // Apply the visual state change for this log entry
                switch (entry.type) {
                    case 'node:enter':
                        if (entry.nodeId) {
                            canvas.setNodeState(entry.nodeId, 'running');
                            const incoming = (canvas.edges ?? []).filter((e: any) => e.target === entry.nodeId);
                            for (const e of incoming) { setEdgeEntering(canvas, e.id); }
                        }
                        break;

                    case 'node:exit':
                        if (entry.nodeId) {
                            canvas.setNodeState(entry.nodeId, 'completed');
                            const incoming = (canvas.edges ?? []).filter((e: any) => e.target === entry.nodeId);
                            for (const e of incoming) { setEdgeCompleted(canvas, e.id); }
                        }
                        break;

                    case 'run:error':
                        if (entry.nodeId) {
                            canvas.setNodeState(entry.nodeId, 'failed');
                            const incoming = (canvas.edges ?? []).filter((e: any) => e.target === entry.nodeId);
                            for (const e of incoming) { setEdgeFailed(canvas, e.id); }
                        }
                        break;

                    case 'edge:taken':
                        if (entry.edgeId) { setEdgeTaken(canvas, entry.edgeId); }
                        break;

                    case 'edge:untaken':
                        if (entry.edgeId) { setEdgeUntaken(canvas, entry.edgeId); }
                        break;

                    case 'wait:start':
                        if (entry.nodeId) { canvas.setNodeState(entry.nodeId, 'running'); }
                        break;

                    case 'wait:end':
                        if (entry.nodeId) { canvas.setNodeState(entry.nodeId, 'completed'); }
                        break;

                    // run:started, run:complete, run:stopped, branch:chosen, parallel:fork
                    // — no direct visual state change; the node/edge entries carry visuals
                    default:
                        break;
                }
            }
        })();

        (handle as any).finished = execution;
        return handle;
    };
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
