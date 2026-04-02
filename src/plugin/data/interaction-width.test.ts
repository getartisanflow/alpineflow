import { describe, it, expect } from 'vitest';

/**
 * Tests for the interactionWidth resolution chain:
 *   edge.interactionWidth → config.defaultInteractionWidth → 20
 *
 * The actual rendering happens in the flow-edge directive. Here we unit-test
 * the resolution logic in isolation.
 */

function resolveInteractionWidth(
  edge: { interactionWidth?: number },
  config: { defaultInteractionWidth?: number } | undefined,
): number {
  return edge.interactionWidth ?? config?.defaultInteractionWidth ?? 20;
}

describe('interactionWidth resolution', () => {
  it('falls back to 20 when neither edge nor config specify it', () => {
    expect(resolveInteractionWidth({}, undefined)).toBe(20);
    expect(resolveInteractionWidth({}, {})).toBe(20);
  });

  it('uses config default when edge does not specify', () => {
    expect(resolveInteractionWidth({}, { defaultInteractionWidth: 30 })).toBe(30);
  });

  it('uses per-edge value when set', () => {
    expect(resolveInteractionWidth({ interactionWidth: 40 }, undefined)).toBe(40);
  });

  it('per-edge value overrides config default', () => {
    expect(resolveInteractionWidth({ interactionWidth: 50 }, { defaultInteractionWidth: 30 })).toBe(50);
  });

  it('handles zero as a valid per-edge value', () => {
    expect(resolveInteractionWidth({ interactionWidth: 0 }, { defaultInteractionWidth: 30 })).toBe(0);
  });
});
