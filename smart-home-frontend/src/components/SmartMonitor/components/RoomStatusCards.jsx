import React from 'react';
import ComponentCard from './ComponentCard';

const RoomStatusCards = ({ roomData, alerts, isOpen }) => {
  const room = roomData['living-room'];
  if (!room) return null;

  const activeComponents = room.components.filter(comp => comp.status === 'on' || comp.status === 'in-use');
  const totalPower = activeComponents.reduce((sum, comp) => sum + comp.power, 0);
  
  const roomAlerts = alerts.filter(alert => 
    alert.location === room.name && 
    (alert.type === 'short-circuit' || alert.type === 'overload')
  );

  const hasShortCircuit = roomAlerts.some(alert => alert.type === 'short-circuit');
  const hasOverload = roomAlerts.some(alert => alert.type === 'overload');

  const getStatusColor = () => {
    if (hasShortCircuit) return 'border-red-500 bg-red-50';
    if (hasOverload) return 'border-yellow-500 bg-yellow-50';
    return 'border-green-500 bg-green-50';
  };

  const getStatusText = () => {
    if (hasShortCircuit) return 'SHORT CIRCUIT';
    if (hasOverload) return 'OVERLOAD';
    return 'NORMAL';
  };

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} p-6`}>
      <div className={`border-2 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 ${getStatusColor()}`}>
        
        {/* Room Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{room.name}</h2>
              <p className="text-gray-600">Total Components: {room.components.length}</p>
            </div>
            <div className="text-right">
              <div className={`text-xl font-semibold ${hasShortCircuit ? 'text-red-600' : hasOverload ? 'text-yellow-600' : 'text-green-600'}`}>
                {getStatusText()}
              </div>
              <div className="text-lg text-gray-700">{totalPower}W</div>
            </div>
          </div>
        </div>

        {/* Active Alerts Section */}
        {roomAlerts.length > 0 && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Active Alerts</h3>
            {roomAlerts.map((alert, index) => (
              <div key={index} className={`mb-2 p-2 rounded ${alert.type === 'short-circuit' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                <div className="font-medium">
                  {alert.type === 'short-circuit' ? '🔴 SHORT CIRCUIT' : '🟡 OVERLOAD'}
                </div>
                <div className="text-sm">{alert.message}</div>
              </div>
            ))}
          </div>
        )}

        {/* Components Grid */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Room Components</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {room.components.map((component) => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </div>
        </div>

        {/* Room Summary */}
        <div className="p-6 bg-gray-50 rounded-b-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{activeComponents.length}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{totalPower}W</div>
              <div className="text-sm text-gray-600">Total Power</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {room.components.filter(c => c.type === 'lighting').length}
              </div>
              <div className="text-sm text-gray-600">Lights</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {room.components.filter(c => c.type === 'outlet').length}
              </div>
              <div className="text-sm text-gray-600">Outlets</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomStatusCards;