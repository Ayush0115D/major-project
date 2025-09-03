import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Zap, Download, Maximize2 } from 'lucide-react';

const Analytics24Chart = ({ powerData, totalPower }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Generate 24-hour data
    const generate24HourData = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
        const hour = time.getHours();
        
        // Simulate realistic power consumption patterns
        let basePower = 4000;
        if (hour >= 6 && hour <= 9) basePower = 6500; // Morning peak
        else if (hour >= 18 && hour <= 22) basePower = 7200; // Evening peak
        else if (hour >= 0 && hour <= 6) basePower = 3200; // Night low
        
        const variation = (Math.random() - 0.5) * 800;
        const power = Math.max(2800, basePower + variation);
        
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          hour: time.getHours(),
          power: Math.round(power),
          voltage: 220 + (Math.random() - 0.5) * 20,
          current: (power / 220) + (Math.random() - 0.5) * 2
        });
      }
      return data;
    };

    setChartData(generate24HourData());
  }, []);

  const minPower = Math.min(...chartData.map(d => d.power));
  const maxPower = Math.max(...chartData.map(d => d.power));
  const powerRange = maxPower - minPower || 1;
  const avgPower = chartData.reduce((sum, d) => sum + d.power, 0) / chartData.length;
  const trend = chartData.length > 1 ? chartData[chartData.length - 1].power - chartData[0].power : 0;

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/60 backdrop-blur-lg border border-slate-700/50 p-8 rounded-3xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">24-Hour Power Analytics</h3>
          <p className="text-gray-400">Real-time consumption trends and patterns</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {avgPower.toFixed(0)}W
            </div>
            <div className="text-sm text-gray-400 flex items-center">
              {trend > 0 ? (
                <TrendingUp className="mr-1 text-green-400" size={16} />
              ) : (
                <TrendingDown className="mr-1 text-red-400" size={16} />
              )}
              24H AVERAGE
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 transition-all duration-300">
              <Download className="text-gray-400 hover:text-white" size={20} />
            </button>
            <button className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 transition-all duration-300">
              <Maximize2 className="text-gray-400 hover:text-white" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <Activity className="text-blue-400" size={20} />
            <span className="text-blue-400 text-sm font-medium">Current</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalPower}W</div>
          <div className="text-xs text-gray-400">Live consumption</div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-green-400" size={20} />
            <span className="text-green-400 text-sm font-medium">Peak</span>
          </div>
          <div className="text-2xl font-bold text-white">{maxPower.toFixed(0)}W</div>
          <div className="text-xs text-gray-400">24h maximum</div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="text-purple-400" size={20} />
            <span className="text-purple-400 text-sm font-medium">Low</span>
          </div>
          <div className="text-2xl font-bold text-white">{minPower.toFixed(0)}W</div>
          <div className="text-xs text-gray-400">24h minimum</div>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <Zap className="text-orange-400" size={20} />
            <span className="text-orange-400 text-sm font-medium">Total</span>
          </div>
          <div className="text-2xl font-bold text-white">{(avgPower * 24 / 1000).toFixed(1)}kWh</div>
          <div className="text-xs text-gray-400">24h consumption</div>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="relative h-80 bg-slate-900/50 rounded-2xl p-6">
        {/* Chart Grid */}
        <div className="absolute inset-6 grid grid-rows-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-slate-600/30 last:border-b-0"></div>
          ))}
        </div>
        
        {/* Vertical Grid Lines */}
        <div className="absolute inset-6 grid grid-cols-12">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-r border-slate-600/20 last:border-r-0"></div>
          ))}
        </div>
        
        {/* Chart SVG */}
        <svg className="absolute inset-6 w-full h-full" style={{ width: 'calc(100% - 3rem)', height: 'calc(100% - 3rem)' }}>
          <defs>
            <linearGradient id="powerGradient24" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="areaGradient24" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
            <filter id="glow24">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Area under the curve */}
          <polygon
            points={`0,100% ${chartData.map((point, index) => 
              `${(index / (chartData.length - 1)) * 100}%,${100 - ((point.power - minPower) / powerRange) * 80}%`
            ).join(' ')} 100%,100%`}
            fill="url(#areaGradient24)"
          />
          
          {/* Main line */}
          <polyline
            points={chartData.map((point, index) => 
              `${(index / (chartData.length - 1)) * 100}%,${100 - ((point.power - minPower) / powerRange) * 80}%`
            ).join(' ')}
            fill="none"
            stroke="url(#powerGradient24)"
            strokeWidth="3"
            filter="url(#glow24)"
            className="drop-shadow-2xl"
          />
          
          {/* Data points */}
          {chartData.map((point, index) => (
            <g key={index}>
              <circle
                cx={`${(index / (chartData.length - 1)) * 100}%`}
                cy={`${100 - ((point.power - minPower) / powerRange) * 80}%`}
                r={hoveredPoint === index ? "6" : "4"}
                fill="url(#powerGradient24)"
                stroke="#1e293b"
                strokeWidth="2"
                className="hover:stroke-cyan-400 transition-all duration-300 cursor-pointer drop-shadow-lg"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {hoveredPoint === index && (
                <g>
                  {/* Tooltip */}
                  <rect
                    x={`${(index / (chartData.length - 1)) * 100 - 20}%`}
                    y={`${100 - ((point.power - minPower) / powerRange) * 80 - 20}%`}
                    width="80"
                    height="35"
                    fill="rgba(30, 41, 59, 0.95)"
                    stroke="url(#powerGradient24)"
                    strokeWidth="1"
                    rx="8"
                    className="drop-shadow-lg"
                  />
                  <text
                    x={`${(index / (chartData.length - 1)) * 100}%`}
                    y={`${100 - ((point.power - minPower) / powerRange) * 80 - 10}%`}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white"
                  >
                    {point.time}
                  </text>
                  <text
                    x={`${(index / (chartData.length - 1)) * 100}%`}
                    y={`${100 - ((point.power - minPower) / powerRange) * 80 + 2}%`}
                    textAnchor="middle"
                    className="text-xs font-bold fill-cyan-400"
                  >
                    {point.power}W
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-6 bottom-6 flex flex-col justify-between text-xs text-gray-400 -ml-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="bg-slate-800/80 px-2 py-1 rounded-lg backdrop-blur-sm">
              {Math.round(maxPower - (i * powerRange / 4))}W
            </span>
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-6 right-6 flex justify-between text-xs text-gray-400 -mb-6">
          {chartData.filter((_, i) => i % 4 === 0).map(point => (
            <span key={point.time} className="bg-slate-800/80 px-2 py-1 rounded-lg backdrop-blur-sm">
              {point.time}
            </span>
          ))}
        </div>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center mt-6 space-x-8 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-2"></div>
          <span className="text-gray-300">Power Consumption</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mr-2"></div>
          <span className="text-gray-300">Trend Analysis</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics24Chart;