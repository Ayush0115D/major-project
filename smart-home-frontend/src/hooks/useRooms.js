import { useState, useEffect, useCallback } from 'react'
import { roomsAPI } from '../services/api'
import { determineRoomStatus, generateRandomData } from '../utils/helpers'
import { DEFAULT_ROOMS, UPDATE_INTERVALS } from '../utils/constants'

export const useRooms = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  // Initialize rooms with default data
  const initializeRooms = useCallback(() => {
    const initialRooms = DEFAULT_ROOMS.map(room => ({
      ...room,
      status: 'normal',
      voltage: 230 + Math.random() * 10 - 5,
      current: 2 + Math.random() * 3,
      power: 0,
      temperature: 22 + Math.random() * 6,
      lastUpdate: new Date(),
      isOnline: true
    }))

    // Calculate power for each room
    initialRooms.forEach(room => {
      room.power = Math.round(room.voltage * room.current)
      room.status = determineRoomStatus(room.voltage, room.current, room.temperature)
    })

    setRooms(initialRooms)
    setLastUpdate(new Date())
    setLoading(false)
  }, [])

  // Fetch rooms from API
  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await roomsAPI.getRooms()
      setRooms(response.data || [])
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Failed to fetch rooms:', err)
      setError(err.message)
      // Fall back to simulated data
      initializeRooms()
    } finally {
      setLoading(false)
    }
  }, [initializeRooms])

  // Update room data (simulated real-time updates)
  const updateRoomData = useCallback(() => {
    setRooms(prevRooms => {
      return prevRooms.map(room => {
        // Generate realistic variations
        let newVoltage = generateRandomData(room.voltage, 0.02)
        let newCurrent = generateRandomData(room.current, 0.1)
        let newTemperature = generateRandomData(room.temperature, 0.02)

        // Simulate short circuit conditions for demo
        if (room.id === 4 && Math.random() > 0.7) {
          newVoltage = Math.max(160, newVoltage - Math.random() * 30)
          newCurrent = Math.min(15, newCurrent + Math.random() * 3)
        }

        // Simulate high load conditions
        if (room.id === 2 && Math.random() > 0.8) {
          newCurrent = Math.min(12, newCurrent + Math.random() * 2)
        }

        // Calculate new power and status
        const newPower = Math.round(newVoltage * newCurrent)
        const newStatus = determineRoomStatus(newVoltage, newCurrent, newTemperature)

        return {
          ...room,
          voltage: Math.round(newVoltage * 10) / 10,
          current: Math.round(newCurrent * 10) / 10,
          power: newPower,
          temperature: Math.round(newTemperature * 10) / 10,
          status: newStatus,
          lastUpdate: new Date(),
          isOnline: Math.random() > 0.05 // 95% uptime simulation
        }
      })
    })
    setLastUpdate(new Date())
  }, [])

  // Get room by ID
  const getRoomById = useCallback((roomId) => {
    return rooms.find(room => room.id === parseInt(roomId))
  }, [rooms])

  // Update specific room
  const updateRoom = useCallback(async (roomId, updates) => {
    try {
      const response = await roomsAPI.updateRoom(roomId, updates)
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId ? { ...room, ...response.data } : room
        )
      )
      return response.data
    } catch (err) {
      console.error('Failed to update room:', err)
      setError(err.message)
      throw err
    }
  }, [])

  // Reset room status
  const resetRoomStatus = useCallback(async (roomId) => {
    try {
      await roomsAPI.resetRoom(roomId)
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId 
            ? { ...room, status: 'normal', lastUpdate: new Date() }
            : room
        )
      )
    } catch (err) {
      console.error('Failed to reset room:', err)
      setError(err.message)
    }
  }, [])

  // Get room statistics
  const getRoomStats = useCallback(() => {
    if (!rooms.length) return null

    const totalPower = rooms.reduce((sum, room) => sum + room.power, 0)
    const avgVoltage = rooms.reduce((sum, room) => sum + room.voltage, 0) / rooms.length
    const totalCurrent = rooms.reduce((sum, room) => sum + room.current, 0)
    const avgTemperature = rooms.reduce((sum, room) => sum + room.temperature, 0) / rooms.length

    const statusCounts = rooms.reduce((counts, room) => {
      counts[room.status] = (counts[room.status] || 0) + 1
      return counts
    }, {})

    return {
      totalPower: Math.round(totalPower),
      avgVoltage: Math.round(avgVoltage * 10) / 10,
      totalCurrent: Math.round(totalCurrent * 10) / 10,
      avgTemperature: Math.round(avgTemperature * 10) / 10,
      statusCounts,
      onlineCount: rooms.filter(room => room.isOnline).length,
      totalRooms: rooms.length
    }
  }, [rooms])

  // Initialize and start real-time updates
  useEffect(() => {
    // Try to fetch from API, fall back to simulation
    fetchRooms()

    // Set up real-time updates
    const updateInterval = setInterval(updateRoomData, UPDATE_INTERVALS.NORMAL)

    return () => {
      clearInterval(updateInterval)
    }
  }, [fetchRooms, updateRoomData])

  return {
    rooms,
    loading,
    error,
    lastUpdate,
    fetchRooms,
    updateRoom,
    resetRoomStatus,
    getRoomById,
    getRoomStats,
    refreshData: fetchRooms
  }
}