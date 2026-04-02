import { describe, it, expect } from 'vitest';
import { parseFilterDirective } from './flow-filter';

describe('parseFilterDirective', () => {
  it('parses node filter', () => {
    expect(parseFilterDirective('node', [])).toEqual({
      type: 'node', isClear: false,
    });
  });

  it('parses node filter with clear', () => {
    expect(parseFilterDirective('node', ['clear'])).toEqual({
      type: 'node', isClear: true,
    });
  });

  it('parses row filter', () => {
    expect(parseFilterDirective('row', [])).toEqual({
      type: 'row', isClear: false,
    });
  });

  it('parses row filter with clear', () => {
    expect(parseFilterDirective('row', ['clear'])).toEqual({
      type: 'row', isClear: true,
    });
  });

  it('returns null for unknown arg', () => {
    expect(parseFilterDirective('unknown', [])).toBeNull();
  });
});
