import { NextApiRequest, NextApiResponse } from 'next';
import { getPods } from '../../lib/kubernetes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { namespace = 'default' } = req.query;

  try {
    const pods = await getPods(namespace as string);
    
    return res.status(200).json({ pods });
  } catch (error) {
    console.error('Error fetching pods:', error);
    return res.status(500).json({ error: 'Failed to fetch pods' });
  }
}
