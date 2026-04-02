import { describe, it, expect } from 'vitest';
import { parseFollowExpression } from './flow-follow';

describe('parseFollowExpression', () => {
  it('parses string as node ID', () => {
    expect(parseFollowExpression('node-1')).toEqual({ target: 'node-1' });
  });

  it('parses object with target only', () => {
    expect(parseFollowExpression({ target: 'node-1' })).toEqual({ target: 'node-1' });
  });

  it('parses object with all options', () => {
    expect(parseFollowExpression({ target: 'node-1', zoom: 1.5, speed: 0.1 })).toEqual({
      target: 'node-1', zoom: 1.5, speed: 0.1,
    });
  });

  it('ignores non-number zoom/speed', () => {
    expect(parseFollowExpression({ target: 'node-1', zoom: 'high', speed: 'fast' })).toEqual({
      target: 'node-1', zoom: undefined, speed: undefined,
    });
  });

  it('returns null for non-string non-object', () => {
    expect(parseFollowExpression(42)).toBeNull();
    expect(parseFollowExpression(null)).toBeNull();
    expect(parseFollowExpression(undefined)).toBeNull();
  });

  it('returns null for object without target', () => {
    expect(parseFollowExpression({ zoom: 1.5 })).toBeNull();
  });
});
