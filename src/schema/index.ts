// ============================================================================
// alpineflow/schema — Subpath Addon
//
// Import: `import Schema from '@getartisanflow/alpineflow/schema'`
// Register: `Alpine.plugin(Schema)`
//
// Capabilities are added in Tasks 9–12:
//   - Field CRUD with edge cascade   (Task 9)
//   - inferReferences()              (Task 10)
//   - schemaToJSON / schemaFromJSON  (Task 11)
//   - Three-scope inspector scaffold (Task 12)
// ============================================================================

import type { Alpine } from 'alpinejs';

export * from './types';

export default function registerSchemaAddon(_Alpine: Alpine): void {
    // Populated by Tasks 9–12.
}
