import React from 'react';
import { Thermometer, Wifi, Clock } from 'lucide-react';

const RoomStatusCard = ({ roomName, data, devices }) => {
  const getStatusConfig = (status) => {
    switch(status) {
      case 'NORMAL': 
        return {
          border: 'border-green-500/30',
          badge: 'bg-green-500 text-white',
          bg: 'from-green-500/5 to-emerald-500/5'
        };
      case 'WARNING': 
        return {
          border: 'border-yellow-500/30',
          badge: 'bg-yellow-500 text-white',
          bg: 'from-yellow-500/5 to-amber-500/5'
        };
      case 'CRITICAL': 
        return {
          border: 'border-red-500/30',
          badge: 'bg-red-500 text-white',
          bg: 'from-red-500/5 to-rose-500/5'
        };
      default: 
        return {
          border: 'border-gray-500/30',
          badge: 'bg-gray-500 text-white',
          bg: 'from-gray-500/5 to-slate-500/5'
        };
    }
  };

  const config = getStatusConfig(data.status);

  return (
    <div className={`bg-gradient-to-br ${config.bg} backdrop-blur-sm border ${config.border} p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group`}>
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-white text-xl font-bold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
          {roomName}
        </h4>
        <span className={`${config.badge} text-sm px-3 py-1 rounded-full font-medium shadow-lg`}>
          {data.status}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{data.voltage.toFixed(1)}V</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Voltage</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">{data.current.toFixed(1)}A</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Current</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400 mb-1">{data.power}W</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Power</div>
        </div>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Thermometer className="text-orange-400 mr-2" size={16} />
            <span className="text-gray-300">Temperature</span>
          </div>
          <span className="text-white font-semibold">{data.temp}°C</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Wifi className="text-green-400 mr-2" size={16} />
            <span className="text-gray-300">Connection</span>
          </div>
          <span className="text-green-400 font-semibold">Online</span>
        </div>
        
        <div className="border-t border-slate-700/50 pt-3">
          <div className="text-gray-400 text-xs mb-2">Connected Devices:</div>
          <div className="text-gray-300 text-sm">{devices}</div>
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="mr-1" size={12} />
          <span>Updated: 11:42:32 pm</span>
        </div>
      </div>
    </div>
  );
};

const RoomStatusCards = ({ roomData }) => {
  const roomDevices = {
    livingRoom: 'LED Lights, TV, Air Conditioner',
    kitchen: 'Refrigerator, Microwave, Dishwasher',
    bedroom: 'Ceiling Fan, Lamp, Charger',
    bathroom: 'Water Heater, Exhaust Fan, Lights'
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-3">Room Status</h3>
      <p className="text-gray-400 text-lg mb-8">Real-time monitoring of electrical parameters across all zones</p>
      
      <div className="grid grid-cols-2 gap-6">
        <RoomStatusCard 
          roomName="Living Room" 
          data={roomData.livingRoom} 
          devices={roomDevices.livingRoom}
        />
        <RoomStatusCard 
          roomName="Kitchen" 
          data={roomData.kitchen} 
          devices={roomDevices.kitchen}
        />
        <RoomStatusCard 
          roomName="Bedroom" 
          data={roomData.bedroom} 
          devices={roomDevices.bedroom}
        />
        <RoomStatusCard 
          roomName="Bathroom" 
          data={roomData.bathroom} 
          devices={roomDevices.bathroom}
        />
      </div>
    </div>
  );
};

export default RoomStatusCards;