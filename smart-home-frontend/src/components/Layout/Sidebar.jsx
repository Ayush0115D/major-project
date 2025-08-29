import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  AlertTriangle,
  Activity,
  Settings,
  Database,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react'

const Sidebar = () => {
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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 border-r-2 border-gray-600 shadow-2xl z-50 overflow-y-auto">
      {/* Header section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Smart Monitor</h2>
            <p className="text-xs text-gray-400">Control Panel</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* System status indicator */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-900/50 to-blue-800/30 border border-blue-700/70 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-200">System Status</p>
              <p className="text-xs text-blue-300">All systems operational</p>
            </div>
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="space-y-2 mb-8">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Navigation
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  item.active
                    ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/20'
                    : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/30 hover:text-white hover:shadow-lg'
                }`}
              >
                <Icon className={`h-5 w-5 transition-colors ${
                  item.active 
                    ? 'text-blue-400' 
                    : 'text-gray-400 group-hover:text-white'
                }`} />
                <span className="font-medium">{item.name}</span>
                {item.active && (
                  <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Status cards at bottom */}
        <div className="space-y-4 pt-6 border-t border-gray-700">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Quick Stats
          </div>
          
          <div className="p-4 bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 border border-emerald-700/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-emerald-400 rounded-full"></div>
                <span className="text-sm font-medium text-emerald-200">Rooms Online</span>
              </div>
              <span className="text-lg font-bold text-emerald-400">3/4</span>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-amber-900/30 to-amber-800/20 border border-amber-700/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-amber-200">Active Alerts</span>
              </div>
              <span className="text-lg font-bold text-amber-400">2</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-200">Critical Issues</span>
              </div>
              <span className="text-lg font-bold text-red-400">1</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar