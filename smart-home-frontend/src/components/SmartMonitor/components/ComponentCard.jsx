import React from 'react';

const ComponentCard = ({ component }) => {
  const getStatusColor = () => {
    switch (component.status) {
      case 'on':
        return 'bg-green-900 text-green-200';
      case 'off':
        return 'bg-gray-800 text-gray-300';
      case 'in-use':
        return 'bg-blue-900 text-blue-200';
      case 'short-circuit':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  const getComponentIcon = () => {
    switch (component.type) {
      case 'lighting':
        return '💡';
      case 'appliance':
        return '🌀';
      case 'electronics':
        return '📺';
      case 'hvac':
        return '❄️';
      case 'outlet':
        return '🔌';
      default:
        return '⚡';
    }
  };

  return (
    <div
      className={`bg-gray-900 p-4 rounded-lg border shadow-sm ${
        component.status === 'short-circuit' ? 'border-red-600' : 'border-gray-700'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getComponentIcon()}</span>
          <div className="font-medium text-gray-200">{component.name}</div>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
        >
          {component.status.toUpperCase()}
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-2">
        Type: {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Power:</span>
          <div className="font-medium text-gray-200">{component.power}W</div>
        </div>
        <div>
          <span className="text-gray-500">Current:</span>
          <div
            className={`font-medium ${
              component.status === 'short-circuit' ? 'text-red-400' : 'text-gray-200'
            }`}
          >
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
