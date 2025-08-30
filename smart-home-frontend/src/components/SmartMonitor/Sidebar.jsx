import React from 'react';
import { 
  Activity, 
  Zap, 
  Home, 
  BarChart3, 
  Clock, 
  Shield, 
  Settings,
  Bell
} from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView, roomData, alerts }) => {
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
    <div className="w-64 bg-gray-900 text-white h-screen p-4">
      <div className="flex items-center mb-8">
        <Activity className="mr-3 text-blue-400" size={24} />
        <h1 className="text-xl font-bold">Smart Monitor</h1>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Zap className="mr-2 text-green-400" size={16} />
          <span className="text-sm">Control Panel</span>
        </div>
        <div className="text-xs text-gray-400 mb-4">All systems operational</div>
        
        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-2">NAVIGATION</div>
          {navigationItems.map((item) => (
            <div 
              key={item.id}
              className={`flex items-center p-2 rounded cursor-pointer mb-1 ${
                currentView === item.id ? 'bg-blue-600' : 'hover:bg-gray-800'
              }`}
              onClick={() => setCurrentView(item.id)}
            >
              <item.icon className="mr-2" size={16} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xs text-gray-400 mb-2">QUICK STATS</div>
        <div className="bg-green-800 p-2 rounded mb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Rooms Online</span>
            <span className="text-sm font-bold">{roomsOnline}/4</span>
          </div>
        </div>
        <div className="bg-orange-800 p-2 rounded mb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Active Alerts</span>
            <span className="text-sm font-bold">{activeAlerts}</span>
          </div>
        </div>
        <div className="bg-red-800 p-2 rounded">
          <div className="flex items-center justify-between">
            <span className="text-sm">Critical Issues</span>
            <span className="text-sm font-bold">{criticalIssues}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;