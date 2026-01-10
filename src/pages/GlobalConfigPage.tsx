import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { MediaMTXAPI } from '../services/mediamtx-api';
import { GlobalConfig } from '../types/mediamtx-types';
import { 
  SwitchHorizontalIcon, 
  ServerIcon, 
  CogIcon, 
  VideoCameraIcon 
} from '@heroicons/react/outline';

const GlobalConfigPage: React.FC = () => {
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [editedConfig, setEditedConfig] = useState<GlobalConfig>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiUrl } = useTheme();

  useEffect(() => {
    const fetchGlobalConfig = async () => {
      try {
        const api = new MediaMTXAPI(apiUrl);
        const globalConfig = await api.getGlobalConfig();
        const typedConfig: GlobalConfig = globalConfig as GlobalConfig;
        setConfig(typedConfig);
        setEditedConfig(typedConfig);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch global configuration');
        setLoading(false);
      }
    };

    fetchGlobalConfig();
  }, [apiUrl]);

  const handleConfigUpdate = async () => {
    try {
      const api = new MediaMTXAPI(apiUrl);
      await api.updateGlobalConfig(editedConfig);
      setConfig(editedConfig);
      alert('Configuration updated successfully!');
    } catch (err) {
      setError('Failed to update configuration');
    }
  };

  const renderConfigSection = (
    title: string, 
    icon: React.ElementType, 
    fields: { key: keyof GlobalConfig; label: string; type: 'boolean' | 'string' }[]
  ) => {
    const Icon = icon;
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
          <Icon className="w-6 h-6 mr-2 text-blue-500" />
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(({ key, label, type }) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-gray-300">{label}</label>
              {type === 'boolean' ? (
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={!!editedConfig[key]}
                      onChange={() => setEditedConfig(prev => ({
                        ...prev,
                        [key]: !prev[key]
                      }))}
                    />
                    <div className={`
                      w-10 h-4 
                      ${editedConfig[key] ? 'bg-blue-500' : 'bg-gray-300'}
                      rounded-full 
                      shadow-inner 
                      transition-colors
                    `}></div>
                    <div className={`
                      dot absolute 
                      -left-1 -top-1 
                      bg-white 
                      w-6 h-6 
                      rounded-full 
                      shadow 
                      transition-transform
                      ${editedConfig[key] ? 'translate-x-full' : 'translate-x-0'}
                    `}></div>
                  </div>
                </label>
              ) : (
                <input
                  type="text"
                  value={editedConfig[key] as string || ''}
                  onChange={(e) => setEditedConfig(prev => ({
                    ...prev,
                    [key]: e.target.value
                  }))}
                  className="
                    ml-4 
                    px-2 
                    py-1 
                    border 
                    rounded 
                    bg-gray-100 
                    dark:bg-gray-700 
                    dark:border-gray-600 
                    text-gray-800 
                    dark:text-gray-200
                  "
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

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
      {renderConfigSection('General Configuration', CogIcon, [
        { key: 'logLevel', label: 'Log Level', type: 'string' },
        { key: 'logStructured', label: 'Structured Logging', type: 'boolean' },
      ])}

      {renderConfigSection('Server Protocols', ServerIcon, [
        { key: 'rtsp', label: 'RTSP Server', type: 'boolean' },
        { key: 'rtmp', label: 'RTMP Server', type: 'boolean' },
        { key: 'hls', label: 'HLS Server', type: 'boolean' },
        { key: 'webrtc', label: 'WebRTC Server', type: 'boolean' },
      ])}

      <div className="flex justify-end space-x-4">
        <button 
          onClick={() => setEditedConfig(config || {})}
          className="
            px-4 
            py-2 
            bg-gray-200 
            dark:bg-gray-700 
            text-gray-700 
            dark:text-gray-300 
            rounded-lg 
            hover:bg-gray-300 
            dark:hover:bg-gray-600
          "
        >
          Reset
        </button>
        <button 
          onClick={handleConfigUpdate}
          className="
            px-4 
            py-2 
            bg-blue-500 
            text-white 
            rounded-lg 
            hover:bg-blue-600
          "
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default GlobalConfigPage;