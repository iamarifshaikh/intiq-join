/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    // "@/shared/ui" instead of "../../../shared/ui"
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    // its own port, so it runs beside intiq-web (5173)
    port: 5175,
    strictPort: true,
    // `npm run dev` only, and only when VITE_API_MODE=http: /api goes to VITE_DEV_API_TARGET.
    // The production build calls /api on its own host, which Amplify forwards to the backend.
    proxy: {
      '/api': {
        target: loadEnv(mode, process.cwd(), 'VITE_').VITE_DEV_API_TARGET || 'http://localhost:8082',
        changeOrigin: true,
        // through this proxy the browser is on one origin, so the backend need not list :5175 in CORS
        configure: (proxy) => proxy.on('proxyReq', (request) => request.removeHeader('origin')),
      },
    },
  },
  test: {
    environment: 'node',
  },
}))
