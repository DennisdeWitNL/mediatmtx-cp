import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { handleApiError, getUserFriendlyErrorMessage } from '../utils/error-handler';
import { formatBytes } from '../utils/formatters';

interface GenericConnection {
  id: string;
  [key: string]: any;
}

interface DataStats {
  total: number;
  [key: string]: any;
}

export function useMediaMTXData<
  T extends GenericConnection, 
  Stats extends DataStats = { total: number }
>(
  fetchFn: (apiUrl: string) => Promise<T[]>, 
  apiUrl: string,
  options?: {
    pollingInterval?: number;
    computeStats?: (data: T[]) => Stats;
  }
) {
  const {
    pollingInterval = 7000,
    computeStats = (data: T[]) => ({ total: data.length })
  } = options || {};

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedData = await fetchFn(apiUrl);
      
      // Use functional state update to ensure most recent state
      setData(prevData => {
        // More efficient diff strategy
        if (fetchedData.length !== prevData.length) {
          return fetchedData;
        }

        // Compute if any item has changed
        const hasChanged = fetchedData.some((newItem, index) => {
          const existingItem = prevData[index];
          return (
            newItem.id !== existingItem.id || 
            JSON.stringify(newItem) !== JSON.stringify(existingItem)
          );
        });
        
        return hasChanged ? fetchedData : prevData;
      });
      
      setError(null);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(getUserFriendlyErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  }, [fetchFn, apiUrl]);

  // Stable references for dependencies
  const stableFetchData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    stableFetchData();
    
    // Set up interval with ability to clean up
    const intervalId = setInterval(stableFetchData, pollingInterval);
    return () => clearInterval(intervalId);
  }, [stableFetchData, pollingInterval]);

  // Memoized derived values with stable computation function
  const stableComputeStats = useCallback((inputData: T[]) => {
    return computeStats(inputData);
  }, [computeStats]);

  const dataStats = useMemo(() => {
    return stableComputeStats(data);
  }, [data, stableComputeStats]);

  return {
    data,
    loading,
    error,
    dataStats,
    refetch: stableFetchData
  } as {
    data: T[];
    loading: boolean;
    error: string | null;
    dataStats: Stats;
    refetch: () => void;
  };

  return {
    data,
    loading,
    error,
    dataStats,
    refetch: fetchData
  };
}