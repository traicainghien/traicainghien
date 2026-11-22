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
LOGS_DIR = os.path.join(ROOT_DIR, "logs")

# LỆNH CỦA BỐ (22/11/2026): TẮT HOÀN TOÀN TIN NHẮN TELEGRAM RIÊNG LẺ CHO TỪNG TASK
# CHỈ GIỮ LẠI BÁO CÁO TỔNG HỢP ĐẦU NGÀY (06:10) VÀ CUỐI NGÀY (22:10) QUA telegram_reporter.py
ENABLE_TELEGRAM_REALTIME = False

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
ADMIN_CHAT_ID = get_env_variable("TELEGRAM_ADMIN_CHAT_ID") or "488901419"
HDQT_GROUP_CHAT_ID = get_env_variable("TELEGRAM_HDQT_GROUP_ID") or "-1004401199553"
HDQT_TOPIC_THREAD_ID = int(get_env_variable("TELEGRAM_HDQT_TOPIC_ID") or 19)
MOD_SECRET = get_env_variable("MODERATION_SECRET") or "tcn-mod-secret-2026"
SITE_URL = get_env_variable("NEXT_PUBLIC_SITE_URL") or "https://www.traicainghien.com"

# Đường dẫn thư mục Hermes trên máy cá nhân của Bố (nếu có trên môi trường local)
HERMES_DIR = r"C:\Users\MrFine\Documents\Hermes"

def ensure_logs_dir():
    try:
        if not os.path.exists(LOGS_DIR):
            os.makedirs(LOGS_DIR, exist_ok=True)
    except Exception as e:
        print("[Logger] Không thể tạo thư mục logs:", e)

