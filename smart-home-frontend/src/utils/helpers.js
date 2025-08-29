import { THRESHOLDS, ROOM_STATUS } from './constants'

// Determine room status based on electrical parameters
export const determineRoomStatus = (voltage, current, temperature) => {
  // Critical conditions
  if (voltage < THRESHOLDS.VOLTAGE.CRITICAL_MIN || 
      current > THRESHOLDS.CURRENT.CRITICAL_MAX ||
      temperature > THRESHOLDS.TEMPERATURE.CRITICAL_MAX) {
    return ROOM_STATUS.CRITICAL
  }

  // Warning conditions
  if (voltage < THRESHOLDS.VOLTAGE.WARNING_MIN || 
      current > THRESHOLDS.CURRENT.WARNING_MAX ||
      temperature > THRESHOLDS.TEMPERATURE.WARNING_MAX) {
    return ROOM_STATUS.WARNING
  }

  // Normal conditions
  return ROOM_STATUS.NORMAL
}

// Format electrical values for display
export const formatElectricalValue = (value, unit, decimals = 1) => {
  return `${Number(value).toFixed(decimals)} ${unit}`
}

// Calculate power from voltage and current
export const calculatePower = (voltage, current) => {
  return Math.round(voltage * current)
}

// Generate random electrical data (for simulation)
export const generateRandomData = (baseValue, variance = 0.1) => {
  const variation = baseValue * variance * (Math.random() - 0.5) * 2
  return Math.max(0, baseValue + variation)
}

// Check if a value is within normal range
export const isWithinRange = (value, min, max) => {
  return value >= min && value <= max
}

// Get status color class
export const getStatusColorClass = (status) => {
  switch (status) {
    case ROOM_STATUS.NORMAL:
      return 'text-green-500'
    case ROOM_STATUS.WARNING:
      return 'text-yellow-500'
    case ROOM_STATUS.CRITICAL:
      return 'text-red-500'
    case ROOM_STATUS.OFFLINE:
      return 'text-gray-500'
    default:
      return 'text-gray-500'
  }
}

// Get background color class
export const getStatusBgClass = (status) => {
  switch (status) {
    case ROOM_STATUS.NORMAL:
      return 'bg-green-50'
    case ROOM_STATUS.WARNING:
      return 'bg-yellow-50'
    case ROOM_STATUS.CRITICAL:
      return 'bg-red-50'
    case ROOM_STATUS.OFFLINE:
      return 'bg-gray-50'
    default:
      return 'bg-gray-50'
  }
}

// Format timestamp for display
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  return {
    time: date.toLocaleTimeString(),
    date: date.toLocaleDateString(),
    relative: getRelativeTime(date)
  }
}

// Get relative time (e.g., "5 minutes ago")
export const getRelativeTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

// Validate electrical parameters
export const validateElectricalParams = (voltage, current, power) => {
  const errors = []

  if (voltage < 0 || voltage > 300) {
    errors.push('Voltage out of valid range (0-300V)')
  }

  if (current < 0 || current > 50) {
    errors.push('Current out of valid range (0-50A)')
  }

  if (power < 0 || power > 15000) {
    errors.push('Power out of valid range (0-15000W)')
  }

  return errors
}

// Calculate system efficiency
export const calculateEfficiency = (totalPowerConsumed, totalPowerGenerated) => {
  if (totalPowerGenerated === 0) return 0
  return Math.min(100, (totalPowerConsumed / totalPowerGenerated) * 100)
}

// Debounce function for API calls
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for real-time updates
export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Convert temperature units
export const convertTemperature = (temp, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return temp

  let celsius
  if (fromUnit === 'F') {
    celsius = (temp - 32) * 5/9
  } else {
    celsius = temp
  }

  if (toUnit === 'F') {
    return (celsius * 9/5) + 32
  }
  return celsius
}

// Export utility object
export const utils = {
  determineRoomStatus,
  formatElectricalValue,
  calculatePower,
  generateRandomData,
  isWithinRange,
  getStatusColorClass,
  getStatusBgClass,
  formatTimestamp,
  getRelativeTime,
  validateElectricalParams,
  calculateEfficiency,
  debounce,
  throttle,
  convertTemperature
}