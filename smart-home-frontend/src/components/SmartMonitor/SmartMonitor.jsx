import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardView from './views/DashboardView';
import SystemAlerts from './components/SystemAlerts';
import MonitoringView from './views/MonitoringView';
import SettingsView from './views/SettingsView';
import SafetyProtocols from './components/SafetyProtocols';
import LivingRoomView from './views/LivingRoomView';
import { useSmartMonitorData } from "../hooks/useSmartMonitorData.js";

const SmartMonitor = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark'); // Add theme state

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
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            roomData={roomData}
            alerts={alerts}
            systemStats={systemStats}
            theme={theme}
          />
        );
      case 'living-room':
        return (
          <LivingRoomView
            roomData={roomData}
            alerts={alerts}
            theme={theme}
          />
        );
      case 'monitoring':
        return (
          <MonitoringView
            roomData={roomData}
            alerts={alerts}
            systemStats={systemStats}
            theme={theme}
          />
        );
      case 'alerts':
        return (
          <SystemAlerts
            alerts={alerts}
            acknowledgeAlert={acknowledgeAlert}
            resolveAlert={resolveAlert}
            isOpen={true}
            theme={theme}
          />
        );
      case 'settings':
        return (
          <SettingsView
            toggleComponent={toggleComponent}
            roomData={roomData}
            theme={theme}
            setTheme={setTheme}
          />
        );
      case 'history':
        return (
          <div className="p-8">
            <h1 className={`text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>History</h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Historical data and trends coming soon...
            </p>
          </div>
        );
      case 'safety':
        return (
          <div className="p-8">
            <h1 className={`text-3xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}></h1>
            <SafetyProtocols theme={theme} />
          </div>
        );
      default:
        return (
          <DashboardView
            roomData={roomData}
            alerts={alerts}
            systemStats={systemStats}
            theme={theme}
          />
        );
    }
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' 
        : 'bg-gradient-to-br from-gray-100 via-slate-100 to-gray-200'
    }`}>
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={handleNavigation}
        roomData={roomData}
        alerts={alerts}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        theme={theme}
      />

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-72' : 'ml-20'
        }`}
      >
        <Header
          currentTime={currentTime}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          systemStats={systemStats}
          alerts={alerts}
          theme={theme}
        />

        {/* Dynamic views */}
        <div className="overflow-auto h-[calc(100vh-80px)]">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

export default SmartMonitor;