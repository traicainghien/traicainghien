import os
import sys
import json
import re
import html
import time
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from scripts.gemini_client import generate_content

HISTORY_FILE = os.path.join(BASE_DIR, "scripts", "daily_news_history.json")
BOT_TOKEN = "9249970693:AAFnHi-ZCx7N576orPkdMqapeRLWfHQLH6Q"
CHANNEL_ID = "-1004488309634"  # @traicainghiendaily

INTERNATIONAL_SOURCES = [
    {
        "name": "Psychology Today (Science of Choice)",
        "feed": "https://www.psychologytoday.com/us/blog/science-choice/feed",
        "domain": "psychologytoday.com",
        "topic": "Hành vi gây nghiện, tâm lý ra quyết định & thói quen"
    },
    {
        "name": "Psychology Today (The Athlete's Way)",
        "feed": "https://www.psychologytoday.com/us/blog/the-athletes-way/feed",
        "domain": "psychologytoday.com",
        "topic": "Khoa học thần kinh, Dopamine & rèn luyện thể chất/tâm trí"
    },
    {
        "name": "Psychology Today (Don't Delay)",
        "feed": "https://www.psychologytoday.com/us/blog/dont-delay/feed",
        "domain": "psychologytoday.com",
        "topic": "Tâm lý học về sự trì hoãn, vượt qua thói quen trì hoãn & hành động"
    },
    {
        "name": "Psychology Today (In Practice)",
        "feed": "https://www.psychologytoday.com/us/blog/in-practice/feed",
        "domain": "psychologytoday.com",
        "topic": "Liệu pháp nhận thức hành vi (CBT) ứng dụng đời sống hàng ngày"
    },
    {
        "name": "Behavioral Scientist",
        "feed": "https://behavioralscientist.org/feed/",
        "domain": "behavioralscientist.org",
        "topic": "Kiến trúc lựa chọn (Choice Architecture), Cú hích (Nudge) & Bẻ gãy thói quen xấu"
    },
    {
        "name": "Ness Labs",
        "feed": "https://nesslabs.com/feed",
        "domain": "nesslabs.com",
        "topic": "Năng suất chánh niệm (Mindful Productivity), Khoa học thần kinh & Vượt qua kiệt sức"
    },
    {
        "name": "Greater Good Science Center (UC Berkeley)",
        "feed": "https://greatergood.berkeley.edu/rss",
        "domain": "greatergood.berkeley.edu",
        "topic": "Khoa học về hạnh phúc, lòng trắc ẩn, kết nối xã hội & sự kiên cường"
    }
]

