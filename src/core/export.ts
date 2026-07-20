// ============================================================================
// Export Utilities
//
// Captures the flow canvas as a PNG, JPEG or SVG image via html-to-image
// (dynamically imported). Supports full-graph and viewport-only capture modes.
//
// Uses toSvg() + manual canvas rendering instead of toPng()/toJpeg() directly,
// because Alpine.js directives (@click, x-data, :class) produce attribute
// names with @ and : that are invalid XML — breaking the SVG foreignObject
// when loaded as an <img>. Capturing vector-first also means the SVG format
// is just the intermediate handed back before rasterization, not extra work.
// ============================================================================

import { getNodesBounds, getViewportForBounds } from './geometry';
import type { FlowNode, Viewport, ToImageOptions } from './types';

/**
 * Strip attributes whose names are invalid in XML (e.g. Alpine's @click, :class).
 * Also removes externalResourcesRequired which can cause image load failures.
 */
function sanitizeSvg(svg: string): string {
  return svg
    // Remove Alpine-style attributes that are invalid XML:
    //   @click="..."  :class="..."  x-data="..."  x-flow-handle:target="..."
    .replace(/\s+(?:@|:|x-)[\w.:-]*="[^"]*"/g, '')
    // Remove externalResourcesRequired (can cause image load failures)
    .replace(/\s+externalResourcesRequired="[^"]*"/g, '');
}

/**
 * SVG paint properties that must survive the capture. Edges (and any other SVG
 * geometry) are painted from stylesheets, not markup — `.flow-edge-svg path` has
 * no `stroke` attribute of its own.
 */
const SVG_PAINT_PROPS = [
  'stroke',
  'stroke-width',
  'stroke-opacity',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-linecap',
  'stroke-linejoin',
  'fill',
  'fill-opacity',
  'fill-rule',
  'opacity',
  'marker-start',
  'marker-mid',
  'marker-end',
] as const;

/**
 * Bake each SVG shape's COMPUTED paint into presentation attributes for the
 * duration of a capture, returning an undo function.
 *
 * html-to-image serializes the DOM into an SVG `foreignObject`. It preserves SVG
 * paint expressed as presentation attributes, but drops paint that comes from a
 * stylesheet — so CSS-styled geometry silently renders unpainted. AlpineFlow's
 * edges are exactly that case (their stroke lives in CSS, not on the element), so
 * without this every edge exports invisible while the nodes come through fine.
 *
 * Copying the *computed* value also resolves `var(--flow-edge-stroke)` and friends
 * to concrete colours, which the serialized document can't resolve on its own.
 */
function inlineSvgPaint(container: HTMLElement): () => void {
  const shapes = container.querySelectorAll<SVGElement>(
    'svg path, svg line, svg polyline, svg polygon, svg circle, svg ellipse, svg rect, svg text',
  );
  const undo: Array<() => void> = [];

  for (const el of shapes) {
    const computed = getComputedStyle(el);
    const previous: Array<[string, string | null]> = [];

    for (const prop of SVG_PAINT_PROPS) {
      const value = computed.getPropertyValue(prop);
      if (!value) continue;
      previous.push([prop, el.getAttribute(prop)]);
      el.setAttribute(prop, value);
    }

    if (previous.length > 0) {
      undo.push(() => {
        for (const [prop, original] of previous) {
          if (original === null) el.removeAttribute(prop);
          else el.setAttribute(prop, original);
        }
      });
    }
  }

  return () => {
    for (const restore of undo) restore();
  };
}

/** Largest canvas edge browsers reliably allocate. */
const MAX_CANVAS_DIMENSION = 16384;
/** Total-pixel budget (~160MB at 4 bytes/px). Exceeding it fails allocation, not just size. */
const MAX_CANVAS_PIXELS = 40_000_000;
/** Practical ceiling — beyond this is a mistake, not a request. */
const MAX_SCALE = 8;

/**
 * Resolve the requested `scale` into a multiplier the canvas can actually render.
 *
 * Bounded three ways: an absolute ceiling, the max canvas edge, and a total-pixel
 * budget — the last matters most, since an over-large canvas fails on *allocation*
 * (a 16384-wide canvas is fine until you multiply by the height). Over-range values
 * are clamped rather than thrown, because the failure mode of an unrenderable canvas
 * is a silently BLANK png, which is far worse to debug than a slightly smaller image.
 * Never clamps below 1, so a plain 1x export always works. Non-finite/non-positive
 * values fall back to 1.
 */
