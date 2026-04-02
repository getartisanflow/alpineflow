/**
 * ARIA live region announcer for screen readers.
 *
 * Creates a visually-hidden div with aria-live="polite" that announces
 * flow diagram changes. Hooks into _emit() via handleEvent().
 */

export type FormatAnnouncementFn = (event: string, detail: Record<string, any>) => string | null;

/**
 * Default event-to-announcement formatter.
 * Returns null for events that should not be announced.
 */
export function defaultFormatAnnouncement(event: string, detail: Record<string, any>): string | null {
  switch (event) {
    case 'nodes-change': {
      const nodes = detail.nodes ?? [];
      const label = nodes.length === 1 ? (nodes[0].data?.label || nodes[0].id) : null;
      if (detail.type === 'add') {
        return label ? `Added node: ${label}` : `Added ${nodes.length} nodes`;
      }
      if (detail.type === 'remove') {
        return label ? `Removed node: ${label}` : `Removed ${nodes.length} nodes`;
      }
      return null;
    }

    case 'edges-change': {
      const edges = detail.edges ?? [];
      if (detail.type === 'add') {
        if (edges.length === 1) {
          return `Connected ${edges[0].source} to ${edges[0].target}`;
        }
        return `Added ${edges.length} connections`;
      }
      if (detail.type === 'remove') {
        if (edges.length === 1 && edges[0].source && edges[0].target) {
          return `Removed connection from ${edges[0].source} to ${edges[0].target}`;
        }
        return `Removed ${edges.length} connections`;
      }
      return null;
    }

    case 'selection-change': {
      const nodeCount = detail.nodes?.length ?? 0;
      const edgeCount = detail.edges?.length ?? 0;
      if (nodeCount === 0 && edgeCount === 0) {
        return 'Selection cleared';
      }
      const parts: string[] = [];
      if (nodeCount > 0) parts.push(`${nodeCount} node${nodeCount === 1 ? '' : 's'}`);
      if (edgeCount > 0) parts.push(`${edgeCount} edge${edgeCount === 1 ? '' : 's'}`);
      return `${parts.join(' and ')} selected`;
    }

    case 'viewport-move-end': {
      const zoom = detail.viewport?.zoom ?? 1;
      return `Viewport: zoom ${Math.round(zoom * 100)}%`;
    }

    case 'fit-view':
      return 'Fitted view to content';

    case 'node-reparent': {
      const name = detail.node?.data?.label || detail.node?.id || 'node';
      if (detail.newParentId) {
        return `Moved ${name} into ${detail.newParentId}`;
      }
      return `Detached ${name} from ${detail.oldParentId}`;
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

  constructor(container: HTMLElement, formatMessage?: FormatAnnouncementFn) {
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
    const message = this._formatMessage(event, detail);
    if (message) this.announce(message);
  }

  destroy(): void {
    if (this._clearTimer) clearTimeout(this._clearTimer);
    this._el.remove();
  }
}
