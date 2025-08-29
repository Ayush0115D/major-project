import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const RoomCard = ({ room }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'border-red-500 bg-gradient-to-br from-red-950/50 to-red-900/30'
      case 'warning': return 'border-amber-500 bg-gradient-to-br from-amber-950/50 to-amber-900/30'
      default: return 'border-emerald-500 bg-gradient-to-br from-emerald-950/50 to-emerald-900/30'
    }
  }

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-400'
      case 'warning': return 'text-amber-400'
      default: return 'text-emerald-400'
    }
  }

  return (
    <div className={`rounded-xl border-2 p-6 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl ${getStatusColor(room.status)}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{room.name}</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide ${getStatusTextColor(room.status)} bg-black/30`}>
          {room.status}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{room.voltage}V</div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">Voltage</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{room.current}A</div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">Current</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">{room.power}W</div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">Power</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-300">
          <span className="text-orange-400">{room.temperature}°C</span>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Updated: {room.lastUpdate.toLocaleTimeString()}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs text-gray-400 mb-2">Connected Devices:</div>
        <div className="flex flex-wrap gap-1">
          {room.devices.map((device, index) => (
            <span key={index} className="px-2 py-1 bg-gray-800/60 text-gray-300 text-xs rounded-full">
              {device}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const AlertPanel = ({ alerts }) => {
  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-950/30'
      case 'warning': return 'border-amber-500 bg-amber-950/30'
      default: return 'border-blue-500 bg-blue-950/30'
    }
  }

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
      <h3 className="text-xl font-bold text-white mb-4">System Alerts</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.filter(alert => !alert.resolved).map((alert) => (
          <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">{alert.room}</span>
              <span className="text-xs text-gray-400">
                {alert.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-gray-300">{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const SystemStatus = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-sm border border-blue-600/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-blue-400 text-sm font-medium uppercase tracking-wide">Total Power</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.totalPower}W</p>
          </div>
          <div className="text-blue-400 text-3xl">⚡</div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-purple-400 text-sm font-medium uppercase tracking-wide">Avg Voltage</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.avgVoltage}V</p>
          </div>
          <div className="text-purple-400 text-3xl">🔌</div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 backdrop-blur-sm border border-cyan-600/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-cyan-400 text-sm font-medium uppercase tracking-wide">Total Current</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.totalCurrent}A</p>
          </div>
          <div className="text-cyan-400 text-3xl">🔋</div>
        </div>
      </div>
      
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

const Dashboard = () => {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: 'Living Room',
      status: 'normal',
      voltage: 230,
      current: 2.5,
      power: 575,
      temperature: 24,
      lastUpdate: new Date(),
      devices: ['LED Lights', 'TV', 'Air Conditioner'],
      coordinates: { x: 20, y: 30 }
    },
    {
      id: 2,
      name: 'Kitchen',
      status: 'warning',
      voltage: 225,
      current: 8.2,
      power: 1845,
      temperature: 28,
      lastUpdate: new Date(),
      devices: ['Refrigerator', 'Microwave', 'Dishwasher'],
      coordinates: { x: 60, y: 30 }
    },
    {
      id: 3,
      name: 'Bedroom',
      status: 'normal',
      voltage: 232,
      current: 1.8,
      power: 418,
      temperature: 22,
      lastUpdate: new Date(),
      devices: ['Ceiling Fan', 'Lamp', 'Charger'],
      coordinates: { x: 20, y: 70 }
    },
    {
      id: 4,
      name: 'Bathroom',
      status: 'critical',
      voltage: 180,
      current: 12.5,
      power: 2250,
      temperature: 26,
      lastUpdate: new Date(),
      devices: ['Water Heater', 'Exhaust Fan', 'Lights'],
      coordinates: { x: 60, y: 70 }
    }
  ])

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      room: 'Bathroom',
      type: 'critical',
      message: 'Short circuit detected! Immediate attention required.',
      timestamp: new Date(Date.now() - 300000),
      resolved: false
    },
    {
      id: 2,
      room: 'Kitchen',
      type: 'warning',
      message: 'High current consumption detected.',
      timestamp: new Date(Date.now() - 600000),
      resolved: false
    },
    {
      id: 3,
      room: 'Living Room',
      type: 'info',
      message: 'System maintenance completed successfully.',
      timestamp: new Date(Date.now() - 1800000),
      resolved: true
    }
  ])

  const [powerData, setPowerData] = useState([])
  const [systemStats, setSystemStats] = useState({
    totalPower: 0,
    avgVoltage: 0,
    totalCurrent: 0,
    efficiency: 98.5
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms(prevRooms => {
        const updatedRooms = prevRooms.map(room => {
          let newVoltage = room.voltage + (Math.random() - 0.5) * 5
          let newCurrent = Math.max(0.1, room.current + (Math.random() - 0.5) * 1)
          
          if (room.status === 'critical') {
            newVoltage = Math.max(160, newVoltage - Math.random() * 20)
            newCurrent = Math.min(15, newCurrent + Math.random() * 2)
          }
          
          return {
            ...room,
            voltage: Math.round(newVoltage * 10) / 10,
            current: Math.round(newCurrent * 10) / 10,
            power: Math.round(newVoltage * newCurrent),
            lastUpdate: new Date()
          }
        })

        const totalPower = updatedRooms.reduce((sum, room) => sum + room.power, 0)
        const avgVoltage = updatedRooms.reduce((sum, room) => sum + room.voltage, 0) / updatedRooms.length
        const totalCurrent = updatedRooms.reduce((sum, room) => sum + room.current, 0)

        setSystemStats({
          totalPower: Math.round(totalPower),
          avgVoltage: Math.round(avgVoltage * 10) / 10,
          totalCurrent: Math.round(totalCurrent * 10) / 10,
          efficiency: Math.max(85, Math.min(100, 98.5 + (Math.random() - 0.5) * 2))
        })

        return updatedRooms
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Generate power consumption chart data
  useEffect(() => {
    const generatePowerData = () => {
      const data = []
      const now = new Date()
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000)
        const totalPower = rooms.reduce((sum, room) => {
          return sum + room.power + (Math.random() - 0.5) * 200
        }, 0)
        
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          power: Math.max(500, totalPower)
        })
      }
      
      setPowerData(data)
    }

    generatePowerData()
    const interval = setInterval(generatePowerData, 60000)

    return () => clearInterval(interval)
  }, [rooms])

  const criticalAlerts = alerts.filter(alert => !alert.resolved && alert.type === 'critical')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Smart Home Monitor
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Advanced electrical system monitoring & control</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-800/60 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-600">
              <span className="text-sm text-gray-400">Last Updated:</span>
              <span className="ml-2 font-medium text-white">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-medium">System Online</span>
            </div>
          </div>
        </div>

        {/* System Status Overview */}
        <SystemStatus stats={systemStats} />

        {/* Critical Alerts Banner */}
        {criticalAlerts.length > 0 && (
          <div className="bg-gradient-to-r from-red-900/40 to-red-800/20 border-2 border-red-500/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse"></div>
                <h3 className="text-red-400 font-bold text-lg">⚠️ CRITICAL SYSTEM ALERT</h3>
              </div>
              <span className="text-red-300 font-medium">
                {criticalAlerts.length} issue(s) require immediate attention
              </span>
            </div>
          </div>
        )}

        {/* Room Grid and Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Room Cards */}
          <div className="xl:col-span-3">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Room Status</h2>
              <p className="text-gray-400">Real-time monitoring of electrical parameters across all zones</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </div>

          {/* Alert Panel */}
          <div className="xl:col-span-1">
            <AlertPanel alerts={alerts} />
          </div>
        </div>

        {/* Power Consumption Chart */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Power Consumption Analytics</h3>
              <p className="text-gray-400">24-hour power usage trends across all monitored zones</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {systemStats.totalPower}W
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Current Total</div>
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={powerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value) => [`${value}W`, 'Power']}
                  labelFormatter={(label) => `Time: ${label}`}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="power" 
                  stroke="url(#gradient)"
                  strokeWidth={3}
                  dot={false}
                  filter="drop-shadow(0 0 6px #3B82F6)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* House Layout Visualization */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white">House Layout Monitor</h3>
            <p className="text-gray-400">Interactive visual representation of all monitored zones</p>
          </div>
          <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-700/20 rounded-xl h-[500px] overflow-hidden border border-gray-600">
            {/* House outline */}
            <div className="absolute inset-6 border-2 border-gray-500 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-sm">
              {/* Room representations */}
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`absolute w-36 h-28 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10 ${
                    room.status === 'critical' 
                      ? 'border-red-400 bg-gradient-to-br from-red-950/60 to-red-900/40 shadow-red-500/50 shadow-xl' 
                      : room.status === 'warning'
                      ? 'border-amber-400 bg-gradient-to-br from-amber-950/60 to-amber-900/40 shadow-amber-500/50 shadow-xl'
                      : 'border-emerald-400 bg-gradient-to-br from-emerald-950/60 to-emerald-900/40 shadow-emerald-500/50 shadow-lg'
                  }`}
                  style={{
                    left: `${room.coordinates.x}%`,
                    top: `${room.coordinates.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="p-3 h-full flex flex-col justify-center items-center text-center">
                    <h4 className="font-bold text-white text-sm mb-1">{room.name}</h4>
                    <div className={`text-xs font-medium ${
                      room.status === 'critical' ? 'text-red-300' :
                      room.status === 'warning' ? 'text-amber-300' : 'text-emerald-300'
                    }`}>
                      {room.voltage}V | {room.current}A
                    </div>
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      room.status === 'critical' ? 'bg-red-400 animate-pulse shadow-lg shadow-red-500/50' :
                      room.status === 'warning' ? 'bg-amber-400 shadow-lg shadow-amber-500/50' : 'bg-emerald-400 shadow-lg shadow-emerald-500/50'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard