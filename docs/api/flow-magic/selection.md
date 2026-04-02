---
title: Selection & Filtering
description: Manage node, edge, and row selection and filtering.
order: 5
---

# Selection

| Method | Signature | Description |
|---|---|---|
| `deselectAll` | `(): void` | Clear all node, edge, and row selections. Removes CSS classes and emits `selection-change`. |
| `selectRow` | `(rowId: string): void` | Select a row by its composite ID (`nodeId.attrId`). Emits `row-select` and `row-selection-change`. |
| `deselectRow` | `(rowId: string): void` | Deselect a row. Emits `row-deselect` and `row-selection-change`. |
| `toggleRowSelect` | `(rowId: string): void` | Toggle a row's selection state. |
| `getSelectedRows` | `(): string[]` | Get an array of all selected row IDs. |
| `isRowSelected` | `(rowId: string): boolean` | Check if a specific row is selected. |
| `deselectAllRows` | `(): void` | Clear all row selections. Removes `.flow-row-selected` CSS class. |

---

# Filtering

### setRowFilter

```ts
$flow.setRowFilter(nodeId: string, filter: RowFilter): void
```

Set a row-level filter on a specific node. `RowFilter` can be `'all'`, `'connected'`, `'unconnected'`, or a custom predicate `(row) => boolean`.

### getRowFilter

```ts
$flow.getRowFilter(nodeId: string): RowFilter
```

Get the current row filter for a node. Returns `'all'` if none is set.

### getVisibleRows

```ts
$flow.getVisibleRows(nodeId: string, schema: any[]): any[]
```

Apply the node's row filter to a schema array and return only the visible rows. When filter is `'connected'`, returns rows whose attribute ID matches an edge handle; `'unconnected'` returns the inverse.

### setNodeFilter

```ts
$flow.setNodeFilter(predicate: (node: FlowNode) => boolean): void
```

Apply a node-level filter. Nodes that fail the predicate get `filtered = true` (CSS-driven visibility). Emits `node-filter-change`.

### clearNodeFilter

```ts
$flow.clearNodeFilter(): void
```

Remove the node filter, restoring all nodes to visible.
