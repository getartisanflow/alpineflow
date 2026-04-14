import { defineConfig } from 'vitest/config';

/**
 * Fast unit test config.
 *
 * Runs `src/**\/*.test.ts` in Node via the default vitest environment.
 * Browser-mode integration tests live under `tests/integration/` and run
 * via `vitest.browser.config.ts` (`npm run test:browser`).
 */
export default defineConfig({
    test: {
        include: ['src/**/*.test.ts'],
        // Explicitly exclude integration tests so they never leak into the
        // fast unit run — they require Playwright and take much longer.
        exclude: ['tests/integration/**', 'node_modules/**', 'dist/**'],
    },
});
