import React, { useState } from 'react';
import { Thermometer, Zap, Activity } from 'lucide-react';

const RoomCard = ({ roomName, data }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusConfig = (status) => {
    switch(status) {
      case 'NORMAL': 
        return {
          border: 'border-green-500/50 hover:border-green-400',
          bg: 'bg-gradient-to-br from-green-500/10 to-emerald-500/5',
          dot: 'bg-green-400 shadow-green-400/50',
          glow: 'shadow-green-500/20'
        };
      case 'WARNING': 
        return {
          border: 'border-yellow-500/50 hover:border-yellow-400',
          bg: 'bg-gradient-to-br from-yellow-500/10 to-amber-500/5',
          dot: 'bg-yellow-400 shadow-yellow-400/50',
          glow: 'shadow-yellow-500/20'
        };
      case 'CRITICAL': 
        return {
          border: 'border-red-500/50 hover:border-red-400',
          bg: 'bg-gradient-to-br from-red-500/10 to-rose-500/5',
          dot: 'bg-red-400 shadow-red-400/50',
          glow: 'shadow-red-500/20'
        };
      default: 
        return {
          border: 'border-gray-500/50',
          bg: 'bg-gradient-to-br from-gray-500/10 to-slate-500/5',
          dot: 'bg-gray-400',
          glow: ''
        };
    }
  };

  // Provide default values if data is not available
  const safeData = {
    voltage: data?.voltage || 0,
    current: data?.current || 0,
    temperature: data?.temperature || data?.temp || 0,
    power: data?.power || 0,
    status: data?.status || 'UNKNOWN'
  };

  const config = getStatusConfig(safeData.status);

  return (
    <div 
      className={`${config.bg} ${config.border} ${config.glow} border-2 rounded-2xl p-8 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer group relative overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        <div className={`w-4 h-4 rounded-full ${config.dot} shadow-lg animate-pulse`}></div>
      </div>

      <div className="relative z-10">
        <div className="text-white mb-6">
          <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
            {roomName}
          </h3>
          <div className="flex items-center space-x-6 text-gray-300">
            <div className="flex items-center">
              <Zap className="mr-2 text-blue-400" size={18} />
              <span className="text-lg font-semibold">{safeData.voltage.toFixed(1)}V</span>
            </div>
            <div className="flex items-center">
              <Activity className="mr-2 text-green-400" size={18} />
              <span className="text-lg font-semibold">{safeData.current.toFixed(1)}A</span>
            </div>
            <div className="flex items-center">
              <Thermometer className="mr-2 text-orange-400" size={18} />
              <span className="text-lg font-semibold">{safeData.temperature.toFixed(1)}°C</span>
            </div>
          </div>
        </div>

        {/* Power Display */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {safeData.power.toFixed(0)}W
            </div>
            <div className="text-sm text-gray-400">Power Consumption</div>
          </div>
          <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
            safeData.status === 'NORMAL' ? 'bg-green-500/20 text-green-400' :
            safeData.status === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400' :
            safeData.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {safeData.status}
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeLayoutMonitor = ({ livingRoomData }) => {
  return (
    <div className="flex justify-center max-w-7xl mx-auto">
      <div className="w-full max-w-lg">
        <RoomCard roomName="Living Room" data={livingRoomData} />
      </div>
    </div>
  );
};

export default HomeLayoutMonitor;