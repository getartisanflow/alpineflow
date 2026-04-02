// ============================================================================
// x-flow-devtools Directive
//
// Configurable devtools overlay for AlpineFlow canvases. Shows performance
// metrics, event log, viewport state, selection inspector, and animation
// activity. Replaces the old Blade <x-perf-monitor /> component.
//
// Modifiers (shorthand):
//   x-flow-devtools              — all sections
//   x-flow-devtools.perf         — performance only
//   x-flow-devtools.perf.events  — performance + events
//   x-flow-devtools.events.viewport.activity — events + viewport + activity
//
// Expression (granular):
//   x-flow-devtools="{ perf: ['fps', 'counts'], events: { max: 50 } }"
//
// Precedence: expression wins over modifiers. No expression + no modifiers = all.
// ============================================================================

import type { Alpine } from 'alpinejs';

// ── Types ────────────────────────────────────────────────────────────────────

interface DevtoolsConfig {
  perf?: boolean | ('fps' | 'memory' | 'counts' | 'visible')[];
  events?: boolean | { max?: number };
  viewport?: boolean;
  state?: boolean;
  activity?: boolean;
}

type PerfItem = 'fps' | 'memory' | 'counts' | 'visible';

const ALL_SECTIONS: (keyof DevtoolsConfig)[] = ['perf', 'events', 'viewport', 'state', 'activity'];
const ALL_PERF_ITEMS: PerfItem[] = ['fps', 'memory', 'counts', 'visible'];
const DEFAULT_EVENT_MAX = 30;

// ── Config Resolution ────────────────────────────────────────────────────────

