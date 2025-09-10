import React, { useState, useEffect, useCallback } from 'react';
import HomeLayoutMonitor from '../components/HomeLayoutMonitor';
import TimeChart from '../components/TimeChart';
import { Activity, Wifi, AlertTriangle } from 'lucide-react';

const MonitoringView = ({ initialRoomData }) => {
  // State for real-time data - now only for living room
  const [livingRoomData, setLivingRoomData] = useState(initialRoomData?.livingRoom || {});
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState(null);

  // Simulate real-time data updates (replace with your actual data source)
  const fetchRealTimeData = useCallback(async () => {
    try {
      // Replace this with your actual API call or WebSocket data
      // Example: const response = await fetch('/api/real-time-data');
      // const newData = await response.json();
      
      // Simulated data update for living room only - REPLACE THIS WITH YOUR ACTUAL DATA SOURCE
      const simulatedLivingRoomData = {
        ...livingRoomData,
        voltage: 220 + Math.random() * 10 - 5, // Random voltage around 220V
        current: 15 + Math.random() * 5 - 2.5, // Random current around 15A
        power: Math.random() * 1000 + 2000, // Random power
        temperature: 25 + Math.random() * 5, // Random temperature
        lastUpdated: new Date().toISOString()
      };

      setLivingRoomData(simulatedLivingRoomData);
      setIsConnected(true);
      setError(null);
      setLastUpdate(new Date());
      
    } catch (err) {
      console.error('Failed to fetch real-time data:', err);
      setError(err.message);
      setIsConnected(false);
    }
  }, [livingRoomData]);

  // Set up real-time data fetching
  useEffect(() => {
    // Initial data load
    fetchRealTimeData();

    // Set up interval for continuous updates
    const interval = setInterval(() => {
      fetchRealTimeData();
    }, 2000); // Update every 2 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once

  // Alternative: WebSocket connection (uncomment and modify as needed)
  /*
  useEffect(() => {
    const ws = new WebSocket('ws://your-websocket-url');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };
    
    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setLivingRoomData(newData.livingRoom || newData); // Adjust based on your data structure
        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        console.error('Error parsing WebSocket data:', err);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      setError('Connection failed');
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };
    
    return () => ws.close();
  }, []);
  */

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mr-4 shadow-lg">
            <Activity className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Live Monitoring</h1>
            <p className="text-gray-400 text-lg">Real-time electrical monitoring and zone status</p>
          </div>
        </div>

        {/* Live Status Indicators - Now with real status */}
        <div className="flex items-center space-x-6">
          <div className={`flex items-center ${isConnected ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} border px-4 py-2 rounded-full`}>
            <div className={`w-2 h-2 ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'} rounded-full mr-2`}></div>
            <Wifi className={`${isConnected ? 'text-green-400' : 'text-red-400'} mr-2`} size={16} />
            <span className={`${isConnected ? 'text-green-400' : 'text-red-400'} font-medium`}>
              {isConnected ? 'Live Data Stream' : 'Connection Lost'}
            </span>
          </div>
          <div className="flex items-center bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full">
            <Activity className="text-blue-400 mr-2" size={16} />
            <span className="text-blue-400 font-medium">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
          <div className={`flex items-center ${error ? 'bg-red-500/10 border-red-500/20' : 'bg-purple-500/10 border-purple-500/20'} border px-4 py-2 rounded-full`}>
            <AlertTriangle className={`${error ? 'text-red-400' : 'text-purple-400'} mr-2`} size={16} />
            <span className={`${error ? 'text-red-400' : 'text-purple-400'} font-medium`}>
              {error || 'Instant Fault Detection'}
            </span>
          </div>
        </div>

        {/* Debug Info (remove in production) */}
        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}
      </div>

      {/* Interactive Timeline */}
      <TimeChart livingRoomData={livingRoomData} />
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">Living Room Layout Monitor</h2>
        <p className="text-gray-400 text-lg">Interactive visual representation of living room monitoring</p>
      </div>
     
      <HomeLayoutMonitor livingRoomData={livingRoomData} />
    </div>
  );
};

export default MonitoringView;