// ============================================================================
// Debug Logger
//
// Centralized debug logging for AlpineFlow. Enable via the `debug` option
// on the flowCanvas config. Logs are grouped by category for easy filtering
// in the browser console.
//
// TODO: Add visual debug panel overlay (toggle with debug: true) showing live
// node/edge state as a JSON tree or table. Also consider a profiling mode that
// tracks animation frame times, flush counts, and edge path recalculations.
// ============================================================================

let enabled = false;

export function setDebugEnabled(value: boolean): void {
  enabled = value;
}

export function isDebugEnabled(): boolean {
  return enabled;
}

/**
 * Log a debug message to the console when debug mode is enabled.
 *
 * @param category - Log category (e.g. 'drag', 'viewport', 'edge', 'connection')
 * @param message - Human-readable message
 * @param data - Optional data to log alongside the message
 */
export function debug(category: string, message: string, data?: any): void {
  if (!enabled) return;

  const prefix = `%c[AlpineFlow:${category}]`;
  const style = categoryStyle(category);

  if (data !== undefined) {
    console.log(prefix, style, message, data);
  } else {
    console.log(prefix, style, message);
  }
}

function categoryStyle(category: string): string {
  const colors: Record<string, string> = {
    init: '#4ade80',
    destroy: '#f87171',
    drag: '#60a5fa',
    viewport: '#a78bfa',
    edge: '#fb923c',
    connection: '#f472b6',
    selection: '#facc15',
    event: '#38bdf8',
    store: '#2dd4bf',
    resize: '#c084fc',
    collapse: '#c084fc',
    animate: '#34d399',
    layout: '#818cf8',
    particle: '#f472b6',
    history: '#fbbf24',
    clipboard: '#94a3b8',
  };

  const color = colors[category] ?? '#94a3b8';
  return `color: ${color}; font-weight: bold`;
}
