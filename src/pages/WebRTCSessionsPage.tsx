import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { MediaMTXAPI } from '../services/mediamtx-api';
import { WebRTCSession } from '../types/mediamtx-types';
import { handleApiError, getUserFriendlyErrorMessage } from '../utils/error-handler';
import { formatDate, getTimeSince } from '../utils/date';
import { formatBytes } from '../utils/format';
import { 
  GlobeAltIcon, 
  InformationCircleIcon 
} from '@heroicons/react/outline';

const WebRTCSessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<WebRTCSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiUrl } = useTheme();

  useEffect(() => {
    const fetchWebRTCSessions = async () => {
      try {
        setLoading(true);
        const api = new MediaMTXAPI(apiUrl);
        const sessionList = await api.getWebRTCSessions();
        setSessions((sessionList as any).items || []);
        setLoading(false);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(getUserFriendlyErrorMessage(apiError));
        setLoading(false);
      }
    };

    fetchWebRTCSessions();
    
    // Optional: Set up polling for live updates
    const intervalId = setInterval(fetchWebRTCSessions, 5000);
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
          <GlobeAltIcon className="w-7 h-7 mr-2 text-blue-500" />
          WebRTC Sessions
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <InformationCircleIcon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <p>No active WebRTC sessions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Session ID</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">Remote Address</th>
                  <th className="px-6 py-3">State</th>
                  <th className="px-6 py-3">Path</th>
                  <th className="px-6 py-3">Peer Connection</th>
                  <th className="px-6 py-3">Bytes Sent/Received</th>
                  <th className="px-6 py-3">RTP Packets</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr 
                    key={session.id} 
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {session.id}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(session.created)}
                    </td>
                    <td className="px-6 py-4">{session.remoteAddr}</td>
                    <td className="px-6 py-4">
                      <span 
                        className={`
                          px-2 
                          py-1 
                          rounded 
                          text-xs 
                          font-semibold
                          ${session.state === 'publish' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}
                        `}
                      >
                        {session.state}
                      </span>
                    </td>
                    <td className="px-6 py-4">{session.path}</td>
                    <td className="px-6 py-4">
                      <span 
                        className={`
                          px-2 
                          py-1 
                          rounded 
                          text-xs 
                          font-semibold
                          ${session.peerConnectionEstablished 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}
                        `}
                      >
                        {session.peerConnectionEstablished ? 'Established' : 'Pending'}
                      </span>
                    </td>
                     <td className="px-6 py-4">
                       <div className="flex flex-col">
                         <span>Sent: {formatBytes(session.bytesSent)}</span>
                         <span>Received: {formatBytes(session.bytesReceived)}</span>
                       </div>
                     </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>Sent: {session.rtpPacketsSent}</span>
                        <span>Received: {session.rtpPacketsReceived}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Lost: {session.rtpPacketsLost}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Session Statistics Card */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          WebRTC Session Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Sessions', value: sessions.length },
            { 
              label: 'Publishing Sessions', 
              value: sessions.filter(s => s.state === 'publish').length 
            },
            { 
              label: 'Established Connections', 
              value: sessions.filter(s => s.peerConnectionEstablished).length 
            },
             { 
               label: 'Total Bytes Sent', 
               value: formatBytes(sessions.reduce((sum, s) => sum + s.bytesSent, 0)) 
             },
             { 
               label: 'Total Bytes Received', 
               value: formatBytes(sessions.reduce((sum, s) => sum + s.bytesReceived, 0)) 
             },
            { 
              label: 'Total RTP Packets Sent', 
              value: sessions.reduce((sum, s) => sum + s.rtpPacketsSent, 0) 
            },
            { 
              label: 'Total RTP Packets Received', 
              value: sessions.reduce((sum, s) => sum + s.rtpPacketsReceived, 0) 
            },
            { 
              label: 'Total RTP Packets Lost', 
              value: sessions.reduce((sum, s) => sum + s.rtpPacketsLost, 0) 
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

export default WebRTCSessionsPage;