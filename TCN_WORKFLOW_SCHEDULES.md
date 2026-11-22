# 📅 LỊCH TRÌNH VẬN HÀNH CÁC LUỒNG TỰ ĐỘNG • TRẠI CAI NGHIỆN
> **Dành cho:** Hermes Agent (Trợ lý của ĐẠI KA Long) & Mây (AI Co-founder)  
> **Phiên bản:** 1.2.0 | **Cập nhật lần cuối:** 22/11/2026 | **Múi giờ:** Giờ Việt Nam (GMT+7)  
> **Mục đích:** File đối chiếu tiêu chuẩn để Hermes kiểm tra xem các luồng có chạy đúng giờ và thành công hay không.

---

## ⏰ BẢNG LỊCH TRÌNH 11 MỐC GIỜ PHÁT SÓNG TRONG NGÀY (BAO GỒM BÀI WEB, THREADS & INSTA)

| STT | Mốc giờ | Tên luồng & Tác vụ | ID / Runner / Phụ trách | Kênh xuất bản | Tính chất |
| :---: | :---: | :--- | :--- | :--- | :---: |
| 1 | **06:10** | 🌅 **Báo cáo sáng vận hành** | `telegram_reporter.py` | Telegram Topic 19 (HĐQT) | 🔴 Bắt buộc |
| 2 | **08:30** | 🌊 **Bản tin sáng: Tâm lý & Thói quen** | Flow 01 (`wWXJoMhbchKzrkqr`) | Telegram Daily + Fanpage FB | 🔴 Quan trọng |
| 3 | **10:00** | 🌐 **XUẤT BẢN BÀI WEBSITE CA 1: Deep Work & Tập Trung** | Flow 03 (`Lj3wvfAe0CEqnWbQ`) ➔ `website_article_publisher.py` | 🌐 Website traicainghien.com + Fanpage + Telegram | 🔴 Bắt buộc |
| 4 | **12:00** | 💬 **Threads & Insta Trưa: Bóc tách bẫy xao nhãng** | `schedule_today_threads.py` (Agent 11) | Meta Threads + Instagram | 🔴 Quan trọng |
| 5 | **15:00** | ☀️ **Bản tin chiều: Deep Work & Năng suất** | Flow 01 (`wWXJoMhbchKzrkqr`) | Telegram Daily + Fanpage FB | 🔴 Quan trọng |
| 6 | **16:30** | 📌 **Threads & Insta Chiều: 4 bước làm chủ tập trung** | `schedule_today_threads.py` (Agent 11) | Meta Threads + Instagram | 🟡 Tiêu chuẩn |
| 7 | **20:30** | 🌆 **Bản tin tối: Phục hồi Dopamine** | Flow 01 (`wWXJoMhbchKzrkqr`) | Telegram Daily + Fanpage FB | 🔴 Quan trọng |
| 8 | **21:00** | 🌐 **XUẤT BẢN BÀI WEBSITE CA 2: Thói Quen & Cai Nghiện** + Trạm Tích Cực | Flow 03 (`Lj3wvfAe0CEqnWbQ`) ➔ `website_article_publisher.py` | 🌐 Website traicainghien.com + Fanpage + Telegram | 🔴 Bắt buộc |
| 9 | **21:45** | 🕯️ **Threads & Insta Đêm: Thư buông bỏ & Tắt ánh sáng xanh** | `schedule_today_threads.py` (Agent 11) | Meta Threads + Instagram | 🔴 Quan trọng |
| 10 | **22:00** | 🌙 **Lời nhắc đi ngủ dịu dàng** | Flow 02 (`E6PVBHKrtYPlfevu`) | Telegram Daily + Fanpage FB | 🔴 Bắt buộc |
| 11 | **22:10** | 📊 **Báo cáo tối tổng kết ngày & Audit** | `telegram_reporter.py` | Telegram Topic 19 (HĐQT) | 🔴 Bắt buộc |

---

## 🌐 CHI TIẾT LUỒNG XUẤT BẢN BÀI VIẾT LÊN WEBSITE (FLOW 03 - 2 CA/NGÀY)

> **Luồng cốt lõi:** **Flow 03 (`Lj3wvfAe0CEqnWbQ` - Agent 10 & Agent 5)**  
> **Bộ điều phối VPS:** `traicainghien-publisher.service` (Port 5005) ➔ `omnichannel_dispatcher.py` ➔ `website_article_publisher.py`

