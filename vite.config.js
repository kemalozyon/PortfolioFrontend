// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // YENİ EKLENDİ

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // YENİ EKLENDİ
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://portfoliobackend-production-3611.up.railway.app',
        changeOrigin: true,
      }
    }
  }
})