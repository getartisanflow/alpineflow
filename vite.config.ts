import { defineConfig } from 'vite';
import { resolve } from 'path';

// Shared externals — Alpine.js is always external (consumer provides it)
const alpineExternal = ['alpinejs'];

// Collab addon externalizes yjs ecosystem (too large to bundle)
const collabExternals = ['yjs', 'y-protocols', 'y-protocols/awareness', 'y-websocket'];

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        // Core ESM (npm / bundlers) — addons built separately via build:addons
        'alpineflow.esm': resolve(__dirname, 'lib/core.ts'),
        // Core CDN (auto-register via alpine:init)
        'alpineflow': resolve(__dirname, 'lib/core.cdn.ts'),
        // CDN addon entry points (share chunks, fine for CDN since all files are co-located)
        'alpineflow-whiteboard': resolve(__dirname, 'lib/whiteboard.cdn.ts'),
        'alpineflow-collab': resolve(__dirname, 'lib/collab.cdn.ts'),
        'alpineflow-dagre': resolve(__dirname, 'lib/dagre.cdn.ts'),
        'alpineflow-force': resolve(__dirname, 'lib/force.cdn.ts'),
        'alpineflow-hierarchy': resolve(__dirname, 'lib/hierarchy.cdn.ts'),
        'alpineflow-elk': resolve(__dirname, 'lib/elk.cdn.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        ...alpineExternal,
        ...collabExternals,
      ],
      output: {
        globals: {
          alpinejs: 'Alpine',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'alpineflow.css';
          }
          return assetInfo.name ?? 'assets/[name].[ext]';
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
