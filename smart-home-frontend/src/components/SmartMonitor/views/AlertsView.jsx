import React from 'react';
import SystemAlerts from '../components/SystemAlerts';

const AlertsView = ({ alerts, roomData }) => {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">System Alerts</h1>
        <p className="text-gray-400">Monitor and manage electrical faults and system alerts</p>
      </div>
      
      <SystemAlerts 
        alerts={alerts} 
        isOpen={true}
        acknowledgeAlert={(id) => console.log('Acknowledge alert:', id)}
        resolveAlert={(id) => console.log('Resolve alert:', id)}
      />
    </div>
  );
};

export default AlertsView;