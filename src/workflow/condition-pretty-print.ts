// ============================================================================
// alpineflow/workflow — prettyPrintCondition
//
// Pure helper: turns a FlowCondition descriptor into a compact human-readable
// string for the condition-node body. Mirrored on the PHP side by
// FlowConditionNode::prettyPrintCondition() so the SSR fallback matches the
// runtime render.
//
// Usage:
//   prettyPrintCondition({ field: 'plan', op: 'equals', value: 'annual' })
//   → "plan == 'annual'"
// ============================================================================

export interface FlowConditionShape {
    field: string;
    op: string;
    value?: unknown;
}

const OP_MAP: Record<string, string> = {
    equals: '==',
    notEquals: '!=',
    greaterThan: '>',
    lessThan: '<',
    greaterThanOrEqual: '>=',
    lessThanOrEqual: '<=',
};

function formatValue(v: unknown): string {
    if (v === null) return 'null';
    if (v === undefined) return 'null';
    if (typeof v === 'string') return `'${v}'`;
    if (Array.isArray(v)) return `[${v.map(formatValue).join(', ')}]`;
    return String(v);
}

export function prettyPrintCondition(condition: FlowConditionShape): string {
    const { field, op, value } = condition;
    if (op in OP_MAP) {
        return `${field} ${OP_MAP[op]} ${formatValue(value)}`;
    }
    if (op === 'in') return `${field} in ${formatValue(value)}`;
    if (op === 'notIn') return `${field} not in ${formatValue(value)}`;
    if (op === 'exists') return `${field} exists`;
    if (op === 'matches') return `${field} ~ /${String(value)}/`;
    return `${field} ${op} ${formatValue(value)}`;
}
