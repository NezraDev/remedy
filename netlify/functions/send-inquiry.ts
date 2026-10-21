import type { Config } from '@netlify/functions';
import { handleInquiry } from '../lib/inquiry';

export default async function handler(request: Request) {
  return handleInquiry(request, process.env);
}

export const config: Config = {
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'], action: 'rate_limit' },
};
