import React, { useState, useEffect } from 'react';
import { MediaMTXAPI } from '../services/mediamtx-api';
import { ServerInfo } from '../types/mediamtx-types';
import { useTheme } from '../context/ThemeContext';
import { InformationCircleIcon, ClockIcon } from '@heroicons/react/solid';

const ServerInfoPage: React.FC = () => {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiUrl } = useTheme();

  useEffect(() => {
    const fetchServerInfo = async () => {
      try {
        const api = new MediaMTXAPI(apiUrl);
        const info = await api.getServerInfo();
        const typedInfo = info as ServerInfo;
        setServerInfo(typedInfo);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch server information');
        setLoading(false);
      }
    };

    fetchServerInfo();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
        <p className="text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
          <InformationCircleIcon className="w-7 h-7 mr-2 text-blue-500" />
          Server Information
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-light-blue dark:bg-dark-blue/20 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Version
            </h2>
            <p className="text-gray-900 dark:text-gray-100">
              {serverInfo?.version || 'N/A'}
            </p>
          </div>
          
          <div className="bg-light-green dark:bg-dark-green/20 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-green-500" />
              Started At
            </h2>
            <p className="text-gray-900 dark:text-gray-100">
              {serverInfo?.started ? new Date(serverInfo.started).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Additional system information cards can be added here */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Reload Configuration', color: 'blue' },
            { name: 'Restart Server', color: 'red' },
            { name: 'Check Connections', color: 'green' },
            { name: 'View Logs', color: 'purple' }
          ].map((action) => (
            <button 
              key={action.name}
              className={`
                bg-${action.color}-100 
                dark:bg-${action.color}-900/20 
                text-${action.color}-700 
                dark:text-${action.color}-300 
                p-3 
                rounded-lg 
                hover:bg-${action.color}-200 
                dark:hover:bg-${action.color}-800/30 
                transition-colors
              `}
            >
              {action.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServerInfoPage;