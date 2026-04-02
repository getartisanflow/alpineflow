import type { Alpine } from 'alpinejs';
import { registerAddon } from '../core/registry';
import { computeDagreLayout } from '../core/layout/dagre';

export default function AlpineFlowDagre(_Alpine: Alpine): void {
  registerAddon('layout:dagre', computeDagreLayout);
}
