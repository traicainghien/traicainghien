"""
Bedtime Reminder Publisher (Trại Cai Nghiện)
Khung giờ: 22:00 Đêm hàng ngày (Cron: 0 22 * * *)
Phát sóng:
1. Kênh Telegram @traicainghiendaily
2. Fanpage Trại Cai Nghiện
3. Thông báo hoàn thành tới Bố & HĐQT Topic 19
"""

import os
import sys
import json
import random
import urllib.request
import requests
from datetime import datetime

# UTF-8 stdout
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

ROOT_DIR = "/root/traicainghien" if os.path.exists("/root/traicainghien") else os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.join(ROOT_DIR, "scripts"))

BOT_TOKEN = "9249970693:AAFnHi-ZCx7N576orPkdMqapeRLWfHQLH6Q"
CHANNEL_ID = "-1004488309634" # @traicainghiendaily
PAGE_ID = "1232949796570940" # Fanpage Trại Cai Nghiện

FB_PAGE_TOKEN = os.environ.get("FB_PAGE_ACCESS_TOKEN") or os.environ.get("FB_PAGE_TOKEN")
if not FB_PAGE_TOKEN:
    for env_file in [os.path.join(ROOT_DIR, ".env.local"), os.path.join(ROOT_DIR, ".env")]:
        if os.path.exists(env_file):
            try:
                with open(env_file, "r", encoding="utf-8") as f:
                    for line in f:
                        if line.startswith("FB_PAGE_ACCESS_TOKEN=") or line.startswith("FB_PAGE_TOKEN="):
                            FB_PAGE_TOKEN = line.split("=", 1)[1].strip().strip('"\'')
                            break
            except:
                pass
        if FB_PAGE_TOKEN:
            break

if not FB_PAGE_TOKEN:
    FB_PAGE_TOKEN = "EAAYJubTf5xMBS6EMJZBkxFwB7IWqtiH7DKMFEeeBIakLUjaiMcG2CBWF9iYHcF6tMiGrF1O7x7zdmmgGgnZAfZCHbe2yzUvHnArSD6VRcmqnWTwLu7TuEyoOgNK89jawQSvjSZC2wJ0vBkyeh26jcMGG5ZBn8Q0jIER77vhZBXVbxAkeZAJ6hfjY6V03ZBSrLrwysl4ZCTH86"

BEDTIME_QUOTES = [
    "Cả ngày bạn đã cố gắng nhiều rồi. Đêm nay, hãy trả lại sự bình yên trọn vẹn cho chiếc giường của bạn.",
    "Ngủ sớm không phải là bỏ lỡ niềm vui, mà là đối xử dịu dàng với cơ thể và tâm trí của chính mình.",
    "Chiếc giường là nơi để phục hồi năng lượng và đón nhận sự bình an, không phải nơi để các thuật toán mạng xã hội rút cạn sinh lực.",
    "Mọi âu lo chưa giải quyết hôm nay sẽ sáng suốt hơn sau một giấc ngủ sâu.",
    "Hãy cho não bộ của bạn được tắt nguồn và nạp lại đầy đủ năng lượng cho một ngày mai tươi mới.",
    "Giấc ngủ sâu là liều thuốc chữa lành tự nhiên và kỳ diệu nhất mà tạo hóa ban tặng cho bạn.",
    "Tắt điện thoại, nhắm mắt lại và buông bỏ tất cả. Bạn xứng đáng có một giấc ngủ an lành."
]

def generate_bedtime_caption(random_quote):
    caption = (
        f"🌙 <b>ĐẾN GIỜ ĐI NGỦ RỒI BẠN ƠI, TẮT ĐIỆN THOẠI VÀ ĐI NGỦ THÔI!</b>\n\n"
        f"Đây nên là bài viết cuối cùng bạn đọc trên màn hình điện thoại đêm nay.\n\n"
        f"Cả ngày hôm nay bạn đã cố gắng nhiều rồi. Hãy úp máy xuống, cắm sạc cách xa giường 2m và thả mình vào chiếc giường êm ái nhé.\n\n"
        f"Ngủ sớm là món quà dịu dàng nhất bạn dành cho tâm trí và cơ thể sau một ngày dài dốc sức.\n\n"
        f"🌱 <i>\"{random_quote}\"</i>\n\n"
        f"Chúc bạn ngủ một giấc thật sâu và thức dậy với tâm trí tươi mới! 🌿\n\n"
        f"======\n"
        f"🌿 <b>Trại Cai Nghiện — Trở về phiên bản tốt nhất của bạn</b>\n"
        f"<a href=\"https://traicainghien.com\">Website</a> | <a href=\"https://traicainghien.com/trac-nghiem\">Trắc nghiệm Dopamine</a> | <a href=\"https://traicainghien.com/bai-viet\">Kho bài viết</a>"
    )
    return caption

def send_telegram_bedtime(caption):
    # Dùng photo Telegram ID đã được lưu hoặc URL
    photo_id = "AgACAgUAAyEGAAMBC4YrggADCmrvGi2ckcDSZVGzS-9f5mNYsAv3AAJlFGsbCv95V59Xahf162_GAQADAgADeQADPQQ"
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto"
    data = {
        "chat_id": CHANNEL_ID,
        "photo": photo_id,
        "caption": caption,
        "parse_mode": "HTML"
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())

def send_facebook_bedtime(random_quote):
    fb_text = (
        f"🌙 ĐẾN GIỜ ĐI NGỦ RỒI BẠN ƠI, TẮT ĐIỆN THOẠI VÀ ĐI NGỦ THÔI!\n\n"
        f"Đây nên là bài viết cuối cùng bạn đọc trên màn hình điện thoại đêm nay.\n\n"
        f"Cả ngày hôm nay bạn đã cố gắng nhiều rồi. Hãy úp máy xuống, cắm sạc cách xa giường 2m và thả mình vào chiếc giường êm ái nhé.\n\n"
        f"Ngủ sớm là món quà dịu dàng nhất bạn dành cho tâm trí và cơ thể sau một ngày dài dốc sức.\n\n"
        f"🌱 \"{random_quote}\"\n\n"
        f"Chúc bạn ngủ một giấc thật sâu và thức dậy với tâm trí tươi mới! 🌿\n\n"
        f"======\n"
        f"🌿 TRẠI CAI NGHIỆN — Trở về phiên bản tốt nhất của bạn\n"
        f"🌐 Website: https://traicainghien.com"
    )
    url = f"https://graph.facebook.com/v20.0/{PAGE_ID}/feed"
    payload = {
        "message": fb_text,
        "access_token": FB_PAGE_TOKEN
    }
    r = requests.post(url, data=payload, timeout=20)
    return r.json()

def run_bedtime_flow():
    print("🌙 Bắt đầu phát sóng Lời Nhắc Đi Ngủ Dịu Dàng (22h00)...")
    quote = random.choice(BEDTIME_QUOTES)
    caption = generate_bedtime_caption(quote)

    tele_res = None
    tele_link = None
    try:
        tele_res = send_telegram_bedtime(caption)
        if tele_res.get("ok"):
            msg_id = tele_res["result"]["message_id"]
            tele_link = f"https://t.me/traicainghiendaily/{msg_id}"
            print(f"✅ Đã gửi lời nhắc lên Telegram Daily: {tele_link}")
    except Exception as e:
        print("Telegram bedtime error:", e)

    fb_res = None
    fb_link = None
    try:
        fb_res = send_facebook_bedtime(quote)
        if fb_res.get("id"):
            post_id = fb_res["id"]
            fb_link = f"https://www.facebook.com/{PAGE_ID}/posts/{post_id}"
            print(f"✅ Đã đăng lời nhắc lên Fanpage Trại Cai Nghiện: {fb_link}")
    except Exception as e:
        print("Facebook bedtime error:", e)

    # Thông báo hoàn tất tới Bố & Topic 19
    try:
        from task_notifier import notify_task_success
        post_urls = []
        if tele_link:
            post_urls.append(tele_link)
        if fb_link:
            post_urls.append(fb_link)
        main_url = " | ".join(post_urls) if post_urls else "https://t.me/traicainghiendaily"
        
        notify_task_success(
            task_name="Lời Nhắc Đi Ngủ Dịu Dàng (22h00)",
            channel="🛏️ Kênh Telegram Daily & Fanpage Trại Cai Nghiện",
            post_url=main_url,
            title=f"\"{quote}\"",
            extra_info="Đã nhắc nhở độc giả úp điện thoại, sạc xa giường và ngủ sâu phục hồi năng lượng."
        )
        print("📢 Đã gửi thông báo hoàn thành task tới Bố và HĐQT Topic 19!")
    except Exception as e:
        print("Task notifier error:", e)

    return {
        "status": "success",
        "quote": quote,
        "telegram": tele_res,
        "facebook": fb_res
    }

if __name__ == "__main__":
    run_bedtime_flow()
