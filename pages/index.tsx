import React, { useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import NamespaceSelector from '../components/NamespaceSelector';
import PodList from '../components/PodList';
import LogViewer from '../components/LogViewer';
import AnalyzerPanel from '../components/AnalyzerPanel';
import usePodPilotStore from '../lib/store';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { setModels } = usePodPilotStore();

  // Fetch available models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get('/api/models');
        if (response.data.models) {
          setModels(response.data.models);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        // Models will fall back to defaults in the store
      }
    };

    fetchModels();
  }, [setModels]);

  return (
    <div className={styles.container}>
      <Head>
        <title>PodPilot - Kubernetes Pod UI + Debug Assistant</title>
        <meta name="description" content="A developer-focused web app to inspect pods, view live logs, restart pods, and get GPT-based log analysis" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>🚀 PodPilot</h1>
          <p>Kubernetes Pod UI + Debug Assistant</p>
        </div>
      </header>

      <main className={styles.main}>
        <NamespaceSelector />
        
        <div className={styles.grid}>
          <div className={styles.podsColumn}>
            <PodList />
          </div>
          
          <div className={styles.contentColumn}>
            <LogViewer />
            <AnalyzerPanel />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          PodPilot - A developer-focused Kubernetes UI tool
        </p>
      </footer>
    </div>
  );
}
