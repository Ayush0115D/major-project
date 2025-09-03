import React, { useState } from 'react';
import { 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  Wifi, 
  Volume2, 
  VolumeX, 
  Mail, 
  Smartphone, 
  Monitor, 
  Database,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

const SettingsView = () => {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    sound: true
  });

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'light');
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        enabled ? 'bg-blue-500' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mr-4 shadow-lg">
            <Settings className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
            <p className="text-gray-400 text-lg">Configure your Smart Monitor Dashboard preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Appearance Settings */}
        <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Monitor className="mr-3 text-blue-400" size={24} />
            Appearance
          </h3>
          
          {/* Theme Toggle */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-blue-400 mr-3" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400 mr-3" />
                )}
                <div>
                  <span className="text-gray-300 font-medium">Theme</span>
                  <div className="text-gray-500 text-sm">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' 
                    : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                }`}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                <span className="font-medium">Switch to {theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Monitor className="w-5 h-5 text-green-400 mr-3" />
                <div>
                  <span className="text-gray-300 font-medium">Compact View</span>
                  <div className="text-gray-500 text-sm">Reduce spacing and padding</div>
                </div>
              </div>
              <ToggleSwitch enabled={false} onToggle={() => {}} />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Bell className="mr-3 text-yellow-400" size={24} />
            Notifications
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-400 mr-3" />
                <div>
                  <span className="text-gray-300 font-medium">Email Alerts</span>
                  <div className="text-gray-500 text-sm">Critical system notifications</div>
                </div>
              </div>
              <ToggleSwitch 
                enabled={notifications.email} 
                onToggle={() => setNotifications(prev => ({ ...prev, email: !prev.email }))} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Smartphone className="w-5 h-5 text-green-400 mr-3" />
                <div>
                  <span className="text-gray-300 font-medium">SMS Alerts</span>
                  <div className="text-gray-500 text-sm">Emergency notifications</div>
                </div>
              </div>
              <ToggleSwitch 
                enabled={notifications.sms} 
                onToggle={() => setNotifications(prev => ({ ...prev, sms: !prev.sms }))} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-purple-400 mr-3" />
                <div>
                  <span className="text-gray-300 font-medium">Push Notifications</span>
                  <div className="text-gray-500 text-sm">Browser notifications</div>
                </div>
              </div>
              <ToggleSwitch 
                enabled={notifications.push} 
                onToggle={() => setNotifications(prev => ({ ...prev, push: !prev.push }))} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {notifications.sound ? (
                  <Volume2 className="w-5 h-5 text-cyan-400 mr-3" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400 mr-3" />
                )}
                <div>
                  <span className="text-gray-300 font-medium">Sound Alerts</span>
                  <div className="text-gray-500 text-sm">Audio notifications</div>
                </div>
              </div>
              <ToggleSwitch 
                enabled={notifications.sound} 
                onToggle={() => setNotifications(prev => ({ ...prev, sound: !prev.sound }))} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="mt-8 bg-gradient-to-br from-slate-800/80 to-gray-800/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Database className="mr-3 text-cyan-400" size={24} />
          Data Management
        </h3>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 p-4 rounded-xl transition-all duration-300 group">
              <Download className="text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" size={24} />
              <div className="text-blue-400 font-medium">Export Data</div>
              <div className="text-gray-400 text-sm mt-1">Download system logs</div>
            </button>
          </div>

          <div className="text-center">
            <button className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 p-4 rounded-xl transition-all duration-300 group">
              <Upload className="text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" size={24} />
              <div className="text-green-400 font-medium">Import Config</div>
              <div className="text-gray-400 text-sm mt-1">Load saved settings</div>
            </button>
          </div>

          <div className="text-center">
            <button className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 p-4 rounded-xl transition-all duration-300 group">
              <RefreshCw className="text-red-400 mx-auto mb-3 group-hover:scale-110 transition-transform" size={24} />
              <div className="text-red-400 font-medium">Reset Settings</div>
              <div className="text-gray-400 text-sm mt-1">Restore defaults</div>
            </button>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="mt-8 bg-gradient-to-br from-slate-800/80 to-gray-800/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Wifi className="mr-3 text-green-400" size={24} />
          System Information
        </h3>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Version</span>
              <span className="text-blue-400 font-medium">v2.1.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Last Update</span>
              <span className="text-green-400 font-medium">2 days ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Connection Status</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Uptime</span>
              <span className="text-cyan-400 font-medium">15h 42m</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Data Usage</span>
              <span className="text-yellow-400 font-medium">2.1 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Storage Used</span>
              <span className="text-orange-400 font-medium">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Active Sensors</span>
              <span className="text-purple-400 font-medium">16/16</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">API Status</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
