// ============================================================================
// Real-factory test harness
//
// Some flow-canvas behaviour (background, viewport-frame coalescing) lives
// directly on the flowCanvas() data object rather than in a mixin, so mockCtx()
// cannot reach it. This captures the real Alpine.data factory with a stub Alpine
// and invokes it to obtain the genuine `self` object. The plain methods under
// test (backgroundStyle, _applyBackground, _onViewportTransform,
// _flushViewportFrame, …) run without any Alpine reactivity.
// ============================================================================

import { registerFlowCanvas } from './flow-canvas';
import type { FlowCanvasConfig } from '../../core/types';

/** Construct a real flowCanvas() data object for unit tests (no Alpine mount). */
export function realCanvas(config: FlowCanvasConfig = {}): any {
  let factory: ((c: FlowCanvasConfig) => any) | null = null;
  const stubAlpine: any = {
    data: (_name: string, fn: (c: FlowCanvasConfig) => any) => {
      factory = fn;
    },
    raw: (x: any) => x,
    reactive: (x: any) => x,
  };
  registerFlowCanvas(stubAlpine);
  if (!factory) throw new Error('flowCanvas factory was not captured');
  return (factory as (c: FlowCanvasConfig) => any)(config);
}
