import React from 'react'

const SystemStatus = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Total Power */}
      <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-sm border border-blue-600/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-blue-400 text-sm font-medium uppercase tracking-wide">Total Power</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.totalPower}W</p>
          </div>
          <div className="text-blue-400 text-3xl">⚡</div>
        </div>
      </div>
      
      {/* Avg Voltage */}
      <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-purple-400 text-sm font-medium uppercase tracking-wide">Avg Voltage</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.avgVoltage}V</p>
          </div>
          <div className="text-purple-400 text-3xl">🔌</div>
        </div>
      </div>
      
      {/* Total Current */}
      <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 backdrop-blur-sm border border-cyan-600/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-cyan-400 text-sm font-medium uppercase tracking-wide">Total Current</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.totalCurrent}A</p>
          </div>
          <div className="text-cyan-400 text-3xl">🔋</div>
        </div>
      </div>
      
      {/* Efficiency */}
      <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 backdrop-blur-sm border border-emerald-600/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-emerald-400 text-sm font-medium uppercase tracking-wide">Efficiency</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.efficiency.toFixed(1)}%</p>
          </div>
          <div className="text-emerald-400 text-3xl">📊</div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus
