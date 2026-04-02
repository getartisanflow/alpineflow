// ============================================================================
// canvas-config — Runtime config patching mixin for flow-canvas
//
// Applies partial configuration changes at runtime: pan/zoom settings,
// background, debug mode, color mode, auto-layout, and behavioral flags.
//
// Cross-mixin deps (optional chaining): ctx._panZoom, ctx._applyBackground,
// ctx._scheduleAutoLayout, ctx._container, ctx._colorModeHandle
// ============================================================================

import type { CanvasContext } from './canvas-context';
import type { AutoLayoutConfig } from '../../core/types';
import { setDebugEnabled } from '../../core/debug';
import { createColorMode } from '../../core/color-mode';

export function createConfigMixin(ctx: CanvasContext) {
  return {
    _applyConfigPatch(changes: Record<string, any>) {
      const c = ctx._config as any;

      for (const [key, val] of Object.entries(changes)) {
        if (val === undefined) continue;
        (c as any)[key] = val;

        switch (key) {
          case 'pannable':
          case 'zoomable':
          case 'minZoom':
          case 'maxZoom':
          case 'panOnScroll':
          case 'panOnScrollDirection':
          case 'panOnScrollSpeed':
            ctx._panZoom?.update({ [key]: val });
            break;
          case 'background':
            ctx._background = val;
            ctx._applyBackground();
            break;
          case 'backgroundGap':
            ctx._backgroundGap = val;
            if (ctx._container) {
              ctx._container.style.setProperty('--flow-bg-pattern-gap', String(val));
            }
            break;
          case 'patternColor':
            ctx._patternColorOverride = val;
            if (ctx._container) {
              ctx._container.style.setProperty('--flow-bg-pattern-color', val);
            }
            break;
          case 'debug':
            setDebugEnabled(!!val);
            break;
          case 'preventOverlap':
            (ctx._config as any).preventOverlap = val as boolean | number;
            break;
          case 'reconnectOnDelete':
            (ctx._config as any).reconnectOnDelete = val as boolean;
            break;
          case 'nodeOrigin':
            (ctx._config as any).nodeOrigin = val as [number, number];
            break;
          case 'preventCycles':
            (ctx._config as any).preventCycles = val as boolean;
            break;
          case 'loading':
            ctx._userLoading = !!val;
            break;
          case 'loadingText':
            ctx._loadingText = val as string;
            break;
          case 'colorMode':
            (ctx._config as any).colorMode = val as 'light' | 'dark' | 'system' | undefined;
            if (val && ctx._container) {
              if (!ctx._colorModeHandle) {
                ctx._colorModeHandle = createColorMode(ctx._container, val as any);
              } else {
                ctx._colorModeHandle.update(val as any);
              }
            } else if (!val && ctx._colorModeHandle) {
              ctx._colorModeHandle.destroy();
              ctx._colorModeHandle = null;
            }
            break;
          case 'autoLayout':
            c.autoLayout = val ? val as AutoLayoutConfig : undefined;
            ctx._autoLayoutFailed = false;
            if (val) {
              ctx._autoLayoutReady = true;
              ctx._scheduleAutoLayout();
            } else {
              ctx._autoLayoutReady = false;
              if (ctx._autoLayoutTimer) {
                clearTimeout(ctx._autoLayoutTimer);
                ctx._autoLayoutTimer = null;
              }
            }
            break;
        }
      }
    },
  };
}
