// ============================================================================
// alpineflow/schema — Type Definitions
//
// Full API surface for the schema designer addon.
// Implementations land in Tasks 9–12.
// ============================================================================

import type { FlowSchemaField } from '../core/types';

export interface AddFieldOptions {
    /** The field to append. Fails silently if the name already exists on the node. */
    field: FlowSchemaField;
}

export interface RenameFieldResult {
    applied: boolean;
    reason?: string;
    cascadedEdgeIds: string[];
}

export interface RemoveFieldResult {
    applied: boolean;
    droppedEdgeIds: string[];
}

export interface ReorderFieldsResult {
    applied: boolean;
}

export interface ReferenceSuggestion {
    fromNodeId: string;
    fromFieldName: string;
    toNodeId: string;
    toFieldName: string;
    confidence: 'exact' | 'stem';
}

export interface SchemaGraphJSON {
    version: 1;
    nodes: Array<{
        id: string;
        label: string;
        fields: FlowSchemaField[];
        position: { x: number; y: number };
    }>;
    edges: Array<{
        id: string;
        source: string;
        sourceHandle?: string;
        target: string;
        targetHandle?: string;
        label?: string;
    }>;
}

export type SchemaValidationIssueCode =
    | 'dangling-edge'
    | 'missing-primary-key'
    | 'duplicate-field'
    | 'duplicate-node-id'
    | 'disconnected-node'
    | 'cycle';

export interface SchemaValidationIssue {
    severity: 'error' | 'warning';
    code: SchemaValidationIssueCode;
    nodeId?: string;
    fieldName?: string;
    edgeId?: string;
    message: string;
}

export interface SchemaValidationResult {
    /** true when no 'error' severity issues exist. Warnings don't invalidate. */
    valid: boolean;
    issues: SchemaValidationIssue[];
}

export interface SchemaDiff {
    addedNodes: string[];
    removedNodes: string[];
    /** Heuristic: same fields shape + different id. Only detected if opts.detectRenames is true. */
    renamedNodes: Array<{ from: string; to: string }>;
    addedFields: Array<{ nodeId: string; fieldName: string }>;
    removedFields: Array<{ nodeId: string; fieldName: string }>;
    /** Consumer-supplied hints via opts.fieldRenames — walked and applied BEFORE added/removed detection. */
    renamedFields: Array<{ nodeId: string; from: string; to: string }>;
    /** Detected for fields that exist in both snapshots (by name, or by rename hint) with different `type` strings. */
    changedFieldTypes: Array<{ nodeId: string; fieldName: string; from: string; to: string }>;
    addedEdges: string[];
    removedEdges: string[];
}

export interface DiffOptions {
    /** Consumer hints for field renames — applied before added/removed detection. */
    fieldRenames?: Array<{ nodeId: string; from: string; to: string }>;
    /** When true, apply a basic node-rename heuristic (same field shape, different id). Default false. */
    detectRenames?: boolean;
}

export interface DotExportOptions {
    /** Graph layout direction. Default 'LR'. */
    rankdir?: 'TB' | 'LR' | 'BT' | 'RL';
    /** Node shape when HTML-like labels aren't used. Default 'plaintext' (enables HTML-like tables). */
    nodeShape?: string;
    /** Include field types in the rendered output. Default true. */
    includeFieldTypes?: boolean;
    /** Include field `key` (PK/FK) markers in the rendered output. Default true. */
    includeFieldKeys?: boolean;
    /** Graph name. Default 'schema'. */
    graphName?: string;
}
