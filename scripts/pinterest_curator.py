import os
import sys
import re
import json
import hashlib
import time
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont

# Thư mục lưu trữ nguyên liệu và thành phẩm
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_IMAGE_DIR = os.path.join(BASE_DIR, 'public', 'pinterest_raw')
OUTPUT_DIR = os.path.join(BASE_DIR, 'public', 'curated_visuals')
ARTICLE_IMG_DIR = os.path.join(BASE_DIR, 'public', 'images', 'articles')
HISTORY_FILE = os.path.join(BASE_DIR, 'scripts', 'used_curated_images.json')

os.makedirs(RAW_IMAGE_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(ARTICLE_IMG_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
}

# 10 Bộ từ khóa chủ đề SỰ TẬP TRUNG chuẩn Pinterest cho Trại Cai Nghiện
THEMES = {
    1: {"name": "Bàn làm việc tối giản & Đơn nhiệm", "query": "minimalist desk setup clean workspace aesthetic warm lighting", "unsplash": "minimalist desk laptop"},
    2: {"name": "Chế độ ẩn tu & Không điện thoại", "query": "monk mode aesthetic studying desk night time no phone", "unsplash": "study desk night lamp"},
    3: {"name": "Góc học giả & Làm việc sâu", "query": "dark academia desk study motivation vintage wooden bookshelf moody", "unsplash": "dark academia library"},
    4: {"name": "60 phút buổi sáng không màn hình", "query": "quiet morning sunlight journaling coffee open notebook aesthetic", "unsplash": "morning coffee window sunlight"},
    5: {"name": "Nghiên cứu & Đọc sách đêm khuya", "query": "late night reading book warm lamp aesthetic quiet bedroom cozy", "unsplash": "cozy reading book night"},
    6: {"name": "Làm việc bên cửa sổ ngày mưa", "query": "rainy day coffee desk window view drops cozy productivity aesthetic", "unsplash": "rain window coffee desk"},
    7: {"name": "Xả rác tâm trí & Đóng khung thời gian", "query": "bullet journal time blocking planner desk pen handwritten aesthetic", "unsplash": "journal planner desk pen"},
    8: {"name": "Thiền trà & Năng suất chánh niệm", "query": "zen minimalist room tatami desk tea window shadow aesthetic", "unsplash": "zen tea minimalist"},
    9: {"name": "Tản bộ phục hồi thùy trán", "query": "walking in foggy pine forest lone path green nature aesthetic peaceful", "unsplash": "foggy forest trees walking"},
    10: {"name": "Không gian sáng tạo Bắc Âu", "query": "scandinavian minimalist studio white desk plants natural light aesthetic", "unsplash": "scandinavian workspace plants"}
}


# ==============================================================================
# HỆ THỐNG KIỂM SOÁT & CHỐNG TRÙNG LẶP ẢNH TUYỆT ĐỐI (ZERO DUPLICATES)
# ==============================================================================

def compute_file_hash(file_path):
    """Tính toán mã MD5 của nội dung ảnh để chống trùng tuyệt đối."""
    hasher = hashlib.md5()
    with open(file_path, 'rb') as f:
        buf = f.read(65536)
        while len(buf) > 0:
            hasher.update(buf)
            buf = f.read(65536)
    return hasher.hexdigest()


def load_used_registry():
    """Tải danh sách các URL, mã hash và đường dẫn ảnh đã từng sử dụng."""
    used_data = {"urls": [], "hashes": [], "filenames": []}
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
                used_data = json.load(f)
        except Exception:
            pass

    # Tự động nạp thêm toàn bộ thumbnail đã có trong src/data/articles.ts
    articles_ts = os.path.join(BASE_DIR, 'src', 'data', 'articles.ts')
    if os.path.exists(articles_ts):
        try:
            with open(articles_ts, 'r', encoding='utf-8') as f:
                content = f.read()
            found = re.findall(r'["\']?thumbnail["\']?\s*:\s*["\']([^"\']+)["\']', content)
            for path in found:
                base = os.path.basename(path)
                if base and base not in used_data["filenames"]:
                    used_data["filenames"].append(base)
        except Exception:
            pass

    # Tự động nạp thêm toàn bộ ảnh đang có trong public/images/articles/
    if os.path.exists(ARTICLE_IMG_DIR):
        for f in os.listdir(ARTICLE_IMG_DIR):
            if f not in used_data["filenames"]:
                used_data["filenames"].append(f)
            # Tính luôn hash của các ảnh hiện hữu nếu chưa có
            f_path = os.path.join(ARTICLE_IMG_DIR, f)
            if os.path.isfile(f_path):
                try:
                    f_hash = compute_file_hash(f_path)
                    if f_hash not in used_data["hashes"]:
                        used_data["hashes"].append(f_hash)
                except Exception:
                    pass

    return used_data


def save_used_record(image_url, file_hash, filename, title=""):
    """Lưu vết ảnh mới sử dụng vào file lịch sử vĩnh viễn."""
    registry = load_used_registry()
    if image_url and image_url not in registry["urls"]:
        registry["urls"].append(image_url)
    if file_hash and file_hash not in registry["hashes"]:
        registry["hashes"].append(file_hash)
    if filename and filename not in registry["filenames"]:
        registry["filenames"].append(filename)

    registry["last_updated"] = time.strftime('%Y-%m-%d %H:%M:%S')
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(registry, f, ensure_ascii=False, indent=2)


def is_image_already_used(image_url, temp_file_path=None):
    """Kiểm tra xem ảnh đã từng xuất hiện hay chưa (qua cả URL và mã MD5 hash)."""
    registry = load_used_registry()

    # 1. Kiểm tra URL
    if image_url and image_url in registry.get("urls", []):
        return True, "URL đã tồn tại trong lịch sử"

    # 2. Kiểm tra MD5 Hash file vật lý
    if temp_file_path and os.path.exists(temp_file_path):
        f_hash = compute_file_hash(temp_file_path)
        if f_hash in registry.get("hashes", []):
            return True, f"Nội dung ảnh trùng lặp (Hash: {f_hash})"

    return False, "Hợp lệ (ảnh mới)"


# ==============================================================================
# BÓC TÁCH & TẢI ẢNH PINTEREST RSS
# ==============================================================================

def fetch_pinterest_board_images(board_rss_url):
    """Bóc tách danh sách ảnh chất lượng cao (736x) từ RSS của bảng Pinterest."""
    print(f"🔍 Đang quét bảng Pinterest: {board_rss_url}...")
    req = urllib.request.Request(board_rss_url, headers=HEADERS)
    image_urls = []
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode('utf-8')
            root = ET.fromstring(content)
            for item in root.findall('.//item'):
                desc = item.find('description').text if item.find('description') is not None else ""
                match = re.search(r'src="(https://i\.pinimg\.com/[^"]+)"', desc)
                if match:
                    raw_url = match.group(1)
                    # Chuyển thumbnail sang 736x (Pinterest CDN mở)
                    high_res = raw_url.replace('/236x/', '/736x/').replace('/474x/', '/736x/')
                    image_urls.append(high_res)
    except Exception as e:
        print(f"⚠️ Lỗi quét Pinterest RSS: {e}")
    return image_urls


def download_image(url, save_path):
    """Tải file ảnh về thư mục tạm với timeout an toàn."""
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp, open(save_path, 'wb') as f:
        f.write(resp.read())
    return save_path


# ==============================================================================
# HẬU KỲ HÌNH ẢNH (WEBSITE COVER & SOCIAL QUOTE CARDS)
# ==============================================================================

def process_web_article_cover(image_path, output_path):
    """
    Tạo ảnh bìa bài viết Website:
    - Cắt & căn chỉnh chuẩn tỉ lệ 16:9 (1200 x 675)
    - Tối ưu hóa dung lượng WebP/JPG dưới 120KB
    """
    src = Image.open(image_path).convert('RGB')
    target_w, target_h = 1200, 675
    aspect_target = target_w / target_h
    aspect_src = src.width / src.height

    if aspect_src > aspect_target:
        new_w = int(src.height * aspect_target)
        left = (src.width - new_w) // 2
        cropped = src.crop((left, 0, left + new_w, src.height))
    else:
        new_h = int(src.width / aspect_target)
        top = (src.height - new_h) // 2
        cropped = src.crop((0, top, src.width, top + new_h))

    resized = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Lưu file WebP hoặc JPG chất lượng cao, dung lượng nhẹ
    if output_path.lower().endswith('.webp'):
        resized.save(output_path, 'WEBP', quality=88, method=6)
    else:
        resized.save(output_path, 'JPEG', quality=90, optimize=True)

    print(f"✨ Đã xuất ảnh bìa Website 16:9: {output_path}")
    return output_path


def process_quote_card(image_path, quote_lines, output_path, author_note="— Trại Cai Nghiện"):
    """
    Bộ biến đổi Studio Instagram/Facebook: Cắt 4:5 + Phủ Gradient + Chèn Typography tiếng Việt
    """
    src = Image.open(image_path).convert('RGB')
    target_w, target_h = 1080, 1350
    aspect_target = target_w / target_h
    aspect_src = src.width / src.height

    if aspect_src > aspect_target:
        new_w = int(src.height * aspect_target)
        left = (src.width - new_w) // 2
        cropped = src.crop((left, 0, left + new_w, src.height))
    else:
        new_h = int(src.width / aspect_target)
        top = (src.height - new_h) // 2
        cropped = src.crop((0, top, src.width, top + new_h))

    resized = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Phủ lớp Gradient bóng tối tự nhiên ở nửa trên
    overlay = Image.new('RGBA', (target_w, target_h), (0, 0, 0, 0))
    draw_ov = ImageDraw.Draw(overlay)
    for y in range(750):
        if y < 350:
            alpha = 230
        elif y < 600:
            alpha = int(230 - (y - 350) * (180 / 250))
        else:
            alpha = int(50 - (y - 600) * (50 / 150))
        alpha = max(0, min(255, alpha))
        draw_ov.line([(0, y), (target_w, y)], fill=(15, 18, 16, alpha))

    canvas = Image.alpha_composite(resized.convert('RGBA'), overlay).convert('RGB')
    draw = ImageDraw.Draw(canvas)

    font_path = 'C:/Windows/Fonts/georgia.ttf'
    if not os.path.exists(font_path):
        font_path = 'C:/Windows/Fonts/times.ttf'

    font_quote = ImageFont.truetype(font_path, 44)
    font_note = ImageFont.truetype(font_path, 28)
    font_brand = ImageFont.truetype(font_path, 24)

    start_y = 220
    line_height = 70
    for i, line in enumerate(quote_lines):
        bbox = draw.textbbox((0, 0), line, font=font_quote)
        lw = bbox[2] - bbox[0]
        draw.text(((target_w - lw) / 2, start_y + i * line_height), line, fill=(255, 255, 255), font=font_quote)

    draw.line([(target_w/2 - 25, start_y + len(quote_lines) * line_height + 25), 
               (target_w/2 + 25, start_y + len(quote_lines) * line_height + 25)], 
              fill=(200, 150, 110), width=2)

    bbox_a = draw.textbbox((0, 0), author_note, font=font_note)
    aw = bbox_a[2] - bbox_a[0]
    draw.text(((target_w - aw) / 2, start_y + len(quote_lines) * line_height + 45), author_note, fill=(210, 215, 210), font=font_note)

    footer_text = "🌿 TRẠI CAI NGHIỆN • traicainghien.com"
    bbox_f = draw.textbbox((0, 0), footer_text, font=font_brand)
    fw = bbox_f[2] - bbox_f[0]
    draw.text(((target_w - fw) / 2, 1270), footer_text, fill=(230, 230, 230), font=font_brand)

    canvas.save(output_path, quality=95)
    print(f"✨ Đã xuất ảnh Quote Card 4:5: {output_path}")
    return output_path


if __name__ == '__main__':
    print("🎨 [PINTEREST CURATOR STUDIO] Khởi chạy hệ thống thẩm định...")
    reg = load_used_registry()
    print(f"📊 Đã nạp bộ nhớ: {len(reg.get('filenames', []))} ảnh bài viết, {len(reg.get('hashes', []))} mã hash độc bản.")
