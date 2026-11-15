import os
import sys
import json
import re
import html
import datetime
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
CHANNEL_ID = "-1004488309634" # @traicainghiendaily

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

def fetch_rss_feed(feed_url):
    req = urllib.request.Request(
        feed_url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode('utf-8', errors='ignore')

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

def scrape_full_article_content_and_image(article_url):
    req = urllib.request.Request(
        article_url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
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
    generated_text = generate_content(prompt, system_instruction, temperature=0.7)
    if not generated_text:
        raise ValueError("Gemini returned empty response")

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

    # An toàn tuyệt đối: Kiểm tra độ dài caption
    if len(caption) > 1024:
        # Nếu vượt quá 1024, rút gọn nhẹ nhàng intro theo từ hoàn chỉnh, giữ 100% action, quote, signature
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

def send_telegram_photo_bulletin(photo_url, caption):
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
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())

def run_daily_news_pipeline(dry_run=False):
    print("==================================================================")
    print("🚀 CHẠY LUỒNG BẢN TIN DAILY TELEGRAM 08:30 (FLOW 01)")
    print("==================================================================")
    
    history = load_history()
    sent_links = set(history.get("sent_links", []))
    sent_photos = set(history.get("sent_photos", []))
    print(f"Đã tải {len(sent_links)} bài viết trong lịch sử chống trùng.")

    all_candidates = []
    for src in INTERNATIONAL_SOURCES:
        try:
            print(f"📡 Đang quét nguồn: {src['name']}...")
            xml_data = fetch_rss_feed(src["feed"])
            items = extract_articles_from_rss(xml_data, src)
            print(f"   -> Tìm thấy {len(items)} bài viết từ {src['name']}.")
            all_candidates.extend(items)
        except Exception as e:
            print(f"Lỗi fetch feed {src['name']}: {e}")

    selected_article = None
    for cand in all_candidates:
        if cand["url"] in sent_links:
            continue
        print(f" -> Đang kiểm tra bài: '{cand['title']}' ({cand['source_name']})")
        full_info = scrape_full_article_content_and_image(cand["url"])
        if full_info and full_info["image"] and full_info["body"]:
            if full_info["image"] in sent_photos:
                print("   ⚠️ Trùng ảnh đã phát sóng, bỏ qua.")
                continue
            full_info["source_name"] = cand["source_name"]
            selected_article = full_info
            break

    if not selected_article:
        print("⚠️ Không tìm thấy bài mới chưa từng gửi, lấy bài đầu tiên...")
        for cand in all_candidates:
            full_info = scrape_full_article_content_and_image(cand["url"])
            if full_info and full_info["image"]:
                full_info["source_name"] = cand["source_name"]
                selected_article = full_info
                break

    if not selected_article:
        raise ValueError("Không thể bóc tách bất kỳ bài báo nào!")

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
        print("🧪 [DRY RUN] Đã hoàn thành thử nghiệm.")
        return

    print(f"\n📢 Đang phát sóng lên kênh Telegram {CHANNEL_ID}...")
    result = send_telegram_photo_bulletin(selected_article["image"], caption)
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
            from scripts.task_notifier import notify_task_success
            notify_task_success(
                task_name="Bản tin telegram Daily",
                channel="📢 Kênh Telegram @traicainghiendaily",
                post_url=post_link,
                title=selected_article.get("title", "Bản tin tâm lý học mới nhất")
            )
        except Exception as e:
            print("Warning: Không thể gửi task_notifier:", e)
    else:
        print("❌ Lỗi gửi Telegram:", result)
        try:
            from scripts.task_notifier import notify_task_error
            notify_task_error(
                task_name="Bản tin telegram Daily",
                channel="📢 Kênh Telegram @traicainghiendaily",
                error_msg=str(result)
            )
        except Exception as e:
            pass

if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    run_daily_news_pipeline(dry_run=dry_run)
