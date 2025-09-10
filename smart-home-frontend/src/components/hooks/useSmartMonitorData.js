import { useState, useEffect } from 'react';

export const useSmartMonitorData = () => {
  const [roomData, setRoomData] = useState({
    'living-room': {
      id: 'living-room',
      name: 'Living Room',
      temperature: 24.5,
      humidity: 45,
      powerConsumption: 99,
      status: 'normal',
      components: [
        { id: 'light1', name: 'LED Light 1', type: 'lighting', power: 12, voltage: 230, current: 0.052, status: 'on', location: 'ceiling' },
        { id: 'light2', name: 'LED Light 2', type: 'lighting', power: 12, voltage: 230, current: 0.052, status: 'on', location: 'wall' },
        { id: 'fan', name: 'Ceiling Fan', type: 'appliance', power: 75, voltage: 230, current: 0.326, status: 'on', location: 'ceiling' },
        { id: 'socket1', name: 'Power Socket 1', type: 'outlet', power: 0, voltage: 230, current: 0, status: 'available', location: 'wall' }
      ],
      lastUpdated: new Date().toISOString()
    }
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'overload',
      severity: 'warning',
      location: 'Living Room',
      component: 'Main Circuit',
      componentId: 'main-circuit',
      message: 'Power consumption exceeds safe limits. Total load: 1850W',
      timestamp: new Date(Date.now() - 600000).toLocaleString(),
      status: 'active',
      technicalData: { voltage: 230, current: 8.2, maxLoad: 1500, currentLoad: 1850, overloadPercentage: 23.3 }
    },
    {
      id: 2,
      type: 'short-circuit',   // ✅ matches your filter
      severity: 'critical',
      location: 'Living Room - Socket 1',
      component: 'Power Socket 1',
      componentId: 'socket1',
      message: 'Short circuit detected at socket 1. Immediate attention required!',
      timestamp: new Date().toLocaleString(),
      status: 'active',
      technicalData: { voltage: 230, faultCurrent: 15, resistance: 0.05, power: 3450 }
    }
  ]);

  const [systemStats, setSystemStats] = useState({
    totalPower: 99,
    totalVoltage: 230,
    totalCurrent: 0.43,
    efficiency: 94.5,
    activeComponents: 3,
    totalComponents: 4,
    activeAlerts: 1,
    systemHealth: 85,
    lastUpdate: new Date().toISOString()
  });

  // Update data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRoomData(prevData => {
        const updatedData = { ...prevData };
        const room = updatedData['living-room'];

        // Temperature rounded to 1 decimal
        room.temperature = +(24.5 + (Math.random() - 0.5) * 2).toFixed(1);

        // ✅ Fix: Humidity rounded to 2 decimals
        room.humidity = +(
          Math.max(40, Math.min(60, 45 + (Math.random() - 0.5) * 10))
        ).toFixed(2);

        room.components = room.components.map(component => {
          if (component.status === 'on' || component.status === 'in-use') {
            return {
              ...component,
              current: +(component.current + (Math.random() - 0.5) * 0.01).toFixed(3),
              voltage: component.id !== 'socket1' ? +(230 + (Math.random() - 0.5) * 5).toFixed(1) : 0
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
        if (component.id === componentId) {
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
