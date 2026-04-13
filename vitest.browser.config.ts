import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

/**
 * Browser-mode integration suite.
 *
 * Runs tests under `tests/integration/` in a real Chromium via Playwright.
 * These tests mount a real `flowCanvas({...})` via Alpine.js and exercise
 * the canvas→mixin→animator→engine path end-to-end — the kind of coverage
 * that POJO-mock unit tests can't provide (Alpine proxies, SVG paint
 * servers, CSS cascade, real rAF timing).
 *
 * Run with: `npm run test:browser`
 * Kept separate from the fast unit run (`npm test`) so contributors get
 * quick feedback on the common path and opt into browser coverage.
 */
export default defineConfig({
    test: {
        include: ['tests/integration/**/*.test.ts'],
        browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            headless: true,
            // Auto-capture a screenshot on any assertion failure — invaluable
            // for debugging rendering / layout regressions in CI.
            screenshotFailures: true,
        },
        // Integration tests exercise real rAF and CSS cascade — give them
        // real time rather than the default 5s.
        testTimeout: 10_000,
    },
});
