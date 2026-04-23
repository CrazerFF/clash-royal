import { defineConfig } from 'vite'


export default defineConfig({
  base: './',

  build: {
    outDir: 'dist',
    emptyOutDir: true,

    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,

    lib: {
      entry: 'src/main.js',
      formats: ['iife'],
      name: 'GameBundle'
    },

    rollupOptions: {
      output: {
        entryFileNames: 'bundle.js'
      }
    }
  }
})

