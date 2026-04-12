import type { AnimateTargets, AnimateOptions, FlowAnimationHandle, StopOptions, ParticleOptions, ParticleHandle } from '../core/types';

export interface FlowGroupHost {
    animate(targets: AnimateTargets, options?: AnimateOptions): FlowAnimationHandle;
    update(targets: AnimateTargets, options?: AnimateOptions): FlowAnimationHandle;
    sendParticle?(edgeId: string, options?: ParticleOptions): ParticleHandle | undefined;
    sendParticleAlongPath?(svgPath: string, options?: ParticleOptions): ParticleHandle | undefined;
    sendParticleBetween?(sourceNodeId: string, targetNodeId: string, options?: ParticleOptions): ParticleHandle | undefined;
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
        const mergedTags = [...(options?.tags ?? [])];
        if (options?.tag) mergedTags.push(options.tag);
        return this._host.animate(targets, { ...options, tag: this.name, tags: mergedTags });
    }

    update(targets: AnimateTargets, options?: AnimateOptions): FlowAnimationHandle {
        const mergedTags = [...(options?.tags ?? [])];
        if (options?.tag) mergedTags.push(options.tag);
        return this._host.update(targets, { ...options, tag: this.name, tags: mergedTags });
    }

    sendParticle(edgeId: string, options?: ParticleOptions): ParticleHandle | undefined {
        return this._host.sendParticle?.(edgeId, { ...options, tag: this.name } as ParticleOptions);
    }

    sendParticleAlongPath(svgPath: string, options?: ParticleOptions): ParticleHandle | undefined {
        return this._host.sendParticleAlongPath?.(svgPath, { ...options, tag: this.name } as ParticleOptions);
    }

    sendParticleBetween(sourceNodeId: string, targetNodeId: string, options?: ParticleOptions): ParticleHandle | undefined {
        return this._host.sendParticleBetween?.(sourceNodeId, targetNodeId, { ...options, tag: this.name } as ParticleOptions);
    }

    timeline(): any {
        const tl = this._host.timeline?.();
        if (tl && typeof tl.setTag === 'function') {
            tl.setTag(this.name);
        }
        return tl;
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