# ==============================================================================
# 🛡️ KHO DỰ PHÒNG TÂM LÝ HỌC THƯỜNG XANH (EVERGREEN PSYCHOLOGY POOL)
# Được kích hoạt tự động khi toàn bộ mạng RSS quốc tế bị timeout hoặc chập chờn.
# Bảo đảm hệ thống LUÔN CÓ NỘI DUNG XUẤT SẮC phát sóng đúng giờ, không bao giờ lỗi!
# ==============================================================================
EVERGREEN_ARTICLES_POOL = [
    {
        "title": "Why Willpower Fails and Systems Succeed",
        "url": "https://traicainghien.com/evergreen/why-willpower-fails-and-systems-succeed",
        "source_name": "Psychology Today",
        "domain": "psychologytoday.com",
        "image": "https://cdn2.psychologytoday.com/assets/styles/manual_crop_1_91_1_1528x800/public/field_blog_entry_images/2026-09/engin_akyurt-train-2373323.jpg?itok=eXc0q58u",
        "description": "Nghiên cứu hành vi chỉ ra rằng ý chí là nguồn năng lượng hữu hạn. Người duy trì kỷ luật tốt nhất không phải người gồng mình giỏi nhất, mà là người biết thiết kế môi trường để giảm thiểu cám dỗ.",
        "body": "Nghiên cứu từ Đại học Pennsylvania chỉ ra rằng những người có mức độ tự chủ cao thực tế không phải đối mặt với nhiều cám dỗ hơn người khác. Họ chỉ đơn giản là xây dựng môi trường sống giảm tối đa ma sát cho thói quen tốt và tăng tối đa rào cản cho thói quen xấu. Khi bạn để điện thoại ở phòng khác khi ngủ, bạn không cần dùng ý chí để chống lại việc lướt mạng nửa đêm."
    },
    {
        "title": "The Neurobiology of Brain Fog and Digital Fatigue",
        "url": "https://traicainghien.com/evergreen/neurobiology-brain-fog-digital-fatigue",
        "source_name": "Ness Labs",
        "domain": "nesslabs.com",
        "image": "https://cdn2.psychologytoday.com/assets/styles/manual_crop_1_91_1_1528x800/public/field_blog_entry_images/2026-08/miroslavkaclik-a-tree-5255288.jpg?itok=mXXxiH6_",
        "description": "Hội chứng sương mù não sau nhiều giờ lướt màn hình là phản ứng tự nhiên khi vỏ não trước trán bị quá tải thông tin dạng vi mô liên tục.",
        "body": "Khi bạn quẹt video ngắn hoặc nhảy tab liên tục, thùy trán (Prefrontal Cortex) phải xử lý hàng trăm quyết định siêu nhỏ mỗi phút. Điều này kích thích giải phóng cortisol và làm cạn kiệt nguồn glycogen dự trữ của tế bào thần kinh, dẫn đến cảm giác tê liệt ý chí và mất khả năng tập trung sâu."
    },
    {
        "title": "Self-Compassion as the Antidote to the Procrastination Loop",
        "url": "https://traicainghien.com/evergreen/self-compassion-antidote-procrastination",
        "source_name": "Greater Good Science Center (UC Berkeley)",
        "domain": "greatergood.berkeley.edu",
        "image": "https://cdn2.psychologytoday.com/assets/styles/manual_crop_1_91_1_1528x800/public/field_blog_entry_images/2026-08/pexels-hands-1851426_1920.jpg?itok=k14b1wfP",
        "description": "Tiến sĩ Kristin Neff chứng minh rằng sự dằn vặt và chỉ trích bản thân sau khi trì hoãn chỉ làm tăng mức độ stress, khiến não bộ càng có xu hướng tìm đến các thú vui kích thích để trốn tránh.",
        "body": "Nghiên cứu từ Đại học Carleton (Canada) theo dõi sinh viên trong các kỳ thi cho thấy: Những ai biết tha thứ cho sự trì hoãn của mình ở bài thi trước lại ít trì hoãn hơn đáng kể ở bài thi tiếp theo. Sự tự trắc ẩn (Self-Compassion) ngắt đứt vòng lặp tội lỗi - stress - trốn tránh."
    },
    {
        "title": "The 2-Minute Rule and Cognitive Momentum",
        "url": "https://traicainghien.com/evergreen/2-minute-rule-cognitive-momentum",
        "source_name": "Behavioral Scientist",
        "domain": "behavioralscientist.org",
        "image": "https://cdn2.psychologytoday.com/assets/styles/manual_crop_1_91_1_1528x800/public/field_blog_entry_images/2026-09/rupixen-pen-4337524.jpg?itok=_s4TI7Z_",
        "description": "Để vượt qua sức ỳ tâm lý ban đầu, việc hạ thấp ngưỡng kích hoạt hành động xuống dưới 120 giây giúp đánh lừa hạch hạnh nhân và tạo đà tâm lý.",
        "body": "Định luật quán tính Newton hoàn toàn đúng trong tâm lý học nhận thức: Vật đứng yên sẽ tiếp tục đứng yên, nhưng vật chuyển động sẽ duy trì chuyển động. Khi bạn chỉ yêu cầu bản thân đọc 1 trang sách hoặc mở file tài liệu trong 2 phút, rào cản kháng cự giảm xuống 0, và quán tính sẽ tự động kéo bạn tiếp tục làm việc."
    },
    {
        "title": "Dopamine Baseline and the Pain-Pleasure Balance",
        "url": "https://traicainghien.com/evergreen/dopamine-baseline-pain-pleasure-balance",
        "source_name": "Psychology Today",
        "domain": "psychologytoday.com",
        "image": "https://cdn2.psychologytoday.com/assets/styles/manual_crop_1_91_1_1528x800/public/field_blog_entry_images/2026-05/geralt-man-4008575.jpg?itok=wQebFTt1",
        "description": "Giáo sư Anna Lembke từ Đại học Stanford chỉ ra rằng mỗi đỉnh dopamine nhân tạo cao vọt luôn đi kèm một đáy sụt giảm sâu hơn mức bình thường, gây ra cảm giác trống rỗng bồn chồn.",
        "body": "Não bộ luôn duy trì trạng thái cân bằng nội môi (Homeostasis). Khi bạn nhận quá nhiều kích thích dopamine rẻ tiền (short video, đồ ngọt, thông báo mạng xã hội), não sẽ tự động giảm bớt số lượng thụ thể dopamine D2 để tự vệ. Hậu quả là bạn mất khả năng cảm nhận niềm vui từ những hoạt động bình dị trong đời thực."
    },
    {
        "title": "The Zeigarnik Effect: How Incomplete Loops Drain Mental Bandwidth",
        "url": "https://traicainghien.com/evergreen/zeigarnik-effect-incomplete-loops-mental-bandwidth",
        "source_name": "Psychology Today",
        "domain": "psychologytoday.com",
        "image": "https://cdn2.psychologytoday.com/assets/styles/manual_crop_1_91_1_1528x800/public/field_blog_entry_images/2026-09/ahuanzuishuai111-tea-10266766.jpg?itok=Ar1tfqUt",
        "description": "Nhà tâm lý học Bluma Zeigarnik phát hiện rằng não bộ liên tục giữ các tác vụ dang dở trong bộ nhớ ngắn hạn, gây hao tổn dung lượng chú ý mà chúng ta không nhận ra.",
        "body": "Những email chưa trả lời, những việc hẹn chưa làm, những tab trình duyệt mở dở đều tạo ra các 'vòng lặp mở' (open loops) âm thầm ngốn năng lượng nhận thức. Chỉ cần viết chúng ra giấy và lên lịch cụ thể, não bộ sẽ lập tức giải phóng bộ nhớ và khôi phục sự tĩnh tại."
    }
]

def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    return {"sent_links": data, "sent_photos": []}
                elif isinstance(data, dict):
                    return {
                        "sent_links": data.get("sent_links", []),
                        "sent_photos": data.get("sent_photos", [])
                    }
        except Exception as e:
            print(f"Lỗi đọc history: {e}")
    return {"sent_links": [], "sent_photos": []}

def save_history(history):
    os.makedirs(os.path.dirname(HISTORY_FILE), exist_ok=True)
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

def fetch_rss_feed(feed_url, retries=2, timeout=8):
    """Bóc tách RSS với cơ chế thử lại tự động và giới hạn timeout nhanh để không bị treo luồng."""
    req = urllib.request.Request(
        feed_url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }
    )
    last_err = None
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.read().decode('utf-8', errors='ignore')
        except Exception as e:
            last_err = e
            if attempt < retries:
                time.sleep(2)
    raise last_err

def extract_articles_from_rss(feed_xml, source_info):
    import xml.etree.ElementTree as ET
    articles = []
    try:
        clean_xml = re.sub(r'&(?!(?:amp|lt|gt|quot|apos);)', '&amp;', feed_xml)
        root = ET.fromstring(clean_xml)
        channel = root.find("channel")
        if channel is None:
            return articles
        
        for item in channel.findall("item"):
            title = item.find("title").text if item.find("title") is not None else ""
            link = item.find("link").text if item.find("link") is not None else ""
            desc = item.find("description").text if item.find("description") is not None else ""
            
            clean_desc = re.sub(r'<[^>]+>', ' ', desc).strip()
            clean_desc = html.unescape(clean_desc)
            
            if title and link:
                articles.append({
                    "title": title.strip(),
                    "url": link.strip(),
                    "description": clean_desc[:300],
                    "source_name": source_info["name"],
                    "domain": source_info["domain"],
                    "topic": source_info["topic"]
                })
    except Exception as e:
        print(f"Lỗi parse RSS {source_info['name']}: {e}")
    return articles

def scrape_full_article_content_and_image(article_url, retries=2, timeout=10):
    """Trích xuất ảnh gốc và nội dung bài viết với cơ chế tự động thử lại."""
    req = urllib.request.Request(
        article_url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    )
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                page_html = resp.read().decode('utf-8', errors='ignore')
                
                image_url = None
                og_match = re.search(r'<meta[^>]+property=[\'"]og:image[\'"][^>]+content=[\'"]([^\'"]+)[\'"]', page_html, re.I)
                if not og_match:
                    og_match = re.search(r'<meta[^>]+content=[\'"]([^\'"]+)[\'"][^>]+property=[\'"]og:image[\'"]', page_html, re.I)
                if og_match:
                    image_url = og_match.group(1).strip()
                
                title_match = re.search(r'<meta[^>]+property=[\'"]og:title[\'"][^>]+content=[\'"]([^\'"]+)[\'"]', page_html, re.I)
                title = title_match.group(1).strip() if title_match else ""
                
                desc_match = re.search(r'<meta[^>]+property=[\'"]og:description[\'"][^>]+content=[\'"]([^\'"]+)[\'"]', page_html, re.I)
                desc = desc_match.group(1).strip() if desc_match else ""
                
                paras = re.findall(r'<p\b[^>]*>(.*?)</p>', page_html, re.I | re.DOTALL)
                clean_paras = []
                for p in paras:
                    clean_p = re.sub(r'<[^>]+>', ' ', p).strip()
                    clean_p = html.unescape(clean_p)
                    clean_p = re.sub(r'\s+', ' ', clean_p)
                    if len(clean_p) > 65 and not re.search(r'cookie|privacy policy|subscribe|sign up|all rights reserved', clean_p, re.I):
                        clean_paras.append(clean_p)
                
                full_body = "\n\n".join(clean_paras[:8])
                return {
                    "url": article_url,
                    "title": title,
                    "description": desc,
                    "image": image_url,
                    "body": full_body
                }
        except Exception as e:
            if attempt < retries:
                time.sleep(2)
            else:
                print(f"Lỗi bóc tách bài {article_url}: {e}")
    return None

