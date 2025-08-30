import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  AlertTriangle,
  Activity,
  Settings,
  Database,
  BarChart3,
  Shield,
  Zap,
  Menu,
  X
} from 'lucide-react'

const Sidebar = ({ onToggle, isCollapsed = true }) => {
  const location = useLocation()
  
  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: location.pathname === '/dashboard' || location.pathname === '/'
    },
    {
      name: 'Live Monitoring',
      href: '/monitoring',
      icon: Activity,
      active: location.pathname === '/monitoring'
    },
    {
      name: 'Alerts',
      href: '/alerts',
      icon: AlertTriangle,
      active: location.pathname === '/alerts'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      active: location.pathname === '/analytics'
    },
    {
      name: 'History',
      href: '/history',
      icon: Database,
      active: location.pathname === '/history'
    },
    {
      name: 'Safety',
      href: '/safety',
      icon: Shield,
      active: location.pathname === '/safety'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      active: location.pathname === '/settings'
    }
  ]

  return (
    <>
      {/* Fixed Toggle Button - Positioned to align with header */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-6 z-[60] group transition-all duration-300 transform hover:scale-110 active:scale-95"
        aria-label="Toggle sidebar"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 rounded-xl blur-md opacity-40 group-hover:opacity-80 transition-all duration-300"></div>
          
          {/* Main button - enlarged */}
          <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white p-4 rounded-xl shadow-xl border border-gray-500/50 group-hover:border-blue-400/50 transition-all duration-300">
            <div className="w-7 h-7 flex items-center justify-center">
              {isCollapsed ? (
                <Menu className="w-6 h-6 text-blue-400 transition-all duration-300 group-hover:text-cyan-400" />
              ) : (
                <X className="w-6 h-6 text-red-400 transition-all duration-300 group-hover:text-pink-400" />
              )}
            </div>
            
            {/* Status indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800 animate-pulse shadow-md shadow-green-500/50"></div>
          </div>
        </div>
      </button>

      {/* Sidebar - Hidden by default */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 shadow-2xl z-50 overflow-y-auto transition-all duration-300 ease-in-out ${
        isCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        {/* Header section */}
        <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 mt-16">
          <div className="flex items-center space-x-3">
            <div className="relative p-3 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-xl shadow-lg">
              <Zap className="h-7 w-7 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-xl blur opacity-50"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Smart Monitor</h2>
              <p className="text-sm text-blue-400 font-medium">Control Panel</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* System status indicator */}
          <div className="mb-8">
            <div className="relative overflow-hidden p-4 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600/50 rounded-2xl shadow-xl">
              <div className="flex items-center space-x-4 relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    <div className="absolute inset-0 h-4 w-4 bg-green-500 rounded-full animate-ping opacity-50"></div>
                  </div>
                  <Zap className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">System Status</p>
                  <p className="text-xs text-green-400 font-medium">All systems operational</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/15 via-blue-500/15 to-purple-500/15 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-50"></div>
            </div>
          </div>

          {/* Navigation menu */}
          <nav className="space-y-3 mb-8">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 px-3 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
              Navigation
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                    item.active
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white shadow-xl shadow-blue-500/30'
                      : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 hover:text-white hover:shadow-lg'
                  }`}
                >
                  {/* Active indicator */}
                  {item.active && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full shadow-lg"></div>
                  )}
                  
                  <Icon className={`h-6 w-6 transition-all duration-300 ${
                    item.active 
                      ? 'text-white drop-shadow-lg' 
                      : 'text-gray-400 group-hover:text-blue-400'
                  }`} />
                  <span className="text-sm font-semibold">{item.name}</span>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-cyan-500/15 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Border glow on hover */}
                  {!item.active && (
                    <div className="absolute inset-0 border border-blue-400/0 group-hover:border-blue-400/30 rounded-2xl transition-all duration-300"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Status cards */}
          <div className="space-y-4 pt-6 border-t border-gray-700">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              Quick Stats
            </div>
            
            <div className="relative p-4 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600/50 rounded-2xl shadow-xl overflow-hidden group hover:shadow-green-500/25 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-3 w-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                    <div className="absolute inset-0 h-3 w-3 bg-green-400 rounded-full animate-ping opacity-50"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-300">Rooms Online</span>
                </div>
                <span className="text-lg font-bold text-green-400 drop-shadow-lg">3/4</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="relative p-4 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600/50 rounded-2xl shadow-xl overflow-hidden group hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-3 w-3 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
                    <div className="absolute inset-0 h-3 w-3 bg-yellow-400 rounded-full animate-ping opacity-50"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-300">Active Alerts</span>
                </div>
                <span className="text-lg font-bold text-yellow-400 drop-shadow-lg">2</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="relative p-4 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600/50 rounded-2xl shadow-xl overflow-hidden group hover:shadow-red-500/25 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-3 w-3 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50"></div>
                    <div className="absolute inset-0 h-3 w-3 bg-red-400 rounded-full animate-ping opacity-50"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-300">Critical Issues</span>
                </div>
                <span className="text-lg font-bold text-red-400 drop-shadow-lg">1</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden transition-all duration-300"
          onClick={onToggle}
        />
      )}
    </>
  )
}

export default Sidebar