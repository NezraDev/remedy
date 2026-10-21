"""Download licensed stock context images and self-hosted fonts. No runtime remote images."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from urllib.request import Request, urlopen
from PIL import Image, ImageOps, PngImagePlugin
import io, json

root = Path(__file__).resolve().parents[1]
dest = root / 'public' / 'images'
dest.mkdir(parents=True, exist_ok=True)

sources = {
    'facial': (7446659, 'Gustavo Fring', 'woman-getting-a-facial-treatment'),
    'skin': (14996838, 'Midtrack', 'woman-getting-a-face-treatment'),
    'body': (33327686, 'Laura Beauty Designer | Brasil', 'body-contouring-session-in-belo-horizonte'),
    'laser': (7772657, 'Dmitriy Ganin', 'anonymous-woman-with-lasers-on-belly'),
    'consultation': (29648640, 'Alexander Mass', 'professional-consultation-at-beauty-clinic'),
    'wellness': (9004778, 'olia danilevich', 'a-woman-in-activewear-stretching'),
    'relaxation': (6628602, 'KoolShooters', 'a-woman-having-a-massage'),
    'care': (6186768, 'Tima Miroshnichenko', 'woman-doing-body-massage'),
    'face-detail': (16120490, 'Eumorfia Panera', 'cosmetologist-making-beauty-procedures-to-woman-in-salon'),
}

def download(item):
    key, (pid, photographer, slug) = item
    url = f'https://images.pexels.com/photos/{pid}/pexels-photo-{pid}.jpeg?auto=compress&cs=tinysrgb&w=1800&dpr=1'
    data = urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=45).read()
    im = Image.open(io.BytesIO(data)).convert('RGB')
    im.thumbnail((1800, 1800))
    origin = f'https://www.pexels.com/photo/{slug}-{pid}/ | {photographer} | Pexels License https://www.pexels.com/license/ | Illustrative stock, not Remedy staff, clients, equipment or results.'
    im.save(dest / f'{key}.jpg', quality=86, optimize=True, comment=origin.encode())
    small = im.copy()
    small.thumbnail((800, 800))
    small.save(dest / f'{key}-small.jpg', quality=82, optimize=True, comment=origin.encode())
    return {'file': f'{key}.jpg', 'origin': origin, 'width': im.width, 'height': im.height}

with ThreadPoolExecutor(max_workers=6) as pool:
    manifest = list(pool.map(download, sources.items()))

# Crop only the screenshot's black margins, preserving the supplied artwork.
logo = Image.open(root / 'remedy-logo.jpg').convert('RGB').crop((0, 188, 1080, 880))
logo.save(dest / 'remedy-logo.jpg', quality=95, comment=b'User-supplied remedy-logo.jpg; black screenshot margins cropped; artwork unchanged.')
(dest / 'sources.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')

# Contact sheet is development-only evidence.
sheet = Image.new('RGB', (960, 630), '#dddddd')
from PIL import ImageDraw
draw = ImageDraw.Draw(sheet)
for index, item in enumerate(manifest):
    im = Image.open(dest / item['file'])
    thumb = ImageOps.fit(im, (310, 180))
    x, y = (index % 3) * 320, (index // 3) * 210
    sheet.paste(thumb, (x, y))
    draw.text((x + 8, y + 185), item['file'], fill='black')
(root / '.impeccable' / 'review').mkdir(parents=True, exist_ok=True)
sheet.save(root / '.impeccable' / 'review' / 'asset-contact-sheet.png')
print(json.dumps(manifest, indent=2))
