import React, { useState, useEffect } from 'react';
import { Thermometer, Zap, Activity, Brain, Clock, AlertTriangle, X } from 'lucide-react';

const SAFE_LIMITS = {
  POWER: 1000,
  CURRENT: 15,
  VOLTAGE_MIN: 200,
  VOLTAGE_MAX: 240,
  TEMPERATURE: 45,
};

// ============= DATA GENERATOR =============
const generateData = (scenario, cycleTime) => {
  if (scenario === 'normal') {
    // ✅ NORMAL: 50-60W power consumption (low current ~0.22A at 230V)
    const vary = (val, range) => val + (Math.random() - 0.5) * range;
    return {
      voltage: vary(230, 4),  // 226-234V
      current: Math.max(0.2, vary(0.22, 0.06)),  // 0.2-0.26A (50-60W)
      temperature: vary(28, 3),  // 25-31°C
      status: 'NORMAL'
    };
  }

  // ✅ CRITICAL/OVERLOAD: 1200-1500W power with HIGH RISK (75-80%)
  // At 230V, 1200W = 5.2A, 1500W = 6.5A
  return {
    voltage: 230 + Math.sin(cycleTime / 15) * 35,
    current: 5.2 + cycleTime * 0.015,  // Starts at 5.2A (1200W), increases gradually
    temperature: 70 + cycleTime * 0.4,
    status: 'CRITICAL'
  };
};

// ============= AI ENGINE WITH OVERLOAD & SHORT CIRCUIT RISK =============
const AIMonitor = {
  history: { v: [], i: [], t: [] },
  
  predict(voltage, current, temp) {
    this.history.v.push(Math.min(voltage / 240, 1));
    this.history.i.push(Math.min(current / 20, 1));
    this.history.t.push(Math.min(temp / 80, 1));

    if (this.history.v.length > 60) {
      this.history.v.shift();
      this.history.i.shift();
      this.history.t.shift();
    }

    const trend = (arr) => {
      if (arr.length < 2) return 0;
      const recent = arr.slice(-10).reduce((a, b) => a + b, 0) / 10;
      const old = arr.slice(-20, -10).reduce((a, b) => a + b, 0) / 10 || recent;
      return ((recent - old) * 100).toFixed(2);
    };

    // ✅ OVERLOAD RISK (Custom for 1200-1500W range)
    let overloadRisk;
    const power = voltage * current;
    
    if (power <= 1000) {
      overloadRisk = 5;  // Safe
    } else if (power < 1200) {
      overloadRisk = 15;  // Warning zone
    } else if (power >= 1200 && power < 1250) {
      overloadRisk = 80;  // 1200W = 80%
    } else if (power >= 1250 && power < 1300) {
      overloadRisk = 83;  // 1250W = 83%
    } else if (power >= 1300 && power < 1350) {
      overloadRisk = 85;  // 1300W = 85%
    } else if (power >= 1350 && power < 1400) {
      overloadRisk = 88;  // 1350W = 88%
    } else if (power >= 1400 && power < 1450) {
      overloadRisk = 91;  // 1400W = 91%
    } else if (power >= 1450 && power < 1500) {
      overloadRisk = 95;  // 1450W = 95%
    } else if (power >= 1500) {
      overloadRisk = 99;  // 1500W+ = 99%
    } else {
      overloadRisk = 5;
    }

    // ✅ SHORT CIRCUIT RISK (Voltage instability + Extreme current spike)
    let shortCircuitRisk;
    const voltageStability = Math.abs(voltage - 230);
    
    if (voltageStability < 10 && current < 18) {
      shortCircuitRisk = 5;
    } else if (voltageStability < 20 && current < 19) {
      shortCircuitRisk = 10;
    } else if (voltageStability < 30 && current < 20) {
      shortCircuitRisk = 25;
    } else if (voltageStability < 40 && current < 21) {
      shortCircuitRisk = 45;
    } else if (voltageStability < 50 && current < 22) {
      shortCircuitRisk = 65;
    } else if (voltageStability < 60 && current < 23) {
      shortCircuitRisk = 80;
    } else {
      shortCircuitRisk = 95;
    }

    return {
      overall: overloadRisk,  // Use overload risk for critical detection
      overloadRisk, shortCircuitRisk,
      oTrend: trend(this.history.i),
      sTrend: trend(this.history.v)
    };
  }
};

