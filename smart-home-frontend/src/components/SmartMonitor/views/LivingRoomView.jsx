import React from "react";

const getStatusColor = (component) => {
  if (component.fault) {
    return "bg-red-900 text-red-200";
  }
  switch (component.status) {
    case "on":
      return "bg-green-900 text-green-200";
    case "off":
      return "bg-gray-800 text-gray-300";
    case "fault":
      return "bg-red-900 text-red-200";
    default:
      return "bg-gray-800 text-gray-300";
  }
};

const getComponentIcon = (type) => {
  switch (type) {
    case "lighting":
      return "💡";
    case "appliance":
      return "🌀";
    case "electronics":
      return "📺";
    case "hvac":
      return "❄️";
    case "outlet":
      return "🔌";
    default:
      return "⚡";
  }
};

const LivingRoomView = ({ roomData, alerts }) => {
  const livingRoom = roomData["living-room"];
  const activeAlerts = alerts.filter(
    (a) => a.location.includes("Living Room") && a.status === "active"
  );

  // Safe limits from ESP32 hardware
  const SAFE_LIMITS = {
    POWER: 1500,        // Watts - Safe power limit per load
    CURRENT: 15,        // Amperes - Maximum current per load
    VOLTAGE_MIN: 200,   // Volts - Minimum safe voltage
    VOLTAGE_MAX: 240,   // Volts - Maximum safe voltage
    TEMPERATURE: 45     // Celsius - Maximum safe temperature
  };

  // Check if any component has overload
  const hasOverload = livingRoom.components.some(c => c.fault);
  const shortCircuit = activeAlerts.some(a => a.type === 'short-circuit' || a.message.includes('Short circuit'));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">{livingRoom.name}</h1>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${shortCircuit ? 'bg-red-900/20 border-red-500' : 'bg-gray-800/50 border-gray-700'}`}>
          <div className="text-sm text-gray-400 mb-1">Circuit Status</div>
          <div className={`text-xl font-bold ${shortCircuit ? 'text-red-400' : 'text-green-400'}`}>
            {shortCircuit ? '⚠️ SHORT CIRCUIT' : '✓ Normal'}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border ${hasOverload ? 'bg-yellow-900/20 border-yellow-500' : 'bg-gray-800/50 border-gray-700'}`}>
          <div className="text-sm text-gray-400 mb-1">Load Status</div>
          <div className={`text-xl font-bold ${hasOverload ? 'text-yellow-400' : 'text-green-400'}`}>
            {hasOverload ? '⚠️ OVERLOAD' : '✓ Normal'}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Safe Power Limit</div>
          <div className="text-xl font-bold text-blue-400">
            {SAFE_LIMITS.POWER}W per load
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6">
          <h2 className="text-xl font-semibold text-red-400 mb-2">
            ⚠ Active Alerts
          </h2>
          <ul className="space-y-2 text-red-300">
            {activeAlerts.map((alert) => (
              <li key={alert.id}>
                • {alert.message}
                {alert.message.includes("Power consumption exceeds safe limits") && (
                  <p className="text-sm text-gray-400 mt-1">
                    [ ⚠️ SAFE LIMIT: {SAFE_LIMITS.POWER}W ]
                  </p>
                )}
                {alert.message.includes("Short circuit") && (
                  <p className="text-sm text-gray-400 mt-1">
                    [ 🚨 CRITICAL: All relays tripped for safety ]
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Safe Operating Limits Info */}
      <div className="bg-blue-900/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">⚙️ Safe Operating Limits</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Max Power:</span>
            <div className="font-medium text-blue-300">{SAFE_LIMITS.POWER}W</div>
          </div>
          <div>
            <span className="text-gray-400">Max Current:</span>
            <div className="font-medium text-blue-300">{SAFE_LIMITS.CURRENT}A</div>
          </div>
          <div>
            <span className="text-gray-400">Voltage Range:</span>
            <div className="font-medium text-blue-300">{SAFE_LIMITS.VOLTAGE_MIN}-{SAFE_LIMITS.VOLTAGE_MAX}V</div>
          </div>
          <div>
            <span className="text-gray-400">Max Temperature:</span>
            <div className="font-medium text-blue-300">{SAFE_LIMITS.TEMPERATURE}°C</div>
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <h2 className="text-2xl font-bold text-white mb-4">Load Components</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {livingRoom.components.map((component) => (
          <div
            key={component.id}
            className={`bg-gray-900 p-4 rounded-lg border shadow-sm transition hover:shadow-md ${
              component.fault
                ? "border-red-600 bg-red-900/10"
                : component.status === "on"
                ? "border-green-600"
                : "border-gray-700"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getComponentIcon(component.type)}</span>
                <div>
                  <div className="font-medium text-gray-200">{component.name}</div>
                  <div className="text-xs text-gray-500">{component.location}</div>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(component)}`}
              >
                {component.fault ? 'FAULT' : component.status.toUpperCase()}
              </div>
            </div>

            {/* Fault Message */}
            {component.fault && component.faultMessage && (
              <div className="bg-red-500/20 border border-red-500/50 rounded px-2 py-1 mb-3">
                <div className="text-xs font-semibold text-red-400">
                  🚨 {component.faultMessage}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-400 mb-3">
              Type: {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <span className="text-gray-500">Power:</span>
                <div className={`font-medium ${component.fault ? 'text-red-400' : 'text-gray-200'}`}>
                  {component.power}W
                </div>
                {component.power > SAFE_LIMITS.POWER && (
                  <div className="text-xs text-red-400">Exceeds {SAFE_LIMITS.POWER}W</div>
                )}
              </div>
              <div>
                <span className="text-gray-500">Current:</span>
                <div
                  className={`font-medium ${
                    component.fault ? "text-red-400" : "text-gray-200"
                  }`}
                >
                  {component.current}A
                </div>
                {parseFloat(component.current) > SAFE_LIMITS.CURRENT && (
                  <div className="text-xs text-red-400">Exceeds {SAFE_LIMITS.CURRENT}A</div>
                )}
              </div>
              <div>
                <span className="text-gray-500">Voltage:</span>
                <div className={`font-medium ${
                  component.voltage < SAFE_LIMITS.VOLTAGE_MIN || 
                  component.voltage > SAFE_LIMITS.VOLTAGE_MAX 
                    ? 'text-yellow-400' 
                    : 'text-gray-200'
                }`}>
                  {component.voltage}V
                </div>
              </div>
              <div>
                <span className="text-gray-500">Relay:</span>
                <div className={`font-medium ${component.fault ? 'text-red-400' : 'text-green-400'}`}>
                  {component.fault ? 'TRIPPED' : 'CLOSED'}
                </div>
              </div>
            </div>

            {/* Safety Status Indicator */}
            <div className={`text-xs px-2 py-1 rounded ${
              component.fault 
                ? 'bg-red-500/20 text-red-300' 
                : 'bg-green-500/20 text-green-300'
            }`}>
              {component.fault 
                ? '⚠️ Relay opened for safety' 
                : '✓ Operating within safe limits'}
            </div>
          </div>
        ))}
      </div>

      {/* Hardware Info */}
      <div className="mt-6 bg-gray-800/30 border border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Hardware Configuration</h3>
        <div className="text-xs text-gray-500 space-y-1">
          <div>• ESP32 monitors three separate loads via current sensors (Pins: 32, 33, 25, 26)</div>
          <div>• Each load protected by individual relay (Relays: Pin 5, 18, 19)</div>
          <div>• Short circuit detection via dedicated pin (Pin 32 - pulled down when shorted)</div>
          <div>• Buzzer alert sounds for 1 second when new fault detected (Pin 4)</div>
          <div>• Automatic relay trip on overload or short circuit detection</div>
        </div>
      </div>
    </div>
  );
};

export default LivingRoomView;