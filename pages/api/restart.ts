import { NextApiRequest, NextApiResponse } from 'next';
import { restartPod } from '../../lib/kubernetes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { podName, namespace } = req.body;

  if (!podName || !namespace) {
    return res.status(400).json({ error: 'Pod name and namespace are required' });
  }

  try {
    await restartPod(podName, namespace);
    
    return res.status(200).json({ message: `Pod ${podName} restarted successfully` });
  } catch (error) {
    console.error('Error restarting pod:', error);
    return res.status(500).json({ error: 'Failed to restart pod' });
  }
}
