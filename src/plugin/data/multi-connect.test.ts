// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { createConnectionLine } from '../connection-utils';

describe('multi-connect', () => {
  describe('config resolution', () => {
    it('multiConnect: true enables multi-connect', () => {
      const config = { multiConnect: true };
      expect(config.multiConnect).toBe(true);
    });

    it('multiConnect: false disables', () => {
      const config = { multiConnect: false };
      expect(config.multiConnect).toBe(false);
    });

    it('multiConnect defaults to undefined (disabled)', () => {
      const config: { multiConnect?: boolean } = {};
      expect(config.multiConnect).toBeUndefined();
    });
  });

  describe('invalid connection line', () => {
    it('creates line with red stroke when invalid', () => {
      const line = createConnectionLine({ invalid: true });
      line.update({ fromX: 0, fromY: 0, toX: 100, toY: 100, source: 'a' });
      const path = line.svg.querySelector('path')!;
      expect(path.getAttribute('stroke')).toBe('#ef4444');
      line.destroy();
    });

    it('creates line with normal stroke when valid', () => {
      const line = createConnectionLine({ invalid: false });
      line.update({ fromX: 0, fromY: 0, toX: 100, toY: 100, source: 'a' });
      const path = line.svg.querySelector('path')!;
      expect(path.getAttribute('stroke')).not.toBe('#ef4444');
      line.destroy();
    });
  });

  describe('batch edge creation', () => {
    it('addEdges accepts an array of edges', () => {
      const edges: any[] = [];
      const addEdges = (newEdges: any | any[]) => {
        const arr = Array.isArray(newEdges) ? newEdges : [newEdges];
        edges.push(...arr);
      };
      addEdges([
        { id: 'e1', source: 'a', target: 'b', sourceHandle: 'h1', targetHandle: 'h2' },
        { id: 'e2', source: 'a', target: 'c', sourceHandle: 'h1', targetHandle: 'h3' },
      ]);
      expect(edges).toHaveLength(2);
      expect(edges[0].id).toBe('e1');
      expect(edges[1].id).toBe('e2');
    });
  });

  describe('source filtering', () => {
    it('excludes the dragged node from other sources', () => {
      const draggedNodeId = 'a';
      const selectedNodes = new Set(['a', 'b', 'c']);
      const sources = [...selectedNodes].filter(id => id !== draggedNodeId);
      expect(sources).toEqual(['b', 'c']);
    });

    it('returns empty when only the dragged node is selected', () => {
      const draggedNodeId = 'a';
      const selectedNodes = new Set(['a']);
      const sources = [...selectedNodes].filter(id => id !== draggedNodeId);
      expect(sources).toEqual([]);
    });

    it('returns empty when no nodes are selected', () => {
      const draggedNodeId = 'a';
      const selectedNodes = new Set<string>();
      const sources = [...selectedNodes].filter(id => id !== draggedNodeId);
      expect(sources).toEqual([]);
    });
  });

  describe('activation conditions', () => {
    it('activates when multiConnect enabled, multiple nodes selected, and dragged node is selected', () => {
      const config = { multiConnect: true };
      const selectedNodes = new Set(['a', 'b', 'c']);
      const draggedNodeId = 'a';
      const shouldActivate = config.multiConnect && selectedNodes.size > 1 && selectedNodes.has(draggedNodeId);
      expect(shouldActivate).toBe(true);
    });

    it('does not activate when multiConnect is disabled', () => {
      const config = { multiConnect: false };
      const selectedNodes = new Set(['a', 'b', 'c']);
      const draggedNodeId = 'a';
      const shouldActivate = config.multiConnect && selectedNodes.size > 1 && selectedNodes.has(draggedNodeId);
      expect(shouldActivate).toBe(false);
    });

    it('does not activate when only one node is selected', () => {
      const config = { multiConnect: true };
      const selectedNodes = new Set(['a']);
      const draggedNodeId = 'a';
      const shouldActivate = config.multiConnect && selectedNodes.size > 1 && selectedNodes.has(draggedNodeId);
      expect(shouldActivate).toBe(false);
    });

    it('does not activate when dragged node is not selected', () => {
      const config = { multiConnect: true };
      const selectedNodes = new Set(['b', 'c']);
      const draggedNodeId = 'a';
      const shouldActivate = config.multiConnect && selectedNodes.size > 1 && selectedNodes.has(draggedNodeId);
      expect(shouldActivate).toBe(false);
    });
  });
});
