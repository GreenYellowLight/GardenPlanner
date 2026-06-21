"""
Original plant images are too big, convert them to a reasonable size
"""

from PIL import Image
import os

INPUT  = "public/plants/raw"
OUTPUT = "public/plants/thumbnails"
SIZE   = 200

os.makedirs(OUTPUT, exist_ok=True)

for filename in os.listdir(INPUT):
    if not filename.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
        continue

    src_path = os.path.join(INPUT, filename)
    out_name = os.path.splitext(filename)[0] + ".webp"
    out_path = os.path.join(OUTPUT, out_name)

    with Image.open(src_path) as img:
        img = img.convert("RGBA")
        w, h = img.size
        side = min(w, h)
        left = (w - side) // 2
        top  = (h - side) // 2
        img  = img.crop((left, top, left + side, top + side))
        img  = img.resize((SIZE, SIZE), Image.LANCZOS)
        img.save(out_path)
        print(f"  {filename} ({w}x{h}) -> {SIZE}x{SIZE}")

print(f"\nDone. Thumbnails saved to {OUTPUT}/")
