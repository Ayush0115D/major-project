import React from 'react';

const RoomStatusCard = ({ roomName, data, devices }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'NORMAL': return 'border-green-500';
      case 'WARNING': return 'border-yellow-500';
      case 'CRITICAL': return 'border-red-500';
      default: return 'border-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'NORMAL': return 'bg-green-600 text-white';
      case 'WARNING': return 'bg-yellow-600 text-white';
      case 'CRITICAL': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className={`bg-gray-800 border ${getStatusColor(data.status)} p-4 rounded-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-semibold">{roomName}</h4>
        <span className={`${getStatusBadge(data.status)} text-xs px-2 py-1 rounded`}>
          {data.status}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center mb-4">
        <div>
          <div className="text-2xl font-bold text-blue-400">{data.voltage.toFixed(1)}V</div>
          <div className="text-xs text-gray-400">VOLTAGE</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">{data.current.toFixed(1)}A</div>
          <div className="text-xs text-gray-400">CURRENT</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-cyan-400">{data.power}W</div>
          <div className="text-xs text-gray-400">POWER</div>
        </div>
      </div>
      <div className="text-sm text-gray-400">
        <div className="mb-1">{data.temp}°C</div>
        <div className="mb-1">Connected Devices:</div>
        <div className="text-xs mb-2">{devices}</div>
        <div className="text-xs text-gray-500">Updated: 11:42:32 pm</div>
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
      <h3 className="text-xl font-bold text-white mb-4">Room Status</h3>
      <p className="text-gray-400 mb-6">Real-time monitoring of electrical parameters across all zones</p>
      
      <div className="grid grid-cols-2 gap-4">
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
