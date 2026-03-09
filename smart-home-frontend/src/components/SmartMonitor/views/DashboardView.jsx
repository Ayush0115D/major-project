import React from 'react';
import { Home } from "lucide-react"; 

// Short Circuit Alert Component
const ShortCircuitAlertDashboard = ({ alerts, roomData }) => {
  const livingRoom = roomData["living-room"];
  const shortCircuitAlert = alerts.find(
    (a) => (a.type === 'short-circuit' || a.message.includes('Short circuit')) && a.status === 'active'
  );
  
  const hasShortCircuit = !!shortCircuitAlert;
  const allLoadsTripped = livingRoom.components.every(c => c.fault || c.status === 'off');

  if (!hasShortCircuit) {
    // Normal state display
    return (
      <div className="flex flex-col items-center py-8">
        <div className="w-16 h-16 flex items-center justify-center bg-green-500/15 rounded-full mb-4 shadow-md animate-pulse">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-300 text-lg font-medium mb-2">No short circuit alerts</p>
        <div className="text-sm text-gray-500 space-y-1 text-center">
          <div>✓ Pin 32: Normal (HIGH)</div>
          <div>✓ All circuits protected</div>
          <div>✓ System monitoring active</div>
        </div>
      </div>
    );
  }

  // Alert state display
  return (
    <div className="space-y-4">
      {/* Critical Alert Banner */}
      <div className="bg-red-500/30 border border-red-400 rounded-lg p-4 animate-pulse">
        <div className="flex items-start gap-3">
          <span className="text-3xl">⚡</span>
          <div className="flex-1">
            <h4 className="font-bold text-red-200 text-lg mb-1">CRITICAL: Short Circuit!</h4>
            <p className="text-red-300 text-sm mb-2">
              {shortCircuitAlert?.message || 'Short circuit detected on main circuit'}
            </p>
            <div className="text-xs text-red-200 bg-red-900/50 rounded px-2 py-1 inline-block">
              {shortCircuitAlert?.timestamp || new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-900/30 border border-red-600 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Pin State</div>
          <div className="font-bold text-red-400">LOW (0V)</div>
          <div className="text-xs text-gray-500 mt-1">Shorted to GND</div>
        </div>
        
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">All Relays</div>
          <div className="font-bold text-yellow-400">OPEN</div>
          <div className="text-xs text-gray-500 mt-1">Safety Tripped</div>
        </div>
      </div>

      {/* Load Status */}
      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
        <div className="text-xs font-semibold text-gray-300 mb-2">⚡ Load Status</div>
        <div className="grid grid-cols-3 gap-2">
          {livingRoom.components.map((component, index) => (
            <div key={component.id} className="text-center bg-red-900/20 border border-red-600 rounded p-2">
              <div className="text-xs text-gray-400">{component.name}</div>
              <div className="text-lg font-bold text-red-400">⚠️</div>
              <div className="text-xs text-gray-500">OPEN</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Steps */}
      <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3">
        <div className="text-xs font-semibold text-yellow-400 mb-2">⚠️ Action Required</div>
        <ol className="text-xs text-yellow-200 space-y-1 list-decimal list-inside">
          <li>Disconnect power immediately</li>
          <li>Identify short circuit source</li>
          <li>Reset ESP32 controller</li>
        </ol>
      </div>
    </div>
  );
};

// Overload Alert Component
const OverloadAlertDashboard = ({ alerts, roomData }) => {
  const livingRoom = roomData["living-room"];
  const overloadAlerts = alerts.filter(
    (a) => a.type === 'overload' && a.status === 'active'
  );

  const hasOverload = overloadAlerts.length > 0;
  const SAFE_LIMIT = 1500; // Watts

  if (!hasOverload) {
    // Normal state display
    return (
      <div className="flex flex-col items-center py-8">
        <div className="w-16 h-16 flex items-center justify-center bg-green-500/15 rounded-full mb-4 shadow-md animate-pulse">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-300 text-lg font-medium mb-2">No overload alerts</p>
        <div className="text-sm text-gray-500 space-y-1 text-center">
          <div>✓ All loads within limits</div>
          <div>✓ Safe limit: {SAFE_LIMIT}W per load</div>
          <div>✓ Relays operational</div>
        </div>
      </div>
    );
  }

  // Alert state display
  return (
    <div className="space-y-4">
      {/* Overload Alerts */}
      {overloadAlerts.slice(0, 3).map(alert => (
        <div key={alert.id} className="bg-yellow-900/30 border border-yellow-500/50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <div className="font-bold text-yellow-300 mb-1">{alert.component}</div>
              <div className="text-sm text-yellow-400 mb-2">{alert.message}</div>
              <div className="text-xs text-gray-400">{alert.timestamp}</div>
              
              {/* Technical Data */}
              {alert.technicalData && (
                <div className="mt-2 bg-yellow-900/20 rounded px-2 py-1">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Power:</span>
                      <div className="font-medium text-yellow-300">{alert.technicalData.power}W</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Current:</span>
                      <div className="font-medium text-yellow-300">{alert.technicalData.current}A</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Voltage:</span>
                      <div className="font-medium text-yellow-300">{alert.technicalData.voltage}V</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Affected Loads Summary */}
      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
        <div className="text-xs font-semibold text-gray-300 mb-2">⚡ Affected Loads</div>
        <div className="grid grid-cols-3 gap-2">
          {livingRoom.components.map((component) => {
            const isAffected = component.fault;
            return (
              <div 
                key={component.id} 
                className={`text-center rounded p-2 border ${
                  isAffected 
                    ? 'bg-yellow-900/20 border-yellow-600' 
                    : 'bg-gray-800 border-gray-600'
                }`}
              >
                <div className="text-xs text-gray-400">{component.name}</div>
                <div className={`text-lg font-bold ${isAffected ? 'text-yellow-400' : 'text-green-400'}`}>
                  {isAffected ? '⚠️' : '✓'}
                </div>
                <div className="text-xs text-gray-500">
                  {isAffected ? 'TRIPPED' : 'OK'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Info */}
      <div className="bg-blue-900/10 border border-blue-500/30 rounded-lg p-3">
        <div className="text-xs font-semibold text-blue-400 mb-2">🛡️ Safety Response</div>
        <div className="text-xs text-blue-300 space-y-1">
          <div>• Affected relays opened automatically</div>
          <div>• Buzzer alert sounded for 1 second</div>
          <div>• Safe limit: {SAFE_LIMIT}W per load</div>
        </div>
      </div>
    </div>
  );
};

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
              <p className="text-sm opacity-90">Power consumption</p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-green-800 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">System Health</h3>
              <p className="text-3xl font-bold">{systemStats?.systemHealth || 100}%</p>
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
                {systemStats?.activeComponents || room?.components?.filter(c => c.status === 'on').length || 0}/
                {systemStats?.totalComponents || room?.components?.length || 0}
              </p>
              <p className="text-sm opacity-90">Active/Total</p>
            </div>
            <div className="text-4xl">🔌</div>
          </div>
        </div>
      </div>

      {/* INTEGRATED ALERT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Short Circuit Alerts with Component */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            ⚡ <span>Short Circuit Protection</span>
          </h3>
          <ShortCircuitAlertDashboard alerts={alerts} roomData={roomData} />
        </div>

        {/* Overload Alerts with Component */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            ⚠️ <span>Overload Protection</span>
          </h3>
          <OverloadAlertDashboard alerts={alerts} roomData={roomData} />
        </div>
      </div>
<div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">

  {/* Title */}
  <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
    🛡️ <span>About SHIELD Smart Home Monitor</span>
  </h3>

  {/* Description */}
  <p className="text-gray-300 text-sm leading-relaxed mb-6">
    SHIELD is an IoT-based smart electrical safety system designed to monitor
    household power usage and protect appliances from electrical hazards such as
    overloads and short circuits. The system integrates hardware monitoring with
    a full-stack web dashboard to provide real-time insights, alerts, and remote
    monitoring capabilities.
  </p>

  {/* Info Grid */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    {/* Hardware */}
    <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
      <h4 className="text-white font-semibold mb-2">🔌 Hardware</h4>
      <p className="text-xs text-gray-400 leading-relaxed">
        Powered by an <span className="text-blue-400">ESP32 microcontroller</span>
        which monitors electrical parameters such as voltage, current, and power
        usage. It detects abnormal conditions and triggers safety actions.
      </p>
    </div>

    {/* Web Dashboard */}
    <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
      <h4 className="text-white font-semibold mb-2">💻 Web Dashboard</h4>
      <p className="text-xs text-gray-400 leading-relaxed">
        This dashboard is built using a <span className="text-cyan-400">full-stack
        technology stack</span> including React.js, Tailwind CSS, Node.js and
        Express.js. It allows users to monitor power usage, system health,
        alerts, and appliance status in real time.
      </p>
    </div>

    {/* Notifications */}
    <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
      <h4 className="text-white font-semibold mb-2">📧 Alert System</h4>
      <p className="text-xs text-gray-400 leading-relaxed">
        The system uses <span className="text-yellow-400">Nodemailer</span> to send
        automatic email notifications whenever a fault such as overload or short
        circuit is detected, ensuring users are informed immediately.
      </p>
    </div>

  </div>

  {/* Feature List */}
  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">

    <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
      <div className="text-lg">⚡</div>
      <div className="text-xs text-gray-300 mt-1">Real-time Monitoring</div>
    </div>

    <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
      <div className="text-lg">🔥</div>
      <div className="text-xs text-gray-300 mt-1">Short Circuit Protection</div>
    </div>

    <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
      <div className="text-lg">🚨</div>
      <div className="text-xs text-gray-300 mt-1">Overload Detection</div>
    </div>

    <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
      <div className="text-lg">📊</div>
      <div className="text-xs text-gray-300 mt-1">Smart Dashboard</div>
    </div>

  </div>

  {/* Footer */}
  <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between text-xs text-gray-400">
    <span>IoT Based Electrical Safety Monitoring System</span>

  </div>

</div>
    </div>
  );
};

export default DashboardView;