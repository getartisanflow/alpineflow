// ============================================================================
// FlowTimeline — Step-based animation sequencer
//
// Orchestrates animated changes to nodes and edges over time. Supports
// sequential and parallel steps, pause/resume with context forwarding,
// looping, reversal, lock mode, and event emission.
//
// Uses the shared AnimationEngine for frame scheduling.
// Operates on plain objects (no Alpine or DOM dependency) — the canvas
// integration layer is added in Phase 2.
// ============================================================================

import { resolveEasing, type EasingName } from './easing';
import { lerpNumber, lerpViewport, interpolateColor, parseStyle, interpolateStyle } from './interpolators';
import { applyDrawTransition, cleanupDrawTransition, applyFadeTransition, cleanupFadeTransition } from './edge-transitions';
import { AnimationEngine, type EngineHandle } from './engine';
import { svgPathToFunction, type PathFunction } from './paths';
import type { FlowNode, FlowEdge, XYPosition, Dimensions, Viewport, AnimateTargets, AnimateOptions, FlowAnimationHandle, EdgeGradient } from '../core/types';
import type { EdgeAnimationMode } from '../core/types';
import { getNodesBounds, getViewportForBounds } from '../core/geometry';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from '../core/geometry';

// ── Types ────────────────────────────────────────────────────────────────────

export interface StepContext {
  [key: string]: any;
  stepIndex: number;
  stepId?: string;
}

export interface TimelineStep {
  id?: string;

  // Node targeting
  nodes?: string[];
  position?: Partial<XYPosition>;
  class?: string;
  dimensions?: Partial<Dimensions>;
  style?: string | Record<string, string>;
  data?: Record<string, any>;
  selected?: boolean;
  zIndex?: number;

  /** Path function or SVG path string for curved motion. Overrides `position`. */
  followPath?: PathFunction | string;

  /** Optional visible guide path overlay for string-based followPath. */
  guidePath?: {
    visible?: boolean;
    class?: string;
    autoRemove?: boolean;
  };

  // Edge targeting
  edges?: string[];
  edgeAnimated?: boolean | EdgeAnimationMode;
  edgeColor?: string;
  edgeClass?: string;
  edgeLabel?: string;
  edgeStrokeWidth?: number;

  // Edge lifecycle
  addEdges?: FlowEdge[];
  removeEdges?: string[];
  edgeTransition?: 'none' | 'draw' | 'fade';

  // Viewport
  viewport?: Partial<Viewport>;
  fitView?: boolean;
  panTo?: string;
  fitViewPadding?: number;

  // Parallel container
  parallel?: TimelineStep[];

  // Timing
  duration?: number;
  easing?: EasingName | ((t: number) => number);
  delay?: number;
  lock?: boolean;

  // Hooks
  onStart?: (ctx: StepContext) => void;
  onProgress?: (progress: number, ctx: StepContext) => void;
  onComplete?: (ctx: StepContext) => void;
}

type StepEntry =
  | { type: 'step'; config: TimelineStep | ((ctx: StepContext) => TimelineStep) }
  | { type: 'parallel'; configs: Array<TimelineStep | ((ctx: StepContext) => TimelineStep)> }
  | { type: 'pause'; callback?: (resume: (context?: Record<string, any>) => void) => void };

export type TimelineEvent =
  | 'play' | 'step' | 'step-complete' | 'pause' | 'resume'
  | 'interrupt' | 'complete' | 'reverse' | 'loop' | 'stop' | 'reset';

export type TimelineState = 'idle' | 'playing' | 'paused' | 'stopped';

/** Minimal canvas interface the timeline needs — avoids coupling to the full canvas. */
export interface TimelineCanvas {
  nodes: FlowNode[];
  edges: FlowEdge[];
  getNode: (id: string) => FlowNode | undefined;
  getEdge: (id: string) => FlowEdge | undefined;
  /** The unified animation API. */
  animate: (targets: AnimateTargets, options?: AnimateOptions) => FlowAnimationHandle;
  /** Find the SVG path element for an edge (for draw transitions). */
  getEdgePathElement?: (id: string) => SVGPathElement | null;
  /** Find the edge group/wrapper element (for fade transitions). */
  getEdgeElement?: (id: string) => SVGElement | HTMLElement | null;
  /** Reactive viewport state. */
  viewport?: Viewport;
  /** Container dimensions for fitView/panTo calculations. */
  getContainerDimensions?: () => { width: number; height: number };
  /** Zoom constraints. */
  minZoom?: number;
  maxZoom?: number;
  /** The SVG element where guide paths should be inserted. */
  getEdgeSvgElement?: () => SVGSVGElement | null;
  /** When true, log warnings for missing targets. */
  debug?: boolean;
  /** Rebuild the edge lookup map after direct array mutations. */
  _rebuildEdgeMap?: () => void;
}

// ── Snapshot helpers ─────────────────────────────────────────────────────────