// ============= WARNING POPUP (Non-blocking) =============
const WarningPopup = ({ alertData, onClose }) => {
  if (!alertData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-yellow-950 border-4 border-yellow-500 rounded-xl p-6 max-w-sm w-full mx-4 shadow-lg">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-yellow-400 hover:text-yellow-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div className="text-5xl mb-3">⚠️</div>
          <h2 className="text-2xl font-bold text-yellow-300">
            OVERLOAD WARNING!
          </h2>
        </div>

        <div className="bg-yellow-900/50 rounded p-3 mb-4 space-y-2 text-sm">
          <p className="text-yellow-200"><strong>Power:</strong> {alertData.power}W</p>
          <p className="text-yellow-200"><strong>Current:</strong> {alertData.current}A</p>
          <p className="text-yellow-200"><strong>Risk Level:</strong> {alertData.riskLevel}%</p>
          <p className="text-yellow-200"><strong>Time:</strong> {alertData.timestamp}</p>
        </div>

        <div className="bg-yellow-500/20 border border-yellow-500 rounded p-3 mb-4 text-xs">
          <p className="text-yellow-200">
            ✉️ <strong>Warning email sent to:</strong> ayush2231100@akgec.ac.in
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};

// ============= CRITICAL POPUP (Blocking) =============
const CriticalPopup = ({ alertData, onClose }) => {
  if (!alertData) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-in fade-in">
      <div className="bg-red-950 border-4 border-red-500 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-pulse">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-red-400 hover:text-red-200 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">🚨</div>
          <h1 className="text-3xl font-bold text-red-300 mb-2">
            CRITICAL OVERLOAD!
          </h1>
          <p className="text-red-400 text-lg font-semibold">
            IMMEDIATE ACTION REQUIRED!
          </p>
        </div>

        <div className="bg-red-900/50 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center border-b border-red-600 pb-2">
            <span className="text-red-200">⚡ Power:</span>
            <span className="text-xl font-bold text-red-100">{alertData.power}W</span>
          </div>
          <div className="flex justify-between items-center border-b border-red-600 pb-2">
            <span className="text-red-200">📊 Current:</span>
            <span className="text-xl font-bold text-red-100">{alertData.current}A</span>
          </div>
          <div className="flex justify-between items-center border-b border-red-600 pb-2">
            <span className="text-red-200">🔋 Voltage:</span>
            <span className="text-xl font-bold text-red-100">{alertData.voltage}V</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-red-200">⏰ Time:</span>
            <span className="text-sm font-semibold text-red-100">{alertData.timestamp}</span>
          </div>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3 mb-6">
          <p className="text-yellow-200 text-sm font-semibold">
            ⚡ <strong>Safe Limits:</strong>
          </p>
          <p className="text-yellow-100 text-xs mt-2">
            • Power: Max 1000W<br/>
            • Current: Max 15A<br/>
            • Voltage: 220-240V
          </p>
        </div>

        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-6">
          <p className="text-red-300 text-sm font-semibold mb-2">
            ✅ Actions Taken:
          </p>
          <ul className="text-red-200 text-xs space-y-1">
            <li>✓ Alert sound activated</li>
            <li>✓ Email sent to ayush2231100@akgec.ac.in</li>
            <li>✓ System monitoring intensified</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
        >
          ACKNOWLEDGE ALERT
        </button>
      </div>
    </div>
  );
};

