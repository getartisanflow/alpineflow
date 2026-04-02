import { describe, it, expect } from 'vitest';

/**
 * Unit tests for x-flow-devtools config resolution logic.
 * Tests the pure functions (resolveConfig, shouldShowPerf, getEventMax)
 * without needing a DOM or Alpine.
 */

// Mirror the types from the directive
type PerfItem = 'fps' | 'memory' | 'counts' | 'visible';
interface DevtoolsConfig {
  perf?: boolean | PerfItem[];
  events?: boolean | { max?: number };
  viewport?: boolean;
  state?: boolean;
  activity?: boolean;
}

const ALL_SECTIONS: (keyof DevtoolsConfig)[] = ['perf', 'events', 'viewport', 'state', 'activity'];
const ALL_PERF_ITEMS: PerfItem[] = ['fps', 'memory', 'counts', 'visible'];
const DEFAULT_EVENT_MAX = 30;

function resolveConfig(expression: DevtoolsConfig | null, modifiers: string[]): DevtoolsConfig {
  if (expression && typeof expression === 'object' && Object.keys(expression).length > 0) {
    return expression;
  }
  const sectionMods = modifiers.filter(m => ALL_SECTIONS.includes(m as keyof DevtoolsConfig));
  if (sectionMods.length === 0) {
    return { perf: true, events: true, viewport: true, state: true, activity: true };
  }
  const config: DevtoolsConfig = {};
  for (const mod of sectionMods) {
    config[mod as keyof DevtoolsConfig] = true;
  }
  return config;
}

function shouldShowPerf(config: DevtoolsConfig): PerfItem[] {
  if (!config.perf) return [];
  if (config.perf === true) return [...ALL_PERF_ITEMS];
  return config.perf.filter(item => ALL_PERF_ITEMS.includes(item));
}

function getEventMax(config: DevtoolsConfig): number {
  if (!config.events) return 0;
  if (config.events === true) return DEFAULT_EVENT_MAX;
  return config.events.max ?? DEFAULT_EVENT_MAX;
}

describe('resolveConfig', () => {
  it('returns all sections when no expression and no modifiers', () => {
    const config = resolveConfig(null, []);
    expect(config).toEqual({ perf: true, events: true, viewport: true, state: true, activity: true });
  });

  it('enables only specified modifier sections', () => {
    const config = resolveConfig(null, ['perf', 'events']);
    expect(config.perf).toBe(true);
    expect(config.events).toBe(true);
    expect(config.viewport).toBeUndefined();
    expect(config.state).toBeUndefined();
    expect(config.activity).toBeUndefined();
  });

  it('ignores unknown modifiers', () => {
    const config = resolveConfig(null, ['perf', 'unknownmod', 'viewport']);
    expect(config.perf).toBe(true);
    expect(config.viewport).toBe(true);
    expect(Object.keys(config)).toEqual(['perf', 'viewport']);
  });

  it('expression wins over modifiers', () => {
    const config = resolveConfig({ perf: ['fps'] }, ['events', 'viewport']);
    expect(config).toEqual({ perf: ['fps'] });
  });

  it('falls back to modifiers when expression is null', () => {
    const config = resolveConfig(null, ['activity']);
    expect(config).toEqual({ activity: true });
  });

  it('falls back to modifiers when expression is empty object', () => {
    const config = resolveConfig({}, ['state']);
    expect(config).toEqual({ state: true });
  });

  it('single modifier works', () => {
    const config = resolveConfig(null, ['perf']);
    expect(config).toEqual({ perf: true });
  });

  it('all five modifiers together', () => {
    const config = resolveConfig(null, ['perf', 'events', 'viewport', 'state', 'activity']);
    expect(config).toEqual({ perf: true, events: true, viewport: true, state: true, activity: true });
  });
});

describe('shouldShowPerf', () => {
  it('returns all items when perf is true', () => {
    expect(shouldShowPerf({ perf: true })).toEqual(ALL_PERF_ITEMS);
  });

  it('returns empty when perf is undefined', () => {
    expect(shouldShowPerf({})).toEqual([]);
  });

  it('returns specified items only', () => {
    expect(shouldShowPerf({ perf: ['fps', 'counts'] })).toEqual(['fps', 'counts']);
  });

  it('filters out invalid items', () => {
    expect(shouldShowPerf({ perf: ['fps', 'invalid' as PerfItem] })).toEqual(['fps']);
  });

  it('returns empty array for empty perf array', () => {
    expect(shouldShowPerf({ perf: [] })).toEqual([]);
  });
});

describe('getEventMax', () => {
  it('returns 0 when events is undefined', () => {
    expect(getEventMax({})).toBe(0);
  });

  it('returns default max when events is true', () => {
    expect(getEventMax({ events: true })).toBe(DEFAULT_EVENT_MAX);
  });

  it('returns custom max from object config', () => {
    expect(getEventMax({ events: { max: 50 } })).toBe(50);
  });

  it('returns default max when object has no max', () => {
    expect(getEventMax({ events: {} })).toBe(DEFAULT_EVENT_MAX);
  });

  it('returns 0 when events is false', () => {
    expect(getEventMax({ events: false as any })).toBe(0);
  });
});
