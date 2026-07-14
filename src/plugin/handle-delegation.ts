// ============================================================================
// Handle pointer-event delegation — STATE INVENTORY (F1)
//
// STATUS: inventory only. The delegated listener itself lands in F2; this file
// exists now so the characterization below is reviewed and committed BEFORE any
// behavior moves.
//
// WHY: every handle attaches its own `pointerdown` listener at directive init
// (`directives/flow-handle.ts` — source :1594, target :2089). A Draftsman-scale
// schema graph has ~5,000 handles, so that is ~5,000 listeners paid at mount and
// re-paid on every schema row re-stamp. One delegated `pointerdown` listener per
// canvas container can start the same pipeline for any handle, resolving the
// handle via `(e.target as HTMLElement).closest('[data-flow-handle-type]')`.
//
// SCOPE: pointerdown ONLY. `pointerenter` / `pointerleave` / `click` / `keydown`
// stay per-handle (workstream scope guard).
//
// ── The two handlers in scope ───────────────────────────────────────────────
//   1. `onPointerDown`        flow-handle.ts:926-1592, attached :1594
//                             (source branch — connect-drag / click-to-connect /
//                             multi-connect / edge-drop initiator)
//   2. `onTargetPointerDown`  flow-handle.ts:1780-2087, attached :2089
//                             (target branch — edge-endpoint reconnect initiator)
//
// ── INVENTORY: every directive-scope binding the two handlers read ──────────
//
// Determined by enumerating the free identifiers in both handler bodies. The
// ONLY directive-scope bindings either handler touches are the six below —
// everything else they reference is a handler-local, a module-level import, or
// reached through `canvas` / the DOM.
//
//  BINDING                  USED BY   RECOVERABLE AT DELEGATION TIME FROM
//  ───────────────────────  ────────  ──────────────────────────────────────────
//  `el`                     both      `(e.target as HTMLElement)
//                                       .closest('[data-flow-handle-type]')`.
//                                     This IS the handle element. Both handlers
//                                     only ever use `el` for `.closest(...)`,
//                                     `.getBoundingClientRect()`, and the
//                                     connectable expando — never for identity.
//
//  `handleId`               both      `handleEl.dataset.flowHandleId`.
//                                     Resolved once at :676-692 and stamped
//                                     unconditionally at :703; never reassigned
//                                     afterwards, so the dataset is always in
//                                     sync. Source reads it for `connect-start`,
//                                     the pending connection, validation classes
//                                     and every emitted connection; target reads
//                                     it at :1798 to match `edge.targetHandle`.
//                                     NOTE: `dataset` coerces to string. If a
//                                     user expression evaluates to a non-string
//                                     (e.g. a number), today's closure compares a
//                                     number while the delegated path would
//                                     compare a string. Typed `string`, so this
//                                     is only reachable via untyped user JS.
//
//  `getCanvas()`            both      Already DOM-derived (:754) —
//                                     `el.closest('[x-data]')` + `Alpine.$data`.
//                                     Closes over nothing but `el` and `Alpine`.
//                                     The delegated listener is per-container, so
//                                     the canvas is in scope directly.
//
//  `getNodeId()`            target    Already DOM-derived (:747) —
//                                     `el.closest('[x-flow-node]')` +
//                                     `data-flow-node-id`. The source handler
//                                     inlines the same lookup (:931-935).
//
//  `activeConnectionCleanup`  source  CLOSURE-ONLY — see below.
//  `activeReconnectCleanup`   target  CLOSURE-ONLY — see below.
//
// ── Explicitly NOT read by either pointerdown handler ───────────────────────
//   `type`      — only selects which branch attaches (:913). At delegation time
//                 `handleEl.dataset.flowHandleType` (stamped :701) selects the
//                 branch instead. Every literal `type` inside the two handler
//                 bodies is part of a `data-flow-handle-type` selector string,
//                 not a read of the directive-scope variable.
//   `position`  — never read by either handler. Every `position` inside the two
//                 bodies is an object key or a property access on something else
//                 (`snap.position`, `sourceNode.position`, …).
//   `expression`, `modifiers`, `value`, `evaluate`, `effect`, `cleanup`,
//   `keyboardBindingsCleanup`, `hasExplicitModifier`, `expressionHasPosition`,
//   `getNodeData`  — none appear in either handler body.
//   `MultiConnectLine` (:918) — a TYPE alias. Erased at runtime; F2 can hoist it
//                 to module scope verbatim.
//
// ── Element-carried state the handlers already read off the DOM ─────────────
//   `el.dataset.flowHandleType`      (stamped :701)
//   `el.dataset.flowHandleId`        (stamped :703)
//   `el.dataset.flowHandlePosition`  (stamped :702; not read by pointerdown)
//   `el.dataset.flowHandleExplicit`  (stamped :707/:712; not read by pointerdown)
//   `el[HANDLE_CONNECTABLE_START_KEY]`  expando, source guard (:941)
//   `el[HANDLE_CONNECTABLE_END_KEY]`    expando, read on the DROP target (:1422)
//   `el[HANDLE_VALIDATE_KEY]` / `el[HANDLE_LIMIT_KEY]`  expandos, read by the
//                 shared validator helpers via container queries — never off the
//                 initiating handle's closure.
//   All four expandos are set by sibling directives on the element itself
//   (`flow-handle-connectable.ts`, `-validate.ts`, `-limit.ts`) and are already
//   read element-first by `buildHandleIndex()` — nothing closure-bound.
//
// ── Everything else is canvas- or module-scoped (unchanged by delegation) ───
//   canvas: `_config.*` (connectOnClick, connectionSnapRadius, connectionLine*,
//     multiConnect, preventCycles, connectionRules, isValidConnection,
//     connectValidator, validatingHandleClass, onEdgeDrop, edgeDropPreview,
//     edgesReconnectable, connectionMode), `_animationLocked`, `_connectValidating`,
//     `pendingConnection`, `_pendingReconnection`, `_container`, `_viewportLive`,
//     `viewport`, `selectedNodes`, `edges`, `_nodeMap`, `getNode`, `addNodes`,
//     `addEdges`, `screenToFlowPosition`, `_emit`, `_captureHistory`.
//   module: `edgeIdCounter` (shared counter — keep module-level so ids stay
//     unique across both paths), `DRAG_THRESHOLD`, `CONNECTION_ACTIVE_COLOR`,
//     `CONNECTION_INVALID_COLOR`, `DEFAULT_NODE_WIDTH/HEIGHT`, `debug`,
//     `isConnectable`, `isValidConnection`, `checkConnectionRules`,
//     `createConnectionLine`, `findSnapTarget`, `startConnectionAutoPan`,
//     `buildHandleIndex`, `applyValidationClasses`, `clearValidationClasses`,
//     `checkHandleLimits`, `runHandleValidators`, `findHandleElements`,
//     `runConnectValidator`, `applyReconnectValidation`, `dispatchConnectRejected`,
//     `setDragLineValidating`.
//
// ── CLOSURE-ONLY items, and why no parity shim is added here ────────────────
//
// `activeConnectionCleanup` (:915) and `activeReconnectCleanup` (:1778) are the
// only two bindings that are not recoverable from the element. Both are
// **write-only gesture-teardown slots, not handler inputs**:
//
//   * initialized to `null` at directive init;
//   * ASSIGNED by the pointerdown handler when a gesture starts (:1572, :2086)
//     and nulled when it ends (:1277, :2000);
//   * READ only by the directive's own `cleanup()` (:1619, :2092), so a handle
//     torn down mid-drag (x-if toggle, Livewire morph, schema re-stamp) aborts
//     its in-flight gesture instead of leaking document listeners and a drag SVG.
//
// Because they are `null` at init and only ever written by the handler, there is
// nothing to hoist onto the element in the init path — an init-time dataset or
// expando would carry no information. They are not "state the handler needs to
// recover"; they are state the handler PRODUCES and the cleanup CONSUMES. So per
// the YAGNI guard, F1 adds NO production code. Re-homing them is an F2 wiring
// decision, and F2 must not drop them. Two viable shapes:
//
//   (a) Symbol/string expando written by the delegated handler onto the handle
//       element it resolved (e.g. `handleEl._flowHandleActiveGesture`), read and
//       invoked by the surviving per-handle `cleanup()`. Preserves today's
//       teardown semantics exactly, including per-handle granularity.
//   (b) A container-scoped slot (module-level `WeakMap<HTMLElement, () => void>`,
//       mirroring `containerEscListeners` in flow-handle.ts). Sound because the
//       document-level pointermove/up listeners mean only ONE connect-drag or
//       reconnect gesture can be live per container at a time — but it moves
//       teardown off the handle, so a handle removed mid-drag no longer aborts
//       its own gesture. Prefer (a) unless F2 proves (b) is equivalent.
//
// ── CONCERNS FOR F2 (behavioral, verified against this tree) ────────────────
//
// 1. PROPAGATION PHASE IS LOAD-BEARING — delegate in CAPTURE, not bubble.
//    Node dragging is d3-drag (`sel.call(dragBehavior)`, core/drag.ts:167), which
//    binds `pointerdown.drag` on the NODE element in the BUBBLE phase, and its
//    `filter` (core/drag.ts:156-164) does NOT exclude handles. Today the handle's
//    own bubble listener is deeper in the tree, fires first, and calls
//    `e.stopPropagation()` — that call is the ONLY thing stopping a node drag
//    from starting when you press a handle. A delegated listener on the CONTAINER
//    (an ancestor of the node) would, in the bubble phase, fire AFTER d3-drag and
//    every handle press would also drag the node. F2 must attach with
//    `{ capture: true }` and stop propagation there.
//
// 2. THE TWO HANDLERS STOP PROPAGATION UNDER DIFFERENT CONDITIONS — preserve it.
//    Source calls `e.preventDefault(); e.stopPropagation()` UNCONDITIONALLY as its
//    first two statements (:927-928), BEFORE the canvas / `_animationLocked` /
//    connectable guards. Target calls them only AFTER passing seven guards
//    (:1812-1813: button, canvas+node, `_animationLocked`, `edgesReconnectable`,
//    no in-flight reconnect, ≥1 matching edge, per-edge `reconnectable`). That
//    asymmetry is deliberate: pressing a target handle with no reconnectable edge
//    falls through to the node drag. A capture-phase dispatcher must reproduce
//    both branches exactly, or dragging a node by an unconnected target handle
//    breaks.
//
// 3. WHITEBOARD TOOLS ALREADY OWN CONTAINER-LEVEL CAPTURE POINTERDOWN.
//    flow-freehand:269, flow-eraser:347, flow-circle-draw:223,
//    flow-rectangle-draw:217, flow-arrow-draw:227, flow-highlighter:264 and
//    flow-text-tool:84 all `containerEl.addEventListener('pointerdown', …, true)`
//    on the SAME element and phase F2 wants, and they call
//    `e.stopImmediatePropagation()` (e.g. flow-freehand). Today they always win
//    over handles (container capture precedes the handle's bubble listener). Once
//    the handle dispatcher is a same-element, same-phase capture listener,
//    ordering degrades to REGISTRATION order — and the tools attach lazily on
//    activation, i.e. AFTER a dispatcher registered at canvas init. F2 must
//    explicitly keep tools ahead of handles (check the active whiteboard tool
//    before dispatching, or register the dispatcher lazily/behind them). This is
//    the highest-risk regression in the workstream.
//
// 4. SOURCE HANDLE HAS NO BUTTON GUARD. Target checks `e.button !== 0` (:1781);
//    source does not, so a right/middle-click on a source handle currently
//    preventDefaults and enters the connect pipeline. Carry it forward as-is (or
//    fix it deliberately, with a test) — don't change it by accident.
//
// 5. MIRROR HANDLES are safe to ignore. `.flow-schema-handle--mirror` is
//    `visibility: hidden; pointer-events: none` (css/structural.css:1545-1548), so
//    they never receive pointer events and `e.target.closest(...)` can never
//    resolve to one in a browser. They still get the directive (and therefore the
//    datasets/expandos), and `buildHandleIndex` already prefers the real handle
//    over its mirror. Caveat for tests: jsdom does not apply CSS, so a test that
//    dispatches `pointerdown` directly AT a mirror element will reach the
//    delegated handler.
//
// 6. `e.target` MAY BE A DESCENDANT of the handle (handles can wrap content), and
//    `.closest()` from a descendant may cross a handle boundary. Resolve with
//    `closest('[data-flow-handle-type]')` (as the plan specifies) rather than
//    matching the event target directly.
// ============================================================================

export {};
