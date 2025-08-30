import React, { useState } from 'react'
import { AlertTriangle, Info, CheckCircle, X, Clock, Filter } from 'lucide-react'

const AlertPanel = ({ alerts }) => {
  const [filter, setFilter] = useState('all') // all, critical, warning, info
  const [showResolved, setShowResolved] = useState(false)

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info': return <Info className="h-4 w-4 text-blue-500" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'border-l-red-500 bg-red-50'
      case 'warning': return 'border-l-yellow-500 bg-yellow-50'
      case 'info': return 'border-l-blue-500 bg-blue-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const filteredAlerts = alerts.filter(alert => {
    if (!showResolved && alert.resolved) return false
    if (filter === 'all') return true
    return alert.type === filter
  })

  const unresolvedCount = alerts.filter(alert => !alert.resolved).length
  const criticalCount = alerts.filter(alert => !alert.resolved && alert.type === 'critical').length

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
            <p className="text-sm text-gray-600">
              {unresolvedCount} active alert{unresolvedCount !== 1 ? 's' : ''}
              {criticalCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                  {criticalCount} critical
                </span>
              )}
            </p>
          </div>
          <div className="relative">
            <Filter className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Filter Options */}
        <div className="mt-3 flex flex-wrap gap-2">
          {['all', 'critical', 'warning', 'info'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filter === type
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Show Resolved Toggle */}
        <div className="mt-2 flex items-center">
          <input
            type="checkbox"
            id="showResolved"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="h-3 w-3 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="showResolved" className="ml-2 text-xs text-gray-600">
            Show resolved alerts
          </label>
        </div>
      </div>

      {/* Alerts List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">No alerts</h4>
            <p className="text-xs text-gray-500">
              {filter === 'all' 
                ? 'All systems are running normally' 
                : `No ${filter} alerts at this time`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border-l-4 ${getAlertColor(alert.type)} ${
                  alert.resolved ? 'opacity-60' : ''
                } ${alert.type === 'critical' && !alert.resolved ? 'animate-pulse' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {alert.room}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {alert.message}
                        </p>
                      </div>
                      {alert.resolved && (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {getTimeAgo(alert.timestamp)}
                      </div>
                      <div className="flex items-center space-x-2">
                        {alert.type === 'critical' && !alert.resolved && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                            Urgent
                          </span>
                        )}
                        {alert.resolved && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons for unresolved alerts */}
                {!alert.resolved && (
                  <div className="mt-3 flex space-x-2">
                    <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors">
                      View Details
                    </button>
                    {alert.type === 'critical' && (
                      <button className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition-colors">
                        Emergency Stop
                      </button>
                    )}
                    <button className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                      Mark as Read
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with quick actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex space-x-2">
            <button className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-50 transition-colors">
              View All
            </button>
            {criticalCount > 0 && (
              <button className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">
                Emergency Protocol
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertPanel