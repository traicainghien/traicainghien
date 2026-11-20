"""
TCN Article Teaser Publisher (Trại Cai Nghiện - Facebook 20h30 Tối Hàng Ngày)
Khung giờ: 20:30 Tối hàng ngày (Cron: 30 20 * * *)
Nhiệm vụ: Viết bài dẫn hấp dẫn (Long-form Facebook Teaser) theo đúng phong cách Mây
          được Bố phê duyệt trong ảnh mẫu, đăng lên Fanpage Trại Cai Nghiện
          kèm ảnh Zen Watercolor của bài viết và dẫn người đọc vào website traicainghien.com.
"""

import os
import sys
import json
import re
import time
from datetime import datetime
import requests

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

ROOT_DIR = "/root/traicainghien" if os.path.exists("/root/traicainghien") else os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.join(ROOT_DIR, "scripts"))

from gemini_client import generate_content

PAGE_ID = "1232949796570940"
ACCESS_TOKEN = os.environ.get("FB_PAGE_ACCESS_TOKEN") or os.environ.get("FB_PAGE_TOKEN")

if not ACCESS_TOKEN:
    # Read from .env.local or .env
    for env_file in [os.path.join(ROOT_DIR, ".env.local"), os.path.join(ROOT_DIR, ".env")]:
        if os.path.exists(env_file):
            with open(env_file, "r", encoding="utf-8") as f:
                for line in f:
                    if line.startswith("FB_PAGE_ACCESS_TOKEN=") or line.startswith("FB_PAGE_TOKEN="):
                        ACCESS_TOKEN = line.split("=", 1)[1].strip().strip('"\'')
                        break
        if ACCESS_TOKEN:
            break

# Fallback token
if not ACCESS_TOKEN:
    ACCESS_TOKEN = "EAAgoZBziOULEBS2m26aZCCjri7654NsjaAomxRUvwIdg8fDGALUu9tRbZBhI2kXQrmVqocDjCne3WeRaOZApZB4fcgcb5Iqo2iMSsBtOjjZBZAFjdCaO9ng3VpcgqvCWEh5LZCZBE6JTBzvU3iGx9eDkptX1ZBQZAl32nH7N3TsF3I4fOUTZC4MqGI4yyh0j1OAhA5CwuoVt6xe4oM8fSpwdoSpB"

HISTORY_FILE = os.path.join(ROOT_DIR, "scripts", "tcn_fb_teaser_history.json")
ARTICLES_TS_FILE = os.path.join(ROOT_DIR, "src", "data", "articles.ts")

# Telegram HĐQT Topic 19
TELEGRAM_BOT_TOKEN = "7604381831:AAHfWkO8T-2vJb8hUfZ17uYn_Qp4N5oH6w8"
TELEGRAM_HDQT_GROUP_ID = "-1004401199553"
TELEGRAM_HDQT_TOPIC_ID = 19


def notify_telegram(message: str):
    """Gửi thông báo tới Telegram HĐQT Topic 19."""
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_HDQT_GROUP_ID,
            "message_thread_id": TELEGRAM_HDQT_TOPIC_ID,
            "text": message,
            "parse_mode": "HTML"
        }
        requests.post(url, json=payload, timeout=10)
    except Exception as e:
        print(f"[Telegram Notify Warning] {e}")


def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"posted_slugs": [], "posts": []}


def save_history(history):
    os.makedirs(os.path.dirname(HISTORY_FILE), exist_ok=True)
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)


def get_target_article():
    """
    Trích xuất bài viết từ src/data/articles.ts:
    Ưu tiên 1: Bài viết được đăng hôm nay (15h chiều).
    Ưu tiên 2: Bài viết mới nhất chưa từng đăng teaser lên Facebook.
    """
    if not os.path.exists(ARTICLES_TS_FILE):
        raise FileNotFoundError(f"Không tìm thấy file {ARTICLES_TS_FILE}")

    with open(ARTICLES_TS_FILE, "r", encoding="utf-8") as f:
        text = f.read()

    blocks = re.split(r'\n\s*\{\s*\n\s*"slug":', text)
    articles = []
    for idx, b in enumerate(blocks[1:], 1):
        b = '"slug":' + b
        slug = re.search(r'"slug":\s*"([^"]+)"', b)
        title = re.search(r'"title":\s*"([^"]+)"', b)
        excerpt = re.search(r'"excerpt":\s*"([^"]+)"', b)
        thumbnail = re.search(r'"thumbnail":\s*"([^"]+)"', b)
        date = re.search(r'"date":\s*"([^"]+)"', b)
        content = re.search(r'"content":\s*"(.*?)(?:"\s*,\s*"sources"|"\s*\}\s*,|\n\s*\}\s*\])', b, re.DOTALL)
        if not content:
            content = re.search(r'"content":\s*`([\s\S]*?)`', b)

        articles.append({
            "slug": slug.group(1) if slug else "",
            "title": title.group(1) if title else "",
            "excerpt": excerpt.group(1) if excerpt else "",
            "thumbnail": thumbnail.group(1) if thumbnail else "",
            "date": date.group(1) if date else "",
            "content": (content.group(1)[:3500] if content else "")
        })

    if not articles:
        raise ValueError("Không trích xuất được bài viết nào từ articles.ts")

    history = load_history()
    posted_slugs = set(history.get("posted_slugs", []))

    today_str = datetime.now().strftime("%d/%m/%Y")

    # 1. Tìm bài hôm nay chưa đăng
    for art in articles:
        if art["date"] == today_str and art["slug"] not in posted_slugs:
            print(f"🎯 Chọn bài viết mới xuất bản hôm nay: {art['title']} ({art['slug']})")
            return art

    # 2. Tìm bài mới nhất chưa đăng
    for art in articles:
        if art["slug"] not in posted_slugs:
            print(f"🎯 Chọn bài viết chưa đăng teaser gần nhất: {art['title']} ({art['slug']})")
            return art

    # 3. Nếu đã đăng hết, lấy bài đầu tiên mới nhất
    print(f"🔄 Đã đăng hết các bài, chọn bài đầu tiên mới nhất: {articles[0]['title']}")
    return articles[0]


def craft_facebook_teaser(article: dict) -> str:
    """
    Sử dụng Gemini AI để tạo bài viết Facebook Teaser chuẩn 100% văn phong Mây
    theo ảnh mẫu Bố gửi:
    - Tiêu đề HOOK IN HOA
    - Kể chuyện thấu cảm bóc trần nỗi đau đời thường
    - Khẳng định giải phóng tâm trí (BẠN KHÔNG HỀ...)
    - Cơ chế sinh học thần kinh
    - Câu hỏi tò mò (Curiosity Gap)
    - CTA link website bài viết
    - Chữ ký Trại Cai Nghiện
    """
    system_instruction = (
        "Bạn là Mây — AI Co-founder của Trại Cai Nghiện. "
        "Phong cách của bạn: Thấu cảm, bao dung, không phán xét, ngôn từ đời thường nhưng trí tuệ khoa học hành vi sâu sắc. "
        "Nhiệm vụ của bạn: Viết một bài Facebook Teaser dài dẫn dắt người đọc vào bài viết chuyên sâu trên website traicainghien.com."
    )

    user_prompt = f"""
Hãy viết một bài đăng Facebook Teaser dài cho Fanpage Trại Cai Nghiện dựa trên bài viết chuyên sâu sau:

Tiêu đề bài viết: {article['title']}
Mô tả tóm tắt: {article['excerpt']}
Nội dung bài viết:
\"\"\"{article['content'][:3000]}\"\"\"

BẮT BUỘC TUÂN THỦ CHUẨN 100% CẤU TRÚC SAU (Tương tự ảnh mẫu):
1. DÒNG ĐẦU TIÊN (HOOK): Một câu tiêu đề IN HOA giật mình, chạm đúng nỗi đau xao nhãng/trì hoãn/gồng ép của người trẻ (Ví dụ: ĐÃ BAO NHIÊU LẦN BẠN TỰ NÓI VỚI MÌNH: "TỪ NGÀY MAI MÌNH SẼ THAY ĐỔI HOÀN TOÀN!"? hoặc ĐÃ BAO GIỜ BẠN RƠI VÀO CẢM GIÁC NÀY...)
2. ĐOẠN DẪN THẤU CẢM: 2-3 đoạn ngắn kể lại chi tiết trải nghiệm thực tế đời thường (đặt mục tiêu hăng say, rồi một ngày mệt mỏi tắt báo thức ngủ tiếp, lướt video ngắn xuyên đêm, cảm giác tội lỗi và bất lực lại bóp nghẹt lồng ngực: "Hình như mình sinh ra là một kẻ vô kỷ luật...").
3. TUYÊN NGÔN THỨC TỈNH (IN HOA): "Nếu bạn đã từng rơi vào vòng lặp đau khổ đó, hôm nay Mây muốn chia sẻ với bạn một sự thật giải phóng tâm trí:
BẠN KHÔNG HỀ THẤT BẠI VÌ BẠN YẾU ĐUỐI — BẠN THẤT BẠI VÌ BẠN ĐANG DÙNG SAI CÔNG CỤ ĐỂ THAY ĐỔI BẢN THÂN." (hoặc câu tương đương mang tính giải phóng tội lỗi phù hợp với chủ đề bài).
4. GIẢI MÃ KHOA HỌC HÀNH VI: Giải thích cơ chế sinh học thần kinh (Hạch hạnh nhân Amygdala, Thụ thể Dopamine, Thùy trán Prefrontal Cortex, hoặc Bảo tồn năng lượng).
5. TRIẾT LÝ & PHƯƠNG PHÁP: Giới thiệu giải pháp hành vi (Kaizen 1%, Atomic Habits, Deep Work, v.v.).
6. CURIOSITY GAP: Đặt 2 câu hỏi bỏ lửng khơi gợi tò mò cực độ về bài học trong bài viết.
7. LỜI MỜI & CTA LINK:
"Mời bạn cùng Mây bước vào bài viết phân tích chuyên sâu tối nay trên website Trại Cai Nghiện để khám phá bí mật...:

👉 Đọc bài viết đầy đủ tại đây:
https://traicainghien.com/bai-viet/{article['slug']}

======
🌿 TRẠI CAI NGHIỆN — Trở về phiên bản tốt nhất của bạn
🌐 Website: https://traicainghien.com
📱 Kênh Telegram Daily: https://t.me/traicainghiendaily"

Yêu cầu: Viết tự nhiên, sâu sắc, không dùng văn mẫu sáo rỗng, không dùng emoji lố lăng, chia dòng thoáng đãng, dễ đọc trên mobile.
Chỉ trả về nội dung bài viết hoàn chỉnh, không kèm chú thích hay code block markdown.
"""

    resp = generate_content(user_prompt, system_instruction=system_instruction, temperature=0.7)
    if not resp or len(resp.strip()) < 200:
        raise ValueError("Gemini AI không trả về nội dung bài viết hợp lệ")

    clean_text = resp.strip()
    clean_text = re.sub(r"^```markdown\s*", "", clean_text, flags=re.MULTILINE)
    clean_text = re.sub(r"^```\s*", "", clean_text, flags=re.MULTILINE)
    clean_text = re.sub(r"```$", "", clean_text)

    # Đảm bảo có link bài viết và chữ ký
    if f"https://traicainghien.com/bai-viet/{article['slug']}" not in clean_text:
        clean_text += f"\n\n👉 Đọc bài viết đầy đủ tại đây:\nhttps://traicainghien.com/bai-viet/{article['slug']}"

    if "🌿 TRẠI CAI NGHIỆN — Trở về phiên bản tốt nhất của bạn" not in clean_text:
        clean_text += (
            "\n\n======\n"
            "🌿 TRẠI CAI NGHIỆN — Trở về phiên bản tốt nhất của bạn\n"
            "🌐 Website: https://traicainghien.com\n"
            "📱 Kênh Telegram Daily: https://t.me/traicainghiendaily"
        )

    return clean_text.strip()


def publish_teaser():
    """Quy trình xuất bản bài đăng teaser 20h30 lên Fanpage Trại Cai Nghiện."""
    print("=" * 60)
    print("🚀 BẮT ĐẦU LUỒNG XUẤT BẢN FACEBOOK TEASER 20:30 (FANPAGE TRẠI CAI NGHIỆN)")
    print("=" * 60)

    article = get_target_article()
    slug = article["slug"]
    thumbnail_rel = article["thumbnail"].lstrip("/")
    photo_path = os.path.join(ROOT_DIR, "public", thumbnail_rel)

    if not os.path.exists(photo_path):
        # Fallback thử các đường dẫn khác
        photo_path = os.path.join(ROOT_DIR, thumbnail_rel)

    print(f"🖼️ Ảnh đính kèm: {photo_path} (Tồn tại: {os.path.exists(photo_path)})")
    if not os.path.exists(photo_path):
        raise FileNotFoundError(f"Không tìm thấy file ảnh thumbnail: {photo_path}")

    print("✍️ Đang biên soạn bài viết Facebook Teaser cùng Gemini AI...")
    caption = craft_facebook_teaser(article)
    print("\n--- BẢN XEM TRƯỚC BÀI ĐĂNG FACEBOOK (20:30) ---")
    print(caption[:500] + "\n...\n" + caption[-300:])
    print("------------------------------------------------\n")

    # Đăng bài dạng Rich Link Preview lên Fanpage Feed
    feed_url = f"https://graph.facebook.com/v20.0/{PAGE_ID}/feed"
    article_url = f"https://traicainghien.com/bai-viet/{slug}"
    print(f"📤 Đang đăng lên Facebook Feed (Page ID: {PAGE_ID})...")

    data = {
        "message": caption,
        "link": article_url,
        "access_token": ACCESS_TOKEN
    }
    res = requests.post(feed_url, data=data, timeout=40)
    res_data = res.json()

    if "id" not in res_data:
        raise RuntimeError(f"Lỗi đăng bài lên Facebook Feed: {res_data}")

    published_post_id = res_data["id"]
    print(f"🎉 ĐÃ ĐĂNG BÀI THÀNH CÔNG! Post ID: {published_post_id}")

    # 1. Tự động like bài viết
    like_url = f"https://graph.facebook.com/v20.0/{published_post_id}/likes"
    try:
        requests.post(like_url, data={"access_token": ACCESS_TOKEN}, timeout=15)
        print("👍 Đã thả Like bài viết tự động.")
    except Exception as e:
        print("Like warning:", e)

    # 2. Ghim bình luận đầu tiên dẫn link Telegram
    comment_url = f"https://graph.facebook.com/v20.0/{published_post_id}/comments"
    first_comment_text = (
        "🌿 Cùng tham gia Kênh Telegram Daily của Trại Cai Nghiện để nhận các bản tin tâm lý học và bài tập chuyển hóa mỗi ngày nhé bạn:\n"
        "👉 https://t.me/traicainghiendaily"
    )
    try:
        c_res = requests.post(
            comment_url,
            data={"message": first_comment_text, "access_token": ACCESS_TOKEN},
            timeout=20
        )
        print("💬 Đã ghim First Comment:", c_res.json().get("id"))
    except Exception as e:
        print("Comment warning:", e)

    # 3. Lấy permalink
    post_short_id = published_post_id.split("_")[-1]
    permalink = f"https://www.facebook.com/{PAGE_ID}/posts/{post_short_id}"
    try:
        link_url = f"https://graph.facebook.com/v20.0/{published_post_id}?fields=permalink_url&access_token={ACCESS_TOKEN}"
        l_res = requests.get(link_url, timeout=10)
        permalink = l_res.json().get("permalink_url") or permalink
    except Exception:
        pass

    print(f"🔗 DIRECT POST LINK: {permalink}")

    # 4. Cập nhật lịch sử chống trùng bài
    history = load_history()
    history.setdefault("posted_slugs", []).append(slug)
    history.setdefault("posts", []).append({
        "slug": slug,
        "title": article["title"],
        "post_id": published_post_id,
        "permalink": permalink,
        "posted_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    save_history(history)
    print("💾 Đã cập nhật tcn_fb_teaser_history.json!")

    # 5. Báo cáo tới Telegram HĐQT Topic 19 & Bố
    try:
        from task_notifier import notify_task_success
        notify_task_success(
            task_name="Dẫn Đọc Web Fanpage TCN (20h30 Tối)",
            channel="📘 Fanpage Facebook Trại Cai Nghiện",
            post_url=permalink,
            title=article['title'],
            extra_info=f"Đã tự động Like & ghim bình luận dẫn traffic về web: https://traicainghien.com/bai-viet/{slug}"
        )
    except Exception as e:
        print("[Telegram Notify Warning]", e)

    return {
        "status": "success",
        "post_id": published_post_id,
        "permalink": permalink,
        "slug": slug,
        "title": article["title"]
    }


if __name__ == "__main__":
    publish_teaser()
