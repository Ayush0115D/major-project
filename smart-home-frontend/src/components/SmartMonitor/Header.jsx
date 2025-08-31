import React from 'react';
import { Users, Wifi, Shield, Menu } from 'lucide-react';

const Header = ({ currentTime, toggleSidebar, sidebarOpen }) => {
  return (
    <div className="bg-slate-800/80 backdrop-blur-lg p-6 border-b border-slate-700/50 h-20">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center">
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200 mr-4"
          >
            <Menu className="text-gray-400 hover:text-white" size={24} />
          </button>
          
          <div className="text-white">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <Wifi className="mr-2 text-green-400" size={16} />
            <span className="text-green-400 font-medium">System Online</span>
          </div>
          <div className="flex items-center bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
            <Users className="mr-2 text-blue-400" size={16} />
            <span className="text-blue-400 font-medium">4 Zones</span>
          </div>
          <div className="flex items-center bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
            <Shield className="mr-2 text-purple-400" size={16} />
            <span className="text-purple-400 font-medium">Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;