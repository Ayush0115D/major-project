import React from 'react';
import StatsCards from '../components/StatsCards';
import CriticalAlertBanner from '../components/CriticalAlertBanner';
import RoomStatusCards from '../components/RoomStatusCards';
import SystemAlerts from '../components/SystemAlerts';
import PowerChart from '../components/PowerChart';

const AnalyticsView = ({ 
  roomData, 
  alerts, 
  powerData, 
  totalPower, 
  avgVoltage, 
  totalCurrent, 
  efficiency 
}) => {
  const criticalIssues = Object.values(roomData).filter(room => room.status === 'CRITICAL').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">System Analytics</h1>
        <p className="text-gray-400 text-lg">Comprehensive monitoring and performance insights</p>
      </div>

      <StatsCards 
        totalPower={totalPower}
        avgVoltage={avgVoltage}
        totalCurrent={totalCurrent}
        efficiency={efficiency}
      />
      
      <CriticalAlertBanner criticalIssues={criticalIssues} />

      <div className="grid grid-cols-3 gap-8 mb-10">
        <div className="col-span-2">
          <RoomStatusCards roomData={roomData} />
        </div>
        <div>
          <SystemAlerts alerts={alerts} />
        </div>
      </div>

      <PowerChart powerData={powerData} totalPower={totalPower} />
    </div>
  );
};

export default AnalyticsView;
