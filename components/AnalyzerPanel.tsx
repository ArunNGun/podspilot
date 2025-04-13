import React from 'react';
import usePodPilotStore from '../lib/store';
import styles from './AnalyzerPanel.module.css';

const AnalyzerPanel: React.FC = () => {
  const {
    analysisResult,
    isAnalyzing,
    selectedPod,
    logs,
    selectedModel,
    setSelectedModel,
    models,
    setAnalysisResult,
    setIsAnalyzing,
  } = usePodPilotStore();

  // Handle model change
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  // Handle analyze button click
  const handleAnalyze = async () => {
    if (!logs || !selectedPod) return;

    setIsAnalyzing(true);
    setAnalysisResult('');

    try {
      const response = await fetch('/api/analyze-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs,
          model: selectedModel,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setAnalysisResult(`Error: ${data.error}`);
      } else {
        // Format the analysis with markdown
        const formattedAnalysis = `# Log Analysis for ${selectedPod.metadata.name}\n\n${data.analysis}`;
        setAnalysisResult(formattedAnalysis);
      }
    } catch (error) {
      console.error('Error analyzing logs:', error);
      setAnalysisResult('Failed to analyze logs. Please check your network connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={styles.analyzerContainer}>
      <div className={styles.analyzerHeader}>
        <h2>Log Analysis</h2>
        <div className={styles.analyzerControls}>
          <select
            className={styles.modelSelector}
            value={selectedModel}
            onChange={handleModelChange}
            disabled={isAnalyzing}
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          <button
            className={styles.analyzeButton}
            onClick={handleAnalyze}
            disabled={!logs || isAnalyzing || !selectedPod}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Logs'}
          </button>
        </div>
      </div>

      <div className={styles.analysisContent}>
        {isAnalyzing && (
          <div className={styles.analyzing}>
            <p>Analyzing logs with {selectedModel}...</p>
            <div className={styles.spinner}></div>
          </div>
        )}

        {!isAnalyzing && !analysisResult && (
          <div className={styles.noAnalysis}>
            {logs
              ? 'Click "Analyze Logs" to get AI-powered insights.'
              : 'View logs first, then analyze them for insights.'}
          </div>
        )}

        {analysisResult && (
          <div className={styles.analysisResult}>
            <h3>Analysis Results</h3>
            <div className={styles.resultContent}>
              {analysisResult.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzerPanel;
