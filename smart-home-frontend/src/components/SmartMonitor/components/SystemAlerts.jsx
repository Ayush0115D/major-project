import React from 'react';
import { AlertTriangle, Clock, X } from 'lucide-react';

const AlertCard = ({ alert, onDismiss }) => {
  const getAlertConfig = (type) => {
    switch(type) {
      case 'critical': 
        return {
          bg: 'from-red-500/20 to-rose-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400',
          icon: 'text-red-400'
        };
      case 'warning': 
        return {
          bg: 'from-yellow-500/20 to-amber-500/10',
          border: 'border-yellow-500/30',
          text: 'text-yellow-400',
          icon: 'text-yellow-400'
        };
      default: 
        return {
          bg: 'from-gray-500/20 to-slate-500/10',
          border: 'border-gray-500/30',
          text: 'text-gray-400',
          icon: 'text-gray-400'
        };
    }
  };

  const config = getAlertConfig(alert.type);

  return (
    <div className={`bg-gradient-to-br ${config.bg} border ${config.border} p-5 rounded-2xl backdrop-blur-sm hover:shadow-xl transition-all duration-300 group relative`}>
      <button 
        onClick={() => onDismiss && onDismiss(alert.id)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/10 rounded-lg p-1"
      >
        <X size={16} className="text-gray-400 hover:text-white" />
      </button>
      
      <div className="flex items-center mb-3">
        <div className={`p-2 bg-white/10 rounded-xl mr-3`}>
          <AlertTriangle className={config.icon} size={18} />
        </div>
        <span className={`font-bold text-lg ${config.text}`}>{alert.room}</span>
      </div>
      
      <p className="text-white text-sm mb-4 leading-relaxed">{alert.message}</p>
      
      <div className="flex items-center text-xs text-gray-400">
        <Clock className="mr-2" size={12} />
        <span>{alert.time}</span>
      </div>
    </div>
  );
};

const SystemAlerts = ({ alerts }) => {
  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-3">System Alerts</h3>
      <p className="text-gray-400 mb-6">Recent system notifications and warnings</p>
      
      <div className="space-y-4">
        {alerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
        {alerts.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-green-500/10 rounded-2xl inline-block mb-4">
              <AlertTriangle className="text-green-400" size={48} />
            </div>
            <div className="text-gray-400 text-lg">No active alerts</div>
            <div className="text-gray-500 text-sm">All systems operating normally</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemAlerts;