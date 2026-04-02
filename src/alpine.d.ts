/**
 * Minimal Alpine.js type declarations for plugin authoring.
 *
 * Alpine's published types are sparse — this fills the gaps for
 * the APIs we actually use: data, directive, magic, store, and plugin.
 */

declare module 'alpinejs' {
  export interface Alpine {
    /** Register a reusable data component */
    data(name: string, callback: (...args: any[]) => Record<string, any>): void;

    /** Register a custom directive (x-<name>) */
    directive(
      name: string,
      handler: (
        el: HTMLElement,
        directive: {
          value: string;
          modifiers: string[];
          expression: string;
        },
        utilities: {
          Alpine: Alpine;
          effect: (callback: () => void) => void;
          cleanup: (callback: () => void) => void;
          evaluate: (expression: string) => any;
          evaluateLater: (expression: string) => (callback: (value: any) => void) => void;
        },
      ) => void,
    ): void;

    /** Register a magic property ($<name>) */
    magic(name: string, callback: (el: HTMLElement, options: { Alpine: Alpine }) => any): void;

    /** Register or access a global reactive store */
    store(name: string, value?: any): any;

    /** Register a plugin */
    plugin(plugin: (Alpine: Alpine) => void): void;

    /** Access the reactive data object for an element */
    $data(el: HTMLElement): Record<string, any>;

    /** Create a reactive effect */
    effect(callback: () => void): void;

    /** Make an object reactive */
    reactive<T extends Record<string, any>>(obj: T): T;

    /** Initialize Alpine directives on dynamically added DOM elements */
    initTree(el: HTMLElement | SVGElement): void;

    /** Inject additional reactive scope data onto a DOM element */
    addScopeToNode(node: HTMLElement, data: Record<string, any>): () => void;

    /** Unwrap a reactive proxy to get the raw underlying object */
    raw<T>(proxy: T): T;

    /** Tear down Alpine directives on an element and its descendants */
    destroyTree(el: HTMLElement | SVGElement): void;

    /** Batch DOM mutations so Alpine defers reactivity until complete */
    mutateDom(callback: () => void): void;
  }

  const Alpine: Alpine;
  export default Alpine;
}
