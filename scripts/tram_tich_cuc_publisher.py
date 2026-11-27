import os
import sys
import json
import re
import time
import datetime
import unicodedata
import requests
from PIL import Image, ImageDraw, ImageFont

# Add scripts and root directory to path
ROOT_DIR = "/root/traicainghien" if os.path.exists("/root/traicainghien") else os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT_DIR)
sys.path.insert(0, os.path.join(ROOT_DIR, "scripts"))

from curl_cffi import requests as cffi_requests
from facebook_page_scraper.request_handler import RequestHandler
from gemini_client import generate_content

sys.stdout.reconfigure(encoding='utf-8')

PAGE_ID = "1510006125521990"
PAGE_ACCESS_TOKEN = "EAAgoZBziOULEBS3Jx3vkxk1vogIEOkBPj06ZBNFP3YEK7ZB8gvwHFDWZBifmZAbaakwthwt8IPwTr8CXEWWIZC15k4yyNZBWDZCdRUFdZCkMIkdgPBIX7hY2f5OyOQCxfjAfNB194ZCRbf7vClwDjos49xYenFyJcKDy4V86P2xeBu4qt4b8agCNZANcIbYwSGNApfA8UWbaLmBJABgABLz0xqD"
HISTORY_FILE = os.path.join(ROOT_DIR, "ttcuc_quote_history.json")

def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: load history error: {e}")
    return {"used_source_ids": [], "used_quotes": []}

def save_history(history):
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

def normalize_text(text: str) -> str:
    """Chuyển đổi font unicode kiểu cách (bold/italic) thành text chuẩn."""
    if not text:
        return ""
    norm = unicodedata.normalize('NFKD', text)
    # Loại bỏ emoji dư thừa nếu có để Gemini dịch chuẩn hơn
    return norm.strip()

def fetch_power_of_positivity():
    """Cào bài đăng mới nhất từ Fanpage Power of Positivity."""
    url = "https://www.facebook.com/powerofpositivity"
    handler = RequestHandler()
    try:
        html = handler.fetch_html(url)
        if not html:
            return None
        feed_json = handler.find_json(html, "timeline_list_feed_units")
        if not feed_json:
            return None
        
        text = None
        post_id = None
        permalink = None

        def search_node(obj):
            nonlocal text, post_id, permalink
            if isinstance(obj, dict):
                if "post_id" in obj and not post_id:
                    post_id = str(obj["post_id"])
                if "permalink_url" in obj and not permalink:
                    permalink = obj["permalink_url"]
                if "message" in obj and isinstance(obj["message"], dict) and "text" in obj["message"]:
                    if not text and obj["message"]["text"]:
                        text = obj["message"]["text"]
                for v in obj.values():
                    search_node(v)
            elif isinstance(obj, list):
                for it in obj:
                    search_node(it)

        search_node(feed_json)
        if text:
            return {
                "source_name": "Power of Positivity",
                "source_url": url,
                "post_id": post_id or f"pop_{hash(text)}",
                "permalink": permalink,
                "text": normalize_text(text)
            }
        return None
    except Exception as e:
        print(f"Warning scraping Power of Positivity: {e}")
        return None
    finally:
        handler.close()

def fetch_positivity_blog_rss():
    """Lấy châm ngôn và bài học chữa lành từ The Positivity Blog (Henrik Edberg)."""
    import urllib.request
    import xml.etree.ElementTree as ET
    url = "https://www.positivityblog.com/feed/"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=12) as resp:
            root = ET.fromstring(resp.read())
            items = root.findall('.//item')
            for item in items:
                title = item.find('title').text if item.find('title') is not None else ''
                desc = item.find('description').text if item.find('description') is not None else ''
                link = item.find('link').text if item.find('link') is not None else url
                clean_desc = re.sub(r'<[^>]+>', ' ', desc).strip()
                combined = f"{title}. {clean_desc}"
                if len(combined) > 40:
                    return {
                        "source_name": "The Positivity Blog",
                        "source_url": link,
                        "post_id": f"posblog_{hash(title)}",
                        "permalink": link,
                        "text": normalize_text(combined[:500])
                    }
        return None
    except Exception as e:
        print(f"Warning scraping Positivity Blog: {e}")
        return None

