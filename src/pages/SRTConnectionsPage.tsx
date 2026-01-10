import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { MediaMTXAPI } from '../services/mediamtx-api';
import { SRTConnection } from '../types/mediamtx-types';
import { handleApiError, getUserFriendlyErrorMessage } from '../utils/error-handler';
import { formatDate, getTimeSince } from '../utils/date';
import { formatBytes } from '../utils/format';
import { 
  ShareIcon, 
  InformationCircleIcon 
} from '@heroicons/react/outline';

const SRTConnectionsPage: React.FC = () => {
  const [connections, setConnections] = useState<SRTConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiUrl } = useTheme();

  useEffect(() => {
    const fetchSRTConnections = async () => {
      try {
        setLoading(true);
        const api = new MediaMTXAPI(apiUrl);
        const connectionList = await api.getSRTConnections();
        setConnections((connectionList as any).items || []);
        setLoading(false);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(getUserFriendlyErrorMessage(apiError));
        setLoading(false);
      }
    };

    fetchSRTConnections();
    
    // Optional: Set up polling for live updates
    const intervalId = setInterval(fetchSRTConnections, 5000);
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
          <ShareIcon className="w-7 h-7 mr-2 text-blue-500" />
          SRT Connections
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {connections.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <InformationCircleIcon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <p>No active SRT connections</p>
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
                  <th className="px-6 py-3">Packets Sent/Received</th>
                  <th className="px-6 py-3">Bandwidth</th>
                  <th className="px-6 py-3">Packet Loss</th>
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
                        <span>Sent: {conn.packetsSent}</span>
                        <span>Received: {conn.packetsReceived}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>Send: {conn['mbpsSendRate']?.toFixed(2) || 'N/A'} Mbps</span>
                        <span>Receive: {conn['mbpsReceiveRate']?.toFixed(2) || 'N/A'} Mbps</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>Send Loss: {conn['packetsSendLossRate']?.toFixed(2) || 'N/A'}%</span>
                        <span>Receive Loss: {conn['packetsReceivedLossRate']?.toFixed(2) || 'N/A'}%</span>
                      </div>
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
          SRT Connection Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Connections', value: connections.length },
            { 
              label: 'Publishing Connections', 
              value: connections.filter(c => c.state === 'publish').length 
            },
            { 
              label: 'Total Packets Sent', 
              value: connections.reduce((sum, c) => sum + c.packetsSent, 0) 
            },
            { 
              label: 'Total Packets Received', 
              value: connections.reduce((sum, c) => sum + c.packetsReceived, 0) 
            },
            { 
              label: 'Avg Send Bandwidth', 
              value: connections.length > 0 
                ? (connections.reduce((sum, c) => sum + (c['mbpsSendRate'] || 0), 0) / connections.length).toFixed(2) + ' Mbps'
                : 'N/A' 
            },
            { 
              label: 'Avg Receive Bandwidth', 
              value: connections.length > 0 
                ? (connections.reduce((sum, c) => sum + (c['mbpsReceiveRate'] || 0), 0) / connections.length).toFixed(2) + ' Mbps'
                : 'N/A' 
            },
            { 
              label: 'Avg Send Loss Rate', 
              value: connections.length > 0 
                ? (connections.reduce((sum, c) => sum + (c['packetsSendLossRate'] || 0), 0) / connections.length).toFixed(2) + '%'
                : 'N/A' 
            },
            { 
              label: 'Avg Receive Loss Rate', 
              value: connections.length > 0 
                ? (connections.reduce((sum, c) => sum + (c['packetsReceivedLossRate'] || 0), 0) / connections.length).toFixed(2) + '%'
                : 'N/A' 
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

export default SRTConnectionsPage;