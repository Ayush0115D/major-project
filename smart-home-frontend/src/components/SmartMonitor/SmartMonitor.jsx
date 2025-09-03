import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardView from './views/DashboardView';
import MonitoringView from './views/MonitoringView';
import AnalyticsView from './views/AnalyticsView';
import AlertsView from './views/AlertsView';
import SettingsView from './views/SettingsView';
import { useSmartMonitorData } from '../hooks/useSmartMonitorData';

const SmartMonitor = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const handleNavigation = (viewId) => {
    setCurrentView(viewId);
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 min-h-screen">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={handleNavigation}
        roomData={roomData}
        alerts={alerts}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <Header 
          currentTime={currentTime}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        <div className="overflow-auto h-[calc(100vh-80px)]">
          {currentView === 'dashboard' && <DashboardView roomData={roomData} alerts={alerts} />}
          {currentView === 'monitoring' && <MonitoringView roomData={roomData} />}
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
          {currentView === 'settings' && <SettingsView />}
          {currentView === 'history' && (
            <div className="p-8">
              <h1 className="text-3xl font-bold text-white mb-4">History</h1>
              <p className="text-gray-400">Historical data and trends coming soon...</p>
            </div>
          )}
          {currentView === 'safety' && (
            <div className="p-8">
              <h1 className="text-3xl font-bold text-white mb-4">Safety Protocols</h1>
              <p className="text-gray-400">Safety management features coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartMonitor;