function resolveScale(scale: number | undefined, width: number, height: number): number {
  if (typeof scale !== 'number' || !Number.isFinite(scale) || scale <= 0) return 1;
  const byDimension = MAX_CANVAS_DIMENSION / Math.max(width, height);
  const byArea = Math.sqrt(MAX_CANVAS_PIXELS / Math.max(1, width * height));
  const ceiling = Math.max(1, Math.min(MAX_SCALE, byDimension, byArea));
  return Math.min(scale, ceiling);
}

/** Default JPEG quality. Passed explicitly rather than left to the browser, whose
 *  own default for a missing argument is unspecified and varies by engine. */
const DEFAULT_JPEG_QUALITY = 0.92;

/** Clamp to the 0-1 range canvas expects; anything invalid falls back to the default. */
function resolveQuality(quality: number | undefined): number {
  if (typeof quality !== 'number' || !Number.isFinite(quality)) return DEFAULT_JPEG_QUALITY;
  return Math.min(1, Math.max(0, quality));
}

/** Escape a value for use inside a double-quoted XML attribute. */
function escapeXmlAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/**
 * Paint the background into the SVG markup itself.
 *
 * The raster path fills the canvas before drawing, but an SVG file has no canvas —
 * html-to-image emits no background of its own, so without this the export is
 * transparent, which most viewers and editors render against black or a checkerboard.
 * Inserting the rect immediately after the opening tag puts it behind all content.
 */
function withSvgBackground(svgString: string, background: string): string {
  const openTagEnd = svgString.indexOf('>');
  if (openTagEnd === -1) return svgString;
  const rect = `<rect width="100%" height="100%" fill="${escapeXmlAttribute(background)}"/>`;
  return svgString.slice(0, openTagEnd + 1) + rect + svgString.slice(openTagEnd + 1);
}

/**
 * Render a sanitized SVG string to a raster data URL via canvas.
 *
 * `scale` multiplies the raster resolution while leaving the logical layout alone:
 * the canvas is allocated `scale` times larger and the context scaled to match, so
 * the (vector) SVG re-rasterizes at the higher resolution instead of being upscaled.
 *
 * The background fill is not optional for JPEG: it has no alpha channel, so an
 * unpainted canvas would encode as solid black rather than staying transparent.
 */
function svgToRaster(
  svgString: string,
  width: number,
  height: number,
  background: string,
  scale = 1,
  format: 'png' | 'jpeg' = 'png',
  quality?: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext('2d')!;
      ctx.scale(scale, scale);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      // Draw at the LOGICAL size — the context scale maps it onto the larger canvas.
      ctx.drawImage(img, 0, 0, width, height);
      resolve(
        format === 'jpeg'
          ? canvas.toDataURL('image/jpeg', resolveQuality(quality))
          : canvas.toDataURL('image/png'),
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to render SVG to image'));
    };

    // Use data URL (not Blob URL) — Blob URLs taint the canvas
    // when the SVG contains foreignObject
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  });
}

/**
 * Capture the flow canvas as a PNG data URL.
 *
 * @param container  The .flow-container element
 * @param viewportEl The .flow-viewport element
 * @param nodes      All non-hidden nodes (for bounds calculation)
 * @param viewport   Current viewport state
 * @param options    Export options
 * @returns          data:image/png;base64,... string
 */
