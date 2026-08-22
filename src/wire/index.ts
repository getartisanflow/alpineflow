// ============================================================================
// @getartisanflow/alpineflow/wire — Livewire bridge addon
//
// Moves the Livewire integration out of core. Registered via registerAddon;
// setup(canvas) activates the bridge when a Livewire $wire proxy is present,
// mapping flow:* dispatches to canvas methods and AlpineFlow events to $wire
// method calls. Consumers register it with Alpine.plugin(AlpineFlowWire).
// ============================================================================

import { registerAddon } from '../core/registry';
import { registerWireEvents, registerWireCommands, registerCustomWireCommands, replayInitEvent } from './bridge';

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
      // reads, and _emit reads them from the closure config. Writing to the copy
      // leaves client→server forwarding silently dead — so if the core is too old
      // to expose _liveConfig(), skip forwarding and warn LOUDLY rather than
      // silently mutating the wrong object. This matters across the
      // alpineflow↔wireflow version boundary: WireFlow vendors AlpineFlow's
      // bundle as a separate artifact, so this addon can meet an older core.
      //
      // `_liveConfig()` is transitional. Everything forwarded here is also
      // dispatched by `_emit` as a bubbling `flow-<event>` CustomEvent carrying
      // the same detail — a listener on `_container` would need no private
      // accessor, no config mutation, would unsubscribe itself in the cleanup,
      // and would work against any core, which would retire the version-skew
      // warning above. Kept as-is here so this extraction is behaviour-for-
      // behaviour identical to 0.2.x; the DOM-event rewrite is the follow-up.
      const liveConfig = canvas._liveConfig?.();
      let restoreEvents: (() => void) | undefined;

      if (!liveConfig) {
        console.warn(
          '[wire] canvas._liveConfig() is unavailable — this AlpineFlow core is older than the /wire addon, so wireEvents client→server forwarding is disabled. Upgrade @getartisanflow/alpineflow to match the wire addon.',
        );
      } else if (liveConfig.wireEvents) {
        restoreEvents = registerWireEvents(liveConfig, $wire, liveConfig.wireEvents);

        // Core emitted `init` before addons were set up, so the mapping missed
        // the only one there will ever be. See `replayInitEvent`.
        replayInitEvent($wire, liveConfig.wireEvents);
      }

      const cleanupCommands = registerWireCommands(canvas, $wire);
      const cleanupCustom = registerCustomWireCommands(canvas, $wire);

      return () => {
        // The config first: leaving the wrappers behind is what turns a second
        // setup on the same config into a double call to $wire.
        restoreEvents?.();
        cleanupCommands();
        cleanupCustom();
      };
    },
  });
}
