import React from "react";

const ShortCircuitAlert = ({ alerts, roomData }) => {
  const livingRoom = roomData["living-room"];
  
  // Check if there's an active short circuit
  const shortCircuitAlert = alerts.find(
    (a) => (a.type === 'short-circuit' || a.message.includes('Short circuit')) && a.status === 'active'
  );
  
  const hasShortCircuit = !!shortCircuitAlert;

  // Safe limits
  const SAFE_LIMITS = {
    VOLTAGE: 230,
    MAX_CURRENT: 15,
    MAX_POWER: 1500
  };

  // Get total circuit status
  const allLoadsTripped = livingRoom.components.every(c => c.fault || c.status === 'off');
  
  return (
    <div className={`rounded-xl border-2 p-6 transition-all ${
      hasShortCircuit 
        ? 'bg-red-950/40 border-red-500 shadow-lg shadow-red-500/20' 
        : 'bg-gray-800/50 border-gray-700'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
            hasShortCircuit 
              ? 'bg-red-500/20 animate-pulse' 
              : 'bg-green-500/20'
          }`}>
            {hasShortCircuit ? '⚡' : '🛡️'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Short Circuit Protection</h2>
            <p className="text-sm text-gray-400">ESP32 Pin 32 - Real-time Monitoring</p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
          hasShortCircuit 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-green-500/20 text-green-400'
        }`}>
          {hasShortCircuit ? '🚨 SHORT DETECTED' : '✓ NORMAL'}
        </div>
      </div>

      {/* Alert Banner */}
      {hasShortCircuit && (
        <div className="bg-red-500/30 border border-red-400 rounded-lg p-4 mb-4 animate-pulse">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-bold text-red-200 mb-1">CRITICAL: Short Circuit Detected!</h3>
              <p className="text-red-300 text-sm mb-2">
                {shortCircuitAlert?.message || 'Short circuit detected on main circuit'}
              </p>
              <div className="text-xs text-red-200 bg-red-900/50 rounded px-2 py-1 inline-block">
                Timestamp: {shortCircuitAlert?.timestamp || new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Circuit Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Detection Pin</div>
          <div className="font-bold text-blue-400">GPIO 32</div>
          <div className="text-xs text-gray-500 mt-1">INPUT_PULLUP</div>
        </div>
        
        <div className={`rounded-lg p-3 border ${
          hasShortCircuit 
            ? 'bg-red-900/30 border-red-600' 
            : 'bg-gray-900/50 border-gray-700'
        }`}>
          <div className="text-xs text-gray-400 mb-1">Pin State</div>
          <div className={`font-bold ${hasShortCircuit ? 'text-red-400' : 'text-green-400'}`}>
            {hasShortCircuit ? 'LOW (0V)' : 'HIGH (3.3V)'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {hasShortCircuit ? 'Shorted to GND' : 'Pull-up Active'}
          </div>
        </div>
        
        <div className={`rounded-lg p-3 border ${
          allLoadsTripped 
            ? 'bg-yellow-900/30 border-yellow-600' 
            : 'bg-gray-900/50 border-gray-700'
        }`}>
          <div className="text-xs text-gray-400 mb-1">All Relays</div>
          <div className={`font-bold ${allLoadsTripped ? 'text-yellow-400' : 'text-green-400'}`}>
            {allLoadsTripped ? 'OPEN' : 'ACTIVE'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Safety Response</div>
        </div>
        
        <div className={`rounded-lg p-3 border ${
          hasShortCircuit 
            ? 'bg-red-900/30 border-red-600' 
            : 'bg-gray-900/50 border-gray-700'
        }`}>
          <div className="text-xs text-gray-400 mb-1">Circuit Health</div>
          <div className={`font-bold ${hasShortCircuit ? 'text-red-400' : 'text-green-400'}`}>
            {hasShortCircuit ? '0%' : '100%'}
          </div>
          <div className="text-xs text-gray-500 mt-1">System Status</div>
        </div>
      </div>

      {/* Protection System Status */}
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 mb-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">🛡️ Protection System</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Short Circuit Detection:</span>
            <span className={`font-medium ${hasShortCircuit ? 'text-red-400' : 'text-green-400'}`}>
              {hasShortCircuit ? '⚠️ TRIGGERED' : '✓ Active'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Relay Protection:</span>
            <span className={`font-medium ${allLoadsTripped ? 'text-yellow-400' : 'text-green-400'}`}>
              {allLoadsTripped ? '⚠️ All Tripped' : '✓ Operational'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Buzzer Alert:</span>
            <span className={`font-medium ${hasShortCircuit ? 'text-red-400' : 'text-gray-400'}`}>
              {hasShortCircuit ? '🔊 SOUNDING' : '🔇 Silent'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">LCD Display:</span>
            <span className="font-medium text-blue-400">
              {hasShortCircuit ? '"Short circuit"' : '"System OK"'}
            </span>
          </div>
        </div>
      </div>

      {/* Load Status Indicator */}
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 mb-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">⚡ Load Status</h3>
        <div className="grid grid-cols-3 gap-3">
          {livingRoom.components.map((component, index) => (
            <div 
              key={component.id}
              className={`text-center p-3 rounded-lg border ${
                hasShortCircuit 
                  ? 'bg-red-900/20 border-red-600' 
                  : component.status === 'on'
                  ? 'bg-green-900/20 border-green-600'
                  : 'bg-gray-800 border-gray-600'
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">{component.name}</div>
              <div className={`text-lg font-bold ${
                hasShortCircuit 
                  ? 'text-red-400' 
                  : component.status === 'on'
                  ? 'text-green-400'
                  : 'text-gray-500'
              }`}>
                {hasShortCircuit ? '⚠️' : component.status === 'on' ? '✓' : '○'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Relay {index + 1}: {hasShortCircuit ? 'OPEN' : component.status === 'on' ? 'CLOSED' : 'OFF'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Details */}
      <div className="bg-blue-900/10 border border-blue-500/30 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-400 mb-2">🔧 Hardware Configuration</h3>
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span>Detection Method: GPIO 32 with internal pull-up resistor (INPUT_PULLUP mode)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span>Normal State: Pin reads HIGH (~3.3V) due to pull-up</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span>Short Circuit State: Pin reads LOW (0V) when shorted to ground</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span>Safety Response: All 3 relays (Pins 5, 18, 19) opened immediately when short detected</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span>Alert System: Buzzer (Pin 4) sounds for 1 second, LCD displays "Short circuit"</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span>Recovery: Requires manual reset - variable 'circuit_shorted' remains 1 after detection</span>
          </div>
        </div>
      </div>

      {/* Safe Operating Info */}
      {!hasShortCircuit && (
        <div className="mt-4 bg-green-900/10 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <span className="text-lg">✓</span>
            <span>System is operating normally. All circuits protected and monitored.</span>
          </div>
        </div>
      )}

      {/* Recovery Instructions */}
      {hasShortCircuit && (
        <div className="mt-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Recovery Steps Required</h4>
          <ol className="text-xs text-yellow-200 space-y-1 list-decimal list-inside">
            <li>Immediately disconnect power to affected circuit</li>
            <li>Identify and remove the short circuit cause</li>
            <li>Inspect all wiring and connections for damage</li>
            <li>Reset ESP32 controller to clear fault state</li>
            <li>Verify circuit integrity before reconnecting power</li>
            <li>Monitor system for 5 minutes after restart</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default ShortCircuitAlert;