import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppReady from './components/AppReady.jsx'
import axios from 'axios'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { API_ORIGIN } from './lib/apiOrigin'

// Every request (dev and production) goes straight to the backend on Oracle Cloud.
axios.defaults.baseURL = API_ORIGIN

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppReady><App /></AppReady>
    </QueryClientProvider>
  </StrictMode>,
)
