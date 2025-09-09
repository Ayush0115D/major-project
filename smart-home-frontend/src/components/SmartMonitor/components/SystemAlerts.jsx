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
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} p-6 bg-[#0f172a]`}>
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Active Alerts */}
        <div className="bg-[#1e293b] border border-red-500/40 text-red-300 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{activeAlertsCount}</div>
              <div className="text-sm opacity-80">Active Alerts</div>
            </div>
            <div className="text-3xl">🚨</div>
          </div>
        </div>

        {/* Short Circuits */}
        <div className="bg-[#1e293b] border border-red-400/40 text-red-300 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{shortCircuitCount}</div>
              <div className="text-sm opacity-80">Short Circuits</div>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
        </div>

        {/* Overloads */}
        <div className="bg-[#1e293b] border border-yellow-400/40 text-yellow-300 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{overloadCount}</div>
              <div className="text-sm opacity-80">Overloads</div>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-[#1e293b] border border-green-400/40 text-green-300 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{resolvedCount}</div>
              <div className="text-sm opacity-80">Resolved</div>
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
                ? 'bg-blue-600 text-white'
                : 'bg-[#1e293b] text-gray-300 hover:bg-[#334155]'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) =>
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
        )}
      </div>

      {/* Empty State */}
      {filteredAlerts.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Alerts Found</h3>
          <p className="text-gray-500">No alerts match the selected filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default SystemAlerts;
