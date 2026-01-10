import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { MediaMTXAPI } from '../services/mediamtx-api';
import { 
  GlobalConfig, 
  AuthInternalUser, 
  AuthAction, 
  AuthPermission 
} from '../types/mediamtx-types';
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

  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [users, setUsers] = useState<AuthInternalUser[]>(() => 
    editedConfig.authInternalUsers || []
  );

  const availableActions: AuthAction[] = [
    'publish', 'read', 'playback', 'api', 'metrics', 'pprof'
  ];

  // Update users when editedConfig changes
  // Initialize or update users when editedConfig changes
  useEffect(() => {
    setUsers(editedConfig.authInternalUsers || []);
  }, [editedConfig]);

  // Fetch global configuration on initial load
  useEffect(() => {
    const fetchGlobalConfig = async () => {
      try {
        const api = new MediaMTXAPI(apiUrl);
        const globalConfig = await api.getGlobalConfig();
        
        // Normalize the configuration
        const normalizedConfig: GlobalConfig = {
          // General Settings
          logLevel: globalConfig.logLevel,
          logDestinations: globalConfig.logDestinations,
          logStructured: globalConfig.logStructured,
          logFile: globalConfig.logFile,
          sysLogPrefix: globalConfig.sysLogPrefix,

          // Performance
          readTimeout: globalConfig.readTimeout,
          writeTimeout: globalConfig.writeTimeout,
          writeQueueSize: globalConfig.writeQueueSize,
          udpMaxPayloadSize: globalConfig.udpMaxPayloadSize,
          udpReadBufferSize: globalConfig.udpReadBufferSize,

          // Hooks
          runOnConnect: globalConfig.runOnConnect,
          runOnDisconnect: globalConfig.runOnDisconnect,
          runOnConnectRestart: globalConfig.runOnConnectRestart,

          // Protocols
          rtsp: globalConfig.rtsp,
          rtspAddress: globalConfig.rtspAddress,
          rtspEncryption: globalConfig.rtspEncryption,
          rtspsAddress: globalConfig.rtspsAddress,
          rtspTransports: globalConfig.rtspTransports,

          rtmp: globalConfig.rtmp,
          rtmpAddress: globalConfig.rtmpAddress,
          rtmpEncryption: globalConfig.rtmpEncryption,
          rtmpsAddress: globalConfig.rtmpsAddress,

          hls: globalConfig.hls,
          hlsAddress: globalConfig.hlsAddress,
          hlsEncryption: globalConfig.hlsEncryption,
          hlsVariant: globalConfig.hlsVariant,
          hlsSegmentCount: globalConfig.hlsSegmentCount,
          hlsSegmentDuration: globalConfig.hlsSegmentDuration,
          hlsAlwaysRemux: globalConfig.hlsAlwaysRemux,

          webrtc: globalConfig.webrtc,
          webrtcAddress: globalConfig.webrtcAddress,
          webrtcEncryption: globalConfig.webrtcEncryption,
          webrtcHandshakeTimeout: globalConfig.webrtcHandshakeTimeout,
          webrtcTrackGatherTimeout: globalConfig.webrtcTrackGatherTimeout,
          webrtcLocalUDPAddress: globalConfig.webrtcLocalUDPAddress,
          webrtcIPsFromInterfaces: globalConfig.webrtcIPsFromInterfaces,
          webrtcAdditionalHosts: globalConfig.webrtcAdditionalHosts,

          // SRT
          srt: globalConfig.srt,
          srtAddress: globalConfig.srtAddress,

          // Authentication
          authMethod: globalConfig.authMethod,
          authInternalUsers: globalConfig.authInternalUsers,
          authHTTPAddress: globalConfig.authHTTPAddress,
          authJWTJWKS: globalConfig.authJWTJWKS,
          authJWTClaimKey: globalConfig.authJWTClaimKey,
          authJWTInHTTPQuery: globalConfig.authJWTInHTTPQuery,
        };
        
        // Set both config and editedConfig with the fetched configuration
        setConfig(normalizedConfig);
        setEditedConfig(normalizedConfig);
        
        // Update users state if available
        if (normalizedConfig.authInternalUsers) {
          setUsers(normalizedConfig.authInternalUsers);
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch global configuration', err);
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
    fields: { 
      key: keyof GlobalConfig; 
      label: string; 
      type: 'boolean' | 'string' | 'select'; 
      options?: string[] 
    }[]
  ) => {
    const Icon = icon;
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
          <Icon className="w-6 h-6 mr-2 text-blue-500" />
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(({ key, label, type, options }) => (
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
              ) : type === 'select' ? (
                <select
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
                >
                  {options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
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

  const UserManagementModal: React.FC<{
    isOpen: boolean;
    users: AuthInternalUser[];
    onClose: () => void;
    onAddUser: (user: AuthInternalUser) => void;
    onRemoveUser: (index: number) => void;
  }> = ({ isOpen, users, onClose, onAddUser, onRemoveUser }) => {
    const [newUser, setNewUser] = useState<AuthInternalUser>({
      user: '',
      pass: '',
      ips: [],
      permissions: []
    });

    if (!isOpen) return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <div 
          className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Manage Internal Users
          </h2>

          {/* Users List */}
          <div className="mb-4">
            {users?.map((user, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center border-b py-2 dark:border-gray-700"
              >
                <div>
                  <p className="font-semibold">{user.user}</p>
                  <p className="text-sm text-gray-500">
                    Permissions: {user.permissions.map(p => p.action).join(', ')}
                  </p>
                </div>
                <button 
                  onClick={() => onRemoveUser(index)}
                  className="text-red-500 hover:bg-red-100 p-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Add New User Form */}
          <div className="space-y-4">
            <input 
              type="text"
              placeholder="Username"
              value={newUser.user}
              onChange={(e) => setNewUser(prev => ({...prev, user: e.target.value}))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <input 
              type="password"
              placeholder="Password"
              value={newUser.pass}
              onChange={(e) => setNewUser(prev => ({...prev, pass: e.target.value}))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <input 
              type="text"
              placeholder="IP Restrictions (comma-separated)"
              value={newUser.ips?.join(', ') || ''}
              onChange={(e) => setNewUser(prev => ({
                ...prev, 
                ips: e.target.value.split(',').map(ip => ip.trim()).filter(Boolean)
              }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />

            <div>
              <h3 className="mb-2 font-semibold">Permissions</h3>
              <div className="grid grid-cols-3 gap-2">
                {availableActions.map(action => (
                  <label key={action} className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      checked={newUser.permissions.some(p => p.action === action)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewUser(prev => ({
                            ...prev,
                            permissions: [...prev.permissions, { action }]
                          }));
                        } else {
                          setNewUser(prev => ({
                            ...prev,
                            permissions: prev.permissions.filter(p => p.action !== action)
                          }));
                        }
                      }}
                      className="form-checkbox"
                    />
                    <span>{action}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                if (!newUser.user) return;
                onAddUser(newUser);
                // Reset new user form
                setNewUser({
                  user: '',
                  pass: '',
                  ips: [],
                  permissions: []
                });
              }}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Add User
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Previous sections remain the same */}
      {/* General Configuration */}
      {renderConfigSection('General Settings', CogIcon, [
        { key: 'readTimeout', label: 'Read Timeout', type: 'string' },
        { key: 'writeTimeout', label: 'Write Timeout', type: 'string' },
        { key: 'writeQueueSize', label: 'Write Queue Size', type: 'string' },
        { key: 'udpMaxPayloadSize', label: 'UDP Max Payload Size', type: 'string' },
        { 
          key: 'logLevel', 
          label: 'Log Level', 
          type: 'select', 
          options: ['info', 'debug', 'warn', 'error'] 
        },
        { key: 'logFile', label: 'Log File', type: 'string' },
        { key: 'logStructured', label: 'Structured Logging', type: 'boolean' },
      ])}

      {/* Record Configuration */}
      {renderConfigSection('Record Settings', VideoCameraIcon, [
        { key: 'runOnConnect', label: 'Run on Connect', type: 'string' },
        { key: 'runOnDisconnect', label: 'Run on Disconnect', type: 'string' },
        { key: 'runOnConnectRestart', label: 'Restart on Connect', type: 'boolean' },
      ])}

      {/* RTSP Server Configuration */}
      {renderConfigSection('RTSP Server', ServerIcon, [
        { key: 'rtsp', label: 'RTSP Server Enabled', type: 'boolean' },
        { key: 'rtspAddress', label: 'RTSP Address', type: 'string' },
        { 
          key: 'rtspTransports', 
          label: 'RTSP Transports', 
          type: 'select', 
          options: ['multicast', 'tcp', 'udp'] 
        },
        { 
          key: 'rtspEncryption', 
          label: 'RTSP Encryption', 
          type: 'select', 
          options: ['no', 'tls'] 
        },
        { key: 'rtspsAddress', label: 'RTSPS Address', type: 'string' },
      ])}

      {/* RTMP Server Configuration */}
      {renderConfigSection('RTMP Server', ServerIcon, [
        { key: 'rtmp', label: 'RTMP Server Enabled', type: 'boolean' },
        { key: 'rtmpAddress', label: 'RTMP Address', type: 'string' },
        { 
          key: 'rtmpEncryption', 
          label: 'RTMP Encryption', 
          type: 'select', 
          options: ['no', 'tls'] 
        },
        { key: 'rtmpsAddress', label: 'RTMPS Address', type: 'string' },
      ])}

      {/* HLS Server Configuration */}
      {renderConfigSection('HLS Server', ServerIcon, [
        { key: 'hls', label: 'HLS Server Enabled', type: 'boolean' },
        { key: 'hlsAddress', label: 'HLS Address', type: 'string' },
        { key: 'hlsEncryption', label: 'HLS Encryption', type: 'boolean' },
        { 
          key: 'hlsVariant', 
          label: 'HLS Variant', 
          type: 'select', 
          options: ['lowLatency', 'standard'] 
        },
        { key: 'hlsSegmentCount', label: 'Segment Count', type: 'string' },
        { key: 'hlsSegmentDuration', label: 'Segment Duration', type: 'string' },
        { key: 'hlsAlwaysRemux', label: 'Always Remux', type: 'boolean' },
      ])}

      {/* WebRTC Server Configuration */}
      {renderConfigSection('WebRTC Server', ServerIcon, [
        { key: 'webrtc', label: 'WebRTC Server Enabled', type: 'boolean' },
        { key: 'webrtcAddress', label: 'WebRTC Address', type: 'string' },
        { key: 'webrtcEncryption', label: 'WebRTC Encryption', type: 'boolean' },
        { key: 'webrtcHandshakeTimeout', label: 'Handshake Timeout', type: 'string' },
        { key: 'webrtcTrackGatherTimeout', label: 'Track Gather Timeout', type: 'string' },
        { key: 'webrtcLocalUDPAddress', label: 'Local UDP Address', type: 'string' },
        { key: 'webrtcIPsFromInterfaces', label: 'Use Interface IPs', type: 'boolean' },
      ])}

      {/* SRT Server Configuration */}
      {renderConfigSection('SRT Server', ServerIcon, [
        { key: 'srt', label: 'SRT Server Enabled', type: 'boolean' },
        { key: 'srtAddress', label: 'SRT Address', type: 'string' },
      ])}

      {/* Authentication Configuration */}
      {renderConfigSection('Authentication', SwitchHorizontalIcon, [
        { 
          key: 'authMethod', 
          label: 'Authentication Method', 
          type: 'select', 
          options: ['internal', 'http', 'jwt'] 
        },
        { key: 'authHTTPAddress', label: 'HTTP Auth Address', type: 'string' },
        { key: 'authJWTJWKS', label: 'JWT JWKS', type: 'string' },
        { key: 'authJWTClaimKey', label: 'JWT Claim Key', type: 'string' },
        { key: 'authJWTInHTTPQuery', label: 'JWT in HTTP Query', type: 'boolean' },
      ])}

      {/* Internal Users Section */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
          Internal Users
          <button
            onClick={() => setIsUsersModalOpen(true)}
            className="ml-4 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Manage Users
          </button>
        </h2>
        {users && users.length > 0 ? (
          <div>
            {users.map((user, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center border-b py-2 dark:border-gray-700"
              >
                <div>
                  <p className="font-semibold">{user.user}</p>
                  <p className="text-sm text-gray-500">
                    Permissions: {user.permissions.map(p => p.action).join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No users configured</p>
        )}
      </div>

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

      {/* User Management Modal */}
      <UserManagementModal
        isOpen={isUsersModalOpen}
        users={users}
        onClose={() => setIsUsersModalOpen(false)}
        onAddUser={(newUser) => {
          const updatedUsers = [...users, newUser];
          setUsers(updatedUsers);
          setEditedConfig(prev => ({
            ...prev,
            authInternalUsers: updatedUsers
          }));
        }}
        onRemoveUser={(index) => {
          const updatedUsers = users.filter((_, i) => i !== index);
          setUsers(updatedUsers);
          setEditedConfig(prev => ({
            ...prev,
            authInternalUsers: updatedUsers
          }));
        }}
      />
    </div>
  );
};

export default GlobalConfigPage;