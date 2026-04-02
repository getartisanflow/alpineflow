// ============================================================================
// Export Utilities
//
// Captures the flow canvas as a PNG image via html-to-image (dynamically
// imported). Supports full-graph and viewport-only capture modes.
//
// Uses toSvg() + manual canvas rendering instead of toPng() directly,
// because Alpine.js directives (@click, x-data, :class) produce attribute
// names with @ and : that are invalid XML — breaking the SVG foreignObject
// when loaded as an <img>.
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
 * Render a sanitized SVG string to a PNG data URL via canvas.
 */
function svgToPng(svgString: string, width: number, height: number, background: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
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

    // Decode the SVG, sanitize invalid XML, render to PNG
    const prefix = 'data:image/svg+xml;charset=utf-8,';
    const svgString = sanitizeSvg(decodeURIComponent(svgDataUrl.substring(prefix.length)));
    const dataUrl = await svgToPng(svgString, imageWidth, imageHeight, background);

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
