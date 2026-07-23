// @vitest-environment jsdom
//
// Characterization battery for the O(1)-per-handle drag validation path.
//
// The LEGACY `applyValidationClasses` (container-wide querySelector chain) is
// the ORACLE. Every fixture runs the SAME DOM + canvas through BOTH the legacy
// path (no index) and the new indexed path, and asserts byte-identical
// flow-handle-valid / flow-handle-invalid / flow-handle-limit-reached classes
// on every target handle. If the indexed path diverges on any fixture, the
// `assertParity` toEqual fails.
//
// A handful of fixtures additionally assert the concrete expected classes so
// the battery cannot pass vacuously (both paths agreeing on the wrong answer).

import { describe, it, expect, beforeAll, vi } from 'vitest';
import {
  applyValidationClasses,
  clearValidationClasses,
} from './directives/flow-handle';
import { buildHandleIndex } from './handle-index';
import { buildDragValidationContext } from './drag-validation';
import { HANDLE_LIMIT_KEY } from './directives/flow-handle-limit';
import { HANDLE_VALIDATE_KEY } from './directives/flow-handle-validate';
import {
  HANDLE_CONNECTABLE_END_KEY,
  HANDLE_CONNECTABLE_START_KEY,
} from './directives/flow-handle-connectable';
import type { XYPosition, Connection, FlowEdge } from '../core/types';

beforeAll(() => {
  // jsdom doesn't implement CSS.escape — the legacy path uses it.
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string) => String(value);
  }
});

// ── Fixture builders ────────────────────────────────────────────────────────

function stubRect(
  el: HTMLElement,
  rect: { left: number; top: number; width: number; height: number },
): void {
  el.getBoundingClientRect = () =>
    ({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
      x: rect.left,
      y: rect.top,
      toJSON: () => {},
    }) as DOMRect;
}

/** Validation only reads (id, expandos) — an identity transform is sufficient. */
function toFlow(screenX: number, screenY: number): XYPosition {
  return { x: screenX, y: screenY };
}

interface HandleSpec {
  type: 'source' | 'target';
  id?: string; // dataset.flowHandleId; defaults to type
  mirror?: boolean;
  limit?: number;
  validate?: (c: Connection) => boolean;
  connectableEnd?: boolean;
  connectableStart?: boolean;
  rect?: { left: number; top: number; width: number; height: number };
}

interface NodeSpec {
  id: string;
  connectable?: boolean;
  handles: HandleSpec[];
}

function buildDom(nodes: NodeSpec[]): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flow-container';

  for (const n of nodes) {
    const nodeEl = document.createElement('div');
    // Real DOM node elements carry BOTH markers; legacy resolves via
    // [x-flow-node], the index via [data-flow-node-id].
    nodeEl.setAttribute('x-flow-node', '');
    nodeEl.dataset.flowNodeId = n.id;

    for (const h of n.handles) {
      const el = document.createElement('div');
      let cls = 'flow-handle';
      if (h.mirror) {
        cls += ' flow-schema-handle--mirror';
      }
      el.className = cls;
      el.dataset.flowHandleType = h.type;
      el.dataset.flowHandleId = h.id ?? h.type;
      stubRect(el, h.rect ?? { left: 100, top: 50, width: 20, height: 10 });

      if (h.limit != null) {
        el[HANDLE_LIMIT_KEY] = h.limit;
      }
      if (h.validate) {
        el[HANDLE_VALIDATE_KEY] = h.validate;
      }
      if (h.connectableEnd === false) {
        el[HANDLE_CONNECTABLE_END_KEY] = false;
      }
      if (h.connectableStart === false) {
        el[HANDLE_CONNECTABLE_START_KEY] = false;
      }
      nodeEl.appendChild(el);
    }

    container.appendChild(nodeEl);
  }

  return container;
}

function buildCanvas(
  nodes: NodeSpec[],
  edges: FlowEdge[],
  opts?: {
    preventCycles?: boolean;
    isValidConnection?: (c: Connection) => boolean;
  },
): any {
  const nodeMap = new Map(
    nodes.map((n) => [n.id, { id: n.id, connectable: n.connectable }]),
  );
  return {
    edges,
    getNode: (id: string) => nodeMap.get(id),
    _config: {
      preventCycles: opts?.preventCycles,
      isValidConnection: opts?.isValidConnection,
    },
  };
}

