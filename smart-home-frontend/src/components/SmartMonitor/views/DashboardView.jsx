import React from 'react';
import { Home } from "lucide-react"; 

const DashboardView = ({ roomData, alerts, systemStats }) => {
  const room = roomData['living-room'];
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const shortCircuitAlerts = activeAlerts.filter(a => a.type === 'short-circuit');
  const overloadAlerts = activeAlerts.filter(a => a.type === 'overload');
return (
    <div className="p-8 space-y-6">
      {/* Dashboard Heading */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-slate-200 drop-shadow-sm">
          <Home className="text-blue-400" size={32} />
          <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent">
            Smart Home Dashboard
          </span>
        </h1>
        <span className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </span>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Power</h3>
              <p className="text-3xl font-bold">{systemStats?.totalPower || room?.powerConsumption || 0}W</p>
              <p className="text-sm opacity-90">Live consumption</p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-green-800 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">System Health</h3>
              <p className="text-3xl font-bold">{systemStats?.systemHealth || 85}%</p>
              <p className="text-sm opacity-90">Overall status</p>
            </div>
            <div className="text-4xl">💚</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-700 to-red-800 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Active Alerts</h3>
              <p className="text-3xl font-bold">{activeAlerts.length}</p>
              <p className="text-sm opacity-90">Requires attention</p>
            </div>
            <div className="text-4xl">🚨</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-700 to-purple-800 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Components</h3>
              <p className="text-3xl font-bold">
                {systemStats?.activeComponents || room?.components?.filter(c => c.status === 'on' || c.status === 'in-use').length || 0}/
                {systemStats?.totalComponents || room?.components?.length || 0}
              </p>
              <p className="text-sm opacity-90">Active/Total</p>
            </div>
            <div className="text-4xl">🔌</div>
          </div>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            ⚡ <span>Short Circuit Alerts</span>
          </h3>
          {shortCircuitAlerts.length > 0 ? (
            <div className="space-y-3">
              {shortCircuitAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="bg-red-900/30 border border-red-500/30 p-3 rounded-lg">
                  <div className="font-medium text-red-300">{alert.component}</div>
                  <div className="text-sm text-red-400">{alert.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{alert.timestamp}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-gray-400">No short circuit alerts</p>
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            ⚠️ <span>Overload Alerts</span>
          </h3>
          {overloadAlerts.length > 0 ? (
            <div className="space-y-3">
              {overloadAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="bg-yellow-900/30 border border-yellow-500/30 p-3 rounded-lg">
                  <div className="font-medium text-yellow-300">{alert.component}</div>
                  <div className="text-sm text-yellow-400">{alert.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{alert.timestamp}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-gray-400">No overload alerts</p>
            </div>
          )}
        </div>
      </div>

      {/* Room Status */}
      <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
        <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
          🛋️ <span>Living Room Status</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{room?.temperature || 24}°C</div>
            <div className="text-sm text-gray-400">Temperature</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{room?.humidity || 45}%</div>
            <div className="text-sm text-gray-400">Humidity</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{room?.powerConsumption || 0}W</div>
            <div className="text-sm text-gray-400">Power Usage</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              room?.status === 'normal' ? 'text-green-400' :
              room?.status === 'overload' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {room?.status?.toUpperCase() || 'NORMAL'}
            </div>
            <div className="text-sm text-gray-400">Status</div>
          </div>
        </div>
      </div>

      {/* Component Overview */}
      {room?.components && (
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            🔧 <span>Component Overview</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {room.components.map((component) => (
              <div 
                key={component.id} 
                className={`bg-slate-700/50 p-4 rounded-lg border ${
                  component.status === 'short-circuit' ? 'border-red-500/50' :
                  component.status === 'on' ? 'border-green-500/50' :
                  'border-slate-600'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-white">{component.name}</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    component.status === 'on' ? 'bg-green-500/20 text-green-300' :
                    component.status === 'off' ? 'bg-gray-500/20 text-gray-300' :
                    component.status === 'in-use' ? 'bg-blue-500/20 text-blue-300' :
                    component.status === 'short-circuit' ? 'bg-red-500/20 text-red-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {component.status.toUpperCase()}
                  </div>
                </div>
                <div className="text-sm text-gray-400 mb-1">
                  {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
                </div>
                <div className="text-sm text-gray-300">
                  {component.power}W • {component.current}A
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
