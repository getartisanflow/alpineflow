import type { StopOptions } from '../core/types';

export interface Taggable {
  _tags?: string[];
  stop(options?: StopOptions): void;
  pause(): void;
  resume(): void;
  readonly isFinished: boolean;
}

export class HandleRegistry {
  private _handles = new Set<Taggable>();

  register(handle: Taggable): void {
    this._handles.add(handle);
  }

  unregister(handle: Taggable): void {
    this._handles.delete(handle);
  }

  getHandles(filter?: { tag?: string; tags?: string[] }): Taggable[] {
    const handles = [...this._handles];
    if (!filter?.tag && !filter?.tags?.length) {
      return handles;
    }
    const tagSet = new Set<string>();
    if (filter.tag) {
      tagSet.add(filter.tag);
    }
    if (filter.tags) {
      filter.tags.forEach((t) => tagSet.add(t));
    }
    return handles.filter((h) => h._tags?.some((t) => tagSet.has(t)) ?? false);
  }

  cancelAll(filter: { tag?: string; tags?: string[] }, options?: StopOptions): void {
    for (const handle of this.getHandles(filter)) {
      if (!handle.isFinished) {
        handle.stop(options);
      }
    }
  }

  pauseAll(filter: { tag?: string; tags?: string[] }): void {
    for (const handle of this.getHandles(filter)) {
      if (!handle.isFinished) {
        handle.pause();
      }
    }
  }

  resumeAll(filter: { tag?: string; tags?: string[] }): void {
    for (const handle of this.getHandles(filter)) {
      handle.resume();
    }
  }

  clear(): void {
    this._handles.clear();
  }

  get size(): number {
    return this._handles.size;
  }
}
