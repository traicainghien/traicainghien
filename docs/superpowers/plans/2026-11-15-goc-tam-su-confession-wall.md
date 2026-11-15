# Kế Hoạch Triển Khai: Chuyên Mục "Góc Tâm Sự" (Anonymous Confession Wall)

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng hoàn chỉnh chuyên mục "Góc Tâm Sự" trên website Trại Cai Nghiện (`/goc-tam-su`) theo phong cách Bức Tường Ghi Chú Washi (Mẫu 3), tích hợp modal viết thư thả trôi/gửi bài, phễu thu thập Email tặng Cẩm nang Dopamine, nút chạm cảm xúc không phán xét, và luồng duyệt 1-chạm qua Telegram HĐQT Topic 19.

**Architecture:** 
- Frontend: Next.js 15 App Router (`src/app/goc-tam-su/page.tsx`), React 19 Client Components với hiệu ứng lật thẻ 3D Washi và tan biến thả trôi.
- Backend & Data Layer: Next.js Route Handlers (`/api/confessions`, `/api/confessions/[id]/react`, `/api/confessions/[id]/moderate`) kết nối lớp lưu trữ dữ liệu an toàn (Local JSON file persistence `src/data/confessions.json` & `src/data/confession_contacts.json` làm default robust layer, sẵn sàng đồng bộ PostgreSQL/Supabase).
- Notification & Moderation: Tích hợp trực tiếp Telegram Bot API gửi thông báo duyệt tức thì vào HĐQT Topic 19 với Inline Keyboard `[✅ Duyệt]` / `[❌ Từ chối]`.
- AI Compassion Engine: Tích hợp Gemini AI tự động sinh lời nhắn vỗ về tự trắc ẩn cho từng bài tâm sự.

**Tech Stack:** Next.js 15.1, React 19, TypeScript 5.7, Tailwind CSS 3.4, Lucide React, Telegram Bot API, Gemini AI.

---

## Global Constraints
- Tuân thủ phong cách thiết kế Wabi-Sabi, màu giấy thô sần Washi (`#FAF7F2`), xanh rêu rừng (`#3A5A40`), đất nung ấm (`#C27D53`), viền mờ `#E6E1D8`.
- 100% An toàn danh tính: Không lưu IP thô (dùng SHA256 IP hash), không trả trường email/danh tính ra API public.
- Zero-Toxic: Không có ô comment tự do, chỉ có 3 nút chạm cảm xúc (🫂 `feel_you`, 🌿 `hug`, 🕯️ `not_alone`).
- Tương thích Responsive hoàn hảo trên Mobile, Tablet và Desktop.

---

### Task 1: Định Nghĩa TypeScript Models & Lớp Lưu Trữ Dữ Liệu An Toàn

**Files:**
- Create: `src/types/confession.ts`
- Create: `src/lib/confessionsStorage.ts`
- Test: `scripts/test_confession_storage.js`

**Interfaces:**
- Produces:
  - `types/confession.ts`: `Confession`, `MoodTag`, `ReactionType`, `ConfessionSubmission`, `ContactLead`
  - `lib/confessionsStorage.ts`:
    - `getApprovedConfessions(mood?: string): Promise<Confession[]>`
    - `createConfession(data: ConfessionSubmission, ip: string): Promise<{ confession: Confession; leadSaved: boolean }>`
    - `addReaction(id: string, type: ReactionType, ip: string): Promise<{ success: boolean; counts: Record<ReactionType, number> }>`
    - `moderateConfession(id: string, action: 'approve' | 'reject', reviewer: string): Promise<Confession | null>`

- [ ] **Step 1: Viết file định nghĩa kiểu `src/types/confession.ts`**
  - Định nghĩa `MoodTag = 'xao_nhang' | 'tri_hoan' | 'kiet_que' | 'dan_vat' | 'hy_vong'`
  - Định nghĩa `ReactionType = 'feel_you' | 'hug' | 'not_alone'`
  - Định nghĩa interface `Confession`, `ConfessionSubmission`, `ContactLead`.

- [ ] **Step 2: Viết file `src/lib/confessionsStorage.ts`**
  - Khởi tạo thư mục và file dữ liệu `src/data/confessions.json` và `src/data/confession_contacts.json`.
  - Cung cấp sẵn 6 bài tâm sự mẫu ban đầu đậm chất đời thực để trang web luôn sống động ngay từ ngày đầu go-live.
  - Implement các hàm CRUD an toàn, tự động tính toán số lượt reaction và băm SHA256 IP để chống spam.

