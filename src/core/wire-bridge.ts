/**
 * Wire Bridge — Livewire <-> AlpineFlow integration.
 *
 * Dynamically imported by flowCanvas when $wire is detected.
 * Maps AlpineFlow events to $wire method calls (client->server)
 * and Livewire dispatches to canvas methods (server->client).
 */

/**
 * Maps event names to functions that extract positional arguments
 * from the event detail object. These args are spread into $wire.method(...args).
 */
export const WIRE_PAYLOAD_MAP: Record<string, (d: any) => any[]> = {
  'connect':              (d) => [d.connection?.source ?? d.source, d.connection?.target ?? d.target, d.connection?.sourceHandle ?? d.sourceHandle, d.connection?.targetHandle ?? d.targetHandle],
  'connect-start':        (d) => [d.source, d.sourceHandle],
  'connect-end':          (d) => [d.connection, d.source, d.sourceHandle, d.position],
  'node-click':           (d) => [d.node.id, d.node],
  'node-drag-start':      (d) => [d.node.id],
  'node-drag-end':        (d) => [d.node.id, d.position],
  'node-resize-start':    (d) => [d.node.id, d.dimensions],
  'node-resize-end':      (d) => [d.node.id, d.dimensions],
  'node-collapse':        (d) => [d.node.id, d.descendants],
  'node-expand':          (d) => [d.node.id, d.descendants],
  'node-reparent':        (d) => [d.node.id, d.oldParentId, d.newParentId],
  'node-context-menu':    (d) => [d.node.id, { x: d.event.clientX, y: d.event.clientY }],
  'nodes-change':         (d) => [d],
  'edge-click':           (d) => [d.edge.id],
  'edge-context-menu':    (d) => [d.edge.id, { x: d.event.clientX, y: d.event.clientY }],
  'edges-change':         (d) => [d],
  'reconnect-start':      (d) => [d.edge.id, d.handleType],
  'reconnect':            (d) => [d.oldEdge.id, d.newConnection],
  'reconnect-end':        (d) => [d.edge.id, d.successful],
  'pane-click':           (d) => [d.position],
  'pane-context-menu':    (d) => [d.position],
  'viewport-change':      (d) => [d.viewport],
  'selection-change':     (d) => [d.nodes, d.edges],
  'selection-context-menu': (d) => [d.nodes, d.edges, { x: d.event.clientX, y: d.event.clientY }],
  'drop':                 (d) => [d.data, d.position],
  'init':                 ()  => [],
  'row-select':           (d) => [d.rowId, d.nodeId, d.attrId],
  'row-deselect':         (d) => [d.rowId, d.nodeId, d.attrId],
  'row-selection-change': (d) => [d.selectedRows],
};

/**
 * Maps Livewire dispatch event names to flowCanvas method names.
 * All commands are auto-registered when $wire is detected.
 */
export const WIRE_COMMAND_MAP: Record<string, string> = {
  'flow:addNodes':     'addNodes',
  'flow:removeNodes':  'removeNodes',
  'flow:addEdges':     'addEdges',
  'flow:removeEdges':  'removeEdges',
  'flow:update':       'update',
  'flow:animate':      'animate',
  // Particle emission — all five firing methods
  'flow:sendParticle':          'sendParticle',
  'flow:sendParticleAlongPath': 'sendParticleAlongPath',
  'flow:sendParticleBetween':   'sendParticleBetween',
  'flow:sendParticleBurst':     'sendParticleBurst',
  'flow:sendConverging':        'sendConverging',
  // Tag-filtered bulk animation control (v0.2.0-alpha)
  'flow:cancelAll':  'cancelAll',
  'flow:pauseAll':   'pauseAll',
  'flow:resumeAll':  'resumeAll',
  // Viewport
  'flow:fitView':      'fitView',
  'flow:zoomIn':       'zoomIn',
  'flow:zoomOut':      'zoomOut',
  'flow:setCenter':    'setCenter',
  'flow:setViewport':  'setViewport',
  'flow:follow':       'follow',
  'flow:unfollow':     'unfollow',
  'flow:undo':         'undo',
  'flow:redo':         'redo',
  'flow:layout':       'layout',
  'flow:fromObject':        'fromObject',
  'flow:setLoading':        'setLoading',
  'flow:clear':             '$clear',
  'flow:toggleInteractive': 'toggleInteractive',
  'flow:panBy':             'panBy',
  'flow:fitBounds':         'fitBounds',
  'flow:patchConfig':       'patchConfig',
  'flow:deselectAll':       'deselectAll',
  'flow:collapseNode':      'collapseNode',
  'flow:expandNode':        'expandNode',
  'flow:toggleNode':        'toggleNode',
};

