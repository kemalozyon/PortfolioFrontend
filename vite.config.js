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
        target: 'https://portfoliobackend-fp0u.onrender.com',
        changeOrigin: true,
      }
    }
  }
})