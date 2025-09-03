import React from 'react';
import HomeLayoutMonitor from '../components/HomeLayoutMonitor';
import TimeChart from '../components/TimeChart';
import { Activity, Wifi, AlertTriangle } from 'lucide-react';

const MonitoringView = ({ roomData }) => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mr-4 shadow-lg">
            <Activity className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Live Monitoring</h1>
            <p className="text-gray-400 text-lg">Real-time electrical monitoring and zone status</p>
          </div>
        </div>
        
        {/* Live Status Indicators */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <Wifi className="text-green-400 mr-2" size={16} />
            <span className="text-green-400 font-medium">Live Data Stream</span>
          </div>
          <div className="flex items-center bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full">
            <Activity className="text-blue-400 mr-2" size={16} />
            <span className="text-blue-400 font-medium">Real-time Updates</span>
          </div>
          <div className="flex items-center bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full">
            <AlertTriangle className="text-purple-400 mr-2" size={16} />
            <span className="text-purple-400 font-medium">Instant Fault Detection</span>
          </div>
        </div>
      </div>

      {/* Interactive Timeline */}
      <TimeChart roomData={roomData} />

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">House Layout Monitor</h2>
        <p className="text-gray-400 text-lg">Interactive visual representation of all monitored zones</p>
      </div>
      
      <HomeLayoutMonitor roomData={roomData} />
    </div>
  );
};

export default MonitoringView;