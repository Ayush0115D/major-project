import { useState, useEffect } from 'react';

const useSmartMonitorData = () => {
  const [roomData, setRoomData] = useState({
    'living-room': {
      id: 'living-room',
      name: 'Living Room',
      temperature: 24.5,
      humidity: 45,
      powerConsumption: 267,
      status: 'normal',
      components: [
        { id: 'light1', name: 'LED Light 1', type: 'lighting', power: 12, voltage: 230, current: 0.052, status: 'on', location: 'ceiling' },
        { id: 'light2', name: 'LED Light 2', type: 'lighting', power: 12, voltage: 230, current: 0.052, status: 'on', location: 'wall' },
        { id: 'fan', name: 'Ceiling Fan', type: 'appliance', power: 75, voltage: 230, current: 0.326, status: 'on', location: 'ceiling' },
        { id: 'tv', name: 'Smart TV', type: 'electronics', power: 120, voltage: 230, current: 0.522, status: 'on', location: 'wall-mounted' },
        { id: 'ac', name: 'Air Conditioner', type: 'hvac', power: 0, voltage: 0, current: 0, status: 'off', location: 'wall' },
        { id: 'socket1', name: 'Power Socket 1', type: 'outlet', power: 0, voltage: 230, current: 0, status: 'available', location: 'wall' },
        { id: 'socket2', name: 'Power Socket 2', type: 'outlet', power: 50, voltage: 0, current: 25.5, status: 'short-circuit', location: 'wall' }
      ],
      lastUpdated: new Date().toISOString()
    }
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'short-circuit',
      severity: 'critical',
      location: 'Living Room',
      component: 'Power Socket 2',
      componentId: 'socket2',
      message: 'Short circuit detected in power socket 2. Circuit breaker tripped.',
      timestamp: new Date(Date.now() - 300000).toLocaleString(),
      status: 'active',
      technicalData: { voltage: 0, current: 25.5, resistance: 0.1, power: 0, faultCurrent: 25.5 }
    },
    {
      id: 2,
      type: 'overload',
      severity: 'warning',
      location: 'Living Room',
      component: 'Main Circuit',
      componentId: 'main-circuit',
      message: 'Power consumption exceeds safe limits. Total load: 1850W',
      timestamp: new Date(Date.now() - 600000).toLocaleString(),
      status: 'active',
      technicalData: { voltage: 230, current: 8.2, maxLoad: 1500, currentLoad: 1850, overloadPercentage: 23.3 }
    }
  ]);

  const [systemStats, setSystemStats] = useState({
    totalPower: 267,
    totalVoltage: 230,
    totalCurrent: 1.162,
    efficiency: 94.5,
    activeComponents: 5,
    totalComponents: 7,
    activeAlerts: 2,
    systemHealth: 75,
    lastUpdate: new Date().toISOString()
  });

  // Update data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRoomData(prevData => {
        const updatedData = { ...prevData };
        const room = updatedData['living-room'];
        
        room.temperature = +(24.5 + (Math.random() - 0.5) * 2).toFixed(1);
        room.humidity = Math.max(40, Math.min(60, 45 + (Math.random() - 0.5) * 10));
        
        room.components = room.components.map(component => {
          if (component.status === 'on' || component.status === 'in-use') {
            return {
              ...component,
              current: +(component.current + (Math.random() - 0.5) * 0.01).toFixed(3),
              voltage: component.id !== 'socket2' ? +(230 + (Math.random() - 0.5) * 5).toFixed(1) : 0
            };
          }
          return component;
        });

        room.powerConsumption = room.components
          .filter(comp => comp.status === 'on' || comp.status === 'in-use')
          .reduce((sum, comp) => sum + comp.power, 0);

        room.lastUpdated = new Date().toISOString();
        return updatedData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleComponent = (componentId) => {
    setRoomData(prevData => {
      const updatedData = { ...prevData };
      const room = updatedData['living-room'];
      
      room.components = room.components.map(component => {
        if (component.id === componentId && component.status !== 'short-circuit') {
          const newStatus = component.status === 'on' ? 'off' : 'on';
          const powerMap = { lighting: 12, appliance: 75, electronics: 120, hvac: 1500 };
          return {
            ...component,
            status: newStatus,
            power: newStatus === 'on' ? powerMap[component.type] || 0 : 0,
            current: newStatus === 'on' ? (powerMap[component.type] || 0) / 230 : 0,
            voltage: newStatus === 'on' ? 230 : 0
          };
        }
        return component;
      });
      
      return updatedData;
    });
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
    resolveAlert
  };
};

export default useSmartMonitorData;