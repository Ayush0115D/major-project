import React, { useState, useEffect } from 'react';

// Alert Card Component
const AlertCard = ({ alert, onAcknowledge, onResolve, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const isShortCircuit = alert.type === 'short-circuit';
  
  const styles = {
    shortCircuit: {
      bg: isDark ? 'bg-gradient-to-br from-red-950/60 to-red-900/40' : 'bg-gradient-to-br from-red-50 to-red-100',
      border: isDark ? 'border-red-500/50' : 'border-red-300',
      icon: '⚡',
      iconBg: isDark ? 'bg-red-500/20' : 'bg-red-200',
      text: isDark ? 'text-red-200' : 'text-red-800',
      subText: isDark ? 'text-red-300' : 'text-red-600'
    },
    overload: {
      bg: isDark ? 'bg-gradient-to-br from-yellow-950/60 to-yellow-900/40' : 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      border: isDark ? 'border-yellow-500/50' : 'border-yellow-300',
      icon: '⚠️',
      iconBg: isDark ? 'bg-yellow-500/20' : 'bg-yellow-200',
      text: isDark ? 'text-yellow-200' : 'text-yellow-800',
      subText: isDark ? 'text-yellow-300' : 'text-yellow-600'
    }
  };
  
  const style = isShortCircuit ? styles.shortCircuit : styles.overload;
  const statusColors = {
    active: 'bg-red-500 text-white animate-pulse',
    acknowledged: isDark ? 'bg-blue-500/30 text-blue-300' : 'bg-blue-200 text-blue-800',
    resolved: isDark ? 'bg-green-500/30 text-green-300' : 'bg-green-200 text-green-800'
  };

  return (
    <div className={`${style.bg} border-2 ${style.border} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all`}>
      <div className="flex gap-3">
        {/* Icon */}
        <div className={`${style.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-md`}>
          {style.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h4 className={`font-bold text-base ${style.text} truncate`}>{alert.component}</h4>
              <p className={`text-sm ${style.subText}`}>{alert.location}</p>
            </div>
            <span className={`${statusColors[alert.status]} px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap`}>
              {alert.status.toUpperCase()}
            </span>
          </div>
          
          {/* Message */}
          <p className={`${style.text} mb-3 text-sm`}>{alert.message}</p>
          
          {/* Technical Data */}
          <div className={`grid grid-cols-3 gap-3 p-3 rounded-lg mb-3 ${
            isDark ? 'bg-black/20' : 'bg-white/50'
          }`}>
            {[
              { label: 'Voltage', value: `${alert.technicalData?.voltage || 0}V`, icon: '⚡' },
              { label: 'Current', value: `${alert.technicalData?.current || 0}A`, icon: '🔌' },
              { label: 'Power', value: `${alert.technicalData?.power || 0}W`, icon: '💡' }
            ].map(({ label, value, icon }) => (
              <div key={label} className="text-center">
                <div className="text-lg mb-1">{icon}</div>
                <div className={`font-bold ${style.text}`}>{value}</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
              </div>
            ))}
          </div>
          
          {/* Timestamp */}
          <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            🕒 {alert.timestamp}
            {alert.resolvedAt && ` • ✅ Resolved: ${alert.resolvedAt}`}
          </p>
          
          {/* Action Buttons */}
          {alert.status === 'active' && (
            <div className="flex gap-2">
              <button
                onClick={() => onAcknowledge(alert.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105"
              >
                👁️ Acknowledge
              </button>
              <button
                onClick={() => onResolve(alert.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105"
              >
                ✅ Resolve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ filter, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const states = {
    all: { icon: '✅', title: 'All Systems Normal', desc: 'No alerts detected. All circuits operating safely.' },
    'short-circuit': { icon: '🛡️', title: 'No Short Circuits', desc: 'Pin 32 monitoring active. All circuits protected.' },
    overload: { icon: '✓', title: 'No Overloads', desc: 'All loads within 1500W limit. Relays operational.' },
    active: { icon: '🎉', title: 'No Active Alerts', desc: 'All alerts acknowledged or resolved.' },
    resolved: { icon: '📋', title: 'No Resolved Alerts', desc: 'No alerts have been resolved yet.' }
  };
  
  const state = states[filter] || states.all;
  
  return (
    <div className={`text-center py-12 px-6 rounded-2xl ${
      isDark ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50' : 'bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200'
    }`}>
      <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5 shadow-xl ${
        isDark ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-br from-green-100 to-emerald-100'
      }`}>
        <div className="text-5xl">{state.icon}</div>
      </div>
      <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-green-300' : 'text-green-700'}`}>
        {state.title}
      </h3>
      <p className={`text-base mb-6 max-w-md mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {state.desc}
      </p>
      
      {/* Status Grid */}
      <div className={`max-w-lg mx-auto rounded-xl p-5 ${
        isDark ? 'bg-gray-800/30 border border-gray-700' : 'bg-gray-50 border border-gray-200'
      }`}>
        <div className="space-y-3">
          {[
            { label: 'ESP32 Monitoring', status: 'Active', icon: '🔍', info: 'Real-time data from GPIO pins' },
            { label: 'Circuit Protection', status: 'Enabled', icon: '🛡️', info: 'Auto-trip on faults detected' },
            { label: 'All Relays', status: 'Operational', icon: '⚙️', info: 'Pins 5, 18, 19 functioning' }
          ].map(({ label, status, icon, info }) => (
            <div key={label} className={`p-3 rounded-lg ${
              isDark ? 'bg-gray-700/30' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="text-xl">{icon}</span>
                  {label}
                </span>
                <span className={`font-bold text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  ✓ {status}
                </span>
              </div>
              <p className={`text-xs ml-7 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {info}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SystemAlerts = ({ isOpen, alerts = [], acknowledgeAlert, resolveAlert, theme = 'dark' }) => {
  const [filter, setFilter] = useState('all');
  const isDark = theme === 'dark';

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return filter === 'short-circuit' || filter === 'overload' 
      ? alert.type === filter 
      : alert.status === filter;
  });

  const counts = alerts.reduce((acc, alert) => {
    acc[alert.status === 'active' ? 'active' : 'resolved']++;
    acc[alert.type === 'short-circuit' ? 'shortCircuit' : 'overload']++;
    return acc;
  }, { active: 0, shortCircuit: 0, overload: 0, resolved: 0 });

  const summaryCards = [
    { count: counts.active, label: 'Active', icon: '🚨', color: 'red' },
    { count: counts.shortCircuit, label: 'Short Circuits', icon: '⚡', color: 'red' },
    { count: counts.overload, label: 'Overloads', icon: '⚠️', color: 'yellow' },
    { count: counts.resolved, label: 'Resolved', icon: '✅', color: 'green' }
  ];

  const filters = ['all', 'short-circuit', 'overload', 'active', 'resolved'];

  return (
    <div className={`${isOpen ? 'flex' : 'hidden'} flex-col h-full ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 p-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map(({ count, label, icon, color }) => {
            const colors = {
              red: isDark ? 'from-red-900/40 to-red-800/20 border-red-500/40 text-red-300' : 'from-red-100 to-red-50 border-red-300 text-red-700',
              yellow: isDark ? 'from-yellow-900/40 to-yellow-800/20 border-yellow-500/40 text-yellow-300' : 'from-yellow-100 to-yellow-50 border-yellow-300 text-yellow-700',
              green: isDark ? 'from-green-900/40 to-green-800/20 border-green-500/40 text-green-300' : 'from-green-100 to-green-50 border-green-300 text-green-700'
            };
            
            return (
              <div key={label} className={`bg-gradient-to-br ${colors[color]} border-2 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-black mb-1">{count}</div>
                    <div className="text-sm font-medium opacity-90">{label}</div>
                  </div>
                  <div className="text-4xl opacity-80">{icon}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3">
          {filters.map(ft => (
            <button
              key={ft}
              onClick={() => setFilter(ft)}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 ${
                filter === ft
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                  : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              {ft.charAt(0).toUpperCase() + ft.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {filteredAlerts.length > 0 ? (
          <div className="space-y-4">
            {filteredAlerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={acknowledgeAlert}
                onResolve={resolveAlert}
                theme={theme}
              />
            ))}
          </div>
        ) : (
          <EmptyState filter={filter} theme={theme} />
        )}
      </div>
    </div>
  );
};

export default SystemAlerts;