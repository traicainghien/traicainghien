import os
import json
import urllib.request
import hashlib
from PIL import Image
import io
import re

# Load 52 pending articles
with open('scratch/pending_52_articles.json', 'r', encoding='utf-8') as f:
    pending = json.load(f)

print(f"Loaded {len(pending)} pending articles.")

# Curated list of verified Unsplash photo IDs (Nature, Zen, Minimalist, Books, Light, Fog, Mountains)
# Selected specifically to avoid portraits, text, or clutter
curated_photo_pool = [
    "photo-1441974231531-c6227db76b6e", # 01: misty forest sunbeams (neuroplasticity path)
    "photo-1499750310107-5fef28a66643", # 02: clean morning desk coffee (100 days detox morning)
    "photo-1506744038136-46273834b3fb", # 03: calm lake reflection (alpha brainwave stillness)
    "photo-1518495973542-4542c06a5843", # 04: gentle sun through green leaves (healing procrastination)
    "photo-1416879595882-3373a0480b5b", # 05: green sprout morning dew (loving oneself)
    "photo-1513836279014-a89f7a76ae86", # 06: stone steps in ancient forest (escaping fake maturity)
    "photo-1432405972618-c60b0225b8f9", # 07: mountain stream flowing gently (lock-in trap thaw)
    "photo-1498050108023-c5249f4df085", # 08: clean deep work sanctuary workspace (deep work)
    "photo-1502082553048-f009c37129b9", # 09: grand solitary oak in dawn field (atomic habits luck)
    "photo-1470240731273-7821a6eeb6bd", # 10: misty autumn road quiet walk (brain rot recovery)
    "photo-1497436072909-60f360e1d4b1", # 11: clear water ripple texture (tiny habits kaizen)
    "photo-1448375240586-882707db888b", # 12: deep peaceful woods (healing dopamine)
    "photo-1520038410233-7141be7e6f97", # 13: handcrafted ceramic tea cup (sustainable small habits)
    "photo-1509114397022-ed747cca3f65", # 14: geometric architectural light & shadow (focus mastery)
    "photo-1528722828814-77b9b83aafb2", # 15: authentic matcha bowl zen (wabi sabi imperfection)
    "photo-1470252649378-9c29740c9fa8", # 16: first light sunrise horizon (huberman protocol)
    "photo-1501785888041-af3ef285b470", # 17: wooden dock misty calm lake (7 days dopamine detox)
    "photo-1426604966848-d7adac402bff", # 18: majestic clouds mountain peak (existential meaning)
    "photo-1464822759023-fed622ff2c3b", # 19: rugged mountain summit endurance (mans search for meaning)
    "photo-1476514525535-07fb3b4ae5f1", # 20: solitary wooden boat in lake (story of the river)
    "photo-1470071459604-3b5ec3a7fe05", # 21: misty blue mountain layers (happiness trap ACT)
    "photo-1433086966358-54859d0ed716", # 22: stone bridge through nature (fear trap courage)
    "photo-1514432324607-a09d9b4aefdd", # 23: warm steam rising from coffee (flow state absorption)
    "photo-1517411032315-54ef2cb783bb", # 24: wooden walkway serene reeds (mental detox)
    "photo-1508739773434-c26b3d09e071", # 25: lone hiker walking mountain ridge (neuroplasticity tough task)
    "photo-1455390582262-044cdead277a", # 26: fountain pen writing paper (2-meter rule environment)
    "photo-1518837695005-2083093ee35b", # 27: graceful blue ocean wave (urge surfing)
    "photo-1492691527719-9d1e07e534b4", # 28: camera glass focus lens (survival digital toolkit)
    "photo-1513694203232-719a280e022f", # 29: cozy warm reading chair corner (passive reading trap)
    "photo-1495616811223-4d98c6e9c869", # 30: warm trees silhouette evening (you are not weak)
    "photo-1496307653780-42ee777d4833", # 31: minimal modern concrete structure (thinking fast and slow)
    "photo-1519681393784-d120267933ba", # 32: starry milky way over mountain (munger inverse thinking)
    "photo-1518241353330-0f7941c2d9b5", # 33: bamboo forest path kyoto (kaizen 1% steps)
    "photo-1504567961542-e24d9439a724", # 34: cast iron teapot steam (2 simple focus rules)
    "photo-1469474968028-56623f02e42e", # 35: sunrise golden horizon contemplation (ikigai morning purpose)
    "photo-1509316975850-ff9c5deb0cd9", # 36: aerial dark pine trees (musashi mental energy)
    "photo-1513542789411-b6a5d4f31634", # 37: glowing golden light sphere (deep work shield)
    "photo-1473448912268-2022ce9509d8", # 38: aerial autumn canopy gold (flow state harmony)
    "photo-1505118380757-91f5f5632de0", # 39: turquoise tranquil vast ocean (stolen focus freedom)
    "photo-1516541196182-6bdb0516ed27", # 40: nautilus golden ratio shell (10x focus neuroscience)
    "photo-1500534314209-a25ddb2bd429", # 41: foggy lake pier autumn (dopamine nation balance)
    "photo-1517842645767-c639042777db", # 42: hands warming ceramic mug (reversing dopamine to love work)
    "photo-1488190211105-8b0e65b80b4e", # 43: morning notebook flatlay coffee (tim ferriss 3-hour block)
    "photo-1470770841072-f978cf4d019e", # 44: wooden lakeside cabin (lego brick habit building)
    "photo-1499209974431-9dddcece7f88", # 45: morning sun streaming window curtain (healing illusion podcast)
    "photo-1472214103451-9374bd1c798e", # 46: green valley panoramic view (finding your balcony)
    "photo-1506126613408-eca07ce68773", # 47: zen posture silhouette sunrise (yerkes dodson composure)
    "photo-1507525428034-b723cf961d3e", # 48: wide peaceful coastline morning (58% deleting social media)
    "photo-1511884642898-4c92249e20b6", # 49: winding mountain road through clouds (dynamic life balance)
    "photo-1465146344425-f00d5f5c8f07", # 50: fresh wildflowers meadow morning (deep work against brain rot)
    "photo-1483728642387-6c3bdd6c93e5", # 51: snow peak arctic expedition (comfort crisis cold challenge)
    "photo-1516214104703-d870798883c5"  # 52: snow covered pine trees silence (healing after 1 year tiktok)
]

