import { describe, expect, it } from 'vitest';
import { prettyPrintCondition } from './condition-pretty-print';

describe('prettyPrintCondition', () => {
    it('formats equals with string value (quoted)', () => {
        expect(prettyPrintCondition({ field: 'plan', op: 'equals', value: 'annual' })).toBe("plan == 'annual'");
    });

    it('formats equals with numeric value (bare)', () => {
        expect(prettyPrintCondition({ field: 'amount', op: 'equals', value: 100 })).toBe('amount == 100');
    });

    it('formats notEquals', () => {
        expect(prettyPrintCondition({ field: 'status', op: 'notEquals', value: 'cancelled' })).toBe("status != 'cancelled'");
    });

    it('formats numeric comparisons', () => {
        expect(prettyPrintCondition({ field: 'age', op: 'greaterThan', value: 18 })).toBe('age > 18');
        expect(prettyPrintCondition({ field: 'age', op: 'lessThan', value: 65 })).toBe('age < 65');
        expect(prettyPrintCondition({ field: 'age', op: 'greaterThanOrEqual', value: 18 })).toBe('age >= 18');
        expect(prettyPrintCondition({ field: 'age', op: 'lessThanOrEqual', value: 65 })).toBe('age <= 65');
    });

    it('formats in with array of strings', () => {
        expect(prettyPrintCondition({ field: 'region', op: 'in', value: ['US', 'CA'] })).toBe("region in ['US', 'CA']");
    });

    it('formats notIn', () => {
        expect(prettyPrintCondition({ field: 'role', op: 'notIn', value: ['admin'] })).toBe("role not in ['admin']");
    });

    it('formats exists without value', () => {
        expect(prettyPrintCondition({ field: 'email', op: 'exists' })).toBe('email exists');
    });

    it('formats matches as regex', () => {
        expect(prettyPrintCondition({ field: 'code', op: 'matches', value: '^PRO-\\d+$' })).toBe('code ~ /^PRO-\\d+$/');
    });

    it('preserves dot paths', () => {
        expect(prettyPrintCondition({ field: 'customer.address.country', op: 'equals', value: 'US' })).toBe("customer.address.country == 'US'");
    });

    it('returns a fallback for unknown ops', () => {
        expect(prettyPrintCondition({ field: 'x', op: 'unknown' as any, value: 1 })).toBe('x unknown 1');
    });

    it('renders null values as null literal', () => {
        expect(prettyPrintCondition({ field: 'note', op: 'equals', value: null })).toBe('note == null');
    });
});
