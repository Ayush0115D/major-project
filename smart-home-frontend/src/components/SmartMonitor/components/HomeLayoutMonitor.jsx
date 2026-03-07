import React, { useState, useEffect } from 'react';
import { Thermometer, Zap, Activity, Brain, TrendingUp, Clock } from 'lucide-react';

// ============= DATA GENERATOR =============
const generateData = (scenario, cycleTime) => {
  const baseV = 230, baseT = 28;
  const timePhase = Math.floor((cycleTime % 300) / 60) % 5;
  const timeMaps = ['morning', 'midday', 'afternoon', 'evening', 'night'];
  const baseData = {
    morning: { v: 228, i: 3, t: 26 },
    midday: { v: 230, i: 7, t: 32 },
    afternoon: { v: 225, i: 12, t: 38 },
    evening: { v: 223, i: 15, t: 35 },
    night: { v: 232, i: 2, t: 24 }
  }[timeMaps[timePhase]];

  if (scenario === 'normal') {
    const vary = (val, range) => val + (Math.random() - 0.5) * range;
    return {
      voltage: vary(baseData.v, 4),
      current: Math.max(0.5, vary(baseData.i, 1)),
      temperature: vary(baseData.t, 3),
      status: 'NORMAL'
    };
  }

  if (scenario === 'warning') {
    return {
      voltage: baseData.v + Math.sin(cycleTime / 20) * 12,
      current: baseData.i + cycleTime * 0.02,
      temperature: baseData.t + 15 + cycleTime * 0.05,
      status: 'WARNING'
    };
  }

  return {
    voltage: 230 + Math.sin(cycleTime / 15) * 35,
    current: Math.min(20, 18 + Math.sin(cycleTime / 12) * 2),
    temperature: Math.min(90, 45 + cycleTime * 0.15),
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

    const trend = (arr) => {
      if (arr.length < 2) return 0;
      const recent = arr.slice(-10).reduce((a, b) => a + b, 0) / 10;
      const old = arr.slice(-20, -10).reduce((a, b) => a + b, 0) / 10 || recent;
      return ((recent - old) * 100).toFixed(2);
    };

    const vRisk = voltage < 200 || voltage > 250 ? 40 : voltage < 190 || voltage > 260 ? 70 : 10;
    const iRisk = current > 18 ? 50 : current > 15 ? 30 : 10;
    const tRisk = temp > 75 ? 60 : temp > 60 ? 30 : 10;

    return {
      overall: Math.round((vRisk + iRisk + tRisk) / 3),
      vRisk, iRisk, tRisk,
      vTrend: trend(this.history.v),
      iTrend: trend(this.history.i),
      tTrend: trend(this.history.t)
    };
  }
};



// ============= MAIN COMPONENT =============
const HomeLayoutMonitor = () => {
  const [data, setData] = useState({ voltage: 230, current: 8, temperature: 28, status: 'NORMAL' });
  const [risk, setRisk] = useState({});
  const [scenario, setScenario] = useState('normal');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [cycleTime, setCycleTime] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!autoUpdate) return;
    const interval = setInterval(() => setCycleTime(ct => ct + 1), 2000);
    return () => clearInterval(interval);
  }, [autoUpdate]);

  useEffect(() => {
    const newData = generateData(scenario, cycleTime);
    setData(newData);
    setRisk(AIMonitor.predict(newData.voltage, newData.current, newData.temperature));
    
    setHistory(prev => {
      const power = newData.voltage * newData.current;
      const updated = [...prev, { power, voltage: newData.voltage, current: newData.current, temp: newData.temperature }];
      return updated.slice(-30);
    });
  }, [cycleTime, scenario]);

  const getColor = (status) => {
    const colors = {
      NORMAL: 'border-green-500/50 bg-green-500/10 shadow-green-500/20',
      WARNING: 'border-yellow-500/50 bg-yellow-500/10 shadow-yellow-500/20',
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
              {['normal', 'warning', 'critical'].map(s => (
                <button
                  key={s}
                  onClick={() => { setScenario(s); setCycleTime(0); setHistory([]); }}
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

        {/* Power Timeline Removed */}

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
              data.status === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400' :
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
              <div className="text-2xl font-bold text-white">{data.current.toFixed(1)}A</div>
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

          {/* AI Risk */}
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

            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
              <div className={`${getRiskBg(risk.vRisk)} p-2 rounded`}>
                <div className="text-gray-400">Voltage</div>
                <div className="font-bold text-white">{risk.vRisk}%</div>
              </div>
              <div className={`${getRiskBg(risk.iRisk)} p-2 rounded`}>
                <div className="text-gray-400">Overload</div>
                <div className="font-bold text-white">{risk.iRisk}%</div>
              </div>
              <div className={`${getRiskBg(risk.tRisk)} p-2 rounded`}>
                <div className="text-gray-400">Thermal</div>
                <div className="font-bold text-white">{risk.tRisk}%</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-gray-800/50 p-2 rounded text-center">
                <div className="text-gray-400">V</div>
                <div className={`font-bold ${risk.vTrend > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                  {risk.vTrend > 0 ? '↑' : '↓'} {Math.abs(risk.vTrend)}%
                </div>
              </div>
              <div className="bg-gray-800/50 p-2 rounded text-center">
                <div className="text-gray-400">I</div>
                <div className={`font-bold ${risk.iTrend > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                  {risk.iTrend > 0 ? '↑' : '↓'} {Math.abs(risk.iTrend)}%
                </div>
              </div>
              <div className="bg-gray-800/50 p-2 rounded text-center">
                <div className="text-gray-400">T</div>
                <div className={`font-bold ${risk.tTrend > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                  {risk.tTrend > 0 ? '↑' : '↓'} {Math.abs(risk.tTrend)}%
                </div>
              </div>
            </div>

            <div className={`${getRiskBg(risk.overall)} p-3 rounded mt-3 border-l-4 ${
              risk.overall < 30 ? 'border-l-green-500' :
              risk.overall < 60 ? 'border-l-yellow-500' :
              'border-l-red-500'
            }`}>
              <p className="text-xs text-gray-200 font-semibold">
                {risk.overall < 30 ? '✅ NORMAL: All systems healthy' :
                 risk.overall < 60 ? '⚠️ WARNING: System stressed, reduce load' :
                 '🔴 CRITICAL: Immediate action required!'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          📚 Academic Project • Data patterns based on real electrical behavior • Perfect for educational demonstration
        </div>
      </div>
    </div>
  );
};

export default HomeLayoutMonitor;