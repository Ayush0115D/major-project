import React, { useState, useEffect } from 'react'
import { Home, Wifi, WifiOff, Bell, Settings, User } from 'lucide-react'

const Header = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Simulate connection status
    const connectionTimer = setInterval(() => {
      setIsOnline(prev => Math.random() > 0.1 ? true : prev)
    }, 5000)

    return () => {
      clearInterval(timer)
      clearInterval(connectionTimer)
    }
  }, [])

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Smart Home Monitor
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-500">Short Circuit Detection System</span>
            </div>
          </div>

          {/* Center - Connection Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                isOnline ? 'text-green-600' : 'text-red-600'
              }`}>
                {isOnline ? 'Connected' : 'Offline'}
              </span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="text-sm text-gray-600">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header