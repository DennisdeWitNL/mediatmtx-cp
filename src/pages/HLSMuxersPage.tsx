import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { MediaMTXAPI } from '../services/mediamtx-api';
import { HLSMuxer } from '../types/mediamtx-types';
import { handleApiError, getUserFriendlyErrorMessage } from '../utils/error-handler';
import { formatDate, getTimeSince } from '../utils/formatters';
import { formatBytes } from '../utils/formatters';
import { 
  DesktopComputerIcon, 
  InformationCircleIcon,
  ClockIcon,
  DownloadIcon
} from '@heroicons/react/outline';

const HLSMuxersPage: React.FC = () => {
  const [muxers, setMuxers] = useState<HLSMuxer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiUrl } = useTheme();

  useEffect(() => {
    const fetchHLSMuxers = async () => {
      try {
        setLoading(true);
        const api = new MediaMTXAPI(apiUrl);
        const muxerList = await api.getHLSMuxers();
        const typedMuxers: HLSMuxer[] = ((muxerList as any).items || []) as HLSMuxer[];
        setMuxers(typedMuxers);
        setLoading(false);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(getUserFriendlyErrorMessage(apiError));
        setLoading(false);
      }
    };

    fetchHLSMuxers();
    
    // Optional: Set up polling for live updates
    const intervalId = setInterval(fetchHLSMuxers, 5000);
    return () => clearInterval(intervalId);
  }, [apiUrl]);

  // Helper function to parse date
  const parseDate = (dateString?: string | null): Date => {
    return dateString ? new Date(dateString) : new Date();
  };

  // Helper function to format date
  const formatDate = (dateString?: string | null): string => {
    const date = parseDate(dateString);
    return date.toLocaleString();
  };

  // Helper function to calculate time since creation
  const getTimeSinceCreation = (created: string): string => {
    try {
      const createdDate = parseDate(created);
      const now = new Date();
      const diffMs = now.getTime() - createdDate.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const hours = Math.floor(diffSec / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);
      const seconds = diffSec % 60;
      return `${hours}h ${minutes}m ${seconds}s`;
    } catch {
      return 'N/A';
    }
  };

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
          <DesktopComputerIcon className="w-7 h-7 mr-2 text-blue-500" />
          HLS Muxers
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {muxers.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <InformationCircleIcon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <p>No active HLS Muxers</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Path</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">Uptime</th>
                  <th className="px-6 py-3">Last Request</th>
                  <th className="px-6 py-3">
                    <div className="flex items-center">
                      <DownloadIcon className="w-4 h-4 mr-2 text-blue-500" />
                      Bytes Sent
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {muxers.map((muxer) => (
                  <tr 
                    key={muxer.path} 
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {muxer.path}
                    </td>
                     <td className="px-6 py-4">
                       {muxer.lastRequest ? formatDate(muxer.lastRequest) : 'N/A'}
                     </td>
                     <td className="px-6 py-4 flex items-center">
                       <ClockIcon className="w-4 h-4 mr-2 text-blue-500" />
                       {muxer.created ? getTimeSinceCreation(muxer.created) : 'N/A'}
                     </td>
                     <td className="px-6 py-4">
                       {muxer.lastRequest ? formatDate(muxer.lastRequest) : 'N/A'}
                     </td>
                     <td className="px-6 py-4">
                       {formatBytes(muxer.bytesSent)}
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* HLS Muxers Statistics Card */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          HLS Muxers Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Muxers', value: muxers.length },
             { 
               label: 'Total Bytes Sent', 
               value: formatBytes(muxers.reduce((sum, m) => sum + m.bytesSent, 0))
             },
             { 
               label: 'Avg Bytes Sent per Muxer', 
               value: muxers.length > 0 
                 ? formatBytes(Math.round(muxers.reduce((sum, m) => sum + m.bytesSent, 0) / muxers.length))
                 : formatBytes(0)
             },
{ 
                label: 'Most Recently Accessed Muxer', 
                value: muxers.length > 0 
                  ? muxers
                      .filter(muxer => muxer.lastRequest)
                      .reduce((latest, current) => 
                        !latest.lastRequest || (current.lastRequest && 
                          parseDate(current.lastRequest) > parseDate(latest.lastRequest)) 
                          ? current 
                          : latest
                      ).path
                  : 'N/A'
              },
{ 
                label: 'Oldest Muxer', 
                value: muxers.length > 0 
                  ? muxers.reduce((oldest, current) => 
                      parseDate(current.created || Date.now().toString()) < parseDate(oldest.created || Date.now().toString()) 
                        ? current 
                        : oldest
                    ).path
                  : 'N/A'
              },
              { 
                label: 'Newest Muxer', 
                value: muxers.length > 0 
                  ? muxers.reduce((newest, current) => 
                      parseDate(current.created || Date.now().toString()) > parseDate(newest.created || Date.now().toString()) 
                        ? current 
                        : newest
                    ).path
                  : 'N/A'
              }
          ].map(({ label, value }) => (
            <div 
              key={label}
              className="
                bg-light-blue 
                dark:bg-dark-blue/20 
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

export default HLSMuxersPage;