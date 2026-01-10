import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { MediaMTXAPI } from '../services/mediamtx-api';
import { PathConfig, PathConfigList } from '../types/mediamtx-types';
import { handleApiError, getUserFriendlyErrorMessage } from '../utils/error-handler';
import { formatDate, getTimeSince } from '../utils/date';
import { 
  DocumentTextIcon, 
  PlusIcon, 
  TrashIcon, 
  PencilIcon 
} from '@heroicons/react/outline';
import { Input, ToggleSwitch, Select } from '../components/UI/FormComponents';
import { formatBytes } from '../utils/format';

const PathConfigPage: React.FC = () => {
  const [paths, setPaths] = useState<PathConfig[]>([]);
  const [selectedPath, setSelectedPath] = useState<PathConfig>({
    name: '',
    source: { type: '', id: '' },
    sourceOnDemand: false,
    record: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiUrl } = useTheme();

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        setLoading(true);
        const api = new MediaMTXAPI(apiUrl);
        const pathList = await api.getPaths();
        // Safely handle different API response formats
        const pathItems = Array.isArray(pathList) 
          ? pathList 
          : (pathList as PathConfigList).items || []
        setPaths(pathItems);
        setLoading(false);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(getUserFriendlyErrorMessage(apiError));
        setLoading(false);
      }
    };

    fetchPaths();
  }, [apiUrl]);

  const handleCreatePath = async () => {
    if (!selectedPath.name) {
      setError('Path name is required');
      return;
    }

    try {
      const api = new MediaMTXAPI(apiUrl);
      await api.createPath(selectedPath);
      setPaths(prev => [...prev, selectedPath]);
      setSelectedPath({
        name: '',
        source: '',
        sourceOnDemand: false,
        record: false
      });
      setError(null);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(getUserFriendlyErrorMessage(apiError));
    }
  };

  const handleDeletePath = async (pathName: string) => {
    try {
      const api = new MediaMTXAPI(apiUrl);
      await api.deletePath(pathName);
      setPaths(prev => prev.filter(path => path.name !== pathName));
    } catch (err) {
      const apiError = handleApiError(err);
      setError(getUserFriendlyErrorMessage(apiError));
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
          <DocumentTextIcon className="w-7 h-7 mr-2 text-blue-500" />
          Path Configurations
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Path Creation/Editing Form */}
        <div className="bg-light-blue dark:bg-dark-blue/20 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
            {selectedPath.name ? 'Edit Path' : 'Create New Path'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Path Name" 
              value={selectedPath.name}
              onChange={(e) => setSelectedPath(prev => ({ 
                ...prev, 
                name: e.target.value 
              }))}
              placeholder="Enter path name"
            />

          <Select 
             label="Source Type"
             options={[
               { value: 'rtsp', label: 'RTSP' },
               { value: 'rtmp', label: 'RTMP' },
               { value: 'hls', label: 'HLS' },
               { value: 'webrtc', label: 'WebRTC' }
             ]}
             value={typeof selectedPath.source === 'string' ? selectedPath.source : selectedPath.source.type}
             onChange={(e) => setSelectedPath(prev => ({ 
               ...prev, 
               source: typeof prev.source === 'string' 
                 ? e.target.value 
                 : { ...prev.source, type: e.target.value } 
             }))}
           />

            <ToggleSwitch 
              label="On-Demand Source"
              checked={!!selectedPath.sourceOnDemand}
              onChange={(checked) => setSelectedPath(prev => ({ 
                ...prev, 
                sourceOnDemand: checked 
              }))}
              description="Enable source only when requested"
            />

            <ToggleSwitch 
              label="Record Stream"
              checked={!!selectedPath.record}
              onChange={(checked) => setSelectedPath(prev => ({ 
                ...prev, 
                record: checked 
              }))}
              description="Save stream to local storage"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button 
              onClick={handleCreatePath}
              className="
                px-4 
                py-2 
                bg-blue-500 
                text-white 
                rounded-lg 
                hover:bg-blue-600
                flex 
                items-center
              "
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {selectedPath.name ? 'Update Path' : 'Create Path'}
            </button>
          </div>
        </div>

        {/* Path List */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
             <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
               <tr>
                 <th className="px-6 py-3">Name</th>
                 <th className="px-6 py-3">Source</th>
                 <th className="px-6 py-3">Bytes Received</th>
                 <th className="px-6 py-3">Bytes Sent</th>
                 <th className="px-6 py-3">Tracks</th>
                 <th className="px-6 py-3">Readers</th>
                 <th className="px-6 py-3">Status</th>
                 <th className="px-6 py-3">Actions</th>
               </tr>
             </thead>
             <tbody>
               {paths.map((path) => (
                 <tr 
                   key={path.name} 
                   className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                 >
                   <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                     {path.name}
                   </td>
                   <td className="px-6 py-4">
                     {typeof path.source === 'string' 
                       ? path.source 
                       : `${path.source.type} (${path.source.id})`
                     }
                   </td>
                   <td className="px-6 py-4">
                     {formatBytes(path.bytesReceived)}
                   </td>
                   <td className="px-6 py-4">
                     {formatBytes(path.bytesSent)}
                   </td>
                   <td className="px-6 py-4">
                     {path.tracks?.join(', ') || 'No Tracks'}
                   </td>
                   <td className="px-6 py-4">
                     {path.readers?.length || 0} readers
                   </td>
                   <td className="px-6 py-4">
                     <span className={`
                       px-2 py-1 rounded-full text-xs font-medium
                       ${path.ready 
                         ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                         : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}
                     `}>
                       {path.ready ? 'Ready' : 'Not Ready'}
                     </span>
                   </td>
                   <td className="px-6 py-4 flex space-x-2">
                     <button 
                       onClick={() => setSelectedPath(path)}
                       className="text-blue-500 hover:text-blue-700"
                       title="Edit Path"
                     >
                       <PencilIcon className="w-5 h-5" />
                     </button>
                     <button 
                       onClick={() => handleDeletePath(path.name)}
                       className="text-red-500 hover:text-red-700"
                       title="Delete Path"
                     >
                       <TrashIcon className="w-5 h-5" />
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PathConfigPage;