interface NodeSnapshot {
  position: XYPosition;
  class?: string;
  style?: string | Record<string, string>;
  data: Record<string, any>;
  dimensions?: Dimensions;
  selected?: boolean;
  zIndex?: number;
}

interface EdgeSnapshot {
  animated?: boolean | EdgeAnimationMode;
  color?: string | EdgeGradient;
  class?: string;
  label?: string;
  strokeWidth?: number;
}

function snapshotNode(node: FlowNode): NodeSnapshot {
  return {
    position: { ...node.position },
    class: node.class,
    style: typeof node.style === 'string' ? node.style : node.style ? { ...node.style } : undefined,
    data: JSON.parse(JSON.stringify(node.data)),
    dimensions: node.dimensions ? { ...node.dimensions } : undefined,
    selected: node.selected,
    zIndex: node.zIndex,
  };
}

function snapshotEdge(edge: FlowEdge): EdgeSnapshot {
  return {
    animated: edge.animated,
    color: edge.color,
    class: edge.class,
    label: edge.label,
    strokeWidth: edge.strokeWidth,
  };
}

function restoreNode(node: FlowNode, snap: NodeSnapshot): void {
  node.position.x = snap.position.x;
  node.position.y = snap.position.y;
  node.class = snap.class;
  node.style = snap.style;
  node.data = JSON.parse(JSON.stringify(snap.data));
  node.dimensions = snap.dimensions ? { ...snap.dimensions } : node.dimensions;
  node.selected = snap.selected;
  node.zIndex = snap.zIndex;
}

// ── FlowTimeline ─────────────────────────────────────────────────────────────

export class FlowTimeline {
  private _canvas: TimelineCanvas;
  private _engine: AnimationEngine;
  private _entries: StepEntry[] = [];
  private _state: TimelineState = 'idle';
  private _reversed = false;
  private _loopCount = -1; // -1 = no loop
  private _lockEnabled = false;
  private _locked = false;
  private _respectReducedMotion: boolean | undefined = undefined; // undefined = auto-detect
  private _listeners = new Map<TimelineEvent, Set<Function>>();
  private _context: Record<string, any> = {};
  private _activeHandles: EngineHandle[] = [];
  private _initialSnapshot: Map<string, NodeSnapshot> = new Map();
  private _initialEdgeSnapshot: Map<string, EdgeSnapshot> = new Map();
  private _playResolve: (() => void) | null = null;

  constructor(canvas: TimelineCanvas, engine?: AnimationEngine) {
    this._canvas = canvas;
    this._engine = engine ?? new AnimationEngine();
  }

  // ── Public API ───────────────────────────────────────────────────────

  get state(): TimelineState {
    return this._state;
  }

  get locked(): boolean {
    return this._locked;
  }

  step(config: TimelineStep | ((ctx: StepContext) => TimelineStep)): this {
    this._entries.push({ type: 'step', config });
    return this;
  }

  parallel(steps: Array<TimelineStep | ((ctx: StepContext) => TimelineStep)>): this {
    this._entries.push({ type: 'parallel', configs: steps });
    return this;
  }

  pause(callback?: (resume: (context?: Record<string, any>) => void) => void): this {
    this._entries.push({ type: 'pause', callback });
    return this;
  }

  play(): Promise<void> {
    return new Promise<void>((resolve) => {
      this._playResolve = resolve;
      this._state = 'playing';
      if (this._lockEnabled) this._locked = true;
      this._captureInitialSnapshot();
      this._emit('play');
      this._context = {};
      this._runEntries(resolve);
    });
  }

  stop(): void {
    this._stopAll();
    this._state = 'stopped';
    this._locked = false;
    this._emit('stop');
    this._playResolve?.();
    this._playResolve = null;
  }

  reset(replay?: boolean): Promise<void> | void {
    this._stopAll();
    this._restoreInitialSnapshot();
    this._state = 'idle';
    this._locked = false;
    this._emit('reset');

    if (replay) {
      return this.play();
    }
  }

  reverse(): this {
    this._reversed = !this._reversed;
    this._emit('reverse');
    return this;
  }

  loop(count?: number): this {
    this._loopCount = count ?? 0; // 0 = infinite
    return this;
  }

  lock(enabled?: boolean): this {
    this._lockEnabled = enabled ?? true;
    return this;
  }

  respectReducedMotion(enabled?: boolean): this {
    this._respectReducedMotion = enabled ?? true;
    return this;
  }

  on(event: TimelineEvent, handler: Function): this {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event)!.add(handler);
    return this;
  }

  /** Check if reduced motion is active (OS preference + not opted out). */
  private _isReducedMotion(): boolean {
    if (this._respectReducedMotion === false) return false;
    const mq = typeof globalThis.matchMedia === 'function'
      ? globalThis.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    return mq?.matches ?? false;
  }

  // ── Internal: event emission ────────────────────────────────────────

  private _emit(event: TimelineEvent, detail?: any): void {
    const handlers = this._listeners.get(event);
    if (!handlers) return;
    for (const handler of handlers) {
      handler(detail);
    }
  }

  // ── Internal: snapshot management ───────────────────────────────────

  private _captureInitialSnapshot(): void {
    if (this._initialSnapshot.size > 0) return; // Only capture once
    for (const entry of this._entries) {
      this._captureEntryTargets(entry);
    }
  }

  private _captureEntryTargets(entry: StepEntry): void {
    if (entry.type === 'pause') return;

    const configs = entry.type === 'parallel' ? entry.configs : [entry.config];
    for (const config of configs) {
      const resolved = typeof config === 'function'
        ? null // Can't resolve dynamic steps at capture time
        : config;
      if (!resolved) continue;

      if (resolved.parallel) {
        for (const sub of resolved.parallel) {
          this._captureStepTargets(sub);
        }
      } else {
        this._captureStepTargets(resolved);
      }
    }
  }

  private _captureStepTargets(step: TimelineStep): void {
    if (step.nodes) {
      for (const id of step.nodes) {
        if (!this._initialSnapshot.has(id)) {
          const node = this._canvas.getNode(id);
          if (node) this._initialSnapshot.set(id, snapshotNode(node));
        }
      }
    }
    if (step.edges) {
      for (const id of step.edges) {
        if (!this._initialEdgeSnapshot.has(id)) {
          const edge = this._canvas.getEdge(id);
          if (edge) this._initialEdgeSnapshot.set(id, snapshotEdge(edge));
        }
      }
    }
  }

  private _restoreInitialSnapshot(): void {
    for (const [id, snap] of this._initialSnapshot) {
      const node = this._canvas.getNode(id);
      if (node) restoreNode(node, snap);
    }
  }

  // ── Internal: handle management ─────────────────────────────────────

  private _stopAll(): void {
    for (const h of this._activeHandles) {
      h.stop();
    }
    this._activeHandles = [];
  }

  // ── Internal: entry execution ───────────────────────────────────────

  private async _runEntries(resolve: () => void): Promise<void> {
    const entries = this._reversed ? [...this._entries].reverse() : this._entries;
    let loopsRemaining = this._loopCount;

    const runOnce = async (): Promise<void> => {
      for (let i = 0; i < entries.length; i++) {
        if (this._state === 'stopped') return;

        const entry = entries[i];

        if (entry.type === 'pause') {
          await this._executePause(entry);
          continue;
        }

        if (entry.type === 'parallel') {
          await this._executeParallel(entry.configs, i);
          continue;
        }

        // Single step
        const config = entry.config;
        const resolved = typeof config === 'function'
          ? config(this._makeContext(i))
          : config;

        if (resolved.parallel) {
          await this._executeParallelSteps(resolved.parallel, i);
        } else {
          await this._executeStep(resolved, i);
        }
      }
    };

    await runOnce();

    // Handle looping
    if (this._state !== 'stopped' && loopsRemaining !== -1) {
      let infiniteIteration = 0;
      while ((this._state as TimelineState) !== 'stopped') {
        if (loopsRemaining === 0) {
          this._restoreInitialSnapshot();
          this._emit('loop', { iteration: infiniteIteration++ });
          try {
            await runOnce();
          } catch {
            resolve();
            return;
          }
        } else if (loopsRemaining > 0) {
          loopsRemaining--;
          this._restoreInitialSnapshot();
          this._emit('loop', { iteration: this._loopCount - loopsRemaining });
          await runOnce();
          if (loopsRemaining <= 0) break;
        } else {
          break;
        }
      }
    }

    if (this._state !== 'stopped') {
      this._state = 'idle';
      this._locked = false;
      this._emit('complete');
    }
    resolve();
  }

  private _makeContext(stepIndex: number, stepId?: string): StepContext {
    return {
      ...this._context,
      stepIndex,
      stepId,
    };
  }

  // ── Internal: pause execution ───────────────────────────────────────

  private _executePause(entry: StepEntry & { type: 'pause' }): Promise<void> {
    return new Promise<void>((resolve) => {
      this._state = 'paused';
      if (this._lockEnabled) this._locked = false;
      this._emit('pause');

      const resume = (context?: Record<string, any>): void => {
        if (context) {
          Object.assign(this._context, context);
        }
        this._state = 'playing';
        if (this._lockEnabled) this._locked = true;
        this._emit('resume');
        resolve();
      };

      entry.callback?.(resume);
    });
  }

  // ── Internal: parallel execution ────────────────────────────────────

  private async _executeParallel(
    configs: Array<TimelineStep | ((ctx: StepContext) => TimelineStep)>,
    entryIndex: number,
  ): Promise<void> {
    const resolved = configs.map((c) =>
      typeof c === 'function' ? c(this._makeContext(entryIndex)) : c,
    );
    await this._executeParallelSteps(resolved, entryIndex);
  }

  private async _executeParallelSteps(steps: TimelineStep[], entryIndex: number): Promise<void> {
    const promises = steps.map((step) => this._executeStep(step, entryIndex));
    await Promise.all(promises);
  }

  // ── Internal: single step execution ─────────────────────────────────

  private async _executeStep(step: TimelineStep, entryIndex: number): Promise<void> {
    const reducedMotion = this._isReducedMotion();
    const duration = reducedMotion ? 0 : (step.duration ?? 300);
    const delay = reducedMotion ? 0 : (step.delay ?? 0);
    const easing = resolveEasing(step.easing);
    const ctx = this._makeContext(entryIndex, step.id);

    this._emit('step', { index: entryIndex, id: step.id });
    step.onStart?.(ctx);

    // ── Warn about missing targets and filter valid ones ─────────
    let validNodeIds: string[] | undefined;
    let validEdgeIds: string[] | undefined;

    if (step.nodes) {
      validNodeIds = [];
      for (const id of step.nodes) {
        if (this._canvas.getNode(id)) {
          validNodeIds.push(id);
        } else if (this._canvas.debug) {
          console.warn(`[AlpineFlow] Animation step "${step.id ?? entryIndex}": node "${id}" not found, skipping`);
        }
      }
    }

    if (step.edges) {
      validEdgeIds = [];
      for (const id of step.edges) {
        if (this._canvas.getEdge(id)) {
          validEdgeIds.push(id);
        } else if (this._canvas.debug) {
          console.warn(`[AlpineFlow] Animation step "${step.id ?? entryIndex}": edge "${id}" not found, skipping`);
        }
      }
    }

    // If step targets nodes/edges but has zero valid targets, complete instantly
    const hasTargetedNodes = step.nodes && step.nodes.length > 0;
    const hasTargetedEdges = step.edges && step.edges.length > 0;
    const hasViewportStep = !!(step.viewport || step.fitView || step.panTo);
    const hasEdgeLifecycle = !!(step.addEdges?.length || step.removeEdges?.length);
    const hasZeroValidNodeTargets = hasTargetedNodes && (!validNodeIds || validNodeIds.length === 0);
    const hasZeroValidEdgeTargets = hasTargetedEdges && (!validEdgeIds || validEdgeIds.length === 0);
    if (hasZeroValidNodeTargets && hasZeroValidEdgeTargets && !hasViewportStep && !hasEdgeLifecycle) {
      step.onProgress?.(1, ctx);
      step.onComplete?.(ctx);
      this._emit('step-complete');
      return Promise.resolve();
    }
    if (hasZeroValidNodeTargets && !hasTargetedEdges && !hasViewportStep && !hasEdgeLifecycle) {
      step.onProgress?.(1, ctx);
      step.onComplete?.(ctx);
      this._emit('step-complete');
      return Promise.resolve();
    }
    if (hasZeroValidEdgeTargets && !hasTargetedNodes && !hasViewportStep && !hasEdgeLifecycle) {
      step.onProgress?.(1, ctx);
      step.onComplete?.(ctx);
      this._emit('step-complete');
      return Promise.resolve();
    }

    // Capture "from" values for nodes
    const nodeFromPositions = new Map<string, XYPosition>();
    const nodeFromDimensions = new Map<string, Dimensions>();
    const nodeFromStyles = new Map<string, Record<string, string>>();

    if (validNodeIds) {
      for (const id of validNodeIds) {
        const node = this._canvas.getNode(id);
        if (!node) continue;
        nodeFromPositions.set(id, { ...node.position });
        if (node.dimensions && step.dimensions) {
          nodeFromDimensions.set(id, { ...node.dimensions });
        }
        if (step.style && node.style) {
          nodeFromStyles.set(id, parseStyle(node.style) as Record<string, string>);
        }
      }
    }

    // Capture "from" values for edges
    const edgeFromStrokeWidth = new Map<string, number>();
    const edgeFromColor = new Map<string, string | EdgeGradient>();

    if (validEdgeIds) {
      for (const id of validEdgeIds) {
        const edge = this._canvas.getEdge(id);
        if (!edge) continue;
        if (step.edgeStrokeWidth !== undefined && edge.strokeWidth !== undefined) {
          edgeFromStrokeWidth.set(id, edge.strokeWidth);
        }
        if (step.edgeColor !== undefined && edge.color !== undefined) {
          edgeFromColor.set(id, edge.color);
        }
      }
    }

    // ── Resolve followPath ────────────────────────────────────────
    let resolvedPathFn: PathFunction | null = null;
    if (step.followPath) {
      if (typeof step.followPath === 'function') {
        resolvedPathFn = step.followPath;
      } else {
        resolvedPathFn = svgPathToFunction(step.followPath);
        if (!resolvedPathFn && this._canvas.debug) {
          console.warn('[AlpineFlow] SVG path resolution unavailable (no DOM), followPath string ignored');
        }
      }
    }

    // ── Guide path creation ────────────────────────────────────────
    let guidePathEl: SVGPathElement | null = null;
    if (
      step.guidePath?.visible &&
      typeof step.followPath === 'string' &&
      typeof document !== 'undefined'
    ) {
      const svgContainer = this._canvas.getEdgeSvgElement?.();
      if (svgContainer) {
        guidePathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        guidePathEl.setAttribute('d', step.followPath);
        guidePathEl.classList.add('flow-guide-path');
        if (step.guidePath.class) {
          guidePathEl.classList.add(step.guidePath.class);
        }
        svgContainer.appendChild(guidePathEl);
      }
    }

    // ── Viewport "from" capture ─────────────────────────────────────
    let viewportFrom: Viewport | null = null;
    let viewportTarget: Viewport | null = null;
    if (hasViewportStep && this._canvas.viewport) {
      viewportFrom = { ...this._canvas.viewport };
      viewportTarget = this._resolveTargetViewport(step);
    }

    // ── Edge lifecycle for animated steps ─────────────────────────────
    const transition = step.edgeTransition ?? 'none';
    const addEdgeIds = step.addEdges?.map((e) => e.id) ?? [];
    const removeEdgeIds = step.removeEdges?.filter((id) => this._canvas.getEdge(id)).slice() ?? [];

    // Instant step (duration: 0)
    if (duration === 0) {
      if (delay > 0) {
        return new Promise<void>((resolve) => {
          const timerId = setTimeout(() => {
            this._applyStepFinal(step);
            step.onProgress?.(1, ctx);
            step.onComplete?.(ctx);
            this._emit('step-complete');
            resolve();
          }, delay);
          // Track for cleanup
          const handle: EngineHandle = {
            stop() { clearTimeout(timerId); },
          };
          this._activeHandles.push(handle);
        });
      }
      if (resolvedPathFn && validNodeIds) {
        const pos = resolvedPathFn(1);
        for (const id of validNodeIds) {
          const node = this._canvas.getNode(id);
          if (node) {
            node.position.x = pos.x;
            node.position.y = pos.y;
          }
        }
      }
      this._applyStepFinal(step);
      // Guide path cleanup (instant)
      if (guidePathEl && step.guidePath?.autoRemove !== false) {
        guidePathEl.remove();
      }
      step.onProgress?.(1, ctx);
      step.onComplete?.(ctx);
      this._emit('step-complete');
      return Promise.resolve();
    }

    // For animated transitions, add edges up front so the DOM renders paths
    if (step.addEdges) {
      this._addEdges(step.addEdges);
    }

    // Pre-hide newly added edges so they don't flash for one frame.
    // Uses double queueMicrotask so Alpine's reactive effects (also microtask-
    // scheduled) have created the DOM elements before we apply initial styles.
    // This runs before the browser's next paint, unlike requestAnimationFrame
    // which fires in the next frame and causes a single-frame flash.
    if (transition !== 'none' && addEdgeIds.length && step.addEdges) {
      await new Promise<void>((hideResolve) => {
        queueMicrotask(() => queueMicrotask(() => {
          if (transition === 'draw') {
            this._applyEdgeDrawTransition(addEdgeIds, 0, 'in');
          } else if (transition === 'fade') {
            this._applyEdgeFadeTransition(addEdgeIds, 0, 'in');
          }
          hideResolve();
        }));
      });
    }

    // followPath steps retain engine-based interpolation — animate() can't handle custom path functions
    if (resolvedPathFn) {
      return new Promise<void>((resolve) => {
        const handle = this._engine.register((elapsed) => {
          if (this._state === 'stopped') {
            resolve();
            return true; // stop
          }

          const rawProgress = Math.min(elapsed / duration, 1);
          const progress = easing(rawProgress);

          // followPath position from path function
          if (validNodeIds) {
            const pos = resolvedPathFn(progress);
            for (const id of validNodeIds) {
              const node = this._canvas.getNode(id);
              if (node) {
                node.position.x = pos.x;
                node.position.y = pos.y;
              }
            }
          }

          // Interpolate node dimensions
          if (validNodeIds && step.dimensions) {
            for (const id of validNodeIds) {
              const node = this._canvas.getNode(id);
              const from = nodeFromDimensions.get(id);
              if (!node || !from || !node.dimensions) continue;

              if (step.dimensions.width !== undefined) {
                node.dimensions.width = lerpNumber(from.width, step.dimensions.width, progress);
              }
              if (step.dimensions.height !== undefined) {
                node.dimensions.height = lerpNumber(from.height, step.dimensions.height, progress);
              }
            }
          }

          // Interpolate node styles
          if (validNodeIds && step.style) {
            const targetStyle = parseStyle(step.style);
            for (const id of validNodeIds) {
              const node = this._canvas.getNode(id);
              const from = nodeFromStyles.get(id);
              if (!node) continue;
              if (from) {
                node.style = interpolateStyle(from, targetStyle as Record<string, string>, progress);
              }
            }
          }

          // Interpolate edge strokeWidth
          if (validEdgeIds && step.edgeStrokeWidth !== undefined) {
            for (const id of validEdgeIds) {
              const edge = this._canvas.getEdge(id);
              const from = edgeFromStrokeWidth.get(id);
              if (!edge) continue;
              if (from !== undefined) {
                edge.strokeWidth = lerpNumber(from, step.edgeStrokeWidth, progress);
              } else {
                edge.strokeWidth = step.edgeStrokeWidth;
              }
            }
          }

          // Interpolate edge color
          if (validEdgeIds && step.edgeColor !== undefined) {
            for (const id of validEdgeIds) {
              const edge = this._canvas.getEdge(id);
              const from = edgeFromColor.get(id);
              if (!edge) continue;
              if (from !== undefined && typeof from === 'string') {
                edge.color = interpolateColor(from, step.edgeColor, progress);
              } else if (from !== undefined) {
                edge.color = step.edgeColor;
              } else {
                edge.color = step.edgeColor;
              }
            }
          }

          // Interpolate viewport
          if (viewportFrom && viewportTarget && this._canvas.viewport) {
            const vp = lerpViewport(viewportFrom, viewportTarget, progress, {
              minZoom: this._canvas.minZoom,
              maxZoom: this._canvas.maxZoom,
            });
            this._canvas.viewport.x = vp.x;
            this._canvas.viewport.y = vp.y;
            this._canvas.viewport.zoom = vp.zoom;
          }

          // Edge transitions per tick
          if (transition === 'draw') {
            if (addEdgeIds.length) this._applyEdgeDrawTransition(addEdgeIds, progress, 'in');
            if (removeEdgeIds.length) this._applyEdgeDrawTransition(removeEdgeIds, progress, 'out');
          } else if (transition === 'fade') {
            if (addEdgeIds.length) this._applyEdgeFadeTransition(addEdgeIds, progress, 'in');
            if (removeEdgeIds.length) this._applyEdgeFadeTransition(removeEdgeIds, progress, 'out');
          }

          step.onProgress?.(rawProgress, ctx);

          // Step complete
          if (rawProgress >= 1) {
            if (transition === 'draw') {
              this._cleanupEdgeDrawTransition(addEdgeIds);
              this._cleanupEdgeDrawTransition(removeEdgeIds);
            } else if (transition === 'fade') {
              this._cleanupEdgeFadeTransition(addEdgeIds);
              this._cleanupEdgeFadeTransition(removeEdgeIds);
            }

            if (removeEdgeIds.length) {
              this._removeEdges(removeEdgeIds);
            }

            this._applyStepInstant(step);

            if (guidePathEl && step.guidePath?.autoRemove !== false) {
              guidePathEl.remove();
            }

            step.onProgress?.(1, ctx);
            step.onComplete?.(ctx);
            this._emit('step-complete');
            resolve();
            return true; // stop scheduling
          }

          return false; // continue
        }, delay);
        this._activeHandles.push(handle);
      });
    }

    // Animated step — delegate to canvas.animate()
    return new Promise<void>((resolve) => {
      // Build targets
      const animTargets: AnimateTargets = {};

      if (validNodeIds) {
        animTargets.nodes = {};
        for (const id of validNodeIds) {
          const target: Record<string, any> = {};
          if (step.position) target.position = { ...step.position };
          if (step.dimensions) target.dimensions = { ...step.dimensions };
          if (step.style !== undefined) target.style = step.style;
          if (step.class !== undefined) target.class = step.class;
          if (step.data !== undefined) target.data = step.data;
          if (step.selected !== undefined) target.selected = step.selected;
          if (step.zIndex !== undefined) target.zIndex = step.zIndex;
          animTargets.nodes[id] = target;
        }
      }

      if (validEdgeIds) {
        animTargets.edges = {};
        for (const id of validEdgeIds) {
          const target: Record<string, any> = {};
          if (step.edgeColor !== undefined) target.color = step.edgeColor;
          if (step.edgeStrokeWidth !== undefined) target.strokeWidth = step.edgeStrokeWidth;
          if (step.edgeLabel !== undefined) target.label = step.edgeLabel;
          if (step.edgeAnimated !== undefined) target.animated = step.edgeAnimated;
          if (step.edgeClass !== undefined) target.class = step.edgeClass;
          animTargets.edges[id] = target;
        }
      }

      if (viewportTarget && viewportFrom) {
        animTargets.viewport = {
          pan: { x: viewportTarget.x, y: viewportTarget.y },
          zoom: viewportTarget.zoom,
        };
      }

      const hasAnimatableTargets = Object.keys(animTargets.nodes || {}).length > 0
        || Object.keys(animTargets.edges || {}).length > 0
        || animTargets.viewport;

      if (!hasAnimatableTargets && !addEdgeIds.length && !removeEdgeIds.length) {
        // Nothing to animate
        step.onProgress?.(1, ctx);
        step.onComplete?.(ctx);
        this._emit('step-complete');
        resolve();
        return;
      }

      // If we have animatable targets, use canvas.animate()
      if (hasAnimatableTargets) {
        const animHandle = this._canvas.animate(animTargets, {
          duration,
          easing: step.easing,
          delay,
          onProgress: (progress) => {
            if (this._state === 'stopped') {
              animHandle.stop();
              resolve();
              return;
            }

            // Edge transitions per tick
            if (transition === 'draw') {
              if (addEdgeIds.length) this._applyEdgeDrawTransition(addEdgeIds, progress, 'in');
              if (removeEdgeIds.length) this._applyEdgeDrawTransition(removeEdgeIds, progress, 'out');
            } else if (transition === 'fade') {
              if (addEdgeIds.length) this._applyEdgeFadeTransition(addEdgeIds, progress, 'in');
              if (removeEdgeIds.length) this._applyEdgeFadeTransition(removeEdgeIds, progress, 'out');
            }

            step.onProgress?.(progress, ctx);
          },
          onComplete: () => {
            // Cleanup edge transitions
            if (transition === 'draw') {
              this._cleanupEdgeDrawTransition(addEdgeIds);
              this._cleanupEdgeDrawTransition(removeEdgeIds);
            } else if (transition === 'fade') {
              this._cleanupEdgeFadeTransition(addEdgeIds);
              this._cleanupEdgeFadeTransition(removeEdgeIds);
            }

            if (removeEdgeIds.length) {
              this._removeEdges(removeEdgeIds);
            }

            // Apply instant edge properties not handled by animate
            this._applyStepInstant(step);

            if (guidePathEl && step.guidePath?.autoRemove !== false) {
              guidePathEl.remove();
            }

            step.onProgress?.(1, ctx);
            step.onComplete?.(ctx);
            this._emit('step-complete');
            resolve();
          },
        });

        this._activeHandles.push({ stop: () => animHandle.stop() });
      } else {
        // Only edge lifecycle, no interpolation needed — use engine for timing
        const handle = this._engine.register((elapsed) => {
          if (this._state === 'stopped') {
            resolve();
            return true;
          }

          const rawProgress = Math.min(elapsed / duration, 1);

          if (transition === 'draw') {
            if (addEdgeIds.length) this._applyEdgeDrawTransition(addEdgeIds, rawProgress, 'in');
            if (removeEdgeIds.length) this._applyEdgeDrawTransition(removeEdgeIds, rawProgress, 'out');
          } else if (transition === 'fade') {
            if (addEdgeIds.length) this._applyEdgeFadeTransition(addEdgeIds, rawProgress, 'in');
            if (removeEdgeIds.length) this._applyEdgeFadeTransition(removeEdgeIds, rawProgress, 'out');
          }

          step.onProgress?.(rawProgress, ctx);

          if (rawProgress >= 1) {
            if (transition === 'draw') {
              this._cleanupEdgeDrawTransition(addEdgeIds);
              this._cleanupEdgeDrawTransition(removeEdgeIds);
            } else if (transition === 'fade') {
              this._cleanupEdgeFadeTransition(addEdgeIds);
              this._cleanupEdgeFadeTransition(removeEdgeIds);
            }

            if (removeEdgeIds.length) {
              this._removeEdges(removeEdgeIds);
            }

            if (guidePathEl && step.guidePath?.autoRemove !== false) {
              guidePathEl.remove();
            }

            step.onProgress?.(1, ctx);
            step.onComplete?.(ctx);
            this._emit('step-complete');
            resolve();
            return true;
          }

          return false;
        }, delay);
        this._activeHandles.push(handle);
      }
    });
  }

  // ── Internal: apply step properties ─────────────────────────────────

  /** Apply all properties of a step at their final values (for instant steps). */
  private _applyStepFinal(step: TimelineStep): void {
    // Edge lifecycle (instant — no transition animation)
    if (step.addEdges) {
      this._addEdges(step.addEdges);
    }
    if (step.removeEdges) {
      this._removeEdges(step.removeEdges);
    }

    if (step.nodes) {
      for (const id of step.nodes) {
        const node = this._canvas.getNode(id);
        if (!node) continue;

        if (step.position) {
          if (step.position.x !== undefined) node.position.x = step.position.x;
          if (step.position.y !== undefined) node.position.y = step.position.y;
        }
        if (step.class !== undefined) node.class = step.class;
        if (step.data !== undefined) Object.assign(node.data, step.data);
        if (step.selected !== undefined) node.selected = step.selected;
        if (step.zIndex !== undefined) node.zIndex = step.zIndex;
        if (step.dimensions && node.dimensions) {
          if (step.dimensions.width !== undefined) node.dimensions.width = step.dimensions.width;
          if (step.dimensions.height !== undefined) node.dimensions.height = step.dimensions.height;
        }
        if (step.style !== undefined) node.style = step.style;
      }
    }

    // Viewport
    this._applyViewportFinal(step);

    this._applyStepInstant(step);
  }

  /** Apply instant-swap edge properties (not interpolated). */
  private _applyStepInstant(step: TimelineStep): void {
    if (step.edges) {
      for (const id of step.edges) {
        const edge = this._canvas.getEdge(id);
        if (!edge) continue;

        if (step.edgeAnimated !== undefined) edge.animated = step.edgeAnimated;
        if (step.edgeClass !== undefined) edge.class = step.edgeClass;
        if (step.edgeLabel !== undefined) edge.label = step.edgeLabel;
      }
    }
  }

  // ── Internal: edge lifecycle ───────────────────────────────────────

  /** Add edges to the canvas edges array. */
  private _addEdges(edges: FlowEdge[]): void {
    this._canvas.edges.push(...edges);
    this._canvas._rebuildEdgeMap?.();
  }

  /** Remove edges from the canvas edges array by ID. */
  private _removeEdges(ids: string[]): void {
    for (const id of ids) {
      const idx = this._canvas.edges.findIndex((e) => e.id === id);
      if (idx !== -1) this._canvas.edges.splice(idx, 1);
    }
    this._canvas._rebuildEdgeMap?.();
  }

  /** Apply draw transition on each tick for added/removed edges. */
  private _applyEdgeDrawTransition(
    edgeIds: string[],
    progress: number,
    direction: 'in' | 'out',
  ): void {
    for (const id of edgeIds) {
      const pathEl = this._canvas.getEdgePathElement?.(id);
      if (pathEl) {
        applyDrawTransition(pathEl, progress, direction);
      }
    }
  }

  /** Clean up draw transition styles. */
  private _cleanupEdgeDrawTransition(edgeIds: string[]): void {
    for (const id of edgeIds) {
      const pathEl = this._canvas.getEdgePathElement?.(id);
      if (pathEl) {
        cleanupDrawTransition(pathEl);
      }
    }
  }

  /** Apply fade transition on each tick for added/removed edges. */
  private _applyEdgeFadeTransition(
    edgeIds: string[],
    progress: number,
    direction: 'in' | 'out',
  ): void {
    for (const id of edgeIds) {
      const el = this._canvas.getEdgeElement?.(id);
      if (el) {
        applyFadeTransition(el, progress, direction);
      }
    }
  }

  /** Clean up fade transition styles. */
  private _cleanupEdgeFadeTransition(edgeIds: string[]): void {
    for (const id of edgeIds) {
      const el = this._canvas.getEdgeElement?.(id);
      if (el) {
        cleanupFadeTransition(el);
      }
    }
  }

  // ── Internal: viewport helpers ──────────────────────────────────

  /** Compute the target viewport for a step (viewport, fitView, or panTo). */
  private _resolveTargetViewport(step: TimelineStep): Viewport | null {
    const vp = this._canvas.viewport;
    if (!vp) return null;

    if (step.fitView) {
      return this._computeFitViewViewport(step);
    }

    if (step.panTo) {
      return this._computePanToViewport(step.panTo);
    }

    if (step.viewport) {
      return {
        x: step.viewport.x ?? vp.x,
        y: step.viewport.y ?? vp.y,
        zoom: step.viewport.zoom ?? vp.zoom,
      };
    }

    return null;
  }

  /** Compute the viewport that fits all (or specified) nodes with padding. */
  private _computeFitViewViewport(step: TimelineStep): Viewport | null {
    const dims = this._canvas.getContainerDimensions?.();
    if (!dims) return null;

    const targetNodes = step.nodes
      ? step.nodes.map((id) => this._canvas.getNode(id)).filter((n): n is FlowNode => !!n)
      : this._canvas.nodes;

    if (targetNodes.length === 0) return null;

    const bounds = getNodesBounds(targetNodes);
    const padding = step.fitViewPadding ?? 0.1;
    return getViewportForBounds(
      bounds,
      dims.width,
      dims.height,
      this._canvas.minZoom ?? 0.5,
      this._canvas.maxZoom ?? 2,
      padding,
    );
  }

  /** Compute the viewport that centers on a given node. */
  private _computePanToViewport(nodeId: string): Viewport | null {
    const node = this._canvas.getNode(nodeId);
    if (!node) return null;

    const vp = this._canvas.viewport;
    if (!vp) return null;

    const dims = this._canvas.getContainerDimensions?.();
    if (!dims) return null;

    const w = node.dimensions?.width ?? DEFAULT_NODE_WIDTH;
    const h = node.dimensions?.height ?? DEFAULT_NODE_HEIGHT;
    const centerX = node.position.x + w / 2;
    const centerY = node.position.y + h / 2;

    return {
      x: dims.width / 2 - centerX * vp.zoom,
      y: dims.height / 2 - centerY * vp.zoom,
      zoom: vp.zoom,
    };
  }

  /** Apply viewport at final values (for instant steps). */
  private _applyViewportFinal(step: TimelineStep): void {
    const target = this._resolveTargetViewport(step);
    if (!target || !this._canvas.viewport) return;

    this._canvas.viewport.x = target.x;
    this._canvas.viewport.y = target.y;
    this._canvas.viewport.zoom = target.zoom;
  }
}
