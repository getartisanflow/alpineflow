// ============================================================================
// Type-level test: the schema addon augments `CanvasContext` so the methods it
// attaches at runtime in `setup()` are visible on a typed canvas reference.
//
// This file is checked by `tsc --noEmit` (the repo's typecheck gate), NOT run
// by vitest — its filename ends in `.test-d.ts`, outside vitest's `*.test.ts`
// include glob. Importing the schema entry loads the module augmentation the
// same way a consumer's `import … from '@getartisanflow/alpineflow/schema'` does.
// ============================================================================

import type { CanvasContext } from '../plugin/data/canvas-context';
import type { FlowSchemaField } from '../core/types';
import type {
    SchemaGraphJSON,
    SchemaValidationResult,
    SchemaDiff,
    ReferenceSuggestion,
} from './types';
import type {
    AddFieldResult,
    RenameFieldOpResult,
    RemoveFieldOpResult,
    ReorderFieldsOpResult,
} from './field-ops';
// Side-effect import: pulls in the `declare module` augmentation shipped with
// the schema entry's types.
import './index';

declare const canvas: CanvasContext;

// ── addField ────────────────────────────────────────────────────────────────
const added: AddFieldResult = canvas.addField('users', { name: 'email', type: 'string' });
const _addedApplied: boolean = added.applied;
const _addedReason: string | undefined = added.reason;

// The field parameter is a FlowSchemaField.
declare const field: FlowSchemaField;
canvas.addField('users', field);

// ── renameField ─────────────────────────────────────────────────────────────
const renamed: RenameFieldOpResult = canvas.renameField('users', 'email', 'primary_email');
const _renamedCascaded: string[] = renamed.cascadedEdgeIds;

// ── removeField ─────────────────────────────────────────────────────────────
const removed: RemoveFieldOpResult = canvas.removeField('users', 'email');
const _removedDropped: string[] = removed.droppedEdgeIds;

// ── reorderFields ───────────────────────────────────────────────────────────
const reordered: ReorderFieldsOpResult = canvas.reorderFields('users', ['id', 'email', 'name']);
const _reorderedApplied: boolean = reordered.applied;

// ── inferReferences ─────────────────────────────────────────────────────────
const refs: ReferenceSuggestion[] = canvas.inferReferences();
const _refConfidence: 'exact' | 'stem' = refs[0].confidence;

// ── schemaToJSON / schemaFromJSON ───────────────────────────────────────────
const json: SchemaGraphJSON = canvas.schemaToJSON();
const _jsonVersion: 1 = json.version;
const _roundTrip: void = canvas.schemaFromJSON(json);

// ── validateSchema ──────────────────────────────────────────────────────────
const validation: SchemaValidationResult = canvas.validateSchema();
const _valid: boolean = validation.valid;

// ── diffSchemas ─────────────────────────────────────────────────────────────
const diff: SchemaDiff = canvas.diffSchemas(json, json);
const _diffAddedNodes: string[] = diff.addedNodes;
// opts is optional
canvas.diffSchemas(json, json, { detectRenames: true });

// ── toDot ───────────────────────────────────────────────────────────────────
const dot: string = canvas.toDot();
const _dotWithOpts: string = canvas.toDot({ rankdir: 'TB' });

// ── schemaLayout ────────────────────────────────────────────────────────────
const layout: Promise<void> = canvas.schemaLayout();
const _layoutWithOpts: Promise<void> = canvas.schemaLayout({ direction: 'TB' });

// Reference every binding so `noUnusedLocals`-style checks (if enabled) stay quiet.
export type _Assertions = [
    typeof _addedApplied,
    typeof _addedReason,
    typeof _renamedCascaded,
    typeof _removedDropped,
    typeof _reorderedApplied,
    typeof _refConfidence,
    typeof _jsonVersion,
    typeof _roundTrip,
    typeof _valid,
    typeof _diffAddedNodes,
    typeof _dotWithOpts,
    typeof layout,
    typeof _layoutWithOpts,
    typeof dot,
];
