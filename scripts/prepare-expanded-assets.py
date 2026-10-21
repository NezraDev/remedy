"""Delivery-only resize/encoding and provenance for generated raster assets."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json, subprocess, sys

root = Path(__file__).resolve().parents[1]
dest = root / 'public' / 'images'
specs = json.loads((root / '.impeccable/asset-prompts/expanded.json').read_text(encoding='utf-8'))
for record in specs:
    name = record['slug']
    source = root / '.impeccable/generated-rasters' / f'{name}.png'
    if not source.exists(): raise FileNotFoundError(source)
    image = Image.open(source).convert('RGB')
    image.thumbnail((1200, 1200))
    image.save(dest / f'{name}.jpg', quality=86, optimize=True)
    image.thumbnail((800, 800))
    image.save(dest / f'{name}-small.jpg', quality=82, optimize=True)
    for suffix in ['', '-small']:
        subprocess.run(['node', sys.argv[1], str(dest / f'{name}{suffix}.jpg'), '--prompt', record['prompt']], check=True, capture_output=True)

files = [dest / f"{record['slug']}.jpg" for record in specs]
files += [dest / f'{name}.jpg' for name in ['skin-assessment', 'learning-space', 'neck-care', 'body-session', 'return-care']]
sheet = Image.new('RGB', (1200, 5 * 220), '#eeeeee')
draw = ImageDraw.Draw(sheet)
for index, file in enumerate(files):
    thumb = ImageOps.fit(Image.open(file).convert('RGB'), (285, 185))
    x, y = (index % 4) * 300, (index // 4) * 220
    sheet.paste(thumb, (x, y))
    draw.text((x + 6, y + 190), file.stem, fill='black')
sheet.save(root / '.impeccable/review/expanded-image-contact-sheet.jpg')
print(f'Prepared {len(specs)} generated assets and responsive versions, with exact embedded prompts.')
