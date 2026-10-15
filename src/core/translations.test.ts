// @vitest-environment jsdom
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';
import { canvasTranslator, createTranslator, resolvePluralRules, type FlowTranslations, type TranslationKey } from './translations';
import en from '../../locales/en.json';
import de from '../../locales/de.json';
import { createControlsPanel } from './controls-panel';
import { defaultFormatAnnouncement, FlowAnnouncer } from './announcer';

const polish = {
  'announce.nodesSelected_one': ':count węzeł',
  'announce.nodesSelected_few': ':count węzły',
  'announce.nodesSelected_many': ':count węzłów',
  'announce.nodesSelected_other': ':count węzła',
} satisfies FlowTranslations;

// Arabic uses all six plural categories; the dual (`_two`) usually spells the number out.
const arabic = {
  'announce.nodesAdded_zero': 'zero form',
  'announce.nodesAdded_one': 'one form',
  'announce.nodesAdded_two': 'dual form',
  'announce.nodesAdded_few': 'few form :count',
  'announce.nodesAdded_many': 'many form :count',
  'announce.nodesAdded_other': 'other form :count',
} satisfies FlowTranslations;

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

/**
 * Everything that would make a locale file wrong at runtime; empty when the file is valid.
 * Keys may be omitted (they fall back to English), but every key present must exist in
 * English, hold a string, keep English's placeholders and only use plural categories the
 * locale has. A specific plural form may spell the number out; `_other` must keep `:count`.
 */
function localeFileProblems(locale: string, messages: Record<string, unknown>): string[] {
  const english = en as Record<string, string>;
  const placeholders = (text: string) => new Set([...text.matchAll(/:([a-zA-Z]+)/g)].map((m) => m[1]));
  const problems: string[] = [];
  let supported: string[] = [];
  try {
    supported = Intl.PluralRules.supportedLocalesOf(locale.replace(/_/g, '-'));
  } catch {
    // An invalid tag is reported below.
  }
  if (supported.length === 0) problems.push(`${locale} is not a locale Intl.PluralRules knows`);
  // resolvePluralRules tolerates Laravel-style file names such as `pt_BR.json`.
  const categories: string[] = resolvePluralRules(locale).resolvedOptions().pluralCategories;
  const pluralBases = new Set<string>();
  for (const [key, value] of Object.entries(messages)) {
    const base = key.replace(PLURAL_SUFFIX, '');
    const suffix = key.slice(base.length + 1);
    // Plural forms are checked against the English `_other` form of their message.
    const reference = suffix ? english[`${base}_other`] : english[key];
    if (reference === undefined) {
      problems.push(`unknown key ${key}`);
      continue;
    }
    if (typeof value !== 'string') {
      problems.push(`${key} must be a string`);
      continue;
    }
    if (suffix) {
      pluralBases.add(base);
      if (!categories.includes(suffix)) problems.push(`${key}: ${locale} has no "${suffix}" plural category`);
    }
    const expected = placeholders(reference);
    const actual = placeholders(value);
    for (const name of actual) {
      if (!expected.has(name)) problems.push(`${key}: unknown placeholder :${name}`);
    }
    for (const name of expected) {
      const spelledOut = name === 'count' && suffix !== '' && suffix !== 'other';
      if (!actual.has(name) && !spelledOut) problems.push(`${key}: missing placeholder :${name}`);
    }
  }
  for (const base of pluralBases) {
    if (!(`${base}_other` in messages)) problems.push(`${base} needs an _other form`);
  }
  return problems;
}

