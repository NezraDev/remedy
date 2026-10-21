import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { siteData } from '../src/data.js';

const escape = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const template = await readFile('dist/index.html', 'utf8');
const origin = siteData.seo.siteUrl;
const business = { '@context': 'https://schema.org', '@type': 'BeautySalon', name: siteData.business.name, description: siteData.business.description };
if (siteData.business.structuredDataContactApproved) {
  business.telephone = siteData.business.phone;
  business.address = { '@type': 'PostalAddress', streetAddress: siteData.business.address, addressLocality: siteData.business.addressLocality, addressRegion: siteData.business.addressRegion, postalCode: siteData.business.postalCode, addressCountry: siteData.business.countryCode };
}
if (origin) business.url = origin;
for (const [route, metadata] of Object.entries(siteData.seo.routes)) {
  if (route === '404') continue;
  const url = origin ? new URL(route, origin).href : null;
  const extra = `<meta property="og:title" content="${escape(metadata.title)}"><meta property="og:description" content="${escape(metadata.description)}"><meta property="og:type" content="website"><meta property="og:site_name" content="${escape(siteData.seo.siteName)}"><meta name="twitter:card" content="summary_large_image">${url ? `<link rel="canonical" href="${escape(url)}"><meta property="og:url" content="${escape(url)}"><meta property="og:image" content="${escape(new URL(siteData.seo.socialImage, origin).href)}">` : ''}<script type="application/ld+json">${JSON.stringify(business).replace(/</g, '\\u003c')}</script>`;
  const html = template.replace(/<title>.*?<\/title>/, `<title>${escape(metadata.title)}</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escape(metadata.description)}" />`).replace('</head>', `${extra}</head>`);
  const directory = route === '/' ? 'dist' : `dist${route}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
}
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${new URL('/sitemap.xml', origin).href}\n` : ''}`);
if (origin) await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(siteData.seo.routes).filter(route => route !== '404').map(route => `<url><loc>${escape(new URL(route, origin).href)}</loc></url>`).join('')}</urlset>`);
console.log(`Generated route metadata${origin ? ', canonical URLs and sitemap' : '; canonical URLs and sitemap await the real production domain'}.`);
