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
    if (hasShortCircuit) return 'border-red-500 bg-[#1e1b2e]';
    if (hasOverload) return 'border-yellow-500 bg-[#1e1b2e]';
    return 'border-blue-500 bg-[#1e1b2e]';
  };

  const getStatusText = () => {
    if (hasShortCircuit) return 'SHORT CIRCUIT';
    if (hasOverload) return 'OVERLOAD';
    return 'NORMAL';
  };

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} p-6 bg-[#0f172a] min-h-screen`}>
      <div className={`border-2 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.01] ${getStatusColor()}`}>
        
        {/* Room Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">{room.name}</h2>
              <p className="text-gray-400">Total Components: {room.components.length}</p>
            </div>
            <div className="text-right">
              <div className={`text-xl font-semibold ${hasShortCircuit ? 'text-red-400' : hasOverload ? 'text-yellow-400' : 'text-blue-400'}`}>
                {getStatusText()}
              </div>
              <div className="text-lg text-gray-300">{totalPower}W</div>
            </div>
          </div>
        </div>

        {/* Active Alerts Section */}
        {roomAlerts.length > 0 && (
          <div className="p-4 bg-[#1e293b] border-b border-gray-700">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">⚠️ Active Alerts</h3>
            {roomAlerts.map((alert, index) => (
              <div
                key={index}
                className={`mb-2 p-3 rounded-lg ${
                  alert.type === 'short-circuit'
                    ? 'bg-red-900/30 text-red-300 border border-red-500/40'
                    : 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/40'
                }`}
              >
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
          <h3 className="text-lg font-semibold mb-4 text-white">Room Components</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {room.components.map((component) => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </div>
        </div>

        {/* Room Summary */}
        <div className="p-6 bg-[#1e293b] rounded-b-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{activeComponents.length}</div>
              <div className="text-sm text-gray-400">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{totalPower}W</div>
              <div className="text-sm text-gray-400">Total Power</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {room.components.filter(c => c.type === 'lighting').length}
              </div>
              <div className="text-sm text-gray-400">Lights</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {room.components.filter(c => c.type === 'outlet').length}
              </div>
              <div className="text-sm text-gray-400">Outlets</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomStatusCards;
