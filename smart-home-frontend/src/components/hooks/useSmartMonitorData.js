import { useState, useEffect } from 'react';

const useSmartMonitorData = () => {
  const [roomData, setRoomData] = useState({
    'living-room': {
      id: 'living-room',
      name: 'Living Room',
      temperature: 24.5,
      humidity: 45,
      powerConsumption: 267, // Total power of active components
      status: 'normal', // normal, short-circuit, overload
      components: [
        { 
          id: 'light1', 
          name: 'LED Light 1', 
          type: 'lighting', 
          power: 12, 
          voltage: 230, 
          current: 0.052, 
          status: 'on',
          location: 'ceiling'
        },
        { 
          id: 'light2', 
          name: 'LED Light 2', 
          type: 'lighting', 
          power: 12, 
          voltage: 230, 
          current: 0.052, 
          status: 'on',
          location: 'wall'
        },
        { 
          id: 'fan', 
          name: 'Ceiling Fan', 
          type: 'appliance', 
          power: 75, 
          voltage: 230, 
          current: 0.326, 
          status: 'on',
          location: 'ceiling',
          speed: 'medium'
        },
        { 
          id: 'tv', 
          name: 'Smart TV', 
          type: 'electronics', 
          power: 120, 
          voltage: 230, 
          current: 0.522, 
          status: 'on',
          location: 'wall-mounted',
          screenSize: '55 inch'
        },
        { 
          id: 'ac', 
          name: 'Air Conditioner', 
          type: 'hvac', 
          power: 0, 
          voltage: 0, 
          current: 0, 
          status: 'off',
          location: 'wall',
          capacity: '1.5 ton'
        },
        { 
          id: 'socket1', 
          name: 'Power Socket 1', 
          type: 'outlet', 
          power: 0, 
          voltage: 230, 
          current: 0, 
          status: 'available',
          location: 'wall'
        },
        { 
          id: 'socket2', 
          name: 'Power Socket 2', 
          type: 'outlet', 
          power: 50, 
          voltage: 0, 
          current: 25.5, 
          status: 'short-circuit',
          location: 'wall',
          connectedDevice: 'Laptop Charger'
        }
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
      message: 'Short circuit detected in power socket 2. Circuit breaker tripped. Resistance dropped to 0.1Ω.',
      timestamp: new Date(Date.now() - 300000).toLocaleString(),
      status: 'active',
      technicalData: {
        voltage: 0,
        current: 25.5,
        resistance: 0.1,
        power: 0,
        faultCurrent: 25.5
      }
    },
    {
      id: 2,
      type: 'overload',
      severity: 'warning',
      location: 'Living Room',
      component: 'Main Circuit',
      componentId: 'main-circuit',
      message: 'Power consumption exceeds safe limits. Total load: 1850W exceeds maximum capacity of 1500W.',
      timestamp: new Date(Date.now() - 600000).toLocaleString(),
      status: 'active',
      technicalData: {
        voltage: 230,
        current: 8.2,
        maxLoad: 1500,
        currentLoad: 1850,
        overloadPercentage: 23.3
      }
    },
    {
      id: 3,
      type: 'overload',
      severity: 'resolved',
      location: 'Living Room',
      component: 'Air Conditioner Circuit',
      componentId: 'ac',
      message: 'AC overload resolved. Power consumption normalized after temperature setpoint adjustment.',
      timestamp: new Date(Date.now() - 1200000).toLocaleString(),
      status: 'resolved',
      resolvedAt: new Date(Date.now() - 300000).toLocaleString(),
      technicalData: {
        voltage: 230,
        current: 6.5,
        maxLoad: 1500,
        currentLoad: 1450,
        overloadPercentage: 0
      }
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
    systemHealth: 75, // Percentage
    lastUpdate: new Date().toISOString()
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update room data with slight variations
      setRoomData(prevData => {
        const updatedData = { ...prevData };
        const room = updatedData['living-room'];
        
        // Add small random variations to simulate real sensor data
        room.temperature = +(24.5 + (Math.random() - 0.5) * 2).toFixed(1);
        room.humidity = Math.max(40, Math.min(60, 45 + (Math.random() - 0.5) * 10));
        
        // Update component data
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

        // Recalculate total power
        room.powerConsumption = room.components
          .filter(comp => comp.status === 'on' || comp.status === 'in-use')
          .reduce((sum, comp) => sum + comp.power, 0);

        room.lastUpdated = new Date().toISOString();
        
        return updatedData;
      });

      // Update system stats
      setSystemStats(prevStats => ({
        ...prevStats,
        totalPower: roomData['living-room']?.powerConsumption || 267,
        totalCurrent: +(Math.random() * 0.1 + 1.1).toFixed(3),
        efficiency: +(94 + Math.random() * 3).toFixed(1),
        systemHealth: Math.max(70, Math.min(100, 75 + (Math.random() - 0.5) * 20)),
        lastUpdate: new Date().toISOString()
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [roomData]);

  // Function to detect faults based on component data
  const detectFaults = () => {
    const room = roomData['living-room'];
    if (!room) return;

    // Check for short circuits (high current, low/zero voltage)
    room.components.forEach(component => {
      if (component.current > 20 && component.voltage < 50) {
        // Potential short circuit
        const existingAlert = alerts.find(a => 
          a.componentId === component.id && 
          a.type === 'short-circuit' && 
          a.status === 'active'
        );
        
        if (!existingAlert) {
          const newAlert = {
            id: Date.now(),
            type: 'short-circuit',
            severity: 'critical',
            location: room.name,
            component: component.name,
            componentId: component.id,
            message: `Short circuit detected in ${component.name}. High current (${component.current}A) with low voltage (${component.voltage}V).`,
            timestamp: new Date().toLocaleString(),
            status: 'active',
            technicalData: {
              voltage: component.voltage,
              current: component.current,
              resistance: (component.voltage / component.current).toFixed(2),
              power: component.power,
              faultCurrent: component.current
            }
          };
          
          setAlerts(prev => [...prev, newAlert]);
        }
      }
    });

    // Check for overload (total power exceeding limits)
    if (room.powerConsumption > 1500) {
      const existingAlert = alerts.find(a => 
        a.type === 'overload' && 
        a.location === room.name && 
        a.status === 'active'
      );
      
      if (!existingAlert) {
        const newAlert = {
          id: Date.now(),
          type: 'overload',
          severity: 'warning',
          location: room.name,
          component: 'Main Circuit',
          componentId: 'main-circuit',
          message: `Power consumption exceeds safe limits. Total load: ${room.powerConsumption}W exceeds maximum capacity of 1500W.`,
          timestamp: new Date().toLocaleString(),
          status: 'active',
          technicalData: {
            voltage: 230,
            current: (room.powerConsumption / 230).toFixed(2),
            maxLoad: 1500,
            currentLoad: room.powerConsumption,
            overloadPercentage: (((room.powerConsumption - 1500) / 1500) * 100).toFixed(1)
          }
        };
        
        setAlerts(prev => [...prev, newAlert]);
      }
    }
  };

  // Function to toggle component status
  const toggleComponent = (componentId) => {
    setRoomData(prevData => {
      const updatedData = { ...prevData };
      const room = updatedData['living-room'];
      
      room.components = room.components.map(component => {
        if (component.id === componentId && component.status !== 'short-circuit') {
          const newStatus = component.status === 'on' ? 'off' : 'on';
          return {
            ...component,
            status: newStatus,
            power: newStatus === 'on' ? component.type === 'lighting' ? 12 : 
                   component.type === 'appliance' ? 75 :
                   component.type === 'electronics' ? 120 :
                   component.type === 'hvac' ? 1500 : 0 : 0,
            current: newStatus === 'on' ? (component.power / 230) : 0,
            voltage: newStatus === 'on' ? 230 : 0
          };
        }
        return component;
      });
      
      return updatedData;
    });
  };

  // Function to acknowledge alerts
  const acknowledgeAlert = (alertId) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'acknowledged', acknowledgedAt: new Date().toLocaleString() }
          : alert
      )
    );
  };

  // Function to resolve alerts
  const resolveAlert = (alertId) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'resolved', resolvedAt: new Date().toLocaleString() }
          : alert
      )
    );
  };

  // Function to get room status based on alerts
  const getRoomStatus = () => {
    const activeAlerts = alerts.filter(a => a.status === 'active');
    const hasShortCircuit = activeAlerts.some(a => a.type === 'short-circuit');
    const hasOverload = activeAlerts.some(a => a.type === 'overload');
    
    if (hasShortCircuit) return 'short-circuit';
    if (hasOverload) return 'overload';
    return 'normal';
  };

  // Update room status based on active alerts
  useEffect(() => {
    setRoomData(prevData => ({
      ...prevData,
      'living-room': {
        ...prevData['living-room'],
        status: getRoomStatus()
      }
    }));
  }, [alerts]);

  // Run fault detection periodically
  useEffect(() => {
    const faultCheckInterval = setInterval(detectFaults, 10000); // Check every 10 seconds
    return () => clearInterval(faultCheckInterval);
  }, [roomData, alerts]);

  return {
    roomData,
    alerts,
    systemStats,
    toggleComponent,
    acknowledgeAlert,
    resolveAlert,
    detectFaults
  };
};

export default useSmartMonitorData;