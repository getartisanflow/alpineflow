// ============================================================================
// canvas-layout — Layout engines, child layout, and auto-layout mixin for
//                 flow-canvas
//
// Public API: layout, forceLayout, treeLayout, elkLayout, layoutChildren,
//             reorderChild.
// Internal:   _scheduleAutoLayout, _runAutoLayout, _applyLayout,
//             _adjustHandlePositions.
//
// Ten methods covering Dagre/Force/Hierarchy/ELK layout engines, child layout
// computation with recursive stretch propagation, reorder, and auto-layout
// scheduling with debounce.
//
// Cross-mixin deps (via ctx): fitView.
// ============================================================================

import type { CanvasContext } from './canvas-context';
import type { FlowNode, Dimensions, HandlePosition } from '../../core/types';
import type { ElkAlgorithm, ElkDirection } from '../../core/layout/elk';
import type { HierarchyLayoutType, HierarchyDirection } from '../../core/layout/hierarchy';
import { computeChildLayout } from '../../core/child-layout';
import { debug } from '../../core/debug';
import { getAddon } from '../../core/registry';

export function createLayoutMixin(ctx: CanvasContext) {
  return {
    // ── Auto-layout scheduling ─────────────────────────────────────────────

    /**
     * Debounced trigger for automatic layout.
     *
     * Skips when no autoLayout config is set, dependencies haven't loaded,
     * or the auto-layout has permanently failed.
     */
    _scheduleAutoLayout(): void {
      const alc = ctx._config.autoLayout;
      if (!alc || !ctx._autoLayoutReady || ctx._autoLayoutFailed) return;
      if (ctx._autoLayoutTimer) clearTimeout(ctx._autoLayoutTimer);
      ctx._autoLayoutTimer = setTimeout(() => {
        ctx._autoLayoutTimer = null;
        this._runAutoLayout();
      }, alc.debounce ?? 50);
    },

    /**
     * Execute the configured auto-layout algorithm.
     *
     * Delegates to the appropriate layout engine method based on
     * `config.autoLayout.algorithm`. Catches errors and sets
     * `_autoLayoutFailed` to prevent repeated attempts.
     */
    async _runAutoLayout(): Promise<void> {
      const alc = ctx._config.autoLayout;
      if (!alc) return;
      const opts = {
        fitView: alc.fitView !== false,
        duration: alc.duration ?? 300,
      };
      try {
        switch (alc.algorithm) {
          case 'dagre':
            this.layout({
              direction: alc.direction,
              nodesep: alc.nodesep,
              ranksep: alc.ranksep,
              adjustHandles: alc.adjustHandles,
              ...opts,
            });
            break;
          case 'force':
            this.forceLayout({
              strength: alc.strength,
              distance: alc.distance,
              charge: alc.charge,
              iterations: alc.iterations,
              ...opts,
            });
            break;
          case 'hierarchy':
            this.treeLayout({
              layoutType: alc.layoutType as any,
              nodeWidth: alc.nodeWidth,
              nodeHeight: alc.nodeHeight,
              adjustHandles: alc.adjustHandles,
              ...opts,
            });
            break;
          case 'elk':
            await this.elkLayout({
              algorithm: alc.elkAlgorithm,
              nodeSpacing: alc.nodeSpacing,
              layerSpacing: alc.layerSpacing,
              adjustHandles: alc.adjustHandles,
              ...opts,
            });
            break;
        }
      } catch (err: any) {
        if (!ctx._autoLayoutFailed) {
          ctx._warn('AUTO_LAYOUT_FAILED', `autoLayout failed: ${err.message}`);
          ctx._autoLayoutFailed = true;
        }
      }
    },

    // ── Shared layout application ──────────────────────────────────────────

    /**
     * Apply computed layout positions to nodes with optional animation.
     *
     * When duration > 0, delegates to ctx.animate() for smooth transitions.
     * When duration === 0, applies positions directly (instant).
     * Calls `_adjustHandlePositions` when requested, and triggers fitView.
     */
    _applyLayout(
      positions: Map<string, { x: number; y: number }>,
      options?: {
        adjustHandles?: boolean;
        handleDirection?: string;
        fitView?: boolean;
        duration?: number;
      },
    ): void {
      const duration = options?.duration ?? 300;

      debug('layout', `_applyLayout: repositioning ${positions.size} node(s)`, {
        duration,
        adjustHandles: options?.adjustHandles ?? false,
        fitView: options?.fitView !== false,
      });

      if (options?.adjustHandles && options.handleDirection) {
        this._adjustHandlePositions(options.handleDirection);
      }

      if (duration > 0) {
        // Build animate() targets
        const nodeTargets: Record<string, { position: { x: number; y: number } }> = {};
        for (const [id, pos] of positions) {
          nodeTargets[id] = { position: pos };
        }

        ctx.animate?.({ nodes: nodeTargets }, {
          duration,
          easing: 'easeInOut' as any,
          onComplete: () => {
            if (options?.fitView !== false) {
              ctx.fitView?.({ padding: 0.2, duration });
            }
          },
        });
      } else {
        // Instant apply — no animation
        for (const node of ctx.nodes) {
          const pos = positions.get(node.id);
          if (pos) {
            if (!node.position) node.position = { x: 0, y: 0 };
            node.position.x = pos.x;
            node.position.y = pos.y;
          }
        }

        if (options?.fitView !== false) {
          ctx.fitView?.({ padding: 0.2, duration: 0 });
        }
      }
    },

    /**
     * Update handle positions on nodes and DOM elements to match a layout
     * direction (TB, LR, BT, RL, DOWN, RIGHT, UP, LEFT).
     *
     * Skips handles that have an explicit position set via
     * `data-flow-handle-explicit`.
     */
    _adjustHandlePositions(direction: string): void {
      const map: Record<string, { source: HandlePosition; target: HandlePosition }> = {
        TB:    { source: 'bottom', target: 'top' },
        DOWN:  { source: 'bottom', target: 'top' },
        LR:    { source: 'right',  target: 'left' },
        RIGHT: { source: 'right',  target: 'left' },
        BT:    { source: 'top',    target: 'bottom' },
        UP:    { source: 'top',    target: 'bottom' },
        RL:    { source: 'left',   target: 'right' },
        LEFT:  { source: 'left',   target: 'right' },
      };

      const positions = map[direction] ?? map['TB'];

      for (const node of ctx.nodes) {
        node.sourcePosition = positions.source;
        node.targetPosition = positions.target;
      }

      ctx._container?.querySelectorAll<HTMLElement>('[data-flow-handle-type="source"]').forEach((el) => {
        if (!el.dataset.flowHandleExplicit) {
          el.dataset.flowHandlePosition = positions.source;
        }
      });
      ctx._container?.querySelectorAll<HTMLElement>('[data-flow-handle-type="target"]').forEach((el) => {
        if (!el.dataset.flowHandleExplicit) {
          el.dataset.flowHandlePosition = positions.target;
        }
      });
    },

    // ── Child layout ───────────────────────────────────────────────────────

    /**
     * Compute and apply child layout for a parent node.
     *
     * Recursively lays out nested layout parents bottom-up (unless `shallow`
     * is true). Applies computed positions, dimension overrides with
     * min/max constraint clamping, and auto-sizes the parent.
     */
    /**
     * Compute and apply child layout for a parent node.
     *
     * Supports both the legacy positional signature and a new options object:
     *
     *   layoutChildren(parentId)                          // full layout
     *   layoutChildren(parentId, excludeId, shallow)      // legacy (backward compat)
     *   layoutChildren(parentId, { ... })                 // options object
     *
     * Options:
     *   - excludeId: skip applying position/dimensions but still count in computation
     *   - omitFromComputation: fully remove node from child list (old parent shrinks)
     *   - includeNode: add a virtual child to computation (new parent grows)
     *   - shallow: don't recurse into nested layout children
     *   - stretchedSize: externally-provided size for stretch propagation
     */
    layoutChildren(
      parentId: string,
      optsOrExcludeId?: string | {
        excludeId?: string;
        omitFromComputation?: string;
        includeNode?: FlowNode;
        shallow?: boolean;
        stretchedSize?: Dimensions;
      },
      shallowArg?: boolean,
      stretchedSizeArg?: Dimensions,
    ): void {
      // Normalize legacy positional args into options object
      let opts: {
        excludeId?: string;
        omitFromComputation?: string;
        includeNode?: FlowNode;
        shallow?: boolean;
        stretchedSize?: Dimensions;
      };
      if (typeof optsOrExcludeId === 'string') {
        opts = { excludeId: optsOrExcludeId, shallow: shallowArg, stretchedSize: stretchedSizeArg };
      } else {
        opts = optsOrExcludeId ?? {};
      }

      const { excludeId, omitFromComputation, includeNode, shallow } = opts;
      let { stretchedSize } = opts;

      // Use proxied references from ctx.nodes for reactivity
      const parent = (ctx.nodes as FlowNode[]).find((n: FlowNode) => n.id === parentId);
      if (!parent?.childLayout) return;

      // Build the child list for computation:
      // - omitFromComputation: fully remove from the list (parent auto-sizes without it)
      // - includeNode: add as virtual child (parent auto-sizes with it)
      let children = ctx.nodes.filter((n: FlowNode) => n.parentId === parentId);
      if (omitFromComputation) {
        children = children.filter((n: FlowNode) => n.id !== omitFromComputation);
      }
      if (includeNode && !children.some((n: FlowNode) => n.id === includeNode.id)) {
        children = [...children, includeNode];
      }

      const childMap = new Map(children.map((c: FlowNode) => [c.id, c]));

      // Clear stale parent dimensions
      parent.dimensions = undefined;

      // Top-down constraint: when this parent has maxDimensions and no
      // externally-provided stretchedSize, use maxDimensions as the
      // initial available space so children are constrained from the start
      // rather than auto-sized first and clamped after.
      if (!stretchedSize && parent.maxDimensions && parent.maxDimensions.width !== undefined && parent.maxDimensions.height !== undefined) {
        stretchedSize = { width: parent.maxDimensions.width, height: parent.maxDimensions.height };
      }

      // Recurse bottom-up
      if (!shallow) {
        for (const child of children) {
          if (child.childLayout) {
            this.layoutChildren(child.id, { excludeId, omitFromComputation, shallow: false });
          }
        }
      }

      // Auto-default headerHeight when parent has a label
      const config = parent.childLayout;
      const effectiveConfig = config.headerHeight !== undefined ? config
        : parent.data?.label ? { ...config, headerHeight: 30 } : config;

      const result = computeChildLayout(children, effectiveConfig, stretchedSize);

      // Apply positions (skip excludeId — it participates in computation but
      // isn't repositioned since it's being dragged)
      for (const [id, pos] of result.positions) {
        if (id === excludeId) continue;
        // Don't apply position to virtual includeNode (it's not in ctx.nodes)
        if (includeNode && id === includeNode.id && !ctx._nodeMap.has(id)) continue;
        const node = childMap.get(id);
        if (node) {
          if (!node.position) node.position = { x: pos.x, y: pos.y };
          else { node.position.x = pos.x; node.position.y = pos.y; }
        }
      }

      // Apply dimension overrides (stretch) + propagate to nested layout parents
      for (const [id, dims] of result.dimensions) {
        if (id === excludeId) continue;
        if (includeNode && id === includeNode.id && !ctx._nodeMap.has(id)) continue;
        const node = childMap.get(id);
        if (node) {
          let w = dims.width;
          let h = dims.height;
          if (node.minDimensions) {
            if (node.minDimensions.width != null) w = Math.max(w, node.minDimensions.width);
            if (node.minDimensions.height != null) h = Math.max(h, node.minDimensions.height);
          }
          if (node.maxDimensions) {
            if (node.maxDimensions.width != null) w = Math.min(w, node.maxDimensions.width);
            if (node.maxDimensions.height != null) h = Math.min(h, node.maxDimensions.height);
          }
          if (!node.dimensions) {
            node.dimensions = { width: w, height: h };
          } else {
            node.dimensions.width = w;
            node.dimensions.height = h;
          }
          // Stretch propagation
          if (node.childLayout && !shallow) {
            this.layoutChildren(id, { excludeId, omitFromComputation, shallow: false, stretchedSize: node.dimensions! });
          }
        }
      }

      // Auto-size parent
      let pw = result.parentDimensions.width;
      let ph = result.parentDimensions.height;
      if (parent.minDimensions) {
        if (parent.minDimensions.width != null) pw = Math.max(pw, parent.minDimensions.width);
        if (parent.minDimensions.height != null) ph = Math.max(ph, parent.minDimensions.height);
      }
      if (parent.maxDimensions) {
        if (parent.maxDimensions.width != null) pw = Math.min(pw, parent.maxDimensions.width);
        if (parent.maxDimensions.height != null) ph = Math.min(ph, parent.maxDimensions.height);
      }
      if (!parent.dimensions) parent.dimensions = { width: 0, height: 0 };
      parent.dimensions.width = pw;
      parent.dimensions.height = ph;

      // Re-compute with constrained size when clamping changed the parent.
      // This feeds the clamped dimensions back as stretchedSize so children
      // are properly sized within the constrained space (e.g. maxDimensions
      // on the topmost parent cascades down).
      const wasClamped = pw !== result.parentDimensions.width || ph !== result.parentDimensions.height;
      if (wasClamped) {
        const constrainedSize = { width: pw, height: ph };
        const reResult = computeChildLayout(children, effectiveConfig, constrainedSize);

        for (const [id, pos] of reResult.positions) {
          if (id === excludeId) continue;
          if (includeNode && id === includeNode.id && !ctx._nodeMap.has(id)) continue;
          const node = childMap.get(id);
          if (node) {
            if (!node.position) node.position = { x: pos.x, y: pos.y };
            else { node.position.x = pos.x; node.position.y = pos.y; }
          }
        }

        for (const [id, dims] of reResult.dimensions) {
          if (id === excludeId) continue;
          if (includeNode && id === includeNode.id && !ctx._nodeMap.has(id)) continue;
          const node = childMap.get(id);
          if (node) {
            let w = dims.width;
            let h = dims.height;
            if (node.minDimensions) {
              if (node.minDimensions.width != null) w = Math.max(w, node.minDimensions.width);
              if (node.minDimensions.height != null) h = Math.max(h, node.minDimensions.height);
            }
            if (node.maxDimensions) {
              if (node.maxDimensions.width != null) w = Math.min(w, node.maxDimensions.width);
              if (node.maxDimensions.height != null) h = Math.min(h, node.maxDimensions.height);
            }
            if (!node.dimensions) {
              node.dimensions = { width: w, height: h };
            } else {
              node.dimensions.width = w;
              node.dimensions.height = h;
            }
            // Stretch propagation with constrained size
            if (node.childLayout && !shallow) {
              this.layoutChildren(id, { excludeId, omitFromComputation, shallow: false, stretchedSize: node.dimensions! });
            }
          }
        }
      }
    },

    /**
     * Walk up from a parent through ancestor layout parents, calling
     * layoutChildren(shallow) at each level so parent resizes propagate
     * through the hierarchy (e.g. Column grows -> Row adjusts -> Step adjusts).
     */
    propagateLayoutUp(
      startParentId: string,
      opts?: {
        excludeId?: string;
        omitFromComputation?: string;
        includeNode?: FlowNode;
      },
    ): void {
      // Only forward omitFromComputation to ancestors — it's safe because
      // the node won't be in ancestor children lists (filters by parentId).
      // Do NOT forward includeNode — it only belongs in the direct target
      // parent. At ancestor levels, the updated child dimensions already
      // reflect the included node, so ancestors just need a plain re-compute.
      const ancestorOpts = opts?.omitFromComputation
        ? { omitFromComputation: opts.omitFromComputation }
        : undefined;

      let walkId: string | undefined = (ctx.nodes as FlowNode[]).find(
        (n: FlowNode) => n.id === startParentId,
      )?.parentId;
      while (walkId) {
        const ancestor = ctx._nodeMap.get(walkId);
        if (!ancestor?.childLayout) break;
        this.layoutChildren(walkId, { ...ancestorOpts, shallow: true });
        walkId = ancestor.parentId;
      }
    },

    /**
     * Reorder a child within its layout parent.
     *
     * Reassigns order values for all siblings, then runs layoutChildren
     * and emits a `child-reorder` event.
     */
    reorderChild(nodeId: string, newOrder: number): void {
      const node = ctx._nodeMap.get(nodeId);
      if (!node?.parentId) return;
      const parent = ctx._nodeMap.get(node.parentId);
      if (!parent?.childLayout) return;

      ctx._captureHistory();

      const siblings = ctx.nodes
        .filter((n: FlowNode) => n.parentId === node.parentId)
        .sort((a: FlowNode, b: FlowNode) => (a.order ?? Infinity) - (b.order ?? Infinity));

      const filtered = siblings.filter((s: FlowNode) => s.id !== nodeId);
      const insertIdx = Math.max(0, Math.min(newOrder, filtered.length));
      filtered.splice(insertIdx, 0, node);

      for (let i = 0; i < filtered.length; i++) {
        filtered[i].order = i;
      }

      this.layoutChildren(node.parentId);
      ctx._emit('child-reorder', { nodeId, parentId: node.parentId, order: insertIdx });
    },

    // ── Layout engines ─────────────────────────────────────────────────────

    /**
     * Apply Dagre (directed acyclic graph) layout.
     *
     * Requires the dagre addon to be registered via `Alpine.plugin(AlpineFlowDagre)`.
     *
     * Nodes with `parentId` are excluded by default — their positions are managed
     * by `childLayout`, not top-level auto-layout. Pass `{ includeChildren: true }`
     * to include them.
     */
    layout(options?: {
      direction?: 'TB' | 'LR' | 'BT' | 'RL';
      nodesep?: number;
      ranksep?: number;
      adjustHandles?: boolean;
      fitView?: boolean;
      duration?: number;
      includeChildren?: boolean;
    }): void {
      const computeDagreLayout = getAddon<typeof import('../../core/layout/dagre').computeDagreLayout>('layout:dagre');
      if (!computeDagreLayout) {
        throw new Error('layout() requires the dagre plugin. Register it with: Alpine.plugin(AlpineFlowDagre)');
      }
      const direction = options?.direction ?? 'TB';
      const layoutNodes = options?.includeChildren
        ? ctx.nodes
        : ctx.nodes.filter((n: FlowNode) => !n.parentId);
      const positions = computeDagreLayout(layoutNodes, ctx.edges, {
        direction,
        nodesep: options?.nodesep,
        ranksep: options?.ranksep,
      });

      this._applyLayout(positions, {
        adjustHandles: options?.adjustHandles,
        handleDirection: direction,
        fitView: options?.fitView,
        duration: options?.duration,
      });

      debug('layout', 'Applied dagre layout', { direction });
      ctx._emit('layout', { type: 'dagre', direction });
    },

    /**
     * Apply force-directed layout.
     *
     * Requires the force addon to be registered via `Alpine.plugin(AlpineFlowForce)`.
     *
     * Nodes with `parentId` are excluded by default — their positions are managed
     * by `childLayout`, not top-level auto-layout. Pass `{ includeChildren: true }`
     * to include them.
     */
    forceLayout(options?: {
      strength?: number;
      distance?: number;
      charge?: number;
      iterations?: number;
      center?: { x: number; y: number };
      fitView?: boolean;
      duration?: number;
      includeChildren?: boolean;
    }): void {
      const computeForceLayout = getAddon<typeof import('../../core/layout/force').computeForceLayout>('layout:force');
      if (!computeForceLayout) {
        throw new Error('forceLayout() requires the force plugin. Register it with: Alpine.plugin(AlpineFlowForce)');
      }
      const layoutNodes = options?.includeChildren
        ? ctx.nodes
        : ctx.nodes.filter((n: FlowNode) => !n.parentId);
      const positions = computeForceLayout(layoutNodes, ctx.edges, {
        strength: options?.strength,
        distance: options?.distance,
        charge: options?.charge,
        iterations: options?.iterations,
        center: options?.center,
      });

      this._applyLayout(positions, {
        fitView: options?.fitView,
        duration: options?.duration,
      });

      debug('layout', 'Applied force layout', { charge: options?.charge ?? -300, distance: options?.distance ?? 150 });
      ctx._emit('layout', { type: 'force', charge: options?.charge ?? -300, distance: options?.distance ?? 150 });
    },

    /**
     * Apply hierarchy/tree layout.
     *
     * Requires the hierarchy addon to be registered via `Alpine.plugin(AlpineFlowHierarchy)`.
     *
     * Nodes with `parentId` are excluded by default — their positions are managed
     * by `childLayout`, not top-level auto-layout. Pass `{ includeChildren: true }`
     * to include them.
     */
    treeLayout(options?: {
      layoutType?: HierarchyLayoutType;
      direction?: HierarchyDirection;
      nodeWidth?: number;
      nodeHeight?: number;
      adjustHandles?: boolean;
      fitView?: boolean;
      duration?: number;
      includeChildren?: boolean;
    }): void {
      const computeHierarchyLayout = getAddon<typeof import('../../core/layout/hierarchy').computeHierarchyLayout>('layout:hierarchy');
      if (!computeHierarchyLayout) {
        throw new Error('treeLayout() requires the hierarchy plugin. Register it with: Alpine.plugin(AlpineFlowHierarchy)');
      }
      const direction = options?.direction ?? 'TB';
      const layoutNodes = options?.includeChildren
        ? ctx.nodes
        : ctx.nodes.filter((n: FlowNode) => !n.parentId);
      const positions = computeHierarchyLayout(layoutNodes, ctx.edges, {
        layoutType: options?.layoutType,
        direction,
        nodeWidth: options?.nodeWidth,
        nodeHeight: options?.nodeHeight,
      });

      this._applyLayout(positions, {
        adjustHandles: options?.adjustHandles,
        handleDirection: direction,
        fitView: options?.fitView,
        duration: options?.duration,
      });

      debug('layout', 'Applied tree layout', { layoutType: options?.layoutType ?? 'tree', direction });
      ctx._emit('layout', { type: 'tree', layoutType: options?.layoutType ?? 'tree', direction });
    },

    /**
     * Apply ELK (Eclipse Layout Kernel) layout.
     *
     * Requires the elk addon to be registered via `Alpine.plugin(AlpineFlowElk)`.
     * Note: elkLayout is async because ELK's layout() returns a Promise.
     *
     * Nodes with `parentId` are excluded by default — their positions are managed
     * by `childLayout`, not top-level auto-layout. Pass `{ includeChildren: true }`
     * to include them.
     */
    async elkLayout(options?: {
      algorithm?: ElkAlgorithm;
      direction?: ElkDirection;
      nodeSpacing?: number;
      layerSpacing?: number;
      adjustHandles?: boolean;
      fitView?: boolean;
      duration?: number;
      includeChildren?: boolean;
    }): Promise<void> {
      const computeElkLayout = getAddon<typeof import('../../core/layout/elk').computeElkLayout>('layout:elk');
      if (!computeElkLayout) {
        throw new Error('elkLayout() requires the elk plugin. Register it with: Alpine.plugin(AlpineFlowElk)');
      }
      const direction = options?.direction ?? 'DOWN';
      const layoutNodes = options?.includeChildren
        ? ctx.nodes
        : ctx.nodes.filter((n: FlowNode) => !n.parentId);
      const positions = await computeElkLayout(layoutNodes, ctx.edges, {
        algorithm: options?.algorithm,
        direction,
        nodeSpacing: options?.nodeSpacing,
        layerSpacing: options?.layerSpacing,
      });

      if (positions.size === 0) {
        debug('layout', 'ELK layout returned no positions — skipping apply');
        return;
      }

      this._applyLayout(positions, {
        adjustHandles: options?.adjustHandles,
        handleDirection: direction,
        fitView: options?.fitView,
        duration: options?.duration,
      });

      debug('layout', 'Applied ELK layout', { algorithm: options?.algorithm ?? 'layered', direction });
      ctx._emit('layout', { type: 'elk', algorithm: options?.algorithm ?? 'layered', direction });
    },
  };
}
