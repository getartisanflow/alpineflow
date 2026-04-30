// ============================================================================
// alpineflow/schema — Reference inference
//
// Pure helper: scans node field names for the `<stem>_id` pattern and, when
// the stem exactly matches another node's id, emits a ReferenceSuggestion.
// No canvas mutation, no events, no self-references. Consumers decide whether
// to turn suggestions into real edges.
// ============================================================================

import type { ReferenceSuggestion } from './types';

interface NodeLike {
    id: string;
    data?: {
        fields?: Array<{ name: string; key?: string }>;
    };
}

/**
 * Pattern-match `_id`-suffixed field names to node ids, yielding suggested
 * reference edges. Conservative: only emits when the stem is an exact node id
 * match. Consumers pick what to apply.
 */
export function inferReferences(nodes: NodeLike[]): ReferenceSuggestion[] {
    const byId = new Map<string, NodeLike>();
    for (const node of nodes) {
        byId.set(node.id, node);
    }

    const suggestions: ReferenceSuggestion[] = [];

    for (const node of nodes) {
        const fields = node.data?.fields ?? [];
        for (const field of fields) {
            if (typeof field?.name !== 'string') {
                continue;
            }
            if (!field.name.endsWith('_id')) {
                continue;
            }

            const stem = field.name.slice(0, -3);
            if (!stem) {
                continue;
            }

            const target = byId.get(stem);
            if (!target) {
                continue;
            }
            if (target.id === node.id) {
                continue; // no self-refs
            }

            const targetFields = target.data?.fields ?? [];
            const primary = targetFields.find((f) => f.key === 'primary');
            const toFieldName = primary?.name ?? targetFields[0]?.name ?? 'id';

            suggestions.push({
                fromNodeId: node.id,
                fromFieldName: field.name,
                toNodeId: target.id,
                toFieldName,
                confidence: 'exact',
            });
        }
    }

    return suggestions;
}
