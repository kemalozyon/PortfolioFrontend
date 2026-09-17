// frontend/vite.config.js
import { defineConfig, loadEnv } from 'vite'
import process from 'node:process'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // YENİ EKLENDİ

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const apiUrl = env.VITE_API_URL?.trim().replace(/\/+$/, '')

  if (command === 'build' && !apiUrl) {
    throw new Error('Set VITE_API_URL to the backend origin before building the frontend.')
  }

  if (apiUrl) {
    const parsed = new URL(apiUrl)
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== apiUrl) {
      throw new Error('VITE_API_URL must be an HTTP(S) origin without a path, such as https://your-backend.vercel.app.')
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(), // YENİ EKLENDİ
    ],
    server: {
      proxy: {
        '/api': {
          target: apiUrl || 'http://localhost:5000',
          changeOrigin: true,
        }
      }
    }
  }
})