describe('translations', () => {
  afterEach(() => {
    document.documentElement.lang = '';
  });

  it('types FlowTranslations as an explicit interface over the English keys', () => {
    const overrides: FlowTranslations = { ...en, 'controls.zoomIn': 'Closer' };
    // @ts-expect-error unknown keys are rejected instead of widening to any
    const typo: FlowTranslations = { 'controls.zoomInn': 'Closer' };
    const polishForms: FlowTranslations = { 'announce.edgesSelected_few': ':count krawędzie' };
    // @ts-expect-error only messages with a count have plural forms
    const notPlural: FlowTranslations = { 'controls.zoomIn_few': 'Closer' };
    type PluralMessage = 'announce.nodesAdded' | 'announce.nodesRemoved' | 'announce.connectionsAdded'
      | 'announce.connectionsRemoved' | 'announce.nodesSelected' | 'announce.edgesSelected';
    expectTypeOf<Extract<keyof FlowTranslations, keyof typeof en>>().toEqualTypeOf<keyof typeof en>();
    expectTypeOf<Exclude<keyof FlowTranslations, keyof typeof en>>()
      .toEqualTypeOf<`${PluralMessage}_${'zero' | 'two' | 'few' | 'many'}`>();
    expectTypeOf<'announce.nodesSelected'>().toMatchTypeOf<TranslationKey>();
    expectTypeOf<'announce.nodesSelected_one'>().not.toMatchTypeOf<TranslationKey>();
    expectTypeOf<'announce.nodesSelected_few'>().not.toMatchTypeOf<TranslationKey>();
    expect(createTranslator({ ...overrides, ...typo, ...polishForms, ...notPlural })('controls.zoomIn')).toBe('Closer');
  });

  it('falls back per dotted key and substitutes values literally in one pass', () => {
    expect(createTranslator({ 'controls.zoomIn': 'Closer' })('controls.zoomOut')).toBe('Zoom out');
    expect(createTranslator({ 'a11y.nodeLabel': ':label / :label' })('a11y.nodeLabel', { label: '$& :id <b>' }))
      .toBe('$& :id <b> / $& :id <b>');
  });

  it('replaces known placeholders longest-first like Laravel, without word boundaries', () => {
    const t = createTranslator({ 'a11y.nodeLabel': ':labelId/:label/:labelin/:count_x/:unknown' });
    expect(t('a11y.nodeLabel', { label: 'A', labelId: 'B', count: 5 })).toBe('B/A/Ain/5_x/:unknown');
  });

  it('resolves a message without plural forms even when values carry a count', () => {
    expect(createTranslator()('announce.viewportZoom', { percent: 50, count: 3 })).toBe('Viewport: zoom 50%');
    expect(createTranslator(de)('a11y.nodeId', { id: 'n', count: 0 })).toBe('Knoten n');
  });

  it('falls back to the _other form when a plural-only key is requested without a count', () => {
    expect(createTranslator()('announce.nodesSelected')).toBe(':count nodes');
    expect(createTranslator({ 'announce.nodesSelected_other': 'Knoten' })('announce.nodesSelected')).toBe('Knoten');
  });

  it('validates every locale file against the English keys and placeholders', () => {
    const files = import.meta.glob<Record<string, unknown>>('../../locales/*.json', { eager: true, import: 'default' });
    expect(Object.keys(files).length).toBeGreaterThan(1);
    for (const [path, messages] of Object.entries(files)) {
      const locale = path.replace(/^.*\/(.*)\.json$/, '$1');
      if (locale === 'en') continue;
      expect(localeFileProblems(locale, messages), `locales/${locale}.json`).toEqual([]);
    }
  });

  it('accepts locale files that use the plural categories of their language', () => {
    expect(localeFileProblems('pl', polish)).toEqual([]);
    expect(localeFileProblems('ar', arabic)).toEqual([]);
    expect(localeFileProblems('pt_BR', { 'controls.zoomIn': 'Ampliar' })).toEqual([]);
    expect(localeFileProblems('fr', {})).toEqual([]);
  });

  it('reports what would break a locale file', () => {
    expect(localeFileProblems('de', {
      'controls.zoomInn': 'Näher',
      'canvas.label': 5,
      'controls.zoomIn_few': 'Näher',
      'announce.nodesSelected_few': ':count Knoten',
      'a11y.nodeLabel': 'Knoten: :lable',
      'announce.nodesAdded_one': 'Knoten hinzugefügt',
      'announce.nodesAdded_other': 'Knoten hinzugefügt',
    })).toEqual([
      'unknown key controls.zoomInn',
      'canvas.label must be a string',
      'unknown key controls.zoomIn_few',
      'announce.nodesSelected_few: de has no "few" plural category',
      'a11y.nodeLabel: unknown placeholder :lable',
      'a11y.nodeLabel: missing placeholder :label',
      'announce.nodesAdded_other: missing placeholder :count',
      'announce.nodesSelected needs an _other form',
    ]);
    expect(localeFileProblems('german', {})).toEqual(['german is not a locale Intl.PluralRules knows']);
  });

  it('groups every key by UI area and ends plural keys with a CLDR category', () => {
    const areas = ['controls.', 'canvas.', 'a11y.', 'announce.', 'workflow.', 'schema.inspector.'];
    const categories = ['zero', 'one', 'two', 'few', 'many', 'other'];
    for (const key of Object.keys(en)) {
      expect(areas.some((area) => key.startsWith(area)), key).toBe(true);
      const suffix = key.split('_')[1];
      if (suffix !== undefined) expect(categories, key).toContain(suffix);
    }
  });

  it('selects the English plural form from count', () => {
    expect(createTranslator(undefined)('announce.connectionsRemoved', { count: 1 })).toBe('Removed 1 connection');
    expect(createTranslator(undefined)('announce.connectionsRemoved', { count: 2 })).toBe('Removed 2 connections');
    expect(createTranslator(undefined)('announce.connectionsRemoved', { count: 0 })).toBe('Removed 0 connections');
  });

  it('picks plural categories with Intl.PluralRules for the given locale', () => {
    const french = { 'announce.nodesSelected_one': ':count nœud', 'announce.nodesSelected_other': ':count nœuds' };
    expect(createTranslator(french, 'fr')('announce.nodesSelected', { count: 0 })).toBe('0 nœud');
    expect(createTranslator(french, 'fr')('announce.nodesSelected', { count: 2 })).toBe('2 nœuds');
    expect(createTranslator(polish, 'pl')('announce.nodesSelected', { count: 2 })).toBe('2 węzły');
    expect(createTranslator(polish, 'pl')('announce.nodesSelected', { count: 5 })).toBe('5 węzłów');
    expect(createTranslator(polish, 'pl')('announce.nodesSelected', { count: 22 })).toBe('22 węzły');
  });

  it('selects all six plural categories for a language that has them', () => {
    const t = createTranslator(arabic, 'ar');
    expect([0, 1, 2, 3, 11, 100].map((count) => t('announce.nodesAdded', { count }))).toEqual([
      'zero form', 'one form', 'dual form', 'few form 3', 'many form 11', 'other form 100',
    ]);
  });

  it('falls back to the _other form when a locale omits a category', () => {
    const { 'announce.nodesSelected_many': _many, ...withoutMany } = polish;
    expect(createTranslator(withoutMany, 'pl')('announce.nodesSelected', { count: 5 })).toBe('5 węzła');
  });

  it('applies English plural rules when falling back to English messages', () => {
    expect(createTranslator({}, 'fr')('announce.connectionsRemoved', { count: 0 })).toBe('Removed 0 connections');
  });

  it('normalises Laravel-style locales and ignores invalid tags', () => {
    const portuguese = { 'announce.nodesSelected_one': ':count nó', 'announce.nodesSelected_other': ':count nós' };
    expect(createTranslator(portuguese, 'pt_BR')('announce.nodesSelected', { count: 0 })).toBe('0 nó');
    expect(createTranslator(portuguese, 'not a locale!')('announce.nodesSelected', { count: 0 })).toBe('0 nós');
    expect(createTranslator(portuguese, '')('announce.nodesSelected', { count: 1 })).toBe('1 nó');
  });

  it('defaults the locale to the document language', () => {
    const french = { 'announce.nodesSelected_one': ':count nœud', 'announce.nodesSelected_other': ':count nœuds' };
    document.documentElement.lang = 'fr';
    expect(createTranslator(french)('announce.nodesSelected', { count: 0 })).toBe('0 nœud');
    document.documentElement.lang = 'en';
    expect(createTranslator(french)('announce.nodesSelected', { count: 0 })).toBe('0 nœuds');
  });

  it('ignores empty and non-string values and falls back to English', () => {
    const t = createTranslator({ 'canvas.loading': '', 'controls.zoomIn': 0, 'a11y.nodeLabel': ['x'] } as unknown as FlowTranslations);
    expect(t('canvas.loading')).toBe('Loading…');
    expect(t('controls.zoomIn')).toBe('Zoom in');
    expect(t('a11y.nodeLabel', { label: 'A' })).toBe('Node: A');
  });

  it('skips an empty plural form and uses the next fallback', () => {
    const t = createTranslator({ 'announce.nodesSelected_one': '', 'announce.nodesSelected_other': ':count Knoten' });
    expect(t('announce.nodesSelected', { count: 1 })).toBe('1 Knoten');
    expect(createTranslator({ 'announce.nodesSelected_other': '' })('announce.nodesSelected', { count: 2 })).toBe('2 nodes');
  });

  it('resolves messages once and ignores later changes to the source dictionary', () => {
    const source: FlowTranslations = { 'controls.zoomIn': 'Näher' };
    const t = createTranslator(source);
    source['controls.zoomIn'] = 'Geändert';
    expect(t('controls.zoomIn')).toBe('Näher');
  });

  it('delegates to the canvas t() and falls back to English for scopes without one', () => {
    const calls: unknown[] = [];
    const scope = { t: (key: string, values?: unknown) => { calls.push([key, values]); return 'from canvas'; } };
    expect(canvasTranslator(scope)('controls.zoomIn')).toBe('from canvas');
    expect(calls).toEqual([['controls.zoomIn', undefined]]);
    expect(canvasTranslator({})('controls.zoomIn')).toBe('Zoom in');
    expect(canvasTranslator(null)('announce.nodesSelected', { count: 2 })).toBe('2 nodes');
    expect(canvasTranslator(undefined)).toBe(canvasTranslator({ t: 'nope' }));
  });

  it('keeps controls isolated and translates state changes without inserting markup', () => {
    const english = document.createElement('div');
    const german = document.createElement('div');
    const options = {
      position: 'bottom-left' as const, orientation: 'vertical' as const,
      showZoom: true, showFitView: true, showInteractive: true, showResetPanels: true,
      onZoomIn() {}, onZoomOut() {}, onFitView() {}, onToggleInteractive() {},
      onResetPanels() {}, onToggleFullscreen() {},
    };
    const first = createControlsPanel(english, options);
    const second = createControlsPanel(german, { ...options, t: createTranslator({ ...de, 'controls.zoomIn': '<b>Vergrößern</b>' }) });
    expect(english.querySelector('[title="Zoom in"]')).not.toBeNull();
    expect(german.querySelector('[title="<b>Vergrößern</b>"]')).not.toBeNull();
    expect(german.querySelector('b')).toBeNull();
    second.update({ isInteractive: true, isFullscreen: true });
    expect(german.querySelector('[aria-label="Interaktion sperren"]')).not.toBeNull();
    expect(german.querySelector('[aria-label="Vollbild verlassen"]')).not.toBeNull();
    second.update({ isInteractive: false, isFullscreen: false });
    expect(german.querySelector('[aria-label="Interaktion entsperren"]')).not.toBeNull();
    expect(german.querySelector('[aria-label="Vollbild öffnen"]')).not.toBeNull();
    first.destroy();
    second.destroy();
  });

  it('translates announcements including singular and plural selections', () => {
    expect(defaultFormatAnnouncement('nodes-change', { type: 'add', nodes: [{ id: 'a' }] }, createTranslator(de))).toBe('Knoten hinzugefügt: a');
    expect(defaultFormatAnnouncement('selection-change', { nodes: ['a'], edges: ['e', 'f'] }, createTranslator(de))).toBe('1 Knoten und 2 Verbindungen ausgewählt');
    expect(defaultFormatAnnouncement('selection-change', { edges: ['e'] }, createTranslator(de))).toBe('1 Verbindung ausgewählt');
    expect(defaultFormatAnnouncement('selection-change', {}, createTranslator(de))).toBe('Auswahl aufgehoben');
    expect(defaultFormatAnnouncement('edges-change', { type: 'remove', edges: [{ id: 'e' }] }, createTranslator(de))).toBe('1 Verbindung entfernt');
  });

  it('announces a single removed connection without endpoints in the singular', () => {
    expect(defaultFormatAnnouncement('edges-change', { type: 'remove', edges: [{ id: 'e' }] })).toBe('Removed 1 connection');
  });

  it('pluralises announcements with the locale of the canvas', () => {
    const french = { 'announce.nodesSelected_one': ':count nœud', 'announce.nodesSelected_other': ':count nœuds' };
    expect(defaultFormatAnnouncement('selection-change', { nodes: [] , edges: ['e'] }, createTranslator({}, 'fr'))).toBe('1 edge selected');
    expect(defaultFormatAnnouncement('nodes-change', { type: 'remove', nodes: [] }, createTranslator(french, 'fr'))).toBe('Removed 0 nodes');
    expect(defaultFormatAnnouncement('selection-change', { nodes: ['a', 'b'] }, createTranslator(french, 'fr'))).toBe('2 nœuds selected');
  });

  it('hands the canvas translator to custom announcement formatters', () => {
    const container = document.createElement('div');
    const announcer = new FlowAnnouncer(
      container,
      (event, detail, t) => (event === 'fit-view' ? t('announce.viewFitted') : defaultFormatAnnouncement(event, detail, t)),
      createTranslator(de),
    );
    announcer.handleEvent('fit-view', {});
    expect(container.textContent).toBe('Ansicht an Inhalt angepasst');
    announcer.handleEvent('selection-change', {});
    expect(container.textContent).toBe('Auswahl aufgehoben');
    announcer.destroy();
  });

  it('preserves custom announcement formatters', () => {
    const container = document.createElement('div');
    const announcer = new FlowAnnouncer(container, () => '<b>Custom</b>', createTranslator(de));
    announcer.handleEvent('fit-view', {});
    expect(container.textContent).toBe('<b>Custom</b>');
    expect(container.querySelector('b')).toBeNull();
    announcer.destroy();
  });
});