interface ClassRow {
  key: string;
  valid: boolean;
  invalid: boolean;
  limit: boolean;
}

function snapshot(container: HTMLElement): ClassRow[] {
  const rows: ClassRow[] = [];
  const targets = container.querySelectorAll<HTMLElement>(
    '[data-flow-handle-type="target"]',
  );
  targets.forEach((el, i) => {
    const nodeId = el
      .closest('[data-flow-node-id]')
      ?.getAttribute('data-flow-node-id');
    const kind = el.classList.contains('flow-schema-handle--mirror')
      ? 'mirror'
      : 'real';
    rows.push({
      key: `${nodeId}|${el.dataset.flowHandleId}|${kind}|#${i}`,
      valid: el.classList.contains('flow-handle-valid'),
      invalid: el.classList.contains('flow-handle-invalid'),
      limit: el.classList.contains('flow-handle-limit-reached'),
    });
  });
  return rows;
}

/**
 * Run legacy then indexed on the SAME DOM (clearing the 3 validation classes
 * between runs) and assert byte-identical results. Returns the legacy snapshot
 * so callers can additionally lock the concrete expected classes.
 */
function assertParity(
  container: HTMLElement,
  sourceNodeId: string,
  sourceHandleId: string,
  canvas: any,
  excludeEdgeId?: string,
): ClassRow[] {
  clearValidationClasses(container);
  applyValidationClasses(container, sourceNodeId, sourceHandleId, canvas, excludeEdgeId);
  const legacy = snapshot(container);

  clearValidationClasses(container);
  const index = buildHandleIndex(container, toFlow);
  applyValidationClasses(container, sourceNodeId, sourceHandleId, canvas, excludeEdgeId, index);
  const indexed = snapshot(container);

  expect(indexed).toEqual(legacy);
  return legacy;
}

function rowFor(rows: ClassRow[], match: string): ClassRow {
  const row = rows.find((r) => r.key.startsWith(match));
  if (!row) {
    throw new Error(`no target row matching "${match}" in ${JSON.stringify(rows)}`);
  }
  return row;
}

// ── buildDragValidationContext unit tests (the crux) ─────────────────────────

describe('buildDragValidationContext', () => {
  it('existingTargets uses STRICT raw handle comparison — an undefined edge handle does NOT match a default drag id', () => {
    const canvas = {
      edges: [
        { id: 'e1', source: 'a', target: 'b', sourceHandle: undefined, targetHandle: undefined },
      ],
      _config: {},
    };
    const ctx = buildDragValidationContext(canvas, 'a', 'source');
    // Legacy isValidConnection: undefined !== 'source' → not a duplicate.
    expect(ctx.existingTargets.has('b|target')).toBe(false);
  });

  it('existingTargets matches when the raw stored handles equal the drag handles', () => {
    const canvas = {
      edges: [
        { id: 'e1', source: 'a', target: 'b', sourceHandle: 'source', targetHandle: 'target' },
      ],
      _config: {},
    };
    const ctx = buildDragValidationContext(canvas, 'a', 'source');
    expect(ctx.existingTargets.has('b|target')).toBe(true);
  });

  it('source/target counts DO normalize missing handles to defaults (matches checkHandleLimits)', () => {
    const canvas = {
      edges: [
        { id: 'e1', source: 'a', target: 'b', sourceHandle: undefined, targetHandle: undefined },
      ],
      _config: {},
    };
    const ctx = buildDragValidationContext(canvas, 'a', 'source');
    expect(ctx.sourceCounts.get('a|source')).toBe(1);
    expect(ctx.targetCounts.get('b|target')).toBe(1);
  });

  it('cycleForbidden is empty when preventCycles is off', () => {
    const canvas = {
      edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
      ],
      _config: { preventCycles: false },
    };
    const ctx = buildDragValidationContext(canvas, 'c', 'source');
    expect(ctx.cycleForbidden.size).toBe(0);
  });

  it('cycleForbidden = {source} ∪ ancestors(source) for a→b→c dragging from c (matches wouldCreateCycle)', () => {
    const canvas = {
      edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
      ],
      _config: { preventCycles: true },
    };
    const ctx = buildDragValidationContext(canvas, 'c', 'source');
    expect(ctx.cycleForbidden.has('c')).toBe(true);
    expect(ctx.cycleForbidden.has('b')).toBe(true);
    expect(ctx.cycleForbidden.has('a')).toBe(true);
    expect(ctx.cycleForbidden.has('d')).toBe(false);
  });

  it('excludeEdgeId drops that edge from counts and duplicates', () => {
    const canvas = {
      edges: [
        { id: 'e1', source: 'a', target: 'b', sourceHandle: 'source', targetHandle: 'target' },
      ],
      _config: {},
    };
    const ctx = buildDragValidationContext(canvas, 'a', 'source', 'e1');
    expect(ctx.existingTargets.has('b|target')).toBe(false);
    expect(ctx.targetCounts.get('b|target')).toBeUndefined();
  });
});

