import type { AnimateTargets, AnimateOptions, FlowAnimationHandle, StopOptions, ParticleOptions, ParticleHandle } from '../core/types';

export interface FlowGroupHost {
    animate(targets: AnimateTargets, options?: AnimateOptions): FlowAnimationHandle;
    update(targets: AnimateTargets, options?: AnimateOptions): FlowAnimationHandle;
    sendParticle?(edgeId: string, options?: ParticleOptions): ParticleHandle | undefined;
    timeline?(): any;
    getHandles(filter?: { tag?: string; tags?: string[] }): FlowAnimationHandle[];
    cancelAll(filter: { tag?: string; tags?: string[] }, options?: StopOptions): void;
    pauseAll(filter: { tag?: string; tags?: string[] }): void;
    resumeAll(filter: { tag?: string; tags?: string[] }): void;
}

export class FlowGroup {
    readonly name: string;
    private _host: FlowGroupHost;

    constructor(name: string, host: FlowGroupHost) {
        this.name = name;
        this._host = host;
    }

    animate(targets: AnimateTargets, options?: AnimateOptions): FlowAnimationHandle {
        return this._host.animate(targets, { ...options, tag: this.name });
    }

    update(targets: AnimateTargets, options?: AnimateOptions): FlowAnimationHandle {
        return this._host.update(targets, { ...options, tag: this.name });
    }

    sendParticle(edgeId: string, options?: ParticleOptions): ParticleHandle | undefined {
        return this._host.sendParticle?.(edgeId, { ...options, tag: this.name } as ParticleOptions);
    }

    timeline(): any {
        return this._host.timeline?.();
    }

    cancelAll(options?: StopOptions): void {
        this._host.cancelAll({ tag: this.name }, options);
    }

    pauseAll(): void {
        this._host.pauseAll({ tag: this.name });
    }

    resumeAll(): void {
        this._host.resumeAll({ tag: this.name });
    }

    get handles(): FlowAnimationHandle[] {
        return this._host.getHandles({ tag: this.name });
    }
}
