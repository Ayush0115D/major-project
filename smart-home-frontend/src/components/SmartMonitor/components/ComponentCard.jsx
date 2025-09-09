import React from 'react';

const ComponentCard = ({ component }) => {
  const getStatusColor = () => {
    switch(component.status) {
      case 'on': return 'bg-green-100 text-green-800';
      case 'off': return 'bg-gray-100 text-gray-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'short-circuit': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComponentIcon = () => {
    switch(component.type) {
      case 'lighting': return '💡';
      case 'appliance': return '🌀';
      case 'electronics': return '📺';
      case 'hvac': return '❄️';
      case 'outlet': return '🔌';
      default: return '⚡';
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg border shadow-sm ${
      component.status === 'short-circuit' ? 'border-red-300' : ''
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getComponentIcon()}</span>
          <div className="font-medium text-gray-800">{component.name}</div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {component.status.toUpperCase()}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        Type: {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Power:</span>
          <div className="font-medium">{component.power}W</div>
        </div>
        <div>
          <span className="text-gray-500">Current:</span>
          <div className={`font-medium ${component.status === 'short-circuit' ? 'text-red-600' : ''}`}>
            {component.current}A
          </div>
        </div>
      </div>

      {component.location && (
        <div className="text-xs text-gray-500 mt-2">
          Location: {component.location}
        </div>
      )}
    </div>
  );
};

export default ComponentCard;