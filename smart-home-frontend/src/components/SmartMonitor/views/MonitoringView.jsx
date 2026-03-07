import React, { useState, useEffect, useCallback } from "react";
import HomeLayoutMonitor from "../components/HomeLayoutMonitor";
import { Activity, Wifi, AlertTriangle } from "lucide-react";

const MonitoringView = ({ initialRoomData }) => {

  const [livingRoomData, setLivingRoomData] = useState(
    initialRoomData?.livingRoom || {}
  );

  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState(null);

  // Simulated real-time data fetch
  const fetchRealTimeData = useCallback(async () => {
    try {

      const simulatedLivingRoomData = {
        ...livingRoomData,
        voltage: 220 + Math.random() * 10 - 5,
        current: 15 + Math.random() * 5 - 2.5,
        power: Math.random() * 1000 + 2000,
        temperature: 25 + Math.random() * 5,
        lastUpdated: new Date().toISOString(),
      };

      setLivingRoomData(simulatedLivingRoomData);
      setIsConnected(true);
      setError(null);
      setLastUpdate(new Date());

    } catch (err) {
      console.error("Failed to fetch real-time data:", err);
      setError(err.message);
      setIsConnected(false);
    }
  }, [livingRoomData]);

  useEffect(() => {

    fetchRealTimeData();

    const interval = setInterval(() => {
      fetchRealTimeData();
    }, 2000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">

      {/* HEADER */}
      <div className="mb-10">

        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
            <Activity className="text-white" size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              Live Monitoring
            </h1>

            <p className="text-gray-400">
              Real-time electrical monitoring and zone status
            </p>
          </div>
        </div>


        {/* STATUS INDICATORS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* CONNECTION STATUS */}
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border
            ${
              isConnected
                ? "bg-green-500/10 border-green-500/20"
                : "bg-red-500/10 border-red-500/20"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
              }`}
            />

            <Wifi
              className={`${
                isConnected ? "text-green-400" : "text-red-400"
              }`}
              size={16}
            />

            <span
              className={`font-medium ${
                isConnected ? "text-green-400" : "text-red-400"
              }`}
            >
              {isConnected ? "Live Data Stream" : "Connection Lost"}
            </span>
          </div>


          {/* LAST UPDATE */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border bg-blue-500/10 border-blue-500/20">

            <Activity className="text-blue-400" size={16} />

            <span className="text-blue-400 font-medium">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>


          {/* FAULT STATUS */}
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border
            ${
              error
                ? "bg-red-500/10 border-red-500/20"
                : "bg-purple-500/10 border-purple-500/20"
            }`}
          >
            <AlertTriangle
              className={`${
                error ? "text-red-400" : "text-purple-400"
              }`}
              size={16}
            />

            <span
              className={`font-medium ${
                error ? "text-red-400" : "text-purple-400"
              }`}
            >
              {error || "Instant Fault Detection"}
            </span>
          </div>

        </div>


        {/* ERROR DEBUG BOX */}
        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400">
              Error: {error}
            </p>
          </div>
        )}

      </div>



      {/* LIVING ROOM MONITOR SECTION */}
      <div className="mt-12">

        <h2 className="text-2xl font-semibold text-white mb-2">
          Living Room Layout Monitor
        </h2>

        <p className="text-gray-400 mb-6">
          Interactive visual representation of living room monitoring
        </p>


        {/* MONITOR CARD */}
        <div className="bg-slate-900/40 border border-slate-700 rounded-2xl p-6 backdrop-blur-md">

          <HomeLayoutMonitor livingRoomData={livingRoomData} />

        </div>

      </div>

    </div>
  );
};

export default MonitoringView;