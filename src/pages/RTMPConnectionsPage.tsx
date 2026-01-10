import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { MediaMTXAPI } from '../services/mediamtx-api';
import { RTMPConnection } from '../types/mediamtx-types';
import { handleApiError, getUserFriendlyErrorMessage } from '../utils/error-handler';
import { formatDate, getTimeSince } from '../utils/formatters';
import { formatBytes } from '../utils/formatters';
import { 
  WifiIcon, 
  InformationCircleIcon 
} from '@heroicons/react/outline';

const RTMPConnectionsPage: React.FC = () => {
  const [connections, setConnections] = useState<RTMPConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiUrl } = useTheme();

  useEffect(() => {
    const fetchRTMPConnections = async () => {
      try {
        setLoading(true);
        const api = new MediaMTXAPI(apiUrl);
        const connectionList = await api.getRTMPConnections();
        setConnections((connectionList as any).items || []);
        setLoading(false);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(getUserFriendlyErrorMessage(apiError));
        setLoading(false);
      }
    };

    fetchRTMPConnections();
    
    // Optional: Set up polling for live updates
    const intervalId = setInterval(fetchRTMPConnections, 5000);
    return () => clearInterval(intervalId);
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
          <WifiIcon className="w-7 h-7 mr-2 text-blue-500" />
          RTMP Connections
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {connections.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <InformationCircleIcon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <p>No active RTMP connections</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Connection ID</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">Remote Address</th>
                  <th className="px-6 py-3">State</th>
                  <th className="px-6 py-3">Path</th>
                  <th className="px-6 py-3">Bytes Sent/Received</th>
                  <th className="px-6 py-3">Query</th>
                </tr>
              </thead>
              <tbody>
                {connections.map((conn) => (
                  <tr 
                    key={conn.id} 
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {conn.id}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(conn.created)}
                    </td>
                    <td className="px-6 py-4">{conn.remoteAddr}</td>
                    <td className="px-6 py-4">
                      <span 
                        className={`
                          px-2 
                          py-1 
                          rounded 
                          text-xs 
                          font-semibold
                          ${conn.state === 'publish' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}
                        `}
                      >
                        {conn.state}
                      </span>
                    </td>
                    <td className="px-6 py-4">{conn.path}</td>
                     <td className="px-6 py-4">
                       <div className="flex flex-col">
                         <span>Sent: {formatBytes(conn.bytesSent)}</span>
                         <span>Received: {formatBytes(conn.bytesReceived)}</span>
                       </div>
                     </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                      {conn.query || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Connection Statistics Card */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Connection Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Connections', value: connections.length },
            { 
              label: 'Publishing Connections', 
              value: connections.filter(c => c.state === 'publish').length 
            },
             { 
               label: 'Total Bytes Sent', 
               value: formatBytes(connections.reduce((sum, c) => sum + c.bytesSent, 0)) 
             },
             { 
               label: 'Total Bytes Received', 
               value: formatBytes(connections.reduce((sum, c) => sum + c.bytesReceived, 0)) 
             }
          ].map(({ label, value }) => (
            <div 
              key={label}
              className="
                bg-light-green 
                dark:bg-dark-green/20 
                p-4 
                rounded-lg 
                text-center
              "
            >
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {label}
              </h3>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RTMPConnectionsPage;