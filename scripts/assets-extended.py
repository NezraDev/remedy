"""Additional distinct licensed photos; merges provenance without replacing existing assets."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from urllib.request import Request, urlopen
from PIL import Image
import io, json

root = Path(__file__).resolve().parents[1]
dest = root / 'public' / 'images'
sources = {
    'skin-assessment': (3985318, 'Gustavo Fring', 'woman-in-white-tank-top'),
    'learning-space': (7750131, 'Max Vakhtbovycn', 'presentation-room-with-seats'),
    'neck-care': (28783928, 'João Jesus', 'relaxed-woman-receiving-facial-skin-treatment'),
    'body-session': (33327683, 'Laura Beauty Designer | Brasil', 'close-up-of-body-contouring-procedure-in-spa'),
    'return-care': (36930786, 'Kerim Eveyik', 'facial-treatment-at-istanbul-aesthetic-clinic'),
}

def download(item):
    name, (pid, photographer, slug) = item
    url = f'https://images.pexels.com/photos/{pid}/pexels-photo-{pid}.jpeg?auto=compress&cs=tinysrgb&w=1800&dpr=1'
    data = urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=45).read()
    photo = Image.open(io.BytesIO(data)).convert('RGB')
    photo.thumbnail((1800, 1800))
    width, height = photo.size
    origin = f'https://www.pexels.com/photo/{slug}-{pid}/ | {photographer} | Pexels License https://www.pexels.com/license/ | Illustrative stock, not Remedy staff, clients, equipment or results.'
    photo.save(dest / f'{name}.jpg', quality=86, optimize=True)
    photo.thumbnail((800, 800))
    photo.save(dest / f'{name}-small.jpg', quality=82, optimize=True)
    return {'file': f'{name}.jpg', 'origin': origin, 'width': width, 'height': height, 'smallWidth': photo.width}

with ThreadPoolExecutor(max_workers=5) as pool:
    additions = list(pool.map(download, sources.items()))
manifest_path = dest / 'sources.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
names = {record['file'] for record in additions}
manifest = [record for record in manifest if record['file'] not in names] + additions
manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding='utf-8')
print(json.dumps(additions, indent=2, ensure_ascii=False))