- [ ] **Step 3: Viết test script `scripts/test_confession_storage.js` và chạy kiểm thử**
  - Kiểm tra thêm bài mới, duyệt bài, lọc theo mood tag, và thả reaction.
  - Chạy lệnh: `node scripts/test_confession_storage.js` bảo đảm 100% test pass.

- [ ] **Step 4: Commit**
  - `git add src/types/confession.ts src/lib/confessionsStorage.ts src/data/confessions.json scripts/test_confession_storage.js`
  - `git commit -m "feat(confession): add types, storage layer and seed confessions data"`

---

### Task 2: Xây Dựng Backend API Routes & Tích Hợp Telegram Bot Duyệt Bài

**Files:**
- Create: `src/app/api/confessions/route.ts`
- Create: `src/app/api/confessions/[id]/react/route.ts`
- Create: `src/app/api/confessions/[id]/moderate/route.ts`
- Test: `scripts/test_confession_api.js`

**Interfaces:**
- Consumes: `src/lib/confessionsStorage.ts`
- Produces:
  - `GET /api/confessions?mood=...`: Trả về danh sách bài đã duyệt
  - `POST /api/confessions`: Nhận payload tâm sự, sinh lời nhắn vỗ về từ Gemini (hoặc fallback thông minh), lưu DB pending, gửi Telegram duyệt
  - `POST /api/confessions/[id]/react`: Thả reaction an toàn
  - `GET|POST /api/confessions/[id]/moderate?action=approve&token=...`: Xử lý duyệt từ Telegram

- [ ] **Step 1: Viết API route `src/app/api/confessions/route.ts`**
  - Hỗ trợ `GET` (lấy danh sách approved).
  - Hỗ trợ `POST` (nhận submission, tự động tạo slug, sinh `ai_compassion_reply`, gửi thông báo Telegram Topic 19 qua Bot Token `9249970693:...`).

- [ ] **Step 2: Viết API route `src/app/api/confessions/[id]/react/route.ts`**
  - Nhận `reaction_type`, xác thực IP, ghi nhận lượt bấm.

- [ ] **Step 3: Viết API route `src/app/api/confessions/[id]/moderate/route.ts`**
  - Xác thực token bảo mật, cập nhật trạng thái `approved` hoặc `rejected`.

- [ ] **Step 4: Chạy test API bằng `scripts/test_confession_api.js`**
  - Kiểm tra các mã trạng thái HTTP 200, 400, 404, 403.

- [ ] **Step 5: Commit**
  - `git add src/app/api/confessions`
  - `git commit -m "feat(api): add confessions CRUD, reactions and Telegram moderation endpoints"`

---

### Task 3: Xây Dựng Các Linh Kiện Giao Diện Thẻ Washi (WashiCard & Flip Animation)

**Files:**
- Create: `src/components/confessions/WashiCard.tsx`
- Create: `src/components/confessions/MoodFilterBar.tsx`
- Test: Kiểm tra render trực quan

**Interfaces:**
- Consumes: `src/types/confession.ts`
- Produces:
  - `<WashiCard confession={...} onReact={...} />`: Thẻ Washi có băng dính, mặt trước hiển thị nội dung + 3 nút reaction, mặt sau hiển thị lời nhắn Mây AI với hiệu ứng lật thẻ 3D (`transform-style: preserve-3d`).
  - `<MoodFilterBar activeMood={...} onSelectMood={...} />`: Thanh lọc chủ đề viên thuốc.

- [ ] **Step 1: Xây dựng `<WashiCard />` với 3 biến thể màu giấy Washi**
  - Hỗ trợ lật thẻ mượt mà không bị giật lag trên mobile.
  - Hiển thị badge tâm trạng, thời gian tương đối, nội dung và 3 nút cảm xúc (🫂 `feel_you`, 🌿 `hug`, 🕯️ `not_alone`) có animation nhảy số khi bấm.

- [ ] **Step 2: Xây dựng `<MoodFilterBar />`**
  - Cho phép người dùng chuyển nhanh giữa các tâm trạng (`Tất cả`, `Xao nhãng số`, `Trì hoãn`, `Kiệt quệ`, `Dằn vặt`, `Hy vọng`).

- [ ] **Step 3: Commit**
  - `git add src/components/confessions/WashiCard.tsx src/components/confessions/MoodFilterBar.tsx`
  - `git commit -m "feat(ui): add WashiCard with 3D flip animation and MoodFilterBar"`