def record_task_log(task_name: str, status: str, channel: str, time_str: str = None, post_url: str = None, title: str = None, error_msg: str = None, extra_info: str = None):
    """
    Ghi nhật ký thực thi task vào file log chung để Hermes và hệ thống đọc.
    """
    ensure_logs_dir()
    now = datetime.now()
    if not time_str:
        time_str = now.strftime("%H:%M (%d/%m/%Y)")
    
    today_str = now.strftime("%Y-%m-%d")

    entry = {
        "id": f"task-{int(now.timestamp())}",
        "timestamp": now.isoformat(),
        "date": today_str,
        "time_str": time_str,
        "task": task_name,
        "channel": channel,
        "status": status,
        "title": title or "",
        "url": post_url or "",
        "error": error_msg or "",
        "extra_info": extra_info or ""
    }

    # 1. Ghi vào file log tổng hợp trên VPS/máy chủ: logs/n8n_tasks_execution.json
    all_logs_file = os.path.join(LOGS_DIR, "n8n_tasks_execution.json")
    all_logs = []
    if os.path.exists(all_logs_file):
        try:
            with open(all_logs_file, "r", encoding="utf-8") as f:
                all_logs = json.load(f)
        except Exception:
            all_logs = []
    
    all_logs.insert(0, entry)
    all_logs = all_logs[:300] # Giữ 300 task gần nhất
    try:
        with open(all_logs_file, "w", encoding="utf-8") as f:
            json.dump(all_logs, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print("[Logger Error] Không thể ghi all_logs_file:", e)

    # 2. Ghi vào file tóm tắt ngày hôm nay: logs/tasks_today.json
    today_tasks = [t for t in all_logs if t.get("date") == today_str]
    errors = [t for t in today_tasks if t.get("status") == "error"]
    successes = [t for t in today_tasks if t.get("status") == "success"]
    
    today_summary = {
        "date": today_str,
        "last_updated": now.isoformat(),
        "total": len(today_tasks),
        "success_count": len(successes),
        "error_count": len(errors),
        "has_errors": len(errors) > 0,
        "status_summary": f"Có {len(errors)} task lỗi!" if errors else f"Tất cả {len(today_tasks)} task đều thành công!",
        "tasks": today_tasks
    }

    today_file = os.path.join(LOGS_DIR, "tasks_today.json")
    try:
        with open(today_file, "w", encoding="utf-8") as f:
            json.dump(today_summary, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print("[Logger Error] Không thể ghi today_file:", e)

    # 3. Tạo file Markdown trực quan: logs/TASKS_TODAY.md
    md_content = f"# 📊 BÁO CÁO CÁC TASK N8N TRẠI CAI NGHIỆN • {today_str}\n\n"
    md_content += f"> **Trạng thái:** {today_summary['status_summary']}\n"
    md_content += f"> **Tổng số task:** {today_summary['total']} (✅ {today_summary['success_count']} thành công, ❌ {today_summary['error_count']} lỗi)\n\n"
    md_content += "| Thời gian | Tác vụ | Kênh | Trạng thái | Chi tiết / Lỗi |\n"
    md_content += "| :--- | :--- | :--- | :--- | :--- |\n"
    for t in today_tasks:
        st = "✅ Thành công" if t["status"] == "success" else "❌ Lỗi"
        detail = f"Lỗi: {t['error']}" if t.get("error") else (f"Tiêu đề: {t['title']}" if t.get("title") else "-")
        md_content += f"| {t['time_str']} | {t['task']} | {t['channel']} | {st} | {detail} |\n"
    
    md_file = os.path.join(LOGS_DIR, "TASKS_TODAY.md")
    try:
        with open(md_file, "w", encoding="utf-8") as f:
            f.write(md_content)
    except Exception as e:
        print("[Logger Error] Không thể ghi md_file:", e)

    # 4. Nếu đang chạy trên máy local có thư mục Hermes, ghi thẳng vào Hermes workspace
    if os.path.exists(HERMES_DIR):
        try:
            hermes_log = os.path.join(HERMES_DIR, "tcn_tasks_log.json")
            with open(hermes_log, "w", encoding="utf-8") as f:
                json.dump(today_summary, f, ensure_ascii=False, indent=2)
            hermes_md = os.path.join(HERMES_DIR, "TASKS_TODAY.md")
            with open(hermes_md, "w", encoding="utf-8") as f:
                f.write(md_content)
        except Exception as e:
            print("[Logger Error] Ghi vào Hermes folder:", e)

    # 5. Đồng bộ nhanh về Website API (để Hermes có thể query bất kỳ lúc nào qua HTTP)
    try:
        api_url = f"{SITE_URL}/api/tasks"
        req_data = {
            "task": task_name,
            "channel": channel,
            "status": status,
            "timeStr": time_str,
            "title": title or "",
            "url": post_url or "",
            "error": error_msg or "",
            "extraInfo": extra_info or "",
            "secret": MOD_SECRET
        }
        req = urllib.request.Request(
            api_url,
            data=json.dumps(req_data).encode("utf-8"),
            headers={"Content-Type": "application/json", "User-Agent": "TaskNotifier/1.0"},
            method="POST"
        )
        urllib.request.urlopen(req, timeout=5)
    except Exception as e:
        # Website sync failure is non-fatal
        pass

    print(f"[Task Logger] ✅ Đã lưu vết task: [{status.upper()}] {task_name} lúc {time_str}")

def send_telegram_direct_and_group(text: str):
    """
    (Chỉ dùng cho trường hợp ngoại lệ hoặc báo cáo đặc biệt)
    """
    if not ENABLE_TELEGRAM_REALTIME:
        return {"disabled": True, "note": "Real-time Telegram notifications disabled by Bố"}

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    try:
        data_hdqt = {
            'chat_id': HDQT_GROUP_CHAT_ID,
            'message_thread_id': HDQT_TOPIC_THREAD_ID,
            'text': text,
            'parse_mode': 'HTML',
            'disable_web_page_preview': False
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(data_hdqt).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print("[Notifier Error] Gửi Telegram:", e)
        return {"ok": False, "error": str(e)}

def notify_task_success(task_name: str, channel: str, time_str: str = None, post_url: str = None, title: str = None, extra_info: str = None):
    """
    Ghi nhận task tự động hoàn thành vào file log chung.
    TUYỆT ĐỐI KHÔNG BẮN TIN NHẮN TELEGRAM RIÊNG LẺ NỮA (THEO LỆNH BỐ).
    """
    record_task_log(
        task_name=task_name,
        status="success",
        channel=channel,
        time_str=time_str,
        post_url=post_url,
        title=title,
        extra_info=extra_info
    )
    return {"ok": True, "status": "logged_success"}

def notify_task_error(task_name: str, channel: str, time_str: str = None, error_msg: str = None):
    """
    Ghi nhận sự cố task tự động vào file log chung.
    TUYỆT ĐỐI KHÔNG BẮN TIN NHẮN TELEGRAM RIÊNG LẺ NỮA (THEO LỆNH BỐ).
    """
    record_task_log(
        task_name=task_name,
        status="error",
        channel=channel,
        time_str=time_str,
        error_msg=error_msg
    )
    return {"ok": True, "status": "logged_error"}

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Ghi log task tự động cho Bố & Hermes")
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
    print("Logged result:", res)
