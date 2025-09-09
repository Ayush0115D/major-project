import React from 'react';

const ShortCircuitAlert = ({ alert, onAcknowledge, onResolve }) => {
  return (
    <div className="border-2 border-red-500 bg-red-50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Short Circuit - {alert.component}
            </h3>
            <p className="text-sm text-gray-600">{alert.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            CRITICAL
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            alert.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {alert.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 mb-2">{alert.message}</p>
        <p className="text-sm text-gray-500">Time: {alert.timestamp}</p>
      </div>

      {/* Technical Details */}
      <div className="bg-white p-4 rounded-lg mb-4">
        <h4 className="font-semibold mb-2">🔍 Technical Details:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Voltage:</span>
            <div className="font-medium text-red-600">{alert.technicalData?.voltage || 0}V</div>
          </div>
          <div>
            <span className="text-gray-600">Fault Current:</span>
            <div className="font-medium text-red-600">{alert.technicalData?.faultCurrent || alert.current}A</div>
          </div>
          <div>
            <span className="text-gray-600">Resistance:</span>
            <div className="font-medium text-red-600">{alert.technicalData?.resistance || 0.1}Ω</div>
          </div>
          <div>
            <span className="text-gray-600">Power:</span>
            <div className="font-medium">{alert.technicalData?.power || 0}W</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {alert.status === 'active' && (
        <div className="flex gap-2">
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Acknowledge
          </button>
          <button
            onClick={() => onResolve(alert.id)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Mark Resolved
          </button>
        </div>
      )}
    </div>
  );
};

export default ShortCircuitAlert;