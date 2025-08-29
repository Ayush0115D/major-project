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
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Zap className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">System Status</p>
              <p className="text-xs text-blue-600">All systems operational</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${item.active ? 'text-blue-700' : 'text-gray-400'}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">Rooms Online</span>
                <span className="text-sm font-bold text-green-600">3/4</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-800">Warnings</span>
                <span className="text-sm font-bold text-yellow-600">1</span>
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-800">Critical</span>
                <span className="text-sm font-bold text-red-600">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar