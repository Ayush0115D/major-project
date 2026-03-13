import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardView from './views/DashboardView';
import SystemAlerts from './components/SystemAlerts';
import MonitoringView from './views/MonitoringView';
import SettingsView from './views/SettingsView';
import SafetyProtocols from './components/SafetyProtocols';
import LivingRoomView from './views/LivingRoomView' ;
import { useSmartMonitorData } from "../hooks/useSmartMonitorData.js";

const SmartMonitor = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [alertHistory, setAlertHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    roomData,
    alerts,
    systemStats,
    currentTime,
    toggleComponent,
    acknowledgeAlert,
    resolveAlert
  } = useSmartMonitorData();

  // Fetch alerts from backend MongoDB (Works on both local and deployed)
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        
        // Detect if running locally or on deployed Vercel
        const BACKEND_URL = window.location.hostname === 'localhost'
          ? 'http://localhost:5000'
          : 'https://major-project-h76o.onrender.com';
        
        console.log('🌐 Fetching from:', BACKEND_URL);
        
        const response = await fetch(`${BACKEND_URL}/api/alerts/history`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            // Format data for display
            const formattedAlerts = data.data.map(alert => ({
              ...alert,
              timestamp: new Date(alert.timestamp).toLocaleString(),
              power: alert.power,
              current: alert.current,
              riskLevel: alert.riskLevel,
              type: alert.alertType
            }));
            setAlertHistory(formattedAlerts);
          }
        }
      } catch (error) {
        console.warn('Could not fetch alerts from backend:', error.message);
        // Fallback to localStorage
        const storedAlerts = localStorage.getItem('shieldAlerts');
        if (storedAlerts) {
          try {
            setAlertHistory(JSON.parse(storedAlerts));
          } catch (e) {
            console.error('Error loading alerts:', e);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    // Fetch on component mount
    fetchAlerts();

    // Refresh every 5 seconds to get new alerts
    const interval = setInterval(fetchAlerts, 5000);
    
    return () => clearInterval(interval);
  }, []);

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
            <h1 className={`text-3xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Alert History</h1>
            
            {loading ? (
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Loading alerts...
              </p>
            ) : alertHistory.length === 0 ? (
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                No alerts recorded yet...
              </p>
            ) : (
              <div className={`rounded-lg overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <table className="w-full">
                  <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}>
                    <tr>
                      <th className={`px-6 py-3 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Time</th>
                      <th className={`px-6 py-3 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Type</th>
                      <th className={`px-6 py-3 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Risk Cause</th>
                      <th className={`px-6 py-3 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Power</th>
                      <th className={`px-6 py-3 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Current</th>
                      <th className={`px-6 py-3 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Voltage</th>
                      <th className={`px-6 py-3 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Risk %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertHistory.map((alert, index) => {
                      // Determine which risk type was triggered
                      let riskCause = 'Unknown';
                      if (alert.overloadRisk > alert.shortCircuitRisk) {
                        riskCause = '⚡ Overload';
                      } else if (alert.shortCircuitRisk > alert.overloadRisk) {
                        riskCause = '🔌 Short Circuit';
                      } else {
                        riskCause = '⚠️ Both';
                      }

                      return (
                        <tr key={index} className={`border-t ${
                          theme === 'dark' 
                            ? alert.type === 'CRITICAL' 
                              ? 'bg-red-900/20 border-red-500/30' 
                              : 'bg-yellow-900/20 border-yellow-500/30'
                            : alert.type === 'CRITICAL'
                            ? 'bg-red-50'
                            : 'bg-yellow-50'
                        }`}>
                          <td className={`px-6 py-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {alert.timestamp}
                          </td>
                          <td className={`px-6 py-3 font-bold ${
                            alert.type === 'CRITICAL' 
                              ? 'text-red-400' 
                              : 'text-yellow-400'
                          }`}>
                            [{alert.type}]
                          </td>
                          <td className={`px-6 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span className={`px-3 py-1 rounded text-sm font-semibold ${
                              riskCause.includes('Overload')
                                ? 'bg-red-500/20 text-red-400'
                                : riskCause.includes('Short')
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-purple-500/20 text-purple-400'
                            }`}>
                              {riskCause}
                            </span>
                          </td>
                          <td className={`px-6 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {alert.power}W
                          </td>
                          <td className={`px-6 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {alert.current}A
                          </td>
                          <td className={`px-6 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {alert.voltage}V
                          </td>
                          <td className={`px-6 py-3 font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {alert.riskLevel}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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