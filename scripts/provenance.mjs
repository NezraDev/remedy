import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const embedScript = process.argv[2];
if (!embedScript) throw new Error('Pass the absolute path to Impeccable scripts/embed-prompt.mjs.');
const sources = JSON.parse(readFileSync('public/images/sources.json', 'utf8'));
for (const source of sources) {
  for (const file of [source.file, source.file.replace('.jpg', '-small.jpg')]) execFileSync(process.execPath, [embedScript, `public/images/${file}`, '--prompt', `Origin: ${source.origin}`], { stdio: 'inherit' });
}
execFileSync(process.execPath, [embedScript, 'public/images/remedy-logo.jpg', '--prompt', 'Origin: user-supplied remedy-logo.jpg in the Remedy project. Black screenshot margins cropped without modifying the artwork.'], { stdio: 'inherit' });
