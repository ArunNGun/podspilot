import { NextApiRequest, NextApiResponse } from 'next';
import { analyzeLogs } from '../../lib/fuelix';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { logs, model } = req.body;

  if (!logs) {
    return res.status(400).json({ error: 'Logs are required' });
  }

  try {
    const analysis = await analyzeLogs(logs, model);
    
    return res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error analyzing logs:', error);
    return res.status(500).json({ error: 'Failed to analyze logs. Please check your Fuelix API configuration.' });
  }
}
