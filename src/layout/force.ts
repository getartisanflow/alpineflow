import type { Alpine } from 'alpinejs';
import { registerAddon } from '../core/registry';
import { computeForceLayout } from '../core/layout/force';

export default function AlpineFlowForce(_Alpine: Alpine): void {
  registerAddon('layout:force', computeForceLayout);
}
