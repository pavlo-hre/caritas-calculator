import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// WordPress build: writes calculator.js / calculator.css with stable names into the plugin folder,
// so the PHP side can enqueue them without a manifest. Lazy chunks (jsPDF, html2canvas) are loaded
// relative to calculator.js, hence base './'.
export default defineConfig({
  plugins: [react()],
  base: './',
  publicDir: false,
  build: {
    outDir: 'wp-plugin/caritas-calculator/build',
    emptyOutDir: true,
    cssCodeSplit: false,
    rolldownOptions: {
      input: 'src/wp.tsx',
      output: {
        entryFileNames: 'calculator.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (asset) =>
          asset.names.some((name) => name.endsWith('.css')) ? 'calculator.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
})
