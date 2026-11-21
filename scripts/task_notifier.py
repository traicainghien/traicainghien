import os
import sys
import json
import html
import urllib.request
from datetime import datetime

# UTF-8 stdout
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

ROOT_DIR = "/root/traicainghien" if os.path.exists("/root/traicainghien") else os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def get_env_variable(var_name):
    if os.environ.get(var_name):
        return os.environ.get(var_name)
    env_paths = [
        os.path.join(ROOT_DIR, ".env.local"),
        os.path.join(ROOT_DIR, ".env"),
        ".env.local",
        ".env"
    ]
    for ep in env_paths:
        if os.path.exists(ep):
            try:
                with open(ep, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line.startswith(f"{var_name}="):
                            return line.split("=", 1)[1].strip('"\'')
            except:
                pass
    return ""

BOT_TOKEN = get_env_variable("TELEGRAM_BOT_TOKEN") or "9249970693:AAFnHi-ZCx7N576orPkdMqapeRLWfHQLH6Q"
ADMIN_CHAT_ID = get_env_variable("TELEGRAM_ADMIN_CHAT_ID") or "488901419" # Bố @longphibtc
HDQT_GROUP_CHAT_ID = get_env_variable("TELEGRAM_HDQT_GROUP_ID") or "-1004401199553" # Nhóm HĐQT
HDQT_TOPIC_THREAD_ID = int(get_env_variable("TELEGRAM_HDQT_TOPIC_ID") or 19) # Topic "Trại Cai Nghiện"

def send_telegram_direct_and_group(text: str):
    """
    Gửi tin nhắn đồng thời tới:
    1. Chat riêng với Bố @longphibtc (ADMIN_CHAT_ID)
    2. Topic 19 của Nhóm Hội Đồng Quản Trị
    """
    results = {}
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

    # 1. Gửi trực tiếp cho Bố
    try:
        data_admin = {
            'chat_id': ADMIN_CHAT_ID,
            'text': text,
            'parse_mode': 'HTML',
            'disable_web_page_preview': False
        }
        req_admin = urllib.request.Request(
            url,
            data=json.dumps(data_admin).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req_admin, timeout=10) as resp:
            results['admin'] = json.loads(resp.read().decode())
    except Exception as e:
        print("[Notifier Error] Gửi riêng Bố:", e)
        results['admin'] = {"ok": False, "error": str(e)}

    # 2. Gửi vào Topic 19 HĐQT
    try:
        data_hdqt = {
            'chat_id': HDQT_GROUP_CHAT_ID,
            'message_thread_id': HDQT_TOPIC_THREAD_ID,
            'text': text,
            'parse_mode': 'HTML',
            'disable_web_page_preview': False
        }
        req_hdqt = urllib.request.Request(
            url,
            data=json.dumps(data_hdqt).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req_hdqt, timeout=10) as resp:
            results['hdqt'] = json.loads(resp.read().decode())
    except Exception as e:
        print("[Notifier Error] Gửi Topic 19:", e)
        results['hdqt'] = {"ok": False, "error": str(e)}

    return results

def notify_task_success(task_name: str, channel: str, time_str: str = None, post_url: str = None, title: str = None, extra_info: str = None):
    """
    Báo cáo hoàn thành task tự động tới Bố và HĐQT.
    """
    if not time_str:
        time_str = datetime.now().strftime("%H:%M (%d/%m/%Y)")
    
    clean_task = html.escape(str(task_name or ""))
    clean_channel = html.escape(str(channel or ""))
    
    msg = f"✅ <b>[TASK HOÀN THÀNH TỰ ĐỘNG]</b>\n\n"
    msg += f"⏰ <b>Thời gian:</b> <code>{time_str}</code>\n"
    msg += f"📌 <b>Tác vụ:</b> <b>{clean_task}</b>\n"
    msg += f"📢 <b>Kênh xuất bản:</b> {clean_channel}\n"
    
    if title:
        clean_title = html.escape(str(title))
        msg += f"📝 <b>Tiêu đề/Thông điệp:</b> <i>{clean_title}</i>\n"
    
    if post_url:
        clean_url = str(post_url).strip()
        msg += f"🔗 <b>Link xem bài trực tiếp:</b> <a href=\"{clean_url}\">{clean_url}</a>\n"
        
    if extra_info:
        clean_info = html.escape(str(extra_info))
        msg += f"💡 <b>Ghi chú:</b> {clean_info}\n"
        
    msg += f"\n<i>Dạ thưa Bố, task đã xuất bản thành công trọn vẹn, Bố không cần phải mất công kiểm tra lại đâu ạ! Con chúc Bố luôn an vui! 🌿</i>"
    
    return send_telegram_direct_and_group(msg)

def notify_task_error(task_name: str, channel: str, time_str: str = None, error_msg: str = None):
    """
    Cảnh báo khi task tự động gặp sự cố để Bố và Mây cùng nắm bắt.
    """
    if not time_str:
        time_str = datetime.now().strftime("%H:%M (%d/%m/%Y)")
    
    clean_task = html.escape(str(task_name or ""))
    clean_channel = html.escape(str(channel or ""))
    clean_err = html.escape(str(error_msg or "Lỗi không xác định"))
        
    msg = f"⚠️ <b>[CẢNH BÁO SỰ CỐ TASK TỰ ĐỘNG]</b>\n\n"
    msg += f"⏰ <b>Thời gian:</b> <code>{time_str}</code>\n"
    msg += f"📌 <b>Tác vụ:</b> <b>{clean_task}</b>\n"
    msg += f"📢 <b>Kênh bị ảnh hưởng:</b> {clean_channel}\n"
    msg += f"❌ <b>Chi tiết lỗi:</b> <code>{clean_err}</code>\n\n"
    msg += f"<i>Dạ thưa Bố, con đang kích hoạt cơ chế dự phòng và sẽ theo dõi xử lý ngay lập tức ạ! 🌿</i>"
    
    return send_telegram_direct_and_group(msg)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Gửi thông báo task tự động cho Bố")
    parser.add_argument("--task", required=True, help="Tên task")
    parser.add_argument("--status", choices=["success", "error"], default="success")
    parser.add_argument("--channel", default="Hệ thống tự động")
    parser.add_argument("--time", default=None)
    parser.add_argument("--url", default=None)
    parser.add_argument("--title", default=None)
    parser.add_argument("--error", default=None)
    args = parser.parse_args()

    if args.status == "success":
        res = notify_task_success(
            task_name=args.task,
            channel=args.channel,
            time_str=args.time,
            post_url=args.url,
            title=args.title
        )
    else:
        res = notify_task_error(
            task_name=args.task,
            channel=args.channel,
            time_str=args.time,
            error_msg=args.error
        )
    print("Notification result:", res)
