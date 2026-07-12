// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { buildHandleIndex } from './handle-index';
import { HANDLE_LIMIT_KEY } from './directives/flow-handle-limit';
import { HANDLE_VALIDATE_KEY } from './directives/flow-handle-validate';
import {
  HANDLE_CONNECTABLE_START_KEY,
  HANDLE_CONNECTABLE_END_KEY,
} from './directives/flow-handle-connectable';
import type { XYPosition } from '../core/types';

/** Stub `getBoundingClientRect` the way sibling tests do (see connection-utils.test.ts). */
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

/** Deterministic, non-identity transform so tests can prove toFlowPosition was actually used. */
function toFlowPosition(screenX: number, screenY: number): XYPosition {
  return { x: screenX * 2, y: screenY + 100 };
}

/**
 * Build a fixture matching flow-schema.ts `renderRow()`'s exact handle
 * conventions and DOM emission order: for each field row, a real target
 * handle (left), a real source handle (right), then a mirror target handle
 * and a mirror source handle sharing the same (id, type) — see
 * src/plugin/directives/flow-schema.ts `renderRow`.
 */
function createSchemaFixture() {
  const container = document.createElement('div');

  function createNode(nodeId: string, fields: string[]) {
    const node = document.createElement('div');
    node.setAttribute('x-flow-node', '');
    node.dataset.flowNodeId = nodeId;

    const handles: Record<string, HTMLElement> = {};

    for (const field of fields) {
      const row = document.createElement('div');
      row.className = 'flow-schema-row';

      const target = document.createElement('div');
      target.className = 'flow-schema-handle flow-schema-handle--target';
      target.dataset.flowHandleType = 'target';
      target.dataset.flowHandleId = field;
      stubRect(target, { left: 100, top: 50, width: 20, height: 10 });
      row.appendChild(target);
      handles[`${field}-target-real`] = target;

      const source = document.createElement('div');
      source.className = 'flow-schema-handle flow-schema-handle--source';
      source.dataset.flowHandleType = 'source';
      source.dataset.flowHandleId = field;
      stubRect(source, { left: 300, top: 50, width: 20, height: 10 });
      row.appendChild(source);
      handles[`${field}-source-real`] = source;

      const mirrorTarget = document.createElement('div');
      mirrorTarget.className =
        'flow-schema-handle flow-schema-handle--target flow-schema-handle--mirror';
      mirrorTarget.dataset.flowHandleType = 'target';
      mirrorTarget.dataset.flowHandleId = field;
      stubRect(mirrorTarget, { left: 300, top: 50, width: 20, height: 10 });
      row.appendChild(mirrorTarget);
      handles[`${field}-target-mirror`] = mirrorTarget;

      const mirrorSource = document.createElement('div');
      mirrorSource.className =
        'flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror';
      mirrorSource.dataset.flowHandleType = 'source';
      mirrorSource.dataset.flowHandleId = field;
      stubRect(mirrorSource, { left: 100, top: 50, width: 20, height: 10 });
      row.appendChild(mirrorSource);
      handles[`${field}-source-mirror`] = mirrorSource;

      node.appendChild(row);
    }

    container.appendChild(node);
    return handles;
  }

  // 2 nodes x 2 rows (fields) = 16 handles total (before exclusions).
  const usersHandles = createNode('users', ['id', 'email']);
  const postsHandles = createNode('posts', ['id', 'title']);

  // A hidden (display:none) handle reports an all-zero rect in real browsers
  // and always does in jsdom by default — simulate it explicitly here so the
  // exclusion is asserted rather than incidental to jsdom's default stubbing.
  stubRect(usersHandles['id-target-real'], { left: 0, top: 0, width: 0, height: 0 });

  return { container, usersHandles, postsHandles };
}

