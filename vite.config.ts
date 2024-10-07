import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Separate vendor chunks
          }
          if (id.includes('src/components')) {
            return 'components';
          }
          if (id.includes('src/pages')) {
            return 'pages';
          }
          if (id.includes('src/layout')) {
            return 'layout';
          }
          if (id.includes('src/models')) {
            return 'models';
          }
          if (id.includes('src/data')) {
            return 'data';
          }
          if (id.includes('src/services')) {
            return 'services';
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000, 
  },
})
