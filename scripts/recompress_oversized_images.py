import os
from PIL import Image
import io

dir_path = "public/images/articles"

for fname in os.listdir(dir_path):
    if not fname.endswith("-cinematic.webp"):
        continue
    fpath = os.path.join(dir_path, fname)
    size_kb = os.path.getsize(fpath) / 1024.0
    if size_kb > 115.0:
        print(f"Force recompressing {fname} (current: {size_kb:.1f} KB)...")
        img = Image.open(fpath).convert("RGB")
        
        # Step down quality from 40 down to 20
        saved = False
        for q in [35, 30, 25, 20]:
            buf = io.BytesIO()
            img.save(buf, format="WEBP", quality=q, method=6)
            data = buf.getvalue()
            if len(data) <= 110 * 1024:
                with open(fpath, "wb") as f:
                    f.write(data)
                print(f"  -> Reduced to {len(data)/1024.0:.1f} KB at quality {q}")
                saved = True
                break
        if not saved:
            # If still large, resize to 1000x562
            img_smaller = img.resize((1000, 562), Image.Resampling.LANCZOS)
            buf = io.BytesIO()
            img_smaller.save(buf, format="WEBP", quality=30, method=6)
            with open(fpath, "wb") as f:
                f.write(buf.getvalue())
            print(f"  -> Resized and reduced to {os.path.getsize(fpath)/1024.0:.1f} KB")

print("\nDone recompressing oversized images!")
