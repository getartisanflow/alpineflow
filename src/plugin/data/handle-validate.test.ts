// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { HANDLE_VALIDATE_KEY } from '../directives/flow-handle-validate';

/**
 * Unit tests for per-handle validation logic.
 * Tests the HANDLE_VALIDATE_KEY expando and validator call pattern.
 */
describe('HANDLE_VALIDATE_KEY', () => {
  it('is a string constant', () => {
    expect(typeof HANDLE_VALIDATE_KEY).toBe('string');
    expect(HANDLE_VALIDATE_KEY).toBe('_flowHandleValidate');
  });

  it('can be set and read on an HTMLElement', () => {
    const el = document.createElement('div');
    const validator = vi.fn().mockReturnValue(true);
    el[HANDLE_VALIDATE_KEY] = validator;

    expect(el[HANDLE_VALIDATE_KEY]).toBe(validator);
    expect(el[HANDLE_VALIDATE_KEY]!({ source: 'a', target: 'b' })).toBe(true);
    expect(validator).toHaveBeenCalledWith({ source: 'a', target: 'b' });
  });

  it('can be deleted from an HTMLElement', () => {
    const el = document.createElement('div');
    el[HANDLE_VALIDATE_KEY] = () => true;
    delete el[HANDLE_VALIDATE_KEY];
    expect(el[HANDLE_VALIDATE_KEY]).toBeUndefined();
  });

  it('validator returning false rejects', () => {
    const el = document.createElement('div');
    el[HANDLE_VALIDATE_KEY] = () => false;
    expect(el[HANDLE_VALIDATE_KEY]!({ source: 'a', target: 'b' })).toBe(false);
  });

  it('validator receives full Connection object', () => {
    const el = document.createElement('div');
    const validator = vi.fn().mockReturnValue(true);
    el[HANDLE_VALIDATE_KEY] = validator;

    const connection = { source: 'n1', sourceHandle: 'out', target: 'n2', targetHandle: 'in' };
    el[HANDLE_VALIDATE_KEY]!(connection);
    expect(validator).toHaveBeenCalledWith(connection);
  });
});