def fetch_curated_wisdom_quote(slot="night"):
    """
    Kho châm ngôn VĂN XUÔI tỉnh thức, push tinh thần, yêu cuộc sống & sống ở thực tại.
    Đa dạng chủ đề, tuyệt đối không viết thành thơ, giàu sức nặng tri thức và truyền cảm hứng.
    """
    wisdom_pool = {
        "morning": [
            # Push tinh thần & Khởi đầu mới
            {"quote": "Mỗi buổi sáng thức dậy là một cơ hội mới để bạn viết tiếp cuộc đời mình. Đừng để những nuối tiếc của ngày hôm qua đánh cắp năng lượng và sự tự tin của ngày hôm nay.", "author": "Trạm Tích Cực", "topic": "Khởi đầu & Động lực"},
            {"quote": "Đừng đợi đến khi mọi thứ hoàn hảo mới bắt đầu. Sự dũng cảm thực sự nằm ở chỗ bạn dám bước đi ngay cả khi đôi chân còn nhiều bỡ ngỡ.", "author": "Brené Brown", "topic": "Dũng cảm dấn thân"},
            {"quote": "Thức dậy vào mỗi sớm mai và nhận ra mình vẫn còn được thở, được nhìn thấy ánh nắng và được yêu thương—đó đã là một phép màu vô giá.", "author": "Marcus Aurelius", "topic": "Biết ơn sự sống"},
            {"quote": "Kỷ luật không phải là sự trừng phạt, mà là món quà lớn nhất bạn dành cho tương lai của chính mình. Hãy bắt đầu ngày mới bằng một hành động nhỏ nhưng dứt khoát.", "author": "Trạm Tích Cực", "topic": "Kỷ luật tự thân"},
            {"quote": "Hãy đón chào ngày mới bằng một nụ cười chân thành với chính mình trong gương. Bạn đã đi qua rất nhiều thử thách để đứng vững ở đây hôm nay.", "author": "Matt Haig", "topic": "Yêu lấy chính mình"},
            {"quote": "Sự bình an không nằm ở một nơi nào xa xôi. Nó bắt đầu từ hơi thở tỉnh thức đầu tiên khi bạn buông chiếc điện thoại xuống và mỉm cười đón ngày mới.", "author": "Thích Nhất Hạnh", "topic": "Sống ở thực tại"}
        ],
        "afternoon": [
            # Tỉnh thức giữa ngày, yêu đời & nạp năng lượng
            {"quote": "Khoảnh khắc duy nhất bạn thực sự sở hữu là ngay lúc này. Buông màn hình xuống một chút, nhìn sâu vào những điều bình dị quanh mình và hít một hơi thật đầy.", "author": "Eckhart Tolle", "topic": "Hiện diện ở thực tại"},
            {"quote": "Chậm lại một nhịp không phải là tụt hậu. Đó là cách bạn cho phép tâm hồn mình bắt kịp với cơ thể sau những giờ làm việc căng thẳng.", "author": "Trạm Tích Cực", "topic": "Sống chậm chánh niệm"},
            {"quote": "Đừng chỉ đếm những gì bạn chưa làm được. Hãy dừng lại giữa buổi chiều để cảm ơn bản thân vì đã nỗ lực hết mình cho đến tận phút này.", "author": "Tiny Buddha", "topic": "Biết ơn & Công nhận bản thân"},
            {"quote": "Uống một ngụm nước ấm, ngắm nhìn vệt nắng ngoài cửa sổ và thở thật sâu. Cuộc sống vẫn luôn chứa đựng những điều kỳ diệu dành cho người biết lắng lại.", "author": "Trạm Tích Cực", "topic": "Yêu cuộc sống bình dị"},
            {"quote": "Nghỉ ngơi không phải là từ bỏ. Đó là trạm sạc cần thiết để bạn tiếp tục bước đi vững vàng trên hành trình dài phía trước.", "author": "Trạm Tích Cực", "topic": "Tái tạo năng lượng"}
        ],
        "night": [
            # Buông bỏ gánh nặng, bao dung nội tâm & giấc ngủ an lành
            {"quote": "Bạn không cần phải mang vác tất cả gánh nặng của ngày hôm nay vào giấc ngủ. Hãy học cách đặt xuống để đôi tay còn đón nhận những điều tươi mới vào sáng mai.", "author": "Eckhart Tolle", "topic": "Buông bỏ & Tự do"},
            {"quote": "Hôm nay bạn đã làm rất tốt rồi. Dù có những việc chưa trọn vẹn, xin đừng tự dằn vặt. Ngày mai mặt trời vẫn mọc và bạn luôn có cơ hội để bắt đầu lại.", "author": "Brené Brown", "topic": "Bao dung với bản thân"},
            {"quote": "Dù hôm nay có chông chênh đến mấy, câu chuyện của bạn vẫn xứng đáng có thêm những chương mới rực rỡ. Đêm nay, hãy cho phép tâm trí mình được nghỉ ngơi trọn vẹn.", "author": "Matt Haig", "topic": "Niềm tin & Hy vọng"},
            {"quote": "Tắt màn hình, khép lại những lo toan và lắng nghe nhịp thở êm đềm của căn phòng. Sự bình yên thực sự luôn ở ngay bên trong bạn.", "author": "Thích Nhất Hạnh", "topic": "Tĩnh lặng nội tâm"},
            {"quote": "Sau tất cả những áp lực ngoài kia, điều tuyệt vời nhất bạn có thể làm cho mình đêm nay là thả lỏng toàn bộ cơ thể và ngủ một giấc thật ngon.", "author": "Trạm Tích Cực", "topic": "Chăm sóc giấc ngủ"}
        ]
    }
    
    quotes = wisdom_pool.get(slot, wisdom_pool["night"])
    day_seed = int(datetime.datetime.now().strftime("%Y%m%d%H"))
    selected = quotes[day_seed % len(quotes)]
    
    return {
        "source_name": f"{selected['author']} • Trạm Tích Cực",
        "source_url": "https://facebook.com/tramtichcuchn",
        "post_id": f"wisdom_{hash(selected['quote'])}",
        "permalink": "https://facebook.com/tramtichcuchn",
        "text": selected["quote"],
        "topic": selected.get("topic", "Năng lượng tích cực")
    }

def translate_and_craft_content(raw_text, source_name, source_url, slot="night"):
    """
    Dùng Gemini biên soạn câu quote VĂN XUÔI sâu sắc, đa dạng chủ đề:
    - Push tinh thần, dũng cảm dấn thân
    - Sống ở thực tại, tỉnh thức chánh niệm
    - Yêu cuộc sống, lòng biết ơn chân thành
    - Bao dung, bình an nội tâm
    TUYỆT ĐỐI KHÔNG VIẾT THÀNH THƠ, không gieo vần gượng gạo.
    """
    system_prompt = (
        "Bạn là Giám đốc Sáng tạo Nội dung của Trạm Tích Cực (thuộc dự án Trại Cai Nghiện - traicainghien.com).\n"
        "Sứ mệnh của Trạm Tích Cực là mang đến nguồn cảm hứng sống đẹp, push tinh thần tích cực, giúp người đọc trân trọng từng khoảnh khắc ở thực tại, yêu cuộc sống và nuôi dưỡng sự bình an nội tâm.\n\n"
        "QUY TẮC CỐT TỬ VỀ ĐỊNH DẠNG QUOTE:\n"
        "1. TUYỆT ĐỐI KHÔNG VIẾT THÀNH THƠ! Không gieo vần, không làm thơ lục bát, 4 chữ hay 5 chữ.\n"
        "2. BẮT BUỘC THỂ HIỆN DƯỚI DẠNG VĂN XUÔI ĐÚC KẾT (Punchy Prose / Philosophical Epigram):\n"
        "   - Độ dài từ 25 đến 45 từ (khoảng 2-3 câu văn xuôi ngắn gọn, súc tích, ngắt nhịp tự nhiên).\n"
        "   - Ngôn từ mộc mạc, hiện đại, có sức nặng tâm lý, nói thẳng vào tâm trí người đọc như một câu trích dẫn tâm đắc trong sách kinh điển.\n"
        "   - Tự động ngắt dòng bằng ký tự xuống dòng (\\n) sau mỗi vế câu hoàn chỉnh (khoảng 2-4 dòng văn xuôi) để căn giữa tuyệt đẹp trên ảnh thẻ vuông 1080x1080.\n"
        "3. ĐA DẠNG HÓA CHỦ ĐỀ: Luân chuyển giữa: [1] Push tinh thần, dám bắt đầu & vượt qua giới hạn; [2] Sống ở thực tại, ngắt kết nối xao nhãng; [3] Yêu cuộc sống, biết ơn những điều bình dị; [4] Xoa dịu lo âu, bao dung với chính mình.\n"
        "4. KHÔNG DÙNG VĂN MẪU AI: Cấm các từ sáo rỗng như 'hãy nhớ rằng', 'hãy cùng nhau', 'trong cuộc sống hối hả', 'ngọn hải đăng'."
    )

    if slot == "morning":
        slot_desc = "morning: 10h00 sáng - Động lực mạnh mẽ, push tinh thần, dám bắt đầu, kỷ luật tự thân, biết ơn ngày mới"
    elif slot == "afternoon":
        slot_desc = "afternoon: 14h30 chiều - Sống ở thực tại, giải tỏa áp lực công việc, nhắc nhở uống nước, thả lỏng tâm trí và tận hưởng từng khoảnh khắc"
    else:
        slot_desc = "night: 21h00 tối - Yêu cuộc sống, trân trọng hành trình đã qua, buông bỏ dằn vặt, giấc ngủ an lành và phục hồi"

    user_prompt = f"""
Nguồn cảm hứng: {source_name}
Nội dung gốc:
\"\"\"{raw_text}\"\"\"

Khung giờ đăng: {slot_desc}

Hãy chuyển hóa thành JSON format với cấu trúc:
{{
  "quote_vn": "Câu châm ngôn VĂN XUÔI sâu sắc (25-45 từ, KHÔNG PHẢI THƠ). Ngắt 2-4 dòng bằng dấu \\n tự nhiên để in lên ảnh thẻ vuông 1080x1080.",
  "caption": "Bài viết đi kèm 3-4 đoạn văn xuôi sâu sắc, liên hệ đời thực, truyền cảm hứng sống tích cực, có lời chúc ấm áp và hashtag #TramTichCuc #TraiCaiNghien #SongCoChuDich #YeuCuocSong #SongOThucTai",
  "comment": "Bình luận đầu tiên dịu dàng, khéo léo dẫn link về cẩm nang và bài viết chữa lành tại https://www.traicainghien.com/bai-viet"
}}
Chỉ trả về JSON thuần túy, không có code blocks markdown ```json.
"""

    resp = generate_content(user_prompt, system_instruction=system_prompt, temperature=0.7)
    clean_json = re.sub(r"^```json\s*", "", resp.strip(), flags=re.MULTILINE)
    clean_json = re.sub(r"^```\s*", "", clean_json.strip(), flags=re.MULTILINE)
    clean_json = re.sub(r"```$", "", clean_json.strip())
    return json.loads(clean_json)

def render_quote_image(
    quote_text: str,
    output_path: str = "tram_tich_cuc_quote.jpg",
    page_name: str = "Trạm Tích Cực",
    handle: str = "@tramtichcuchn"
):
    width, height = 1080, 1080
    bg_color = (250, 247, 242)   # Nền giấy kem Washi ấm áp (#FAF7F2)
    text_color = (35, 67, 56)     # Xanh rêu than trầm thanh tịnh (#234338)
    sub_color = (130, 138, 133)   # Xám rêu nhạt cho handle

    img = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    font_dir = os.path.join(ROOT_DIR, "assets", "fonts")
    font_path = os.path.join(font_dir, "Itim-Regular.ttf")
    if not os.path.exists(font_path):
        font_path = os.path.join(font_dir, "Mali-Medium.ttf")
    if not os.path.exists(font_path):
        font_path = os.path.join(font_dir, "BeVietnamPro-Medium.ttf")

    # Tự động điều chỉnh kích cỡ font chữ thông minh cho văn xuôi
    text_len = len(quote_text.strip())
    if text_len > 140:
        quote_font_size = 38
        wrap_width = 36
    elif text_len > 90:
        quote_font_size = 42
        wrap_width = 34
    else:
        quote_font_size = 46
        wrap_width = 32

    quote_font = ImageFont.truetype(font_path, quote_font_size)
    brand_font_path = os.path.join(font_dir, "BeVietnamPro-Medium.ttf")
    if not os.path.exists(brand_font_path):
        brand_font_path = font_path

    brand_font = ImageFont.truetype(brand_font_path, 26)
    handle_font = ImageFont.truetype(brand_font_path, 20)

    lines = [l.strip() for l in quote_text.strip().split("\n") if l.strip()]
    formatted_lines = []
    import textwrap
    for line in lines:
        if len(line) > wrap_width:
            formatted_lines.extend(textwrap.wrap(line, width=wrap_width))
        else:
            formatted_lines.append(line)

    line_height = int(quote_font_size * 1.65)
    total_text_height = len(formatted_lines) * line_height
    start_y = (height - total_text_height) // 2 - 40

    for idx, line in enumerate(formatted_lines):
        bbox = draw.textbbox((0, 0), line, font=quote_font)
        w = bbox[2] - bbox[0]
        x = (width - w) // 2
        y = start_y + idx * line_height
        draw.text((x, y), line, font=quote_font, fill=text_color)

    # Footer chữ ký Totem
    footer_y = height - 130
    logo_path = os.path.join(ROOT_DIR, "public/images/logo-totem.png")
    logo_size = 64

    if os.path.exists(logo_path):
        logo_img = Image.open(logo_path).convert("RGBA")
        logo_img = logo_img.resize((logo_size, logo_size), Image.LANCZOS)
        
        mask = Image.new('L', (logo_size, logo_size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse((0, 0, logo_size, logo_size), fill=255)
        
        brand_bbox = draw.textbbox((0, 0), page_name, font=brand_font)
        handle_bbox = draw.textbbox((0, 0), handle, font=handle_font)
        text_block_w = max(brand_bbox[2] - brand_bbox[0], handle_bbox[2] - handle_bbox[0])
        
        total_footer_w = logo_size + 18 + text_block_w
        logo_x = (width - total_footer_w) // 2
        text_x = logo_x + logo_size + 18

        img.paste(logo_img, (logo_x, footer_y), mask)
        draw.text((text_x, footer_y + 4), page_name, font=brand_font, fill=(45, 49, 46))
        draw.text((text_x, footer_y + 34), handle, font=handle_font, fill=sub_color)

    img.save(output_path, "JPEG", quality=95)
    print(f"✅ Rendered image: {output_path}")
    return output_path

def publish_quote_flow(force_slot=None):
    now = datetime.datetime.now()
    if force_slot:
        slot = force_slot
    elif now.hour < 12:
        slot = "morning"
    elif now.hour < 18:
        slot = "afternoon"
    else:
        slot = "night"
    history = load_history()
    used_ids = set(history.get("used_source_ids", []))
    used_quotes = set(history.get("used_quotes", []))

    # Danh sách các nguồn nội dung chất lượng cao:
    # 1. Fanpage Power of Positivity
    # 2. The Positivity Blog (Henrik Edberg RSS)
    # 3. Kho châm ngôn tỉnh thức & chữa lành (Curated Wisdom Pool)
    source_candidate = None

    print(f"[{now.strftime('%Y-%m-%d %H:%M:%S')}] Đang quét các nguồn nội dung chính thức...")
    
    fetchers = [
        fetch_power_of_positivity,
        fetch_positivity_blog_rss,
        lambda: fetch_curated_wisdom_quote(slot)
    ]

    for fetcher in fetchers:
        try:
            candidate = fetcher()
            if candidate and candidate.get("text"):
                pid = candidate["post_id"]
                txt = candidate["text"]
                if pid not in used_ids and txt not in used_quotes:
                    source_candidate = candidate
                    break
        except Exception as fe:
            print("Fetcher note:", fe)

    # Dự phòng an toàn tuyệt đối: nếu chưa có candidate, luôn lấy từ kho châm ngôn
    if not source_candidate:
        source_candidate = fetch_curated_wisdom_quote(slot)

    print(f"🎯 Đã chọn nguồn: {source_candidate['source_name']}")
    print(f"🔗 Link gốc: {source_candidate['source_url']}")
    print(f"📝 Nội dung gốc: {source_candidate['text'][:150]}...")

    # Chuyển dịch và biên soạn
    crafted = translate_and_craft_content(
        source_candidate["text"],
        source_candidate["source_name"],
        source_candidate["source_url"],
        slot=slot
    )

    quote_vn = crafted["quote_vn"]
    caption = crafted["caption"]
    comment = crafted["comment"]

    # Thêm nguồn cảm hứng văn minh & dẫn link website traicainghien.com
    caption += (
        f"\n\n---\n"
        f"🌿 Lấy cảm hứng và biên dịch từ: {source_candidate['source_name']}\n"
        f"Trạm Tích Cực — Nơi bạn tìm lại sự bình an và tái tạo năng lượng mỗi ngày.\n"
        f"🌱 Cùng bạn trở về phiên bản tốt nhất: https://traicainghien.com"
    )

    # Vẽ ảnh thẻ
    img_filename = f"ttcuc_{slot}_{int(now.timestamp())}.jpg"
    img_path = os.path.join(ROOT_DIR, img_filename)
    render_quote_image(quote_vn, output_path=img_path)

    # Đăng lên Facebook
    url = f"https://graph.facebook.com/v20.0/{PAGE_ID}/photos"
    print(f"🚀 Xuất bản lên Fanpage Trạm Tích Cực (Page ID: {PAGE_ID})...")

    with open(img_path, "rb") as f:
        files = {"source": f}
        data = {
            "caption": caption,
            "access_token": PAGE_ACCESS_TOKEN,
            "published": "true"
        }
        res = requests.post(url, data=data, files=files, timeout=30)
        res_data = res.json()

    if "id" in res_data or "post_id" in res_data:
        published_post_id = res_data.get("post_id") or res_data.get("id")
        print(f"🎉 ĐÃ ĐĂNG BÀI THÀNH CÔNG! Post ID: {published_post_id}")

        # 1. Tự động like bài viết ngay sau khi đăng
        like_target_id = published_post_id if "_" in str(published_post_id) else f"{PAGE_ID}_{published_post_id}"
        like_url = f"https://graph.facebook.com/v20.0/{like_target_id}/likes"
        try:
            like_res = requests.post(like_url, data={"access_token": PAGE_ACCESS_TOKEN}, timeout=15)
            print(f"👍 Đã like bài viết tự động: {like_res.status_code} {like_res.text}")
        except Exception as e:
            print("Like warning:", e)

        # 2. Thả 3 bình luận định hướng (Website + Fanpage Trại Cai Nghiện + Group/Kênh Telegram)
        comment_url = f"https://graph.facebook.com/v20.0/{published_post_id}/comments"
        
        first_comment = comment if comment and "traicainghien.com" in comment else (
            "🌱 Dành cho bạn một khoảng lặng hôm nay: Nếu bạn đang cảm thấy mệt mỏi hay mất tập trung trong cuộc sống, hãy ghé thăm ngôi nhà chung https://traicainghien.com để cùng thực hành những thói quen nhỏ và tìm lại sự bình an nhé."
        )
        
        comments_list = [
            first_comment,
            "🌿 Ghé thăm trang chính Trại Cai Nghiện để đọc thêm các bài viết chuyên sâu về khoa học hành vi, thói quen và cách làm chủ sự chú ý: https://facebook.com/traicainghien",
            "📢 Tham gia cùng chúng mình tại Kênh Telegram để nhận bản tin tâm lý học và những lời nhắc dịu dàng mỗi sáng: https://t.me/traicainghiendaily"
        ]

        for idx, c_text in enumerate(comments_list, 1):
            try:
                c_res = requests.post(
                    comment_url,
                    data={"message": c_text, "access_token": PAGE_ACCESS_TOKEN},
                    timeout=30
                )
                print(f"Comment {idx}/3 Status: {c_res.json()}")
                time.sleep(2)
            except Exception as e:
                print(f"Comment {idx} warning:", e)

        # Lấy permalink
        link_url = f"https://graph.facebook.com/v20.0/{published_post_id}?fields=permalink_url&access_token={PAGE_ACCESS_TOKEN}"
        permalink = None
        try:
            l_res = requests.get(link_url, timeout=10)
            permalink = l_res.json().get("permalink_url")
        except:
            pass
        if not permalink:
            permalink = f"https://www.facebook.com/{PAGE_ID}/posts/{published_post_id}"

        print(f"🔗 DIRECT POST LINK: {permalink}")

        # Ghi nhớ chống trùng
        history = load_history()
        history.setdefault("used_source_ids", []).append(source_candidate["post_id"])
        history.setdefault("used_quotes", []).append(source_candidate["text"])
        history.setdefault("used_quotes", []).append(quote_vn)
        save_history(history)
        print("💾 Đã cập nhật lịch sử chống trùng.")

        try:
            try:
                from task_notifier import notify_task_success
            except ImportError:
                from scripts.task_notifier import notify_task_success
            quote_snippet = quote_vn[:100] + "..." if len(quote_vn) > 100 else quote_vn
            notify_task_success(
                task_name="Quote fan page Trạm Tích Cực",
                channel="✨ Fanpage Facebook Trạm Tích Cực",
                post_url=permalink,
                title=f"Quote: {quote_snippet}",
                extra_info=f"Đã tự động thả like và ghim 3 bình luận phễu dẫn về Trại Cai Nghiện."
            )
        except Exception as e:
            print("Warning: Không thể gửi task_notifier:", e)

        return {
            "status": "success",
            "post_id": published_post_id,
            "permalink": permalink,
            "source": source_candidate["source_name"],
            "quote_vn": quote_vn
        }
    else:
        err_msg = f"Facebook Graph API error: {res_data}"
        try:
            try:
                from task_notifier import notify_task_error
            except ImportError:
                from scripts.task_notifier import notify_task_error
            notify_task_error(
                task_name="Quote fan page Trạm Tích Cực",
                channel="✨ Fanpage Facebook Trạm Tích Cực",
                error_msg=err_msg
            )
        except Exception as e:
            pass
        raise Exception(err_msg)

if __name__ == "__main__":
    slot = sys.argv[1] if len(sys.argv) > 1 else None
    result = publish_quote_flow(force_slot=slot)
    print(json.dumps(result, ensure_ascii=False, indent=2))
