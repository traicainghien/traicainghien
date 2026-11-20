import os
import sys
import re
import json
import io
import time
import hashlib
import urllib.request
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTICLE_IMG_DIR = os.path.join(BASE_DIR, 'public', 'images', 'articles')
HISTORY_FILE = os.path.join(BASE_DIR, 'scripts', 'used_curated_images.json')
ARTICLES_TS = os.path.join(BASE_DIR, 'src', 'data', 'articles.ts')
LIBRARY_FILE = os.path.join(BASE_DIR, 'scratch', 'pinterest_library_full.json')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def load_data():
    with open(os.path.join(BASE_DIR, 'scratch', 'all_current_articles.json'), 'r', encoding='utf-8') as f:
        articles = json.load(f)
    with open(LIBRARY_FILE, 'r', encoding='utf-8') as f:
        pins = json.load(f)
    return articles, pins

def get_preferred_feeds(article):
    title = article['title'].lower()
    slug = article['slug'].lower()
    tag = article.get('pillarTag', '').lower()

    if any(k in title or k in slug for k in ['sách', 'đọc', 'review-sach', 'book', 'cuốn sách', 'ikigai', 'tiện nghi', 'dòng sông', 'lẽ sống', 'frankl', 'kahneman']):
        return ['bookish/feed', 'darkacademia/feed', 'studygram/feed', 'coffee/feed']
    elif any(k in title or k in slug for k in ['sóng não', 'alpha', 'tần số', '285hz']):
        return ['zen/feed', 'calm/feed', 'mindfulness/feed']
    elif any(k in title or k in slug for k in ['deep work', 'tập trung', 'tap-trung', 'xao nhãng', 'xao-nhang', 'dòng chảy', 'flow', 'huberman', 'lock in']):
        return ['desksetup/feed', 'minimalworkspace/feed', 'aestheticdesk/feed', 'workspace/feed', 'studyblr/feed']
    elif any(k in title or k in slug for k in ['thói quen', 'thoi-quen', 'kỷ luật', 'ky-luat', 'atomic', 'kaizen', 'lego', 'quy tắc 2 mét']):
        return ['bulletjournal/feed', 'studytips/feed', 'warmminimalism/feed', 'minimalist/feed']
    elif any(k in title or k in slug for k in ['điện thoại', 'màn hình', 'cai nghiện', 'dopamine', 'brain rot', 'nhũn não', 'sương mù não', '100 ngày', 'xóa mạng']):
        return ['minimalist/feed', 'minimalistspace/feed', 'calm/feed', 'slowliving/feed']
    elif any(k in title or k in slug for k in ['thiền', 'trà', 'wabi sabi', 'chữa lành', 'chua-lanh', 'yêu bản thân', 'kiệt quệ', '10% năng lượng']):
        return ['zen/feed', 'mindfulness/feed', 'slowliving/feed', 'calm/feed']
    elif any(k in title or k in slug for k in ['cân bằng', 'ban công', 'musashi', 'cuộc đời', 'khủng hoảng', 'lười', 'trưởng thành giả tạo', 'yerkes-dodson', 'tích lũy kiến thức', 'tiêu xài']):
        return ['dwellmagazine/cabins', 'kinfolkmag/home', 'remodelista/living-rooms', 'theeverygirl/feed', 'coffee/feed']
    else:
        return ['desksetup/feed', 'aestheticdesk/feed', 'minimalist/feed', 'coffee/feed', 'zen/feed']

def download_pin_image(pin):
    """Tải ảnh Pinterest: Thử bản full gốc /originals/ trước, nếu lỗi fallback về /736x/."""
    url_736 = pin['image_url']
    url_orig = url_736.replace('/736x/', '/originals/')
    
    # Thử originals
    for target_url in [url_orig, url_736]:
        try:
            req = urllib.request.Request(target_url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = resp.read()
                im = Image.open(io.BytesIO(data))
                if im.width >= 400 and im.height >= 300:
                    return data, target_url, im
        except Exception:
            continue
    return None, None, None

def process_image_to_16_9_webp(im, output_path):
    target_w, target_h = 1200, 675
    target_aspect = target_w / target_h
    src_aspect = im.width / im.height

    if src_aspect > target_aspect:
        new_w = int(im.height * target_aspect)
        left = (im.width - new_w) // 2
        cropped = im.crop((left, 0, left + new_w, im.height))
    else:
        new_h = int(im.width / target_aspect)
        top = (im.height - new_h) // 2
        cropped = im.crop((0, top, im.width, top + new_h))

    resized = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    if resized.mode != 'RGB':
        resized = resized.convert('RGB')

    # Lưu và kiểm soát kích thước nghiêm ngặt (< 118 KB)
    quality = 86
    while quality >= 65:
        out_buf = io.BytesIO()
        resized.save(out_buf, 'WEBP', quality=quality, method=6)
        if len(out_buf.getvalue()) <= 118000:
            break
        quality -= 3

    with open(output_path, 'wb') as f:
        f.write(out_buf.getvalue())
    
    return len(out_buf.getvalue())

def main():
    print("🚀 [PINTEREST REPLACEMENT ENGINE] Khởi chạy cập nhật 100% ảnh bìa bài viết từ Pinterest...")
    articles, pins = load_data()
    print(f"📋 Tổng số bài viết: {len(articles)}")
    print(f"🎨 Tổng số ảnh Pinterest chất lượng cao trong kho: {len(pins)}")

    used_hashes = set()
    used_urls = set()
    new_records = []

    # Danh mục kết quả mapping
    article_thumb_map = {}

    for idx, a in enumerate(articles, 1):
        slug = a['slug']
        title = a['title']
        pref_feeds = get_preferred_feeds(a)
        
        # Lọc danh sách ứng viên
        candidates = []
        for pf in pref_feeds:
            for p in pins:
                if p['feed'] == pf and p['image_url'] not in used_urls:
                    candidates.append(p)
        
        # Nếu chưa đủ thì lấy từ bất kỳ feed nào
        if not candidates:
            for p in pins:
                if p['image_url'] not in used_urls:
                    candidates.append(p)

        assigned_pin = None
        assigned_data = None
        assigned_im = None
        assigned_hash = None
        assigned_url = None

        for cand in candidates:
            data, dl_url, im = download_pin_image(cand)
            if data is None:
                continue
            f_hash = hashlib.md5(data).hexdigest()
            if f_hash in used_hashes:
                continue
            
            assigned_pin = cand
            assigned_data = data
            assigned_im = im
            assigned_hash = f_hash
            assigned_url = dl_url
            used_urls.add(cand['image_url'])
            used_hashes.add(f_hash)
            break

        if not assigned_pin:
            print(f"❌ Không tìm được pin phù hợp cho: {slug}")
            continue

        # Xuất ảnh bìa WebP 16:9
        thumb_filename = f"{slug}-pinterest.webp"
        output_path = os.path.join(ARTICLE_IMG_DIR, thumb_filename)
        size_bytes = process_image_to_16_9_webp(assigned_im, output_path)

        thumb_web_path = f"/images/articles/{thumb_filename}"
        article_thumb_map[slug] = thumb_web_path

        print(f"[{idx:02d}/58] ✅ '{slug[:30]}...' -> {thumb_filename} ({round(size_bytes/1024, 1)}KB) [Feed: {assigned_pin['feed']}]")

        new_records.append({
            "slug": slug,
            "title": title,
            "feed": assigned_pin['feed'],
            "pinterest_url": assigned_url,
            "local_file": thumb_filename,
            "hash": assigned_hash,
            "size_kb": round(size_bytes/1024, 1)
        })

    # Cập nhật src/data/articles.ts
    print("\n📝 Đang cập nhật src/data/articles.ts...")
    with open(ARTICLES_TS, 'r', encoding='utf-8') as f:
        content = f.read()

    updated_count = 0
    for slug, new_thumb in article_thumb_map.items():
        # Tìm block của bài viết này và thay thumbnail
        pattern = rf'("slug":\s*"{re.escape(slug)}"[^}}]*?"thumbnail":\s*")[^"]+(")'
        new_content, n = re.subn(pattern, rf'\g<1>{new_thumb}\g<2>', content)
        if n > 0:
            content = new_content
            updated_count += n

    with open(ARTICLES_TS, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✨ Đã cập nhật thành công {updated_count}/58 bài viết trong src/data/articles.ts!")

    # Cập nhật registry used_curated_images.json
    registry = {
        "last_updated": time.strftime('%Y-%m-%d %H:%M:%S'),
        "total_curated": len(new_records),
        "records": new_records
    }
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(registry, f, ensure_ascii=False, indent=2)

    print(f"💾 Đã lưu vết {len(new_records)} ảnh vào {HISTORY_FILE}!")

if __name__ == '__main__':
    main()
