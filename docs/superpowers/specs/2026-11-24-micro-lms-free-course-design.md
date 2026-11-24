# 🌿 ĐẶC TẢ THIẾT KẾ: CỔNG HỌC TẬP TƯƠNG TÁC LEAD MAGNET & HỆ THỐNG XÁC THỰC EMAIL OTP
> **Mã dự án:** TCN-LEAD-MAGNET-LMS  
> **Phiên bản:** 1.0.0 | **Ngày lập:** 24/11/2026  
> **Người phê duyệt:** Bố Long (@longphibtc) | **Kiến trúc sư:** Mây (AI Co-founder)  
> **Trạng thái:** Đã kiểm thử gửi email Resend từ `may@traicainghien.com` thành công 100% (Domain Verified).

---

## 1. MỤC TIÊU CHIẾN LƯỢC & PHẠM VI (GOALS & SCOPE)

### 1.1 Mục Tiêu Cốt Lõi:
1. **Thu thập 100% Verified Leads chất lượng cao:**  
   Người dùng muốn vào học/nhận tài liệu bắt buộc phải nhập email và **xác thực mã OTP 6 số**. Triệt tiêu 100% email rác, email giả mạo hoặc typo.
2. **Cổng học tập tương tác chuẩn weOPC:**  
   Giao diện tinh tế, sang trọng, nhã nhặn (Zen Minimalist) chia theo từng ngày (Day 1 - Day 7). Sidebar hiển thị tiến độ % và checklist bài học bên trái; Khung học tập tương tác bên phải có bài học, checklist bài tập thực hành (Action Worksheet) và nút "Hoàn thành bài học".
3. **Mở đầu bằng sản phẩm mũi nhọn:**  
   Khóa học miễn phí: **"7 Ngày Lấy Lại Sự Tập Trung (Focus Reset Journey)"** — Đánh trúng nỗi đau xao nhãng số, sương mù não (Brain Fog) và nghiện dopamine ngắn của người trẻ 18-35 tuổi.
4. **Kiến trúc Modular mở rộng trọn đời (`/khoa-hoc/[slug]`):**  
   Hệ thống thiết kế theo dynamic route. Về sau khi Bố muốn ra mắt thêm khóa `25-ngay-xay-dung-thoi-quen` hoặc cẩm nang mới, chỉ cần thêm dữ liệu cấu hình là tự động sinh trang mới.

---

## 2. KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ (ARCHITECTURE & TECH STACK)

### 2.1 Thành Phần Công Nghệ:
* **Frontend:** Next.js App Router (TypeScript, Tailwind CSS, Lucide Icons, Framer Motion transitions nhẹ nhàng).
* **Email Service:** Resend API (Domain `traicainghien.com` - Region `ap-northeast-1` Tokyo cực nhanh).
* **Sender:** `Mây • Trại Cai Nghiện <may@traicainghien.com>`
* **Reply-To:** Email cá nhân/quản trị của Bố (độc giả phản hồi sẽ gửi thẳng về Gmail của Bố).
* **Session Management:** Lưu phiên 30 ngày (Secure HttpOnly Cookie + LocalStorage fallback) để học viên quay lại học không phải nhập lại OTP.
* **Lead Storage:** 
  1. File JSON dữ liệu nội bộ an toàn (có API Admin xuất file Excel/CSV).
  2. Tự động đồng bộ sang Resend Audience (danh bạ Resend để Bố gửi chiến dịch marketing sau này).
  3. Bắn thông báo thời gian thực về Telegram của Bố/Topic 19 khi có học viên mới.

---

## 3. THIẾT KẾ TRẢI NGHIỆM NGƯỜI DÙNG (UX / UI SPECIFICATION)

### 3.1 Luồng Vào & Xác Thực OTP (Gatekeeper Flow):
1. **Khách truy cập `/khoa-hoc/7-ngay-tap-trung`:**
   * Nếu chưa xác thực: Hiển thị Hero Banner giới thiệu khóa học, lời cam kết chuyển hóa, outline 7 ngày, nút CTA lớn: *"Bắt đầu hành trình 7 ngày miễn phí"*.
   * Bấm CTA ➔ Mở Modal Zen tối giản nhập Email.
2. **Gửi mã OTP:**
   * Người dùng nhập `email@example.com` ➔ Bấm *"Nhận mã truy cập qua Email"*.
   * Client gọi `POST /api/courses/auth/otp-request`.
   * Server tạo mã 6 số (mã hóa hash + thời hạn 10 phút), gọi Resend gửi email mẫu Zen tuyệt đẹp với tiêu đề:  
     `🌿 Mã xác thực mở khóa 7 Ngày Lấy Lại Sự Tập Trung của bạn: [123456]`
   * Modal chuyển sang 6 ô nhập mã OTP tự động nhảy nét, có đồng hồ đếm ngược 60s để gửi lại mã.
3. **Xác thực & Mở khóa:**
   * Nhập đúng 6 số ➔ Client gọi `POST /api/courses/auth/otp-verify`.
   * Server xác thực thành công ➔ Tạo JWT Session Token (hạn 30 ngày), ghi nhận Lead vào Database & Resend Audience, bắn tin Telegram.
   * Giao diện mở khóa mượt mà, đưa học viên vào thẳng **Ngày 1**.

---

### 3.2 Giao Diện Cổng Học Tập (weOPC Layout):
* **Sidebar Trái (Khung điều hướng khóa học):**
  * Tên khóa học & Huy hiệu: *"Khóa Học Miễn Phí • Độc Quyền"*.
  * Thanh tiến độ: `Đã hoàn thành 1/7 ngày (14%)` kèm Progress Bar mượt mà.
  * Danh sách 7 ngày học tập:
    - *Ngày 1: Nhận diện ma trận xao nhãng & Dọn sạch rác số*
    - *Ngày 2: Kỹ thuật 90 phút nhịp sinh học Ultradian (Deep Work)*
    - *Ngày 3: Thiết kế môi trường làm việc không điện thoại*
    - *Ngày 4: Tái lập thụ thể Dopamine D2 & Làm bạn với sự nhàm chán*
    - *Ngày 5: Quy trình Brain Dump & Time-blocking thực chiến*
    - *Ngày 6: Kỷ luật không cần gồng (Kaizen 1% vi mô)*
    - *Ngày 7: Duy trì sự chú ý bền bỉ & Bản kế hoạch 30 ngày tới*
  * Mỗi ngày có icon trạng thái trực quan: Đang học (sáng xanh), Đã xong (tích xanh), Chưa học.
  * Nút "Đăng xuất / Đổi email" nhỏ gọn dưới chân sidebar.
* **Khung Học Tập Chính (Content Area):**
  * Thẻ ngày: `NGÀY 01 / 07` | Thời lượng: `5 phút đọc • 15 phút thực hành`.
  * Tiêu đề bài học lớn & Lời dẫn truyền cảm hứng.
  * Ảnh minh họa Cinematic Conceptual độc bản.
  * Nội dung bài học theo cấu trúc:
    - 💡 *Góc nhìn khoa học thần kinh (The Neuroscience)*
    - 🔍 *Bẫy tâm lý thường gặp (The Matrix Trap)*
    - 🛠️ *Bài tập thực hành vi mô (Micro-action)*
  * **Hộp Checklist Hành Động (Daily Action Checklist):** Các ô tích chọn tương tác lưu trạng thái trực tiếp trên trình duyệt.
  * **Nút hành động cuối bài:** *"Đánh dấu đã hoàn thành & Học ngày tiếp theo ➔"*.

---

## 4. BẢO MẬT & QUẢN TRỊ LEADS (ADMIN & DATA MANAGEMENT)

### 4.1 Quản trị Leads:
* Endpoint `GET /api/courses/leads?format=csv` (bảo vệ bằng mật mã `MOD_SECRET`):
  Cho phép Bố tải toàn bộ danh sách email, ngày đăng ký, khóa học, và trạng thái hoàn thành dưới dạng file Excel/CSV về máy tính chỉ với 1 click.
* Tự động thêm contact vào Resend Contacts/Audience để phục vụ các chiến dịch gửi email nuôi dưỡng sau này.

---

## 5. KẾ HOẠCH TRIỂN KHAI (IMPLEMENTATION PHASES)

* **Phase 1:** Cấu hình Resend Client & Template Email OTP Zen Minimalist (`src/lib/resend.ts`, `src/lib/courseEmailTemplates.ts`).
* **Phase 2:** Xây dựng API Backend (`/api/courses/auth/otp-request`, `/api/courses/auth/otp-verify`, `/api/courses/leads`).
* **Phase 3:** Xây dựng kho dữ liệu 7 bài học chuẩn mực của khóa 7 Ngày Tập Trung (`src/data/courses/sevenDaysFocus.ts`).
* **Phase 4:** Xây dựng Giao diện UI:
  - Landing Gatekeeper View & Modal OTP 6 số (`src/components/courses/CourseGatekeeperModal.tsx`).
  - Giao diện LMS tương tác weOPC Layout (`src/app/khoa-hoc/[slug]/page.tsx`).
* **Phase 5:** Tích hợp kiểm thử gửi email thật, kiểm tra Responsive di động & máy tính, build Next.js deploy live.
