---
title: TypeScript Types
description: Key type definitions exported by AlpineFlow.
order: 3
---

# TypeScript Types

AlpineFlow exports all key types for use in TypeScript projects.

```ts
import type { FlowNode, FlowEdge, Viewport } from '@getartisanflow/alpineflow';
```

---

## FlowNode

The primary node data structure. Generic parameter `T` defaults to `Record<string, any>` for the `data` property.

```ts
interface FlowNode<T = Record<string, any>> {
  /** Unique node identifier. */
  id: string;

  /** Position in flow coordinates. Relative to parent when `parentId` is set. */
  position: XYPosition;

  /** Arbitrary data payload for the node. */
  data: T;

  /** Node type -- maps to a rendering template. Default: 'default' */
  type?: string;

  /** Width/height, populated after DOM measurement. */
  dimensions?: Dimensions;

  /**
   * Opt-in to inline `style.height` on leaf nodes and opt out of ResizeObserver updates.
   * Use for decorative or fixed-size nodes. Container nodes (those with `childLayout`
   * or that are parents via `parentId`) receive inline height unconditionally —
   * this flag is specifically for making a leaf node behave as fixed-size.
   * Auto-set to `true` by the system on resize drag, compute output, and `dimensions.height` animations.
   */
  fixedDimensions?: boolean;

  /**
   * Include this node in the shared ResizeObserver. Default: `true`.
   * Set `false` for annotation nodes or decorative overlays where measurement is noise.
   */
  resizeObserver?: boolean;

  /** Lower bound for observed dimensions. Either axis may be omitted (no constraint on that axis). Applied by the ResizeObserver before updating `node.dimensions`. */
  minDimensions?: Partial<Dimensions>;

  /** Upper bound for observed dimensions. Use `Infinity` for unbounded on one axis. */
  maxDimensions?: Partial<Dimensions>;

  /** Anchor point: [0,0] = top-left (default), [0.5,0.5] = center, [1,1] = bottom-right. */
  nodeOrigin?: [number, number];

  /** Can this node be dragged? Default: true */
  draggable?: boolean;

  /** Can edges connect to this node? Default: true */
  connectable?: boolean;

  /** Handle visibility: 'visible' (default), 'hidden', 'hover', 'select'. */
  handles?: 'visible' | 'hidden' | 'hover' | 'select';

  /** Can this node be selected? Default: true */
  selectable?: boolean;

  /** Can this node be resized via x-flow-resizer? Default: true */
  resizable?: boolean;

  /** Can this node receive keyboard focus? Default: follows nodesFocusable config. */
  focusable?: boolean;

  /** Override the ARIA role. Default: 'group' */
  ariaRole?: string;

  /** Override the auto-generated aria-label. */
  ariaLabel?: string;

  /** Arbitrary DOM attributes (e.g. data-*, aria-describedby). */
  domAttributes?: Record<string, string>;

  /** Hide this node from rendering. Connected edges are also hidden. Default: false */
  hidden?: boolean;

  /** Whether connected nodes are collapsed (hidden). Default: false */
  collapsed?: boolean;

  /** Whether internal rows are condensed (summary view). Default: false */
  condensed?: boolean;

  /** Row filter: 'all' | 'connected' | 'unconnected' | ((row) => boolean). */
  rowFilter?: RowFilter;

  /** Whether excluded by a node-level filter. CSS-driven visibility. */
  filtered?: boolean;

  /** Dimensions to use when this group node is collapsed. Default: { width: 150, height: 60 } */
  collapsedDimensions?: Dimensions;

  /** Can this node be deleted via keyboard? Default: true */
  deletable?: boolean;

  /** Skip reconnection for this node when reconnectOnDelete is enabled. Default: true */
  reconnectOnDelete?: boolean;

  /** Is this node currently selected? */
  selected?: boolean;

  /** Optional CSS class(es). */
  class?: string;

  /** Optional inline styles (string or object). */
  style?: string | Record<string, string>;

  /** Parent node ID -- position becomes relative to parent. */
  parentId?: string;

  /** Clamp child within parent bounds or provide coordinate boundaries. */
  extent?: 'parent' | CoordinateExtent;

  /** Grow parent dimensions when child reaches edge. Only used when parentId is set. */
  expandParent?: boolean;

  /** Explicit z-index. For children: computed = parentZ + 1 + zIndex */
  zIndex?: number;

  /** Default position for source handles. */
  sourcePosition?: HandlePosition;

  /** Default position for target handles. */
  targetPosition?: HandlePosition;

  /** Node shape variant (circle, diamond, hexagon, etc.). */
  shape?: NodeShape | string;

  /** Rotation angle in degrees. Default: 0 */
  rotation?: number;

  /** When true, this node accepts other nodes dropped onto it as children. */
  droppable?: boolean;

  /** Predicate to filter which nodes may be dropped into this node. */
  acceptsDrop?: (node: FlowNode) => boolean;

  /** Opt-in layout for children. Implies preventChildEscape: true. */
  childLayout?: ChildLayout;

  /** Sort order within a layout parent. Lower = first. */
  order?: number;

  /** Current child validation errors (internal). */
  _validationErrors?: string[];
}
```

