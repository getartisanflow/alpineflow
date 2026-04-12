import type { RecordingData, RecordingEvent, Checkpoint, CanvasSnapshot } from './types';
import { RECORDING_VERSION } from './types';

function deepFreeze<T>(value: T): T {
    if (value !== null && typeof value === 'object') {
        Object.freeze(value);
        for (const key of Object.keys(value as object)) {
            deepFreeze((value as Record<string, unknown>)[key]);
        }
    }
    return value;
}

export class Recording {
    readonly version: number;
    readonly duration: number;
    readonly initialState: Readonly<CanvasSnapshot>;
    readonly events: ReadonlyArray<RecordingEvent>;
    readonly checkpoints: ReadonlyArray<Checkpoint>;
    readonly metadata: Readonly<Record<string, any>>;

    constructor(data: RecordingData) {
        this.version = data.version;
        this.duration = data.duration;
        this.initialState = deepFreeze(structuredClone(data.initialState));
        this.events = Object.freeze(structuredClone(data.events));
        this.checkpoints = Object.freeze(structuredClone(data.checkpoints));
        this.metadata = Object.freeze({ ...(data.metadata ?? {}) });
        Object.freeze(this);
    }

    toJSON(): RecordingData {
        return {
            version: this.version,
            duration: this.duration,
            initialState: structuredClone(this.initialState as CanvasSnapshot),
            events: structuredClone(this.events as RecordingEvent[]),
            checkpoints: structuredClone(this.checkpoints as Checkpoint[]),
            metadata: { ...this.metadata },
        };
    }

    static fromJSON(data: RecordingData): Recording {
        if (data.version > RECORDING_VERSION) {
            throw new Error(
                `[AlpineFlow] Recording version ${data.version} is newer than supported (${RECORDING_VERSION}). ` +
                `Please update AlpineFlow to replay this recording.`
            );
        }
        // Future: migrate older versions here
        return new Recording(data);
    }
}
