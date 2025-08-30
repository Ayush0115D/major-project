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
    <div className="p-6">
      <StatsCards 
        totalPower={totalPower}
        avgVoltage={avgVoltage}
        totalCurrent={totalCurrent}
        efficiency={efficiency}
      />
      
      <CriticalAlertBanner criticalIssues={criticalIssues} />

      <div className="grid grid-cols-3 gap-6 mb-8">
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