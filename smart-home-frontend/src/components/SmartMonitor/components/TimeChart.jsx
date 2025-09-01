import React from 'react';

const TimeChart = () => {
  const timeLabels = [
    '12:00 AM', '02:00 AM', '04:00 AM', '06:00 AM', '08:00 AM', '10:00 AM',
    '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM', '10:00 PM'
  ];

  return (
    <div className="mb-10 h-12 border-b border-slate-700/50 relative">
      <div className="flex justify-between items-center text-sm text-gray-400 pb-4">
        {timeLabels.map((time, i) => (
          <span key={i} className="text-xs opacity-70 hover:opacity-100 transition-opacity duration-300">
            {time}
          </span>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-blue-500/50"></div>
    </div>
  );
};

export default TimeChart;