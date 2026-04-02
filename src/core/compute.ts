/**
 * Compute engine for node-to-node data propagation.
 *
 * Nodes register compute functions by type. The engine runs in topological
 * order, routing outputs through edges via handle port names.
 */

import type { FlowNode, FlowEdge } from './types';

export interface ComputeDefinition {
  /** Compute function. Receives gathered inputs (keyed by target handle name)
   *  and the node's own data object. Returns outputs keyed by output port name. */
  compute: (inputs: Record<string, any>, nodeData: Record<string, any>) => Record<string, any>;
}

export class ComputeEngine {
  private _registry = new Map<string, ComputeDefinition>();

  registerCompute(nodeType: string, definition: ComputeDefinition): void {
    this._registry.set(nodeType, definition);
  }

  hasCompute(nodeType: string): boolean {
    return this._registry.has(nodeType);
  }

  /**
   * Kahn's algorithm topological sort. Skips back-edges in cycles
   * by appending remaining nodes at the end.
   */
  topologicalSort(nodes: FlowNode[], edges: FlowEdge[]): FlowNode[] {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const inDegree = new Map<string, number>();
    const adj = new Map<string, string[]>();

    for (const n of nodes) {
      inDegree.set(n.id, 0);
      adj.set(n.id, []);
    }

    for (const e of edges) {
      if (!nodeMap.has(e.source) || !nodeMap.has(e.target)) continue;
      inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
      adj.get(e.source)!.push(e.target);
    }

    const queue: string[] = [];
    for (const [id, deg] of inDegree) {
      if (deg === 0) queue.push(id);
    }

    const sorted: FlowNode[] = [];
    while (queue.length > 0) {
      const id = queue.shift()!;
      sorted.push(nodeMap.get(id)!);
      for (const neighbor of adj.get(id) ?? []) {
        const newDeg = (inDegree.get(neighbor) ?? 0) - 1;
        inDegree.set(neighbor, newDeg);
        if (newDeg === 0) queue.push(neighbor);
      }
    }

    // Append any remaining nodes (part of cycles)
    if (sorted.length < nodes.length) {
      const sortedIds = new Set(sorted.map(n => n.id));
      for (const n of nodes) {
        if (!sortedIds.has(n.id)) sorted.push(n);
      }
    }

    return sorted;
  }

  /**
   * Run compute propagation.
   *
   * @param nodes All nodes in the graph
   * @param edges All edges in the graph
   * @param startNodeId If provided, only compute this node and its downstream descendants
   * @returns Map of nodeId → output data for nodes that had a registered compute function
   */
  compute(
    nodes: FlowNode[],
    edges: FlowEdge[],
    startNodeId?: string,
  ): Map<string, Record<string, any>> {
    const sorted = this.topologicalSort(nodes, edges);

    // Build outputs map — seed with existing $outputs for upstream nodes
    // when doing partial computation
    const outputs = new Map<string, Record<string, any>>();
    if (startNodeId) {
      for (const n of nodes) {
        if (n.data.$outputs) {
          outputs.set(n.id, n.data.$outputs);
        }
      }
    }

    // Determine which nodes to compute
    let computeSet: Set<string> | null = null;
    if (startNodeId) {
      computeSet = this._getDownstream(startNodeId, edges);
      computeSet.add(startNodeId);
    }

    const results = new Map<string, Record<string, any>>();

    for (const node of sorted) {
      if (computeSet && !computeSet.has(node.id)) continue;

      const def = this._registry.get(node.type ?? 'default');
      if (!def) continue;

      // Gather inputs from upstream outputs via edges
      const inputs: Record<string, any> = {};
      const incomingEdges = edges.filter(e => e.target === node.id);
      for (const e of incomingEdges) {
        const sourceOutputs = outputs.get(e.source);
        if (!sourceOutputs) continue;
        const sourcePort = e.sourceHandle ?? 'default';
        const targetPort = e.targetHandle ?? 'default';
        if (sourcePort in sourceOutputs) {
          inputs[targetPort] = sourceOutputs[sourcePort];
        }
      }

      const result = def.compute(inputs, node.data);
      outputs.set(node.id, result);
      results.set(node.id, result);

      // Write to node data for reactive binding
      node.data.$inputs = inputs;
      node.data.$outputs = result;
    }

    return results;
  }

  /** Get all downstream node IDs reachable from a start node. */
  private _getDownstream(startId: string, edges: FlowEdge[]): Set<string> {
    const adj = new Map<string, string[]>();
    for (const e of edges) {
      let list = adj.get(e.source);
      if (!list) { list = []; adj.set(e.source, list); }
      list.push(e.target);
    }

    const visited = new Set<string>();
    const stack = [startId];
    while (stack.length > 0) {
      const id = stack.pop()!;
      if (visited.has(id)) continue;
      visited.add(id);
      for (const neighbor of adj.get(id) ?? []) {
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }
    visited.delete(startId);
    return visited;
  }
}
