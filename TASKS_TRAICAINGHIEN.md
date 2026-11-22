# ⏰ THỜI GIAN BIỂU CÁC LUỒNG TỰ ĐỘNG TRẠI CAI NGHIỆN (CHUẨN ĐỐI CHIẾU)

Bảng thời gian biểu chuẩn toàn bộ các tác vụ tự động của dự án **Trại Cai Nghiện** để Hermes Agent đối chiếu thời gian thực với file `TASKS_TRAICAINGHIEN_TODAY.md` (phát hiện task chạy thiếu, trễ hoặc lỗi):

---

## 📌 DANH SÁCH 11 MỐC GIỜ THỰC TẾ TRONG NGÀY (TÓM TẮT NHANH)

* **06:10** - 🌅 `bao_cao_sang_van_hanh_he_thong`: Báo cáo sáng Telegram Topic 19 (HĐQT)
* **08:30** - 🌊 `ban_tin_sang_tam_ly_thoi_quen`: Bản tin sáng Telegram Daily (`@traicainghiendaily`) & Fanpage Facebook (`@traicainghien.fb`)
* **10:00** - 🌐 `xuat_ban_bai_viet_website_ca_1_deep_work`: Xuất bản bài Website chuyên sâu về Sự Tập Trung (`https://www.traicainghien.com/bai-viet/`) + Teaser Fanpage
* **12:00** - 💬 `threads_insta_trua_boc_tach_xao_nhang`: Threads & Instagram trưa (`@traicainghienvn`)
* **15:00** - ☀️ `ban_tin_chieu_nang_suat_deep_work`: Bản tin chiều Telegram Daily (`@traicainghiendaily`) & Fanpage Facebook (`@traicainghien.fb`)
* **16:30** - 📌 `threads_insta_chieu_4_buoc_lam_chu_tap_trung`: Threads & Instagram chiều (`@traicainghienvn`)
* **20:30** - 🌆 `ban_tin_toi_phuc_hoi_dopamine`: Bản tin tối Telegram Daily (`@traicainghiendaily`) & Fanpage Facebook (`@traicainghien.fb`)
* **21:00** - 🌐 `xuat_ban_bai_viet_website_ca_2_thoi_quen_tram_tich_cuc`: Xuất bản bài Website chuyên sâu về Thói Quen Kaizen (`https://www.traicainghien.com/bai-viet/`) + Trạm Tích Cực Zen Black Card
* **21:45** - 🕯️ `threads_insta_dem_thu_buong_bo_tat_anh_sang_xanh`: Threads & Instagram đêm (`@traicainghienvn`)
* **22:00** - 🌙 `loi_nhac_di_ngu_diu_dang`: Lời nhắc đi ngủ dịu dàng Telegram Daily & Fanpage Facebook (Flow 02)
* **22:10** - 📊 `bao_cao_toi_tong_ket_ngay_audit`: Báo cáo tối tổng kết & Audit Telegram Topic 19 (HĐQT)

---

## 📋 BẢNG THỜI GIAN BIỂU CHI TIẾT 11 MỐC GIỜ