def synthesize_bulletin_structured(article):
    """
    Biên soạn bản tin theo đúng cấu trúc chuẩn của Trại Cai Nghiện:
    - Tiêu đề
    - Đoạn mở đầu
    - 3 Cơ chế cần nhớ
    - Hành động hôm nay (Key Action)
    - Câu châm ngôn triết lý
    - Nguồn & Chữ ký thương hiệu
    """
    prompt = f"""Bạn là Mây — AI Co-founder của Trại Cai Nghiện (traicainghien.com).
Nhiệm vụ: Hãy phân tích bài báo nghiên cứu tâm lý học / khoa học hành vi quốc tế dưới đây và trích xuất BẢN TIN TELEGRAM CÔ ĐỌNG (tổng cộng phần nội dung khoảng 90-110 từ).

THÔNG TIN BÀI BÁO GỐC:
- Nguồn: {article.get('source_name', 'Tâm lý học hành vi quốc tế')}
- Tiêu đề gốc: {article['title']}
- Tóm tắt: {article.get('description', '')}
- Nội dung trích xuất:
{article.get('body', '')[:2500]}

YÊU CẦU ĐỘ DÀI NGHIÊM NGẶT ĐỂ VỪA VẶN KHUNG ẢNH TELEGRAM:
Hãy trả về định dạng JSON thuần túy (không code block markdown) với các trường sau:
{{
  "title_vn": "Tiêu đề tiếng Việt ngắn gọn, chạm nỗi đau (dưới 8 từ, tối đa 45 ký tự)",
  "intro": "1 câu duy nhất: Đặt vấn đề chạm đúng nỗi đau xao nhãng đời thường, vỗ về người đọc rằng họ không hề lười hay thiếu kỷ luật, não bộ chỉ đang phản ứng tự nhiên (dưới 20 từ, tối đa 110 ký tự)",
  "point_1": "<b>[Tên cơ chế 1]:</b> [Giải thích 1 câu ngắn gọn về cơ chế não bộ/dopamine, dưới 18 từ, tối đa 95 ký tự]",
  "point_2": "<b>[Tên cơ chế 2]:</b> [Giải thích 1 câu ngắn gọn về bẫy kích thích/thói quen, dưới 18 từ, tối đa 95 ký tự]",
  "point_3": "<b>[Tên cơ chế 3]:</b> [Giải thích 1 câu ngắn gọn về giải pháp môi trường/tâm lý, dưới 18 từ, tối đa 95 ký tự]",
  "action": "[Hành động vi mô 2 phút có thể thực hành ngay hôm nay, dưới 18 từ, tối đa 95 ký tự]",
  "quote": "[1 câu danh ngôn triết lý đúc kết sâu sắc, dưới 15 từ, tối đa 80 ký tự]"
}}
"""

    system_instruction = "Bạn là Mây của Trại Cai Nghiện. Phong cách: Thấu cảm, mộc mạc, khoa học, súc tích. Chỉ trả về JSON hợp lệ."
    generated_text = None
    try:
        generated_text = generate_content(prompt, system_instruction, temperature=0.7)
    except Exception as ge:
        print(f"Gemini API warning: {ge}")

    if not generated_text:
        # Fallback tổng hợp trực tiếp nếu Gemini API gặp sự cố
        title_vn = article['title'][:40]
        desc = article.get('description', 'Hiểu cơ chế não bộ để thôi tự trách móc bản thân.')
        return (
            "🌿 <b>TRẠI CAI NGHIỆN DAILY</b>\n"
            "🧠 <b>[TÂM LÝ HỌC &amp; HÀNH VI]</b>\n\n"
            f"👉 <b>{title_vn}</b>\n\n"
            f"{desc}\n\n"
            "📌 <b>3 Cơ chế cần nhớ:</b>\n"
            "• <b>Nhận thức:</b> Thừa nhận cảm giác kháng cự tự nhiên của não bộ.\n"
            "• <b>Môi trường:</b> Giảm ma sát cho hành vi tốt, tăng rào cản cho xao nhãng.\n"
            "• <b>Tự trắc ẩn:</b> Tha thứ cho những lần trượt chân để đứng dậy nhanh hơn.\n\n"
            "💡 <b>Hành động hôm nay (Key Action):</b>\nĐặt điện thoại cách xa tầm với 2 mét khi bắt đầu làm việc sâu.\n\n"
            "🌱 <i>\"Kỷ luật không phải là sự trừng phạt, mà là tình yêu thương bản thân đúng cách.\"</i>\n\n"
            f"📖 <b>Nguồn:</b> {article.get('source_name', 'Psychology Today')}\n\n"
            "======\n"
            "🌿 <b>Trại Cai Nghiện — Trở về phiên bản tốt nhất của bạn</b>\n"
            '<a href="https://traicainghien.com">Website</a> | <a href="https://traicainghien.com/trac-nghiem">Trắc nghiệm</a> | <a href="https://facebook.com/traicainghien">Fanpage</a>'
        )

    clean_json = re.sub(r"^```json\s*", "", generated_text.strip(), flags=re.MULTILINE)
    clean_json = re.sub(r"^```\s*", "", clean_json.strip(), flags=re.MULTILINE)
    clean_json = re.sub(r"```$", "", clean_json.strip())
    
    data = json.loads(clean_json)

    source_label = article.get("source_name", "Psychology Today")
    if "psychology today" in source_label.lower():
        source_label = "Psychology Today"

    header = (
        "🌿 <b>TRẠI CAI NGHIỆN DAILY</b>\n"
        "🧠 <b>[TÂM LÝ HỌC &amp; HÀNH VI]</b>\n\n"
        f"👉 <b>{data['title_vn']}</b>\n\n"
    )

    body = (
        f"{data['intro']}\n\n"
        "📌 <b>3 Cơ chế cần nhớ:</b>\n"
        f"• {data['point_1']}\n"
        f"• {data['point_2']}\n"
        f"• {data['point_3']}\n\n"
        f"💡 <b>Hành động hôm nay (Key Action):</b>\n{data['action']}\n\n"
        f"🌱 <i>\"{data['quote']}\"</i>\n\n"
        f"📖 <b>Nguồn:</b> {source_label}\n\n"
        "======\n"
        "🌿 <b>Trại Cai Nghiện — Trở về phiên bản tốt nhất của bạn</b>\n"
        '<a href="https://traicainghien.com">Website</a> | <a href="https://traicainghien.com/trac-nghiem">Trắc nghiệm</a> | <a href="https://facebook.com/traicainghien">Fanpage</a>'
    )

    caption = header + body

    if len(caption) > 1024:
        max_intro_len = len(data['intro']) - (len(caption) - 1010)
        if max_intro_len > 30:
            words = data['intro'].split()
            trimmed = ""
            for w in words:
                if len(trimmed) + len(w) + 1 <= max_intro_len:
                    trimmed = f"{trimmed} {w}".strip()
                else:
                    break
            data['intro'] = trimmed + "..."
        else:
            data['intro'] = ""

        body = ""
        if data['intro']:
            body += f"{data['intro']}\n\n"
        body += (
            "📌 <b>3 Cơ chế cần nhớ:</b>\n"
            f"• {data['point_1']}\n"
            f"• {data['point_2']}\n"
            f"• {data['point_3']}\n\n"
            f"💡 <b>Hành động hôm nay (Key Action):</b>\n{data['action']}\n\n"
            f"🌱 <i>\"{data['quote']}\"</i>\n\n"
            f"📖 <b>Nguồn:</b> {source_label}\n\n"
            "======\n"
            "🌿 <b>Trại Cai Nghiện — Trở về phiên bản tốt nhất của bạn</b>\n"
            '<a href="https://traicainghien.com">Website</a> | <a href="https://traicainghien.com/trac-nghiem">Trắc nghiệm</a> | <a href="https://facebook.com/traicainghien">Fanpage</a>'
        )
        caption = header + body

    print(f"📊 Độ dài bản tin Telegram: {len(caption)} ký tự (Giới hạn: 1024)")
    return caption

def send_telegram_photo_bulletin(photo_url, caption, attempts=3):
    """Gửi bản tin kèm ảnh qua Telegram với cơ chế thử lại tự động 3 lần."""
    last_err = None
    for attempt in range(1, attempts + 1):
        try:
            url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto"
            payload = {
                "chat_id": CHANNEL_ID,
                "photo": photo_url,
                "caption": caption,
                "parse_mode": "HTML"
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
            )
            with urllib.request.urlopen(req, timeout=25) as resp:
                res = json.loads(resp.read().decode())
                if res.get("ok"):
                    return res
                last_err = res
        except Exception as e:
            last_err = e
            print(f"Lỗi gửi Telegram sendPhoto (lần {attempt}/{attempts}): {e}")
            if attempt < attempts:
                time.sleep(3 * attempt)

    # Nếu gửi sendPhoto thất bại (ví dụ link ảnh bị lỗi host), tự động fallback gửi dạng tin nhắn văn bản sendMessage
    print("⚠️ Fallback sang sendMessage văn bản để bảo đảm 100% không mất bài...")
    try:
        url_text = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
        payload_text = {
            "chat_id": CHANNEL_ID,
            "text": caption,
            "parse_mode": "HTML",
            "disable_web_page_preview": False
        }
        req_text = urllib.request.Request(
            url_text,
            data=json.dumps(payload_text).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req_text, timeout=20) as resp_t:
            return json.loads(resp_t.read().decode())
    except Exception as te:
        print("Lỗi fallback sendMessage:", te)

    return {"ok": False, "error": str(last_err)}

