import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { createServer as createViteServer } from 'vite';
import { handleInquiry, isConfigured, json } from '../netlify/lib/inquiry.ts';

if (existsSync('.env')) process.loadEnvFile('.env');
const port = 8888;
const origin = `http://127.0.0.1:${port}`;
const env = { ...process.env, SITE_ORIGIN: process.env.SITE_ORIGIN || origin };
const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
const server = createServer(async (req, res) => {
  if (!req.url?.startsWith('/.netlify/functions/')) { vite.middlewares(req, res); return; }
  let response: Response;
  if (req.url === '/.netlify/functions/inquiry-status') response = req.method === 'GET' ? json(200, { available: isConfigured(env) }) : json(405, { error: 'Method not allowed.' });
  else if (req.url === '/.netlify/functions/send-inquiry') {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of req) { size += chunk.length; if (size > 16384) break; chunks.push(chunk); }
    if (size > 16384) response = json(413, { error: 'Invalid request.' });
    else {
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      const request = new Request(`${origin}${req.url}`, { method: req.method, headers, body: req.method === 'GET' || req.method === 'HEAD' ? undefined : Buffer.concat(chunks) });
      response = await handleInquiry(request, env);
    }
  } else response = json(404, { error: 'Not found.' });
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(await response.text());
});
server.listen(port, '127.0.0.1', () => console.log(`Remedy frontend + inquiry functions: ${origin}`));
async function close() { server.close(); await vite.close(); process.exit(0); }
process.on('SIGINT', close); process.on('SIGTERM', close);
