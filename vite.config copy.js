import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  base: './',

  plugins: [
    viteSingleFile()
  ],

  build: {
    outDir: 'dist',
    emptyOutDir: true,

    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,

    cssCodeSplit: false,

    // 🔥 ВСЁ В HTML
    assetsInlineLimit: 100000000,

    rollupOptions: {
      output: {
        // ❌ никаких файлов кроме html
        inlineDynamicImports: true,

        // один JS бандл
        entryFileNames: 'game.js',
        chunkFileNames: 'game.js',

        // важно: убираем внешние ассеты полностью
        assetFileNames: '[name][extname]'
      }
    }
  },

  server: {
    port: 3000,
    host: true,
    open: true
  },

  optimizeDeps: {
    include: ['pixi.js']
  }
})
