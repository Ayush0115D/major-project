import { useState, useEffect } from 'react';

// Direct ESP32 connection
const ESP32_URL = '/esp';

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
        { id: 'load1', name: 'Load 1', type: 'appliance', power: 0, voltage: 0, current: 0, status: 'off', location: 'circuit-1', fault: false, faultMessage: '' },
        { id: 'load2', name: 'Load 2', type: 'appliance', power: 0, voltage: 0, current: 0, status: 'off', location: 'circuit-2', fault: false, faultMessage: '' },
        { id: 'load3', name: 'Load 3', type: 'appliance', power: 0, voltage: 0, current: 0, status: 'off', location: 'circuit-3', fault: false, faultMessage: '' }
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

  const fetchHardwareData = async () => {
    try {
      console.log('Fetching from ESP32...');
const response = await fetch(`/esp/main.json`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('ESP32 Data received:', data);
      
      // Update room data
      setRoomData(prevData => {
        const updatedData = { ...prevData };
        const room = updatedData['living-room'];
        
        room.temperature = (24 + Math.random() * 5).toFixed(1);
        room.status = data.message === 'Short circuit' ? 'critical' : 
                     (data.load1_class === 'danger' || data.load2_class === 'danger' || data.load3_class === 'danger') ? 'warning' : 'normal';
        room.lastUpdated = new Date().toISOString();
        
        // Update components
        room.components = [
          {
            id: 'load1',
            name: 'Load 1',
            type: 'appliance',
            power: data.load1_class === 'success' ? 500 : 0,
            voltage: data.load1_class === 'success' ? 230 : (data.load1_class === 'danger' ? 230 : 0),
            current: data.load1_class === 'success' ? 2.17 : (data.load1_class === 'danger' ? 15 : 0),
            status: data.load1_class === 'danger' ? 'fault' : (data.load1_class === 'success' ? 'on' : 'off'),
            location: 'circuit-1',
            fault: data.load1_class === 'danger',
            faultMessage: data.load1_class === 'danger' ? data.load1 : ''
          },
          {
            id: 'load2',
            name: 'Load 2',
            type: 'appliance',
            power: data.load2_class === 'success' ? 500 : 0,
            voltage: data.load2_class === 'success' ? 230 : (data.load2_class === 'danger' ? 230 : 0),
            current: data.load2_class === 'success' ? 2.17 : (data.load2_class === 'danger' ? 12 : 0),
            status: data.load2_class === 'danger' ? 'fault' : (data.load2_class === 'success' ? 'on' : 'off'),
            location: 'circuit-2',
            fault: data.load2_class === 'danger',
            faultMessage: data.load2_class === 'danger' ? data.load2 : ''
          },
          {
            id: 'load3',
            name: 'Load 3',
            type: 'appliance',
            power: data.load3_class === 'success' ? 500 : 0,
            voltage: data.load3_class === 'success' ? 230 : (data.load3_class === 'danger' ? 230 : 0),
            current: data.load3_class === 'success' ? 2.17 : (data.load3_class === 'danger' ? 10 : 0),
            status: data.load3_class === 'danger' ? 'fault' : (data.load3_class === 'success' ? 'on' : 'off'),
            location: 'circuit-3',
            fault: data.load3_class === 'danger',
            faultMessage: data.load3_class === 'danger' ? data.load3 : ''
          }
        ];
        
        room.powerConsumption = room.components.reduce((sum, c) => sum + c.power, 0);
        return updatedData;
      });
      
      // Update alerts
      const newAlerts = [];
      if (data.message === 'Short circuit') {
        newAlerts.push({
          id: Date.now(),
          type: 'short-circuit',
          severity: 'critical',
          location: 'Living Room',
          component: 'Main Circuit',
          componentId: 'main-circuit',
          message: '⚠️ Short circuit detected! All relays tripped for safety.',
          timestamp: new Date().toLocaleString(),
          status: 'active',
          technicalData: { voltage: 230, current: 0, power: 0 }
        });
      }
      if (data.load1_class === 'danger' && data.message !== 'Short circuit') {
        newAlerts.push({
          id: Date.now() + 1,
          type: 'overload',
          severity: 'high',
          location: 'Living Room',
          component: 'Load 1',
          componentId: 'load1',
          message: '⚠️ Load 1: Over Load Detected - Relay tripped',
          timestamp: new Date().toLocaleString(),
          status: 'active',
          technicalData: { voltage: 230, current: 15, power: 3450 }
        });
      }
      if (data.load2_class === 'danger' && data.message !== 'Short circuit') {
        newAlerts.push({
          id: Date.now() + 2,
          type: 'overload',
          severity: 'high',
          location: 'Living Room',
          component: 'Load 2',
          componentId: 'load2',
          message: '⚠️ Load 2: Over Load Detected - Relay tripped',
          timestamp: new Date().toLocaleString(),
          status: 'active',
          technicalData: { voltage: 230, current: 12, power: 2760 }
        });
      }
      if (data.load3_class === 'danger' && data.message !== 'Short circuit') {
        newAlerts.push({
          id: Date.now() + 3,
          type: 'overload',
          severity: 'high',
          location: 'Living Room',
          component: 'Load 3',
          componentId: 'load3',
          message: '⚠️ Load 3: Over Load Detected - Relay tripped',
          timestamp: new Date().toLocaleString(),
          status: 'active',
          technicalData: { voltage: 230, current: 10, power: 2300 }
        });
      }
      setAlerts(newAlerts);
      
      // Update system stats
      const normalCount = [data.load1_class, data.load2_class, data.load3_class].filter(c => c === 'success').length;
      const totalPower = (data.load1_class === 'success' ? 500 : 0) + 
                        (data.load2_class === 'success' ? 500 : 0) + 
                        (data.load3_class === 'success' ? 500 : 0);
      
      setSystemStats({
        totalPower: totalPower,
        totalVoltage: 230,
        totalCurrent: totalPower > 0 ? (totalPower / 230).toFixed(2) : 0,
        efficiency: 94.5,
        activeComponents: normalCount,
        totalComponents: 3,
        activeAlerts: newAlerts.length,
        systemHealth: data.message === 'Short circuit' ? 0 : (newAlerts.length > 0 ? 50 : 100),
        lastUpdate: new Date().toISOString()
      });
      
      setIsConnected(true);
      console.log('✅ Data updated successfully');
      
    } catch (error) {
      console.error('❌ Error fetching ESP32 data:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    console.log('Starting ESP32 polling...');
    fetchHardwareData();
    const interval = setInterval(fetchHardwareData, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleComponent = (componentId) => {
    console.log(`Toggle component ${componentId} - Hardware controlled`);
  };

  const acknowledgeAlert = (alertId) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId
          ? { ...alert, status: 'acknowledged', acknowledgedAt: new Date().toLocaleString() }
          : alert
      )
    );
  };

  const resolveAlert = (alertId) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId
          ? { ...alert, status: 'resolved', resolvedAt: new Date().toLocaleString() }
          : alert
      )
    );
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