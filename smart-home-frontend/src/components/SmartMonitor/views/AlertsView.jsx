import React from 'react';
import SystemAlerts from '../components/SystemAlerts';
import CriticalAlertBanner from '../components/CriticalAlertBanner';
import { AlertTriangle, Shield, Bell, Activity } from 'lucide-react';

const AlertsView = ({ alerts, roomData }) => {
  const criticalIssues = Object.values(roomData).filter(room => room.status === 'CRITICAL').length;
  const warningIssues = Object.values(roomData).filter(room => room.status === 'WARNING').length;
  const normalRooms = Object.values(roomData).filter(room => room.status === 'NORMAL').length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mr-4 shadow-lg">
            <Bell className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">System Alerts & Notifications</h1>
            <p className="text-gray-400 text-lg">Monitor and manage all system alerts and warnings</p>
          </div>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-gradient-to-br from-red-500/10 to-rose-500/5 backdrop-blur-sm border border-red-500/30 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-semibold tracking-wider">CRITICAL ALERTS</span>
            <div className="p-3 bg-red-500/20 rounded-xl">
              <AlertTriangle className="text-red-400" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-red-400">{criticalIssues}</div>
          <div className="text-sm text-gray-400 mt-2">Require immediate attention</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 backdrop-blur-sm border border-yellow-500/30 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-semibold tracking-wider">WARNING ALERTS</span>
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <AlertTriangle className="text-yellow-400" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-yellow-400">{warningIssues}</div>
          <div className="text-sm text-gray-400 mt-2">Monitor closely</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 backdrop-blur-sm border border-green-500/30 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-semibold tracking-wider">NORMAL STATUS</span>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Shield className="text-green-400" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-green-400">{normalRooms}</div>
          <div className="text-sm text-gray-400 mt-2">Operating normally</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-sm border border-blue-500/30 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-semibold tracking-wider">TOTAL ALERTS</span>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Activity className="text-blue-400" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-400">{alerts.length}</div>
          <div className="text-sm text-gray-400 mt-2">Active notifications</div>
        </div>
      </div>

      {/* Critical Alert Banner */}
      <CriticalAlertBanner criticalIssues={criticalIssues} />

      {/* System Alerts Component */}
      <div className="grid grid-cols-1 gap-8">
        <SystemAlerts alerts={alerts} />
      </div>

      {/* Quick Actions */}
      <div className="mt-10 grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl">
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 p-3 rounded-xl text-blue-400 font-medium transition-all duration-300">
              Acknowledge All Alerts
            </button>
            <button className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 p-3 rounded-xl text-green-400 font-medium transition-all duration-300">
              Run System Check
            </button>
            <button className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 p-3 rounded-xl text-purple-400 font-medium transition-all duration-300">
              Export Alert Log
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl">
          <h3 className="text-white font-semibold mb-4">Alert Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Email Notifications</span>
              <div className="w-12 h-6 bg-green-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">SMS Alerts</span>
              <div className="w-12 h-6 bg-green-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Push Notifications</span>
              <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl">
          <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span>System check completed</span>
            </div>
            <div className="flex items-center text-gray-300">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <span>Kitchen alert acknowledged</span>
            </div>
            <div className="flex items-center text-gray-300">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
              <span>Bathroom critical alert triggered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsView;