| STT | Tên Task Chạy | Giờ Chạy (VN) | Kênh Thực Thi | Nội Dung Tác Vụ | Mục Đích Chiến Lược |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **1** | `bao_cao_sang_van_hanh_he_thong` | **06:10**<br>*(Hàng ngày)* | • Telegram Nhóm **Hội Đồng Quản Trị** (Topic 19: `Trại Cai Nghiện`)<br>• VPS SQLite & API Health Check | Quét kiểm tra trạng thái 3 workflow n8n (`wWXJoMhbchKzrkqr`, `E6PVBHKrtYPlfevu`, `Lj3wvfAe0CEqnWbQ` - đảm bảo `active = 1`); kiểm tra kết nối API (Token Fanpage Facebook, Telegram Bot, Uptime Website < 0.8s, Pool 10 Gemini AI key 200 OK); điểm danh 11 mốc phát sóng trong ngày. | Đảm bảo toàn bộ hạ tầng xuất bản tự động và các cổng kết nối API thông suốt, báo cáo sẵn sàng 100% cho Bố Long và HĐQT trước khi ngày mới bắt đầu. |
| **2** | `ban_tin_sang_tam_ly_thoi_quen` | **08:30**<br>*(Hàng ngày)* | • Telegram Kênh Đọc Tin **Trại Cai Nghiện Daily** (`@traicainghiendaily`)<br>• Fanpage Facebook **Trại Cai Nghiện** (`@traicainghien.fb`) | Phân tích tâm lý học hành vi, thói quen nguyên tử (Atomic Habits), ứng dụng Kaizen 1% buổi sáng, giải phóng xao nhãng số kèm ảnh báo chí nguồn độc bản (og:image bóc tách từ nguồn tin uy tín như Psychology Today). | Đồng hành cùng độc giả bắt đầu ngày mới tỉnh thức, truyền cảm hứng hành động vi mô, xây dựng thói quen đọc bài chất lượng cao mỗi sáng. |
| **3** | `xuat_ban_bai_viet_website_ca_1_deep_work` | **10:00**<br>*(Hàng ngày)* | • 🌐 Website: `https://www.traicainghien.com/bai-viet/{slug}`<br>• Fanpage Facebook: **Trại Cai Nghiện** (`@traicainghien.fb`)<br>• Telegram Kênh: **Trại Cai Nghiện Daily** (`@traicainghiendaily`) | Đào transcript YouTube tri thức cao ➔ Gemini Pro tái cấu trúc bài viết nghiên cứu chuyên sâu 1,500 – 2,500 từ về **Sự Tập Trung & Deep Work** ➔ Tải ảnh bìa *Cinematic Conceptual* độc bản (đối chiếu hash chống trùng, nén WebP < 120KB) ➔ Sinh 3 bình luận seeding độc bản ➔ Tự động Git commit & push qua Deploy Key để Vercel build deploy live ➔ Đăng bài Teaser lên Fanpage (ghim link bài viết website ở First Comment) và tóm tắt lên Telegram Daily. | Xuất bản bài viết chuyên sâu mũi nhọn về Sự Tập Trung lên Website, kéo organic traffic đa kênh về web, khẳng định vị thế tri thức chuyên sâu và tối ưu hóa SEO Google. |
| **4** | `threads_insta_trua_boc_tach_xao_nhang` | **12:00**<br>*(Hàng ngày)* | • Meta Threads: **Trại Cai Nghiện** (`@traicainghienvn`)<br>• Instagram: **Trại Cai Nghiện** (`@traicainghienvn`)<br>*(Qua Buffer GraphQL API Bridge)* | Micro-essay ngắn đánh thức cơn nghiện lướt điện thoại vô thức trong giờ nghỉ trưa, giải pháp cất máy sang phòng khác để ăn trọn vẹn bữa cơm và giải phóng não bộ khỏi kích thích dopamine liên tục. | Chạm đúng nỗi đau xao nhãng số của dân văn phòng, học sinh, sinh viên trong khung giờ nghỉ trưa; mở rộng độ phủ thương hiệu trên các nền tảng Text-first và Visual. |
| **5** | `ban_tin_chieu_nang_suat_deep_work` | **15:00**<br>*(Hàng ngày)* | • Telegram Kênh Đọc Tin **Trại Cai Nghiện Daily** (`@traicainghiendaily`)<br>• Fanpage Facebook **Trại Cai Nghiện** (`@traicainghien.fb`) | Phân tích cơ chế vượt qua cơn buồn ngủ, hiện tượng "nhũn não" / "sương mù não" (Brain Fog) giữa buổi chiều; kỹ thuật làm việc 90 phút theo nhịp sinh học Ultradian Rhythm và thiết kế không gian làm việc tĩnh lặng (Sanctuary Environment). | Tiếp sức năng lượng và tái thiết lập sự chú ý cho độc giả vào khung giờ làm việc căng thẳng buổi chiều, giảm thiểu tình trạng nhảy tab và trì hoãn. |
| **6** | `threads_insta_chieu_4_buoc_lam_chu_tap_trung` | **16:30**<br>*(Hàng ngày)* | • Meta Threads: **Trại Cai Nghiện** (`@traicainghienvn`)<br>• Instagram: **Trại Cai Nghiện** (`@traicainghienvn`)<br>*(Qua Buffer GraphQL API Bridge)* | Checklist 4 bước dọn sạch các tab linh tinh, ghi ra 3 việc quan trọng nhất cho ngày mai, dọn sạch bàn làm việc và giải phóng tâm trí (Brain Dump) trước khi kết thúc ca làm việc. | Giúp người đi làm kết thúc ngày làm việc có chủ đích, rũ bỏ áp lực công việc để trở về với cuộc sống gia đình trọn vẹn. |
| **7** | `ban_tin_toi_phuc_hoi_dopamine` | **20:30**<br>*(Hàng ngày)* | • Telegram Kênh Đọc Tin **Trại Cai Nghiện Daily** (`@traicainghiendaily`)<br>• Fanpage Facebook **Trại Cai Nghiện** (`@traicainghien.fb`) | Phân tích cơ chế nghiện kích thích ngắn (Shorts, Reels, TikTok), tác hại của bẫy dopamine rẻ tiền khiến thụ thể D2 bị chai sạn; hướng dẫn phương pháp tự trắc ẩn và cai nghiện công nghệ từng bước vững chắc. | Đón đầu khung giờ rảnh rỗi buổi tối (thời điểm người trẻ dễ rơi vào bẫy lướt video ngắn vô thức), giúp độc giả nhận thức hành vi và thay thế bằng nguồn dopamine lành mạnh. |
| **8** | `xuat_ban_bai_viet_website_ca_2_thoi_quen_tram_tich_cuc` | **21:00**<br>*(Hàng ngày)* | • 🌐 Website: `https://www.traicainghien.com/bai-viet/{slug}`<br>• Fanpage Facebook: **Trại Cai Nghiện** (`@traicainghien.fb`)<br>• Telegram Kênh: **Trại Cai Nghiện Daily** (`@traicainghiendaily`) | Đào và xuất bản bài viết nghiên cứu chuyên sâu số 2 lên Website về **Thói Quen Kaizen & Cai Nghiện Số** (quy trình tự động Git commit & push Vercel) ➔ Kèm ảnh Quote triết lý Stoic Zen Black Card tĩnh lặng (`tram_tich_cuc_publisher.py`) xuất bản đa kênh. | Cung cấp bài học triết lý và thực hành thói quen sâu sắc vào buổi tối, tạo điểm dừng suy ngẫm bình an và gia tăng chiều sâu gắn kết thương hiệu. |
| **9** | `threads_insta_dem_thu_buong_bo_tat_anh_sang_xanh` | **21:45**<br>*(Hàng ngày)* | • Meta Threads: **Trại Cai Nghiện** (`@traicainghienvn`)<br>• Instagram: **Trại Cai Nghiện** (`@traicainghienvn`)<br>*(Qua Buffer GraphQL API Bridge)* | Lời nhắc nhở buông bỏ điện thoại, tắt ánh sáng xanh để bảo vệ melatonin; bức thư vỗ về ấm áp tha thứ cho bản thân vì những điều chưa làm xong hôm nay kèm ảnh nến ấm cúng Zen độc bản. | Chuẩn bị tâm thế tĩnh lặng cho độc giả bước vào giấc ngủ, ngăn chặn hành vi mang điện thoại lên giường lướt xuyên đêm. |
| **10** | `loi_nhac_di_ngu_diu_dang` | **22:00**<br>*(Hàng ngày)* | • Telegram Kênh Đọc Tin **Trại Cai Nghiện Daily** (`@traicainghiendaily`)<br>• Fanpage Facebook **Trại Cai Nghiện** (`@traicainghien.fb`) | Bức thư vỗ về dịu dàng trước giờ ngủ (Flow 02: `E6PVBHKrtYPlfevu`), nhắc nhở buông bỏ thiết bị điện tử, tha thứ cho một ngày đã qua và dỗ dành tâm trí vào giấc ngủ an lành. | Khép lại một ngày của độc giả trong sự bình an, khẳng định giá trị nhân văn và phẩm chất thấu cảm, không phán xét của Trại Cai Nghiện. |
| **11** | `bao_cao_toi_tong_ket_ngay_audit` | **22:10**<br>*(Hàng ngày)* | • Telegram Nhóm **Hội Đồng Quản Trị** (Topic 19: `Trại Cai Nghiện`)<br>• VPS SQLite & Cloud Logs | Thu thập toàn bộ chỉ số tăng trưởng trong ngày (số bài viết mới trên Website, tương tác Fanpage Facebook, lượt đọc Telegram Daily, tương tác Threads); **tổng hợp toàn bộ 11 tác vụ tự động đã chạy trong ngày** (số task thành công, danh sách lỗi nếu có); đề xuất 2-3 chiến lược tối ưu cho ngày hôm sau. | Cung cấp báo cáo minh bạch toàn diện cho Bố Long và HĐQT, đảm bảo kiểm soát chất lượng vận hành khép kín trước khi kết thúc ngày. |

