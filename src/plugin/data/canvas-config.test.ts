// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockCtx } from './__test-utils';
import { createConfigMixin } from './canvas-config';

// ── Mock debug ───────────────────────────────────────────────────────────────

vi.mock('../../core/debug', () => ({
  setDebugEnabled: vi.fn(),
}));

// ── Mock color-mode ──────────────────────────────────────────────────────────

const mockColorModeHandle = {
  update: vi.fn(),
  destroy: vi.fn(),
};

vi.mock('../../core/color-mode', () => ({
  createColorMode: vi.fn(() => mockColorModeHandle),
}));

import { setDebugEnabled } from '../../core/debug';
import { createColorMode } from '../../core/color-mode';

// ── Tests ────────────────────────────────────────────────────────────────────

describe('createConfigMixin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Pan/Zoom settings ───────────────────────────────────────────────────

  describe('pan/zoom settings', () => {
    it('forwards pannable to _panZoom.update', () => {
      const update = vi.fn();
      const ctx = mockCtx({ _panZoom: { update } as any });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ pannable: false });

      expect(update).toHaveBeenCalledWith({ pannable: false });
    });

    it('forwards zoomable to _panZoom.update', () => {
      const update = vi.fn();
      const ctx = mockCtx({ _panZoom: { update } as any });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ zoomable: false });

      expect(update).toHaveBeenCalledWith({ zoomable: false });
    });

    it('forwards minZoom to _panZoom.update', () => {
      const update = vi.fn();
      const ctx = mockCtx({ _panZoom: { update } as any });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ minZoom: 0.5 });

      expect(update).toHaveBeenCalledWith({ minZoom: 0.5 });
    });

    it('forwards maxZoom to _panZoom.update', () => {
      const update = vi.fn();
      const ctx = mockCtx({ _panZoom: { update } as any });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ maxZoom: 3 });

      expect(update).toHaveBeenCalledWith({ maxZoom: 3 });
    });

    it('forwards panOnScroll to _panZoom.update', () => {
      const update = vi.fn();
      const ctx = mockCtx({ _panZoom: { update } as any });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ panOnScroll: true });

      expect(update).toHaveBeenCalledWith({ panOnScroll: true });
    });

    it('handles missing _panZoom gracefully', () => {
      const ctx = mockCtx({ _panZoom: null });
      const mixin = createConfigMixin(ctx);

      // Should not throw
      mixin._applyConfigPatch({ pannable: false });
    });
  });

  // ── Background ──────────────────────────────────────────────────────────

  describe('background', () => {
    it('sets _background and calls _applyBackground', () => {
      const ctx = mockCtx();
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ background: 'lines' });

      expect(ctx._background).toBe('lines');
      expect(ctx._applyBackground).toHaveBeenCalled();
    });

    it('sets backgroundGap and CSS variable on container', () => {
      const container = document.createElement('div');
      const ctx = mockCtx({ _container: container });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ backgroundGap: 30 });

      expect(ctx._backgroundGap).toBe(30);
      expect(container.style.getPropertyValue('--flow-bg-pattern-gap')).toBe('30');
    });

    it('sets patternColor and CSS variable on container', () => {
      const container = document.createElement('div');
      const ctx = mockCtx({ _container: container });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ patternColor: '#abc123' });

      expect(ctx._patternColorOverride).toBe('#abc123');
      expect(container.style.getPropertyValue('--flow-bg-pattern-color')).toBe('#abc123');
    });

    it('skips CSS variable when container is null', () => {
      const ctx = mockCtx({ _container: null });
      const mixin = createConfigMixin(ctx);

      // Should not throw
      mixin._applyConfigPatch({ backgroundGap: 30 });
      expect(ctx._backgroundGap).toBe(30);
    });
  });

  // ── Debug flag ──────────────────────────────────────────────────────────

  describe('debug', () => {
    it('calls setDebugEnabled(true) when debug is truthy', () => {
      const ctx = mockCtx();
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ debug: true });

      expect(setDebugEnabled).toHaveBeenCalledWith(true);
    });

    it('calls setDebugEnabled(false) when debug is falsy', () => {
      const ctx = mockCtx();
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ debug: false });

      expect(setDebugEnabled).toHaveBeenCalledWith(false);
    });
  });

  // ── Behavioral flags ───────────────────────────────────────────────────

  describe('behavioral flags', () => {
    it('sets preventOverlap on config', () => {
      const ctx = mockCtx();
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ preventOverlap: 10 });

      expect((ctx._config as any).preventOverlap).toBe(10);
    });

    it('sets reconnectOnDelete on config', () => {
      const ctx = mockCtx();
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ reconnectOnDelete: true });

      expect((ctx._config as any).reconnectOnDelete).toBe(true);
    });

    it('sets nodeOrigin on config', () => {
      const ctx = mockCtx();
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ nodeOrigin: [0.5, 0.5] });

      expect((ctx._config as any).nodeOrigin).toEqual([0.5, 0.5]);
    });

    it('sets preventCycles on config', () => {
      const ctx = mockCtx();
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ preventCycles: true });

      expect((ctx._config as any).preventCycles).toBe(true);
    });

    it('sets _userLoading for loading flag', () => {
      const ctx = mockCtx();
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ loading: true });

      expect(ctx._userLoading).toBe(true);
    });
  });

  // ── Color mode ──────────────────────────────────────────────────────────

  describe('colorMode', () => {
    it('creates a new colorMode handle when none exists', () => {
      const container = document.createElement('div');
      const ctx = mockCtx({ _container: container, _colorModeHandle: null });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ colorMode: 'dark' });

      expect(createColorMode).toHaveBeenCalledWith(container, 'dark');
      expect(ctx._colorModeHandle).toBe(mockColorModeHandle);
    });

    it('updates existing colorMode handle', () => {
      const container = document.createElement('div');
      const existingHandle = { update: vi.fn(), destroy: vi.fn() };
      const ctx = mockCtx({ _container: container, _colorModeHandle: existingHandle as any });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ colorMode: 'light' });

      expect(existingHandle.update).toHaveBeenCalledWith('light');
      expect(createColorMode).not.toHaveBeenCalled();
    });

    it('destroys colorMode handle when set to falsy', () => {
      const destroyFn = vi.fn();
      const existingHandle = { update: vi.fn(), destroy: destroyFn };
      const ctx = mockCtx({ _colorModeHandle: existingHandle as any });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ colorMode: null });

      expect(destroyFn).toHaveBeenCalled();
      expect(ctx._colorModeHandle).toBeNull();
    });

    it('skips creation when container is null', () => {
      const ctx = mockCtx({ _container: null, _colorModeHandle: null });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ colorMode: 'system' });

      expect(createColorMode).not.toHaveBeenCalled();
    });
  });

  // ── Auto-layout ─────────────────────────────────────────────────────────

  describe('autoLayout', () => {
    it('schedules auto-layout when enabled', () => {
      const ctx = mockCtx();
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ autoLayout: { algorithm: 'dagre' } });

      expect(ctx._autoLayoutReady).toBe(true);
      expect(ctx._autoLayoutFailed).toBe(false);
      expect(ctx._scheduleAutoLayout).toHaveBeenCalled();
    });

    it('disables auto-layout when set to falsy', () => {
      const timer = setTimeout(() => {}, 10000);
      const ctx = mockCtx({ _autoLayoutTimer: timer, _autoLayoutReady: true });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ autoLayout: null });

      expect(ctx._autoLayoutReady).toBe(false);
      expect(ctx._autoLayoutTimer).toBeNull();
      clearTimeout(timer);
    });

    it('clears existing timer when disabling', () => {
      const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
      const timer = setTimeout(() => {}, 10000);
      const ctx = mockCtx({ _autoLayoutTimer: timer });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ autoLayout: false as any });

      expect(clearTimeoutSpy).toHaveBeenCalledWith(timer);
      clearTimeoutSpy.mockRestore();
      clearTimeout(timer);
    });
  });

  // ── Undefined values ────────────────────────────────────────────────────

  describe('undefined values', () => {
    it('skips keys with undefined values', () => {
      const update = vi.fn();
      const ctx = mockCtx({ _panZoom: { update } as any });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({ pannable: undefined, debug: undefined });

      expect(update).not.toHaveBeenCalled();
      expect(setDebugEnabled).not.toHaveBeenCalled();
    });
  });

  // ── Multiple keys in one patch ──────────────────────────────────────────

  describe('multiple keys', () => {
    it('applies multiple changes in a single patch', () => {
      const update = vi.fn();
      const container = document.createElement('div');
      const ctx = mockCtx({ _panZoom: { update } as any, _container: container });
      const mixin = createConfigMixin(ctx);

      mixin._applyConfigPatch({
        pannable: false,
        background: 'cross',
        debug: true,
      });

      expect(update).toHaveBeenCalledWith({ pannable: false });
      expect(ctx._background).toBe('cross');
      expect(setDebugEnabled).toHaveBeenCalledWith(true);
    });
  });
});
