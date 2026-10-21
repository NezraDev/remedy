import { isConfigured, json } from '../lib/inquiry';

export default async function handler(request: Request) {
  if (request.method !== 'GET') return json(405, { error: 'Method not allowed.' }, { Allow: 'GET' });
  return json(200, { available: isConfigured(process.env) });
}
