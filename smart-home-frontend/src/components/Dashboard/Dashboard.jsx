import React, { useState, useEffect } from 'react'
import RoomCard from './RoomCard'
import AlertPanel from './AlertPanel'
import SystemStatus from './SystemStatus'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      resolved: false
    },
    {
      id: 2,
      room: 'Kitchen',
      type: 'warning',
      message: 'High current consumption detected.',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      resolved: false
    },
    {
      id: 3,
      room: 'Living Room',
      type: 'info',
      message: 'System maintenance completed successfully.',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
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
          
          // Simulate short circuit detection
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

        // Update system stats
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
    const interval = setInterval(generatePowerData, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [rooms])

  const criticalAlerts = alerts.filter(alert => !alert.resolved && alert.type === 'critical')
  const warningAlerts = alerts.filter(alert => !alert.resolved && alert.type === 'warning')

  return (
    <div className="space-y-6 pt-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your smart home electrical systems</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span className="text-sm text-gray-500">Last Updated:</span>
            <span className="ml-2 font-medium">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* System Status Overview */}
      <SystemStatus stats={systemStats} />

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
              <h3 className="text-red-800 font-medium">Critical Alert Active</h3>
            </div>
            <span className="text-red-600 text-sm">{criticalAlerts.length} issue(s) require immediate attention</span>
          </div>
        </div>
      )}

      {/* Room Grid and Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Room Cards - Takes 3/4 width on xl screens */}
        <div className="xl:col-span-3">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Room Status</h2>
            <p className="text-gray-600 text-sm">Real-time monitoring of electrical parameters</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>

        {/* Alert Panel - Takes 1/4 width on xl screens */}
        <div className="xl:col-span-1">
          <AlertPanel alerts={alerts} />
        </div>
      </div>

      {/* Power Consumption Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Power Consumption (24 Hours)</h3>
            <p className="text-sm text-gray-600">Total power usage across all rooms</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{systemStats.totalPower}W</div>
            <div className="text-sm text-gray-500">Current Total</div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={powerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value}W`, 'Power']}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="power" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* House Layout Visualization */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">House Layout</h3>
          <p className="text-sm text-gray-600">Visual representation of room statuses</p>
        </div>
        <div className="relative bg-gray-50 rounded-lg h-96 overflow-hidden">
          {/* House outline */}
          <div className="absolute inset-4 border-2 border-gray-300 rounded-lg bg-white">
            {/* Room representations */}
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`absolute w-32 h-24 rounded border-2 cursor-pointer transition-all hover:scale-105 ${
                  room.status === 'critical' 
                    ? 'border-red-400 bg-red-50 shadow-red-200 shadow-lg' 
                    : room.status === 'warning'
                    ? 'border-yellow-400 bg-yellow-50 shadow-yellow-200 shadow-lg'
                    : 'border-green-400 bg-green-50 shadow-green-200 shadow-sm'
                }`}
                style={{
                  left: `${room.coordinates.x}%`,
                  top: `${room.coordinates.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="p-2 h-full flex flex-col justify-center items-center">
                  <h4 className="font-medium text-sm text-center">{room.name}</h4>
                  <div className={`text-xs mt-1 ${
                    room.status === 'critical' ? 'text-red-600' :
                    room.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {room.voltage}V | {room.current}A
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-1 ${
                    room.status === 'critical' ? 'bg-red-500 animate-pulse' :
                    room.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard