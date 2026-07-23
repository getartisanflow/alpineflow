/**
 * Snap-targeting benchmark (Workstream A, Task A3).
 *
 * The pre-refactor `findSnapTarget` ran `querySelectorAll` + a per-handle
 * `closest()` + `getBoundingClientRect()` on EVERY connect-drag pointermove —
 * ~2,500 forced-layout rect reads per move at schema scale. The indexed path
 * reuses the drag-start `HandleIndex` (built once, measured once) and does
 * ZERO further DOM reads per move.
 *
 * Real DOM + real layout (this file runs in Chromium via
 * vitest.bench.config.ts), so the legacy branch's getBoundingClientRect calls
 * pay real forced-layout cost, same as `orthogonal.bench.ts`'s "pure
 * computation" shape but with a real measured DOM instead of pure math.
 */
import { bench, describe, afterAll } from 'vitest';
import { findSnapTarget } from '../../src/plugin/connection-utils';
import { buildHandleIndex } from '../../src/plugin/handle-index';

const HANDLE_COUNT = 2500;
const COLS = 50;

function buildContainer(count: number): HTMLElement {
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.width = `${COLS * 80}px`;
  container.style.height = `${Math.ceil(count / COLS) * 80}px`;
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const nodeEl = document.createElement('div');
    nodeEl.setAttribute('x-flow-node', '');
    nodeEl.dataset.flowNodeId = `n${i}`;
    nodeEl.style.position = 'absolute';
    nodeEl.style.left = `${(i % COLS) * 80}px`;
    nodeEl.style.top = `${Math.floor(i / COLS) * 80}px`;

    const handle = document.createElement('div');
    handle.dataset.flowHandleType = 'target';
    handle.dataset.flowHandleId = 'target';
    handle.style.position = 'absolute';
    handle.style.width = '10px';
    handle.style.height = '10px';
    nodeEl.appendChild(handle);

    container.appendChild(nodeEl);
  }

  return container;
}

const toFlowPosition = (screenX: number, screenY: number) => ({ x: screenX, y: screenY });
const getNode = () => ({ connectable: true });

describe('findSnapTarget — legacy vs indexed over 2,500 handles', () => {
  const container = buildContainer(HANDLE_COUNT);
  // Cursor lands on a real handle center so both paths do a genuine
  // full-sweep-then-match, not a full-sweep-then-miss.
  const cursorFlowPos = { x: 2000, y: 2000 };
  const index = buildHandleIndex(container, toFlowPosition);

  afterAll(() => {
    container.remove();
  });

  bench(
    'legacy snap (querySelectorAll + getBoundingClientRect per handle)',
    () => {
      findSnapTarget({
        containerEl: container,
        handleType: 'target',
        excludeNodeId: 'none',
        cursorFlowPos,
        connectionSnapRadius: 50,
        getNode,
        toFlowPosition,
      });
    },
    { iterations: 30 },
  );

  bench(
    'indexed snap (reuse prebuilt HandleIndex, zero DOM reads)',
    () => {
      findSnapTarget({
        containerEl: container,
        handleType: 'target',
        excludeNodeId: 'none',
        cursorFlowPos,
        connectionSnapRadius: 50,
        getNode,
        toFlowPosition,
        index,
      });
    },
    { iterations: 30 },
  );
});
