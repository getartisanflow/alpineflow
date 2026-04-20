// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { runConnectValidator, applyReconnectValidation } from './flow-handle';
import { resolveEdgeBodyReconnect } from './flow-edge';
import type { Connection, FlowEdge } from '../../core/types';

// jsdom doesn't implement CSS.escape — minimal polyfill for simple IDs
beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string) => String(value);
  }
});

// Track any container appended to document.body by buildReconnectDom so tests
// don't leak stale node DOM into sibling tests (previous handles/edges would
// still be queryable otherwise).
const reconnectDomContainers: HTMLElement[] = [];
afterEach(() => {
  while (reconnectDomContainers.length > 0) {
    const el = reconnectDomContainers.pop();
    el?.remove();
  }
});

const conn = (overrides: Partial<Connection> = {}): Connection => ({
  source: 'a',
  sourceHandle: 'source',
  target: 'b',
  targetHandle: 'target',
  ...overrides,
});

describe('runConnectValidator', () => {
  it('returns allowed:true when no validator is configured', async () => {
    const result = await runConnectValidator(
      undefined,
      conn(),
      null,
      null,
      document.body,
      'flow-handle-validating',
    );
    expect(result.allowed).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('resolves with allowed:true when validator returns true', async () => {
    const result = await runConnectValidator(
      async () => true,
      conn(),
      null,
      null,
      document.body,
      'flow-handle-validating',
    );
    expect(result.allowed).toBe(true);
  });

  it('resolves with allowed:false when validator returns false', async () => {
    const result = await runConnectValidator(
      async () => false,
      conn(),
      null,
      null,
      document.body,
      'flow-handle-validating',
    );
    expect(result.allowed).toBe(false);
  });

  it('passes through { allowed, reason }', async () => {
    const result = await runConnectValidator(
      async () => ({ allowed: false, reason: 'FK cycle' }),
      conn(),
      null,
      null,
      document.body,
      'flow-handle-validating',
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('FK cycle');
  });

  it('passes through { allowed: true, reason } without swallowing the reason', async () => {
    const result = await runConnectValidator(
      async () => ({ allowed: true, reason: 'verified' }),
      conn(),
      null,
      null,
      document.body,
      'flow-handle-validating',
    );
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe('verified');
  });

  it('adds the validating class to source + target handles while awaiting, removes after', async () => {
    const src = document.createElement('div');
    const tgt = document.createElement('div');
    let sawClassDuringAwait = false;
    const validator = async () => {
      sawClassDuringAwait =
        src.classList.contains('flow-handle-validating') &&
        tgt.classList.contains('flow-handle-validating');
      return true;
    };
    await runConnectValidator(
      validator,
      conn(),
      src,
      tgt,
      document.body,
      'flow-handle-validating',
    );
    expect(sawClassDuringAwait).toBe(true);
    expect(src.classList.contains('flow-handle-validating')).toBe(false);
    expect(tgt.classList.contains('flow-handle-validating')).toBe(false);
  });

  it('respects a custom validatingHandleClass', async () => {
    const src = document.createElement('div');
    const tgt = document.createElement('div');
    let sawCustomClass = false;
    const validator = async () => {
      sawCustomClass =
        src.classList.contains('my-pulse') && tgt.classList.contains('my-pulse');
      return true;
    };
    await runConnectValidator(validator, conn(), src, tgt, document.body, 'my-pulse');
    expect(sawCustomClass).toBe(true);
    expect(src.classList.contains('my-pulse')).toBe(false);
    expect(tgt.classList.contains('my-pulse')).toBe(false);
  });

  it('removes the validating class even when the validator throws', async () => {
    const src = document.createElement('div');
    const tgt = document.createElement('div');
    await runConnectValidator(
      async () => { throw new Error('boom'); },
      conn(),
      src,
      tgt,
      document.body,
      'flow-handle-validating',
    );
    expect(src.classList.contains('flow-handle-validating')).toBe(false);
    expect(tgt.classList.contains('flow-handle-validating')).toBe(false);
  });

  it('dispatches flow-connect-validating and flow-connect-validated events', async () => {
    const container = document.createElement('div');
    const starts: any[] = [];
    const ends: any[] = [];
    container.addEventListener('flow-connect-validating', (e: any) => starts.push(e.detail));
    container.addEventListener('flow-connect-validated', (e: any) => ends.push(e.detail));
    await runConnectValidator(
      async () => ({ allowed: false, reason: 'nope' }),
      conn({ source: 'a', target: 'b' }),
      null,
      null,
      container,
      'flow-handle-validating',
    );
    expect(starts).toHaveLength(1);
    expect(starts[0].connection.source).toBe('a');
    expect(starts[0].connection.target).toBe('b');
    expect(ends).toHaveLength(1);
    expect(ends[0].allowed).toBe(false);
    expect(ends[0].reason).toBe('nope');
  });

  it('dispatches flow-connect-validated with allowed:true + undefined reason on a plain bool success', async () => {
    const container = document.createElement('div');
    const ends: any[] = [];
    container.addEventListener('flow-connect-validated', (e: any) => ends.push(e.detail));
    await runConnectValidator(
      async () => true,
      conn(),
      null,
      null,
      container,
      'flow-handle-validating',
    );
    expect(ends).toHaveLength(1);
    expect(ends[0].allowed).toBe(true);
    expect(ends[0].reason).toBeUndefined();
  });

  it('treats a thrown validator as allowed:false and dispatches the validated event', async () => {
    const container = document.createElement('div');
    const ends: any[] = [];
    container.addEventListener('flow-connect-validated', (e: any) => ends.push(e.detail));
    const result = await runConnectValidator(
      async () => { throw new Error('boom'); },
      conn(),
      null,
      null,
      container,
      'flow-handle-validating',
    );
    expect(result.allowed).toBe(false);
    expect(ends).toHaveLength(1);
    expect(ends[0].allowed).toBe(false);
  });

  it('does not dispatch events when no validator is configured', async () => {
    const container = document.createElement('div');
    const starts: any[] = [];
    const ends: any[] = [];
    container.addEventListener('flow-connect-validating', (e: any) => starts.push(e.detail));
    container.addEventListener('flow-connect-validated', (e: any) => ends.push(e.detail));
    await runConnectValidator(undefined, conn(), null, null, container, 'x');
    expect(starts).toHaveLength(0);
    expect(ends).toHaveLength(0);
  });

  it('both events bubble so devs can listen on ancestors', async () => {
    const outer = document.createElement('div');
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const starts: any[] = [];
    const ends: any[] = [];
    outer.addEventListener('flow-connect-validating', (e: any) => starts.push(e.detail));
    outer.addEventListener('flow-connect-validated', (e: any) => ends.push(e.detail));
    await runConnectValidator(
      async () => true,
      conn(),
      null,
      null,
      inner,
      'flow-handle-validating',
    );
    expect(starts).toHaveLength(1);
    expect(ends).toHaveLength(1);
  });
});

// ─── Reconnect validator wiring ───────────────────────────────────────────
//
// Reconnect = user drags the endpoint of an existing edge to a new handle.
// The async connectValidator has to run in this path, same as initial connect.

/**
 * Build a minimal container + nodes + handles DOM scaffold for reconnect tests.
 */
function buildReconnectDom(nodeIds: string[]): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('flow-container');
  for (const id of nodeIds) {
    const nodeEl = document.createElement('div');
    nodeEl.setAttribute('x-flow-node', '');
    nodeEl.dataset.flowNodeId = id;
    // Source handle
    const src = document.createElement('div');
    src.dataset.flowHandleId = 'source';
    src.dataset.flowHandleType = 'source';
    nodeEl.appendChild(src);
    // Target handle
    const tgt = document.createElement('div');
    tgt.dataset.flowHandleId = 'target';
    tgt.dataset.flowHandleType = 'target';
    nodeEl.appendChild(tgt);
    // Extra named target handle used for specific reconnect drops
    const idHandle = document.createElement('div');
    idHandle.dataset.flowHandleId = 'id';
    idHandle.dataset.flowHandleType = 'target';
    nodeEl.appendChild(idHandle);
    container.appendChild(nodeEl);
  }
  document.body.appendChild(container);
  reconnectDomContainers.push(container);
  return container;
}

/**
 * Build a minimal canvas-like object matching what applyReconnectValidation reads.
 */
function makeCanvasWithValidator(
  validator: ((c: Connection) => any) | undefined,
  edges: FlowEdge[] = [],
) {
  const canvas: any = {
    edges,
    getNode: (id: string) => ({ id, connectable: true }),
    _nodeMap: new Map(),
    _config: {
      connectValidator: validator,
    },
    _connectValidating: false,
    _captureHistory: () => {},
    _emit: () => {},
  };
  return canvas;
}

describe('applyReconnectValidation', () => {
  it('runs connectValidator when reconnecting an edge endpoint and leaves the edge unchanged on rejection', async () => {
    const containerEl = buildReconnectDom(['n1', 'n-original', 'n2']);
    const edge: FlowEdge = {
      id: 'e1',
      source: 'n1',
      sourceHandle: 'source',
      target: 'n-original',
      targetHandle: 'target',
    };
    const canvas = makeCanvasWithValidator(
      async () => ({ allowed: false, reason: 'nope' }),
      [edge],
    );

    const rejected: any[] = [];
    const validated: any[] = [];
    containerEl.addEventListener('flow-connect-validated', (e: any) => validated.push(e.detail));
    containerEl.addEventListener('flow-connect-rejected', (e: any) => rejected.push(e.detail));

    const result = await applyReconnectValidation({
      edge,
      newConnection: {
        source: 'n1',
        sourceHandle: 'source',
        target: 'n2',
        targetHandle: 'id',
      },
      canvas,
      containerEl,
    });

    expect(result.applied).toBe(false);
    expect(result.reason).toBe('nope');

    // Edge target is still the original target
    const lookup = canvas.edges.find((e: FlowEdge) => e.id === 'e1');
    expect(lookup.target).toBe('n-original');
    expect(lookup.targetHandle).toBe('target');

    // Validator lifecycle event fired
    expect(validated).toHaveLength(1);
    expect(validated[0].allowed).toBe(false);
    expect(validated[0].reason).toBe('nope');

    // Rejected event fires with the rejected connection + reason
    expect(rejected).toHaveLength(1);
    expect(rejected[0].reason).toBe('nope');
    expect(rejected[0].source).toBe('n1');
    expect(rejected[0].target).toBe('n2');
    expect(rejected[0].sourceHandle).toBe('source');
    expect(rejected[0].targetHandle).toBe('id');
  });

  it('applies the reconnect and mutates the edge when connectValidator resolves allowed:true', async () => {
    const containerEl = buildReconnectDom(['n1', 'n-original', 'n2']);
    const edge: FlowEdge = {
      id: 'e1',
      source: 'n1',
      sourceHandle: 'source',
      target: 'n-original',
      targetHandle: 'target',
    };
    const canvas = makeCanvasWithValidator(async () => true, [edge]);

    const result = await applyReconnectValidation({
      edge,
      newConnection: {
        source: 'n1',
        sourceHandle: 'source',
        target: 'n2',
        targetHandle: 'id',
      },
      canvas,
      containerEl,
    });

    expect(result.applied).toBe(true);
    expect(edge.target).toBe('n2');
    expect(edge.targetHandle).toBe('id');
  });

  it('applies the reconnect when no connectValidator is configured (unchanged behavior)', async () => {
    const containerEl = buildReconnectDom(['n1', 'n-original', 'n2']);
    const edge: FlowEdge = {
      id: 'e1',
      source: 'n1',
      sourceHandle: 'source',
      target: 'n-original',
      targetHandle: 'target',
    };
    const canvas = makeCanvasWithValidator(undefined, [edge]);

    const result = await applyReconnectValidation({
      edge,
      newConnection: {
        source: 'n1',
        sourceHandle: 'source',
        target: 'n2',
        targetHandle: 'id',
      },
      canvas,
      containerEl,
    });

    expect(result.applied).toBe(true);
    expect(edge.target).toBe('n2');
    expect(edge.targetHandle).toBe('id');
  });
});

// ─── Edge-body reconnect wiring ────────────────────────────────────────────
//
// The second reconnect path: user grabs the edge LINE (not the handle pip) and
// drags either end to a new handle. flow-edge.ts's onPointerUp extracts this
// drop resolution into `resolveEdgeBodyReconnect`, which must route through
// `applyReconnectValidation` so the async connectValidator always gates both
// the source-end and target-end reconnects.

describe('resolveEdgeBodyReconnect', () => {
  it('rejects a target-end edge-body reconnect when connectValidator resolves allowed:false and leaves the edge unchanged', async () => {
    const containerEl = buildReconnectDom(['n1', 'n-original', 'n2']);
    const edge: FlowEdge = {
      id: 'e1',
      source: 'n1',
      sourceHandle: 'source',
      target: 'n-original',
      targetHandle: 'target',
    };
    const canvas = makeCanvasWithValidator(
      async () => ({ allowed: false, reason: 'not-allowed' }),
      [edge],
    );

    const rejected: any[] = [];
    containerEl.addEventListener('flow-connect-rejected', (e: any) => rejected.push(e.detail));

    const result = await resolveEdgeBodyReconnect({
      dropNodeId: 'n2',
      dropHandleId: 'id',
      draggedEnd: 'target',
      edge,
      canvas,
      containerEl,
    });

    expect(result.applied).toBe(false);
    expect(result.reason).toBe('not-allowed');

    // Edge endpoint is unchanged
    expect(edge.target).toBe('n-original');
    expect(edge.targetHandle).toBe('target');

    // Rejection event fires with the would-be connection
    expect(rejected).toHaveLength(1);
    expect(rejected[0].reason).toBe('not-allowed');
    expect(rejected[0].target).toBe('n2');
    expect(rejected[0].targetHandle).toBe('id');
  });

  it('rejects a source-end edge-body reconnect when connectValidator resolves allowed:false and leaves the edge unchanged', async () => {
    const containerEl = buildReconnectDom(['n-original-source', 'n-target', 'n-new-source']);
    const edge: FlowEdge = {
      id: 'e1',
      source: 'n-original-source',
      sourceHandle: 'source',
      target: 'n-target',
      targetHandle: 'target',
    };
    const canvas = makeCanvasWithValidator(
      async () => ({ allowed: false, reason: 'source-rejected' }),
      [edge],
    );

    const rejected: any[] = [];
    containerEl.addEventListener('flow-connect-rejected', (e: any) => rejected.push(e.detail));

    const result = await resolveEdgeBodyReconnect({
      dropNodeId: 'n-new-source',
      dropHandleId: 'source',
      draggedEnd: 'source',
      edge,
      canvas,
      containerEl,
    });

    expect(result.applied).toBe(false);
    expect(result.reason).toBe('source-rejected');

    // Source endpoint is unchanged
    expect(edge.source).toBe('n-original-source');
    expect(edge.sourceHandle).toBe('source');

    expect(rejected).toHaveLength(1);
    expect(rejected[0].reason).toBe('source-rejected');
    expect(rejected[0].source).toBe('n-new-source');
  });

  it('applies a target-end edge-body reconnect when connectValidator resolves allowed:true', async () => {
    const containerEl = buildReconnectDom(['n1', 'n-original', 'n2']);
    const edge: FlowEdge = {
      id: 'e1',
      source: 'n1',
      sourceHandle: 'source',
      target: 'n-original',
      targetHandle: 'target',
    };
    const canvas = makeCanvasWithValidator(async () => true, [edge]);

    const emitted: Array<{ name: string; payload: any }> = [];
    canvas._emit = (name: string, payload: any) => emitted.push({ name, payload });

    const result = await resolveEdgeBodyReconnect({
      dropNodeId: 'n2',
      dropHandleId: 'id',
      draggedEnd: 'target',
      edge,
      canvas,
      containerEl,
    });

    expect(result.applied).toBe(true);
    expect(edge.target).toBe('n2');
    expect(edge.targetHandle).toBe('id');

    // Emits `reconnect` with oldEdge + newConnection so consumers can react
    const reconnectEmit = emitted.find((e) => e.name === 'reconnect');
    expect(reconnectEmit).toBeDefined();
    expect(reconnectEmit?.payload.oldEdge.target).toBe('n-original');
    expect(reconnectEmit?.payload.newConnection.target).toBe('n2');
  });

  it('returns { applied: false } without invoking the validator when there is no drop node', async () => {
    const containerEl = buildReconnectDom(['n1', 'n2']);
    const edge: FlowEdge = {
      id: 'e1',
      source: 'n1',
      sourceHandle: 'source',
      target: 'n2',
      targetHandle: 'target',
    };
    let validatorCalls = 0;
    const canvas = makeCanvasWithValidator(async () => {
      validatorCalls++;
      return true;
    }, [edge]);

    const result = await resolveEdgeBodyReconnect({
      dropNodeId: undefined,
      dropHandleId: undefined,
      draggedEnd: 'target',
      edge,
      canvas,
      containerEl,
    });

    expect(result.applied).toBe(false);
    expect(validatorCalls).toBe(0);
    // Edge is untouched
    expect(edge.target).toBe('n2');
    expect(edge.targetHandle).toBe('target');
  });

  it('returns { applied: false } without invoking the validator when the drop node is not connectable', async () => {
    const containerEl = buildReconnectDom(['n1', 'n-original', 'n-unconnectable']);
    const edge: FlowEdge = {
      id: 'e1',
      source: 'n1',
      sourceHandle: 'source',
      target: 'n-original',
      targetHandle: 'target',
    };
    let validatorCalls = 0;
    const canvas: any = {
      edges: [edge],
      getNode: (id: string) => ({
        id,
        connectable: id !== 'n-unconnectable',
      }),
      _nodeMap: new Map(),
      _config: {
        connectValidator: async () => {
          validatorCalls++;
          return true;
        },
      },
      _connectValidating: false,
      _captureHistory: () => {},
      _emit: () => {},
    };

    const result = await resolveEdgeBodyReconnect({
      dropNodeId: 'n-unconnectable',
      dropHandleId: 'id',
      draggedEnd: 'target',
      edge,
      canvas,
      containerEl,
    });

    expect(result.applied).toBe(false);
    expect(validatorCalls).toBe(0);
    expect(edge.target).toBe('n-original');
  });
});
