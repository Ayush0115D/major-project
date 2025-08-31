import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardView from './views/DashboardView';
import AnalyticsView from './views/AnalyticsView';
import AlertsView from './views/AlertsView';
import { useSmartMonitorData } from '../hooks/useSmartMonitorData';

const SmartMonitor = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true); // NEW: Sidebar toggle state
  const { 
    roomData, 
    alerts, 
    powerData, 
    currentTime, 
    totalPower, 
    avgVoltage, 
    totalCurrent, 
    efficiency 
  } = useSmartMonitorData();

  // NEW: Function to handle navigation and toggle sidebar
  const handleNavigation = (viewId) => {
    setCurrentView(viewId);
    setSidebarOpen(false); // Hide sidebar after navigation
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 min-h-screen">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={handleNavigation} // Updated to use new handler
        roomData={roomData}
        alerts={alerts}
        isOpen={sidebarOpen} // NEW: Pass sidebar state
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} // NEW: Toggle function
      />
      
      {/* Dynamic margin based on sidebar state */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-16'}`}>
        <Header 
          currentTime={currentTime}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} // NEW: Pass toggle to header
          sidebarOpen={sidebarOpen} // NEW: Pass sidebar state to header
        />
        
        <div className="overflow-auto h-[calc(100vh-80px)]">
          {currentView === 'dashboard' && <DashboardView roomData={roomData} />}
          {currentView === 'monitoring' && <DashboardView roomData={roomData} />}
          {currentView === 'alerts' && <AlertsView alerts={alerts} roomData={roomData} />}
          {currentView === 'analytics' && (
            <AnalyticsView 
              roomData={roomData}
              powerData={powerData}
              totalPower={totalPower}
              avgVoltage={avgVoltage}
              totalCurrent={totalCurrent}
              efficiency={efficiency}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartMonitor;