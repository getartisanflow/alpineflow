/**
 * ARIA live region announcer for screen readers.
 *
 * Creates a visually-hidden div with aria-live="polite" that announces
 * flow diagram changes. Hooks into _emit() via handleEvent().
 */

import { englishTranslator, type Translator } from './translations';

/**
 * Custom announcement formatter. Receives the canvas translator as third
 * argument so it can localise its own strings or delegate to
 * {@link defaultFormatAnnouncement} for events it does not handle.
 */
export type FormatAnnouncementFn = (event: string, detail: Record<string, any>, t: Translator) => string | null;

/**
 * Default event-to-announcement formatter.
 * Returns null for events that should not be announced.
 */
export function defaultFormatAnnouncement(event: string, detail: Record<string, any>, t: Translator = englishTranslator): string | null {
  switch (event) {
    case 'nodes-change': {
      const nodes = detail.nodes ?? [];
      const label = nodes.length === 1 ? (nodes[0].data?.label || nodes[0].id) : null;
      if (detail.type === 'add') {
        return label ? t('announce.nodeAdded', { label }) : t('announce.nodesAdded', { count: nodes.length });
      }
      if (detail.type === 'remove') {
        return label ? t('announce.nodeRemoved', { label }) : t('announce.nodesRemoved', { count: nodes.length });
      }
      return null;
    }

    case 'edges-change': {
      const edges = detail.edges ?? [];
      if (detail.type === 'add') {
        if (edges.length === 1) {
          return t('announce.connected', { source: edges[0].source, target: edges[0].target });
        }
        return t('announce.connectionsAdded', { count: edges.length });
      }
      if (detail.type === 'remove') {
        if (edges.length === 1 && edges[0].source && edges[0].target) {
          return t('announce.disconnected', { source: edges[0].source, target: edges[0].target });
        }
        return t('announce.connectionsRemoved', { count: edges.length });
      }
      return null;
    }

    case 'selection-change': {
      const nodeCount = detail.nodes?.length ?? 0;
      const edgeCount = detail.edges?.length ?? 0;
      if (nodeCount === 0 && edgeCount === 0) {
        return t('announce.selectionCleared');
      }
      const parts: string[] = [];
      if (nodeCount > 0) parts.push(t('announce.nodesSelected', { count: nodeCount }));
      if (edgeCount > 0) parts.push(t('announce.edgesSelected', { count: edgeCount }));
      return t('announce.selected', { items: parts.length === 2 ? t('announce.selectionJoin', { nodes: parts[0], edges: parts[1] }) : parts[0] });
    }

    case 'viewport-move-end': {
      const zoom = detail.viewport?.zoom ?? 1;
      return t('announce.viewportZoom', { percent: Math.round(zoom * 100) });
    }

    case 'fit-view':
      return t('announce.viewFitted');

    case 'node-reparent': {
      const name = detail.node?.data?.label || detail.node?.id || t('announce.node');
      if (detail.newParentId) {
        return t('announce.reparented', { name, parent: detail.newParentId });
      }
      return t('announce.detached', { name, parent: detail.oldParentId });
    }

    default:
      return null;
  }
}

const CLEAR_DELAY = 1000;

export class FlowAnnouncer {
  private _el: HTMLDivElement;
  private _clearTimer: ReturnType<typeof setTimeout> | null = null;
  private _formatMessage: FormatAnnouncementFn;
  private _t: Translator;

  constructor(container: HTMLElement, formatMessage?: FormatAnnouncementFn, t: Translator = englishTranslator) {
    this._t = t;
    this._formatMessage = formatMessage ?? defaultFormatAnnouncement;

    this._el = document.createElement('div');
    this._el.setAttribute('aria-live', 'polite');
    this._el.setAttribute('aria-atomic', 'true');
    this._el.setAttribute('role', 'status');

    // Visually hidden but accessible to screen readers
    const s = this._el.style;
    s.position = 'absolute';
    s.width = '1px';
    s.height = '1px';
    s.padding = '0';
    s.margin = '-1px';
    s.overflow = 'hidden';
    s.clip = 'rect(0,0,0,0)';
    s.whiteSpace = 'nowrap';
    s.border = '0';

    container.appendChild(this._el);
  }

  announce(message: string): void {
    if (this._clearTimer) clearTimeout(this._clearTimer);
    this._el.textContent = message;
    this._clearTimer = setTimeout(() => {
      this._el.textContent = '';
      this._clearTimer = null;
    }, CLEAR_DELAY);
  }

  handleEvent(event: string, detail: Record<string, any>): void {
    const message = this._formatMessage(event, detail, this._t);
    if (message) this.announce(message);
  }

  destroy(): void {
    if (this._clearTimer) clearTimeout(this._clearTimer);
    this._el.remove();
  }
}
