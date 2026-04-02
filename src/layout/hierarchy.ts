import type { Alpine } from 'alpinejs';
import { registerAddon } from '../core/registry';
import { computeHierarchyLayout } from '../core/layout/hierarchy';

export default function AlpineFlowHierarchy(_Alpine: Alpine): void {
  registerAddon('layout:hierarchy', computeHierarchyLayout);
}
