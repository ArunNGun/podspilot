import { create } from 'zustand';

interface PodPilotState {
  namespaces: string[];
  selectedNamespace: string;
  setNamespaces: (namespaces: string[]) => void;
  setSelectedNamespace: (namespace: string) => void;

  pods: any[];
  selectedPod: any | null;
  setPods: (pods: any[]) => void;
  setSelectedPod: (pod: any | null) => void;

  logs: string;
  isLoadingLogs: boolean;
  isLiveTail: boolean;
  setLogs: (logs: string) => void;
  setIsLoadingLogs: (isLoading: boolean) => void;
  setIsLiveTail: (isLive: boolean) => void;
  clearLogs: () => void;

  analysisResult: string;
  isAnalyzing: boolean;
  setAnalysisResult: (result: string) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  clearAnalysisResult: () => void;

  models: { id: string; name: string }[];
  selectedModel: string;
  setModels: (models: { id: string; name: string }[]) => void;
  setSelectedModel: (model: string) => void;
}

const usePodPilotStore = create<PodPilotState>((set) => ({
  namespaces: ['default'],
  selectedNamespace: 'default',
  setNamespaces: (namespaces) => set({ namespaces }),
  setSelectedNamespace: (selectedNamespace) => set({ selectedNamespace }),

  pods: [],
  selectedPod: null,
  setPods: (pods) => set({ pods }),
  setSelectedPod: (selectedPod) => set({ selectedPod }),

  logs: '',
  isLoadingLogs: false,
  isLiveTail: false,
  setLogs: (logs) => set({ logs }),
  setIsLoadingLogs: (isLoadingLogs) => set({ isLoadingLogs }),
  setIsLiveTail: (isLiveTail) => set({ isLiveTail }),
  clearLogs: () => set({ logs: '' }),

  analysisResult: '',
  isAnalyzing: false,
  setAnalysisResult: (analysisResult) => set({ analysisResult }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  clearAnalysisResult: () => set({ analysisResult: '' }),

  models: [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'gpt-4', name: 'GPT-4' },
  ],
  selectedModel: 'gpt-3.5-turbo',
  setModels: (models) => set({ models }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
}));

export default usePodPilotStore;
