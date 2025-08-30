import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardView from './views/DashboardView';
import AnalyticsView from './views/AnalyticsView';
import { useSmartMonitorData } from './hooks/useSmartMonitorData';

const SmartMonitor = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { roomData, alerts, powerData, currentTime, totalPower, avgVoltage, totalCurrent, efficiency } = useSmartMonitorData();

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        roomData={roomData}
        alerts={alerts}
      />
      
      <div className="flex-1">
        <Header currentTime={currentTime} />
        
        <div className="overflow-auto">
          {currentView === 'dashboard' && 
            <DashboardView roomData={roomData} />
          }
          {currentView === 'monitoring' && 
            <DashboardView roomData={roomData} />
          }
          {currentView === 'analytics' && 
            <AnalyticsView 
              roomData={roomData}
              alerts={alerts}
              powerData={powerData}
              totalPower={totalPower}
              avgVoltage={avgVoltage}
              totalCurrent={totalCurrent}
              efficiency={efficiency}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default SmartMonitor;