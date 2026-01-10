import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon, 
  CogIcon, 
  ServerIcon, 
  CollectionIcon, 
  DocumentTextIcon,
  VideoCameraIcon,
  WifiIcon,
  GlobeAltIcon,
  ShareIcon
} from '@heroicons/react/outline';
import { useTheme } from '../../context/ThemeContext';

// Define navigation items with their routes and icons
const NAV_ITEMS = [
  { 
    name: 'Server Info', 
    path: '/', 
    icon: HomeIcon 
  },
  { 
    name: 'Global Config', 
    path: '/global-config', 
    icon: ServerIcon 
  },
  { 
    name: 'Path Config', 
    path: '/path-config', 
    icon: DocumentTextIcon 
  },
  { 
    name: 'RTSP Sessions', 
    path: '/rtsp-sessions', 
    icon: VideoCameraIcon 
  },
  { 
    name: 'RTMP Connections', 
    path: '/rtmp-connections', 
    icon: WifiIcon 
  },
  { 
    name: 'WebRTC Sessions', 
    path: '/webrtc-sessions', 
    icon: GlobeAltIcon 
  },
  { 
    name: 'SRT Connections', 
    path: '/srt-connections', 
    icon: ShareIcon 
  },
  { 
    name: 'HLS Muxers', 
    path: '/hls-muxers', 
    icon: CollectionIcon 
  },
  { 
    name: 'Panel Settings', 
    path: '/settings', 
    icon: CogIcon 
  }
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`
      w-64 
      bg-white 
      dark:bg-gray-800 
      border-r 
      border-gray-200 
      dark:border-gray-700 
      p-4 
      flex 
      flex-col 
      h-screen 
      fixed 
      left-0 
      top-0
    `}>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          MediaMTX
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Control Panel
        </p>
      </div>

      <nav className="flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`
                flex 
                items-center 
                py-3 
                px-4 
                rounded-lg 
                mb-2 
                transition-colors 
                duration-200
                ${isActive 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}
              `}
            >
              <Icon className="w-6 h-6 mr-3" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Theme
        </span>
        <button 
          onClick={toggleTheme}
          className="
            w-12 
            h-6 
            bg-gray-200 
            dark:bg-gray-700 
            rounded-full 
            relative 
            transition-colors 
            duration-300
          "
        >
          <div 
            className={`
              absolute 
              top-1/2 
              -translate-y-1/2 
              w-4 
              h-4 
              bg-white 
              dark:bg-gray-300 
              rounded-full 
              shadow-md 
              transition-transform 
              duration-300
              ${isDarkMode ? 'translate-x-full' : 'translate-x-0'}
            `}
          ></div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;