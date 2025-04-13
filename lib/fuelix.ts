import axios from 'axios';

const FUELIX_API_URL = process.env.FUELIX_API_URL
const FUELIX_API_KEY = process.env.FUELIX_API_KEY
const DEFAULT_MODEL = process.env.DEFAULT_MODEL

const fuelixClient = axios.create({
  baseURL: FUELIX_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${FUELIX_API_KEY}`,
  },
});

export async function analyzeLogs(logs: string, model: string = DEFAULT_MODEL) {
  try {
    const response = await fuelixClient.post('/v1/chat/completions', {
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: 'You are a Kubernetes log analysis assistant. Analyze the following logs and provide insights, identify issues, and suggest solutions.' },
        { role: 'user', content: logs }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing logs:', error);
    console.error(error.response?.data || error.message);
    throw error;
  }
}

export async function getModels() {
  try {
    const response = await fuelixClient.get('/v1/models');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    return [
      { id: DEFAULT_MODEL, name: 'Claude 3.7 Sonnet' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
      { id: 'gpt-4', name: 'GPT-4' },
    ];
  }
}

export default {
  analyzeLogs,
  getModels,
};
