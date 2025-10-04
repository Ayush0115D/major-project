import React, { useState } from 'react';
import { Settings, Moon, Sun, Bell, Wifi, Mail, Smartphone, Monitor, Database, Download, RefreshCw } from 'lucide-react';

const SettingsView = ({ theme, setTheme }) => {
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });
  const dark = theme === 'dark';
  
  const tc = (darkClass, lightClass) => dark ? darkClass : lightClass;
  const cardClass = `backdrop-blur-lg border p-6 rounded-2xl shadow-lg ${tc('bg-gradient-to-br from-slate-800/80 to-gray-800/60 border-slate-700/50', 'bg-white border-gray-200')}`;
  
  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${enabled ? 'bg-blue-500' : 'bg-gray-600'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  const NotificationItem = ({ icon: Icon, label, desc, type, color }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Icon className={`w-5 h-5 mr-3 ${tc(`text-${color}-400`, `text-${color}-600`)}`} />
        <div>
          <span className={`font-medium ${tc('text-gray-300', 'text-gray-800')}`}>{label}</span>
          <div className={`text-sm ${tc('text-gray-500', 'text-gray-600')}`}>{desc}</div>
        </div>
      </div>
      <ToggleSwitch enabled={notifications[type]} onToggle={() => setNotifications(p => ({ ...p, [type]: !p[type] }))} />
    </div>
  );

  const ActionButton = ({ icon: Icon, label, desc, color, hover }) => (
    <button className={`w-full border p-4 rounded-xl transition-all duration-300 group ${tc(`bg-${color}-500/20 hover:bg-${color}-500/30 border-${color}-500/30`, `bg-${color}-50 hover:bg-${color}-100 border-${color}-200`)}`}>
      <Icon className={`mx-auto mb-3 group-hover:scale-110 transition-transform ${tc(`text-${color}-400`, `text-${color}-600`)}`} size={24} />
      <div className={`font-medium ${tc(`text-${color}-400`, `text-${color}-600`)}`}>{label}</div>
      <div className={`text-sm mt-1 ${tc('text-gray-400', 'text-gray-600')}`}>{desc}</div>
    </button>
  );

  const InfoRow = ({ label, value, color = 'blue', badge }) => (
    <div className="flex items-center justify-between">
      <span className={tc('text-gray-300', 'text-gray-700')}>{label}</span>
      {badge ? (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tc('bg-green-500/20 text-green-400', 'bg-green-100 text-green-700')}`}>{value}</span>
      ) : (
        <span className={`font-medium ${tc(`text-${color}-400`, `text-${color}-600`)}`}>{value}</span>
      )}
    </div>
  );

  return (
    <div className={`p-8 min-h-screen transition-colors duration-300 ${tc('bg-gray-900', 'bg-gray-100')}`}>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mr-4 shadow-lg">
            <Settings className="text-white" size={28} />
          </div>
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${tc('text-white', 'text-gray-900')}`}>System Settings</h1>
            <p className={`text-lg ${tc('text-gray-400', 'text-gray-600')}`}>Configure your Smart Monitor Dashboard preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className={cardClass}>
          <h3 className={`text-xl font-bold mb-6 flex items-center ${tc('text-white', 'text-gray-800')}`}>
            <Monitor className="mr-3 text-blue-400" size={24} />
            Appearance
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {dark ? <Moon className="w-5 h-5 text-blue-400 mr-3" /> : <Sun className="w-5 h-5 text-yellow-400 mr-3" />}
              <div>
                <span className={`font-medium ${tc('text-gray-300', 'text-gray-800')}`}>Theme</span>
                <div className={`text-sm ${tc('text-gray-500', 'text-gray-600')}`}>{dark ? 'Dark Mode' : 'Light Mode'}</div>
              </div>
            </div>
            <button onClick={() => setTheme(dark ? 'light' : 'dark')} className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-300 ${dark ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'}`}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
              <span className="font-medium">Switch to {dark ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Bell className="mr-3 text-yellow-400" size={24} />
            Notifications
          </h3>
          <div className="space-y-6">
            <NotificationItem icon={Mail} label="Email Alerts" desc="Critical system notifications" type="email" color="blue" />
            <NotificationItem icon={Smartphone} label="SMS Alerts" desc="Emergency notifications" type="sms" color="green" />
            <NotificationItem icon={Bell} label="Push Notifications" desc="Browser notifications" type="push" color="purple" />
          </div>
        </div>
      </div>

      <div className={`mt-8 ${cardClass}`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${tc('text-white', 'text-gray-800')}`}>
          <Database className={`mr-3 ${tc('text-cyan-400', 'text-cyan-600')}`} size={24} />
          Data Management
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <ActionButton icon={Download} label="Export Data" desc="Download system logs" color="blue" />
          <ActionButton icon={RefreshCw} label="Reset Settings" desc="Restore defaults" color="red" />
        </div>
      </div>

      <div className={`mt-8 ${cardClass}`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${tc('text-white', 'text-gray-800')}`}>
          <Wifi className={`mr-3 ${tc('text-green-400', 'text-green-600')}`} size={24} />
          System Information
        </h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <InfoRow label="Version" value="v2.1.0" />
            <InfoRow label="Last Update" value="2 days ago" color="green" />
            <InfoRow label="Connection Status" value="Connected" badge />
            <InfoRow label="Uptime" value="15h 42m" color="cyan" />
          </div>
          <div className="space-y-4">
            <InfoRow label="Data Usage" value="0.4 GB" color="yellow" />
            <InfoRow label="Active Sensors" value="16/16" color="purple" />
            <InfoRow label="API Status" value="Online" badge />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsView;