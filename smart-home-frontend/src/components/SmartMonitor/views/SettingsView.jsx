import React, { useState } from 'react';
import { Settings, Moon, Sun, Bell, Wifi, Mail, Smartphone, Monitor, Database, Download, RefreshCw } from 'lucide-react';

const SettingsView = ({ theme, setTheme }) => {
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });
  const [exporting, setExporting] = useState(false);
  const dark = theme === 'dark';

  const tc = (darkClass, lightClass) => dark ? darkClass : lightClass;

  const cardClass = `backdrop-blur-lg border p-6 rounded-2xl shadow-lg ${tc(
    'bg-gradient-to-br from-slate-800/80 to-gray-800/60 border-slate-700/50',
    'bg-white border-gray-200'
  )}`;

  /* ============= EXPORT ALERTS (JSON) ============= */

  const exportAlertLogs = async () => {
    try {
      setExporting(true);
      
      const BACKEND_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:5000'
        : 'https://major-project-h76o.onrender.com';

      const response = await fetch(`${BACKEND_URL}/api/alerts/history`);

      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }

      const result = await response.json();
      const alerts = result.data || [];

      if (alerts.length === 0) {
        alert('❌ No alerts to export!');
        setExporting(false);
        return;
      }

      const exportData = {
        exportInfo: {
          exportedAt: new Date().toISOString(),
          totalAlerts: alerts.length,
          systemVersion: 'v2.1.0'
        },
        alerts: alerts.map(alert => ({
          id: alert._id,
          timestamp: new Date(alert.timestamp).toLocaleString(),
          type: alert.alertType,
          socketName: alert.socketName,
          socketLocation: alert.socketLocation,
          power: alert.power + 'W',
          current: alert.current + 'A',
          voltage: alert.voltage + 'V',
          temperature: alert.temperature ? alert.temperature + '°C' : 'N/A',
          riskLevel: alert.riskLevel + '%',
          overloadRisk: alert.overloadRisk + '%',
          shortCircuitRisk: alert.shortCircuitRisk + '%',
          emailSent: alert.emailSent ? 'Yes' : 'No',
          emailStatus: alert.emailStatus,
          acknowledged: alert.acknowledged ? 'Yes' : 'No',
          acknowledgedAt: alert.acknowledgedAt ? new Date(alert.acknowledgedAt).toLocaleString() : 'N/A'
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shield-alert-logs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`✅ Exported ${alerts.length} alerts!`);
    } catch (error) {
      console.error('❌ Export error:', error);
      alert('❌ Failed to export alerts: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  /* ============= EXPORT SYSTEM DATA (JSON) ============= */

  const exportSystemData = () => {
    const data = {
      theme: theme,
      notifications: notifications,
      systemInfo: {
        version: "v2.1.0",
        lastUpdate: "2 days ago",
        connection: "Connected",
        dataUsage: "0.4 GB",
        sensors: "8/8",
        apiStatus: "Online"
      },
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `smart-monitor-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /* ============= TOGGLE SWITCH ============= */

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

  /* ============= NOTIFICATION ITEM ============= */

  const NotificationItem = ({ icon: Icon, label, desc, type, color }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Icon className={`w-5 h-5 mr-3 ${tc(`text-${color}-400`, `text-${color}-600`)}`} />
        <div>
          <span className={`font-medium ${tc('text-gray-300', 'text-gray-800')}`}>{label}</span>
          <div className={`text-sm ${tc('text-gray-500', 'text-gray-600')}`}>{desc}</div>
        </div>
      </div>

      <ToggleSwitch
        enabled={notifications[type]}
        onToggle={() =>
          setNotifications((p) => ({ ...p, [type]: !p[type] }))
        }
      />
    </div>
  );

  /* ============= ACTION BUTTON ============= */

  const ActionButton = ({ icon: Icon, label, desc, color, onClick, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full border p-4 rounded-xl transition-all duration-300 group ${
        disabled 
          ? 'opacity-50 cursor-not-allowed'
          : ''
      } ${tc(
        `bg-${color}-500/20 hover:bg-${color}-500/30 border-${color}-500/30`,
        `bg-${color}-50 hover:bg-${color}-100 border-${color}-200`
      )}`}
    >
      <Icon
        className={`mx-auto mb-3 ${!disabled ? 'group-hover:scale-110' : ''} transition-transform ${tc(
          `text-${color}-400`,
          `text-${color}-600`
        )}`}
        size={24}
      />

      <div className={`font-medium ${tc(`text-${color}-400`, `text-${color}-600`)}`}>
        {label}
      </div>

      <div className={`text-sm mt-1 ${tc('text-gray-400', 'text-gray-600')}`}>
        {desc}
      </div>
    </button>
  );

  /* ============= INFO ROW ============= */

  const InfoRow = ({ label, value, color = 'blue', badge }) => (
    <div className="flex items-center justify-between">
      <span className={tc('text-gray-300', 'text-gray-700')}>{label}</span>

      {badge ? (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${tc(
            'bg-green-500/20 text-green-400',
            'bg-green-100 text-green-700'
          )}`}
        >
          {value}
        </span>
      ) : (
        <span className={`font-medium ${tc(`text-${color}-400`, `text-${color}-600`)}`}>
          {value}
        </span>
      )}
    </div>
  );

  /* ============= UI ============= */

  return (
    <div className={`p-8 min-h-screen transition-colors duration-300 ${tc('bg-gray-900', 'bg-gray-100')}`}>
      
      {/* HEADER */}

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mr-4 shadow-lg">
            <Settings className="text-white" size={28} />
          </div>

          <div>
            <h1 className={`text-3xl font-bold mb-2 ${tc('text-white', 'text-gray-900')}`}>
              System Settings
            </h1>

            <p className={`text-lg ${tc('text-gray-400', 'text-gray-600')}`}>
              Configure your Smart Monitor Dashboard preferences
            </p>
          </div>
        </div>
      </div>

      {/* APPEARANCE + NOTIFICATIONS */}

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
                <div className={`text-sm ${tc('text-gray-500', 'text-gray-600')}`}>
                  {dark ? 'Dark Mode' : 'Light Mode'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setTheme(dark ? 'light' : 'dark')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                dark
                  ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                  : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
              }`}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
              <span className="font-medium">
                Switch to {dark ? 'Light' : 'Dark'}
              </span>
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS */}

        <div className={cardClass}>
          <h3 className={`text-xl font-bold mb-6 flex items-center ${tc('text-white', 'text-gray-800')}`}>
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

      {/* DATA MANAGEMENT */}

      <div className={`mt-8 ${cardClass}`}>

        <h3 className={`text-xl font-bold mb-6 flex items-center ${tc('text-white', 'text-gray-800')}`}>
          <Database className={`mr-3 ${tc('text-cyan-400', 'text-cyan-600')}`} size={24} />
          Data Management
        </h3>

        <div className="grid grid-cols-2 gap-6">

          <ActionButton
            icon={Download}
            label="Export Alert Logs "
            desc={exporting ? "Exporting..." : "Download all alerts"}
            color="green"
            onClick={exportAlertLogs}
            disabled={exporting}
          />

          <ActionButton
            icon={Download}
            label="Export System Data "
            desc="Download system settings"
            color="blue"
            onClick={exportSystemData}
          />

        </div>

      </div>

      {/* SYSTEM INFO */}

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
          </div>

          <div className="space-y-4">
            <InfoRow label="Data Usage" value="0.4 GB" color="yellow" />
            <InfoRow label="Active Sensors" value="6/6" color="purple" />
            <InfoRow label="API Status" value="Online" badge />
          </div>

        </div>

      </div>

      {/* SAVE BUTTON */}

      <div className="mt-8 flex justify-end">
        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105">
          Save Settings
        </button>
      </div>

    </div>
  );
};

export default SettingsView;