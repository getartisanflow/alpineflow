// ── Types ────────────────────────────────────────────────────────────────────
export type { EasingName } from './easing';
export type {
  StepContext,
  TimelineStep,
  TimelineEvent,
  TimelineState,
  TimelineCanvas,
} from './timeline';

// ── Easing ───────────────────────────────────────────────────────────────────
export { resolveEasing } from './easing';

// ── Interpolators ────────────────────────────────────────────────────────────
export { lerpNumber, interpolateColor, parseStyle, interpolateStyle, lerpViewport } from './interpolators';

// ── Edge Transitions ────────────────────────────────────────────────────────
export {
  drawInOffset,
  drawOutOffset,
  fadeOpacity,
  applyDrawTransition,
  cleanupDrawTransition,
  applyFadeTransition,
  cleanupFadeTransition,
} from './edge-transitions';

// ── Path Helpers ────────────────────────────────────────────────────────────
export type { PathFunction, OrbitConfig, WaveConfig, AlongConfig, PendulumConfig, DriftConfig } from './paths';
export { svgPathToFunction, orbit, wave, along, pendulum, drift, stagger, _clearPathCache } from './paths';

// ── Engine ──────────────────────────────────────────────────────────────────
export { engine, AnimationEngine, type TickCallback, type EngineHandle } from './engine';

// ── Timeline ─────────────────────────────────────────────────────────────────
export { FlowTimeline } from './timeline';

// ── Animator ─────────────────────────────────────────────────────────────────
export { Animator, type PropertyEntry, type AnimateInternalOptions, type AnimationHandle } from './animator';

// ── Handle Registry ───────────────────────────────────────────────────────────
export { HandleRegistry, type Taggable } from './handle-registry';

// ── Transaction ──────────────────────────────────────────────────────────────
export { Transaction, type TransactionState } from './transaction';

// ── Flow Group ────────────────────────────────────────────────────────────────
export { FlowGroup, type FlowGroupHost } from './flow-group';

// ── Particle Renderers ───────────────────────────────────────────────────────
export { registerParticleRenderer, getParticleRenderer, hasParticleRenderer, circleRenderer, orbRenderer, beamRenderer, pulseRenderer, imageRenderer } from './particle-renderers';
export type { ParticleRenderer, ParticleRenderState } from '../core/types';

// ── Motion ───────────────────────────────────────────────────────────────────
export { resolveMotion, stepSpring, SPRING_DEFAULTS } from './motion';
export type { MotionConfig, SpringMotion, DecayMotion, InertiaMotion, KeyframesMotion, PhysicsState } from './motion';
