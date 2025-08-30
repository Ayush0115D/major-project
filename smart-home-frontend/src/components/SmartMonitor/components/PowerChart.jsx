import React from 'react';

const PowerChart = ({ powerData, totalPower }) => {
  const minPower = Math.min(...powerData.map(d => d.power));
  const maxPower = Math.max(...powerData.map(d => d.power));
  const powerRange = maxPower - minPower;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">Power Consumption Analytics</h3>
          <p className="text-gray-400">24-hour power usage trends across all monitored zones</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-400">{totalPower}W</div>
          <div className="text-sm text-gray-400">CURRENT TOTAL</div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="relative h-64">
          {/* Chart Grid */}
          <div className="absolute inset-0 grid grid-rows-5 border-gray-700">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-gray-700 last:border-b-0"></div>
            ))}
          </div>
          
          {/* Chart Line */}
          <svg className="absolute inset-4 w-full h-full" style={{ width: 'calc(100% - 2rem)', height: 'calc(100% - 2rem)' }}>
            <defs>
              <linearGradient id="powerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Area under the curve */}
            <polygon
              points={`0,100% ${powerData.map((point, index) => 
                `${(index / (powerData.length - 1)) * 100}%,${100 - ((point.power - minPower) / powerRange) * 80}%`
              ).join(' ')} 100%,100%`}
              fill="url(#powerGradient)"
            />
            
            {/* Main line */}
            <polyline
              points={powerData.map((point, index) => 
                `${(index / (powerData.length - 1)) * 100}%,${100 - ((point.power - minPower) / powerRange) * 80}%`
              ).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              className="drop-shadow-lg"
            />
            
            {/* Data points */}
            {powerData.map((point, index) => (
              <g key={index}>
                <circle
                  cx={`${(index / (powerData.length - 1)) * 100}%`}
                  cy={`${100 - ((point.power - minPower) / powerRange) * 80}%`}
                  r="4"
                  fill="#1f2937"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  className="drop-shadow-lg hover:r-6 transition-all cursor-pointer"
                />
                {/* Hover tooltip */}
                <title>{`${point.time}: ${point.power}W`}</title>
              </g>
            ))}
          </svg>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-4">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {Math.round(maxPower - (i * powerRange / 4))}W
              </span>
            ))}
          </div>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-8 right-8 flex justify-between text-xs text-gray-400">
            {powerData.filter((_, i) => i % 3 === 0).map(point => (
              <span key={point.time}>{point.time}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerChart;