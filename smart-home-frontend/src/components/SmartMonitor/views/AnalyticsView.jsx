import React from 'react';
import StatsCards from '../components/StatsCards';
import CriticalAlertBanner from '../components/CriticalAlertBanner';
import RoomStatusCards from '../components/RoomStatusCards';
import Analytics24Chart from '../components/Analytics24Chart';

const AnalyticsView = ({ 
  roomData, 
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

      {/* 24-Hour Analytics Chart */}
      <div className="mb-10">
        <Analytics24Chart powerData={powerData} totalPower={totalPower} />
      </div>

      <div className="mb-10">
        <RoomStatusCards roomData={roomData} />
      </div>
    </div>
  );
};

export default AnalyticsView;