---

## 🛠️ CÁC DỊCH VỤ HỆ THỐNG CHẠY NGẦM 24/7 (VPS DAEMONS & N8N)

| Tên Dịch Vụ / Luồng | Chu Kỳ Chạy | Kênh / Tài Nguyên | Nhiệm Vụ |
| :--- | :---: | :--- | :--- |
| `traicainghien-publisher.service` | 24/7 (Port 5005) | VPS Daemon Python FastAPI | Nhận webhook từ n8n lúc 10:00 & 21:00 để kích hoạt bộ điều phối đào bài YouTube, viết bài chuẩn SEO, kiểm duyệt ảnh và đẩy lên Vercel. |
| `Flow 01 (wWXJoMhbchKzrkqr)` | 08:30, 15:00, 20:30 | n8n Workflow SQLite | Tự động hóa bản tin tâm lý, thói quen và phục hồi Dopamine 3 ca/ngày. |
| `Flow 02 (E6PVBHKrtYPlfevu)` | 22:00 | n8n Workflow SQLite | Tự động hóa lời nhắc đi ngủ dịu dàng khép lại ngày dài. |
| `Flow 03 (Lj3wvfAe0CEqnWbQ)` | 10:00 & 21:00 | n8n Workflow SQLite | Kích hoạt bộ máy xuất bản bài viết Website chuyên sâu đa kênh. |

---

## 🤖 HƯỚNG DẪN DÀNH CHO HERMES AGENT ĐỐI CHIẾU (CROSS-CHECK LOGIC)

Khi ĐẠI KA Long hỏi: *"Các task Trại Cai Nghiện hôm nay thế nào?"*, *"Có task nào bị thiếu hay sai gì không?"*:
1. **Lấy giờ hiện tại của ĐẠI KA (Giờ VN).**
2. **Đọc file log thực tế hôm nay:** `TASKS_TRAICAINGHIEN_TODAY.md` (nếu cần dữ liệu mới nhất từ cloud, chạy `python sync_tasks.py`).
3. **Đối chiếu với từng mốc giờ trong bảng trên:**
   - **Mốc giờ CHƯA TỚI:** Bỏ qua (chưa đến giờ chạy).
   - **Mốc giờ ĐÃ QUA:**
     + Nếu trong `TASKS_TRAICAINGHIEN_TODAY.md` đã có log ✅ `Thành công`: Task chạy đúng lịch.
     + Nếu trong `TASKS_TRAICAINGHIEN_TODAY.md` báo ❌ `Lỗi`: **Báo ngay cho ĐẠI KA** (Nêu tên task, lỗi gì, lúc mấy giờ).
     + Nếu đã quá giờ chạy hơn 15 phút mà **chưa thấy xuất hiện** trong file log: **Cảnh báo ngay cho ĐẠI KA** (Task bị trễ hoặc trigger bị miss).
4. **Báo cáo tóm tắt dứt khoát:**
   - *"Dạ báo cáo ĐẠI KA, tính đến [Giờ hiện tại], Trại Cai Nghiện có [X] task đã đến giờ chạy: toàn bộ [X]/[X] task đều chạy ĐỦ và THÀNH CÔNG 100%! Đã xuất bản bài Website, Fanpage, Telegram và Threads đúng lịch, không bị thiếu hay sai sót gì ạ."*
   - Nếu có task thiếu/lỗi: Báo chi tiết ngay và nhắn ĐẠI KA gọi Mây để kiểm tra và xử lý triệt để ngay.
