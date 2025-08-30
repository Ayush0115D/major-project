import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const CriticalAlertBanner = ({ criticalIssues }) => {
  if (criticalIssues === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-500/20 to-rose-500/10 border border-red-500/30 p-6 rounded-2xl mb-10 shadow-2xl shadow-red-500/10 animate-pulse-slow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-3 bg-red-500/20 rounded-xl mr-4">
            <AlertTriangle className="text-red-400 animate-bounce" size={28} />
          </div>
          <div>
            <span className="text-red-400 font-bold text-lg block">CRITICAL SYSTEM ALERT</span>
            <span className="text-white text-lg">{criticalIssues} issue(s) require immediate attention</span>
          </div>
        </div>
        <button className="p-2 hover:bg-red-500/10 rounded-xl transition-colors duration-300">
          <X className="text-red-400" size={24} />
        </button>
      </div>
    </div>
  );
};

export default CriticalAlertBanner;