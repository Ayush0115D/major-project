import React from 'react';
import { AlertTriangle } from 'lucide-react';

const CriticalAlertBanner = ({ criticalIssues }) => {
  if (criticalIssues === 0) return null;

  return (
    <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg mb-8 animate-pulse">
      <div className="flex items-center">
        <AlertTriangle className="text-red-400 mr-3" size={24} />
        <div>
          <span className="text-red-400 font-semibold">CRITICAL SYSTEM ALERT</span>
          <span className="text-white ml-4">{criticalIssues} issue(s) require immediate attention</span>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlertBanner;