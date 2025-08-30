import React from 'react';
import HomeLayoutMonitor from '../components/HomeLayoutMonitor';
import TimeChart from '../components/TimeChart';

const DashboardView = ({ roomData }) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">House Layout Monitor</h2>
        <p className="text-gray-400">Interactive visual representation of all monitored zones</p>
      </div>
      
      <TimeChart />
      <HomeLayoutMonitor roomData={roomData} />
    </div>
  );
};

export default DashboardView;