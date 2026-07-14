// ============================================================================
// x-flow-schema Directive
//
// Renders a schema node: header + one row per field + per-row labelled handles.
// Reads `node.data.label` and `node.data.fields` from the bound scope.
//
// Usage:
//   <div x-flow-node="node" x-flow-schema></div>
//
// The directive fully owns the element's children. Users who want custom
// rendering should skip this directive and write x-for + handles manually.
// ============================================================================

import type { Alpine } from 'alpinejs';
import type { FlowSchemaField, SchemaMetrics } from '../../core/types';

type SchemaData = { label?: string; fields?: FlowSchemaField[]; [k: string]: unknown };
type NodeRef = { data?: SchemaData } | undefined | null;

/**
 * Remove every child from an element without using innerHTML.
 * Matches the XSS-safe clear pattern the security hook prefers.
 */
function clearChildren(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

export function registerFlowSchemaDirective(Alpine: Alpine) {
  Alpine.directive('flow-schema', (el, _spec, { evaluate, effect, cleanup }) => {
    const host = el as HTMLElement;

    const readNode = (): NodeRef => {
      try {
        // Alpine re-throws expression errors asynchronously, so this catch
        // can't stop a missing/torn-down `node` scope from surfacing as an
        // uncaught "node is not defined" — guard the reference itself. See #21.
        return (evaluate("typeof node !== 'undefined' ? node : null") as NodeRef) ?? null;
      } catch {
        return null;
      }
    };

    /**
     * Resolve whether this canvas has opted into drag-to-reorder on rows.
     * Read once per directive bind — the flag is not expected to change
     * between mounts. Walks to the closest `.flow-container` and reads
     * `canvas._config.rowsReorderable`.
     */
    const readRowsReorderable = (): boolean => {
      try {
        const canvasEl = host.closest('.flow-container') as HTMLElement | null;
        if (!canvasEl) return false;
        const canvas = (Alpine as any).$data?.(canvasEl);
        return !!canvas?._config?.rowsReorderable;
      } catch {
        return false;
      }
    };

    /**
     * Resolve whether this canvas has opted into keyboard field navigation
     * on rows. Reuses the existing `keyboardConnect` flag — consumers who
     * opt into keyboard-driven connect almost always also want keyboard row
     * focus, so we bundle the two.
     */
    const readKeyboardNav = (): boolean => {
      try {
        const canvasEl = host.closest('.flow-container') as HTMLElement | null;
        if (!canvasEl) return false;
        const canvas = (Alpine as any).$data?.(canvasEl);
        return !!canvas?._config?.keyboardConnect;
      } catch {
        return false;
      }
    };

    /**
     * Resolve the owning canvas Alpine scope (or null). Same `.flow-container`
     * walk as `readRowsReorderable` / `readKeyboardNav`.
     */
    const readCanvas = (): any | null => {
      try {
        const canvasEl = host.closest('.flow-container') as HTMLElement | null;
        if (!canvasEl) return null;
        return (Alpine as any).$data?.(canvasEl) ?? null;
      } catch {
        return null;
      }
    };

    /**
     * Measure header/row/handle geometry once per canvas, from the first
     * schema node that successfully renders **≥2 rows**. Two rows is the
     * minimum because `rowHeight` is a row STRIDE — the gap between two
     * consecutive row TOPS — and a single row gives nothing to stride
     * against: the theme drops `border-bottom` on `.flow-schema-row:last-child`,
     * so a lone row is one border SHORTER than a normal row and would be
     * mistaken for the stride, modelling every multi-row node on the canvas
     * one border too short per row. See the guard below.
     *
     * Schema rows are otherwise uniform, so a single measurement covers every
     * schema node on the canvas — later edge-geometry work reads this cache
     * instead of measuring handle DOM per edge. (Task G1 — state-derived
     * schema handle geometry.)
     *
     * `_schemaMetrics` is a plain, non-reactive field, but `canvas` here is
     * `Alpine.$data(el)` — Alpine's merge-scope proxy — and `Alpine.raw()`
     * does NOT unwrap that proxy; it returns the same proxy back (see
     * flow-canvas.ts:515-517 and flow-edge.ts:1134-1136). A property GET
     * through `Alpine.raw(canvas)` still forwards to the underlying reactive
     * object and calls Vue's `track()` when read inside an active effect, and
     * a SET still calls `trigger()`. Safety here does NOT come from
     * `Alpine.raw()` — it comes from calling this function OUTSIDE the
     * directive's `effect()`, via `Alpine.nextTick`, so `activeEffect` is
     * unset by the time the guard read, the `viewport.zoom` read, and the
     * `_schemaMetrics` write happen; none of them track or retrigger any
     * mounted schema node's render effect. The deliberate consequence: the
     * cache lands one tick after the first schema render, not synchronously
     * within it — edge code (a later task) falls back to the DOM path until
     * it lands, then upgrades.
     */
    const measureSchemaMetrics = (): void => {
      Alpine.nextTick(() => {
        const canvas = readCanvas();
        if (!canvas) return;
        const raw = Alpine.raw(canvas);
        if (raw._schemaMetrics != null) return;

        const headerEl = host.querySelector<HTMLElement>(':scope > .flow-schema-header');
        const schemaBodyEl = host.querySelector<HTMLElement>(':scope > .flow-schema-body');
        const rows = host.querySelectorAll<HTMLElement>('.flow-schema-row');

        // Measure from a node with ≥2 rows. The stride (`rowHeight`) is the gap between
        // two consecutive row TOPS, and `rowHeightLast` only means anything next to it —
        // the theme's `.flow-schema-row:last-child` rule drops the row's border-bottom, so
        // a SINGLE-row node has nothing to compare against and would report the shortened
        // height as the stride, modelling every multi-row node on the canvas one border too
        // short PER ROW. Skipping is free: this runs from every schema node's render, so the
        // next node with ≥2 rows lands the cache. If NO schema node has 2 rows, metrics
        // never land and edges keep using the DOM path — correct, and there was nothing to
        // save at one row a node anyway.
        if (rows.length < 2) return;

        const rowEl = rows[0];
        const secondRowEl = rows[1];
        const lastRowEl = rows[rows.length - 1];
        const handleEl = rowEl.querySelector<HTMLElement>('.flow-schema-handle');
        const lastHandleEl = lastRowEl.querySelector<HTMLElement>('.flow-schema-handle');
        if (!headerEl || !schemaBodyEl || !handleEl || !lastHandleEl) return;

        // Insets are consumed against the NODE's border box — edge code adds them
        // to `node.position` / `node.dimensions`, which describe the `.flow-node`
        // element. Anchor them there, not on `host`: under WireFlow's slot markup
        // (`<div class="flow-node"><div x-flow-schema class="flow-schema-node">`)
        // the two are different elements and `host` sits one border-width inside
        // the node, which would shift every state-derived endpoint by that border.
        // In directive markup (`x-flow-node` + `x-flow-schema` on one element)
        // `closest` returns `host` itself and nothing changes.
        const nodeEl = (host.closest('[data-flow-node-id]') as HTMLElement | null) ?? host;

        const zoom = raw.viewport?.zoom || 1;
        const nodeRect = nodeEl.getBoundingClientRect();
        const headerRect = headerEl.getBoundingClientRect();
        const bodyRect = schemaBodyEl.getBoundingClientRect();
        const rowRect = rowEl.getBoundingClientRect();
        const secondRowRect = secondRowEl.getBoundingClientRect();
        const lastRowRect = lastRowEl.getBoundingClientRect();
        const handleRect = handleEl.getBoundingClientRect();
        const lastHandleRect = lastHandleEl.getBoundingClientRect();

        // The STRIDE between rows, not row 0's height — see SchemaMetrics.rowHeight.
        const rowHeight = (secondRowRect.top - rowRect.top) / zoom;
        const rowHeightLast = lastRowRect.height / zoom;
        // A zero stride/height means layout hasn't happened (or jsdom) — caching
        // zeros here would poison every later edge's endpoint geometry.
        if (rowHeight <= 0 || rowHeightLast <= 0) return;

        const metrics: SchemaMetrics = {
          headerHeight: headerRect.height / zoom,
          rowHeight,
          // NOT the same as `rowHeight` under the shipped theme — the last row loses
          // its border-bottom. See SchemaMetrics.rowHeightLast.
          rowHeightLast,
          // Where the handle actually sits inside its row. MEASURED, not `rowHeight / 2`:
          // `top: 50%` resolves against the row's PADDING box, which the theme's
          // border-bottom shrinks. See SchemaMetrics.handleOffsetY.
          handleOffsetY: (handleRect.top + handleRect.height / 2 - rowRect.top) / zoom,
          handleOffsetYLast:
            (lastHandleRect.top + lastHandleRect.height / 2 - lastRowRect.top) / zoom,
          insetLeft: (rowRect.left - nodeRect.left) / zoom,
          insetRight: (nodeRect.right - rowRect.right) / zoom,
          insetTop: (headerRect.top - nodeRect.top) / zoom,
          // Closes the row model: with insetBottom, a consumer can reconstruct the
          // node's expected border-box height and so DETECT non-uniform rows (a
          // wrapped field name — nothing in the CSS forces `white-space: nowrap`)
          // instead of assuming uniformity. See `flow-edge.ts`'s eligibility check.
          insetBottom: (nodeRect.bottom - bodyRect.bottom) / zoom,
          handleWidth: handleRect.width / zoom,
          handleHeight: handleRect.height / zoom,
        };
        raw._schemaMetrics = metrics;
      });
    };

    host.classList.add('flow-schema-node');

    // Mark the NODE element as schema-rendered, so edge code can tell a node whose
    // rows THIS directive laid out (uniform header + rows, the layout `SchemaMetrics`
    // describes) from a hand-rolled node that merely carries the same `data.fields`
    // shape and field-keyed handles — a pattern this file's own docblock invites, and
    // one whose row geometry is the consumer's business. State alone cannot tell them
    // apart, and getting it wrong renders the edge on the wrong row.
    //
    // The stamp goes on the NODE element, not on `host`: the two are the same element
    // under directive markup, but under WireFlow's slot markup `host` is a CHILD of
    // the node (the same insight behind the metrics-anchor `closest` above). Edge code
    // looks the element up via `canvas._nodeElements`, which registers node elements.
    //
    // Resolution order: try synchronously first. That covers WireFlow's slot markup,
    // where `host` is a CHILD of the node element and Alpine's parent-before-child tree
    // walk guarantees the ancestor's `data-flow-node-id` is already stamped by the time
    // this directive initializes. It also covers the common same-element case where
    // `x-flow-node` happens to run first.
    //
    // If synchronous resolution fails, we're in the SAME-ELEMENT case
    // (`<div x-flow-node x-flow-schema>`) with `x-flow-schema` initializing BEFORE
    // `x-flow-node`'s own init-time effect has written `data-flow-node-id` — an
    // attribute-declaration-order dependency, not a markup shape. Defer through
    // `Alpine.nextTick`, exactly like `measureSchemaMetrics` above: by the next tick
    // every directive on this element (including `x-flow-node`) has already run, so
    // attribute order can no longer hide the marker. `destroyed` guards a nextTick
    // callback that fires after `cleanup()` from leaving a stale marker behind.
    let schemaNodeEl = host.closest('[data-flow-node-id]') as HTMLElement | null;
    let destroyed = false;
    if (schemaNodeEl) {
      schemaNodeEl.setAttribute('data-flow-schema-node', '');
    } else {
      Alpine.nextTick(() => {
        if (destroyed || !host.isConnected) return;
        schemaNodeEl = host.closest('[data-flow-node-id]') as HTMLElement | null;
        schemaNodeEl?.setAttribute('data-flow-schema-node', '');
      });
    }

    // Persistent scaffold + keyed row registry. Reused across renders so that a
    // single tracked change reconciles rows in place instead of tearing down and
    // re-initializing every row (one rename keystroke used to destroy + re-stamp
    // ~180 elements per node).
    let headerEl: HTMLElement | null = null;
    let bodyEl: HTMLElement | null = null;
    const rowByName = new Map<string, HTMLElement>();

    const ensureScaffold = (): void => {
      if (headerEl && bodyEl) return;
      clearChildren(host);
      rowByName.clear();
      headerEl = document.createElement('div');
      headerEl.className = 'flow-schema-header';
      host.appendChild(headerEl);
      bodyEl = document.createElement('div');
      bodyEl.className = 'flow-schema-body';
      host.appendChild(bodyEl);
    };

    const render = (): void => {
      const node = readNode() as (NodeRef & { id?: unknown }) | null;
      const data = node?.data;
      if (!data) {
        // Tear the rows down explicitly. Only individual rows carry Alpine's
        // init marker (initTree is per-row), so removing the unmarked bodyEl
        // would NOT cascade Alpine's auto-cleanup to them — the row scopes would
        // leak, still subscribed to reactive state.
        for (const row of rowByName.values()) {
          Alpine.destroyTree(row);
        }
        rowByName.clear();
        clearChildren(host);
        headerEl = null;
        bodyEl = null;
        return;
      }

      ensureScaffold();

      const label = typeof data.label === 'string' ? data.label : '';
      const fields = Array.isArray(data.fields) ? data.fields : [];
      const nodeId = typeof node?.id === 'string' ? node.id : '';

      if (typeof data.kind === 'string' && data.kind) {
        host.setAttribute('data-flow-schema-kind', data.kind);
      } else {
        host.removeAttribute('data-flow-schema-kind');
      }

      if (headerEl!.textContent !== label) headerEl!.textContent = label;

      const rowsReorderable = readRowsReorderable();
      const keyboardNav = readKeyboardNav();

      // ── Reconcile rows keyed by field.name ──
      // 1. Create missing rows / update surviving rows in place.
      const seen = new Set<string>();
      for (const field of fields) {
        seen.add(field.name);
        const existing = rowByName.get(field.name);
        if (existing) {
          updateRow(existing, field);
        } else {
          const row = renderRow(field, nodeId, rowsReorderable, keyboardNav);
          rowByName.set(field.name, row);
          bodyEl!.appendChild(row);
          // Activate x-flow-handle + x-flow-row-select on this one new row.
          Alpine.initTree(row);
        }
      }
      // 2. Destroy rows whose fields are gone.
      for (const [name, row] of rowByName) {
        if (!seen.has(name)) {
          Alpine.destroyTree(row);
          row.remove();
          rowByName.delete(name);
        }
      }
      // 3. Order rows to match `fields`, moving only those out of position
      //    (a straight append-all would churn every row's DOM position each
      //    render; moving a node preserves its listeners and Alpine state).
      let cursor: ChildNode | null = bodyEl!.firstChild;
      for (const field of fields) {
        const row = rowByName.get(field.name);
        if (!row) continue;
        if (cursor === row) {
          cursor = cursor.nextSibling;
        } else {
          bodyEl!.insertBefore(row, cursor);
        }
      }

      measureSchemaMetrics();
    };

    /**
     * Update the presentation of a surviving row in place — key/required
     * classes, the optional icon span, and the name/type text — WITHOUT
     * touching the row's handles. Handles are keyed by field.name (the row's
     * reconcile key), so a surviving row's handles are already correct.
     */
    const updateRow = (row: HTMLElement, field: FlowSchemaField): void => {
      if (row.dataset.flowSchemaField !== field.name) {
        row.dataset.flowSchemaField = field.name;
      }
      row.classList.toggle('flow-schema-row--pk', field.key === 'primary');
      row.classList.toggle('flow-schema-row--fk', field.key === 'foreign');
      row.classList.toggle('flow-schema-row--required', !!field.required);

      // Icon span: renderRow inserts it (between the target handle and the name)
      // only when field.icon is set — keep it in sync as icons come and go.
      let icon = row.querySelector<HTMLElement>('.flow-schema-row-icon');
      const nameEl = row.querySelector<HTMLElement>('.flow-schema-row-name');
      if (field.icon) {
        if (!icon) {
          icon = document.createElement('span');
          icon.className = 'flow-schema-row-icon';
          row.insertBefore(icon, nameEl);
        }
        if (icon.textContent !== field.icon) icon.textContent = field.icon;
      } else if (icon) {
        icon.remove();
      }

      if (nameEl && nameEl.textContent !== field.name) nameEl.textContent = field.name;
      const typeEl = row.querySelector<HTMLElement>('.flow-schema-row-type');
      if (typeEl && typeEl.textContent !== field.type) typeEl.textContent = field.type;
    };

    const renderRow = (
      field: FlowSchemaField,
      nodeId: string,
      rowsReorderable: boolean,
      keyboardNav: boolean,
    ): HTMLElement => {
      const row = document.createElement('div');
      row.className = 'flow-schema-row';
      row.dataset.flowSchemaField = field.name;
      if (field.key === 'primary') row.classList.add('flow-schema-row--pk');
      if (field.key === 'foreign') row.classList.add('flow-schema-row--fk');
      if (field.required) row.classList.add('flow-schema-row--required');

      // Row-select wiring. Stamps the x-flow-row-select directive with
      // the `nodeId.fieldName` convention the schema inspector scaffolding
      // expects. Without this, clicking a row would never populate
      // canvas.selectedRows and the row-scope inspector slot stays empty.
      if (nodeId) {
        row.setAttribute(
          'x-flow-row-select',
          JSON.stringify(`${nodeId}.${field.name}`),
        );
      }

      // Drag-to-reorder opt-in. When `canvas._config.rowsReorderable` is
      // truthy, stamp `x-schema-reorderable` on each row — the directive is
      // registered by the schema addon and activated via Alpine.initTree(body)
      // below.
      if (rowsReorderable) {
        row.setAttribute('x-schema-reorderable', '');
      }

      // Keyboard field navigation opt-in. When `canvas._config.keyboardConnect`
      // is truthy, stamp `x-schema-keyboard-nav` on each row so the directive
      // can attach tabindex/role/aria + key handlers. Directive is registered
      // by the schema addon; activation happens via Alpine.initTree(body)
      // below.
      if (keyboardNav && nodeId) {
        row.setAttribute(
          'x-schema-keyboard-nav',
          JSON.stringify(`${nodeId}.${field.name}`),
        );
      }

      // Target handle (left). We set the x-flow-handle directive attribute
      // so that after Alpine.initTree(host) runs below, the handle's
      // pointerdown → drag-to-connect pipeline activates on this element.
      // Without the directive, the div has the right classes + data-attrs
      // but no pointer handlers — clicks fall through to the node drag.
      const target = document.createElement('div');
      target.className = 'flow-schema-handle flow-schema-handle--target';
      target.setAttribute('x-flow-handle:target.left', JSON.stringify(field.name));
      row.appendChild(target);

      if (field.icon) {
        const icon = document.createElement('span');
        icon.className = 'flow-schema-row-icon';
        icon.textContent = field.icon;
        row.appendChild(icon);
      }

      const name = document.createElement('span');
      name.className = 'flow-schema-row-name';
      name.textContent = field.name;
      row.appendChild(name);

      const type = document.createElement('span');
      type.className = 'flow-schema-row-type';
      type.textContent = field.type;
      row.appendChild(type);

      // Source handle (right) — same directive pattern as target.
      const source = document.createElement('div');
      source.className = 'flow-schema-handle flow-schema-handle--source';
      source.setAttribute('x-flow-handle:source.right', JSON.stringify(field.name));
      row.appendChild(source);

      // Mirror handles — invisible, non-interactive copies of the real
      // target/source on the OPPOSITE side of the row. They share the same
      // (id, type) with their real counterparts so the edge-geometry picker
      // (see flow-edge.ts `pickClosestHandle`) can route an edge to whichever
      // side is physically closer to the other endpoint. CSS gives them
      // `visibility: hidden; pointer-events: none`, but they remain in the
      // layout so `getBoundingClientRect` returns a measurable position.
      const mirrorTarget = document.createElement('div');
      mirrorTarget.className =
        'flow-schema-handle flow-schema-handle--target flow-schema-handle--mirror';
      mirrorTarget.setAttribute('x-flow-handle:target.right', JSON.stringify(field.name));
      row.appendChild(mirrorTarget);

      const mirrorSource = document.createElement('div');
      mirrorSource.className =
        'flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror';
      mirrorSource.setAttribute('x-flow-handle:source.left', JSON.stringify(field.name));
      row.appendChild(mirrorSource);

      return row;
    };

    // Reactive: effect() fires on init and on any reactive read touched inside.
    effect(() => {
      // Skip detached elements: a Livewire morph (or teardown) can flush this
      // effect after the node element leaves the DOM, and evaluate('node') then
      // throws because the Alpine scope is gone. See issue #21.
      if (!host.isConnected) return;

      // Touch label + field properties so Alpine subscribes to mutations.
      const data = readNode()?.data;
      void data?.label;
      void data?.kind;
      const fields = data?.fields;
      if (Array.isArray(fields)) {
        for (const f of fields) {
          void f.name;
          void f.type;
          void f.key;
          void f.required;
          void f.icon;
        }
      }
      render();
    });

    cleanup(() => {
      destroyed = true;
      for (const row of rowByName.values()) {
        Alpine.destroyTree(row);
      }
      rowByName.clear();
      clearChildren(host);
      headerEl = null;
      bodyEl = null;
      host.classList.remove('flow-schema-node');
      schemaNodeEl?.removeAttribute('data-flow-schema-node');
    });
  });
}
