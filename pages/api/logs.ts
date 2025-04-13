import { NextApiRequest, NextApiResponse } from 'next';
import { getPodLogs } from '../../lib/kubernetes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { podName, namespace, container, tailLines, follow } = req.query;
  
  if (!podName) {
    return res.status(400).json({ error: 'Pod name is required' });
  }
  
  try {
    const logs = await getPodLogs(
      podName as string,
      namespace as string || 'default',
      container as string,
      tailLines ? parseInt(tailLines as string, 10) : undefined,
      follow === 'true'
    );
    
    return res.status(200).json({ logs });
  } catch (error) {
    console.error('Error fetching pod logs:', error);
    return res.status(500).json({ error: 'Failed to fetch pod logs' });
  }
}
