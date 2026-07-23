// ============================================================================
// alpineflow/schema — Subpath Addon
//
// Import: `import Schema from '@getartisanflow/alpineflow/schema'`
// Register: `Alpine.plugin(Schema)`
//
// Capabilities are added in Tasks 9–12:
//   - Field CRUD with edge cascade   (Task 9)   ← landed
//   - inferReferences()              (Task 10)
//   - schemaToJSON / schemaFromJSON  (Task 11)
//   - Three-scope inspector scaffold (Task 12)
// ============================================================================

import type { Alpine } from 'alpinejs';
import { registerAddon } from '../core/registry';
import { addField, renameField, removeField, reorderFields } from './field-ops';
import type {
    AddFieldResult,
    RenameFieldOpResult,
    RemoveFieldOpResult,
    ReorderFieldsOpResult,
} from './field-ops';
import { inferReferences } from './references';
import { schemaToJSON, schemaFromJSON } from './serialization';
import { validateSchema } from './validate';
import { diffSchemas } from './diff';
import { toDot } from './dot';
import { schemaLayout } from './layout';
import { attachSchemaHistory } from './history';
import { registerNodeInspectorDirective } from './inspector/node-inspector';
import { registerRowInspectorDirective } from './inspector/row-inspector';
import { registerEdgeInspectorDirective } from './inspector/edge-inspector';
import { registerSchemaReorderableDirective } from './reorderable';
import { registerSchemaKeyboardNavDirective } from './keyboard-nav';
import type {
    DotExportOptions,
    SchemaLayoutOptions,
    SchemaGraphJSON,
    SchemaValidationResult,
    SchemaDiff,
    DiffOptions,
    ReferenceSuggestion,
} from './types';
import type { FlowSchemaField } from '../core/types';

export * from './types';
export * from './validate';
export * from './diff';
export * from './dot';
export * from './layout';
export * from './history';
export { addField, renameField, removeField, reorderFields, inferReferences, schemaToJSON, schemaFromJSON, validateSchema, diffSchemas, toDot, schemaLayout, attachSchemaHistory };
export { registerNodeInspectorDirective, registerRowInspectorDirective, registerEdgeInspectorDirective, registerSchemaReorderableDirective, registerSchemaKeyboardNavDirective };
export type { AddFieldResult, RenameFieldOpResult, RemoveFieldOpResult, ReorderFieldsOpResult } from './field-ops';

export default function registerSchemaAddon(Alpine: Alpine): void {
    // Register the three-scope inspector directives. Guarded so stub calls in
    // tests (passing `{}` as Alpine) don't throw — only wire up when a real
    // Alpine.directive hook is available.
    if (Alpine && typeof Alpine.directive === 'function') {
        registerNodeInspectorDirective(Alpine);
        registerRowInspectorDirective(Alpine);
        registerEdgeInspectorDirective(Alpine);
        registerSchemaReorderableDirective(Alpine);
        registerSchemaKeyboardNavDirective(Alpine);
    }

    registerAddon('schema', {
        setup(canvas: any) {
            // Use the canvas container as the DOM event target so listeners
            // bound via @schema-* attributes on the container fire naturally.
            if (!canvas.el && canvas._container) {
                canvas.el = canvas._container;
            }

            canvas.addField = function (nodeId: string, field: any) {
                return addField(this, nodeId, field);
            };
            canvas.renameField = function (nodeId: string, oldName: string, newName: string) {
                return renameField(this, nodeId, oldName, newName);
            };
            canvas.removeField = function (nodeId: string, fieldName: string) {
                return removeField(this, nodeId, fieldName);
            };
            canvas.reorderFields = function (nodeId: string, order: string[]) {
                return reorderFields(this, nodeId, order);
            };
            canvas.inferReferences = function () {
                return inferReferences(this.nodes ?? []);
            };
            canvas.schemaToJSON = function () {
                return schemaToJSON(this);
            };
            canvas.schemaFromJSON = function (json: any) {
                return schemaFromJSON(this, json);
            };
            canvas.validateSchema = function () {
                return validateSchema(this);
            };
            canvas.diffSchemas = function (before: any, after: any, opts?: any) {
                return diffSchemas(before, after, opts);
            };
            canvas.toDot = function (opts?: DotExportOptions) {
                return toDot(this, opts);
            };
            canvas.schemaLayout = function (opts?: SchemaLayoutOptions) {
                return schemaLayout(this, opts);
            };
        },
    });
}

// ============================================================================
// Type augmentation — declare the methods `setup()` attaches at runtime on the
// shared `CanvasContext` interface, so consumers get typed access without
// importing the standalone `addField(canvas, …)` helpers and casting.
//
// Scoped to this entry's emitted types: the augmentation only reaches a program
// that imports `@getartisanflow/alpineflow/schema`. Purely type-level — erased
// from the JS bundle. Signatures mirror the wrapped standalone functions above.
// ============================================================================
declare module '../plugin/data/canvas-context' {
    interface CanvasContext {
        /** Append a field to a schema node. Rejects invalid/duplicate names silently. _(schema addon)_ */
        addField(nodeId: string, field: FlowSchemaField): AddFieldResult;
        /** Rename a field, cascading the change onto edges that reference it. _(schema addon)_ */
        renameField(nodeId: string, oldName: string, newName: string): RenameFieldOpResult;
        /** Remove a field, dropping edges that referenced it. _(schema addon)_ */
        removeField(nodeId: string, fieldName: string): RemoveFieldOpResult;
        /** Reorder a node's fields to match `order` (a list of field names). _(schema addon)_ */
        reorderFields(nodeId: string, order: string[]): ReorderFieldsOpResult;
        /** Suggest reference edges inferred from `<stem>_id` field-name conventions. _(schema addon)_ */
        inferReferences(): ReferenceSuggestion[];
        /** Serialize the schema graph to a stable, versioned JSON shape. _(schema addon)_ */
        schemaToJSON(): SchemaGraphJSON;
        /** Merge a schema-graph JSON into the live canvas nodes/edges. _(schema addon)_ */
        schemaFromJSON(json: SchemaGraphJSON): void;
        /** Validate the schema graph (dangling edges, duplicate fields, cycles, …). _(schema addon)_ */
        validateSchema(): SchemaValidationResult;
        /** Compute a structured delta between two schema snapshots. _(schema addon)_ */
        diffSchemas(before: SchemaGraphJSON, after: SchemaGraphJSON, opts?: DiffOptions): SchemaDiff;
        /** Render the schema graph as a graphviz DOT string. _(schema addon)_ */
        toDot(opts?: DotExportOptions): string;
        /** Lay out schema nodes by their reference graph. _(schema addon)_ */
        schemaLayout(opts?: SchemaLayoutOptions): Promise<void>;
    }
}