/**
 * Parameter extraction for commands that need special handling.
 * Maps Livewire dispatch params (named args object) to positional args for canvas methods.
 */
const WIRE_COMMAND_ARGS: Record<string, (params: any) => any[]> = {
  'flow:addNodes':     (p) => [p.nodes],
  'flow:removeNodes':  (p) => [p.ids],
  'flow:addEdges':     (p) => [p.edges],
  'flow:removeEdges':  (p) => [p.ids],
  'flow:update':       (p) => [p.targets, p.options ?? {}],
  'flow:animate':      (p) => [p.targets, p.options ?? {}],
  // Particle emission — all five firing methods
  'flow:sendParticle':          (p) => [p.edgeId, p.options ?? {}],
  'flow:sendParticleAlongPath': (p) => [p.path, p.options ?? {}],
  'flow:sendParticleBetween':   (p) => [p.source, p.target, p.options ?? {}],
  'flow:sendParticleBurst':     (p) => [p.edgeId, p.options ?? {}],
  'flow:sendConverging':        (p) => [p.sources, p.options ?? {}],
  // Tag-filtered bulk animation control
  'flow:cancelAll':  (p) => [p.filter ?? {}, p.options ?? {}],
  'flow:pauseAll':   (p) => [p.filter ?? {}],
  'flow:resumeAll':  (p) => [p.filter ?? {}],
  // Viewport
  'flow:fitView':      ()  => [],
  'flow:zoomIn':       ()  => [],
  'flow:zoomOut':      ()  => [],
  'flow:setCenter':    (p) => [p.x, p.y, p.zoom],
  'flow:setViewport':  (p) => [p.viewport],
  'flow:follow':       (p) => [p.nodeId, p.options ?? {}],
  'flow:unfollow':     ()  => [],
  'flow:undo':         ()  => [],
  'flow:redo':         ()  => [],
  'flow:layout':       (p) => [p.options ?? {}],
  'flow:fromObject':        (p) => [p.data],
  'flow:setLoading':        (p) => [p.loading],
  'flow:clear':             () => [],
  'flow:toggleInteractive': () => [],
  'flow:panBy':             (p) => [p.dx, p.dy],
  'flow:fitBounds':         (p) => [p.rect, p.options],
  'flow:patchConfig':       (p) => [p.changes],
  'flow:deselectAll':       () => [],
  'flow:collapseNode':      (p) => [p.id],
  'flow:expandNode':        (p) => [p.id],
  'flow:toggleNode':        (p) => [p.id],
};

// ── Highlight presets ────────────────────────────────────────────────────────

const HIGHLIGHT_PRESETS: Record<string, { borderColor: string; shadow: string }> = {
  success: { borderColor: '#22c55e', shadow: '0 0 0 2px rgba(34,197,94,0.3)' },
  error:   { borderColor: '#ef4444', shadow: '0 0 0 2px rgba(239,68,68,0.3)' },
  warning: { borderColor: '#f59e0b', shadow: '0 0 0 2px rgba(245,158,11,0.3)' },
  info:    { borderColor: '#3b82f6', shadow: '0 0 0 2px rgba(59,130,246,0.3)' },
};

// ── Custom command handlers (composite operations) ──────────────────────────

/**
 * Register convenience commands that compose multiple canvas operations.
 * Returns a cleanup function.
 */
export function registerCustomWireCommands(canvas: any, $wire: any): () => void {
  const cleanups: (Function | undefined)[] = [];

  // flow:moveNode — move a single node with optional animation
  cleanups.push($wire.on('flow:moveNode', (p: any) => {
    const duration = p.duration ?? 0;
    canvas.update(
      { nodes: { [p.id]: { position: { x: p.x, y: p.y } } } },
      { duration },
    );
  }));

  // flow:updateNode — update arbitrary node properties
  cleanups.push($wire.on('flow:updateNode', (p: any) => {
    const duration = p.duration ?? 0;
    canvas.update(
      { nodes: { [p.id]: p.changes } },
      { duration },
    );
  }));

  // flow:focusNode — pan/zoom to center on a single node
  cleanups.push($wire.on('flow:focusNode', (p: any) => {
    const node = canvas.getNode(p.id);
    if (!node) return;
    const w = node.dimensions?.width ?? 150;
    const h = node.dimensions?.height ?? 40;
    const pos = node.parentId ? canvas.getAbsolutePosition(p.id) : node.position;
    canvas.fitBounds(
      { x: pos.x, y: pos.y, width: w, height: h },
      { padding: p.padding ?? 0.5, duration: p.duration ?? 300 },
    );
  }));

  // flow:connect — create edge between two nodes with optional draw animation
  cleanups.push($wire.on('flow:connect', (p: any) => {
    const edgeId = p.edgeId ?? `e-${p.source}-${p.target}`;
    const edge = { id: edgeId, source: p.source, target: p.target, ...(p.options ?? {}) };
    if (p.duration && p.duration > 0) {
      canvas.timeline()
        .step({ addEdges: [edge], edgeTransition: 'draw', duration: p.duration })
        .play();
    } else {
      canvas.addEdges(edge);
    }
  }));

  // flow:disconnect — remove edge(s) between two nodes with optional fade
  cleanups.push($wire.on('flow:disconnect', (p: any) => {
    const edgeIds = canvas.edges
      .filter((e: any) => e.source === p.source && e.target === p.target)
      .map((e: any) => e.id);
    if (edgeIds.length === 0) return;
    if (p.duration && p.duration > 0) {
      canvas.timeline()
        .step({ removeEdges: edgeIds, edgeTransition: 'fade', duration: p.duration })
        .play();
    } else {
      canvas.removeEdges(edgeIds);
    }
  }));

  // flow:highlightNode — flash a preset style then revert
  cleanups.push($wire.on('flow:highlightNode', (p: any) => {
    const node = canvas.getNode(p.id);
    if (!node) return;
    const preset = HIGHLIGHT_PRESETS[p.style] ?? HIGHLIGHT_PRESETS.info;
    const duration = p.duration ?? 1500;
    const holdTime = Math.floor(duration * 0.6);
    const fadeTime = Math.floor(duration * 0.4);

    const originalBorder = node.style?.borderColor ?? null;
    const originalShadow = node.style?.boxShadow ?? null;

    // Apply highlight
    canvas.update({
      nodes: { [p.id]: { style: `border-color: ${preset.borderColor}; box-shadow: ${preset.shadow}` } },
    }, { duration: 100 });

    // Revert after hold
    setTimeout(() => {
      const revertStyle = originalBorder
        ? `border-color: ${originalBorder}; box-shadow: ${originalShadow ?? 'none'}`
        : '';
      canvas.update({
        nodes: { [p.id]: { style: revertStyle } },
      }, { duration: fadeTime });
    }, 100 + holdTime);
  }));

  // flow:highlightPath — fire particles along edges connecting a sequence of nodes.
  // All particle options pass through transparently so beam gradients,
  // followThrough, custom renderers, etc. all work from Livewire.
  cleanups.push($wire.on('flow:highlightPath', (p: any) => {
    const nodeIds: string[] = p.nodeIds;
    const options = p.options ?? {};
    const { delay: rawDelay, ...particleOptions } = options;
    const delay = rawDelay ?? 200;
    // Apply sensible defaults without clobbering user-provided values.
    const resolved = {
      color: '#3b82f6',
      size: 5,
      duration: '800ms',
      ...particleOptions,
    };

    for (let i = 0; i < nodeIds.length - 1; i++) {
      const source = nodeIds[i];
      const target = nodeIds[i + 1];
      const edge = canvas.edges.find((e: any) => e.source === source && e.target === target);
      if (edge) {
        setTimeout(() => {
          canvas.sendParticle(edge.id, resolved);
        }, i * delay);
      }
    }
  }));

  // flow:lockNode / flow:unlockNode — set locked state (freezes all interactions)
  cleanups.push($wire.on('flow:lockNode', (p: any) => {
    const node = canvas.getNode(p.id);
    if (node) node.locked = true;
  }));
  cleanups.push($wire.on('flow:unlockNode', (p: any) => {
    const node = canvas.getNode(p.id);
    if (node) node.locked = false;
  }));

  // flow:hideNode / flow:showNode — set hidden state
  cleanups.push($wire.on('flow:hideNode', (p: any) => {
    const node = canvas.getNode(p.id);
    if (node) node.hidden = true;
  }));
  cleanups.push($wire.on('flow:showNode', (p: any) => {
    const node = canvas.getNode(p.id);
    if (node) node.hidden = false;
  }));

  // flow:selectNodes — select specific nodes
  cleanups.push($wire.on('flow:selectNodes', (p: any) => {
    canvas.deselectAll();
    for (const id of p.ids) {
      canvas.selectedNodes.add(id);
      const node = canvas.getNode(id);
      if (node) node.selected = true;
    }
  }));

  // flow:selectEdges — select specific edges
  cleanups.push($wire.on('flow:selectEdges', (p: any) => {
    canvas.deselectAll();
    for (const id of p.ids) {
      canvas.selectedEdges.add(id);
      const edge = canvas.getEdge(id);
      if (edge) edge.selected = true;
    }
  }));

  return () => {
    for (const cleanup of cleanups) {
      if (typeof cleanup === 'function') cleanup();
    }
  };
}