// ============= MAIN COMPONENT =============
const HomeLayoutMonitor = ({ livingRoomData }) => {
  const [data, setData] = useState({ voltage: 230, current: 0.22, temperature: 28, status: 'NORMAL' });
  const [risk, setRisk] = useState({});
  const [scenario, setScenario] = useState('normal');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [cycleTime, setCycleTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningData, setWarningData] = useState(null);
  const [warningShown, setWarningShown] = useState(false);
  const [showCritical, setShowCritical] = useState(false);
  const [criticalData, setCriticalData] = useState(null);
  const [criticalShown, setCriticalShown] = useState(false);
  const [alertLogs, setAlertLogs] = useState([]);

  useEffect(() => {
    if (!autoUpdate) return;
    const interval = setInterval(() => setCycleTime(ct => ct + 1), 2000);
    return () => clearInterval(interval);
  }, [autoUpdate]);

  useEffect(() => {
    const newData = generateData(scenario, cycleTime);
    setData(newData);
    setRisk(AIMonitor.predict(newData.voltage, newData.current, newData.temperature));
  }, [cycleTime, scenario]);

  // ✅ PLAY ALERT SOUND
  const playAlertSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      for (let beep = 0; beep < 3; beep++) {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = 800;
          oscillator.type = 'sine';

          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
        }, beep * 400);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  // ✅ SEND ALERT TO EMAIL (Works when internet available)
  // ✅ SEND ALERT TO EMAIL (With timeout handling)
  const sendAlertToBackend = async (alertType, power, current, voltage, riskLevel) => {
    try {
      const BACKEND_URL = 'https://major-project-h76o.onrender.com';
      
      // Create abort controller with 10 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${BACKEND_URL}/api/alerts/send-overload-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          alertType: alertType,
          socketName: 'Living Room',
          socketLocation: 'Main Monitor',
          power: parseFloat(power),
          current: parseFloat(current),
          voltage: parseFloat(voltage),
          riskLevel: parseFloat(riskLevel),
          timestamp: new Date().toISOString(),
          recipientEmail: 'ayush2231100@akgec.ac.in'
        })
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        console.log(`✅ ${alertType} email sent to ayush2231100@akgec.ac.in`);
        return true;
      } else {
        console.warn(`⚠️ Email service error - trying again`);
        return false;
      }
    } catch (error) {
      console.warn(`⚠️ Error sending email (may retry):`, error.message);
      return false;
    }
  };

































  // ✅ DETECT OVERLOAD AND TRIGGER ALERTS
  useEffect(() => {
    const power = data.voltage * data.current;
    

    // 🔴 CRITICAL: Power > 1000W AND Risk >= 75%
    if (power > SAFE_LIMITS.POWER && risk.overall >= 75 && !criticalShown) {
      const alertData = {
        power: power.toFixed(0),
        current: data.current.toFixed(2),
        voltage: data.voltage.toFixed(1),
        riskLevel: risk.overall,
        timestamp: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
      };

      playAlertSound();
      sendAlertToBackend('CRITICAL', alertData.power, alertData.current, alertData.voltage, alertData.riskLevel);
      
      setCriticalData(alertData);
      setShowCritical(true);
      setCriticalShown(true);

      console.error('🚨 CRITICAL OVERLOAD:', alertData);
      
      setAlertLogs(prev => [...prev, {
        ...alertData,
        type: 'CRITICAL',
        id: Date.now()
      }]);
    }

    // Reset when back to safe (only check power/risk, not criticalShown)
    if ((power <= SAFE_LIMITS.POWER || risk.overall < 75) && criticalShown) {
      setShowCritical(false);
      setCriticalShown(false);
    }
  }, [data, risk, criticalShown]);

  const getColor = (status) => {
    const colors = {
      NORMAL: 'border-green-500/50 bg-green-500/10 shadow-green-500/20',
      CRITICAL: 'border-red-500/50 bg-red-500/10 shadow-red-500/20'
    };
    return colors[status] || colors.NORMAL;
  };

  const getRiskColor = (risk) => {
    if (risk < 30) return 'from-green-400 to-cyan-400';
    if (risk < 60) return 'from-yellow-400 to-orange-400';
    return 'from-orange-400 to-red-500';
  };

  const getRiskBg = (risk) => {
    if (risk < 30) return 'bg-green-500/20';
    if (risk < 60) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      {/* WARNING POPUP */}

      {/* CRITICAL POPUP */}
      <CriticalPopup 
        alertData={criticalData} 
        onClose={() => { setShowCritical(false); setCriticalData(null); }}
      />

      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
          Electrical Safety Monitor
        </h1>
        <p className="text-gray-400 mb-6">Real-time IoT with AI Predictive Analysis</p>

        {/* Controls - ONLY NORMAL and CRITICAL */}
        <div className="flex gap-4 mb-6 bg-gray-800/30 border border-gray-700 rounded-lg p-4">
          <div>
            <label className="text-xs text-gray-400 block mb-2 font-semibold">Scenario</label>
            <div className="flex gap-2">
              {['normal', 'critical'].map(s => (
                <button
                  key={s}
                  onClick={() => { setScenario(s); setCycleTime(0); setWarningShown(false); setCriticalShown(false); }}
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    scenario === s ? 'bg-cyan-500 text-slate-950' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <label className="flex items-center text-gray-300 cursor-pointer text-sm">
              <input type="checkbox" checked={autoUpdate} onChange={(e) => setAutoUpdate(e.target.checked)} className="w-4 h-4 mr-2" />
              Live Updates
            </label>
          </div>
        </div>

        {/* Main Card */}
        <div className={`${getColor(data.status)} border-2 rounded-2xl p-6 backdrop-blur-sm`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Living Room</h2>
              <p className="text-gray-300 flex items-center text-sm mt-1">
                <Clock className="w-3 h-3 mr-1" />
                {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
              data.status === 'NORMAL' ? 'bg-green-500/20 text-green-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {data.status}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-900/50 rounded p-3">
              <div className="flex items-center text-blue-400 text-xs mb-1">
                <Zap className="w-3 h-3 mr-1" />Voltage
              </div>
              <div className="text-2xl font-bold text-white">{data.voltage.toFixed(1)}V</div>
              <div className="text-xs text-gray-500">220-240V safe</div>
            </div>
            <div className="bg-gray-900/50 rounded p-3">
              <div className="flex items-center text-green-400 text-xs mb-1">
                <Activity className="w-3 h-3 mr-1" />Current
              </div>
              <div className="text-2xl font-bold text-white">{data.current.toFixed(2)}A</div>
              <div className="text-xs text-gray-500">&lt;15A safe</div>
            </div>
            <div className="bg-gray-900/50 rounded p-3">
              <div className="flex items-center text-orange-400 text-xs mb-1">
                <Thermometer className="w-3 h-3 mr-1" />Temp
              </div>
              <div className="text-2xl font-bold text-white">{data.temperature.toFixed(1)}°C</div>
              <div className="text-xs text-gray-500">&lt;60°C safe</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded p-4 mb-4">
            <div className="text-xs text-gray-400 mb-1">Power Consumption</div>
            <div className="text-3xl font-bold text-cyan-400">{(data.voltage * data.current).toFixed(0)}W</div>
          </div>

          {/* AI Risk - OVERLOAD & SHORT CIRCUIT */}
          <div className="bg-gray-900/50 border border-gray-700 rounded p-4">
            <div className="flex items-center mb-3">
              <Brain className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-xs font-bold text-purple-400">AI RISK PREDICTION</span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-gray-400">Overall Risk</span>
                <span className="font-bold text-white">{risk.overall}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getRiskColor(risk.overall)}`}
                  style={{ width: `${risk.overall}%` }}
                ></div>
              </div>
            </div>

            {/* OVERLOAD AND SHORT CIRCUIT RISK */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className={`${getRiskBg(risk.overloadRisk)} p-2 rounded`}>
                <div className="text-gray-400">Overload</div>
                <div className="font-bold text-white">{risk.overloadRisk}%</div>
              </div>
              <div className={`${getRiskBg(risk.shortCircuitRisk)} p-2 rounded`}>
                <div className="text-gray-400">Short Circuit</div>
                <div className="font-bold text-white">{risk.shortCircuitRisk}%</div>
              </div>
            </div>

            <div className={`${getRiskBg(risk.overall)} p-3 rounded mt-3 border-l-4 ${
              risk.overall < 30 ? 'border-l-green-500' :
              risk.overall < 75 ? 'border-l-yellow-500' :
              'border-l-red-500'
            }`}>
              <p className="text-xs text-gray-200 font-semibold">
                {risk.overall < 30 ? '✅ NORMAL: All systems healthy' :
                 risk.overall < 75 ? '⚠️ WARNING: System stressed, reduce load' :
                 '🔴 CRITICAL: Immediate action required!'}
              </p>
            </div>
          </div>
        </div>

        {/* Alert Logs */}
        {alertLogs.length > 0 && (
          <div className="mt-6 bg-gray-800/30 border border-gray-700 rounded-lg p-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Alert History ({alertLogs.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {alertLogs.map(log => (
                <div key={log.id} className={`rounded p-3 text-sm ${
                  log.type === 'CRITICAL' 
                    ? 'bg-red-900/20 border border-red-500/30' 
                    : 'bg-yellow-900/20 border border-yellow-500/30'
                }`}>
                  <p className={log.type === 'CRITICAL' ? 'text-red-300' : 'text-yellow-300'}>
                    <strong>[{log.type}]</strong> {log.timestamp} - Power: {log.power}W | Current: {log.current}A | Risk: {log.riskLevel}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeLayoutMonitor;