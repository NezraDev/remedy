import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { siteData } from './src/data.js';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
export default defineConfig({ plugins: [react(), tailwindcss(), {
  name: 'remedy-content-metadata',
  transformIndexHtml: html => html.replace('__REMEDY_TITLE__', escapeHtml(siteData.seo.routes['/'].title)).replace('__REMEDY_DESCRIPTION__', escapeHtml(siteData.seo.routes['/'].description)).replace('__REMEDY_ICON__', siteData.branding.logo),
}] });
