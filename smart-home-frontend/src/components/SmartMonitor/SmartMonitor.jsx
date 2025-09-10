import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardView from './views/DashboardView';
import SystemAlerts from './components/SystemAlerts';
import MonitoringView from './views/MonitoringView';
import SettingsView from './views/SettingsView';
import SafetyProtocols from './components/SafetyProtocols';

import { useSmartMonitorData } from "../hooks/useSmartMonitorData.js";

const SmartMonitor = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
 
  const {
    roomData,
    alerts,
    systemStats,
    currentTime,
    toggleComponent,
    acknowledgeAlert,
    resolveAlert
  } = useSmartMonitorData();

  const handleNavigation = (viewId) => {
    setCurrentView(viewId);
  };

  const renderCurrentView = () => {
    switch(currentView) {
      case 'dashboard':
        return <DashboardView roomData={roomData} alerts={alerts} systemStats={systemStats} />;
      case 'monitoring':
        return <MonitoringView roomData={roomData} />;
      case 'alerts':
        return (
          <SystemAlerts
            alerts={alerts}
            acknowledgeAlert={acknowledgeAlert}
            resolveAlert={resolveAlert}
            isOpen={true}
          />
        );
      case 'settings':
        return <SettingsView toggleComponent={toggleComponent} roomData={roomData} />;
      case 'history':
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-4">History</h1>
            <p className="text-gray-400">Historical data and trends coming soon...</p>
          </div>
        );
 case 'safety':
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6"></h1>
      <SafetyProtocols />
    </div>
  );
      default:
        return <DashboardView roomData={roomData} alerts={alerts} systemStats={systemStats} />;
    }
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
          systemStats={systemStats}
          alerts={alerts}
        />
       
        <div className="overflow-auto h-[calc(100vh-80px)]">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

export default SmartMonitor;