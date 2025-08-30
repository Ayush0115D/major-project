import React from 'react';
import HomeLayoutMonitor from '../components/HomeLayoutMonitor';
import TimeChart from '../components/TimeChart';
import { Shield, Zap, AlertTriangle } from 'lucide-react';

const DashboardView = ({ roomData }) => {
  return (
    <div className="p-8">
      {/* Hero Section */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-slate-800/80 to-gray-800/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mr-6 shadow-lg">
              <Shield className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Smart Short Circuit Detection 
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> & Safety System</span>
              </h1>
              <p className="text-xl text-gray-300">Real-time electrical monitoring and intelligent fault detection</p>
            </div>
          </div>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
              <Zap className="text-green-400 mr-2" size={16} />
              <span className="text-green-400 font-medium">AI-Powered Detection</span>
            </div>
            <div className="flex items-center bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full">
              <Shield className="text-blue-400 mr-2" size={16} />
              <span className="text-blue-400 font-medium">24/7 Protection</span>
            </div>
            <div className="flex items-center bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full">
              <AlertTriangle className="text-purple-400 mr-2" size={16} />
              <span className="text-purple-400 font-medium">Instant Alerts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">House Layout Monitor</h2>
        <p className="text-gray-400 text-lg">Interactive visual representation of all monitored zones</p>
      </div>
      
      <TimeChart />
      <HomeLayoutMonitor roomData={roomData} />
    </div>
  );
};

export default DashboardView;