import type { KeyframesMotion, PhysicsState } from './types';
import { extractAxis } from './axis';

export function stepKeyframes(
    state: PhysicsState,
    config: KeyframesMotion,
    progress: number, // 0-1 overall
    key: string,
): void {
    // Waypoints authored as { x: 10, y: 20 } need to be matched against the
    // entry's axis letter extracted from the key suffix (e.g., 'node:id:position.x'
    // → 'x'). Fall through to full-key match for consumers using explicit keys.
    const axis = extractAxis(key);
    const values = config.values.map(v =>
        v[key] ?? (axis ? v[axis] : undefined) ?? state.value,
    );
    if (values.length < 2) {
        state.value = values[0] ?? state.value;
        state.settled = true;
        return;
    }

    const offsets = config.offsets ?? values.map((_, i) => i / (values.length - 1));

    // Clamp progress
    const p = Math.max(0, Math.min(1, progress));

    // Find segment
    let segIdx = 0;
    for (let i = 0; i < offsets.length - 1; i++) {
        if (p >= offsets[i]) {
            segIdx = i;
        }
    }

    const segStart = offsets[segIdx];
    const segEnd = offsets[segIdx + 1] ?? 1;
    const segProgress = segEnd > segStart ? (p - segStart) / (segEnd - segStart) : 1;

    const from = values[segIdx];
    const to = values[segIdx + 1] ?? values[segIdx];

    state.value = from + (to - from) * Math.max(0, Math.min(1, segProgress));

    if (p >= 1) {
        state.value = values[values.length - 1];
        state.settled = true;
    }
}