* **Mốc 1 (10:00 Sáng):**
  - **Chủ đề mũi nhọn:** Sự Tập Trung, Deep Work, Mono-tasking, Trị Não Sương Mù (Brain Fog).
  - **Quy trình:** Đào transcript YouTube tri thức cao ➔ Gemini Pro tái cấu trúc bài viết chuyên sâu 1,500 – 2,500 từ theo chuẩn Storytelling & Khoa học Thần kinh ➔ Tải ảnh Cinematic Conceptual độc bản (đối chiếu hash chống trùng lặp, nén WebP < 120KB) ➔ Sinh 3 bình luận seeding độc bản ➔ Tự động Git commit & push qua Deploy Key ➔ Vercel tự động build và deploy bài viết trực tiếp lên `https://www.traicainghien.com/bai-viet/{slug}`.
  - **Đa kênh:** Đăng đồng thời bài viết Teaser tóm tắt lên Facebook Fanpage (ghim link bài viết đầy đủ tại First Comment) và tóm tắt bài lên Telegram Daily.

* **Mốc 2 (21:00 Tối):**
  - **Chủ đề mũi nhọn:** Thói quen Kaizen 1%, Tái lập Thụ thể Dopamine D2, Triết lý Stoic Zen tĩnh lặng, Trạm Tích Cực.
  - **Quy trình:** Xuất bản bài nghiên cứu chuyên sâu số 2 lên Website (Git push deploy Vercel) kèm ảnh trích dẫn Zen Black Card trên Fanpage và Telegram.

---

## 🎬 CÁC LUỒNG ĐA KÊNH KHÁC (OMNICHANNEL DYNAMIC FLOWS)

* 📱 **Short Video Đa Kênh (Agent 12):** Phân phối video ngắn 9:16 tối ưu Tỷ lệ Lưu & Chia sẻ lên **Instagram Reels, Facebook Reels, TikTok & YouTube Shorts**.

---

## 🔍 QUY TRÌNH ĐỐI CHIẾU DÀNH CHO HERMES

Khi **ĐẠI KA Long** hỏi: *"Hôm nay các task chạy thế nào rồi?"* hoặc *"Có task nào không thành công không?"*:

1. **Bước 1 (Lấy dữ liệu thực tế):**
   * Đọc file `TASKS_TODAY.md` hoặc `tcn_tasks_log.json` (nếu cần dữ liệu mới nhất, chạy `python sync_tasks.py`).
2. **Bước 2 (Đối chiếu với mốc giờ hiện tại):**
   * So sánh giờ hiện tại với bảng lịch trình 11 mốc ở trên:
     - Những mốc giờ nào **đã qua** tính đến thời điểm ĐẠI KA hỏi?
     - Mốc giờ đó **đã có bản ghi log tương ứng** trong `TASKS_TODAY.md` chưa?
     - Đặc biệt lưu ý 2 mốc xuất bản bài Website: **10:00 Sáng** (`TCN-WEB-01`) và **21:00 Tối** (`TCN-WEB-02`).
     - Trạng thái là **✅ Thành công** hay **❌ Lỗi**?
3. **Bước 3 (Báo cáo súc tích cho ĐẠI KA):**
   * **Nếu toàn bộ các mốc giờ đã qua đều thành công:**  
     👉 *"Dạ báo cáo ĐẠI KA, tính đến [Giờ hiện tại], đã có [X] task đến lịch chạy và toàn bộ đều THÀNH CÔNG 100%! Đã xuất bản bài viết Website, bài mạng xã hội đúng giờ, không có task nào bị trễ hay lỗi ạ."*
   * **Nếu có task bị miss (đến giờ mà chưa thấy log) hoặc bị lỗi:**  
     👉 *"⚠️ Báo cáo ĐẠI KA, tính đến [Giờ hiện tại] có điểm bất thường:*  
     *- Task [Tên task] lúc [Mốc giờ]: [Bị lỗi: Chi tiết / Chưa ghi nhận log].*  
     *👉 ĐẠI KA có thể vào bảo Mây bên Trại Cai Nghiện để Mây kiểm tra và xử lý triệt để ngay ạ!"*
