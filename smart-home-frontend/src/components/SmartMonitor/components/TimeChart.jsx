import React from 'react';

const TimeChart = () => {
  const timeLabels = [
    '12:42 AM', '01:42 AM', '02:42 AM', '03:42 AM', '04:42 AM', '05:42 AM',
    '06:42 AM', '07:42 AM', '08:42 AM', '09:42 AM', '10:42 AM', '11:42 AM',
    '12:42 PM', '01:42 PM', '02:42 PM', '03:42 PM', '04:42 PM', '05:42 PM',
    '06:42 PM', '07:42 PM', '08:42 PM', '09:42 PM', '10:42 PM', '11:42 PM'
  ];

  return (
    <div className="mb-10 h-16 border-b border-slate-700/50 relative">
      <div className="flex justify-between text-xs text-gray-400 pb-4 overflow-hidden">
        {timeLabels.map((time, i) => (
          <span key={i} className="whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-300">
            {time}
          </span>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-blue-500/50"></div>
    </div>
  );
};

export default TimeChart;
