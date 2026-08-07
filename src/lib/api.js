import axios from 'axios'

// Base URL is configurable via Vite env (VITE_API_URL); falls back to local dev.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const tokenType = localStorage.getItem('tokenType') || 'bearer'
  if (token) {
    config.headers.Authorization = `${tokenType[0].toUpperCase()}${tokenType.slice(1)} ${token}`
  }
  return config
})

// On 401, clear stale auth and bounce to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('authUser')
      localStorage.removeItem('tokenType')
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export default api
