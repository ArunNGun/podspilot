import { NextApiRequest, NextApiResponse } from 'next';
import { getNamespaces } from '../../lib/kubernetes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const namespaces = await getNamespaces();
    
    return res.status(200).json({ namespaces });
  } catch (error) {
    console.error('Error fetching namespaces:', error);
    return res.status(500).json({ error: 'Failed to fetch namespaces' });
  }
}