/**
 * Convert kebab-case event name to PascalCase config callback name.
 * 'node-drag-end' -> 'onNodeDragEnd'
 */
function toCallbackName(event: string): string {
  return 'on' + event.split('-').map(
    (s: string) => s.charAt(0).toUpperCase() + s.slice(1),
  ).join('');
}

/**
 * Register config callbacks that bridge AlpineFlow events to $wire method calls.
 * Modifies the config object in-place, adding onXxx callbacks.
 *
 * @param config - The flowCanvas config object (mutated)
 * @param $wire - Livewire's $wire proxy
 * @param wireEvents - Map of event names to Livewire method names
 */
export function registerWireEvents(
  config: any,
  $wire: any,
  wireEvents: Record<string, string>,
): void {
  for (const [event, method] of Object.entries(wireEvents)) {
    const callbackName = toCallbackName(event);
    const existingCallback = config[callbackName];

    config[callbackName] = (detail: any) => {
      // Call existing callback first if present, preserve return value
      let result: any;
      if (typeof existingCallback === 'function') {
        result = existingCallback(detail);
      }

      // Extract args using payload map, or fall back to full detail
      const extractor = WIRE_PAYLOAD_MAP[event];
      const args = extractor ? extractor(detail) : [detail];

      // Call the Livewire method
      const wireFn = $wire[method];
      if (typeof wireFn === 'function') {
        wireFn.call($wire, ...args);
      }

      return result;
    };
  }
}

/**
 * Register $wire.on() listeners for all server->client commands.
 * Returns a cleanup function that deregisters all listeners.
 */
export function registerWireCommands(canvas: any, $wire: any): () => void {
  const cleanups: (Function | undefined)[] = [];

  for (const [dispatch, method] of Object.entries(WIRE_COMMAND_MAP)) {
    const cleanup = $wire.on(dispatch, (params: any) => {
      const fn = canvas[method];
      if (typeof fn !== 'function') return;

      const argsExtractor = WIRE_COMMAND_ARGS[dispatch];
      const args = argsExtractor ? argsExtractor(params) : Object.values(params);
      fn.call(canvas, ...args);
    });
    cleanups.push(cleanup);
  }

  return () => {
    for (const cleanup of cleanups) {
      if (typeof cleanup === 'function') cleanup();
    }
  };
}
