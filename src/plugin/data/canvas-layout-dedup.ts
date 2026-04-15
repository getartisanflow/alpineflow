/**
 * Frame-aligned layout dedup with cross-frame loop safety net.
 *
 * Ensures `layoutFn(parentId)` runs at most once per parent per animation
 * frame. First call within a frame runs synchronously; subsequent calls for
 * the same parent no-op until the next RAF clears the frame marker.
 *
 * Also tracks consecutive-frame layouts per parent; if a parent is laid out
 * in >5 successive frames, emits a console.warn and suppresses further
 * auto-layout until `resetLoopCounter` is called (on user mutations).
 */
const CONSECUTIVE_FRAME_CAP = 5;

export interface LayoutDedup {
    /** Run layoutFn(parentId) unless already done this frame. */
    safeLayoutChildren(parentId: string): void;
    /** Call on user-initiated mutations to reset per-parent loop counters and clear suppression. */
    resetLoopCounter(parentId: string): void;
    /** Teardown — cancels any pending RAF. */
    dispose(): void;
}

export function createLayoutDedup(layoutFn: (parentId: string) => void): LayoutDedup {
    const laidOutThisFrame = new Set<string>();
    const consecutiveCounts = new Map<string, number>();
    const suppressed = new Set<string>();
    let rafHandle: number | null = null;
    let prevFrameParents = new Set<string>();

    function schedule(): void {
        if (rafHandle !== null) return;
        rafHandle = requestAnimationFrame(() => {
            rafHandle = null;

            // Update consecutive-frame counts for this frame's parents.
            for (const parentId of laidOutThisFrame) {
                const prevCount = prevFrameParents.has(parentId) ? (consecutiveCounts.get(parentId) ?? 0) : 0;
                const nextCount = prevCount + 1;
                consecutiveCounts.set(parentId, nextCount);
                if (nextCount > CONSECUTIVE_FRAME_CAP && !suppressed.has(parentId)) {
                    suppressed.add(parentId);
                    console.warn(
                        `[alpineflow] Auto-layout for parent "${parentId}" has run for ${nextCount} consecutive frames. ` +
                            `Suppressing to avoid an infinite loop. This usually indicates a layout that keeps changing ` +
                            `child dimensions by more than the 1px threshold. Next user mutation will clear the suppression.`,
                    );
                }
            }

            // Reset counts for parents that did NOT lay out this frame.
            for (const id of consecutiveCounts.keys()) {
                if (!laidOutThisFrame.has(id)) consecutiveCounts.set(id, 0);
            }

            prevFrameParents = new Set(laidOutThisFrame);
            laidOutThisFrame.clear();
        });
    }

    return {
        safeLayoutChildren(parentId) {
            if (suppressed.has(parentId)) return;
            if (laidOutThisFrame.has(parentId)) return;
            laidOutThisFrame.add(parentId);
            schedule();
            layoutFn(parentId);
        },
        resetLoopCounter(parentId) {
            consecutiveCounts.delete(parentId);
            suppressed.delete(parentId);
        },
        dispose() {
            if (rafHandle !== null) {
                cancelAnimationFrame(rafHandle);
                rafHandle = null;
            }
        },
    };
}
