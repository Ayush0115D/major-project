// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000'

// Electrical thresholds
export const THRESHOLDS = {
  VOLTAGE: {
    NORMAL_MIN: 220,
    NORMAL_MAX: 240,
    WARNING_MIN: 200,
    CRITICAL_MIN: 180
  },
  CURRENT: {
    NORMAL_MAX: 10,
    WARNING_MAX: 12,
    CRITICAL_MAX: 15
  },
  POWER: {
    LOW: 500,
    MEDIUM: 1500,
    HIGH: 2500
  },
  TEMPERATURE: {
    NORMAL_MIN: 18,
    NORMAL_MAX: 30,
    WARNING_MAX: 35,
    CRITICAL_MAX: 40
  }
}

// Room status types
export const ROOM_STATUS = {
  NORMAL: 'normal',
  WARNING: 'warning',
  CRITICAL: 'critical',
  OFFLINE: 'offline'
}

// Alert types
export const ALERT_TYPES = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info'
}

// Update intervals (in milliseconds)
export const UPDATE_INTERVALS = {
  REAL_TIME: 1000,
  NORMAL: 3000,
  SLOW: 10000
}

// Device categories
export const DEVICE_CATEGORIES = {
  LIGHTING: 'lighting',
  HEATING: 'heating',
  COOLING: 'cooling',
  APPLIANCE: 'appliance',
  ELECTRONICS: 'electronics'
}

// Color schemes
export const COLORS = {
  STATUS: {
    NORMAL: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-500'
    },
    WARNING: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      border: 'border-yellow-500'
    },
    CRITICAL: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-500'
    },
    OFFLINE: {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      border: 'border-gray-500'
    }
  }
}

// Default room configuration
export const DEFAULT_ROOMS = [
  {
    id: 1,
    name: 'Living Room',
    devices: ['LED Lights', 'TV', 'Air Conditioner'],
    maxCurrent: 15,
    coordinates: { x: 20, y: 30 }
  },
  {
    id: 2,
    name: 'Kitchen',
    devices: ['Refrigerator', 'Microwave', 'Dishwasher'],
    maxCurrent: 20,
    coordinates: { x: 60, y: 30 }
  },
  {
    id: 3,
    name: 'Bedroom',
    devices: ['Ceiling Fan', 'Lamp', 'Charger'],
    maxCurrent: 10,
    coordinates: { x: 20, y: 70 }
  },
  {
    id: 4,
    name: 'Bathroom',
    devices: ['Water Heater', 'Exhaust Fan', 'Lights'],
    maxCurrent: 15,
    coordinates: { x: 60, y: 70 }
  }
]