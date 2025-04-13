import { NextApiRequest, NextApiResponse } from 'next';
import { getPodMetrics } from '../../lib/kubernetes';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { podName, namespace } = req.query;

  if (!podName || !namespace) {
    return res.status(400).json({ error: 'Pod name and namespace are required' });
  }

  try {
    const metrics = await getPodMetrics(podName as string, namespace as string);
    
    return res.status(200).json({ metrics });
  } catch (error) {
    console.error('Error fetching pod metrics:', error);
    return res.status(500).json({ error: 'Failed to fetch pod metrics' });
  }
}
