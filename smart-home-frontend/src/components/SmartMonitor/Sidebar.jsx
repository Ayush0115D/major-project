import React from 'react';

const Sidebar = ({ currentView, setCurrentView, roomData, alerts, isOpen, toggleSidebar }) => {
  const room = roomData['living-room'];

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠', description: 'System Overview' },
    { 
      id: 'living-room', // 👈 fixed: was "room-status"
      name: 'Living Room', 
      icon: '🛋️', 
      description: `${room?.components?.length || 0} Components`, 
      alerts: alerts.filter(a => a.location === 'Living Room' && a.status === 'active').length 
    },
    { id: 'monitoring', name: 'Real-time Monitor', icon: '📊', description: 'Live Data Stream' },
    { id: 'alerts', name: 'System Alerts', icon: '🚨', description: 'Fault Management', alerts: alerts.filter(alert => alert.status === 'active').length },
    { id: 'history', name: 'History', icon: '📜', description: 'Historical Data' },
    { id: 'safety', name: 'Safety', icon: '🛡️', description: 'Safety Protocols' },
    { id: 'settings', name: 'Settings', icon: '⚙️', description: 'System Config' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen bg-slate-900/95 backdrop-blur-sm border-r border-slate-800 text-white transition-all duration-300 z-50 flex flex-col ${
        isOpen ? 'w-72' : 'w-20'
      }`}>
        
        {/* Top Section */}
        <div className="flex-shrink-0 p-4 border-b border-slate-800 flex items-center justify-between">
          {isOpen ? (
            <>
              {/* Branding */}
              <div className="flex items-center space-x-2">
                <div className="text-3xl text-blue-400 drop-shadow-lg">🛡️</div>
                <div>
                  <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                    SHIELD
                  </h1>
                  <p className="text-xs text-blue-300 tracking-wide drop-shadow-sm">
                    Smart Home Monitor
                  </p>
                </div>
              </div>

              {/* Collapse Button */}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-gray-400 hover:text-white"
              >
                ◀
              </button>
            </>
          ) : (
            <>
              {/* Hamburger Menu (when collapsed) */}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-gray-400 hover:text-white mx-auto"
              >
                ☰
              </button>
            </>
          )}
        </div>

        {/* Scrollable Section */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
                      currentView === item.id 
                        ? 'bg-blue-600/30 border border-blue-500/50 text-white' 
                        : 'hover:bg-slate-800 text-gray-300 hover:text-white'
                    } ${isOpen ? 'justify-start' : 'justify-center'}`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    
                    {isOpen && (
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs opacity-75">{item.description}</div>
                          </div>
                          {item.alerts > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                              {item.alerts}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {!isOpen && (
                      <div className="absolute left-20 bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-xl">
                        {item.name}
                        {item.alerts > 0 && (
                          <span className="ml-2 bg-red-500 px-1 rounded-full text-xs">
                            {item.alerts}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Living Room Status */}
          {isOpen && room && (
            <div className="p-4 border-t border-slate-800">
              <h3 className="text-sm font-semibold mb-3 text-blue-400">Living Room Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Power:</span>
                  <span className="font-medium text-white">{room.powerConsumption || 0}W</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Temperature:</span>
                  <span className="font-medium text-white">{room.temperature || 24}°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Components:</span>
                  <span className="font-medium text-white">
                    {room.components?.filter(c => c.status === 'on' || c.status === 'in-use').length || 0}/{room.components?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-medium px-2 py-1 rounded text-xs ${
                    room.status === 'normal' ? 'bg-green-500/20 text-green-300' :
                    room.status === 'overload' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {room.status?.toUpperCase() || 'NORMAL'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-slate-800">
          {isOpen ? (
            <div className="text-center">
              <div className="text-xs text-gray-400">Last Update</div>
              <div className="text-sm font-medium text-blue-400">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-2xl">⚡</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
