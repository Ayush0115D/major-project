import React from 'react'
import { AlertTriangle, CheckCircle, XCircle, Zap, Thermometer, Clock, Activity } from 'lucide-react'

const RoomCard = ({ room }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'text-green-500 bg-green-100'
      case 'warning': return 'text-yellow-500 bg-yellow-100'
      case 'critical': return 'text-red-500 bg-red-100'
      default: return 'text-gray-500 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal': return <CheckCircle className="h-5 w-5" />
      case 'warning': return <AlertTriangle className="h-5 w-5" />
      case 'critical': return <XCircle className="h-5 w-5" />
      default: return <Activity className="h-5 w-5" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'normal': return 'Normal'
      case 'warning': return 'Warning'
      case 'critical': return 'Critical'
      default: return 'Unknown'
    }
  }

  const getBorderColor = (status) => {
    switch (status) {
      case 'normal': return 'border-l-green-500'
      case 'warning': return 'border-l-yellow-500'
      case 'critical': return 'border-l-red-500 shadow-red-100'
      default: return 'border-l-gray-500'
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${getBorderColor(room.status)} hover:shadow-md transition-shadow duration-200`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
              <p className="text-sm text-gray-500">{room.devices.length} devices connected</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
            {getStatusIcon(room.status)}
            <span className="ml-1">{getStatusText(room.status)}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Voltage */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Voltage</span>
              <div className={`w-2 h-2 rounded-full ${
                room.voltage >= 220 ? 'bg-green-500' : 
                room.voltage >= 200 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
            </div>
            <div className="mt-1">
              <span className="text-xl font-bold text-gray-900">{room.voltage}</span>
              <span className="text-sm text-gray-500 ml-1">V</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {room.voltage >= 220 ? 'Normal' : room.voltage >= 200 ? 'Low' : 'Critical'}
            </div>
          </div>

          {/* Current */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current</span>
              <div className={`w-2 h-2 rounded-full ${
                room.current <= 10 ? 'bg-green-500' : 
                room.current <= 12 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
            </div>
            <div className="mt-1">
              <span className="text-xl font-bold text-gray-900">{room.current}</span>
              <span className="text-sm text-gray-500 ml-1">A</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {room.current <= 10 ? 'Normal' : room.current <= 12 ? 'High' : 'Overload'}
            </div>
          </div>

          {/* Power */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Power</span>
              <Activity className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-1">
              <span className="text-xl font-bold text-gray-900">{room.power}</span>
              <span className="text-sm text-gray-500 ml-1">W</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {(room.power / 1000).toFixed(1)} kW
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Temp</span>
              <Thermometer className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-1">
              <span className="text-xl font-bold text-gray-900">{room.temperature}</span>
              <span className="text-sm text-gray-500 ml-1">°C</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {room.temperature > 30 ? 'High' : room.temperature < 18 ? 'Low' : 'Normal'}
            </div>
          </div>
        </div>

        {/* Device List */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Connected Devices</h4>
          <div className="flex flex-wrap gap-2">
            {room.devices.map((device, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {device}
              </span>
            ))}
          </div>
        </div>

        {/* Footer with last update */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Last updated: {room.lastUpdate.toLocaleTimeString()}</span>
          </div>
          <div className={`flex items-center space-x-1 ${
            room.status === 'critical' ? 'text-red-600' : 
            room.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              room.status === 'critical' ? 'bg-red-500 animate-pulse' : 
              room.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
            }`}></div>
            <span>Live</span>
          </div>
        </div>

        {/* Critical Alert Banner */}
        {room.status === 'critical' && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800 font-medium">
                Short circuit detected! Check electrical connections immediately.
              </span>
            </div>
          </div>
        )}

        {/* Warning Banner */}
        {room.status === 'warning' && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800 font-medium">
                High power consumption detected. Monitor usage.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoomCard