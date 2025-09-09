import React from 'react';

const OverloadAlert = ({ alert, onAcknowledge, onResolve }) => {
  const getBorderColor = () => {
    if (alert.status === 'resolved') return 'border-green-500 bg-green-50';
    return 'border-yellow-500 bg-yellow-50';
  };

  return (
    <div className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${getBorderColor()}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Overload - {alert.component}
            </h3>
            <p className="text-sm text-gray-600">{alert.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            alert.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {alert.status === 'resolved' ? 'RESOLVED' : 'WARNING'}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            alert.status === 'active' ? 'bg-red-100 text-red-800' : 
            alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {alert.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 mb-2">{alert.message}</p>
        <p className="text-sm text-gray-500">Time: {alert.timestamp}</p>
        {alert.resolvedAt && (
          <p className="text-sm text-green-600">Resolved: {alert.resolvedAt}</p>
        )}
      </div>

      {/* Technical Details */}
      <div className="bg-white p-4 rounded-lg mb-4">
        <h4 className="font-semibold mb-2">📊 Load Analysis:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Voltage:</span>
            <div className="font-medium">{alert.technicalData?.voltage || 230}V</div>
          </div>
          <div>
            <span className="text-gray-600">Current:</span>
            <div className="font-medium text-yellow-600">{alert.technicalData?.current || alert.current}A</div>
          </div>
          <div>
            <span className="text-gray-600">Max Load:</span>
            <div className="font-medium">{alert.technicalData?.maxLoad || 1500}W</div>
          </div>
          <div>
            <span className="text-gray-600">Current Load:</span>
            <div className={`font-medium ${
              (alert.technicalData?.currentLoad || 0) > (alert.technicalData?.maxLoad || 1500) 
                ? 'text-red-600' : 'text-green-600'
            }`}>
              {alert.technicalData?.currentLoad || 0}W
            </div>
          </div>
        </div>
        
        {/* Overload Percentage Bar */}
        {alert.technicalData?.overloadPercentage > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Overload:</span>
              <span className="font-medium text-red-600">
                {alert.technicalData.overloadPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(alert.technicalData.overloadPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
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
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:green-600 transition-colors"
          >
            Mark Resolved
          </button>
        </div>
      )}
    </div>
  );
};

export default OverloadAlert;