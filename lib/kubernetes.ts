import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);
const customObjectsApi = kc.makeApiClient(k8s.CustomObjectsApi);

export async function getPods(namespace = 'default') {
  try {
    // @ts-ignore
    const response = await coreV1Api.listNamespacedPod(namespace);
    // @ts-ignore
    return response.body.items;
  } catch (error) {
    console.error('Error fetching pods:', error);
    throw error;
  }
}

export async function getPodLogs(
  podName: string,
  namespace = 'default',
  container?: string,
  tailLines?: number,
  follow = false
) {
  try {
    const params: Record<string, any> = {};
    if (container) params.container = container;
    if (tailLines) params.tailLines = tailLines;
    if (follow) params.follow = follow;

    // @ts-ignore
    const response = await coreV1Api.readNamespacedPodLog(podName, namespace);
    // @ts-ignore
    return response.body;
  } catch (error) {
    console.error('Error fetching pod logs:', error);
    throw error;
  }
}

export async function restartPod(podName: string, namespace = 'default') {
  try {
    // @ts-ignore
    const response = await coreV1Api.deleteNamespacedPod(podName, namespace);
    // @ts-ignore
    return response.body;
  } catch (error) {
    console.error('Error restarting pod:', error);
    throw error;
  }
}

export async function getNamespaces() {
  try {
    // @ts-ignore
    const response = await coreV1Api.listNamespace();
    // @ts-ignore
    return response.body.items;
  } catch (error) {
    console.error('Error fetching namespaces:', error);
    throw error;
  }
}

export async function getPodMetrics(podName: string, namespace = 'default') {
  try {
    // Using a different approach to avoid TypeScript errors
    const response = await customObjectsApi.getNamespacedCustomObject({
      group: 'metrics.k8s.io',
      version: 'v1beta1',
      namespace,
      plural: 'pods',
      name: podName
    });
    // @ts-ignore
    return response.body;
  } catch (error) {
    console.error('Error fetching pod metrics:', error);
    throw error;
  }
}

export default {
  getPods,
  getPodLogs,
  restartPod,
  getNamespaces,
  getPodMetrics,
};