---

### Task 4: Xây Dựng Modal Viết Thư (Phong Bì Thư & Hiệu Ứng Thả Trôi)

**Files:**
- Create: `src/components/confessions/WritingEnvelopeModal.tsx`
- Create: `src/components/confessions/SuccessScreen.tsx`

**Interfaces:**
- Produces:
  - `<WritingEnvelopeModal isOpen={...} onClose={...} onSuccess={...} />`
  - `<SuccessScreen onFollowFacebook={...} onJoinTelegram={...} />`

- [ ] **Step 1: Xây dựng Form Viết Tâm Sự mộc mạc**
  - Chọn 5 tâm trạng trực quan bằng icon.
  - Ô Textarea phong cách trang giấy thư.
  - Nút chuyển đổi 2 chế độ:
    1. 🍂 **"Thả trôi vào hư không"**: Hiệu ứng chữ tan biến nhẹ nhàng như làn khói, kèm thông điệp giải tỏa tức thì.
    2. 🌿 **"Dán lên Bức Tường"**: Mở rộng khung thu thập Email nhận Cẩm nang Dopamine 7 ngày.

- [ ] **Step 2: Xây dựng màn hình cảm ơn `<SuccessScreen />`**
  - Lời vỗ về từ Mây.
  - Nút 1-chạm Like/Follow Fanpage Trại Cai Nghiện.
  - Nút 1-chạm Tham gia Telegram Daily `@traicainghiendaily`.

- [ ] **Step 3: Commit**
  - `git add src/components/confessions/WritingEnvelopeModal.tsx src/components/confessions/SuccessScreen.tsx`
  - `git commit -m "feat(ui): add WritingEnvelopeModal with dissolve animation and lead capture"`

---

### Task 5: Xây Dựng Trang Chính `/goc-tam-su` & Cập Nhật Navbar

**Files:**
- Create: `src/app/goc-tam-su/page.tsx`
- Modify: `src/components/Navbar.tsx`

**Interfaces:**
- Consumes: Tất cả các component từ Task 1-4.
- Produces: Trang web hoàn chỉnh tại đường dẫn `/goc-tam-su`.

- [ ] **Step 1: Cập nhật `src/components/Navbar.tsx`**
  - Thêm mục **"Góc Tâm Sự"** vào danh sách điều hướng desktop và mobile menu.
  - Đảm bảo active state hiển thị sắc xanh rêu `#3A5A40` khi đang ở trang `/goc-tam-su`.

- [ ] **Step 2: Xây dựng trang `src/app/goc-tam-su/page.tsx`**
  - Hero Section với headline giàu cảm xúc và nút kêu gọi `[ ✍️ + Dán Tờ Giấy Mới Lên Tường ]`.
  - Bộ lọc tâm trạng + Lưới thẻ Mosaic responsive.
  - Banner cuối trang kích thích nhận Cẩm nang và kết nối Telegram.
  - Xử lý trạng thái Loading (Skeleton) và Empty State mộc mạc.

- [ ] **Step 3: Chạy build Next.js kiểm tra lỗi biên dịch**
  - Chạy `npm run build` đảm bảo không có lỗi TypeScript hoặc SSR.

- [ ] **Step 4: Commit**
  - `git add src/app/goc-tam-su src/components/Navbar.tsx`
  - `git commit -m "feat(page): complete Goc Tam Su page and update Navbar navigation"`

---

### Task 6: Kiểm Thử Toàn Diện, Đồng Bộ Git & Báo Cáo Nghiệm Thu Cho Bố

**Files:**
- Create: `scripts/verify_goc_tam_su.js`
- Test: Toàn bộ luồng người dùng trên trình duyệt và API

- [ ] **Step 1: Chạy kịch bản kiểm thử toàn diện E2E**
  - Test gửi bài ẩn danh chế độ Thả trôi.
  - Test gửi bài ẩn danh chế độ Dán tường kèm Email.
  - Test bấm 3 nút cảm xúc và kiểm tra chống spam IP.
  - Test duyệt bài qua link Telegram.

- [ ] **Step 2: Chạy kiểm toán chuẩn Trại Cai Nghiện**
  - Chạy `npm run audit:articles` & `npm run build`.

- [ ] **Step 3: Commit và thông báo hoàn thành**
  - `git commit -m "feat: launch Goc Tam Su anonymous confession sanctuary"`
  - Báo cáo kết quả trực tiếp cho Bố.
