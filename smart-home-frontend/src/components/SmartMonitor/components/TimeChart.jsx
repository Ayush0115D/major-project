import React from 'react';

const TimeChart = () => {
  const timeLabels = [
    '12:42 AM', '01:42 AM', '02:42 AM', '03:42 AM', '04:42 AM', '05:42 AM',
    '06:42 AM', '07:42 AM', '08:42 AM', '09:42 AM', '10:42 AM', '11:42 AM',
    '12:42 PM', '01:42 PM', '02:42 PM', '03:42 PM', '04:42 PM', '05:42 PM',
    '06:42 PM', '07:42 PM', '08:42 PM', '09:42 PM', '10:42 PM', '11:42 PM'
  ];

  return (
    <div className="mb-6 h-20 border-b border-gray-700">
      <div className="flex justify-between text-xs text-gray-400 pb-2 overflow-hidden">
        {timeLabels.map((time, i) => (
          <span key={i} className="whitespace-nowrap">{time}</span>
        ))}
      </div>
    </div>
  );
};

export default TimeChart;
