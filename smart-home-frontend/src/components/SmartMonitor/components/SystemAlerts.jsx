import React, { useState, useEffect } from 'react';
import ShortCircuitAlert from './ShortCircuitAlert';
import OverloadAlert from './OverloadAlert';

const SystemAlerts = ({ isOpen, alerts = [], acknowledgeAlert, resolveAlert, theme = 'dark' }) => {
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
    <div className={`${isOpen ? 'block' : 'hidden'} p-6 ${
      theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'
    }`}>
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard count={counts.active} label="Active Alerts" icon="🚨" type="red" theme={theme} />
        <SummaryCard count={counts.shortCircuit} label="Short Circuits" icon="⚡" type="red" theme={theme} />
        <SummaryCard count={counts.overload} label="Overloads" icon="⚠️" type="yellow" theme={theme} />
        <SummaryCard count={counts.resolved} label="Resolved" icon="✅" type="green" theme={theme} />
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
                : theme === 'dark'
                ? 'bg-[#1e293b] text-gray-300 hover:bg-[#334155]'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
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
              theme={theme}
            />
          ) : (
            <OverloadAlert
              key={alert.id}
              alert={alert}
              onAcknowledge={acknowledgeAlert}
              onResolve={resolveAlert}
              theme={theme}
            />
          )
        )}
      </div>

      {/* Empty State */}
      {filteredAlerts.length === 0 && (
        <div className={`text-center py-12 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <div className="text-6xl mb-4">📋</div>
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>No Alerts Found</h3>
          <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
            No alerts match the selected filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

// Reusable Summary Card Component
const SummaryCard = ({ count, label, icon, type, theme = 'dark' }) => {
  let border = '', text = '', bg = '';
  
  if (theme === 'dark') {
    bg = 'bg-[#1e293b]';
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
  } else {
    bg = 'bg-white';
    switch (type) {
      case 'red':
        border = 'border-red-300';
        text = 'text-red-600';
        break;
      case 'yellow':
        border = 'border-yellow-300';
        text = 'text-yellow-600';
        break;
      case 'green':
        border = 'border-green-300';
        text = 'text-green-600';
        break;
      default:
        border = 'border-gray-300';
        text = 'text-gray-700';
    }
  }

  return (
    <div className={`${bg} border ${border} ${text} p-4 rounded-lg shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{count}</div>
          <div className={`text-sm ${theme === 'dark' ? 'opacity-80' : 'opacity-90'}`}>{label}</div>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

export default SystemAlerts;