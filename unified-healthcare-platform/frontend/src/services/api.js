import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth-token')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access denied:', error.message)
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      console.error('Request timeout:', error.message)
    } else if (!error.response && error.message === 'Network Error') {
      // Network error - backend not reachable
      console.error('Network error: Backend server is not accessible. Check VITE_API_URL environment variable.')
    }
    return Promise.reject(error)
  }
)

export default api
