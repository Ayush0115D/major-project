import { useState, useEffect } from 'react';

export const useSmartMonitorData = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [roomData, setRoomData] = useState({
    livingRoom: { voltage: 242, current: 2.2, power: 540, temp: 24, status: 'NORMAL' },
    kitchen: { voltage: 201, current: 5.6, power: 1131, temp: 28, status: 'WARNING' },
    bedroom: { voltage: 232, current: 7, power: 1635, temp: 22, status: 'NORMAL' },
    bathroom: { voltage: 160, current: 15, power: 2400, temp: 26, status: 'CRITICAL' }
  });

  const [alerts, setAlerts] = useState([
    { 
      id: 1, 
      room: 'Bathroom', 
      message: 'Short circuit detected! Immediate attention required.', 
      time: '11:30:23 pm', 
      type: 'critical' 
    },
    { 
      id: 2, 
      room: 'Kitchen', 
      message: 'High current consumption detected.', 
      time: '11:25:23 pm', 
      type: 'warning' 
    }
  ]);

  const [powerData, setPowerData] = useState([
    { time: '12:42 AM', power: 5800 },
    { time: '01:42 AM', power: 5750 },
    { time: '02:42 AM', power: 5720 },
    { time: '03:42 AM', power: 5680 },
    { time: '04:42 AM', power: 5650 },
    { time: '05:42 AM', power: 5700 },
    { time: '06:42 AM', power: 5820 },
    { time: '07:42 AM', power: 5900 },
    { time: '08:42 AM', power: 5850 },
    { time: '09:42 AM', power: 5780 },
    { time: '10:42 AM', power: 5820 },
    { time: '11:42 AM', power: 5582 }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate minor fluctuations in power data
      setRoomData(prev => ({
        ...prev,
        livingRoom: { 
          ...prev.livingRoom, 
          voltage: 242 + Math.random() * 2 - 1, 
          current: 2.2 + Math.random() * 0.2 - 0.1 
        },
        kitchen: { 
          ...prev.kitchen, 
          voltage: 201 + Math.random() * 3 - 1.5, 
          current: 5.6 + Math.random() * 0.3 - 0.15 
        },
        bedroom: { 
          ...prev.bedroom, 
          voltage: 232 + Math.random() * 2 - 1, 
          current: 7 + Math.random() * 0.2 - 0.1 
        },
        bathroom: { 
          ...prev.bathroom, 
          voltage: 160 + Math.random() * 2 - 1, 
          current: 15 + Math.random() * 0.5 - 0.25 
        }
      }));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Calculate derived values
  const totalPower = Object.values(roomData).reduce((sum, room) => sum + room.power, 0);
  const avgVoltage = Object.values(roomData).reduce((sum, room) => sum + room.voltage, 0) / 4;
  const totalCurrent = Object.values(roomData).reduce((sum, room) => sum + room.current, 0);
  const efficiency = 97.9;

  return {
    currentTime,
    roomData,
    alerts,
    powerData,
    totalPower,
    avgVoltage,
    totalCurrent,
    efficiency
  };
};