// ── Characterization battery ─────────────────────────────────────────────────

describe('applyValidationClasses — indexed path matches legacy (oracle)', () => {
  it('plain valid target', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source' }] },
      { id: 'b', handles: [{ type: 'target' }] },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, []);
    const rows = assertParity(container, 'a', 'source', canvas);
    expect(rowFor(rows, 'b|target|real').valid).toBe(true);
    expect(rowFor(rows, 'b|target|real').invalid).toBe(false);
  });

  it('self-connection — target on the source node is invalid', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source' }, { type: 'target' }] },
      { id: 'b', handles: [{ type: 'target' }] },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, []);
    const rows = assertParity(container, 'a', 'source', canvas);
    expect(rowFor(rows, 'a|target|real').invalid).toBe(true);
    expect(rowFor(rows, 'a|target|real').limit).toBe(false);
    expect(rowFor(rows, 'b|target|real').valid).toBe(true);
  });

  it('duplicate edge WITH explicit handles is invalid', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source', id: 's1' }] },
      { id: 'b', handles: [{ type: 'target', id: 't1' }, { type: 'target', id: 't2' }] },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, [
      { id: 'e1', source: 'a', target: 'b', sourceHandle: 's1', targetHandle: 't1' },
    ]);
    const rows = assertParity(container, 'a', 's1', canvas);
    expect(rowFor(rows, 'b|t1|real').invalid).toBe(true);
    expect(rowFor(rows, 'b|t1|real').limit).toBe(false);
    expect(rowFor(rows, 'b|t2|real').valid).toBe(true);
  });

  it('duplicate edge WITH undefined handles — strict compare means it is NOT a duplicate against default-id handles', () => {
    // The flagged divergence: legacy compares raw (undefined !== "source"/"target").
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source' }] },
      { id: 'b', handles: [{ type: 'target' }] },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, [
      { id: 'e1', source: 'a', target: 'b', sourceHandle: undefined, targetHandle: undefined } as FlowEdge,
    ]);
    const rows = assertParity(container, 'a', 'source', canvas);
    // Legacy treats this as NOT a duplicate → the target is valid.
    expect(rowFor(rows, 'b|target|real').valid).toBe(true);
  });

  it('duplicate edge with undefined handles IS a duplicate when the drag handle id is also undefined-shaped default only via strict match', () => {
    // Complement: an edge whose stored handles are the literal default strings
    // DOES duplicate a drag from those default ids.
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source' }] },
      { id: 'b', handles: [{ type: 'target' }] },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, [
      { id: 'e1', source: 'a', target: 'b', sourceHandle: 'source', targetHandle: 'target' },
    ]);
    const rows = assertParity(container, 'a', 'source', canvas);
    expect(rowFor(rows, 'b|target|real').invalid).toBe(true);
  });

  it('preventCycles a→b→c — ancestors of the source are invalid', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source' }, { type: 'target' }] },
      { id: 'b', handles: [{ type: 'source' }, { type: 'target' }] },
      { id: 'c', handles: [{ type: 'source' }, { type: 'target' }] },
      { id: 'd', handles: [{ type: 'target' }] },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(
      nodes,
      [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
      ],
      { preventCycles: true },
    );
    const rows = assertParity(container, 'c', 'source', canvas);
    expect(rowFor(rows, 'a|target|real').invalid).toBe(true);
    expect(rowFor(rows, 'b|target|real').invalid).toBe(true);
    expect(rowFor(rows, 'd|target|real').valid).toBe(true);
  });

  it('source-limit hit — every otherwise-valid target gets limit-reached', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source', id: 's1', limit: 1 }] },
      { id: 'b', handles: [{ type: 'target' }] },
      { id: 'c', handles: [{ type: 'target' }] },
    ];
    const container = buildDom(nodes);
    // One existing edge from a/s1 → count 1 >= limit 1.
    const canvas = buildCanvas(nodes, [
      { id: 'e1', source: 'a', target: 'z', sourceHandle: 's1', targetHandle: 'target' },
    ]);
    const rows = assertParity(container, 'a', 's1', canvas);
    expect(rowFor(rows, 'b|target|real').invalid).toBe(true);
    expect(rowFor(rows, 'b|target|real').limit).toBe(true);
    expect(rowFor(rows, 'c|target|real').invalid).toBe(true);
    expect(rowFor(rows, 'c|target|real').limit).toBe(true);
  });

  it('target-limit hit — only the limited target gets limit-reached', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source' }] },
      { id: 'b', handles: [{ type: 'target', id: 't1', limit: 1 }, { type: 'target', id: 't2' }] },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, [
      { id: 'e1', source: 'y', target: 'b', sourceHandle: 'source', targetHandle: 't1' },
    ]);
    const rows = assertParity(container, 'a', 'source', canvas);
    expect(rowFor(rows, 'b|t1|real').invalid).toBe(true);
    expect(rowFor(rows, 'b|t1|real').limit).toBe(true);
    expect(rowFor(rows, 'b|t2|real').valid).toBe(true);
  });

  it('source per-handle validator rejecting — targets invalid but NOT limit-reached', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source', validate: () => false }] },
      { id: 'b', handles: [{ type: 'target' }] },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, []);
    const rows = assertParity(container, 'a', 'source', canvas);
    expect(rowFor(rows, 'b|target|real').invalid).toBe(true);
    expect(rowFor(rows, 'b|target|real').limit).toBe(false);
  });

  it('target per-handle validator rejecting — only that target invalid', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source' }] },
      {
        id: 'b',
        handles: [
          { type: 'target', id: 't1', validate: () => false },
          { type: 'target', id: 't2' },
        ],
      },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, []);
    const rows = assertParity(container, 'a', 'source', canvas);
    expect(rowFor(rows, 'b|t1|real').invalid).toBe(true);
    expect(rowFor(rows, 'b|t1|real').limit).toBe(false);
    expect(rowFor(rows, 'b|t2|real').valid).toBe(true);
  });

  it('a source validator that depends on the target is evaluated per-target', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source', validate: (c) => c.target === 'b' }] },
      { id: 'b', handles: [{ type: 'target' }] },
      { id: 'c', handles: [{ type: 'target' }] },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, []);
    const rows = assertParity(container, 'a', 'source', canvas);
    expect(rowFor(rows, 'b|target|real').valid).toBe(true);
    expect(rowFor(rows, 'c|target|real').invalid).toBe(true);
  });

  it('global isValidConnection rejecting — all targets invalid, not limit-reached', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source' }] },
      { id: 'b', handles: [{ type: 'target' }] },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, [], { isValidConnection: () => false });
    const rows = assertParity(container, 'a', 'source', canvas);
    expect(rowFor(rows, 'b|target|real').invalid).toBe(true);
    expect(rowFor(rows, 'b|target|real').limit).toBe(false);
  });

  it('node.connectable === false — that node’s target is invalid', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source' }] },
      { id: 'b', connectable: false, handles: [{ type: 'target' }] },
      { id: 'c', handles: [{ type: 'target' }] },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, []);
    const rows = assertParity(container, 'a', 'source', canvas);
    expect(rowFor(rows, 'b|target|real').invalid).toBe(true);
    expect(rowFor(rows, 'b|target|real').limit).toBe(false);
    expect(rowFor(rows, 'c|target|real').valid).toBe(true);
  });

  it('connectableEnd === false handle — invalid via the early guard', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source' }] },
      {
        id: 'b',
        handles: [
          { type: 'target', id: 't1', connectableEnd: false },
          { type: 'target', id: 't2' },
        ],
      },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, []);
    const rows = assertParity(container, 'a', 'source', canvas);
    expect(rowFor(rows, 'b|t1|real').invalid).toBe(true);
    expect(rowFor(rows, 'b|t1|real').limit).toBe(false);
    expect(rowFor(rows, 'b|t2|real').valid).toBe(true);
  });

  it('mirror target in the same row gets the same class as its real counterpart', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source' }] },
      {
        id: 'b',
        handles: [
          { type: 'target', id: 'f' },
          { type: 'source', id: 'f' },
          { type: 'target', id: 'f', mirror: true },
          { type: 'source', id: 'f', mirror: true },
        ],
      },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, []);
    const rows = assertParity(container, 'a', 'source', canvas);
    expect(rowFor(rows, 'b|f|real').valid).toBe(true);
    expect(rowFor(rows, 'b|f|mirror').valid).toBe(true);
  });

  it('mirror target inherits the REAL handle limit — both real and mirror show limit-reached', () => {
    // The mirror divergence: legacy re-resolves the target handle (real-first in
    // DOM), so the mirror inherits the REAL handle's limit. Using the mirror
    // record's own (null) limit would wrongly mark the mirror valid.
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source' }] },
      {
        id: 'b',
        handles: [
          { type: 'target', id: 'f', limit: 1 },
          { type: 'source', id: 'f' },
          { type: 'target', id: 'f', mirror: true },
          { type: 'source', id: 'f', mirror: true },
        ],
      },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, [
      { id: 'e1', source: 'y', target: 'b', sourceHandle: 'source', targetHandle: 'f' },
    ]);
    const rows = assertParity(container, 'a', 'source', canvas);
    expect(rowFor(rows, 'b|f|real').invalid).toBe(true);
    expect(rowFor(rows, 'b|f|real').limit).toBe(true);
    expect(rowFor(rows, 'b|f|mirror').invalid).toBe(true);
    expect(rowFor(rows, 'b|f|mirror').limit).toBe(true);
  });

  it('reconnect via excludeEdgeId — the excluded edge no longer blocks its own target as a duplicate', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source' }] },
      { id: 'b', handles: [{ type: 'target' }] },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, [
      { id: 'e1', source: 'a', target: 'b', sourceHandle: 'source', targetHandle: 'target' },
    ]);
    // Without exclude → duplicate → invalid. With exclude → valid.
    const withoutExclude = assertParity(container, 'a', 'source', canvas);
    expect(rowFor(withoutExclude, 'b|target|real').invalid).toBe(true);

    const withExclude = assertParity(container, 'a', 'source', canvas, 'e1');
    expect(rowFor(withExclude, 'b|target|real').valid).toBe(true);
  });
});

