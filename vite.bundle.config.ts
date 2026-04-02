import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Single-file ESM bundle for embedding in Composer packages (e.g. WireFlow).
 *
 * Unlike the main build which code-splits across entry points, this produces
 * one self-contained alpineflow.bundle.esm.js with no chunk imports.
 * Developers import it from the vendor path:
 *
 *   import AlpineFlow from '../../vendor/getartisanflow/wireflow/dist/alpineflow.bundle.esm.js';
 */
export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: false, // Don't wipe the main build output
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'lib/core.ts'),
      formats: ['es'],
      fileName: () => 'alpineflow.bundle.esm.js',
    },
    rollupOptions: {
      external: ['alpinejs'],
      output: {
        globals: {
          alpinejs: 'Alpine',
        },
        // Force everything into a single chunk
        inlineDynamicImports: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
