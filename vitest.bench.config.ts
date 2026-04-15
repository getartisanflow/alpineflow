import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

/**
 * Benchmark config — mirrors vitest.browser.config.ts but targets bench files.
 *
 * Runs `tests/bench/**\/*.bench.ts` in real Chromium via Playwright so that
 * `requestAnimationFrame`, Alpine DOM mounting, and CSS cascade are live.
 *
 * Run with: `npm run bench`  or  `npx vitest bench --config vitest.bench.config.ts --run`
 */
export default defineConfig({
    test: {
        include: ['tests/bench/**/*.bench.ts'],
        browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            headless: true,
        },
        testTimeout: 60_000,
    },
});
