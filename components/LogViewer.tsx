import React, { useEffect, useRef } from 'react';
import usePodPilotStore from '../lib/store';
import styles from './LogViewer.module.css';

const LogViewer: React.FC = () => {
  const {
    logs,
    isLoadingLogs,
    isLiveTail,
    selectedPod,
    setIsLiveTail,
    setLogs,
    setIsLoadingLogs,
  } = usePodPilotStore();

  const logContainerRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Set up live tail polling
  useEffect(() => {
    if (isLiveTail && selectedPod) {
      // Clear any existing interval
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      // Set up polling for logs every 3 seconds
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const response = await fetch(
            `/api/logs?podName=${selectedPod.metadata.name}&namespace=${selectedPod.metadata.namespace}&tailLines=100`
          );
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          
          if (data.error) {
            console.error('API error:', data.error);
            setLogs(`Error fetching logs: ${data.error}`);
            // Disable live tail if there's an error
            setIsLiveTail(false);
          } else {
            setLogs(data.logs || '');
          }
        } catch (error) {
          console.error('Error fetching logs:', error);
          setLogs(`Failed to fetch logs: ${error.message}`);
          // Disable live tail if there's an error
          setIsLiveTail(false);
        }
      }, 3000);
    }

    // Clean up interval on unmount or when live tail is disabled
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isLiveTail, selectedPod, setLogs]);

  // Toggle live tail
  const toggleLiveTail = () => {
    setIsLiveTail(!isLiveTail);
  };

  // Clear logs
  const clearLogs = () => {
    setLogs('');
  };

  // Refresh logs
  const refreshLogs = async () => {
    if (!selectedPod) return;

    setIsLoadingLogs(true);
    try {
      const response = await fetch(
        `/api/logs?podName=${selectedPod.metadata.name}&namespace=${selectedPod.metadata.namespace}&tailLines=100`
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('API error:', data.error);
        setLogs(`Error fetching logs: ${data.error}`);
      } else {
        setLogs(data.logs || '');
      }
    } catch (error) {
      console.error('Error refreshing logs:', error);
      setLogs(`Failed to fetch logs: ${error.message}`);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  return (
    <div className={styles.logViewerContainer}>
      <div className={styles.logHeader}>
        <h2>
          {selectedPod
            ? `Logs: ${selectedPod.metadata.name}`
            : 'Select a pod to view logs'}
        </h2>
        <div className={styles.logControls}>
          <button
            className={styles.controlButton}
            onClick={refreshLogs}
            disabled={!selectedPod || isLoadingLogs}
          >
            Refresh
          </button>
          <button
            className={`${styles.controlButton} ${isLiveTail ? styles.active : ''}`}
            onClick={toggleLiveTail}
            disabled={!selectedPod}
          >
            {isLiveTail ? 'Stop Live Tail' : 'Start Live Tail'}
          </button>
          <button
            className={styles.controlButton}
            onClick={clearLogs}
            disabled={!logs}
          >
            Clear
          </button>
        </div>
      </div>

      <div className={styles.logContent} ref={logContainerRef}>
        {isLoadingLogs && !logs && (
          <div className={styles.loading}>Loading logs...</div>
        )}
        
        {!isLoadingLogs && !logs && selectedPod && (
          <div className={styles.noLogs}>No logs available.</div>
        )}
        
        {!selectedPod && (
          <div className={styles.noPodSelected}>
            Select a pod from the list to view its logs.
          </div>
        )}
        
        {logs && (
          <pre className={styles.logs}>
            {logs}
          </pre>
        )}
      </div>
    </div>
  );
};

export default LogViewer;
