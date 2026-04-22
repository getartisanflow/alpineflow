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
import { inferReferences } from './references';
import { schemaToJSON, schemaFromJSON } from './serialization';
import { validateSchema } from './validate';
import { diffSchemas } from './diff';
import { registerNodeInspectorDirective } from './inspector/node-inspector';
import { registerRowInspectorDirective } from './inspector/row-inspector';
import { registerEdgeInspectorDirective } from './inspector/edge-inspector';

export * from './types';
export * from './validate';
export * from './diff';
export { addField, renameField, removeField, reorderFields, inferReferences, schemaToJSON, schemaFromJSON, validateSchema, diffSchemas };
export { registerNodeInspectorDirective, registerRowInspectorDirective, registerEdgeInspectorDirective };

export default function registerSchemaAddon(Alpine: Alpine): void {
    // Register the three-scope inspector directives. Guarded so stub calls in
    // tests (passing `{}` as Alpine) don't throw — only wire up when a real
    // Alpine.directive hook is available.
    if (Alpine && typeof Alpine.directive === 'function') {
        registerNodeInspectorDirective(Alpine);
        registerRowInspectorDirective(Alpine);
        registerEdgeInspectorDirective(Alpine);
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
        },
    });
}
