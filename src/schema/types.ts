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
