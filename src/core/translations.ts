import en from '../../locales/en.json';

/**
 * Every message the engine ships, keyed as in `locales/en.json`. Messages that
 * carry a `:count` appear in the two plural forms English uses, `_one` and `_other`.
 */
interface EnglishMessages {
  /** Accessible name of the controls panel. */
  'controls.label'?: string;
  /** Tooltip / accessible name of the zoom-in button. */
  'controls.zoomIn'?: string;
  /** Tooltip / accessible name of the zoom-out button. */
  'controls.zoomOut'?: string;
  /** Tooltip / accessible name of the fit-view button. */
  'controls.fitView'?: string;
  /** Tooltip of the interactivity toggle before its state is known. */
  'controls.toggleInteractive'?: string;
  /** Tooltip of the interactivity toggle while the canvas is interactive (click locks it). */
  'controls.lockInteractive'?: string;
  /** Tooltip of the interactivity toggle while the canvas is locked (click unlocks it). */
  'controls.unlockInteractive'?: string;
  /** Tooltip / accessible name of the reset-panels button. */
  'controls.resetPanels'?: string;
  /** Tooltip of the fullscreen toggle before its state is known. */
  'controls.toggleFullscreen'?: string;
  /** Tooltip of the fullscreen toggle while windowed (click enters fullscreen). */
  'controls.enterFullscreen'?: string;
  /** Tooltip of the fullscreen toggle while fullscreen (click exits). */
  'controls.exitFullscreen'?: string;

  /** Default `aria-label` of the canvas container (overridden by `ariaLabel`). */
  'canvas.label'?: string;
  /** Text shown while the canvas initialises (overridden by `loadingText`). */
  'canvas.loading'?: string;
  /** Touch hint shown while multi-selection mode is active. */
  'canvas.selectionMode'?: string;

  /** Accessible name of a node with a label. Placeholder: `:label`. */
  'a11y.nodeLabel'?: string;
  /** Accessible name of a node without a label. Placeholder: `:id`. */
  'a11y.nodeId'?: string;
  /** Accessible name of an edge with a label. Placeholder: `:label`. */
  'a11y.edgeLabel'?: string;
  /** Accessible name of an edge without a label. Placeholders: `:source`, `:target`. */
  'a11y.edgeEndpoints'?: string;
  /** Accessible name of a source handle. Placeholder: `:id`. */
  'a11y.sourceHandle'?: string;
  /** Accessible name of a target handle. Placeholder: `:id`. */
  'a11y.targetHandle'?: string;
  /** Tooltip on an editable edge's midpoint. */
  'a11y.addControlPoint'?: string;

  /** Announced when one labelled node is added. Placeholder: `:label`. */
  'announce.nodeAdded'?: string;
  /** Announced when several nodes are added. Placeholder: `:count` (plural, singular form). */
  'announce.nodesAdded_one'?: string;
  /** Announced when several nodes are added. Placeholder: `:count` (plural, default form). */
  'announce.nodesAdded_other'?: string;
  /** Announced when one labelled node is removed. Placeholder: `:label`. */
  'announce.nodeRemoved'?: string;
  /** Announced when several nodes are removed. Placeholder: `:count` (plural, singular form). */
  'announce.nodesRemoved_one'?: string;
  /** Announced when several nodes are removed. Placeholder: `:count` (plural, default form). */
  'announce.nodesRemoved_other'?: string;
  /** Announced when one edge is added. Placeholders: `:source`, `:target`. */
  'announce.connected'?: string;
  /** Announced when several edges are added. Placeholder: `:count` (plural, singular form). */
  'announce.connectionsAdded_one'?: string;
  /** Announced when several edges are added. Placeholder: `:count` (plural, default form). */
  'announce.connectionsAdded_other'?: string;
  /** Announced when one edge with known endpoints is removed. Placeholders: `:source`, `:target`. */
  'announce.disconnected'?: string;
  /** Announced when edges without known endpoints are removed. Placeholder: `:count` (plural, singular form). */
  'announce.connectionsRemoved_one'?: string;
  /** Announced when edges without known endpoints are removed. Placeholder: `:count` (plural, default form). */
  'announce.connectionsRemoved_other'?: string;
  /** Announced when the selection becomes empty. */
  'announce.selectionCleared'?: string;
  /** Node part of a selection announcement. Placeholder: `:count` (plural, singular form). */
  'announce.nodesSelected_one'?: string;
  /** Node part of a selection announcement. Placeholder: `:count` (plural, default form). */
  'announce.nodesSelected_other'?: string;
  /** Edge part of a selection announcement. Placeholder: `:count` (plural, singular form). */
  'announce.edgesSelected_one'?: string;
  /** Edge part of a selection announcement. Placeholder: `:count` (plural, default form). */
  'announce.edgesSelected_other'?: string;
  /** Joins the node and edge parts of a selection announcement. Placeholders: `:nodes`, `:edges`. */
  'announce.selectionJoin'?: string;
  /** Wraps the selection summary. Placeholder: `:items`. */
  'announce.selected'?: string;
  /** Announced when panning or zooming ends. Placeholder: `:percent`. */
  'announce.viewportZoom'?: string;
  /** Announced after fit-view. */
  'announce.viewFitted'?: string;
  /** Fallback name for a node without label or id in reparent announcements. */
  'announce.node'?: string;
  /** Announced when a node is moved into a parent. Placeholders: `:name`, `:parent`. */
  'announce.reparented'?: string;
  /** Announced when a node leaves its parent. Placeholders: `:name`, `:parent`. */
  'announce.detached'?: string;

