import type { FlowCondition } from './types';

/** Resolve a dot-path like 'customer.address.country' from an object. */
function getByPath(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

/** Evaluate a single FlowCondition against a payload. */
export function evaluateCondition(condition: FlowCondition, payload: Record<string, any>): boolean {
    const fieldValue = getByPath(payload, condition.field);
    switch (condition.op) {
        case 'equals':             return fieldValue === condition.value;
        case 'notEquals':          return fieldValue !== condition.value;
        case 'in':                 return Array.isArray(condition.value) && condition.value.includes(fieldValue);
        case 'notIn':              return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
        case 'greaterThan':        return fieldValue > condition.value;
        case 'lessThan':           return fieldValue < condition.value;
        case 'greaterThanOrEqual': return fieldValue >= condition.value;
        case 'lessThanOrEqual':    return fieldValue <= condition.value;
        case 'exists':             return fieldValue !== undefined && fieldValue !== null;
        case 'matches':            return new RegExp(condition.value).test(String(fieldValue ?? ''));
        default:                   return false;
    }
}
