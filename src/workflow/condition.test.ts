import { describe, it, expect } from 'vitest';
import { evaluateCondition } from './condition';

describe('evaluateCondition', () => {
    it('equals — matches', () => {
        expect(evaluateCondition({ field: 'plan', op: 'equals', value: 'annual' }, { plan: 'annual' })).toBe(true);
    });
    it('equals — misses', () => {
        expect(evaluateCondition({ field: 'plan', op: 'equals', value: 'annual' }, { plan: 'monthly' })).toBe(false);
    });
    it('notEquals', () => {
        expect(evaluateCondition({ field: 'plan', op: 'notEquals', value: 'annual' }, { plan: 'monthly' })).toBe(true);
    });
    it('in', () => {
        expect(evaluateCondition({ field: 'status', op: 'in', value: ['active', 'trial'] }, { status: 'trial' })).toBe(true);
    });
    it('notIn', () => {
        expect(evaluateCondition({ field: 'status', op: 'notIn', value: ['cancelled'] }, { status: 'active' })).toBe(true);
    });
    it('greaterThan', () => {
        expect(evaluateCondition({ field: 'amount', op: 'greaterThan', value: 100 }, { amount: 150 })).toBe(true);
    });
    it('lessThan', () => {
        expect(evaluateCondition({ field: 'amount', op: 'lessThan', value: 100 }, { amount: 50 })).toBe(true);
    });
    it('greaterThanOrEqual — boundary', () => {
        expect(evaluateCondition({ field: 'amount', op: 'greaterThanOrEqual', value: 100 }, { amount: 100 })).toBe(true);
    });
    it('lessThanOrEqual — boundary', () => {
        expect(evaluateCondition({ field: 'amount', op: 'lessThanOrEqual', value: 100 }, { amount: 100 })).toBe(true);
    });
    it('exists — present', () => {
        expect(evaluateCondition({ field: 'email', op: 'exists' }, { email: 'a@b.com' })).toBe(true);
    });
    it('exists — absent', () => {
        expect(evaluateCondition({ field: 'email', op: 'exists' }, {})).toBe(false);
    });
    it('exists — null', () => {
        expect(evaluateCondition({ field: 'email', op: 'exists' }, { email: null })).toBe(false);
    });
    it('matches regex', () => {
        expect(evaluateCondition({ field: 'code', op: 'matches', value: '^PRO-\\d+$' }, { code: 'PRO-123' })).toBe(true);
    });
    it('dot-path traversal', () => {
        expect(evaluateCondition(
            { field: 'customer.address.country', op: 'equals', value: 'US' },
            { customer: { address: { country: 'US' } } },
        )).toBe(true);
    });
    it('dot-path with missing intermediate', () => {
        expect(evaluateCondition({ field: 'a.b.c', op: 'exists' }, { a: {} })).toBe(false);
    });
});