  /** Default label of a condition node without `data.label`. */
  'workflow.condition'?: string;
  /** Shown instead of an expression when a condition uses a custom evaluator function. */
  'workflow.customEvaluator'?: string;
  /** Default label of a wait node without `data.label`. */
  'workflow.wait'?: string;

  /** Node inspector placeholder while nothing is selected. */
  'schema.inspector.noNode'?: string;
  /** Edge inspector placeholder while nothing is selected. */
  'schema.inspector.noEdge'?: string;
  /** Row inspector placeholder while nothing is selected. */
  'schema.inspector.noRow'?: string;
  /** Row inspector message when the selected row was deleted. */
  'schema.inspector.missingRow'?: string;
  /** Form label of the edge label input. */
  'schema.inspector.label'?: string;
  /** Form label of the row name input. */
  'schema.inspector.name'?: string;
  /** Form label and placeholder of the row type input. */
  'schema.inspector.type'?: string;
  /** Form label of the row "required" checkbox. */
  'schema.inspector.required'?: string;
  /** Button verb that removes a row. */
  'schema.inspector.remove'?: string;
  /** Button verb that deletes the selected edge. */
  'schema.inspector.delete'?: string;
  /** Button verb that adds a row. */
  'schema.inspector.add'?: string;
  /** Placeholder of the new-row name input. */
  'schema.inspector.fieldName'?: string;
}

type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

/** Base keys of the messages with plural forms, e.g. `announce.nodesSelected`. */
type PluralMessage = keyof EnglishMessages extends infer K
  ? K extends `${infer Base}_other` ? Base : never
  : never;

/**
 * Plural forms other languages need besides `_one` / `_other`: Arabic uses `_zero`
 * and `_two`, Polish and Russian `_few` and `_many`. A language's categories are
 * listed by `new Intl.PluralRules(locale).resolvedOptions().pluralCategories`.
 */
type AdditionalPluralForms = {
  [K in `${PluralMessage}_${Exclude<PluralCategory, 'one' | 'other'>}`]?: string;
};

/**
 * UI messages of a canvas. Every key is optional; missing keys fall back to
 * English. Messages are plain text with literal `:placeholder` substitution.
 * Keys that carry a `:count` exist once per CLDR plural category (`_one`,
 * `_few`, `_other`, …) and are selected with the canvas `locale`.
 */
export interface FlowTranslations extends EnglishMessages, AdditionalPluralForms {}

type MessageKey = keyof FlowTranslations;

/** Message keys as callers use them: plural variants collapse onto their base key. */
export type TranslationKey = MessageKey extends infer K
  ? K extends `${infer Base}_${PluralCategory}` ? Base : K
  : never;

/** `A` when it has exactly the keys of `B`, otherwise `never`. */
type SameKeys<A, B> = [keyof A] extends [keyof B] ? ([keyof B] extends [keyof A] ? A : never) : never;

/**
 * English defaults. The annotation fails `tsc` when `locales/en.json` and
 * {@link EnglishMessages} disagree on a key, so the interface stays the single
 * typed source and the emitted declarations carry no JSON import.
 */
const englishMessages: SameKeys<typeof en, Required<EnglishMessages>> = en;