function resolveConfig(expression: DevtoolsConfig | null, modifiers: string[]): DevtoolsConfig {
  // Expression takes precedence
  if (expression && typeof expression === 'object' && Object.keys(expression).length > 0) {
    return expression;
  }

  // Modifiers → config
  const sectionMods = modifiers.filter(m => ALL_SECTIONS.includes(m as keyof DevtoolsConfig));

  // No modifiers = all sections
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

// ── DOM Helpers ──────────────────────────────────────────────────────────────

function createSection(title: string, className: string): { wrapper: HTMLDivElement; content: HTMLDivElement } {
  const wrapper = document.createElement('div');
  wrapper.className = `flow-devtools-section ${className}`;
  const header = document.createElement('div');
  header.className = 'flow-devtools-section-title';
  header.textContent = title;
  wrapper.appendChild(header);
  const content = document.createElement('div');
  content.className = 'flow-devtools-section-content';
  wrapper.appendChild(content);
  return { wrapper, content };
}

function createRow(label: string, className: string): { row: HTMLDivElement; valueEl: HTMLSpanElement } {
  const row = document.createElement('div');
  row.className = `flow-devtools-row ${className}`;
  const labelEl = document.createElement('span');
  labelEl.className = 'flow-devtools-label';
  labelEl.textContent = label;
  const valueEl = document.createElement('span');
  valueEl.className = 'flow-devtools-value';
  valueEl.textContent = '—';
  row.appendChild(labelEl);
  row.appendChild(valueEl);
  return { row, valueEl };
}

// ── Directive Registration ───────────────────────────────────────────────────

export function registerFlowDevtoolsDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-devtools',
    (el: HTMLElement, { expression, modifiers }: { expression: string; modifiers: string[] }, { evaluate, effect, cleanup }: { evaluate: (expr: string) => any; effect: (fn: () => void) => void; cleanup: (fn: () => void) => void }) => {

      // ── Resolve config ─────────────────────────────────────────────
      let parsed: DevtoolsConfig | null = null;
      if (expression) {
        try { parsed = evaluate(expression) as DevtoolsConfig; } catch { /* use modifiers */ }
      }
      const config = resolveConfig(parsed, modifiers);

      // ── Find canvas scope ──────────────────────────────────────────
      // Use the same pattern as other directives: walk up to the nearest
      // [x-data] element and get Alpine reactive data from it.
      const canvasEl = el.closest('[x-data]') as HTMLElement | null;
      if (!canvasEl) return;

      // The .flow-container element is used for event listening
      const container = el.closest('.flow-container') as HTMLElement | null;
      if (!container) return;

      // ── Build DOM ──────────────────────────────────────────────────
      el.classList.add('flow-devtools', 'canvas-overlay');
      el.setAttribute('data-flow-devtools', '');

      // Stop canvas zoom on scroll over devtools panel
      const stopWheel = (e: Event) => e.stopPropagation();
      el.addEventListener('wheel', stopWheel);

      // Toggle button
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'flow-devtools-toggle nopan';
      toggleBtn.title = 'Devtools';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '14');
      svg.setAttribute('height', '14');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', '22 12 18 12 15 21 9 3 6 12 2 12');
      svg.appendChild(polyline);
      toggleBtn.appendChild(svg);
      el.appendChild(toggleBtn);

      // Panel — user-select: none so dragging to pan doesn't select text
      const panel = document.createElement('div');
      panel.className = 'flow-devtools-panel';
      panel.style.display = 'none';
      panel.style.userSelect = 'none';
      el.appendChild(panel);

      let expanded = false;
      const onToggleClick = () => {
        expanded = !expanded;
        panel.style.display = expanded ? '' : 'none';
        toggleBtn.title = expanded ? 'Collapse' : 'Devtools';
        // Start/stop RAF loop based on visibility
        if (expanded) startRaf(); else stopRaf();
      };
      toggleBtn.addEventListener('click', onToggleClick);

      // ── Perf section ───────────────────────────────────────────────
      const perfItems = shouldShowPerf(config);
      let fpsValueEl: HTMLSpanElement | null = null;
      let memoryValueEl: HTMLSpanElement | null = null;
      let countsNodeEl: HTMLSpanElement | null = null;
      let countsEdgeEl: HTMLSpanElement | null = null;
      let visibleValueEl: HTMLSpanElement | null = null;

      if (perfItems.length > 0) {
        const { wrapper, content } = createSection('Performance', 'flow-devtools-perf');
        if (perfItems.includes('fps')) {
          const { row, valueEl } = createRow('FPS', 'flow-devtools-fps');
          fpsValueEl = valueEl;
          content.appendChild(row);
        }
        if (perfItems.includes('memory')) {
          const { row, valueEl } = createRow('Memory', 'flow-devtools-memory');
          memoryValueEl = valueEl;
          content.appendChild(row);
        }
        if (perfItems.includes('counts')) {
          const nodeRow = createRow('Nodes', 'flow-devtools-counts');
          countsNodeEl = nodeRow.valueEl;
          content.appendChild(nodeRow.row);
          const edgeRow = createRow('Edges', 'flow-devtools-counts');
          countsEdgeEl = edgeRow.valueEl;
          content.appendChild(edgeRow.row);
        }
        if (perfItems.includes('visible')) {
          const { row, valueEl } = createRow('Visible', 'flow-devtools-visible');
          visibleValueEl = valueEl;
          content.appendChild(row);
        }
        panel.appendChild(wrapper);
      }

      // ── Events section ─────────────────────────────────────────────
      const eventMax = getEventMax(config);
      let eventListEl: HTMLDivElement | null = null;

      if (eventMax > 0) {
        const { wrapper, content } = createSection('Events', 'flow-devtools-events');

        const clearBtn = document.createElement('button');
        clearBtn.className = 'flow-devtools-clear-btn nopan';
        clearBtn.textContent = 'Clear';
        clearBtn.addEventListener('click', () => {
          if (eventListEl) eventListEl.textContent = '';
          eventEntries.length = 0;
        });
        wrapper.querySelector('.flow-devtools-section-title')!.appendChild(clearBtn);

        eventListEl = document.createElement('div');
        eventListEl.className = 'flow-devtools-event-list';
        content.appendChild(eventListEl);
        panel.appendChild(wrapper);
      }

      // ── Viewport section ───────────────────────────────────────────
      let vpXEl: HTMLSpanElement | null = null;
      let vpYEl: HTMLSpanElement | null = null;
      let vpZoomEl: HTMLSpanElement | null = null;

      if (config.viewport) {
        const { wrapper, content } = createSection('Viewport', 'flow-devtools-viewport');
        const xRow = createRow('X', 'flow-devtools-vp-x');
        vpXEl = xRow.valueEl;
        content.appendChild(xRow.row);
        const yRow = createRow('Y', 'flow-devtools-vp-y');
        vpYEl = yRow.valueEl;
        content.appendChild(yRow.row);
        const zoomRow = createRow('Zoom', 'flow-devtools-vp-zoom');
        vpZoomEl = zoomRow.valueEl;
        content.appendChild(zoomRow.row);
        panel.appendChild(wrapper);
      }

      // ── State section ──────────────────────────────────────────────
      let stateContentEl: HTMLDivElement | null = null;

      if (config.state) {
        const { wrapper, content } = createSection('Selection', 'flow-devtools-state');
        stateContentEl = document.createElement('div');
        stateContentEl.className = 'flow-devtools-state-content';
        stateContentEl.textContent = 'No selection';
        content.appendChild(stateContentEl);
        panel.appendChild(wrapper);
      }

      // ── Activity section ───────────────────────────────────────────
      let animValueEl: HTMLSpanElement | null = null;
      let particleValueEl: HTMLSpanElement | null = null;
      let followValueEl: HTMLSpanElement | null = null;
      let timelineValueEl: HTMLSpanElement | null = null;

      if (config.activity) {
        const { wrapper, content } = createSection('Activity', 'flow-devtools-activity');
        const animRow = createRow('Animations', 'flow-devtools-anim');
        animValueEl = animRow.valueEl;
        content.appendChild(animRow.row);
        const partRow = createRow('Particles', 'flow-devtools-particles');
        particleValueEl = partRow.valueEl;
        content.appendChild(partRow.row);
        const followRow = createRow('Follow', 'flow-devtools-follow');
        followValueEl = followRow.valueEl;
        content.appendChild(followRow.row);
        const tlRow = createRow('Timelines', 'flow-devtools-timelines');
        timelineValueEl = tlRow.valueEl;
        content.appendChild(tlRow.row);
        panel.appendChild(wrapper);
      }

      // ── RAF loop (FPS + memory) ────────────────────────────────────
      let rafId: number | null = null;
      let rafRunning = false;
      let frames = 0;
      let lastTime = performance.now();
      const needsRaf = !!(fpsValueEl || memoryValueEl);

      const tick = () => {
        if (!rafRunning) return;
        frames++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
          if (fpsValueEl) {
            fpsValueEl.textContent = String(Math.round((frames * 1000) / (now - lastTime)));
          }
          frames = 0;
          lastTime = now;
          if (memoryValueEl && (performance as any).memory) {
            memoryValueEl.textContent = Math.round((performance as any).memory.usedJSHeapSize / 1048576) + ' MB';
          }
        }
        rafId = requestAnimationFrame(tick);
      };

      const startRaf = () => {
        if (!needsRaf || rafRunning) return;
        rafRunning = true;
        frames = 0;
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      };

      const stopRaf = () => {
        rafRunning = false;
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      };

      // ── Event log listener ─────────────────────────────────────────
      interface EventEntry { name: string; time: number; detail: string }
      const eventEntries: EventEntry[] = [];

      const FLOW_EVENTS_LIST = [
        'flow-init', 'flow-connect', 'flow-disconnect',
        'flow-node-add', 'flow-node-remove', 'flow-edge-add', 'flow-edge-remove',
        'flow-selection-change', 'flow-viewport-change',
        'flow-viewport-move-start', 'flow-viewport-move', 'flow-viewport-move-end',
        'flow-node-drag-start', 'flow-node-drag', 'flow-node-drag-end',
        'flow-node-click', 'flow-edge-click',
        'flow-node-condense', 'flow-node-uncondense',
        'flow-undo', 'flow-redo',
      ];

      let flowEventHandler: ((e: Event) => void) | null = null;

      if (eventMax > 0 && eventListEl) {
        flowEventHandler = (e: Event) => {
          const ce = e as CustomEvent;
          const name = ce.type.replace('flow-', '');
          let detailStr = '';
          try {
            detailStr = ce.detail ? JSON.stringify(ce.detail).slice(0, 80) : '';
          } catch {
            detailStr = '[circular]';
          }

          eventEntries.unshift({ name, time: Date.now(), detail: detailStr });

          // Prepend new entry row (avoid full rebuild)
          const listEl = eventListEl!;
          const row = document.createElement('div');
          row.className = 'flow-devtools-event-entry';

          const nameSpan = document.createElement('span');
          nameSpan.className = 'flow-devtools-event-name';
          nameSpan.textContent = name;

          const ageSpan = document.createElement('span');
          ageSpan.className = 'flow-devtools-event-age';
          ageSpan.textContent = 'now';

          const detailSpan = document.createElement('span');
          detailSpan.className = 'flow-devtools-event-detail';
          detailSpan.textContent = detailStr;

          row.appendChild(nameSpan);
          row.appendChild(ageSpan);
          row.appendChild(detailSpan);
          listEl.prepend(row);

          // Trim oldest if over limit
          while (listEl.children.length > eventMax) {
            listEl.removeChild(listEl.lastChild!);
            eventEntries.pop();
          }
        };
        for (const evt of FLOW_EVENTS_LIST) {
          container.addEventListener(evt, flowEventHandler);
        }
      }

      // ── Alpine effects for reactive data ───────────────────────────
      effect(() => {
        const canvas = Alpine.$data(canvasEl) as any;
        if (!canvas) return;

        // Counts
        if (countsNodeEl) countsNodeEl.textContent = String(canvas.nodes?.length ?? 0);
        if (countsEdgeEl) countsEdgeEl.textContent = String(canvas.edges?.length ?? 0);

        // Visible
        if (visibleValueEl && canvas._getVisibleNodeIds) {
          visibleValueEl.textContent = String(canvas._getVisibleNodeIds().size);
        }

        // Viewport
        if (vpXEl && canvas.viewport) {
          vpXEl.textContent = Math.round(canvas.viewport.x).toString();
        }
        if (vpYEl && canvas.viewport) {
          vpYEl.textContent = Math.round(canvas.viewport.y).toString();
        }
        if (vpZoomEl && canvas.viewport) {
          vpZoomEl.textContent = canvas.viewport.zoom.toFixed(2);
        }

        // State (selection)
        if (stateContentEl) {
          const selNodes = canvas.selectedNodes as Set<string> | undefined;
          const selEdges = canvas.selectedEdges as Set<string> | undefined;
          const hasSelection = (selNodes?.size ?? 0) > 0 || (selEdges?.size ?? 0) > 0;

          if (!hasSelection) {
            stateContentEl.textContent = 'No selection';
          } else {
            // Build compact JSON display using safe DOM methods
            stateContentEl.textContent = '';
            if (selNodes && selNodes.size > 0) {
              for (const nodeId of selNodes) {
                const node = canvas.getNode?.(nodeId);
                if (!node) continue;
                const pre = document.createElement('pre');
                pre.className = 'flow-devtools-json';
                pre.textContent = JSON.stringify({ id: node.id, position: node.position, data: node.data }, null, 2);
                stateContentEl.appendChild(pre);
              }
            }
            if (selEdges && selEdges.size > 0) {
              for (const edgeId of selEdges) {
                const edge = canvas.edges?.find((e: any) => e.id === edgeId);
                if (!edge) continue;
                const pre = document.createElement('pre');
                pre.className = 'flow-devtools-json';
                pre.textContent = JSON.stringify({ id: edge.id, source: edge.source, target: edge.target, type: edge.type }, null, 2);
                stateContentEl.appendChild(pre);
              }
            }
          }
        }

        // Activity
        if (animValueEl) {
          const count = canvas._animator?._groups?.size ?? 0;
          animValueEl.textContent = String(count);
        }
        if (particleValueEl) {
          particleValueEl.textContent = String(canvas._activeParticles?.size ?? 0);
        }
        if (followValueEl) {
          followValueEl.textContent = canvas._followHandle ? 'Active' : 'Idle';
        }
        if (timelineValueEl) {
          timelineValueEl.textContent = String(canvas._activeTimelines?.size ?? 0);
        }
      });

      // ── Cleanup ────────────────────────────────────────────────────
      cleanup(() => {
        // 1. Stop RAF
        stopRaf();

        // 2. Remove toggle listener
        toggleBtn.removeEventListener('click', onToggleClick);

        // 3. Remove event listeners
        if (flowEventHandler) {
          for (const evt of FLOW_EVENTS_LIST) {
            container.removeEventListener(evt, flowEventHandler);
          }
        }
        // 4. Remove interaction stoppers
        el.removeEventListener('wheel', stopWheel);

        // 5. Clear DOM
        el.textContent = '';

        // 6. Null references
        fpsValueEl = null;
        memoryValueEl = null;
        countsNodeEl = null;
        countsEdgeEl = null;
        visibleValueEl = null;
        eventListEl = null;
        vpXEl = null;
        vpYEl = null;
        vpZoomEl = null;
        stateContentEl = null;
        animValueEl = null;
        particleValueEl = null;
        followValueEl = null;
        timelineValueEl = null;
      });
    },
  );
}
