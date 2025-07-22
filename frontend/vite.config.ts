import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    // Kjører utviklingsserveren på port 3000 for konsistens med Docker-oppsettet
    port: 3000,
    
    // Setter opp en proxy for alle API-kall
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        
        // Nødvendig for å unngå CORS-problemer og for at virtuelle hoster skal fungere
        changeOrigin: true,
      }
    }
  }
})