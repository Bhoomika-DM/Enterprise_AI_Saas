import axios from 'axios'

// Get base URL from environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://web-production-85de.up.railway.app'

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // DEBUG: Log the full request URL
    console.log('🔵 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      data: config.data,
      params: config.params
    })
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // DEBUG: Log successful response
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('❌ Network Error:', error.message)
      console.error('Request config:', error.config)
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        originalError: error
      })
    }

    // Handle HTTP errors
    const { status, data } = error.response
    console.error(`❌ API Error [${status}]:`, {
      url: error.config.url,
      method: error.config.method,
      status,
      data
    })

    return Promise.reject({
      status,
      message: data?.message || data?.detail || 'An error occurred',
      data,
      originalError: error
    })
  }
)

export default apiClient
