import React from 'react';

const ShortCircuitAlert = ({ alert = {}, onAcknowledge = () => {}, onResolve = () => {} }) => {
  const { component, location, message, status, timestamp, technicalData = {} } = alert;

  return (
    <div className="border-2 border-red-600 bg-[#1e293b] rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        {/* Icon + Title */}
        <div className="flex items-center gap-3">
          <span className="text-2xl text-red-400">⚡</span>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Short Circuit - {component || 'Unknown Component'}
            </h3>
            <p className="text-sm text-gray-400">{location || 'Unknown Location'}</p>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-900/40 text-red-300 border border-red-600/40">
            CRITICAL
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === 'active'
                ? 'bg-red-900/40 text-red-300 border border-red-600/40'
                : 'bg-green-900/40 text-green-300 border border-green-600/40'
            }`}
          >
            {status ? status.toUpperCase() : 'UNKNOWN'}
          </span>
        </div>
      </div>

      {/* Message & Time */}
      <div className="mb-4">
        <p className="text-gray-300 mb-2">{message || 'No details provided.'}</p>
        <p className="text-sm text-gray-500">Time: {timestamp || 'N/A'}</p>
      </div>

      {/* Technical Details */}
      <div className="bg-[#0f172a] p-4 rounded-lg mb-4 border border-gray-700">
        <h4 className="font-semibold mb-2 text-red-400">🔍 Technical Details:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Voltage:</span>
            <div className="font-medium text-red-400">{technicalData.voltage || 0}V</div>
          </div>
          <div>
            <span className="text-gray-400">Fault Current:</span>
            <div className="font-medium text-red-400">{technicalData.faultCurrent || 0}A</div>
          </div>
          <div>
            <span className="text-gray-400">Resistance:</span>
            <div className="font-medium text-red-400">{technicalData.resistance || 0.1}Ω</div>
          </div>
          <div>
            <span className="text-gray-400">Power:</span>
            <div className="font-medium text-white">{technicalData.power || 0}W</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {status === 'active' && (
        <div className="flex gap-2">
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Acknowledge
          </button>
          <button
            onClick={() => onResolve(alert.id)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Mark Resolved
          </button>
        </div>
      )}
    </div>
  );
};

export default ShortCircuitAlert;
