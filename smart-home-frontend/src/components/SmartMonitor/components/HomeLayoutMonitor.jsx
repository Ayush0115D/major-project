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
    const vary = (val, range) => val + (Math.random() - 0.5) * range;
    return {
      voltage: vary(230, 4),
      current: Math.max(0.2, vary(0.22, 0.06)),
      temperature: vary(28, 3),
      status: 'NORMAL'
    };
  }

  return {
    voltage: 230 + Math.sin(cycleTime / 15) * 35,
    current: 5.2 + cycleTime * 0.015,
    temperature: 70 + cycleTime * 0.4,
    status: 'CRITICAL'
  };
};

// ============= AI ENGINE =============
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

    let overloadRisk;
    const power = voltage * current;
    
    if (power <= 1000) {
      overloadRisk = 5;
    } else if (power < 1200) {
      overloadRisk = 15;
    } else if (power >= 1200 && power < 1250) {
      overloadRisk = 80;
    } else if (power >= 1250 && power < 1300) {
      overloadRisk = 83;
    } else if (power >= 1300 && power < 1350) {
      overloadRisk = 85;
    } else if (power >= 1350 && power < 1400) {
      overloadRisk = 88;
    } else if (power >= 1400 && power < 1450) {
      overloadRisk = 91;
    } else if (power >= 1450 && power < 1500) {
      overloadRisk = 95;
    } else if (power >= 1500) {
      overloadRisk = 99;
    } else {
      overloadRisk = 5;
    }

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
      overall: overloadRisk,
      overloadRisk,
      shortCircuitRisk
    };
  }
};

// ============= MEDIUM OVERLOAD POPUP (Non-blocking) =============
const OverloadPopup = ({ alertData, onClose, onAcknowledge }) => {
  if (!alertData) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-red-950 border-3 border-red-500 rounded-xl p-6 max-w-sm w-96 shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <div className="text-4xl">🚨</div>
          <button 
            onClick={onClose}
            className="text-red-400 hover:text-red-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-xl font-bold text-red-300 mb-2">
          OVERLOAD DETECTED!
        </h2>
        <p className="text-red-400 text-sm mb-4">
          Immediate action required
        </p>

        <div className="bg-red-900/50 rounded p-3 mb-4 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-red-200">⚡ Power:</span>
            <span className="font-bold text-white">{alertData.power}W</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-200">📊 Current:</span>
            <span className="font-bold text-white">{alertData.current}A</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-200">🔋 Voltage:</span>
            <span className="font-bold text-white">{alertData.voltage}V</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-200">⏱️ Risk:</span>
            <span className="font-bold text-red-300">{alertData.riskLevel}%</span>
          </div>
        </div>

        <div className="bg-red-500/20 border border-red-500 rounded p-2 mb-4 text-xs">
          <p className="text-red-300">
            ✅ <strong>Actions:</strong><br/>
            • Alert sound activated<br/>
            • Email sent to ayush2231100@akgec.ac.in<br/>
            • System monitoring intensified
          </p>
        </div>

        <button
          onClick={onAcknowledge}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
        >
          ACKNOWLEDGE
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
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [popupShown, setPopupShown] = useState(false);

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

  // ✅ SEND ALERT TO BACKEND (Works on both local and deployed)
  const sendAlertToBackend = async (alertData) => {
    try {
      // Detect if running locally or on deployed Vercel
      const BACKEND_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000'
        : 'https://major-project-h76o.onrender.com';
      
      console.log('🌐 Using backend:', BACKEND_URL);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${BACKEND_URL}/api/alerts/send-overload-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          socketName: 'Living Room',
          socketLocation: 'Main Monitor',
          power: parseFloat(alertData.power),
          current: parseFloat(alertData.current),
          voltage: parseFloat(alertData.voltage),
          riskLevel: parseFloat(alertData.riskLevel),
          temperature: alertData.temperature,
          overloadRisk: alertData.overloadRisk,
          shortCircuitRisk: alertData.shortCircuitRisk,
          timestamp: new Date().toISOString(),
          recipientEmail: 'ayush2231100@akgec.ac.in'
        })
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Alert saved to DB:', result.alertId);
        return true;
      } else {
        console.warn('⚠️ Backend error');
        return false;
      }
    } catch (error) {
      console.warn('⚠️ Error sending alert:', error.message);
      return false;
    }
  };

  // ✅ DETECT OVERLOAD AND TRIGGER POPUP
  useEffect(() => {
    const power = data.voltage * data.current;

    if (power > SAFE_LIMITS.POWER && risk.overall >= 75 && !popupShown) {
      const alertData = {
        power: power.toFixed(0),
        current: data.current.toFixed(2),
        voltage: data.voltage.toFixed(1),
        temperature: data.temperature.toFixed(1),
        riskLevel: risk.overall,
        overloadRisk: risk.overloadRisk,
        shortCircuitRisk: risk.shortCircuitRisk,
        timestamp: new Date().toLocaleTimeString()
      };

      playAlertSound();
      sendAlertToBackend(alertData);
      
      setPopupData(alertData);
      setShowPopup(true);
      setPopupShown(true);

      console.error('🚨 CRITICAL OVERLOAD:', alertData);
    }

    // Reset when back to safe
    if ((power <= SAFE_LIMITS.POWER || risk.overall < 75) && popupShown) {
      setShowPopup(false);
      setPopupShown(false);
    }
  }, [data, risk, popupShown]);

  const handleAcknowledge = () => {
    setShowPopup(false);
    setPopupData(null);
  };

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
      {/* OVERLOAD POPUP */}
      <OverloadPopup 
        alertData={popupData}
        onClose={() => setShowPopup(false)}
        onAcknowledge={handleAcknowledge}
      />

      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
          Electrical Safety Monitor
        </h1>
        <p className="text-gray-400 mb-6">Real-time IoT with AI Predictive Analysis</p>

        {/* Controls */}
        <div className="flex gap-4 mb-6 bg-gray-800/30 border border-gray-700 rounded-lg p-4">
          <div>
            <label className="text-xs text-gray-400 block mb-2 font-semibold">Scenario</label>
            <div className="flex gap-2">
              {['normal', 'critical'].map(s => (
                <button
                  key={s}
                  onClick={() => { setScenario(s); setCycleTime(0); setPopupShown(false); }}
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

        {/* Main Card - Medium Size */}
        <div className={`${getColor(data.status)} border-2 rounded-xl p-6 backdrop-blur-sm max-w-3xl`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-2xl font-bold text-white">Living Room</h2>
              <p className="text-gray-400 text-sm mt-1">
                <Clock className="w-3 h-3 inline mr-1" />
                {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-bold ${
              data.status === 'NORMAL' ? 'bg-green-500/20 text-green-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {data.status}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-gray-900/50 rounded p-3">
              <div className="text-blue-400 text-xs mb-1 flex items-center">
                <Zap className="w-3 h-3 mr-1" />Voltage
              </div>
              <div className="text-3xl font-bold text-white">{data.voltage.toFixed(1)}V</div>
              <div className="text-xs text-gray-500">safe</div>
            </div>
            <div className="bg-gray-900/50 rounded p-3">
              <div className="text-green-400 text-xs mb-1 flex items-center">
                <Activity className="w-3 h-3 mr-1" />Current
              </div>
              <div className="text-3xl font-bold text-white">{data.current.toFixed(2)}A</div>
              <div className="text-xs text-gray-500">safe</div>
            </div>
            <div className="bg-gray-900/50 rounded p-3">
              <div className="text-orange-400 text-xs mb-1 flex items-center">
                <Thermometer className="w-3 h-3 mr-1" />Temp
              </div>
              <div className="text-3xl font-bold text-white">{data.temperature.toFixed(1)}°C</div>
              <div className="text-xs text-gray-500">safe</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded p-4 mb-4">
            <div className="text-xs text-gray-400">Power Consumption</div>
            <div className="text-4xl font-bold text-cyan-400">{(data.voltage * data.current).toFixed(0)}W</div>
          </div>

          {/* AI Risk */}
          <div className="bg-gray-900/50 border border-gray-700 rounded p-4">
            <div className="flex items-center mb-3">
              <Brain className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-sm font-bold text-purple-400">AI RISK PREDICTION</span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-gray-400">Overall Risk</span>
                <span className="font-bold text-white text-sm">{risk.overall}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getRiskColor(risk.overall)}`}
                  style={{ width: `${risk.overall}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className={`${getRiskBg(risk.overloadRisk)} p-3 rounded`}>
                <div className="text-gray-400">Overload Risk</div>
                <div className="font-bold text-lg">{risk.overloadRisk}%</div>
              </div>
              <div className={`${getRiskBg(risk.shortCircuitRisk)} p-3 rounded`}>
                <div className="text-gray-400">Short Circuit Risk</div>
                <div className="font-bold text-lg">{risk.shortCircuitRisk}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLayoutMonitor;