"""
TCN Behavior Publisher (Trại Cai Nghiện - Facebook Khoa Học Hành Vi Automation)
Schedule: 10:10 AM Daily (Cron: 10 10 * * *)
Design: Model A (1080x1080, Zen Cream #FAF7F2, Green #2D4A34, Totem Logo Footer)
Strict Rules:
- ZERO content duplication (Strict anti-duplication memory via tcn_behavior_history.json)
- Dynamic discovery of new website articles from src/data/articles.ts
- Sequential deep comments (Neuroscience mechanism, behavioral trap, micro-action 1%, CRO CTA link)
- Real-time reporting to Telegram HĐQT Topic 19
"""

import os
import sys
import json
import time
import re
import requests
from PIL import Image, ImageDraw, ImageFont

# Set encoding
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

ROOT_DIR = "/root/traicainghien" if os.path.exists("/root/traicainghien") else os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.join(ROOT_DIR, "scripts"))

from gemini_client import generate_content

PAGE_ID = "1232949796570940"
ACCESS_TOKEN = os.environ.get("FB_PAGE_TOKEN") or "EAAgoZBziOULEBS2m26aZCCjri7654NsjaAomxRUvwIdg8fDGALUu9tRbZBhI2kXQrmVqocDjCne3WeRaOZApZB4fcgcb5Iqo2iMSsBtOjjZBZAFjdCaO9ng3VpcgqvCWEh5LZCZBE6JTBzvU3iGx9eDkptX1ZBQZAl32nH7N3TsF3I4fOUTZC4MqGI4yyh0j1OAhA5CwuoVt6xe4oM8fSpwdoSpB"

HISTORY_FILE = os.path.join(ROOT_DIR, "scripts", "tcn_behavior_history.json")
ARTICLES_TS_FILE = os.path.join(ROOT_DIR, "src", "data", "articles.ts")

# Telegram config
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN") or "7604381831:AAHfWkO8T-2vJb8hUfZ17uYn_Qp4N5oH6w8" # fallback check
TELEGRAM_HDQT_GROUP_ID = os.environ.get("TELEGRAM_HDQT_GROUP_ID") or "-1004401199553"
TELEGRAM_HDQT_TOPIC_ID = int(os.environ.get("TELEGRAM_HDQT_TOPIC_ID") or 19)


def notify_telegram(message: str):
    """Send notification to Telegram HĐQT Topic 19."""
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
    if not bot_token:
        # try loading from .env
        env_path = os.path.join(ROOT_DIR, ".env")
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.startswith("TELEGRAM_BOT_TOKEN="):
                        bot_token = line.split("=", 1)[1].strip().strip('"\'')
                        break
    if not bot_token:
        print("[Telegram] No bot token configured, skipping Telegram notification.")
        return

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_HDQT_GROUP_ID,
        "message_thread_id": TELEGRAM_HDQT_TOPIC_ID,
        "text": message,
        "parse_mode": "Markdown",
        "disable_web_page_preview": False
    }
    try:
        requests.post(url, json=payload, timeout=10)
    except Exception as e:
        print(f"[Telegram] Error sending message: {e}")


def load_history() -> dict:
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[History] Error reading history: {e}")
    return {"posted_slugs": {}}


def save_history(history: dict):
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)


def parse_articles():
    """Parse articles from articles.ts."""
    if not os.path.exists(ARTICLES_TS_FILE):
        print(f"[Articles] File not found: {ARTICLES_TS_FILE}")
        return []

    with open(ARTICLES_TS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    articles = []
    # Find all object blocks in rawArticles
    matches = re.finditer(r'{\s*"slug":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"excerpt":\s*"([^"]+)",.*?author":\s*"([^"]+)",\s*"content":\s*"(.*?)"\s*,\s*"sources"', content, re.DOTALL)
    for m in matches:
        slug = m.group(1)
        title = m.group(2)
        excerpt = m.group(3)
        author = m.group(4)
        body = m.group(5).encode('utf-8').decode('unicode_escape', errors='ignore')
        articles.append({
            "slug": slug,
            "title": title,
            "excerpt": excerpt,
            "content": body
        })

    # Fallback simpler regex if body matching differs
    if not articles:
        slug_matches = re.findall(r'"slug":\s*"([^"]+)"', content)
        title_matches = re.findall(r'"title":\s*"([^"]+)"', content)
        excerpt_matches = re.findall(r'"excerpt":\s*"([^"]+)"', content)
        for i in range(min(len(slug_matches), len(title_matches))):
            articles.append({
                "slug": slug_matches[i],
                "title": title_matches[i],
                "excerpt": excerpt_matches[i] if i < len(excerpt_matches) else "",
                "content": ""
            })

    return articles


def render_brand_card_a(lines: list, output_path: str):
    """Renders Model A card: Zen Cream #FAF7F2, Green #2D4A34, Totem Logo Footer."""
    width, height = 1080, 1080
    bg_color = "#FAF7F2"
    text_color = "#2D4A34"

    img = Image.new("RGB", (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Find bold font
    font_paths = [
        os.path.join(ROOT_DIR, "assets", "fonts", "segoeuib.ttf"),
        r"C:\Windows\Fonts\segoeuib.ttf",
        "/usr/share/fonts/google-noto-vf/NotoSans[wght].ttf",
        os.path.join(ROOT_DIR, "assets", "fonts", "BeVietnamPro-Medium.ttf")
    ]
    main_font_path = None
    for p in font_paths:
        if os.path.exists(p):
            main_font_path = p
            break

    if not main_font_path:
        main_font = ImageFont.load_default()
        footer_font = main_font
        sub_font = main_font
    else:
        main_font = ImageFont.truetype(main_font_path, 56)
        footer_font = ImageFont.truetype(main_font_path, 26)
        sub_font = ImageFont.truetype(main_font_path, 20)

    # Layout text
    line_heights = []
    line_widths = []
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=main_font)
        line_widths.append(bbox[2] - bbox[0])
        line_heights.append(bbox[3] - bbox[1])

    line_spacing = int(56 * 0.4)
    total_height = sum(line_heights) + line_spacing * (len(lines) - 1)

    y_center = (height - total_height) // 2 - 40
    for i, line in enumerate(lines):
        w = line_widths[i]
        x = (width - w) // 2
        draw.text((x, y_center), line, font=main_font, fill=text_color)
        y_center += line_heights[i] + line_spacing

    # Footer Totem
    totem_path = os.path.join(ROOT_DIR, "public", "images", "logo-totem.png")
    footer_y = height - 130
    brand_name = "Trại Cai Nghiện"
    handle = "@traicainghien"

    if os.path.exists(totem_path):
        try:
            totem_img = Image.open(totem_path).convert("RGBA")
            totem_size = 54
            totem_img = totem_img.resize((totem_size, totem_size), Image.Resampling.LANCZOS)

            bbox_b = draw.textbbox((0, 0), brand_name, font=footer_font)
            w_b = bbox_b[2] - bbox_b[0]

            total_f_w = totem_size + 14 + w_b
            start_x = (width - total_f_w) // 2

            img.paste(totem_img, (start_x, footer_y), totem_img)
            draw.text((start_x + totem_size + 14, footer_y - 2), brand_name, font=footer_font, fill="#2D312E")
            draw.text((start_x + totem_size + 14, footer_y + 28), handle, font=sub_font, fill="#6B726E")
        except Exception as e:
            print(f"[Card] Totem paste error: {e}")
    else:
        bbox_b = draw.textbbox((0, 0), brand_name, font=footer_font)
        w_b = bbox_b[2] - bbox_b[0]
        draw.text(((width - w_b) // 2, footer_y), brand_name, font=footer_font, fill=text_color)

    img.save(output_path, quality=95)
    print(f"[Card] Rendered successfully to {output_path}")
    return output_path


def generate_post_content(article: dict) -> dict:
    """Uses Gemini AI to generate viral Hook and 4 sequential comments."""
    prompt = f"""Bạn là Mây - AI Co-founder & Trưởng ban nội dung của Trại Cai Nghiện.
Dựa vào bài viết chuyên sâu trên website sau đây:
- Tiêu đề: {article['title']}
- Trích đoạn: {article['excerpt']}
- Nội dung tóm tắt: {article['content'][:1500] if article.get('content') else article['excerpt']}
- Đường dẫn đọc bài: https://www.traicainghien.com/bai-viet/{article['slug']}

Yêu cầu định dạng theo đúng phong cách viral của Page 'Khoa Học Hành Vi':
1. hook_lines: Danh sách 2 đến 3 dòng chữ ngắn gọn, gây tò mò tột độ (Curiosity Gap) hoặc nghịch lý hành vi để in lên ảnh (ví dụ: 'Vì sao bộ não khiến bạn kiệt sức / dù cả ngày chưa hoàn thành nổi / một việc gì ra hồn?'). Tối đa 8-10 từ mỗi dòng.
2. post_caption: 1 câu kêu gọi tò mò đọc bình luận (ví dụ: '👇 Xem phân tích cơ chế sinh học thần kinh và cách giải thoát ở phần bình luận bên dưới:').
3. comment_1: Tiêu đề in hoa + Cơ chế sinh học thần kinh (neuroscience / dopamine receptors / prefrontal cortex / ego depletion...) giải thích sâu sắc nguyên nhân gốc rễ.
4. comment_2: Bẫy tâm lý hành vi đời thực (vì sao chúng ta mắc kẹt, thấu cảm, không phán xét).
5. comment_3: 3 bước hành động vi mô 1% làm được ngay (Kaizen / Atomic Habits / ma sát môi trường).
6. comment_4: CTA điều hướng đọc bài đầy đủ kèm link https://www.traicainghien.com/bai-viet/{article['slug']}

Trả về DUY NHẤT một khối JSON hợp lệ theo cấu trúc sau (không kèm markdown ngoài khối json):
{{
  "hook_lines": ["dòng 1", "dòng 2", "dòng 3"],
  "post_caption": "câu caption",
  "comment_1": "nội dung cmt 1",
  "comment_2": "nội dung cmt 2",
  "comment_3": "nội dung cmt 3",
  "comment_4": "nội dung cmt 4"
}}
"""
    raw_response = generate_content(prompt)
    if not raw_response:
        raise ValueError("Empty response from Gemini AI pool")

    # Clean json
    cleaned = raw_response.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    data = json.loads(cleaned)
    return data


def publish_to_facebook(image_path: str, caption: str, comments: list) -> dict:
    """Uploads photo and posts sequential comments to Facebook Fanpage."""
    url = f"https://graph.facebook.com/v20.0/{PAGE_ID}/photos"
    with open(image_path, "rb") as f:
        files = {"source": f}
        data = {
            "caption": caption,
            "access_token": ACCESS_TOKEN
        }
        res = requests.post(url, files=files, data=data, timeout=30)

    res_json = res.json()
    if "post_id" not in res_json and "id" not in res_json:
        raise RuntimeError(f"FB photo upload failed: {res_json}")

    post_id = res_json.get("post_id") or res_json.get("id")
    print(f"[Facebook] Photo published! Post ID: {post_id}")

    # Auto-like post immediately
    like_target_id = post_id if "_" in str(post_id) else f"{PAGE_ID}_{post_id}"
    try:
        like_res = requests.post(f"https://graph.facebook.com/v20.0/{like_target_id}/likes", data={"access_token": ACCESS_TOKEN}, timeout=15)
        print(f"[Facebook] Auto-liked post {like_target_id} successfully: {like_res.status_code}")
    except Exception as e:
        print(f"[Facebook] Auto-like warning: {e}")

    # Post comments sequentially
    for i, c_text in enumerate(comments):
        c_url = f"https://graph.facebook.com/v20.0/{post_id}/comments"
        c_res = requests.post(c_url, data={"message": c_text, "access_token": ACCESS_TOKEN}, timeout=20).json()
        print(f"[Facebook] Comment {i+1} published: {c_res.get('id')}")
        time.sleep(2)

    # Fetch permalink
    p_url = f"https://graph.facebook.com/v20.0/{post_id}?fields=permalink_url&access_token={ACCESS_TOKEN}"
    p_res = requests.get(p_url, timeout=15).json()
    permalink = p_res.get("permalink_url", f"https://www.facebook.com/{post_id}")

    return {
        "post_id": post_id,
        "permalink": permalink
    }


def main():
    print(f"=== [TCN Behavior Publisher] Starting run at {time.strftime('%Y-%m-%d %H:%M:%S')} ===")
    history = load_history()
    posted_slugs = history.get("posted_slugs", {})

    articles = parse_articles()
    print(f"[Articles] Total website articles in database: {len(articles)}")

    # 1. STRICT ANTI-DUPLICATION FILTER
    unposted_articles = [a for a in articles if a["slug"] not in posted_slugs]
    print(f"[Articles] Unposted articles available: {len(unposted_articles)}")

    if not unposted_articles:
        msg = "🛑 **[Báo cáo Trại Cai Nghiện - 10h10]**\nToàn bộ kho bài viết trên website đã được xuất bản 100% lên Facebook Fanpage!\nTheo lệnh của Bố, hệ thống TUYỆT ĐỐI KHÔNG lặp lại bài cũ và đang tạm dừng chờ bài viết mới từ website."
        print(msg)
        notify_telegram(msg)
        return

    # 2. Pick next unposted article
    target_article = unposted_articles[0]
    print(f"[Target] Selected article: [{target_article['slug']}] {target_article['title']}")

    # 3. Generate AI Content
    print("[AI] Generating Hook and 4 comments with Gemini...")
    content_data = generate_post_content(target_article)
    hook_lines = content_data.get("hook_lines", [target_article["title"]])
    caption = content_data.get("post_caption", "👇 Xem phân tích chi tiết ở phần bình luận bên dưới:")
    comments = [
        content_data.get("comment_1", ""),
        content_data.get("comment_2", ""),
        content_data.get("comment_3", ""),
        content_data.get("comment_4", "")
    ]
    comments = [c for c in comments if c.strip()]

    # 4. Render Model A Card
    output_card_path = os.path.join(ROOT_DIR, "scripts", "current_behavior_card.jpg")
    render_brand_card_a(hook_lines, output_card_path)

    # 5. Publish to Facebook Fanpage
    print("[Facebook] Publishing to Fanpage Trại Cai Nghiện...")
    fb_result = publish_to_facebook(output_card_path, caption, comments)
    print(f"[Facebook] SUCCESS! Permalink: {fb_result['permalink']}")

    # 6. Save to History (Permanent Anti-Duplication Record)
    posted_slugs[target_article["slug"]] = {
        "title": target_article["title"],
        "hook": " / ".join(hook_lines),
        "post_id": fb_result["post_id"],
        "permalink": fb_result["permalink"],
        "posted_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    history["posted_slugs"] = posted_slugs
    save_history(history)
    print("[History] Recorded to history file successfully.")

    # 7. Notify Telegram HĐQT Topic 19 & Bố
    try:
        from task_notifier import notify_task_success
        notify_task_success(
            task_name="Khoa Học Hành Vi Facebook (10h10 Sáng)",
            channel="🧠 Fanpage Facebook Trại Cai Nghiện",
            post_url=fb_result['permalink'],
            title=target_article['title'],
            extra_info=f"Hook: {' / '.join(hook_lines)} | Web: https://www.traicainghien.com/bai-viet/{target_article['slug']}"
        )
        print("[Telegram] Notification sent to Bố and HĐQT Topic 19.")
    except Exception as e:
        print("[Telegram] Task notifier warning:", e)


if __name__ == "__main__":
    main()
