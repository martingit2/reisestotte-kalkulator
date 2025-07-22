// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Alle forespørsler til /api sendes videre til backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})