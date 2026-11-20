import os
import urllib.request
import hashlib
from PIL import Image
import io
import json

samples = [
    {
        "slug": "ban-khong-he-luoi-ban-dang-tieu-xai-qua-som-cuoc-doi-minh",
        "title": "Bạn Không Hề Lười: Bạn Chỉ Đang Tiêu Xài Quá Sớm Cuộc Đời Mình",
        "url": "https://images.unsplash.com/photo-1608707927229-c6613e32af51?w=1600&auto=format&fit=crop&q=85",
        "metaphor": "Bóng người ngồi tĩnh lặng suy tư bên cửa sổ trong ánh hoàng hôn ấm áp (Nhận diện kiệt quệ, không tự trách)"
    },
    {
        "slug": "ky-luat-khong-can-gong-thoi-quen-nguyen-tu-20261108",
        "title": "Kỷ Luật Không Cần Gồng: Bí Mật Sức Mạnh Thói Quen Nguyên Tử",
        "url": "https://images.unsplash.com/photo-1705051738789-02ff513c9beb?w=1600&auto=format&fit=crop&q=85",
        "metaphor": "Tháp sỏi cân bằng tĩnh tại bên bờ nước phẳng lặng (Zen stone balance - 1% Kaizen bền bỉ)"
    },
    {
        "slug": "chua-lanh-nao-bo-khoi-nhun-nao-so-brain-rot-20261108",
        "title": "Chữa Lành Não Bộ Khỏi Nhũn Não Số: Khôi Phục Khả Năng Tập Trung Sâu",
        "url": "https://images.unsplash.com/photo-1757137911040-c9d81879b212?w=1600&auto=format&fit=crop&q=85",
        "metaphor": "Luồng nắng ban mai xuyên qua sương mờ rừng thông tĩnh mịch (Xua tan sương mù não, thanh lọc thùy trán)"
    },
    {
        "slug": "khi-chi-con-10-phan-tram-nang-luong-giao-an-cho-ngay-kiet-que",
        "title": "Khi Chỉ Còn 10% Năng Lượng: Giáo Án Cho Một Ngày Kiệt Quệ",
        "url": "https://images.unsplash.com/photo-1601922046210-41e129a3e64a?w=1600&auto=format&fit=crop&q=85",
        "metaphor": "Ngọn nến lung linh tỏa ánh sáng vàng ấm áp trong bóng tối (Bảo bọc đốm lửa năng lượng cuối cùng bằng sự dịu dàng)"
    },
    {
        "slug": "dung-flex-doc-sach-vi-sao-doc-nhieu-doi-van-tri-tre",
        "title": "Bẫy 'Nghiện Đọc': Đọc Hết 50 Cuốn Sách, Sao Cuộc Đời Vẫn Đứng Yên?",
        "url": "https://images.unsplash.com/photo-1503685374561-caac80ea1399?w=1600&auto=format&fit=crop&q=85",
        "metaphor": "Cuốn sách mở dưới luồng ánh sáng ấm cô độc trong không gian tối (Ngưng đọc thụ động để bước ra hành động thực tế)"
    },
    {
        "slug": "bang-dieu-khien-nao-bo-4-hoa-chat-than-kinh-ky-luat-dinh-cao",
        "title": "Bảng Điều Khiển Não Bộ: 4 Hóa Chất Tạo Nên Kỷ Luật Đỉnh Cao",
        "url": "https://images.unsplash.com/photo-1755529582689-7a158b8f9183?w=1600&auto=format&fit=crop&q=85",
        "metaphor": "Ánh bình minh rực rỡ trên đỉnh núi cao (Kích hoạt nhịp sinh học Circadian, cân bằng 4 hóa chất thần kinh)"
    }
]

output_dir = "public/images/articles"
os.makedirs(output_dir, exist_ok=True)

results = []

for item in samples:
    slug = item["slug"]
    url = item["url"]
    print(f"\nProcessing: {slug}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=15) as resp:
        img_bytes = resp.read()
    
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    orig_w, orig_h = img.size
    
    # Center crop to 16:9
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
    
    # Save as WebP with target size <= 118KB
    filename = f"{slug}-cinematic.webp"
    file_path = os.path.join(output_dir, filename)
    
    quality = 85
    while quality >= 60:
        buffer = io.BytesIO()
        img_resized.save(buffer, format="WEBP", quality=quality, method=6)
        data = buffer.getvalue()
        if len(data) <= 118 * 1024 or quality <= 60:
            with open(file_path, "wb") as f:
                f.write(data)
            break
        quality -= 5
        
    file_size_kb = os.path.getsize(file_path) / 1024.0
    with open(file_path, "rb") as f:
        md5_hash = hashlib.md5(f.read()).hexdigest()
        
    print(f"Saved: {file_path} ({file_size_kb:.1f} KB, hash: {md5_hash})")
    results.append({
        "slug": slug,
        "title": item["title"],
        "metaphor": item["metaphor"],
        "thumb_path": f"/images/articles/{filename}",
        "size_kb": round(file_size_kb, 1),
        "hash": md5_hash
    })

# Update src/data/articles.ts
with open("src/data/articles.ts", "r", encoding="utf-8") as f:
    content = f.read()

for r in results:
    slug = r["slug"]
    new_thumb = r["thumb_path"]
    
    # Replace the thumbnail for this slug
    # We find "slug": "...", ... "thumbnail": "..."
    pattern = rf'("slug":\s*"{slug}".*?"thumbnail":\s*")[^"]+(")'
    import re
    content, count = re.subn(pattern, rf'\g<1>{new_thumb}\g<2>', content, flags=re.DOTALL)
    print(f"Updated articles.ts for {slug}: {count} occurrence(s)")

with open("src/data/articles.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("\nSuccessfully updated articles.ts!")
