import React from 'react';

const RoomCard = ({ roomName, data }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'NORMAL': return 'border-green-500 bg-green-900/20';
      case 'WARNING': return 'border-yellow-500 bg-yellow-900/20';
      case 'CRITICAL': return 'border-red-500 bg-red-900/20';
      default: return 'border-gray-500';
    }
  };

  const getStatusDotColor = (status) => {
    switch(status) {
      case 'NORMAL': return 'bg-green-500';
      case 'WARNING': return 'bg-yellow-500';
      case 'CRITICAL': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`${getStatusColor(data.status)} border-2 rounded-lg p-6 transition-all duration-300 hover:scale-105`}>
      <div className="text-white mb-4">
        <h3 className="text-xl font-semibold mb-2">{roomName}</h3>
        <div className="text-sm text-gray-300">
          {data.voltage.toFixed(1)}V | {data.current.toFixed(1)}A
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className={`w-4 h-4 rounded-full ${getStatusDotColor(data.status)} animate-pulse`}></div>
      </div>
    </div>
  );
};

const HomeLayoutMonitor = ({ roomData }) => {
  return (
    <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
      <RoomCard roomName="Living Room" data={roomData.livingRoom} />
      <RoomCard roomName="Kitchen" data={roomData.kitchen} />
      <RoomCard roomName="Bedroom" data={roomData.bedroom} />
      <RoomCard roomName="Bathroom" data={roomData.bathroom} />
    </div>
  );
};

export default HomeLayoutMonitor;