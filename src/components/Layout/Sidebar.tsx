import React, { useState } from 'react';
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

type NavItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const renderNavItem = (item: NavItem, isMobile: boolean = false) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    
    return (
      <Link 
        key={item.path} 
        to={item.path}
        onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
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
          ${isMobile ? 'text-sm' : ''}
        `}
      >
        <Icon className="w-6 h-6 mr-3" />
        <span className="text-sm font-medium">{item.name}</span>
      </Link>
    );
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const renderSidebarContent = (isMobile: boolean = false) => (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          MediaMTX
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Control Panel
        </p>
      </div>

      <nav className={isMobile ? 'flex flex-col' : 'flex-1'}>
        {NAV_ITEMS.map(item => renderNavItem(item, isMobile))}
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
    </>
  );

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={toggleMobileMenu}
        >
          <div 
            className="w-64 h-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={toggleMobileMenu}
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg z-50"
            >
              ✕
            </button>

            <div className="p-4 pt-16">
              {renderSidebarContent(true)}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`
        hidden 
        md:block 
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
        {renderSidebarContent()}
      </div>
    </>
  );
};

export default Sidebar;