---

## FlowEdge

The primary edge data structure.

```ts
interface FlowEdge<T = Record<string, any>> {
  /** Unique edge identifier. */
  id: string;

  /** Source node ID. */
  source: string;

  /** Target node ID. */
  target: string;

  /** Which handle on the source node. Default: 'source' */
  sourceHandle?: string;

  /** Which handle on the target node. Default: 'target' */
  targetHandle?: string;

  /** Edge path type. Default: 'bezier'. */
  type?: EdgeType | (string & {});

  /** Path style for floating edges. Only used when type is 'floating'. Default: 'bezier' */
  pathType?: 'bezier' | 'smoothstep' | 'straight';

  /** Animation mode: true/'dash' for scrolling dashes, 'pulse' for breathing, 'dot' for traveling circle. */
  animated?: boolean | EdgeAnimationMode;

  /** Animation cycle duration (CSS time, e.g. '1s', '300ms'). */
  animationDuration?: string;

  /** Is this edge currently selected? */
  selected?: boolean;

  /** Can this edge be reconnected by dragging endpoints? Default: true.
   *  Set to 'source' or 'target' for one-end-only. */
  reconnectable?: boolean | 'source' | 'target';

  /** Hide this edge from rendering. Default: false */
  hidden?: boolean;

  /** Can this edge be deleted via keyboard? Default: true */
  deletable?: boolean;

  /** Can this edge receive keyboard focus? */
  focusable?: boolean;

  /** Override ARIA role. Default: 'group' */
  ariaRole?: string;

  /** Override auto-generated aria-label. */
  ariaLabel?: string;

  /** Arbitrary DOM attributes. */
  domAttributes?: Record<string, string>;

  /** Arbitrary data attached to the edge. */
  data?: T;

  /** Label visibility: 'always' (default), 'hover', 'selected'. */
  labelVisibility?: 'always' | 'hover' | 'selected';

  /** Center label text. */
  label?: string;

  /** Center label position along path (0 = source, 1 = target). Default: 0.5 */
  labelPosition?: number;

  /** Label near the source end. */
  labelStart?: string;

  /** Source label offset in flow coordinates. Default: 30 */
  labelStartOffset?: number;

  /** Label near the target end. */
  labelEnd?: string;

  /** Target label offset in flow coordinates. Default: 30 */
  labelEndOffset?: number;

  /** SVG marker at the start (arrowhead, etc.). */
  markerStart?: MarkerType | MarkerConfig;

  /** SVG marker at the end (arrowhead, etc.). */
  markerEnd?: MarkerType | MarkerConfig;

  /** Stroke color -- solid string or gradient object. */
  color?: string | EdgeGradient;

  /** Gradient direction. Only for EdgeGradient color. Default: 'source-target' */
  gradientDirection?: 'source-target' | 'target-source';

  /** Visible stroke width in SVG units. Default: 1.5 */
  strokeWidth?: number;

  /** Invisible hit area width (SVG units). Default: 20 */
  interactionWidth?: number;

  /** Optional CSS class(es). */
  class?: string;

  /** Optional inline styles. */
  style?: string | Record<string, string>;

  /** Particle/dot fill color. */
  particleColor?: string;

  /** Particle/dot radius (unitless SVG). */
  particleSize?: number;

  /** User-placed waypoints for editable edges. */
  controlPoints?: { x: number; y: number }[];

  /** Path style between control points (editable edges). Default: 'bezier' */
  pathStyle?: 'linear' | 'step' | 'smoothstep' | 'catmull-rom' | 'bezier';

  /** Always show control point handles (vs only when selected). Default: false */
  showControlPoints?: boolean;
}
```