describe('buildHandleIndex', () => {
  it('includes only non-zero-size handles', () => {
    const { container, usersHandles } = createSchemaFixture();
    const index = buildHandleIndex(container, toFlowPosition);

    // 16 handles total, minus the one zero-size handle stubbed out above.
    expect(index.all.length).toBe(15);
    expect(index.all.some((r) => r.el === usersHandles['id-target-real'])).toBe(false);
  });

  it('splits handles by type via byType()', () => {
    const { container } = createSchemaFixture();
    const index = buildHandleIndex(container, toFlowPosition);

    expect(index.byType('source').length).toBe(8);
    expect(index.byType('target').length).toBe(7); // one target excluded (zero-size)
    expect(index.byType('source').every((r) => r.type === 'source')).toBe(true);
    expect(index.byType('target').every((r) => r.type === 'target')).toBe(true);
  });

  it('get() prefers the real handle over its mirror', () => {
    const { container, usersHandles } = createSchemaFixture();
    const index = buildHandleIndex(container, toFlowPosition);

    const record = index.get('users', 'email', 'target');
    expect(record).toBeDefined();
    expect(record!.el).toBe(usersHandles['email-target-real']);
    expect(record!.isMirror).toBe(false);
  });

  it('get() falls back to the mirror when the real handle is excluded as zero-size', () => {
    const { container } = createSchemaFixture();
    const index = buildHandleIndex(container, toFlowPosition);

    // The real 'id' target on 'users' was stubbed to zero-size; its mirror
    // (also 'id'/'target') is the only remaining candidate under that key.
    const record = index.get('users', 'id', 'target');
    expect(record).toBeDefined();
    expect(record!.isMirror).toBe(true);
  });

  it('get() returns undefined for a key with neither a real nor a mirror handle', () => {
    const { container } = createSchemaFixture();
    const index = buildHandleIndex(container, toFlowPosition);

    expect(index.get('nope', 'nope', 'source')).toBeUndefined();
  });

  it('get() prefers the real handle even when its mirror is measured FIRST', () => {
    // Author the mirror BEFORE its real counterpart in document order so the
    // mirror is inserted into the byKey map first. This is the only shape that
    // exercises the `existing.isMirror && !record.isMirror` replacement branch;
    // a naive first-wins map would return the mirror here and fail.
    const container = document.createElement('div');
    const node = document.createElement('div');
    node.setAttribute('x-flow-node', '');
    node.dataset.flowNodeId = 'orders';

    const mirror = document.createElement('div');
    mirror.className = 'flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror';
    mirror.dataset.flowHandleType = 'source';
    mirror.dataset.flowHandleId = 'total';
    stubRect(mirror, { left: 100, top: 50, width: 20, height: 10 });
    node.appendChild(mirror); // mirror first

    const real = document.createElement('div');
    real.className = 'flow-schema-handle flow-schema-handle--source';
    real.dataset.flowHandleType = 'source';
    real.dataset.flowHandleId = 'total';
    stubRect(real, { left: 300, top: 50, width: 20, height: 10 });
    node.appendChild(real); // real second

    container.appendChild(node);

    const index = buildHandleIndex(container, toFlowPosition);
    const record = index.get('orders', 'total', 'source');
    expect(record).toBeDefined();
    expect(record!.el).toBe(real);
    expect(record!.isMirror).toBe(false);
  });

  it('computes flowX/flowY from toFlowPosition(rect center)', () => {
    const { container, usersHandles } = createSchemaFixture();
    const index = buildHandleIndex(container, toFlowPosition);

    const record = index.all.find((r) => r.el === usersHandles['email-target-real'])!;
    // rect: left 100, top 50, width 20, height 10 -> center (110, 55)
    const expected = toFlowPosition(110, 55);
    expect(record.flowX).toBe(expected.x);
    expect(record.flowY).toBe(expected.y);
  });

  it('resolves nodeId and handleId from data attributes', () => {
    const { container, postsHandles } = createSchemaFixture();
    const index = buildHandleIndex(container, toFlowPosition);

    const record = index.all.find((r) => r.el === postsHandles['title-source-real'])!;
    expect(record.nodeId).toBe('posts');
    expect(record.handleId).toBe('title');
    expect(record.type).toBe('source');
    expect(record.isMirror).toBe(false);
  });

  it('defaults connectable/validator/limit fields when no expandos are set', () => {
    const { container, usersHandles } = createSchemaFixture();
    const index = buildHandleIndex(container, toFlowPosition);

    const record = index.all.find((r) => r.el === usersHandles['email-target-real'])!;
    expect(record.connectableStart).toBe(true);
    expect(record.connectableEnd).toBe(true);
    expect(record.hasValidator).toBe(false);
    expect(record.limit).toBeNull();
  });

  it('reads connectable/validator/limit expandos when set on the element', () => {
    const { container, usersHandles } = createSchemaFixture();
    const handle = usersHandles['email-source-real'];
    handle[HANDLE_CONNECTABLE_START_KEY] = false;
    handle[HANDLE_CONNECTABLE_END_KEY] = false;
    handle[HANDLE_VALIDATE_KEY] = () => true;
    handle[HANDLE_LIMIT_KEY] = 3;

    const index = buildHandleIndex(container, toFlowPosition);
    const record = index.all.find((r) => r.el === handle)!;

    expect(record.connectableStart).toBe(false);
    expect(record.connectableEnd).toBe(false);
    expect(record.hasValidator).toBe(true);
    expect(record.limit).toBe(3);
  });

  it('ignores handle elements with no owning [data-flow-node-id] ancestor', () => {
    const container = document.createElement('div');
    const orphan = document.createElement('div');
    orphan.dataset.flowHandleType = 'source';
    orphan.dataset.flowHandleId = 'orphan';
    stubRect(orphan, { left: 0, top: 0, width: 10, height: 10 });
    container.appendChild(orphan);

    const index = buildHandleIndex(container, toFlowPosition);
    expect(index.all.length).toBe(0);
  });
});
