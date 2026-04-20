// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { runConnectValidator } from './flow-handle';
import type { Connection } from '../../core/types';

const conn = (overrides: Partial<Connection> = {}): Connection => ({
  source: 'a',
  sourceHandle: 'source',
  target: 'b',
  targetHandle: 'target',
  ...overrides,
});

describe('runConnectValidator', () => {
  it('returns allowed:true when no validator is configured', async () => {
    const result = await runConnectValidator(
      undefined,
      conn(),
      null,
      null,
      document.body,
      'flow-handle-validating',
    );
    expect(result.allowed).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('resolves with allowed:true when validator returns true', async () => {
    const result = await runConnectValidator(
      async () => true,
      conn(),
      null,
      null,
      document.body,
      'flow-handle-validating',
    );
    expect(result.allowed).toBe(true);
  });

  it('resolves with allowed:false when validator returns false', async () => {
    const result = await runConnectValidator(
      async () => false,
      conn(),
      null,
      null,
      document.body,
      'flow-handle-validating',
    );
    expect(result.allowed).toBe(false);
  });

  it('passes through { allowed, reason }', async () => {
    const result = await runConnectValidator(
      async () => ({ allowed: false, reason: 'FK cycle' }),
      conn(),
      null,
      null,
      document.body,
      'flow-handle-validating',
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('FK cycle');
  });

  it('passes through { allowed: true, reason } without swallowing the reason', async () => {
    const result = await runConnectValidator(
      async () => ({ allowed: true, reason: 'verified' }),
      conn(),
      null,
      null,
      document.body,
      'flow-handle-validating',
    );
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe('verified');
  });

  it('adds the validating class to source + target handles while awaiting, removes after', async () => {
    const src = document.createElement('div');
    const tgt = document.createElement('div');
    let sawClassDuringAwait = false;
    const validator = async () => {
      sawClassDuringAwait =
        src.classList.contains('flow-handle-validating') &&
        tgt.classList.contains('flow-handle-validating');
      return true;
    };
    await runConnectValidator(
      validator,
      conn(),
      src,
      tgt,
      document.body,
      'flow-handle-validating',
    );
    expect(sawClassDuringAwait).toBe(true);
    expect(src.classList.contains('flow-handle-validating')).toBe(false);
    expect(tgt.classList.contains('flow-handle-validating')).toBe(false);
  });

  it('respects a custom validatingHandleClass', async () => {
    const src = document.createElement('div');
    const tgt = document.createElement('div');
    let sawCustomClass = false;
    const validator = async () => {
      sawCustomClass =
        src.classList.contains('my-pulse') && tgt.classList.contains('my-pulse');
      return true;
    };
    await runConnectValidator(validator, conn(), src, tgt, document.body, 'my-pulse');
    expect(sawCustomClass).toBe(true);
    expect(src.classList.contains('my-pulse')).toBe(false);
    expect(tgt.classList.contains('my-pulse')).toBe(false);
  });

  it('removes the validating class even when the validator throws', async () => {
    const src = document.createElement('div');
    const tgt = document.createElement('div');
    await runConnectValidator(
      async () => { throw new Error('boom'); },
      conn(),
      src,
      tgt,
      document.body,
      'flow-handle-validating',
    );
    expect(src.classList.contains('flow-handle-validating')).toBe(false);
    expect(tgt.classList.contains('flow-handle-validating')).toBe(false);
  });

  it('dispatches flow-connect-validating and flow-connect-validated events', async () => {
    const container = document.createElement('div');
    const starts: any[] = [];
    const ends: any[] = [];
    container.addEventListener('flow-connect-validating', (e: any) => starts.push(e.detail));
    container.addEventListener('flow-connect-validated', (e: any) => ends.push(e.detail));
    await runConnectValidator(
      async () => ({ allowed: false, reason: 'nope' }),
      conn({ source: 'a', target: 'b' }),
      null,
      null,
      container,
      'flow-handle-validating',
    );
    expect(starts).toHaveLength(1);
    expect(starts[0].connection.source).toBe('a');
    expect(starts[0].connection.target).toBe('b');
    expect(ends).toHaveLength(1);
    expect(ends[0].allowed).toBe(false);
    expect(ends[0].reason).toBe('nope');
  });

  it('dispatches flow-connect-validated with allowed:true + undefined reason on a plain bool success', async () => {
    const container = document.createElement('div');
    const ends: any[] = [];
    container.addEventListener('flow-connect-validated', (e: any) => ends.push(e.detail));
    await runConnectValidator(
      async () => true,
      conn(),
      null,
      null,
      container,
      'flow-handle-validating',
    );
    expect(ends).toHaveLength(1);
    expect(ends[0].allowed).toBe(true);
    expect(ends[0].reason).toBeUndefined();
  });

  it('treats a thrown validator as allowed:false and dispatches the validated event', async () => {
    const container = document.createElement('div');
    const ends: any[] = [];
    container.addEventListener('flow-connect-validated', (e: any) => ends.push(e.detail));
    const result = await runConnectValidator(
      async () => { throw new Error('boom'); },
      conn(),
      null,
      null,
      container,
      'flow-handle-validating',
    );
    expect(result.allowed).toBe(false);
    expect(ends).toHaveLength(1);
    expect(ends[0].allowed).toBe(false);
  });

  it('does not dispatch events when no validator is configured', async () => {
    const container = document.createElement('div');
    const starts: any[] = [];
    const ends: any[] = [];
    container.addEventListener('flow-connect-validating', (e: any) => starts.push(e.detail));
    container.addEventListener('flow-connect-validated', (e: any) => ends.push(e.detail));
    await runConnectValidator(undefined, conn(), null, null, container, 'x');
    expect(starts).toHaveLength(0);
    expect(ends).toHaveLength(0);
  });

  it('both events bubble so devs can listen on ancestors', async () => {
    const outer = document.createElement('div');
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const starts: any[] = [];
    const ends: any[] = [];
    outer.addEventListener('flow-connect-validating', (e: any) => starts.push(e.detail));
    outer.addEventListener('flow-connect-validated', (e: any) => ends.push(e.detail));
    await runConnectValidator(
      async () => true,
      conn(),
      null,
      null,
      inner,
      'flow-handle-validating',
    );
    expect(starts).toHaveLength(1);
    expect(ends).toHaveLength(1);
  });
});
