"""
Script gửi bài kiểm thử (test) lên kênh Telegram @traicainghiendaily
DÙNG ĐÚNG CHUẨN như daily_news_dispatcher.py:
  - Gemini dịch tiêu đề sang tiếng Việt
  - 3 góc nhìn: Cơ chế sinh học / Bẫy hành vi / Góc nhìn tự do
  - Key Action + Quote
  - Link nguồn + footer chuẩn

Sử dụng:
  python scripts/send_test_telegram_post.py            # gửi thật lên kênh
  python scripts/send_test_telegram_post.py --dry-run # chỉ preview, không gửi
"""
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from scripts.daily_news_dispatcher import (  # noqa: E402
    fetch_psychology_articles,
    extract_article_info,
    synthesize_bulletin_with_gemini,
    send_telegram_bulletin,
    load_history,
)

SESSION_TEST = "BẢN TIN ĐÊM 22:00 (BẢN KIỂM THỬ)"


def run_test_post(dry_run=False):
    print("=" * 60)
    print("🧪 GỬI BÀI KIỂM THỬ - CHUẨN TRẠI CAI NGHIỆN DAILY")
    print("=" * 60)

    history = load_history()
    print(f"Đã tải {len(history)} bài đã gửi trước đó.")

    candidates = fetch_psychology_articles()
    print(f"Quét được {len(candidates)} link bài từ nguồn quốc tế.")

    selected = None
    for url in candidates:
        if url in history:
            continue
        info = extract_article_info(url)
        if info and info.get("image") and info["image"].startswith("http"):
            selected = info
            break

    if not selected:
        print("❌ Không tìm được bài mới có og:image hợp lệ.")
        return False

    print(f"✅ Bài được chọn: {selected['title']}")
    print(f"   URL: {selected['url']}")
    print(f"   Ảnh gốc: {selected['image']}")

    caption = synthesize_bulletin_with_gemini(selected, session=SESSION_TEST)

    print("\n--- NỘI DUNG BẢN KIỂM THỬ (PREVIEW) ---")
    print(caption)
    print(f"--- Độ dài caption: {len(caption)} ký tự ---\n")

    if dry_run:
        print("🧪 Dry-run: không gửi lên Telegram.")
        return True

    print("📢 Đang gửi lên kênh Telegram @traicainghiendaily...")
    send_telegram_bulletin(selected["image"], caption)
    print("✅ Đã gửi bài kiểm thử lên kênh.")
    return True


if __name__ == "__main__":
    dry = "--dry-run" in sys.argv
    run_test_post(dry_run=dry)
