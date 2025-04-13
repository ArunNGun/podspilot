import React, { useEffect, useState } from 'react';
import axios from 'axios';
import usePodPilotStore from '../lib/store';
import styles from './PodList.module.css';

const PodList: React.FC = () => {
  const {
    pods,
    setPods,
    selectedNamespace,
    selectedPod,
    setSelectedPod,
    setLogs,
    setIsLoadingLogs,
    setIsAnalyzing,
    setAnalysisResult,
  } = usePodPilotStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch pods when the selected namespace changes
  useEffect(() => {
    const fetchPods = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/pods?namespace=${selectedNamespace}`);
        setPods(response.data.pods);
      } catch (err) {
        console.error('Error fetching pods:', err);
        setError('Failed to fetch pods. Using demo pods for demonstration.');
        
        // Create mock pods for demonstration
        const mockPods = [
          {
            metadata: {
              name: 'demo-pod-1',
              namespace: selectedNamespace,
              uid: 'mock-uid-1',
              creationTimestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
            },
            status: {
              phase: 'Running',
              containerStatuses: [{ restartCount: 2 }],
            },
          },
          {
            metadata: {
              name: 'demo-pod-2',
              namespace: selectedNamespace,
              uid: 'mock-uid-2',
              creationTimestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
            },
            status: {
              phase: 'Running',
              containerStatuses: [{ restartCount: 0 }],
            },
          },
          {
            metadata: {
              name: 'demo-pod-3',
              namespace: selectedNamespace,
              uid: 'mock-uid-3',
              creationTimestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 48 hours ago
            },
            status: {
              phase: 'Pending',
              containerStatuses: [{ restartCount: 0 }],
            },
          },
          {
            metadata: {
              name: 'demo-pod-4',
              namespace: selectedNamespace,
              uid: 'mock-uid-4',
              creationTimestamp: new Date(Date.now() - 3600000 * 72).toISOString(), // 72 hours ago
            },
            status: {
              phase: 'Failed',
              containerStatuses: [{ restartCount: 5 }],
            },
          },
        ];
        
        setPods(mockPods);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPods();
  }, [selectedNamespace, setPods]);

  // Handle pod selection
  const handleSelectPod = (pod: any) => {
    setSelectedPod(pod);
  };

  // Handle viewing logs
  const handleViewLogs = async (pod: any) => {
    setIsLoadingLogs(true);
    setLogs('');
    try {
      const response = await axios.get(`/api/logs?podName=${pod.metadata.name}&namespace=${pod.metadata.namespace}&tailLines=100`);
      setLogs(response.data.logs);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setLogs('Failed to fetch logs. Please try again.');
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Handle restarting a pod
  const handleRestartPod = async (pod: any) => {
    if (!confirm(`Are you sure you want to restart pod ${pod.metadata.name}?`)) {
      return;
    }

    try {
      await axios.post('/api/restart', {
        podName: pod.metadata.name,
        namespace: pod.metadata.namespace,
      });
      alert(`Pod ${pod.metadata.name} restarted successfully.`);
      
      // Refresh the pod list
      const response = await axios.get(`/api/pods?namespace=${selectedNamespace}`);
      setPods(response.data.pods);
    } catch (err) {
      console.error('Error restarting pod:', err);
      alert('Failed to restart pod. Please try again.');
    }
  };

  // Handle analyzing logs
  const handleAnalyzeLogs = async (pod: any) => {
    setIsAnalyzing(true);
    setAnalysisResult('');
    try {
      // First, get the logs
      const logsResponse = await axios.get(`/api/logs?podName=${pod.metadata.name}&namespace=${pod.metadata.namespace}&tailLines=100`);
      const logs = logsResponse.data.logs;
      
      // Then, analyze the logs
      const analysisResponse = await axios.post('/api/analyze-logs', {
        logs,
        model: usePodPilotStore.getState().selectedModel,
      });
      
      setAnalysisResult(analysisResponse.data.analysis);
    } catch (err) {
      console.error('Error analyzing logs:', err);
      setAnalysisResult('Failed to analyze logs. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Format pod age
  const formatAge = (creationTimestamp: string) => {
    const created = new Date(creationTimestamp);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d${diffHours}h`;
    } else if (diffHours > 0) {
      return `${diffHours}h${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  };

  return (
    <div className={styles.podListContainer}>
      <h2>Pods in {selectedNamespace}</h2>
      
      {isLoading && <p className={styles.loading}>Loading pods...</p>}
      {error && <p className={styles.error}>{error}</p>}
      
      {!isLoading && !error && pods.length === 0 && (
        <p className={styles.noPods}>No pods found in this namespace.</p>
      )}
      
      {!isLoading && !error && pods.length > 0 && (
        <table className={styles.podTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Restarts</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pods.map((pod) => (
              <tr 
                key={pod.metadata.uid} 
                className={selectedPod?.metadata.uid === pod.metadata.uid ? styles.selectedRow : ''}
                onClick={() => handleSelectPod(pod)}
              >
                <td>{pod.metadata.name}</td>
                <td>
                  <span className={`${styles.status} ${styles[pod.status.phase.toLowerCase()]}`}>
                    {pod.status.phase}
                  </span>
                </td>
                <td>
                  {pod.status.containerStatuses?.[0]?.restartCount || 0}
                </td>
                <td>{formatAge(pod.metadata.creationTimestamp)}</td>
                <td className={styles.actions}>
                  <button 
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewLogs(pod);
                    }}
                  >
                    Logs
                  </button>
                  <button 
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestartPod(pod);
                    }}
                  >
                    Restart
                  </button>
                  <button 
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnalyzeLogs(pod);
                    }}
                  >
                    Analyze
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PodList;
