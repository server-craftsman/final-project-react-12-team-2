import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const chunks = [
            { name: 'vendor', condition: id.includes('node_modules') },
            { name: 'components', condition: id.includes('@src/components') },
            { name: 'context', condition: id.includes('@src/context') },
            { name: 'const', condition: id.includes('@src/const') },
            { name: 'utils', condition: id.includes('@src/utils') },
            { name: 'routes', condition: id.includes('@src/routes') },
            { name: 'hooks', condition: id.includes('@src/hooks') },
            { name: 'pages', condition: id.includes('@src/pages') },
            { name: 'layout', condition: id.includes('@src/layout') },
            { name: 'models', condition: id.includes('@src/models') },
            { name: 'services', condition: id.includes('@src/services') },
          ];
          for (const chunk of chunks) {
            if (chunk.condition) return chunk.name;
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000, 
  },
})
