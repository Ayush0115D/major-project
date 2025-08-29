import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Room-related API calls
export const roomsAPI = {
  // Get all rooms
  getRooms: () => api.get('/rooms'),

  // Get specific room data
  getRoom: (roomId) => api.get(`/rooms/${roomId}`),

  // Update room configuration
  updateRoom: (roomId, data) => api.put(`/rooms/${roomId}`, data),

  // Get room history
  getRoomHistory: (roomId, timeRange = '24h') => 
    api.get(`/rooms/${roomId}/history?range=${timeRange}`),

  // Reset room status
  resetRoom: (roomId) => api.post(`/rooms/${roomId}/reset`),
}

// Alert-related API calls
export const alertsAPI = {
  // Get all alerts
  getAlerts: (filters = {}) => {
    const params = new URLSearchParams(filters)
    return api.get(`/alerts?${params}`)
  },

  // Get specific alert
  getAlert: (alertId) => api.get(`/alerts/${alertId}`),

  // Mark alert as resolved
  resolveAlert: (alertId) => api.put(`/alerts/${alertId}/resolve`),

  // Delete alert
  deleteAlert: (alertId) => api.delete(`/alerts/${alertId}`),

  // Create new alert
  createAlert: (data) => api.post('/alerts', data),
}

// System-related API calls
export const systemAPI = {
  // Get system status
  getStatus: () => api.get('/system/status'),

  // Get system statistics
  getStats: (timeRange = '24h') => api.get(`/system/stats?range=${timeRange}`),

  // Emergency shutdown
  emergencyShutdown: (roomId) => api.post(`/system/emergency-shutdown/${roomId}`),

  // System health check
  healthCheck: () => api.get('/system/health'),

  // Get system configuration
  getConfig: () => api.get('/system/config'),

  // Update system configuration
  updateConfig: (config) => api.put('/system/config', config),
}

// Data analytics API calls
export const analyticsAPI = {
  // Get power consumption data
  getPowerData: (timeRange = '24h') => 
    api.get(`/analytics/power?range=${timeRange}`),

  // Get voltage trends
  getVoltageTrends: (timeRange = '24h') => 
    api.get(`/analytics/voltage?range=${timeRange}`),

  // Get current consumption patterns
  getCurrentPatterns: (timeRange = '24h') => 
    api.get(`/analytics/current?range=${timeRange}`),

  // Get efficiency report
  getEfficiencyReport: (timeRange = '7d') => 
    api.get(`/analytics/efficiency?range=${timeRange}`),

  // Export data
  exportData: (format = 'csv', timeRange = '24h') => 
    api.get(`/analytics/export?format=${format}&range=${timeRange}`, {
      responseType: 'blob'
    }),
}

// Device management API calls
export const devicesAPI = {
  // Get all devices
  getDevices: () => api.get('/devices'),

  // Get devices by room
  getDevicesByRoom: (roomId) => api.get(`/devices?room=${roomId}`),

  // Add new device
  addDevice: (data) => api.post('/devices', data),

  // Update device
  updateDevice: (deviceId, data) => api.put(`/devices/${deviceId}`, data),

  // Delete device
  deleteDevice: (deviceId) => api.delete(`/devices/${deviceId}`),

  // Control device (turn on/off)
  controlDevice: (deviceId, action) => 
    api.post(`/devices/${deviceId}/control`, { action }),
}

// User authentication API calls
export const authAPI = {
  // Login
  login: (credentials) => api.post('/auth/login', credentials),

  // Logout
  logout: () => api.post('/auth/logout'),

  // Register
  register: (userData) => api.post('/auth/register', userData),

  // Refresh token
  refreshToken: () => api.post('/auth/refresh'),

  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
}

// Generic API helper functions
export const apiHelpers = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'Server error occurred',
        status: error.response.status,
        data: error.response.data
      }
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error - unable to connect to server',
        status: 0,
        data: null
      }
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1,
        data: null
      }
    }
  },

  // Format response data
  formatResponse: (response) => ({
    data: response.data,
    status: response.status,
    headers: response.headers,
    timestamp: new Date().toISOString()
  }),

  // Check if API is available
  checkConnection: async () => {
    try {
      await systemAPI.healthCheck()
      return true
    } catch (error) {
      return false
    }
  }
}

// Export default API instance
export default api