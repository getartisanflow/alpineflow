import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Self-contained addon ESM bundles.
 *
 * Built one at a time via the build:addons script which calls this
 * config once per addon with ADDON_ENTRY and ADDON_NAME env vars.
 *
 * Each addon is a single file with no chunk imports. Shared code
 * (registry, geometry) is duplicated — intentionally small (~5-10KB).
 * The registry uses globalThis so all bundles share one instance.
 */
const entry = process.env.ADDON_ENTRY;
const name = process.env.ADDON_NAME;

if (!entry || !name) {
  throw new Error('ADDON_ENTRY and ADDON_NAME env vars are required');
}

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, entry),
      formats: ['es'],
      fileName: () => `${name}.js`,
    },
    rollupOptions: {
      external: [
        'alpinejs',
        'yjs', 'y-protocols', 'y-protocols/awareness', 'y-websocket',
      ],
      output: {
        inlineDynamicImports: true,
        globals: {
          alpinejs: 'Alpine',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