// ── Zero-DOM-query guarantee ─────────────────────────────────────────────────

describe('applyValidationClasses — indexed path performs zero DOM queries', () => {
  it('does no querySelector(All) or getBoundingClientRect after the index is built', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source' }] },
      { id: 'b', handles: [{ type: 'target', id: 't1' }, { type: 'target', id: 't2' }] },
      { id: 'c', handles: [{ type: 'target' }] },
    ];
    const container = buildDom(nodes);
    const canvas = buildCanvas(nodes, [
      { id: 'e1', source: 'y', target: 'b', sourceHandle: 'source', targetHandle: 't1' },
    ]);

    const index = buildHandleIndex(container, toFlow);

    // Guard every handle's rect measurement (own-property stubs from stubRect).
    const rectSpies = Array.from(
      container.querySelectorAll<HTMLElement>('[data-flow-handle-type]'),
    ).map((el) => vi.spyOn(el, 'getBoundingClientRect'));

    const qsaSpy = vi.spyOn(container, 'querySelectorAll');
    const qsSpy = vi.spyOn(container, 'querySelector');

    applyValidationClasses(container, 'a', 'source', canvas, undefined, index);

    expect(qsaSpy).not.toHaveBeenCalled();
    expect(qsSpy).not.toHaveBeenCalled();
    for (const s of rectSpies) {
      expect(s).not.toHaveBeenCalled();
    }
  });
});