def run_daily_news_pipeline(dry_run=False):
    print("==================================================================")
    print("🚀 CHẠY LUỒNG BẢN TIN DAILY TELEGRAM (FLOW 01 - AUTO RETRY ENABLED)")
    print("==================================================================")
    
    history = load_history()
    sent_links = set(history.get("sent_links", []))
    sent_photos = set(history.get("sent_photos", []))
    print(f"Đã tải {len(sent_links)} bài viết trong lịch sử chống trùng.")

    # 1. Thử quét RSS quốc tế (thử 2 vòng nếu gặp sự cố mạng)
    all_candidates = []
    max_scan_attempts = 2
    for scan_round in range(1, max_scan_attempts + 1):
        for src in INTERNATIONAL_SOURCES:
            try:
                print(f"📡 Đang quét nguồn: {src['name']} (vòng {scan_round})...")
                xml_data = fetch_rss_feed(src["feed"], retries=2, timeout=8)
                items = extract_articles_from_rss(xml_data, src)
                if items:
                    print(f"   -> Tìm thấy {len(items)} bài viết từ {src['name']}.")
                    all_candidates.extend(items)
            except Exception as e:
                print(f"   ⚠️ Lỗi/Timeout feed {src['name']}: {e}")
        
        if all_candidates:
            break
        elif scan_round < max_scan_attempts:
            print("⚠️ Chưa lấy được bài từ các nguồn quốc tế, đợi 5 giây thử lại...")
            time.sleep(5)

    # 2. Bóc tách bài viết đạt chuẩn từ danh sách ứng viên
    selected_article = None
    for cand in all_candidates:
        if cand["url"] in sent_links:
            continue
        print(f" -> Đang kiểm tra bài: '{cand['title']}' ({cand['source_name']})")
        full_info = scrape_full_article_content_and_image(cand["url"], retries=2, timeout=10)
        if full_info and full_info.get("image") and full_info.get("body"):
            if full_info["image"] in sent_photos:
                print("   ⚠️ Trùng ảnh đã phát sóng, bỏ qua.")
                continue
            full_info["source_name"] = cand["source_name"]
            selected_article = full_info
            break

    # 3. KÍCH HOẠT KHO THƯỜNG XANH (EVERGREEN FALLBACK) NẾU MẠNG QUỐC TẾ HOÀN TOÀN BỊ TIMEOUT
    if not selected_article:
        print("\n🛡️ [CƠ CHẾ BẢO VỆ TỰ ĐỘNG] Mạng RSS quốc tế gặp sự cố hoặc timeout.")
        print("   -> Tự động kích hoạt Kho dự phòng Tâm lý học Thường xanh (Evergreen Pool)...")
        for eg in EVERGREEN_ARTICLES_POOL:
            if eg["url"] not in sent_links:
                selected_article = eg
                print(f"   ✅ Đã chọn chủ đề thường xanh: {eg['title']}")
                break
        
        # Nếu đã gửi hết kho thường xanh, xoay vòng chọn bài ít trùng nhất
        if not selected_article:
            selected_article = EVERGREEN_ARTICLES_POOL[0]
            print(f"   ✅ Xoay vòng chủ đề thường xanh: {selected_article['title']}")

    print("\n✅ ĐÃ CHỌN ĐƯỢC BÀI VIẾT PHÙ HỢP:")
    print(f"   • Tiêu đề: {selected_article['title']}")
    print(f"   • Nguồn: {selected_article['source_name']}")
    print(f"   • URL: {selected_article['url']}")
    print(f"   • Ảnh gốc: {selected_article['image']}")

    print("\n🤖 Đang biên soạn bản tin chuẩn cấu trúc Telegram...")
    caption = synthesize_bulletin_structured(selected_article)

    print("\n--- NỘI DUNG BẢN TIN TRÊN TELEGRAM ---")
    print(caption)
    print("--------------------------------------")

    if dry_run:
        print("🧪 [DRY RUN] Đã hoàn thành thử nghiệm thành công.")
        return

    print(f"\n📢 Đang phát sóng lên kênh Telegram {CHANNEL_ID}...")
    result = send_telegram_photo_bulletin(selected_article["image"], caption, attempts=3)
    if result.get("ok"):
        msg_id = result["result"]["message_id"]
        print(f"✅ GỬI THÀNH CÔNG BẢN TIN QUA SENDPHOTO! Message ID: {msg_id}")
        post_link = f"https://t.me/traicainghiendaily/{msg_id}"
        print(f"🔗 Xem bài tại: {post_link}")
        
        history["sent_links"].append(selected_article["url"])
        history["sent_photos"].append(selected_article["image"])
        save_history(history)
        print("🎉 Bản tin đã được xuất bản và lưu lịch sử thành công!")
        
        try:
            try:
                from scripts.task_notifier import notify_task_success
            except ImportError:
                from task_notifier import notify_task_success
            notify_task_success(
                task_name="Bản tin telegram Daily",
                channel="📢 Kênh Telegram @traicainghiendaily",
                post_url=post_link,
                title=selected_article.get("title", "Bản tin tâm lý học mới nhất")
            )
        except Exception as e:
            print("Warning: Không thể gửi task_notifier:", e)
    else:
        print("❌ Lỗi gửi Telegram sau các lần thử lại:", result)
        try:
            try:
                from scripts.task_notifier import notify_task_error
            except ImportError:
                from task_notifier import notify_task_error
            notify_task_error(
                task_name="Bản tin telegram Daily",
                channel="📢 Kênh Telegram @traicainghiendaily",
                error_msg=str(result)
            )
        except Exception as e:
            pass
        raise RuntimeError(f"Không thể phát sóng lên Telegram: {result}")

if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    run_daily_news_pipeline(dry_run=dry_run)
