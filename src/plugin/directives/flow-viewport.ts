// ============================================================================
// x-flow-viewport directive
//
// Replaces the manual `.flow-viewport` div + edge loop boilerplate. When placed
// on an element, it auto-applies the viewport class and reactively renders the
// full edge SVG layer. Developers only need to provide the node loop.
//
// Usage:
//   <div x-flow-viewport>
//       <template x-for="node in nodes" :key="node.id">
//           <div x-flow-node="node">...</div>
//       </template>
//   </div>
// ============================================================================

import type { Alpine } from 'alpinejs';

export function registerFlowViewportDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-viewport',
    (el, {}, { effect, cleanup }) => {
      el.classList.add('flow-viewport');

      // Walk up to find the flowCanvas data context
      const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
      if (!canvas?.edges) return;

      // Register this element with the canvas for CSS transform application.
      // init() may run before this directive, so _viewportEl could be null there.
      canvas._viewportEl = el;
      const vp = canvas.viewport;
      if (vp) {
        el.style.transform = `translate(${vp.x}px, ${vp.y}px) scale(${vp.zoom})`;
      }

      // Create the edge container
      const edgesDiv = document.createElement('div');
      edgesDiv.classList.add('flow-edges');
      el.insertBefore(edgesDiv, el.firstChild);

      // Track rendered edge SVGs by edge id
      const edgeSvgMap = new Map<string, SVGSVGElement>();

      effect(() => {
        // Read edges reactively
        const edges: { id: string }[] = canvas.edges;
        const currentIds = new Set(edges.map((e) => e.id));

        // Remove SVGs for edges that no longer exist
        for (const [id, svg] of edgeSvgMap) {
          if (!currentIds.has(id)) {
            Alpine.destroyTree(svg);
            svg.remove();
            edgeSvgMap.delete(id);
            canvas._edgeSvgElements?.delete(id);
          }
        }

        // Add SVGs for new edges
        for (const edge of edges) {
          if (edgeSvgMap.has(edge.id)) continue;

          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('class', 'flow-edge-svg');
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          svg.appendChild(g);

          // Wire up the x-flow-edge directive via Alpine
          Alpine.addScopeToNode(g as unknown as HTMLElement, { edge });
          (g as Element).setAttribute('x-flow-edge', 'edge');

          // Insert into DOM inside mutateDom so Alpine's MutationObserver
          // doesn't see the new element and trigger a duplicate init.
          Alpine.mutateDom(() => {
            edgesDiv.appendChild(svg);
          });

          edgeSvgMap.set(edge.id, svg);

          // Register for CSS-based viewport culling
          canvas._edgeSvgElements?.set(edge.id, svg);

          Alpine.initTree(g as unknown as HTMLElement);
        }

        // Remove pre-rendered static edges SVG (replaced by reactive edges)
        const containerEl = el.closest('[data-flow-canvas]') ?? el;
        const staticEdges = containerEl.querySelector('.flow-edges-static');
        if (staticEdges) staticEdges.remove();

        // Update edge visibility based on hidden flags
        for (const edge of edges as { id: string; hidden?: boolean; source?: string; target?: string }[]) {
          const svg = edgeSvgMap.get(edge.id);
          if (!svg) continue;

          const sourceNode = canvas.getNode?.(edge.source);
          const targetNode = canvas.getNode?.(edge.target);
          const isHidden = edge.hidden || sourceNode?.hidden || targetNode?.hidden;

          svg.style.display = isHidden ? 'none' : '';
        }

        // Update edge filtered class based on node filtered flags
        for (const edge of edges as { id: string; source?: string; target?: string }[]) {
          const svg = edgeSvgMap.get(edge.id);
          if (!svg) continue;
          const sourceNode = canvas.getNode?.(edge.source);
          const targetNode = canvas.getNode?.(edge.target);
          const isFiltered = sourceNode?.filtered || targetNode?.filtered;
          if (isFiltered) {
            svg.classList.add('flow-edge-filtered');
          } else {
            svg.classList.remove('flow-edge-filtered');
          }
        }
      });

      cleanup(() => {
        for (const [id, svg] of edgeSvgMap) {
          Alpine.destroyTree(svg);
          svg.remove();
          canvas._edgeSvgElements?.delete(id);
        }
        edgeSvgMap.clear();
        edgesDiv.remove();
      });
    },
  );
}
