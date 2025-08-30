import React from 'react';
import { Power, Zap, Activity, Gauge, TrendingUp } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, trend, bgGradient }) => (
  <div className={`bg-gradient-to-br ${bgGradient} backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group`}>
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-400 text-sm font-semibold tracking-wider">{title}</span>
      <div className={`p-3 ${color.bg} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={color.text} size={24} />
      </div>
    </div>
    <div className="flex items-end justify-between">
      <div className="text-3xl font-bold text-white">{value}</div>
      {trend && (
        <div className="flex items-center text-green-400">
          <TrendingUp size={16} className="mr-1" />
          <span className="text-sm font-medium">{trend}</span>
        </div>
      )}
    </div>
  </div>
);

const StatsCards = ({ totalPower, avgVoltage, totalCurrent, efficiency }) => {
  return (
    <div className="grid grid-cols-4 gap-6 mb-10">
      <StatsCard
        title="TOTAL POWER"
        value={`${(totalPower/1000).toFixed(1)}kW`}
        icon={Power}
        color={{ bg: 'bg-blue-500/20', text: 'text-blue-400' }}
        bgGradient="from-blue-500/10 to-cyan-500/5"
        trend="+2.5%"
      />
      <StatsCard
        title="AVG VOLTAGE"
        value={`${avgVoltage.toFixed(1)}V`}
        icon={Zap}
        color={{ bg: 'bg-purple-500/20', text: 'text-purple-400' }}
        bgGradient="from-purple-500/10 to-pink-500/5"
        trend="+0.8%"
      />
      <StatsCard
        title="TOTAL CURRENT"
        value={`${totalCurrent.toFixed(1)}A`}
        icon={Activity}
        color={{ bg: 'bg-green-500/20', text: 'text-green-400' }}
        bgGradient="from-green-500/10 to-emerald-500/5"
        trend="+1.2%"
      />
      <StatsCard
        title="EFFICIENCY"
        value={`${efficiency}%`}
        icon={Gauge}
        color={{ bg: 'bg-cyan-500/20', text: 'text-cyan-400' }}
        bgGradient="from-cyan-500/10 to-teal-500/5"
        trend="+0.3%"
      />
    </div>
  );
};

export default StatsCards;