import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    host: true, // Required for Docker
    proxy: {
      '/api': {
        target: mode === 'development' 
          ? 'http://localhost:5000' 
          : 'http://backend:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Proxy Error:', err);
          });
          proxy.on('proxyReq', (proxyReq) => {
            console.log('Proxy Request:', proxyReq.path);
          });
        }
      }
    }
  },
  preview: {
    port: 80,
    strictPort: true
  }
}));