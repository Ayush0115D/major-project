import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export const useSmartMonitorData = () => {
  const [roomData, setRoomData] = useState({
    'living-room': {
      id: 'living-room',
      name: 'Living Room',
      temperature: 24.5,
      humidity: 45,
      powerConsumption: 0,
      status: 'normal',
      components: [
        { id: 'load1', name: 'Load 1', type: 'appliance', power: 0, voltage: 230, current: 0, status: 'off', location: 'circuit-1', fault: false },
        { id: 'load2', name: 'Load 2', type: 'appliance', power: 0, voltage: 230, current: 0, status: 'off', location: 'circuit-2', fault: false },
        { id: 'load3', name: 'Load 3', type: 'appliance', power: 0, voltage: 230, current: 0, status: 'off', location: 'circuit-3', fault: false }
      ],
      lastUpdated: new Date().toISOString()
    }
  });

  const [alerts, setAlerts] = useState([]);

  const [systemStats, setSystemStats] = useState({
    totalPower: 0,
    totalVoltage: 230,
    totalCurrent: 0,
    efficiency: 94.5,
    activeComponents: 0,
    totalComponents: 3,
    activeAlerts: 0,
    systemHealth: 100,
    lastUpdate: new Date().toISOString()
  });

  const [isConnected, setIsConnected] = useState(false);

  // Fetch real-time data from backend (which gets it from ESP32)
  const fetchHardwareData = async () => {
    try {
      // Fetch room data
      const roomResponse = await fetch(`${API_BASE_URL}/room/living-room`);
      const roomDataFromAPI = await roomResponse.json();

      // Fetch alerts
      const alertsResponse = await fetch(`${API_BASE_URL}/alerts`);
      const alertsData = await alertsResponse.json();

      // Fetch system stats
      const statsResponse = await fetch(`${API_BASE_URL}/system/stats`);
      const statsData = await statsResponse.json();

      // Update room data with real hardware values
      setRoomData(prevData => {
        const updatedData = { ...prevData };
        const room = updatedData['living-room'];
        const hwRoom = roomDataFromAPI.livingRoom;

        room.temperature = hwRoom.temperature.toFixed(1);
        room.powerConsumption = Math.round(hwRoom.power);
        room.status = hwRoom.status.toLowerCase();
        room.lastUpdated = hwRoom.lastUpdated;

        // Update components based on hardware loads
        room.components = room.components.map((component, index) => {
          const loadKey = `load${index + 1}`;
          const loadData = hwRoom.loads[loadKey];

          return {
            ...component,
            status: loadData.fault ? 'fault' : (loadData.class === 'success' ? 'on' : 'off'),
            power: loadData.fault ? 0 : Math.round(hwRoom.power / 3), // Distribute power
            voltage: hwRoom.voltage.toFixed(1),
            current: (hwRoom.current / 3).toFixed(3), // Distribute current
            fault: loadData.fault,
            faultMessage: loadData.status
          };
        });

        return updatedData;
      });

      // Update alerts with real data
      setAlerts(alertsData.alerts.map(alert => ({
        id: alert.id,
        type: alert.type,
        severity: alert.severity,
        location: 'Living Room',
        component: alert.type === 'short_circuit' ? 'Main Circuit' : `Load ${Object.keys(alert.loads).find(k => alert.loads[k])}`,
        componentId: alert.type === 'short_circuit' ? 'main-circuit' : Object.keys(alert.loads).find(k => alert.loads[k]),
        message: alert.message,
        timestamp: new Date(alert.timestamp).toLocaleString(),
        status: alert.status,
        technicalData: {
          voltage: roomDataFromAPI.livingRoom.voltage,
          current: roomDataFromAPI.livingRoom.current,
          power: roomDataFromAPI.livingRoom.power
        }
      })));

      // Update system stats
      setSystemStats({
        totalPower: Math.round(statsData.totalPower),
        totalVoltage: 230,
        totalCurrent: roomDataFromAPI.livingRoom.current.toFixed(2),
        efficiency: 94.5,
        activeComponents: Object.values(statsData.loads).filter(l => l === 'normal').length,
        totalComponents: 3,
        activeAlerts: statsData.activeAlerts,
        systemHealth: statsData.shortCircuit ? 0 : (statsData.activeAlerts > 0 ? 50 : 100),
        lastUpdate: new Date().toISOString()
      });

      setIsConnected(true);

    } catch (error) {
      console.error('Error fetching hardware data:', error);
      setIsConnected(false);
    }
  };

  // Poll hardware data every 2 seconds
  useEffect(() => {
    // Initial fetch
    fetchHardwareData();

    // Set up polling
    const interval = setInterval(() => {
      fetchHardwareData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleComponent = async (componentId) => {
    // Note: ESP32 controls relay switching, so this is just for UI feedback
    // In a full implementation, you'd send commands to ESP32 to control relays
    console.log(`Toggle component ${componentId} - Hardware controlled`);
    
    // You can add an API endpoint to send commands to ESP32 if needed
    // await fetch(`${API_BASE_URL}/control/${componentId}/toggle`, { method: 'POST' });
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      await fetch(`${API_BASE_URL}/alerts/${alertId}/acknowledge`, {
        method: 'PUT'
      });
      
      setAlerts(prevAlerts =>
        prevAlerts.map(alert =>
          alert.id === alertId
            ? { ...alert, status: 'acknowledged', acknowledgedAt: new Date().toLocaleString() }
            : alert
        )
      );
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      await fetch(`${API_BASE_URL}/alerts/${alertId}/resolve`, {
        method: 'PUT'
      });
      
      setAlerts(prevAlerts =>
        prevAlerts.map(alert =>
          alert.id === alertId
            ? { ...alert, status: 'resolved', resolvedAt: new Date().toLocaleString() }
            : alert
        )
      );
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  return {
    roomData,
    alerts,
    systemStats,
    toggleComponent,
    acknowledgeAlert,
    resolveAlert,
    isConnected
  };
};