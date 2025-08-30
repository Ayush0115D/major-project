import React, { useState } from 'react';
import { TrendingUp, Download, Maximize2 } from 'lucide-react';

const PowerChart = ({ powerData, totalPower }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  const minPower = Math.min(...powerData.map(d => d.power));
  const maxPower = Math.max(...powerData.map(d => d.power));
  const powerRange = maxPower - minPower || 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Power Consumption Analytics</h3>
          <p className="text-gray-400 text-lg">24-hour power usage trends across all monitored zones</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {totalPower}W
            </div>
            <div className="text-sm text-gray-400 flex items-center">
              <TrendingUp className="mr-1" size={16} />
              CURRENT TOTAL
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 transition-all duration-300">
              <Download className="text-gray-400" size={20} />
            </button>
            <button className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 transition-all duration-300">
              <Maximize2 className="text-gray-400" size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/60 backdrop-blur-lg border border-slate-700/50 p-8 rounded-3xl shadow-2xl">
        <div className="relative h-80">
          {/* Chart Grid */}
          <div className="absolute inset-0 grid grid-rows-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-slate-600/30 last:border-b-0"></div>
            ))}
          </div>
          
          {/* Vertical Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-12">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border-r border-slate-600/20 last:border-r-0"></div>
            ))}
          </div>
          
          {/* Chart SVG */}
          <svg className="absolute inset-4 w-full h-full" style={{ width: 'calc(100% - 2rem)', height: 'calc(100% - 2rem)' }}>
            <defs>
              <linearGradient id="powerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Area under the curve */}
            <polygon
              points={`0,100% ${powerData.map((point, index) => 
                `${(index / (powerData.length - 1)) * 100}%,${100 - ((point.power - minPower) / powerRange) * 80}%`
              ).join(' ')} 100%,100%`}
              fill="url(#powerGradient)"
              className="animate-pulse-slow"
            />
            
            {/* Main line */}
            <polyline
              points={powerData.map((point, index) => 
                `${(index / (powerData.length - 1)) * 100}%,${100 - ((point.power - minPower) / powerRange) * 80}%`
              ).join(' ')}
              fill="none"
              stroke="url(#powerGradient)"
              strokeWidth="4"
              filter="url(#glow)"
              className="drop-shadow-2xl"
            />
            
            {/* Data points */}
            {powerData.map((point, index) => (
              <g key={index}>
                <circle
                  cx={`${(index / (powerData.length - 1)) * 100}%`}
                  cy={`${100 - ((point.power - minPower) / powerRange) * 80}%`}
                  r={hoveredPoint === index ? "8" : "6"}
                  fill="#1e293b"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  className="drop-shadow-lg hover:stroke-cyan-400 transition-all duration-300 cursor-pointer"
                  filter="url(#glow)"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {hoveredPoint === index && (
                  <g>
                    {/* Tooltip background */}
                    <rect
                      x={`${(index / (powerData.length - 1)) * 100 - 15}%`}
                      y={`${100 - ((point.power - minPower) / powerRange) * 80 - 15}%`}
                      width="60"
                      height="25"
                      fill="rgba(30, 41, 59, 0.95)"
                      stroke="#3b82f6"
                      strokeWidth="1"
                      rx="8"
                      className="drop-shadow-lg"
                    />
                    {/* Tooltip text */}
                    <text
                      x={`${(index / (powerData.length - 1)) * 100}%`}
                      y={`${100 - ((point.power - minPower) / powerRange) * 80 - 5}%`}
                      textAnchor="middle"
                      className="text-xs font-semibold fill-white"
                    >
                      {point.power}W
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-gray-400 py-6 -ml-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="bg-slate-800/80 px-2 py-1 rounded-lg backdrop-blur-sm">
                {Math.round(maxPower - (i * powerRange / 4))}W
              </span>
            ))}
          </div>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-8 right-8 flex justify-between text-sm text-gray-400 -mb-8">
            {powerData.filter((_, i) => i % 3 === 0).map(point => (
              <span key={point.time} className="bg-slate-800/80 px-3 py-2 rounded-lg backdrop-blur-sm">
                {point.time}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerChart;