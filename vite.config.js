// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2017',
    minify: 'terser',
    sourcemap: false,
    cssCodeSplit: false,

    assetsInlineLimit: 100000000,

    terserOptions: {
      compress: {
        drop_console: true,
        passes: 3,
      },
      mangle: true,
    },

    rollupOptions: {
      output: {
        format: 'iife',              // ВАЖНО: сразу исполняемый код
        inlineDynamicImports: true,
        entryFileNames: 'game.js',
        manualChunks: undefined,
      }
    }
  }
})
