import React from 'react';
import { 
  Shield, 
  Zap, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Users, 
  Clock,
  Bell,
  Battery,
  Thermometer,
  Eye
} from 'lucide-react';

const DashboardView = ({ roomData, alerts }) => {
  const totalPower = Object.values(roomData).reduce((sum, room) => sum + room.power, 0);
  const roomsOnline = Object.values(roomData).filter(room => room.status !== 'OFFLINE').length;
  const criticalIssues = Object.values(roomData).filter(room => room.status === 'CRITICAL').length;
  const warningIssues = Object.values(roomData).filter(room => room.status === 'WARNING').length;
  const avgVoltage = Object.values(roomData).reduce((sum, room) => sum + room.voltage, 0) / 4;
  const avgCurrent = Object.values(roomData).reduce((sum, room) => sum + room.current, 0);
  const avgTemp = Object.values(roomData).reduce((sum, room) => sum + room.temp, 0) / 4;
  const efficiency = 97.9;

  const recentActivity = [
    { time: '12:45 PM', action: 'Kitchen power spike detected', type: 'warning' },
    { time: '12:30 PM', action: 'System diagnostic completed', type: 'info' },
    { time: '12:15 PM', action: 'Bathroom circuit alert resolved', type: 'success' },
    { time: '12:00 PM', action: 'Voltage fluctuation in Living Room', type: 'warning' },
    { time: '11:45 AM', action: 'AI learning pattern updated', type: 'info' }
  ];

  const roomNames = {
    livingRoom: 'Living Room',
    kitchen: 'Kitchen', 
    bedroom: 'Bedroom',
    bathroom: 'Bathroom'
  };

  return (
    <div className="p-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800/80 to-gray-800/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl mb-10">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mr-6 shadow-lg">
            <Shield className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
            Smart Hazard Indication 
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> & Electrical Line Detection</span>
            </h1>
            <p className="text-xl text-gray-300">System Overview & Status Dashboard</p>
          </div>
        </div>
        
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

      {/* System Overview Cards */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-sm border border-blue-500/30 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <Activity className="text-blue-400" size={28} />
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{totalPower}W</div>
              <div className="text-sm text-blue-400">Total Power</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">System-wide consumption</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 backdrop-blur-sm border border-green-500/30 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-green-400" size={28} />
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{roomsOnline}/4</div>
              <div className="text-sm text-green-400">Zones Online</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">Active monitoring zones</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 backdrop-blur-sm border border-yellow-500/30 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <Bell className="text-yellow-400" size={28} />
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{alerts.length}</div>
              <div className="text-sm text-yellow-400">Active Alerts</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">System notifications</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-sm border border-purple-500/30 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="text-purple-400" size={28} />
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{efficiency}%</div>
              <div className="text-sm text-purple-400">Efficiency</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">System performance</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-8 mb-10">
        {/* Power Distribution */}
        <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Battery className="mr-3 text-blue-400" size={24} />
            Power Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(roomData).map(([key, room], index) => {
              const colors = ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'];
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${colors[index]}`}></div>
                    <span className="text-gray-300 text-sm">{roomNames[key]}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white font-medium mr-2">{room.power}W</span>
                    <span className="text-gray-400 text-xs">({((room.power / totalPower) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
            <div className="border-t border-gray-600 pt-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Total</span>
                <span className="text-white font-bold">{totalPower}W</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Vital Signs */}
        <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Thermometer className="mr-3 text-red-400" size={24} />
            System Vital Signs
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-blue-400 mr-3" />
                <span className="text-gray-300 text-sm">Avg Voltage</span>
              </div>
              <span className="text-blue-400 font-medium">{avgVoltage.toFixed(1)}V</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-4 h-4 text-green-400 mr-3" />
                <span className="text-gray-300 text-sm">Total Current</span>
              </div>
              <span className="text-green-400 font-medium">{avgCurrent.toFixed(1)}A</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Thermometer className="w-4 h-4 text-orange-400 mr-3" />
                <span className="text-gray-300 text-sm">Avg Temperature</span>
              </div>
              <span className="text-orange-400 font-medium">{avgTemp.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="w-4 h-4 text-purple-400 mr-3" />
                <span className="text-gray-300 text-sm">Monitoring Status</span>
              </div>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Active</span>
            </div>
            <div className="border-t border-gray-600 pt-3 mt-4">
              <div className="text-xs text-gray-400">Last updated: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Clock className="mr-3 text-cyan-400" size={24} />
            Recent Activity
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'warning' ? 'bg-yellow-400' :
                  activity.type === 'success' ? 'bg-green-400' :
                  activity.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm leading-relaxed">{activity.action}</p>
                  <span className="text-gray-500 text-xs">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-600 pt-3 mt-4">
            <button className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors">
              View all activity →
            </button>
          </div>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <AlertTriangle className="mr-3 text-orange-400" size={24} />
          Alert Summary
        </h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-xl bg-red-500/10 mb-3 flex items-center justify-center">
              <div className="text-3xl font-bold text-red-400">{criticalIssues}</div>
            </div>
            <div className="text-white font-medium text-sm mb-1">Critical</div>
            <div className="text-red-400 text-xs">Immediate attention</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-xl bg-yellow-500/10 mb-3 flex items-center justify-center">
              <div className="text-3xl font-bold text-yellow-400">{warningIssues}</div>
            </div>
            <div className="text-white font-medium text-sm mb-1">Warning</div>
            <div className="text-yellow-400 text-xs">Monitor closely</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-xl bg-green-500/10 mb-3 flex items-center justify-center">
              <div className="text-3xl font-bold text-green-400">{4 - criticalIssues - warningIssues}</div>
            </div>
            <div className="text-white font-medium text-sm mb-1">Normal</div>
            <div className="text-green-400 text-xs">Operating well</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-xl bg-blue-500/10 mb-3 flex items-center justify-center">
              <div className="text-3xl font-bold text-blue-400">{alerts.length}</div>
            </div>
            <div className="text-white font-medium text-sm mb-1">Total Alerts</div>
            <div className="text-blue-400 text-xs">All notifications</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;