export async function captureFlowImage(
  container: HTMLElement,
  viewportEl: HTMLElement,
  nodes: FlowNode[],
  viewport: Viewport,
  options: ToImageOptions = {},
): Promise<string> {
  let toSvg: (node: HTMLElement, options?: any) => Promise<string>;
  try {
    ({ toSvg } = await import('html-to-image'));
  } catch {
    throw new Error('toImage() requires html-to-image. Install it with: npm install html-to-image');
  }

  const scope = options.scope ?? 'all';
  const containerRect = container.getBoundingClientRect();

  // Determine image dimensions
  const imageWidth = scope === 'viewport'
    ? containerRect.width
    : (options.width ?? 1920);
  const imageHeight = scope === 'viewport'
    ? containerRect.height
    : (options.height ?? 1080);

  // Resolve background color
  const background = options.background
    ?? (getComputedStyle(container).getPropertyValue('--flow-bg-color').trim()
    || '#ffffff');

  // Save original state
  const origTransform = viewportEl.style.transform;
  const origWidth = viewportEl.style.width;
  const origHeight = viewportEl.style.height;
  const origContainerWidth = container.style.width;
  const origContainerHeight = container.style.height;
  const origContainerOverflow = container.style.overflow;

  // Track culled nodes to temporarily reveal them
  const revealedNodes: HTMLElement[] = [];

  // Bake CSS-driven SVG paint into attributes so edges survive the capture.
  // Undone in the `finally` alongside the other DOM restorations.
  let restoreSvgPaint: (() => void) | null = null;

  try {
    if (scope === 'all') {
      // Temporarily reveal all culled nodes
      const nodeEls = container.querySelectorAll<HTMLElement>('[data-flow-culled]');
      for (const el of nodeEls) {
        el.style.display = '';
        revealedNodes.push(el);
      }

      // Calculate viewport to fit all nodes
      const visibleNodes = nodes.filter(n => !n.hidden);
      const bounds = getNodesBounds(visibleNodes);
      const padding = options.padding ?? 0.1;
      const exportViewport = getViewportForBounds(
        bounds,
        imageWidth,
        imageHeight,
        0.1,    // minZoom
        2,      // maxZoom
        padding,
      );

      // Apply export transform
      viewportEl.style.transform = `translate(${exportViewport.x}px, ${exportViewport.y}px) scale(${exportViewport.zoom})`;
      viewportEl.style.width = `${imageWidth}px`;
      viewportEl.style.height = `${imageHeight}px`;
    }

    // Force container size for capture
    container.style.width = `${imageWidth}px`;
    container.style.height = `${imageHeight}px`;
    container.style.overflow = 'hidden';

    // Wait one frame for the DOM to settle
    await new Promise(resolve => requestAnimationFrame(resolve));

    // Snapshot SVG paint AFTER layout settles, so computed values reflect the
    // export transform/zoom rather than the pre-export state.
    restoreSvgPaint = inlineSvgPaint(container);

    // Generate SVG via html-to-image, then sanitize and render manually.
    // We use toSvg + manual canvas instead of toPng because Alpine.js
    // attributes (@click, :class, x-data) are invalid XML attribute names
    // that break the SVG foreignObject when loaded as an <img>.
    // By default, exclude UI overlays (toolbar, minimap, controls, panels)
    const overlayConfig = options.includeOverlays;
    const includeAll = overlayConfig === true;
    const perOverlay = typeof overlayConfig === 'object' ? overlayConfig : {};

    // Map CSS classes to their include/exclude state.
    // Selection box is always excluded (ephemeral UI state).
    const overlayRules: [string, boolean][] = [
      ['canvas-overlay', includeAll || (perOverlay.toolbar ?? false)],
      ['flow-minimap', includeAll || (perOverlay.minimap ?? false)],
      ['flow-controls', includeAll || (perOverlay.controls ?? false)],
      ['flow-panel', includeAll || (perOverlay.panels ?? false)],
      ['flow-selection-box', false],
    ];

    const svgDataUrl = await toSvg(container, {
      width: imageWidth,
      height: imageHeight,
      skipFonts: true,
      filter: (node: Element) => {
        if (node.classList) {
          for (const [cls, include] of overlayRules) {
            if (node.classList.contains(cls) && !include) return false;
          }
        }
        return true;
      },
    });

    // Decode the SVG and sanitize invalid XML, then either hand back the vector
    // capture as-is or rasterize it.
    const prefix = 'data:image/svg+xml;charset=utf-8,';
    const svgString = sanitizeSvg(decodeURIComponent(svgDataUrl.substring(prefix.length)));
    const format = options.format ?? 'png';

    let dataUrl: string;
    if (format === 'svg') {
      // No canvas involved, so `scale` has nothing to multiply and the size clamps
      // don't apply — a vector export is resolution-independent by definition.
      dataUrl = prefix + encodeURIComponent(withSvgBackground(svgString, background));
    } else {
      const scale = resolveScale(options.scale, imageWidth, imageHeight);
      dataUrl = await svgToRaster(
        svgString, imageWidth, imageHeight, background, scale, format, options.quality,
      );
    }

    // Auto-download if filename provided
    if (options.filename) {
      const link = document.createElement('a');
      link.download = options.filename;
      link.href = dataUrl;
      link.click();
    }

    return dataUrl;
  } finally {
    // Restore original state
    restoreSvgPaint?.();
    viewportEl.style.transform = origTransform;
    viewportEl.style.width = origWidth;
    viewportEl.style.height = origHeight;
    container.style.width = origContainerWidth;
    container.style.height = origContainerHeight;
    container.style.overflow = origContainerOverflow;

    // Re-hide culled nodes
    for (const el of revealedNodes) {
      el.style.display = 'none';
    }
  }
}
