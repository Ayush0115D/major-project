import React, { useState } from 'react';
import ShortCircuitAlert from './ShortCircuitAlert';
import OverloadAlert from './OverloadAlert';

const SystemAlerts = ({ isOpen, alerts = [], acknowledgeAlert, resolveAlert }) => {
  const [filter, setFilter] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'short-circuit' || filter === 'overload') return alert.type === filter;
    if (filter === 'active' || filter === 'resolved') return alert.status === filter;
    return true;
  });

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;
  const shortCircuitCount = alerts.filter(a => a.type === 'short-circuit' && a.status === 'active').length;
  const overloadCount = alerts.filter(a => a.type === 'overload' && a.status === 'active').length;

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} p-6`}>
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{activeAlertsCount}</div>
              <div className="text-sm opacity-90">Active Alerts</div>
            </div>
            <div className="text-3xl">🚨</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-400 to-red-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{shortCircuitCount}</div>
              <div className="text-sm opacity-90">Short Circuits</div>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{overloadCount}</div>
              <div className="text-sm opacity-90">Overloads</div>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{alerts.filter(a => a.status === 'resolved').length}</div>
              <div className="text-sm opacity-90">Resolved</div>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'short-circuit', 'overload', 'active', 'resolved'].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === filterType
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          alert.type === 'short-circuit' ? (
            <ShortCircuitAlert
              key={alert.id}
              alert={alert}
              onAcknowledge={acknowledgeAlert}
              onResolve={resolveAlert}
            />
          ) : (
            <OverloadAlert
              key={alert.id}
              alert={alert}
              onAcknowledge={acknowledgeAlert}
              onResolve={resolveAlert}
            />
          )
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Alerts Found</h3>
          <p className="text-gray-500">No alerts match the selected filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default SystemAlerts;