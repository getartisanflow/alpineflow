// ============================================================================
// @getartisanflow/alpineflow/wire — Livewire bridge addon
//
// Moves the Livewire integration out of core. Registered via registerAddon;
// setup(canvas) activates the bridge when a Livewire $wire proxy is present,
// mapping flow:* dispatches to canvas methods and AlpineFlow events to $wire
// method calls. Consumers register it with Alpine.plugin(AlpineFlowWire).
// ============================================================================

import { registerAddon } from '../core/registry';
import { registerWireEvents, registerWireCommands, registerCustomWireCommands } from './bridge';

// Re-declare the Livewire config field that used to live in core types.ts, so
// TypeScript consumers of this addon keep `wireEvents` on their canvas config.
declare module '../core/types' {
  interface FlowCanvasConfig {
    /** Map of AlpineFlow event names to Livewire method names (set by the WireFlow Blade component). */
    wireEvents?: Record<string, string>;
  }
}

export default function AlpineFlowWire(_Alpine: any): void {
  registerAddon('wire', {
    setup(canvas: any): (() => void) | void {
      const $wire = canvas?.$wire;
      if (!$wire) return;

      // Target the LIVE closure config, not the stripped `_config` copy:
      // registerWireEvents overrides the on<Event> callbacks that core's _emit
      // reads, and _emit reads them from the closure config. Writing to the
      // copy would leave the client→server forwarding silently dead.
      //
      // Known limitation: core emits 'init' from _initChildLayout() BEFORE
      // _initAddons() runs this setup, so a wireEvents mapping for 'init' does
      // not forward. All other lifecycle/interaction events fire after setup and
      // forward normally. (Reordering core init to fix this is deliberately not
      // done — other addons rely on _container/ResizeObserver being ready first.)
      const config = canvas._liveConfig?.() ?? canvas._config ?? {};
      if (config.wireEvents) {
        registerWireEvents(config, $wire, config.wireEvents);
      }
      const cleanupCommands = registerWireCommands(canvas, $wire);
      const cleanupCustom = registerCustomWireCommands(canvas, $wire);
      return () => { cleanupCommands(); cleanupCustom(); };
    },
  });
}
