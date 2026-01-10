import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  CogIcon, 
  ServerIcon, 
  MoonIcon, 
  SunIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/outline';
import { Input, ToggleSwitch } from '../components/UI/FormComponents';

// Interface for panel settings
interface PanelSettings {
  apiUrl: string;
  darkMode: boolean;
  autoRefreshInterval: number;
  notificationsEnabled: boolean;
}

const PanelSettingsPage: React.FC = () => {
  const { isDarkMode, toggleTheme, apiUrl, setApiUrl } = useTheme();
  const [settings, setSettings] = useState<PanelSettings>({
    apiUrl: apiUrl,
    darkMode: isDarkMode,
    autoRefreshInterval: parseInt(localStorage.getItem('autoRefreshInterval') || '5000'),
    notificationsEnabled: localStorage.getItem('notificationsEnabled') === 'true'
  });
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // URL validation function
  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle API URL change
  const handleApiUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setSettings(prev => ({ ...prev, apiUrl: newUrl }));
    setIsValidUrl(validateUrl(newUrl));
  };

  // Save settings
  const saveSettings = () => {
    if (!isValidUrl) {
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saving');

    try {
      // Update API URL in context (this will also save to localStorage)
      setApiUrl(settings.apiUrl);

      // Persist auto-refresh interval
      localStorage.setItem('autoRefreshInterval', settings.autoRefreshInterval.toString());

      // Persist notifications setting
      localStorage.setItem('notificationsEnabled', settings.notificationsEnabled.toString());

      // Toggle theme if different
      if (settings.darkMode !== isDarkMode) {
        toggleTheme();
      }

      // Simulate save delay
      setTimeout(() => {
        setSaveStatus('success');
        
        // Reset status after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      }, 500);
    } catch (error) {
      setSaveStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
          <CogIcon className="w-7 h-7 mr-2 text-blue-500" />
          Panel Settings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* API Configuration */}
          <div className="bg-light-blue dark:bg-dark-blue/20 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
              <ServerIcon className="w-5 h-5 mr-2 text-blue-500" />
              API Configuration
            </h2>
            
            <Input 
              label="MediaMTX API URL" 
              value={settings.apiUrl}
              onChange={handleApiUrlChange}
              placeholder="Enter MediaMTX API URL"
              error={!isValidUrl ? "Invalid URL format" : undefined}
            />

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Auto-Refresh Interval (ms)
              </label>
              <input 
                type="number"
                value={settings.autoRefreshInterval}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  autoRefreshInterval: parseInt(e.target.value) 
                }))}
                className="
                  w-full 
                  px-3 
                  py-2 
                  border 
                  rounded-lg 
                  bg-white 
                  dark:bg-gray-700 
                  dark:text-gray-200
                  dark:border-gray-600
                "
                min="1000"
                max="60000"
              />
            </div>
          </div>

          {/* Appearance and Notifications */}
          <div className="bg-light-green dark:bg-dark-green/20 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
              {isDarkMode ? <MoonIcon className="w-5 h-5 mr-2 text-purple-500" /> : <SunIcon className="w-5 h-5 mr-2 text-yellow-500" />}
              Appearance and Notifications
            </h2>
            
            <ToggleSwitch 
              label="Dark Mode" 
              checked={settings.darkMode}
              onChange={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
              description="Switch between light and dark themes"
            />

            <ToggleSwitch 
              label="Enable Notifications" 
              checked={settings.notificationsEnabled}
              onChange={() => setSettings(prev => ({ 
                ...prev, 
                notificationsEnabled: !prev.notificationsEnabled 
              }))}
              description="Receive desktop notifications for important events"
            />
          </div>
        </div>

        {/* Save Button and Status */}
        <div className="mt-6 flex justify-end items-center space-x-4">
          {saveStatus === 'error' && (
            <div className="flex items-center text-red-600 dark:text-red-400 mr-4">
              <ExclamationCircleIcon className="w-5 h-5 mr-2" />
              Failed to save settings
            </div>
          )}
          {saveStatus === 'success' && (
            <div className="flex items-center text-green-600 dark:text-green-400 mr-4">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Settings saved successfully
            </div>
          )}
          
          <button 
            onClick={saveSettings}
            disabled={!isValidUrl || saveStatus === 'saving'}
            className={`
              px-4 
              py-2 
              rounded-lg 
              text-white 
              transition-colors 
              duration-300
              flex 
              items-center
              ${!isValidUrl || saveStatus === 'saving'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'}
            `}
          >
            {saveStatus === 'saving' ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </span>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>

      {/* Additional Information Card */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          About This Panel
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              label: 'Panel Version', 
              value: '1.0.0' 
            },
            { 
              label: 'Theme Mode', 
              value: isDarkMode ? 'Dark' : 'Light' 
            },
            { 
              label: 'Current API URL', 
              value: apiUrl 
            },
            { 
              label: 'Refresh Interval', 
              value: `${settings.autoRefreshInterval} ms` 
            }
          ].map(({ label, value }) => (
            <div 
              key={label}
              className="
                bg-light-red 
                dark:bg-dark-red/20 
                p-4 
                rounded-lg 
                text-center
              "
            >
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {label}
              </h3>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200 break-words">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PanelSettingsPage;