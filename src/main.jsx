import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

// Development requests use the Vite proxy; production calls the deployed backend.
axios.defaults.baseURL = import.meta.env.DEV
  ? ''
  : import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
