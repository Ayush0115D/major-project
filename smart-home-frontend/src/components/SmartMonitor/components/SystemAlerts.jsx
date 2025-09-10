import React, { useState, useEffect } from 'react';
import ShortCircuitAlert from './ShortCircuitAlert';
import OverloadAlert from './OverloadAlert';

const SystemAlerts = ({ isOpen, alerts = [], acknowledgeAlert, resolveAlert }) => {
  const [filter, setFilter] = useState('all');
  const [currentAlerts, setCurrentAlerts] = useState([]);

  // Update local alerts state whenever alerts prop changes
  useEffect(() => {
    setCurrentAlerts(alerts);
  }, [alerts]);

  // Filter alerts based on selected filter
  const filteredAlerts = currentAlerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'short-circuit' || filter === 'overload') return alert.type === filter;
    if (filter === 'active' || filter === 'resolved') return alert.status === filter;
    return true;
  });

  // Calculate counts
  const counts = currentAlerts.reduce(
    (acc, alert) => {
      if (alert.status === 'active') acc.active++;
      if (alert.status === 'resolved') acc.resolved++;
      if (alert.type === 'short-circuit') acc.shortCircuit++;
      if (alert.type === 'overload') acc.overload++;
      return acc;
    },
    { active: 0, shortCircuit: 0, overload: 0, resolved: 0 }
  );

  const filterButtons = ['all', 'short-circuit', 'overload', 'active', 'resolved'];

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} p-6 bg-[#0f172a]`}>
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard count={counts.active} label="Active Alerts" icon="🚨" type="red" />
        <SummaryCard count={counts.shortCircuit} label="Short Circuits" icon="⚡" type="red" />
        <SummaryCard count={counts.overload} label="Overloads" icon="⚠️" type="yellow" />
        <SummaryCard count={counts.resolved} label="Resolved" icon="✅" type="green" />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterButtons.map(ft => (
          <button
            key={ft}
            onClick={() => setFilter(ft)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === ft
                ? 'bg-blue-600 text-white'
                : 'bg-[#1e293b] text-gray-300 hover:bg-[#334155]'
            }`}
          >
            {ft.charAt(0).toUpperCase() + ft.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map(alert =>
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

// Reusable Summary Card Component
const SummaryCard = ({ count, label, icon, type }) => {
  let border = '', text = '';
  switch (type) {
    case 'red':
      border = 'border-red-400/40';
      text = 'text-red-300';
      break;
    case 'yellow':
      border = 'border-yellow-400/40';
      text = 'text-yellow-300';
      break;
    case 'green':
      border = 'border-green-400/40';
      text = 'text-green-300';
      break;
    default:
      border = 'border-gray-400/40';
      text = 'text-gray-300';
  }

  return (
    <div className={`bg-[#1e293b] border ${border} ${text} p-4 rounded-lg shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{count}</div>
          <div className="text-sm opacity-80">{label}</div>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

export default SystemAlerts;