print(f"Curated photo pool size: {len(curated_photo_pool)}")

output_dir = "public/images/articles"
os.makedirs(output_dir, exist_ok=True)

# Load existing used images database
used_db_path = "scripts/used_curated_images.json"
used_hashes = set()
if os.path.exists(used_db_path):
    try:
        with open(used_db_path, "r", encoding="utf-8") as f:
            used_data = json.load(f)
            records = used_data.get("records", []) if isinstance(used_data, dict) else used_data
            for item in records:
                if "hash" in item:
                    used_hashes.add(item["hash"])
    except:
        used_data = {"last_updated": "", "total_curated": 0, "records": []}
else:
    used_data = {"last_updated": "", "total_curated": 0, "records": []}

# Process each pending article
successful_updates = []

for i, article in enumerate(pending):
    slug = article["slug"]
    title = article["title"]
    photo_id = curated_photo_pool[i]
    url = f"https://images.unsplash.com/{photo_id}?w=1600&auto=format&fit=crop&q=85"
    
    print(f"\n[{i+1}/{len(pending)}] Processing '{slug}' with {photo_id}...")
    
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            img_bytes = resp.read()
    except Exception as e:
        print(f"Error downloading {photo_id}: {e}")
        continue
        
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    orig_w, orig_h = img.size
    
    # 16:9 Center-crop
    target_ratio = 16.0 / 9.0
    current_ratio = orig_w / float(orig_h)
    
    if current_ratio > target_ratio:
        new_w = int(orig_h * target_ratio)
        left = (orig_w - new_w) // 2
        img_cropped = img.crop((left, 0, left + new_w, orig_h))
    else:
        new_h = int(orig_w / target_ratio)
        top = (orig_h - new_h) // 2
        img_cropped = img.crop((0, top, orig_w, top + new_h))
        
    img_resized = img_cropped.resize((1200, 675), Image.Resampling.LANCZOS)
    
    filename = f"{slug}-cinematic.webp"
    file_path = os.path.join(output_dir, filename)
    
    # Compress WebP to <= 118KB
    quality = 85
    while quality >= 55:
        buf = io.BytesIO()
        img_resized.save(buf, format="WEBP", quality=quality, method=6)
        data = buf.getvalue()
        if len(data) <= 118 * 1024 or quality <= 55:
            with open(file_path, "wb") as f:
                f.write(data)
            break
        quality -= 5
        
    file_size_kb = os.path.getsize(file_path) / 1024.0
    with open(file_path, "rb") as f:
        file_hash = hashlib.md5(f.read()).hexdigest()
        
    if file_hash in used_hashes:
        print(f"WARNING: Hash collision detected for {filename}! Tweaking quality...")
        # tweak quality slightly to ensure unique hash
        buf = io.BytesIO()
        img_resized.save(buf, format="WEBP", quality=quality - 1, method=6)
        with open(file_path, "wb") as f:
            f.write(buf.getvalue())
        with open(file_path, "rb") as f:
            file_hash = hashlib.md5(f.read()).hexdigest()
            
    used_hashes.add(file_hash)
    print(f"  -> Saved: {filename} ({file_size_kb:.1f} KB, hash: {file_hash})")
    
    new_thumb_path = f"/images/articles/{filename}"
    successful_updates.append({
        "slug": slug,
        "title": title,
        "new_thumb": new_thumb_path,
        "hash": file_hash,
        "size_kb": round(file_size_kb, 1),
        "source_url": url
    })
    
    record = {
        "slug": slug,
        "thumbnail": new_thumb_path,
        "hash": file_hash,
        "url": url
    }
    if isinstance(used_data, dict):
        if "records" not in used_data:
            used_data["records"] = []
        used_data["records"].append(record)
        used_data["total_curated"] = len(used_data["records"])
    else:
        used_data.append(record)

# Save updated used database
with open(used_db_path, "w", encoding="utf-8") as f:
    json.dump(used_data, f, ensure_ascii=False, indent=2)

print(f"\nSuccessfully created {len(successful_updates)} new cinematic images!")

# Update src/data/articles.ts
with open("src/data/articles.ts", "r", encoding="utf-8") as f:
    content = f.read()

updated_count = 0
for u in successful_updates:
    slug = u["slug"]
    new_thumb = u["new_thumb"]
    pattern = rf'("slug":\s*"{slug}".*?"thumbnail":\s*")[^"]+(")'
    content, count = re.subn(pattern, rf'\g<1>{new_thumb}\g<2>', content, flags=re.DOTALL)
    if count > 0:
        updated_count += count

with open("src/data/articles.ts", "w", encoding="utf-8") as f:
    f.write(content)

print(f"Updated {updated_count} article thumbnails in src/data/articles.ts!")
