import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import notifier from 'node-notifier'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'custom-build-log',
      buildStart() {
        const startTime = new Date().toLocaleTimeString();
        console.log(`🚀 Build starting at ${startTime}...`);
        notifier.notify({
          title: 'Vite Build',
          message: `🚀 Build starting at ${startTime}...`,
          sound: true,
          wait: true, // Wait for user action before continuing
        });
      },
      buildEnd() {
        const endTime = new Date().toLocaleTimeString();
        console.log(`🎉 Build finished at ${endTime}!`);
        notifier.notify({
          title: 'Vite Build',
          message: `🎉 Build finished at ${endTime}!`,
          sound: true,
          wait: true, // Wait for user action before continuing
        });
      }
    }
  ],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@context': path.resolve(__dirname, './src/context'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@layout': path.resolve(__dirname, './src/layout'),
      '@models': path.resolve(__dirname, './src/models'),
      '@services': path.resolve(__dirname, './src/services'),
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
