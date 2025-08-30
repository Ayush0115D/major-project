import React from 'react';
import { Power, Zap, Activity, Gauge } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-400 text-sm">{title}</span>
      <Icon className={color} size={20} />
    </div>
    <div className="text-3xl font-bold text-white">{value}</div>
  </div>
);

const StatsCards = ({ totalPower, avgVoltage, totalCurrent, efficiency }) => {
  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="TOTAL POWER"
        value={`${(totalPower/1000).toFixed(1)}kW`}
        icon={Power}
        color="text-blue-400"
      />
      <StatsCard
        title="AVG VOLTAGE"
        value={`${avgVoltage.toFixed(1)}V`}
        icon={Zap}
        color="text-purple-400"
      />
      <StatsCard
        title="TOTAL CURRENT"
        value={`${totalCurrent.toFixed(1)}A`}
        icon={Activity}
        color="text-green-400"
      />
      <StatsCard
        title="EFFICIENCY"
        value={`${efficiency}%`}
        icon={Gauge}
        color="text-cyan-400"
      />
    </div>
  );
};

export default StatsCards;
