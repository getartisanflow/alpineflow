import type { Alpine } from 'alpinejs';
import { registerAddon } from '../core/registry';
import { computeElkLayout } from '../core/layout/elk';

export default function AlpineFlowElk(_Alpine: Alpine): void {
  registerAddon('layout:elk', computeElkLayout);
}
