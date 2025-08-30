import React from 'react';
import { Users } from 'lucide-react';

const Header = ({ currentTime }) => {
  return (
    <div className="bg-gray-800 p-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="text-white">
          <span className="text-lg font-semibold">
            {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            System Online
          </div>
          <div className="flex items-center">
            <Users className="mr-1" size={16} />
            4 Zones
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