const FALLBACK_LOCALE = 'en';
const pluralRulesCache = new Map<string, Intl.PluralRules>();

/**
 * Plural rules for a locale tag. Accepts Laravel-style underscores (`pt_BR`),
 * defaults to the document language and falls back to English for invalid tags.
 */
export function resolvePluralRules(locale?: string): Intl.PluralRules {
  const requested = locale ?? (typeof document !== 'undefined' ? document.documentElement.lang : '');
  const tag = requested.trim().replace(/_/g, '-') || FALLBACK_LOCALE;
  let rules = pluralRulesCache.get(tag);
  if (!rules) {
    try {
      rules = new Intl.PluralRules(tag);
    } catch {
      rules = resolvePluralRules(FALLBACK_LOCALE);
    }
    pluralRulesCache.set(tag, rules);
  }
  return rules;
}

/** Translates a message key with optional placeholder values. See {@link createTranslator}. */
export type Translator = (key: TranslationKey, values?: Record<string, string | number>) => string;

type MessageTable = Record<string, string | undefined>;

/** Only non-empty strings count as translations; anything else falls through to the next fallback. */
function usable(value: unknown): string | undefined {
  return typeof value === 'string' && value !== '' ? value : undefined;
}

function pickMessage(table: MessageTable, key: string, count: number | undefined, rules: Intl.PluralRules): string | undefined {
  // Without a count, a plural-only key still yields its `_other` form rather than the raw key;
  // with a count, a message without plural forms still resolves the plain key.
  if (count === undefined) return usable(table[key]) ?? usable(table[`${key}_other`]);
  return usable(table[`${key}_${rules.select(count)}`]) ?? usable(table[`${key}_other`]) ?? usable(table[key]);
}

const placeholderPatternCache = new Map<string, RegExp>();

/**
 * Substitute `:name` placeholders with the given values, longest name first
 * (Laravel's order), so `:labelId` is not clobbered by `:label` and names may be
 * followed directly by letters or underscores. Unknown placeholders stay literal.
 */
function substitute(message: string, values: Record<string, string | number>): string {
  const names = Object.keys(values).sort((a, b) => b.length - a.length);
  if (names.length === 0) return message;
  // Call sites use a handful of fixed placeholder sets, so cache the compiled pattern per set.
  const signature = names.join('\0');
  let pattern = placeholderPatternCache.get(signature);
  if (!pattern) {
    pattern = new RegExp(`:(${names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
    placeholderPatternCache.set(signature, pattern);
  }
  return message.replace(pattern, (_match, name: string) => String(values[name]));
}

/**
 * Build a translator for one canvas. The overrides are copied once into a plain
 * object, so later changes to the source dictionary (or Alpine reactivity on it)
 * do not affect the result; recreate the canvas to change its language.
 *
 * Lookup order: the override for the locale's plural category, the override's
 * `_other` form, then the English message selected with English plural rules.
 * Empty strings and non-string values are ignored. Placeholders (`:label`) are
 * substituted literally.
 */
export function createTranslator(translations?: FlowTranslations, locale?: string): Translator {
  const overrides: MessageTable = {};
  for (const [key, value] of Object.entries(translations ?? {})) {
    const text = usable(value);
    if (text !== undefined) overrides[key] = text;
  }
  const localeRules = resolvePluralRules(locale);
  const englishRules = resolvePluralRules(FALLBACK_LOCALE);

  return (key, values = {}) => {
    const count = typeof values.count === 'number' ? values.count : undefined;
    const message = pickMessage(overrides, key, count, localeRules)
      ?? pickMessage(englishMessages, key, count, englishRules)
      ?? key;
    return substitute(message, values);
  };
}

/** English messages with English plural rules, shared by call sites that have no canvas. */
export const englishTranslator: Translator = createTranslator(undefined, FALLBACK_LOCALE);

/**
 * Translator for a directive's canvas scope: delegates to the canvas `t()` when
 * present, otherwise English. Lets directives and inspectors mount against a
 * plain `x-data` host (tests, custom shells) without a `flowCanvas` instance.
 */
export function canvasTranslator(canvas: unknown): Translator {
  const scope = canvas as { t?: unknown } | null | undefined;
  if (typeof scope?.t !== 'function') return englishTranslator;
  return (key, values) => (scope as { t: Translator }).t(key, values);
}
