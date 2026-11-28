import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import json
import re
import glob
import hashlib
from datetime import datetime
from typing import Dict, Any

try:
    from gemini_client import generate_content
except ImportError:
    try:
        from scripts.gemini_client import generate_content
    except ImportError:
        generate_content = None

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[àáạảãâầấậẩẫăằắặẳẵ]', 'a', text)
    text = re.sub(r'[èéẹẻẽêềếệểễ]', 'e', text)
    text = re.sub(r'[ìíịỉĩ]', 'i', text)
    text = re.sub(r'[òóọỏõôồốộổỗơờớợởỡ]', 'o', text)
    text = re.sub(r'[ùúụủũưừứựửữ]', 'u', text)
    text = re.sub(r'[ỳýỵỷỹ]', 'y', text)
    text = re.sub(r'[đ]', 'd', text)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text).strip('-')
    return text

class NoUniqueThumbnailError(RuntimeError):
    """Khong con tac pham doc ban nao dat chuan -> phai dung pipeline, khong duoc tai su dung anh cu."""


def get_unique_thumbnail(topic: str = "focus", target_slug: str = None) -> str:
    """
    Chon hoac tao 1 tac pham Nhiếp ảnh Ẩn dụ Nghệ thuật (Cinematic Conceptual Photography) < 120KB.
    BẮT BUỘC TUÂN THỦ NGUYÊN TẮC THÉP CỦA BỐ (20/11/2026):
    - Đuôi file bắt buộc là '-cinematic.webp'
    - Tỉ lệ 16:9 (1200x675)
    - 0% Chữ, 0% Đồ vật ngẫu nhiên (tivi, giường, trang sức), 0% Stock model, 0% Tranh Zen watercolor
    - MD5 và khoảng cách thị giác độc bản 100%
    """
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    articles_ts_path = os.path.join(BASE_DIR, "src", "data", "articles.ts")
    used_db_path = os.path.join(BASE_DIR, "scripts", "used_curated_images.json")
    pool_path = os.path.join(BASE_DIR, "scripts", "curated_cinematic_pool.json")
    images_dir = os.path.join(BASE_DIR, "public", "images", "articles")
    os.makedirs(images_dir, exist_ok=True)

    try:
        from PIL import Image
        import numpy as np
    except ImportError as e:
        raise NoUniqueThumbnailError("Thieu Pillow/numpy de xu ly anh cinematic.") from e

    existing_content = ""
    used_hashes = set()
    used_unsplash = set()

    if os.path.exists(articles_ts_path):
        with open(articles_ts_path, "r", encoding="utf-8") as f:
            existing_content = f.read()

        matches = re.findall(r'\{\s*["\']slug["\']:\s*["\']([^"\']+)["\'][\s\S]*?["\']thumbnail["\']:\s*["\']([^"\']+)["\']', existing_content)
        for slug, thumb in matches:
            p = os.path.join(BASE_DIR, "public", thumb.lstrip("/"))
            if os.path.exists(p):
                try:
                    with open(p, "rb") as bf:
                        used_hashes.add(hashlib.md5(bf.read()).hexdigest())
                except Exception:
                    pass

    if os.path.exists(used_db_path):
        try:
            with open(used_db_path, "r", encoding="utf-8") as f:
                ud = json.load(f)
                records = ud.get("records", []) if isinstance(ud, dict) else ud
                for r in records:
                    if "hash" in r:
                        used_hashes.add(r["hash"])
                    if "unsplash_id" in r:
                        used_unsplash.add(r["unsplash_id"])
        except Exception:
            pass

    # 1. Kiểm tra nếu file {target_slug}-cinematic.webp đã có sẵn và hợp lệ
    if target_slug:
        candidate_slug_file = f"{target_slug}-cinematic.webp"
        candidate_slug_path = os.path.join(images_dir, candidate_slug_file)
        if os.path.exists(candidate_slug_path):
            with open(candidate_slug_path, "rb") as bf:
                h = hashlib.md5(bf.read()).hexdigest()
            if h not in used_hashes or candidate_slug_file in existing_content:
                return f"/images/articles/{candidate_slug_file}"

    # 2. Tìm ảnh có sẵn trong thư mục đạt chuẩn Cinematic (-cinematic.webp) chưa dùng
    candidates = glob.glob(os.path.join(images_dir, "*-cinematic.webp"))
    candidates.sort()
    for cand in candidates:
        fname = os.path.basename(cand)
        if fname in existing_content:
            continue
        try:
            size = os.path.getsize(cand)
            if size > 122880:
                continue
            with open(cand, "rb") as bf:
                h = hashlib.md5(bf.read()).hexdigest()
            if h in used_hashes:
                continue
            print(f"✅ [THUMBNAIL GATE] Chọn thành công ảnh Cinematic có sẵn: {fname} ({size/1024:.1f}KB)")
            return f"/images/articles/{fname}"
        except Exception:
            pass

    # 3. Kéo ảnh mới từ Kho Curated Cinematic Pool (36+ ảnh Unsplash thiên nhiên/tĩnh lặng đã qua kiểm duyệt)
    if os.path.exists(pool_path):
        try:
            with open(pool_path, "r", encoding="utf-8") as f:
                pool_data = json.load(f)
            verified_pool = pool_data.get("verified_pool", [])
            for item in verified_pool:
                pid = item.get("unsplash_id")
                if not pid or pid in used_unsplash:
                    continue
                url = item.get("url") or f"https://images.unsplash.com/{pid}?w=1600&auto=format&fit=crop&q=85"
                print(f"🌊 [AUTO-CINEMATIC] Đang tải tác phẩm nhiếp ảnh nghệ thuật mới '{pid}' từ Unsplash...")
                import urllib.request
                import io
                from datetime import datetime
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=15) as resp:
                    img_bytes = resp.read()

                img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
                orig_w, orig_h = img.size
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
                file_slug = target_slug or f"cinematic-{topic}-{int(datetime.now().timestamp())}"
                new_fname = f"{file_slug}-cinematic.webp"
                new_fpath = os.path.join(images_dir, new_fname)

                quality = 85
                final_data = None
                while quality >= 50:
                    buf = io.BytesIO()
                    img_resized.save(buf, format="WEBP", quality=quality, method=6)
                    data = buf.getvalue()
                    if len(data) <= 118 * 1024 or quality <= 50:
                        final_data = data
                        with open(new_fpath, "wb") as f_out:
                            f_out.write(data)
                        break
                    quality -= 5

                new_hash = hashlib.md5(final_data).hexdigest()
                # Ghi nhận vào used_curated_images.json
                used_record = {
                    "slug": file_slug,
                    "unsplash_id": pid,
                    "filename": new_fname,
                    "hash": new_hash,
                    "size_kb": round(len(final_data)/1024, 1)
                }
                if os.path.exists(used_db_path):
                    with open(used_db_path, "r", encoding="utf-8") as f:
                        ud = json.load(f)
                    ud.setdefault("records", []).append(used_record)
                    with open(used_db_path, "w", encoding="utf-8") as f:
                        json.dump(ud, f, ensure_ascii=False, indent=2)

                print(f"✅ [AUTO-CINEMATIC] Tạo thành công thumbnail chuẩn Cinematic: {new_fname} ({len(final_data)/1024:.1f}KB)")
                return f"/images/articles/{new_fname}"
        except Exception as e:
            print(f"⚠️ [CINEMATIC POOL DOWNLOAD NOTE] {e}")

    raise NoUniqueThumbnailError("Khong con anh Cinematic nao dat chuan va khong the tai anh moi tu kho Unsplash.")

def generate_article_with_gemini(video_data: Dict[str, Any], topic: str) -> Dict[str, Any]:
    """
    Uses Gemini AI Pool to synthesize a deep, original, and compliant article from YouTube video data.
    """
    if not generate_content:
        raise ValueError("gemini_client is not available!")

    title_raw = video_data.get("title", "")
    channel = video_data.get("channel", "YouTube")
    url = video_data.get("url", "")
    transcript = video_data.get("transcript", "")
    if len(transcript) > 4000:
        transcript = transcript[:4000] + "..."

    topic_name = "Lấy Lại Sự Tập Trung & Giải Phóng Khỏi Xao Nhãng Số" if topic == "focus" else "Xây Dựng Thói Quen & Kỷ Luật Không Cần Gồng"
    pillar_tag = "LayLaiSuTapTrung" if topic == "focus" else "XayDungThoiQuen"
    categories = ["LayLaiSuTapTrung", "RenLuyenBoNao"] if topic == "focus" else ["XayDungThoiQuen", "HieuHanhVi"]
    tags = ["#LayLaiSuTapTrung", "#DeepWork", "#SuongMuNao", "#RenLuyenBoNao"] if topic == "focus" else ["#XayDungThoiQuen", "#AtomicHabits", "#Kaizen", "#KyLuatTuThan"]

    system_prompt = """Bạn là Mây — AI Co-founder & Tổng biên tập của Trại Cai Nghiện (traicainghien.com).
Bạn viết bằng phong cách độc bản 'Nói chuyện cà phê nhưng trí tuệ viện nghiên cứu' (Street-Smart Academic Storytelling):
- Trái tim thấu cảm & Không phán xét: Giải phóng 100% cảm giác dằn vặt, mặc cảm tội lỗi (guilt & shame). Xem xao nhãng hay bỏ cuộc là cơ chế đối phó sai lầm trước áp lực, không phải suy đồi đạo đức.
- Khoa học thần kinh ứng dụng: Giải thích cơ chế não bộ (Dopamine Baseline, thụ thể D2, Amygdala, Prefrontal Cortex, Ultradian Rhythm, Atomic Habits) để độc giả hiểu và thôi tự trách.
- Ngôn từ đời thường, hình ảnh trần trụi: ngón tay quẹt máy 2h sáng, 20 tab trình duyệt đơ máy, bát phở 30k, chiếc điện thoại úp mặt cách xa 2 mét.
- Động lực thay đổi vì những người thân yêu: Chỉ ra nỗi đau khi người nghiện xao nhãng làm tổn thương gia đình, và thắp sáng khát vọng trở về phiên bản tươi mới (fresh) đã từng có.

QUY TẮC THÉP VỀ BÀI VIẾT (BẮT BUỘC TUÂN THỦ 100%):
1. Tiêu đề (clean_title): Độ dài VÀNG từ 50 đến 62 ký tự tiếng Việt (vừa khít 2 dòng trên mobile, không bị ba chấm ...).
2. Độ dài nội dung (content): BẮT BUỘC ĐẠT TỪ 2.500 ĐẾN 3.200 TỪ (tính theo từ thực tế). Chia thành 4-5 mục lớn bằng tiêu đề ###.
3. TUYỆT ĐỐI CẤM: Không dùng khối code (```), không dùng Mermaid diagram, không dùng công thức toán LaTeX ($ hay $$), không dùng ký tự mũi tên LaTeX (\\rightarrow), không dùng ASCII art hay text diagram, không dùng bảng Markdown thô (| :--- |). Mọi mũi tên phải dùng unicode sạch '→', công thức viết dạng tự nhiên (1,01³⁶⁵ = 37,78).
4. KHỐI BẮT BUỘC Ở CUỐI BÀI: 
- Mục: ### Lời Nhắn Gửi Từ Trại Cai Nghiện (lời tâm tình ấm áp, thấu cảm, không phán xét, hướng tới tình yêu thương gia đình).
- Mục: ### NHỮNG ĐIỂM CỐT LÕI (KEY TAKEAWAYS) (gồm 4 gạch đầu dòng đúc kết cốt lõi và 1 gạch đầu dòng cuối cùng trích dẫn nguồn video gốc: * Nguồn tham khảo tri thức: Đúc kết từ video "[Tên video gốc]" của kênh [Tên kênh] ([URL])).
5. Thời gian đọc (readTime): Đặt là "11 phút đọc" hoặc "12 phút đọc" (tuyệt đối không vượt quá 12 phút)."""

    user_prompt = f"""Hãy phân tích video YouTube sau và sản xuất trọn bộ bài viết chuyên sâu đẳng cấp 2.500 từ cho website:
- Video Title: {title_raw}
- Kênh: {channel}
- Link: {url}
- Chủ đề: {topic_name}
- Bản gỡ băng (Transcript trích đoạn): {transcript if transcript else "(Không có transcript, hãy dựa vào ý nghĩa cốt lõi của tiêu đề và kênh để khai triển bài viết)"}

Hãy trả về DUY NHẤT một chuỗi JSON hợp lệ (không kèm bất kỳ lời dẫn giải nào bên ngoài) với đúng cấu trúc sau:
{{
  "clean_title": "Tiêu đề tiếng Việt 50-62 ký tự",
  "slug_base": "chuoi-slug-khong-dau-kebab-case",
  "excerpt": "Đoạn mô tả ngắn 1-2 câu sâu sắc chạm nỗi đau độc giả (140-160 ký tự)",
  "content": "Toàn bộ nội dung bài viết Markdown chuẩn 2.500 - 3.200 từ...",
  "telegram_bullets": [
    "Bài học cốt lõi 1 ngắn gọn",
    "Bài học cốt lõi 2 ngắn gọn",
    "Bài học cốt lõi 3 ngắn gọn"
  ],
  "facebook_hook": "DÒNG HOOK CÂU NÓI HOẶC CÂU HỎI MẠNH MẼ GÂY TÒ MÒ VIẾT HOA",
  "facebook_body": "3-4 đoạn văn kể chuyện dẫn dắt tâm lý, giải thích khoa học và kêu gọi đọc tiếp bài trên web..."
}}"""

    print(f"🧠 [MÂY AI] Đang gửi yêu cầu tới Gemini AI Pool để viết bài chuyên sâu 2.500 từ về '{title_raw}'...")
    response_text = generate_content(
        prompt=user_prompt,
        system_instruction=system_prompt,
        model="gemini-3-flash-preview",
        temperature=0.7,
        max_tokens=8192
    )

    if not response_text:
        raise ValueError("Gemini AI API returned empty response!")

    cleaned = response_text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    data = json.loads(cleaned)
    return data

def build_article_from_video(video_data: Dict[str, Any], topic: str = "focus") -> Dict[str, Any]:
    """
    Main builder: mines video, synthesizes content via Gemini AI, attaches unique thumbnail,
    and formats for Website, Telegram, and Facebook.
    """
    title_raw = video_data.get("title", "Bài học chuyển hóa bản thân")
    channel = video_data.get("channel", "Trại Cai Nghiện")
    url = video_data.get("url", "https://traicainghien.com")
    today_str = datetime.now().strftime("%d/%m/%Y")
    date_slug = datetime.now().strftime("%Y%m%d")

    # Step 1: Generate via Gemini AI with strict quality validation
    ai_data = None
    try:
        ai_data = generate_article_with_gemini(video_data, topic)
    except Exception as e:
        print(f"❌ [GEMINI GENERATION ERROR] {e}")
        raise RuntimeError(f"Hệ thống AI không thể tạo bài viết đạt chuẩn cho '{title_raw}': {e}. Dừng luồng để bảo vệ chất lượng nội dung!")

    # Generate slug first so thumbnail can be named after it
    date_suffix = datetime.now().strftime("%Y%m%d")
    raw_slug = f"{slugify(clean_title[:45])}-{date_suffix}"
    slug = raw_slug[:75].rstrip("-")
    # Select unique thumbnail with slug binding
    thumbnail = get_unique_thumbnail(topic, target_slug=slug)

    clean_title = ai_data.get("clean_title", "").strip().strip('"')
    if len(clean_title) < 40 or len(clean_title) > 65:
        clean_title = f"{clean_title[:59]}..." if len(clean_title) > 62 else clean_title

    slug_base = ai_data.get("slug_base") or slugify(clean_title)
    slug = f"{slug_base[:50].strip('-')}-{date_slug}"
    excerpt = ai_data.get("excerpt", f"Bài học sâu sắc đúc kết từ video của {channel}.")
    content = ai_data.get("content", "")
    
    # Ensure clean content (no LaTeX, no prohibited blocks)
    content = re.sub(r'```mermaid[\s\S]*?```', '', content)
    content = re.sub(r'```[\s\S]*?```', '', content)
    content = content.replace('$\\rightarrow$', '—').replace('\\rightarrow', '—')
    content = re.sub(r'\$\$[\s\S]*?\$\$', '', content)
    content = re.sub(r'\$[a-zA-Z0-9\^_\\\{\}\+\-\*\/=]{2,}\$', '', content)
    content = re.sub(r'\|.*?\|.*?\|\s*\\n\s*\|.*?:---.*?\|', '', content)

    # Word count quality check (Must be >= 2000 words)
    words = len(content.split())
    if words < 2000:
        raise ValueError(f"Bài viết chỉ đạt {words} từ (dưới mức tối thiểu 2.000 từ của Trại Cai Nghiện). Hủy xuất bản để bảo vệ chất lượng!")

    bullets = ai_data.get("telegram_bullets", [
        "Không dùng ý chí thô kệch đấu với thuật toán, hãy thiết kế môi trường ít ma sát.",
        "Quy tắc 2 phút và Kaizen 1% mỗi ngày giúp vượt qua phản kháng tự nhiên của não bộ.",
        "Sự chuyển hóa bền vững bắt đầu từ lòng tự trắc ẩn và tình yêu thương gia đình."
    ])
    
    fb_hook = ai_data.get("facebook_hook", f"BẠN CÓ ĐANG THỰC SỰ LÀM CHỦ TÂM TRÍ MÌNH?")
    fb_body = ai_data.get("facebook_body", "")

    pillar_tag = "LayLaiSuTapTrung" if topic == "focus" else "XayDungThoiQuen"
    categories = ["LayLaiSuTapTrung", "RenLuyenBoNao"] if topic == "focus" else ["XayDungThoiQuen", "HieuHanhVi"]
    tags = ["#LayLaiSuTapTrung", "#DeepWork", "#RenLuyenBoNao"] if topic == "focus" else ["#XayDungThoiQuen", "#AtomicHabits", "#KyLuatTuThan"]

    article_obj = {
        "slug": slug,
        "title": clean_title,
        "excerpt": excerpt,
        "thumbnail": thumbnail,
        "pillar": "Trụ cột 1: Hiểu cơ chế hành vi & Rèn luyện bộ não" if topic == "focus" else "Trụ cột 2: Xây dựng thói quen tốt & kỷ luật không cần gồng",
        "pillarTag": pillar_tag,
        "categories": categories,
        "tags": tags,
        "readTime": "10 phút đọc",
        "date": today_str,
        "author": "Mây — Trại Cai Nghiện",
        "content": content,
        "sources": [url]
    }

    # Telegram Caption
    tg_caption = f"""🌿 <b>TRẠI CAI NGHIỆN DAILY</b>

🏷 <b>[{tags[0]} • {tags[1]}]</b>
👉 <b>{clean_title}</b>

📌 <b>3 Bài học đắt giá rút ra từ nghiên cứu:</b>
• {bullets[0]}
• {bullets[1]}
• {bullets[2]}

🌿 <i>Dành cho những lúc bạn muốn đọc chậm lại và hiểu sâu hơn về cơ chế tâm trí của mình:</i>
👉 <b>Đọc bài viết đầy đủ tại:</b> <a href="https://traicainghien.com/bai-viet/{slug}">traicainghien.com/bai-viet/{slug}</a>

======
🌿 <b>Trại Cai Nghiện — Trở về phiên bản tốt nhất của bạn</b>
<a href="https://traicainghien.com">Website</a> | <a href="https://traicainghien.com/trac-nghiem">Trắc nghiệm</a> | <a href="https://www.facebook.com/traicainghienvn2026">Fanpage</a>"""

    # Facebook Post
    fb_post = f"""{fb_hook}

{fb_body}

Mời bạn cùng Mây bước vào bài viết phân tích chuyên sâu hôm nay trên website Trại Cai Nghiện để khám phá trọn vẹn lộ trình chuyển hóa:

👉 Đọc bài viết đầy đủ tại đây:
https://traicainghien.com/bai-viet/{slug}

======
🌿 TRẠI CAI NGHIỆN — Trở về phiên bản tốt nhất của bạn
🌐 Website: https://traicainghien.com
📱 Kênh Telegram Daily: https://t.me/traicainghiendaily"""

    return {
        "article": article_obj,
        "telegram_caption": tg_caption,
        "facebook_post": fb_post
    }

if __name__ == "__main__":
    test_video = {
        "id": "test_id_123",
        "title": "How to Build Discipline Without Willpower",
        "channel": "Better Ideas",
        "url": "https://www.youtube.com/watch?v=test_id_123",
        "transcript": "Discipline is not about forcing yourself every day. It is about setting up systems..."
    }
    print("Testing build_article_from_video for topic: habit...")
    res = build_article_from_video(test_video, topic="habit")
    print("\nTitle:", res["article"]["title"])
    print("Slug:", res["article"]["slug"])
    print("Thumbnail:", res["article"]["thumbnail"])
    print("Excerpt:", res["article"]["excerpt"])
    print("\nTelegram Caption preview:\n", res["telegram_caption"][:200])
