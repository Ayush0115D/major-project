import React from 'react'
import { Zap, Activity, Gauge, TrendingUp, Shield, Wifi } from 'lucide-react'

const SystemStatus = ({ stats }) => {
  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 95) return 'text-green-600 bg-green-100'
    if (efficiency >= 90) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getEfficiencyStatus = (efficiency) => {
    if (efficiency >= 95) return 'Excellent'
    if (efficiency >= 90) return 'Good'
    return 'Poor'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Power Consumption */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Power</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-gray-900">{stats.totalPower}</p>
              <p className="text-sm text-gray-500">W</p>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+5.2% from yesterday</span>
            </div>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Average Voltage */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Average Voltage</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-gray-900">{stats.avgVoltage}</p>
              <p className="text-sm text-gray-500">V</p>
            </div>
            <div className="flex items-center mt-2">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                stats.avgVoltage >= 220 ? 'bg-green-500' : 
                stats.avgVoltage >= 200 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className={`text-xs ${
                stats.avgVoltage >= 220 ? 'text-green-600' : 
                stats.avgVoltage >= 200 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {stats.avgVoltage >= 220 ? 'Normal Range' : 
                 stats.avgVoltage >= 200 ? 'Below Normal' : 'Critical Low'}
              </span>
            </div>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <Gauge className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Total Current */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Current</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-gray-900">{stats.totalCurrent}</p>
              <p className="text-sm text-gray-500">A</p>
            </div>
            <div className="flex items-center mt-2">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                stats.totalCurrent <= 20 ? 'bg-green-500' : 
                stats.totalCurrent <= 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className={`text-xs ${
                stats.totalCurrent <= 20 ? 'text-green-600' : 
                stats.totalCurrent <= 30 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {stats.totalCurrent <= 20 ? 'Normal Load' : 
                 stats.totalCurrent <= 30 ? 'High Load' : 'Overload Risk'}
              </span>
            </div>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <Activity className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* System Efficiency */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">System Efficiency</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-gray-900">{stats.efficiency.toFixed(1)}</p>
              <p className="text-sm text-gray-500">%</p>
            </div>
            <div className="flex items-center mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getEfficiencyColor(stats.efficiency)}`}>
                {getEfficiencyStatus(stats.efficiency)}
              </span>
            </div>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* System Overview Panel - Spans full width */}
      <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">System Overview</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">Online</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Safety Status */}
          <div className="text-center">
            <div className="p-4 bg-green-50 rounded-lg mb-3">
              <Shield className="h-8 w-8 text-green-600 mx-auto" />
            </div>
            <h4 className="font-medium text-gray-900">Safety Systems</h4>
            <p className="text-sm text-green-600 mt-1">All circuits protected</p>
            <div className="mt-2">
              <div className="bg-green-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-full"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">100% operational</p>
            </div>
          </div>

          {/* Monitoring Status */}
          <div className="text-center">
            <div className="p-4 bg-blue-50 rounded-lg mb-3">
              <Activity className="h-8 w-8 text-blue-600 mx-auto" />
            </div>
            <h4 className="font-medium text-gray-900">Real-time Monitoring</h4>
            <p className="text-sm text-blue-600 mt-1">4 sensors active</p>
            <div className="mt-2">
              <div className="bg-blue-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-4/5"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Data streaming live</p>
            </div>
          </div>

          {/* Power Quality */}
          <div className="text-center">
            <div className="p-4 bg-purple-50 rounded-lg mb-3">
              <Zap className="h-8 w-8 text-purple-600 mx-auto" />
            </div>
            <h4 className="font-medium text-gray-900">Power Quality</h4>
            <p className="text-sm text-purple-600 mt-1">Stable supply</p>
            <div className="mt-2">
              <div className="bg-purple-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full w-5/6"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Excellent quality</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-gray-900">4</p>
              <p className="text-xs text-gray-600">Rooms Monitored</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-green-600">3</p>
              <p className="text-xs text-gray-600">Rooms Normal</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-yellow-600">1</p>
              <p className="text-xs text-gray-600">Warning Alert</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-red-600">1</p>
              <p className="text-xs text-gray-600">Critical Alert</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus