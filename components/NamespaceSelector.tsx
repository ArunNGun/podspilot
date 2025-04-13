import React, { useEffect, useState } from 'react';
import axios from 'axios';
import usePodPilotStore from '../lib/store';
import styles from './NamespaceSelector.module.css';

const NamespaceSelector: React.FC = () => {
  const {
    namespaces,
    selectedNamespace,
    setNamespaces,
    setSelectedNamespace,
    setSelectedPod,
    setPods,
    clearLogs,
    clearAnalysisResult,
  } = usePodPilotStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch namespaces on component mount
  useEffect(() => {
    const fetchNamespaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Call the API to get all namespaces
        const response = await axios.get('/api/namespaces');
        
        // Extract namespace names from the response
        const namespaceNames = response.data.namespaces.map(
          (ns: any) => ns.metadata.name
        );
        
        setNamespaces(namespaceNames);
      } catch (err) {
        console.error('Error fetching namespaces:', err);
        setError('Failed to fetch namespaces. Using default namespaces for demo.');
        // Set demo namespaces if we can't fetch the list
        setNamespaces(['default', 'kube-system', 'kube-public', 'demo-namespace']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNamespaces();
  }, [setNamespaces]);

  // Handle namespace change
  const handleNamespaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNamespace = e.target.value;
    setSelectedNamespace(newNamespace);
    setSelectedPod(null);
    setPods([]);
    clearLogs();
    clearAnalysisResult();
  };

  return (
    <div className={styles.namespaceSelectorContainer}>
      <label htmlFor="namespace-select" className={styles.label}>
        Namespace:
      </label>
      <select
        id="namespace-select"
        className={styles.select}
        value={selectedNamespace}
        onChange={handleNamespaceChange}
        disabled={isLoading}
      >
        {namespaces.map((namespace) => (
          <option key={namespace} value={namespace}>
            {namespace}
          </option>
        ))}
      </select>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default NamespaceSelector;
