import React from 'react';
import { 
  Activity, 
  Zap, 
  Home, 
  BarChart3, 
  Clock, 
  Shield, 
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView, roomData, alerts, isOpen, toggleSidebar }) => {
  const roomsOnline = Object.values(roomData).filter(room => room.status !== 'OFFLINE').length;
  const activeAlerts = alerts.length;
  const criticalIssues = Object.values(roomData).filter(room => room.status === 'CRITICAL').length;

  const navigationItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'monitoring', icon: Activity, label: 'Live Monitoring' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'history', icon: Clock, label: 'History' },
    { id: 'safety', icon: Shield, label: 'Safety' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isOpen ? 'w-72' : 'w-20'} 
        bg-gradient-to-b from-slate-800 via-slate-900 to-gray-900 
        text-white h-screen overflow-hidden border-r border-slate-700/50 
        backdrop-blur-sm fixed left-0 top-0 z-50 transition-all duration-300
      `}>
        {/* Scrollable content */}
        <div className="h-full overflow-y-auto">
          <div className={`${isOpen ? 'p-6' : 'p-3'} transition-all duration-300`}>
            {/* Logo Section */}
            <div className={`flex items-center mb-8 ${!isOpen && 'justify-center'}`}>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Activity className="text-white" size={24} />
              </div>
              {isOpen && (
                <div className="ml-4 flex-1">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                   SHIELD
                  </h1>
                  <h1 className="text-xl font-semibold text-white -mt-1">PORTAL</h1>
                </div>
              )}
            </div>

            {/* Toggle Button */}
            <div className={`mb-6 ${!isOpen && 'flex justify-center'}`}>
              <button
                onClick={toggleSidebar}
                className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors duration-200"
              >
                {isOpen ? (
                  <ChevronLeft className="text-gray-400 hover:text-white" size={20} />
                ) : (
                  <ChevronRight className="text-gray-400 hover:text-white" size={20} />
                )}
              </button>
            </div>
            
            {/* Control Panel Section - Only show when open */}
            {isOpen && (
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <div className="p-1 bg-green-500/20 rounded-lg mr-3">
                    <Zap className="text-green-400" size={16} />
                  </div>
                  <span className="text-sm font-semibold text-gray-300">Control Panel</span>
                </div>
                <div className="text-xs text-green-400 mb-6 pl-8">All systems operational</div>
              </div>
            )}
            
            {/* Navigation */}
            <div className="mb-6">
              {isOpen && (
                <div className="text-xs font-semibold text-gray-400 mb-4 tracking-wider">NAVIGATION</div>
              )}
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`relative flex items-center ${isOpen ? 'p-3' : 'p-3 justify-center'} rounded-xl cursor-pointer transition-all duration-300 group ${
                      currentView === item.id 
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                        : 'hover:bg-slate-800/60'
                    }`}
                    onClick={() => setCurrentView(item.id)}
                  >
                    <div className={`p-2 rounded-lg ${isOpen ? 'mr-3' : ''} ${
                      currentView === item.id 
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' 
                        : 'bg-slate-700/50 text-gray-400 group-hover:bg-slate-600 group-hover:text-white'
                    } transition-all duration-300`}>
                      <item.icon size={16} />
                    </div>
                    
                    {/* Label - only show when sidebar is open */}
                    {isOpen && (
                      <span className={`font-medium ${
                        currentView === item.id ? 'text-white' : 'text-gray-300'
                      }`}>
                        {item.label}
                      </span>
                    )}
                    
                    {/* Tooltip for collapsed sidebar */}
                    {!isOpen && (
                      <div className="absolute left-full ml-3 bg-slate-800 text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-xl border border-slate-600">
                        {item.label}
                        <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats - Only show when sidebar is open */}
            {isOpen && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-400 mb-4 tracking-wider">QUICK STATS</div>
                
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-3 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-xs font-medium text-gray-300">Rooms Online</span>
                    </div>
                    <span className="text-sm font-bold text-green-400">{roomsOnline}/4</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 p-3 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-xs font-medium text-gray-300">Active Alerts</span>
                    </div>
                    <span className="text-sm font-bold text-orange-400">{activeAlerts}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 p-3 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-xs font-medium text-gray-300">Critical Issues</span>
                    </div>
                    <span className="text-sm font-bold text-red-400">{criticalIssues}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;