import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

const TimeChart = ({ roomData }) => {
  const [timelineData, setTimelineData] = useState([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);

  useEffect(() => {
    // Generate 12 data points for the last 12 hours
    const generateTimelineData = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 11; i >= 0; i--) {
        const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
        const hour = time.getHours();
        
        // Calculate total power based on current room data with hourly variations
        const baseTotalPower = Object.values(roomData).reduce((sum, room) => sum + room.power, 0);
        
        // Add realistic hourly variations
        let hourMultiplier = 1;
        if (hour >= 6 && hour <= 9) hourMultiplier = 1.3; // Morning peak
        else if (hour >= 18 && hour <= 22) hourMultiplier = 1.5; // Evening peak
        else if (hour >= 0 && hour <= 6) hourMultiplier = 0.6; // Night low
        else if (hour >= 12 && hour <= 17) hourMultiplier = 1.1; // Afternoon
        
        const variation = (Math.random() - 0.5) * 0.2;
        const totalPower = Math.round(baseTotalPower * (hourMultiplier + variation));
        
        data.push({
          time: time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          hour,
          totalPower,
          timestamp: time,
          status: totalPower > baseTotalPower * 1.2 ? 'high' : 
                  totalPower < baseTotalPower * 0.8 ? 'low' : 'normal'
        });
      }
      return data;
    };

    setTimelineData(generateTimelineData());
  }, [roomData]);

  const maxPower = Math.max(...timelineData.map(d => d.totalPower));
  const minPower = Math.min(...timelineData.map(d => d.totalPower));
  const currentPower = Object.values(roomData).reduce((sum, room) => sum + room.power, 0);
  const trend = timelineData.length > 1 ? 
    timelineData[timelineData.length - 1].totalPower - timelineData[0].totalPower : 0;

  const getStatusColor = (status) => {
    switch(status) {
      case 'high': return 'bg-red-400';
      case 'low': return 'bg-blue-400';
      default: return 'bg-green-400';
    }
  };

  return (
    <div className="mb-10 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Activity className="text-blue-400 mr-3" size={24} />
          <div>
            <h3 className="text-xl font-bold text-white">12-Hour Power Timeline</h3>
            <p className="text-gray-400 text-sm">Real-time consumption patterns</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {currentPower}W
            </div>
            <div className="text-xs text-gray-400 flex items-center">
              {trend > 0 ? (
                <TrendingUp className="mr-1 text-green-400" size={12} />
              ) : (
                <TrendingDown className="mr-1 text-red-400" size={12} />
              )}
              {trend > 0 ? '+' : ''}{trend}W trend
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-400">{maxPower}W</div>
            <div className="text-xs text-gray-400">Peak</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-400">{minPower}W</div>
            <div className="text-xs text-gray-400">Low</div>
          </div>
        </div>
      </div>

      {/* Interactive Timeline */}
      <div className="relative">
        {/* Time Labels */}
        <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
          {timelineData.map((data, i) => (
            <div
              key={i}
              className={`cursor-pointer transition-all duration-200 px-2 py-1 rounded-lg ${
                selectedTimeIndex === i 
                  ? 'bg-blue-500/20 text-blue-400 font-medium' 
                  : 'hover:text-white hover:bg-slate-700/50'
              }`}
              onClick={() => setSelectedTimeIndex(selectedTimeIndex === i ? null : i)}
            >
              {data.time.split(' ')[0]}
              <div className="text-xs opacity-60">{data.time.split(' ')[1]}</div>
            </div>
          ))}
        </div>

        {/* Power Visualization Bars */}
        <div className="flex justify-between items-end h-16 mb-4 px-2">
          {timelineData.map((data, i) => {
            const height = ((data.totalPower - minPower) / (maxPower - minPower)) * 100;
            return (
              <div
                key={i}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => setSelectedTimeIndex(selectedTimeIndex === i ? null : i)}
              >
                <div
                  className={`w-4 ${getStatusColor(data.status)} rounded-t-lg transition-all duration-300 group-hover:opacity-80 ${
                    selectedTimeIndex === i ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-800' : ''
                  }`}
                  style={{ height: `${Math.max(height, 10)}%` }}
                />
                <div className={`w-2 h-2 ${getStatusColor(data.status)} rounded-full mt-1 opacity-60`} />
              </div>
            );
          })}
        </div>

        {/* Status Line */}
        <div className="h-0.5 bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-purple-500/50 rounded-full" />
      </div>

      {/* Selected Time Details */}
      {selectedTimeIndex !== null && (
        <div className="mt-6 bg-slate-900/50 border border-slate-600/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 ${getStatusColor(timelineData[selectedTimeIndex].status)} rounded-full mr-3`} />
              <div>
                <div className="text-white font-semibold">
                  {timelineData[selectedTimeIndex].time}
                </div>
                <div className="text-gray-400 text-sm">
                  {timelineData[selectedTimeIndex].timestamp.toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {timelineData[selectedTimeIndex].totalPower}W
              </div>
              <div className="text-sm text-gray-400 capitalize">
                {timelineData[selectedTimeIndex].status} consumption
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center mt-6 space-x-6 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2" />
          <span className="text-gray-300">Normal (±20%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-400 rounded-full mr-2" />
          <span className="text-gray-300">High (+20%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-400 rounded-full mr-2" />
          <span className="text-gray-300">Low (-20%)</span>
        </div>
      </div>
    </div>
  );
};

export default TimeChart;