---

## Core Primitives

### Viewport

```ts
interface Viewport {
  x: number;     // horizontal pan offset
  y: number;     // vertical pan offset
  zoom: number;  // zoom level (1 = 100%)
}
```

### XYPosition

```ts
interface XYPosition {
  x: number;
  y: number;
}
```

### Rect

```ts
interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

### Dimensions

```ts
interface Dimensions {
  width: number;
  height: number;
}
```

### CoordinateExtent

```ts
type CoordinateExtent = [[number, number], [number, number]];
// [[minX, minY], [maxX, maxY]]
```

---

## Connection

```ts
interface Connection {
  source: string;
  sourceHandle?: string;
  target: string;
  targetHandle?: string;
}
```

---

## Handle Types

### HandlePosition

```ts
type HandlePosition =
  | 'top' | 'right' | 'bottom' | 'left'
  | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
```

### HandleType

```ts
type HandleType = 'source' | 'target';
```

---

## Edge Types

### EdgeType

```ts
type EdgeType =
  | 'bezier'
  | 'smoothstep'
  | 'straight'
  | 'floating'
  | 'orthogonal'
  | 'avoidant'
  | 'editable';
```

### EdgeAnimationMode

```ts
type EdgeAnimationMode = 'none' | 'dash' | 'pulse' | 'dot';
```

### EdgeGradient

```ts
interface EdgeGradient {
  from: string;  // start color
  to: string;    // end color
}
```

---

## Markers

### MarkerType

```ts
type MarkerType = 'arrow' | 'arrowclosed';
```

### MarkerConfig

```ts
interface MarkerConfig {
  type: MarkerType;
  color?: string;
  width?: number;
  height?: number;
  orient?: string;    // Default: 'auto-start-reverse'
  offset?: number;
}
```

Markers can be specified as a shorthand string or a full config object:

```js
// Shorthand
{ markerEnd: 'arrowclosed' }

// Full config
{ markerEnd: { type: 'arrow', color: '#ef4444', width: 20, height: 20 } }
```

---

## Animation Types

### AnimateTargets

```ts
interface AnimateTargets {
  nodes?: Record<string, AnimateNodeTarget>;
  edges?: Record<string, AnimateEdgeTarget>;
  viewport?: AnimateViewportTarget;
}
```

### AnimateNodeTarget

```ts
type AnimateNodeTarget = {
  position?: Partial<XYPosition>;
  data?: Record<string, any>;
  class?: string;
  style?: string | Record<string, string>;
  dimensions?: Partial<Dimensions>;
  selected?: boolean;
  zIndex?: number;
  _duration?: number;   // per-element duration override
}
```

### AnimateEdgeTarget

```ts
type AnimateEdgeTarget = {
  color?: string | { from: string; to: string };
  label?: string;
  strokeWidth?: number;
  animated?: boolean;
  class?: string;
  _duration?: number;   // per-element duration override
}
```

### AnimateViewportTarget

```ts
type AnimateViewportTarget = {
  pan?: Partial<XYPosition>;
  zoom?: number;
  _duration?: number;   // per-element duration override
}
```

### AnimateOptions

```ts
interface AnimateOptions {
  /** Duration in ms. 0 = instant. Default: 300 */
  duration?: number;
  /** Easing preset name or custom function. Default: 'easeInOut' */
  easing?: EasingName | ((t: number) => number);
  /** Delay before starting in ms. Default: 0 */
  delay?: number;
  /** true = loop forever, 'reverse' = ping-pong. Default: false */
  loop?: boolean | 'reverse';
  /** Called each frame with progress 0-1. */
  onProgress?: (progress: number) => void;
  /** Called when animation completes. */
  onComplete?: () => void;
}
```

### FlowAnimationHandle

```ts
interface FlowAnimationHandle {
  pause(): void;
  resume(): void;
  stop(): void;
  reverse(): void;
  readonly finished: Promise<void>;
}
```

### FollowOptions

```ts
interface FollowOptions {
  zoom?: number;
  padding?: number;
  easing?: EasingName | ((t: number) => number);
}
```

### ParticleOptions

```ts
interface ParticleOptions {
  /** Particle fill color. */
  color?: string;
  /** Particle radius in SVG user units. */
  size?: number;
  /** Travel duration (CSS time, e.g. '2s', '300ms'). */
  duration?: string;
  /** CSS class(es) for the circle element. */
  class?: string;
  /** Called when the particle reaches the target. */
  onComplete?: () => void;
}
```

### ParticleHandle

```ts
interface ParticleHandle {
  /** Get the particle's current SVG position, or null if completed. */
  getCurrentPosition(): XYPosition | null;
  /** Stop and remove the particle immediately. */
  stop(): void;
  /** Resolves when the particle finishes. */
  readonly finished: Promise<void>;
}
```

---

## Child Layout & Validation

### ChildLayout

```ts
interface ChildLayout {
  /** Arrangement direction. */
  direction: 'vertical' | 'horizontal' | 'grid';
  /** How children stretch to fill parent. Default varies by direction. */
  stretch?: 'none' | 'width' | 'height' | 'both';
  /** Space between children in px. Default: 8 */
  gap?: number;
  /** Inner padding of parent in px. Default: 12 */
  padding?: number;
  /** Extra top offset for label/header in px. Default: 0 (auto 30 when label exists) */
  headerHeight?: number;
  /** Grid-only: number of columns. Default: 2 */
  columns?: number;
  /** Swap threshold for drag-to-reorder (0-1). Default: 0.5 */
  swapThreshold?: number;
}
```

### ChildValidation

```ts
interface ChildValidation {
  /** Minimum number of children. */
  minChildren?: number;
  /** Maximum number of children. */
  maxChildren?: number;
  /** Shorthand for minChildren: 1. */
  requiredChildren?: boolean;
  /** Whitelist of allowed child node types. */
  allowedChildTypes?: string[];
  /** Prevent children from being dragged out. */
  preventChildEscape?: boolean;
  /** Per-type min/max constraints. */
  childTypeConstraints?: Record<string, { min?: number; max?: number }>;
  /** Custom validator. Return true or a string error message. */
  validateChild?: (child: FlowNode, siblings: FlowNode[]) => boolean | string;
}
```

### ChildValidationResult

```ts
interface ChildValidationResult {
  valid: boolean;
  rule?: string;
  message?: string;
}
```

---

## Keyboard Shortcuts

```ts
interface KeyboardShortcuts {
  /** Delete selected elements. Default: ['Delete', 'Backspace'] */
  delete?: KeyCode | KeyCode[] | null;
  /** Modifier for selection box. Default: 'Shift' */
  selectionBox?: KeyCode | null;
  /** Modifier for multi-select click. Default: 'Shift' */
  multiSelect?: KeyCode | null;
  /** Arrow-key node movement. Default: all arrow keys */
  moveNodes?: KeyCode | KeyCode[] | null;
  /** Base movement step in px. Default: 5 */
  moveStep?: number;
  /** Modifier that multiplies movement step. Default: 'Shift' */
  moveStepModifier?: KeyCode | null;
  /** Multiplier when moveStepModifier is held. Default: 4 */
  moveStepMultiplier?: number;
  /** Copy key (with Ctrl/Cmd). Default: 'c' */
  copy?: KeyCode | null;
  /** Paste key (with Ctrl/Cmd). Default: 'v' */
  paste?: KeyCode | null;
  /** Cut key (with Ctrl/Cmd). Default: 'x' */
  cut?: KeyCode | null;
  /** Undo key (with Ctrl/Cmd). Default: 'z' */
  undo?: KeyCode | null;
  /** Redo key (with Ctrl/Cmd+Shift). Default: 'z' */
  redo?: KeyCode | null;
  /** Escape/cancel key. Default: 'Escape' */
  escape?: KeyCode | null;
  /** Modifier to toggle selection mode during drag. Default: 'Alt' */
  selectionModeToggle?: KeyCode | null;
  /** Key to toggle box/lasso selection tool. Default: 'l' */
  selectionToolToggle?: KeyCode | null;
}
```

Set a shortcut to `null` to disable it. Omit it to use the default.

---

## Node Shapes

### NodeShape

```ts
type NodeShape =
  | 'circle'
  | 'diamond'
  | 'hexagon'
  | 'parallelogram'
  | 'triangle'
  | 'cylinder'
  | 'stadium';
```

### ShapeDefinition

```ts
interface ShapeDefinition {
  /** CSS clip-path value applied to the node element. */
  clipPath?: string;
  /** Compute the edge connection point for a handle position on this shape. */
  perimeterPoint: (
    width: number,
    height: number,
    position: HandlePosition
  ) => { x: number; y: number };
}
```

---

## FlowCanvasConfig

The full configuration interface for `flowCanvas()`. Due to its size, it is documented separately in [Configuration](../configuration/index.md). Key categories include:

- Initial state (`nodes`, `edges`, `viewport`)
- Zoom and pan settings (`minZoom`, `maxZoom`, `pannable`, `zoomable`, `panOnScroll`)
- Grid and snapping (`snapToGrid`, `helperLines`)
- Background (`background`, `backgroundGap`, `patternColor`)
- Minimap and controls (`minimap`, `controls`)
- Connection behavior (`connectionMode`, `connectOnClick`, `multiConnect`, `proximityConnect`)
- History (`history`, `historyMaxSize`)
- Type registries (`nodeTypes`, `edgeTypes`, `shapeTypes`)
- Child validation (`childValidationRules`, `onChildValidationFail`)
- Auto-layout (`autoLayout`)
- Event callbacks (`onNodeClick`, `onConnect`, etc.)
- Touch interaction (`longPressAction`, `touchSelectionMode`)
- Accessibility (`nodesFocusable`, `announcements`)

---

## Export Types

### ToImageOptions

```ts
interface ToImageOptions {
  /** Image width in pixels. Default: 1920 */
  width?: number;
  /** Image height in pixels. Default: 1080 */
  height?: number;
  /** Padding as fraction of bounds. Default: 0.1 */
  padding?: number;
  /** Background color. Default: computed --flow-bg-color */
  background?: string;
  /** 'all' fits every node; 'viewport' captures current view. Default: 'all' */
  scope?: 'all' | 'viewport';
  /** Triggers a browser download with this filename. */
  filename?: string;
  /** Include UI overlays. true = all, object = selective. Default: false */
  includeOverlays?: boolean | ToImageOverlays;
}
```

### ToImageOverlays

```ts
interface ToImageOverlays {
  toolbar?: boolean;
  minimap?: boolean;
  controls?: boolean;
  panels?: boolean;
}
```

---

## Quick Reference

All exported types at a glance:

| Type | Category | Description |
|------|----------|-------------|
| `FlowNode` | Core | Node with position, data, flags, dimensions (`fixedDimensions`, `resizeObserver`, `minDimensions`, `maxDimensions`), shape, rotation |
| `FlowEdge` | Core | Edge with source/target, type, markers, labels, animation, color |
| `Viewport` | Core | `{ x, y, zoom }` — viewport pan/zoom state |
| `XYPosition` | Core | `{ x, y }` — coordinate pair |
| `Rect` | Core | `{ x, y, width, height }` — bounding rectangle |
| `Dimensions` | Core | `{ width, height }` |
| `CoordinateExtent` | Core | `[[minX, minY], [maxX, maxY]]` — boundary constraint |
| `Connection` | Core | `{ source, sourceHandle, target, targetHandle }` |
| `HandlePosition` | Core | `'top' \| 'right' \| 'bottom' \| 'left'` + corners |
| `HandleType` | Core | `'source' \| 'target'` |
| `EdgeType` | Core | `'bezier' \| 'smoothstep' \| 'straight' \| 'orthogonal' \| 'avoidant' \| 'editable' \| 'floating'` |
| `EdgeAnimationMode` | Core | `'dash' \| 'pulse' \| 'dot'` |
| `EdgeGradient` | Core | `{ from: string, to: string }` |
| `MarkerType` | Markers | `'arrow' \| 'arrowclosed'` |
| `MarkerConfig` | Markers | `{ type, color?, width?, height?, orient?, offset? }` |
| `NodeShape` | Shapes | `'diamond' \| 'hexagon' \| 'parallelogram' \| ...` |
| `ShapeDefinition` | Shapes | `{ perimeterPoint, clipPath? }` |
| `AnimateTargets` | Animation | `{ nodes?, edges?, viewport? }` — targets for update/animate |
| `AnimateNodeTarget` | Animation | `{ position?, dimensions?, style?, class?, data?, ... }` |
| `AnimateEdgeTarget` | Animation | `{ color?, strokeWidth?, label?, animated?, ... }` |
| `AnimateViewportTarget` | Animation | `{ pan?, zoom? }` |
| `AnimateOptions` | Animation | `{ duration?, easing?, delay?, loop?, onProgress?, onComplete? }` |
| `FlowAnimationHandle` | Animation | `{ pause, resume, stop, reverse, finished }` |
| `FollowOptions` | Animation | `{ zoom?, padding?, easing? }` |
| `ParticleOptions` | Animation | `{ color?, size?, duration? }` |
| `ParticleHandle` | Animation | `{ getCurrentPosition, stop, finished }` |
| `ChildValidation` | Validation | `{ allowedTypes?, minChildren?, maxChildren?, maxDepth?, ... }` |
| `ChildValidationResult` | Validation | `{ valid, errors }` |
| `ChildLayout` | Layout | `{ direction, gap, padding, ... }` |
| `KeyboardShortcuts` | Input | Customizable key bindings map |
| `FlowCanvasConfig` | Config | Full canvas configuration (see [Configuration](../configuration/index.md)) |
| `ToImageOptions` | Export | `{ width?, height?, padding?, background?, scope?, filename? }` |
| `ToImageOverlays` | Export | `{ toolbar?, minimap?, controls?, panels? }` |
| `ResizeDirection` | Resize | `'top' \| 'right' \| 'bottom' \| 'left'` + corners |
| `ResizeConstraints` | Resize | `{ minWidth?, maxWidth?, minHeight?, maxHeight? }` |

---

## See Also

- [Configuration](../configuration/index.md) for `FlowCanvasConfig` details
- [$flow Magic](flow-magic/index.md) for the programmatic API
- [Events](events.md) for `FlowEvents` payload shapes
