import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AlertCard = ({ alert }) => {
  const getAlertColors = (type) => {
    switch(type) {
      case 'critical': return 'bg-red-900/30 border-red-500 text-red-400';
      case 'warning': return 'bg-yellow-900/30 border-yellow-500 text-yellow-400';
      default: return 'bg-gray-900/30 border-gray-500 text-gray-400';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getAlertColors(alert.type)}`}>
      <div className="flex items-center mb-2">
        <AlertTriangle className="mr-2" size={16} />
        <span className="font-semibold">{alert.room}</span>
      </div>
      <p className="text-white text-sm mb-2">{alert.message}</p>
      <p className="text-gray-400 text-xs">{alert.time}</p>
    </div>
  );
};

const SystemAlerts = ({ alerts }) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">System Alerts</h3>
      <div className="space-y-3">
        {alerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
        {alerts.length === 0 && (
          <div className="text-gray-400 text-center py-8">
            No active alerts
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemAlerts;
