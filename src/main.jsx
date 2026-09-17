import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Development requests use the Vite proxy; production calls the deployed backend.
axios.defaults.baseURL = import.meta.env.DEV
  ? ''
  : import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
