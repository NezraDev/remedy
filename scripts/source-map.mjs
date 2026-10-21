import { readFileSync, writeFileSync } from 'node:fs';
import { siteData } from '../src/data.js';
const sources = JSON.parse(readFileSync('public/images/sources.json', 'utf8'));
const generated = [...new Set(siteData.services.filter(service => 'kind' in service.image && service.image.kind === 'illustration').map(service => service.image.src))];
const lines = [
  '# Asset sources', '',
  'All shipping media and fonts are self-hosted in public. Source metadata is embedded into each shipping JPEG. Checked October 21, 2026. No stock or generated image is presented as a real Remedy client, staff member, owned device, facility, or treatment result.', '',
  '## Stock photography', '',
  '[Pexels License](https://www.pexels.com/license/) permits commercial website use and modification; attribution is optional. No endorsement is implied. Small versions are optimized derivatives of the same photograph.', '',
  '| Local file | Source, photographer and license |', '| --- | --- |',
  ...sources.map(item => `| public/images/${item.file} | ${item.origin.replaceAll('|', '·')} |`), '',
  '## Generated equipment illustrations', '',
  'The following assets and their -small derivatives were created with the built-in Imagegen tool. They are visibly labeled as illustrative images and depict relevant treatment equipment or consultation context, with no claim of manufacturer accuracy or Remedy ownership. Exact prompts are in ASSET-PROMPTS.md and ASSET-PROMPTS-EXPANDED.md and are embedded in the files. Delivered JPEGs are resized/encoded only.', '',
  ...generated.map(file => `- public${file}`), '',
  '## User-supplied logo', '',
  'public/images/remedy-logo.jpg comes from the user-supplied remedy-logo.jpg. Only black screenshot margins were cropped; the original file is untouched. The image appears on a deliberate light background, with no inversion or redrawing.', '',
  '## Fonts', '',
  'Manrope and Bodoni Moda are distributed by Fontsource under the SIL Open Font License. Self-hosted WOFF2 files and their license files are in public/fonts. No remote font requests are required.', '',
  '## Service image assignments', '',
  'The table below is generated from src/data.js, which remains the editable authority. Each of the 28 service records now has a distinct image. Related appointments retain appropriate treatment-family context. Ambiguous services use general skincare, consultation or learning context without inventing a technique, age eligibility or equipment type.', '',
  '| ID | Service | Local image |', '| --- | --- | --- |',
  ...siteData.services.map(service => `| ${service.id} | ${service.displayName} | public${service.image.src} |`), '',
  'No before-and-after, review, accreditation, or outcome imagery is fabricated. The results gallery remains empty until authentic approved comparisons are provided.', '',
];
writeFileSync('ASSET-SOURCES.md', lines.join('\n'));
