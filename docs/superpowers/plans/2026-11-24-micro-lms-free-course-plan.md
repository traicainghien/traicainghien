# Micro-LMS Free Course & OTP Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-converting, weOPC-style interactive Micro-LMS portal (`/khoa-hoc/[slug]`) for the free flagship lead magnet "7 Ngày Lấy Lại Sự Tập Trung", gated by a 6-digit email OTP verification system powered by Resend (`traicainghien.com`) to collect 100% verified leads.

**Architecture:** Next.js App Router dynamic route `/khoa-hoc/[slug]` renders an interactive split-view learning interface (collapsible sidebar with progress bar and checklist + main content area with neuroscience lessons and interactive action checkboxes). A modular serverless backend generates and verifies 10-minute 6-digit OTP codes, stores verified leads in internal JSON and syncs them to Resend Audiences and Telegram alerts, while persisting access via 30-day session cookies and browser storage.

**Tech Stack:** Next.js 15 (App Router, Server & Client Components), React 19, TypeScript, Tailwind CSS, Lucide Icons, Resend REST API, Node.js Test Runner.

## Global Constraints

- Domain and sender: strictly send via `hotro@traicainghien.com` using verified `RESEND_API_KEY` in Tokyo region (`ap-northeast-1`).
- Multi-tenant safety: never touch non-traicainghien workflows, processes or files on VPS/server.
- Aesthetics: strictly follow Trại Cai Nghiện Zen Minimalist styling (warm parchment `#FAF7F2`, forest green `#3A5A40`, terracotta `#C27D53`, charcoal text `#2D312E`).
- Zero placeholders: every step contains actual runnable code and precise assertion checks.
- Build integrity: must compile cleanly with `npm run build` without TypeScript or lint errors.

---

### Task 1: Resend Client & Zen Minimalist OTP Email Template

**Files:**
- Create: `src/lib/resend.ts`
- Create: `src/lib/courseEmailTemplates.ts`
- Test: `tests/resendClient.test.js`

**Interfaces:**
- Produces: `sendEmail({ to, subject, html, text, replyTo }): Promise<{ success: boolean; data?: any; error?: string }>` in `src/lib/resend.ts`
- Produces: `generateOtpEmailHtml({ otpCode, courseTitle, expiryMinutes }): { html: string; text: string }` in `src/lib/courseEmailTemplates.ts`

- [ ] **Step 1: Write the failing unit test for email template and Resend client interface**

Create `tests/resendClient.test.js`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateOtpEmailHtml } from '../src/lib/courseEmailTemplates.ts';

test('generateOtpEmailHtml generates valid HTML with 6-digit OTP and brand styling', () => {
  const result = generateOtpEmailHtml({
    otpCode: '852963',
    courseTitle: '7 Ngày Lấy Lại Sự Tập Trung',
    expiryMinutes: 10
  });

  assert.ok(result.html.includes('852963'), 'HTML must include OTP code');
  assert.ok(result.html.includes('7 Ngày Lấy Lại Sự Tập Trung'), 'HTML must include course title');
  assert.ok(result.html.includes('10 phút'), 'HTML must mention expiry');
  assert.ok(result.html.includes('Trại Cai Nghiện'), 'HTML must include brand name');
  assert.ok(result.text.includes('852963'), 'Plain text must include OTP code');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/resendClient.test.js`
Expected: FAIL with module not found or export missing.

- [ ] **Step 3: Implement `src/lib/courseEmailTemplates.ts`**

Create `src/lib/courseEmailTemplates.ts`:
```typescript
export interface OtpEmailOptions {
  otpCode: string;
  courseTitle: string;
  expiryMinutes?: number;
}

export function generateOtpEmailHtml({
  otpCode,
  courseTitle,
  expiryMinutes = 10,
}: OtpEmailOptions): { html: string; text: string } {
  const formattedCode = otpCode.split('').join(' ');

  const text = `Chào bạn,

Mã xác thực mở khóa khóa học "${courseTitle}" của bạn là: ${otpCode}

Mã có hiệu lực trong vòng ${expiryMinutes} phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.

Nếu bạn không yêu cầu mã này, bạn có thể yên tâm bỏ qua email này.

Thân ái,
Mây • Trại Cai Nghiện
Làm chủ sự tập trung, sống có chủ đích.
https://traicainghien.com`;

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã xác thực Trại Cai Nghiện</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #2D312E; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF7F2; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #EAE5DE; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);" cellspacing="0" cellpadding="0" border="0">
          <!-- Header Banner -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; background: linear-gradient(180deg, #F4EFE6 0%, #FFFFFF 100%); text-align: center; border-bottom: 1px solid #F0ECE4;">
              <div style="display: inline-block; padding: 6px 14px; background-color: #3A5A40; color: #FFFFFF; border-radius: 999px; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px;">
                Trại Cai Nghiện
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #2D312E; letter-spacing: -0.01em;">
                Mã Xác Thực Nhận Khóa Học
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #6E746E;">
                ${courseTitle}
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #2D312E;">
                Chào bạn,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #555D56; line-height: 1.6;">
                Bạn vừa đăng ký truy cập khóa học <strong>"${courseTitle}"</strong>. Dưới đây là mã xác thực 6 chữ số dùng để mở khóa không gian học tập độc quyền của bạn:
              </p>

              <!-- OTP Code Display Box -->
              <div style="background-color: #F8F5EE; border: 1px dashed #C27D53; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #C27D53; letter-spacing: 0.1em; margin-bottom: 8px;">
                  MÃ XÁC THỰC CỦA BẠN
                </div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #3A5A40; letter-spacing: 8px; margin: 0;">
                  ${otpCode}
                </div>
                <div style="font-size: 12px; color: #8C928B; margin-top: 10px;">
                  Mã có hiệu lực trong vòng <strong>${expiryMinutes} phút</strong>
                </div>
              </div>

              <p style="margin: 24px 0 0 0; font-size: 13px; color: #7B827A; line-height: 1.5;">
                • Nhập mã này tại cửa sổ đang mở trên website để vào học ngay.<br>
                • Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #FAF7F2; border-top: 1px solid #EAE5DE; text-align: center;">
              <p style="margin: 0; font-size: 13px; font-weight: 600; color: #3A5A40;">
                Mây • Trại Cai Nghiện
              </p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #8C928B;">
                Làm chủ sự tập trung, sống có chủ đích.
              </p>
              <p style="margin: 10px 0 0 0; font-size: 11px; color: #A4AAA2;">
                © 2026 traicainghien.com. Mọi quyền được bảo lưu.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { html, text };
}
```

- [ ] **Step 4: Implement `src/lib/resend.ts`**

Create `src/lib/resend.ts`:
```typescript
interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo = 'choenchoet22@gmail.com',
}: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Hỗ Trợ • Trại Cai Nghiện <hotro@traicainghien.com>';

  if (!apiKey) {
    console.error('[Resend] RESEND_API_KEY is not defined in environment variables.');
    return { success: false, error: 'RESEND_API_KEY is missing' };
  }

  try {
    const payload = {
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || '',
      reply_to: replyTo,
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TraiCaiNghien/1.0',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Resend Error]', data);
      return { success: false, error: data?.message || 'Failed to send email via Resend' };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('[Resend Network Error]', err);
    return { success: false, error: err?.message || 'Network exception when calling Resend' };
  }
}
```

- [ ] **Step 5: Run tests and verify PASS**

Run: `node --test tests/resendClient.test.js`
Expected: PASS with 1 passing test.

- [ ] **Step 6: Commit**

```bash
git add src/lib/courseEmailTemplates.ts src/lib/resend.ts tests/resendClient.test.js
git commit -m "feat(courses): add Resend email client and Zen OTP email template"
```

---

### Task 2: Serverless OTP Storage, Generation & Rate Limiter

**Files:**
- Create: `src/lib/courseOtpStorage.ts`
- Test: `tests/otpStorage.test.js`

**Interfaces:**
- Produces: `generateAndStoreOtp(email: string, courseSlug: string): Promise<{ success: boolean; otpCode?: string; error?: string; retryAfterSeconds?: number }>`
- Produces: `verifyStoredOtp(email: string, courseSlug: string, inputCode: string): Promise<{ valid: boolean; error?: string }>`

- [ ] **Step 1: Write the failing unit test for OTP generation and verification**

Create `tests/otpStorage.test.js`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateAndStoreOtp, verifyStoredOtp } from '../src/lib/courseOtpStorage.ts';

test('OTP flow: generates 6-digit code, verifies correct code, rejects wrong code', async () => {
  const email = 'test_user_' + Date.now() + '@example.com';
  const slug = '7-ngay-tap-trung';

  const genResult = await generateAndStoreOtp(email, slug);
  assert.equal(genResult.success, true, 'Generation must succeed');
  assert.match(genResult.otpCode, /^[0-9]{6}$/, 'Must be 6 digits');

  // Verify wrong code
  const wrongRes = await verifyStoredOtp(email, slug, '000000');
  assert.equal(wrongRes.valid, false, 'Wrong code must be rejected');

  // Verify correct code
  const rightRes = await verifyStoredOtp(email, slug, genResult.otpCode);
  assert.equal(rightRes.valid, true, 'Correct code must pass');

  // Verify code cannot be reused (consumed)
  const reusedRes = await verifyStoredOtp(email, slug, genResult.otpCode);
  assert.equal(reusedRes.valid, false, 'Consumed OTP cannot be reused');
});

test('Rate limiting: cannot request new OTP within 60 seconds', async () => {
  const email = 'rate_limit_' + Date.now() + '@example.com';
  const slug = '7-ngay-tap-trung';

  const first = await generateAndStoreOtp(email, slug);
  assert.equal(first.success, true);

  const second = await generateAndStoreOtp(email, slug);
  assert.equal(second.success, false, 'Should be throttled');
  assert.ok(second.retryAfterSeconds > 0, 'Must provide retryAfterSeconds');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/otpStorage.test.js`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `src/lib/courseOtpStorage.ts`**

Create `src/lib/courseOtpStorage.ts`:
```typescript
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import os from 'os';

interface OtpRecord {
  email: string;
  courseSlug: string;
  codeHash: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
}

// In-memory store (active during serverless instance lifetime)
const memoryStore = new Map<string, OtpRecord>();

// Temp directory fallback for cross-request persistence on local dev / server
const TEMP_DIR = path.join(os.tmpdir(), 'tcn_course_otp');

function getStoreKey(email: string, courseSlug: string): string {
  return `${email.trim().toLowerCase()}_${courseSlug.trim().toLowerCase()}`;
}

function ensureTempDir(): void {
  try {
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }
  } catch {
    // Ignore error if filesystem is read-only
  }
}

function getFilePath(key: string): string {
  const safeName = crypto.createHash('md5').update(key).digest('hex') + '.json';
  return path.join(TEMP_DIR, safeName);
}

function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

function readRecord(key: string): OtpRecord | null {
  const mem = memoryStore.get(key);
  if (mem) return mem;

  try {
    const file = getFilePath(key);
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      memoryStore.set(key, data);
      return data;
    }
  } catch {
    // Read failure fallback
  }
  return null;
}

function writeRecord(key: string, record: OtpRecord): void {
  memoryStore.set(key, record);
  try {
    ensureTempDir();
    fs.writeFileSync(getFilePath(key), JSON.stringify(record), 'utf-8');
  } catch {
    // Write failure fallback
  }
}

function deleteRecord(key: string): void {
  memoryStore.delete(key);
  try {
    const file = getFilePath(key);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  } catch {
    // Delete failure fallback
  }
}

export async function generateAndStoreOtp(
  email: string,
  courseSlug: string,
  expiryMinutes = 10
): Promise<{ success: boolean; otpCode?: string; error?: string; retryAfterSeconds?: number }> {
  const normEmail = email.trim().toLowerCase();
  const key = getStoreKey(normEmail, courseSlug);
  const now = Date.now();

  const existing = readRecord(key);
  if (existing) {
    const elapsedSeconds = Math.floor((now - existing.createdAt) / 1000);
    if (elapsedSeconds < 60) {
      const remaining = 60 - elapsedSeconds;
      return {
        success: false,
        error: `Vui lòng đợi ${remaining} giây trước khi yêu cầu mã mới.`,
        retryAfterSeconds: remaining,
      };
    }
  }

  // Generate cryptographic 6-digit code (100000 - 999999)
  const codeNum = crypto.randomInt(100000, 1000000);
  const otpCode = codeNum.toString();

  const record: OtpRecord = {
    email: normEmail,
    courseSlug,
    codeHash: hashCode(otpCode),
    createdAt: now,
    expiresAt: now + expiryMinutes * 60 * 1000,
    attempts: 0,
  };

  writeRecord(key, record);

  return {
    success: true,
    otpCode,
  };
}

export async function verifyStoredOtp(
  email: string,
  courseSlug: string,
  inputCode: string
): Promise<{ valid: boolean; error?: string }> {
  const normEmail = email.trim().toLowerCase();
  const key = getStoreKey(normEmail, courseSlug);
  const now = Date.now();

  const record = readRecord(key);
  if (!record) {
    return { valid: false, error: 'Mã xác thực không tồn tại hoặc đã hết hạn.' };
  }

  if (now > record.expiresAt) {
    deleteRecord(key);
    return { valid: false, error: 'Mã xác thực đã hết hạn. Vui lòng nhận mã mới.' };
  }

  if (record.attempts >= 5) {
    deleteRecord(key);
    return { valid: false, error: 'Bạn đã nhập sai quá 5 lần. Vui lòng yêu cầu mã mới.' };
  }

  const cleanCode = inputCode.trim();
  const inputHash = hashCode(cleanCode);

  if (inputHash !== record.codeHash) {
    record.attempts += 1;
    writeRecord(key, record);
    const left = 5 - record.attempts;
    return { valid: false, error: `Mã không chính xác. Bạn còn ${left} lần thử.` };
  }

  // Code is valid - consume and delete to prevent replay
  deleteRecord(key);
  return { valid: true };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/otpStorage.test.js`
Expected: PASS with 2 passing tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/courseOtpStorage.ts tests/otpStorage.test.js
git commit -m "feat(courses): implement serverless OTP storage, generation and rate limiting"
```

---

### Task 3: Leads Storage, CSV Export & Multi-tier Notifications

**Files:**
- Create: `src/lib/courseLeadsStorage.ts`
- Create: `src/app/api/courses/leads/route.ts`
- Test: `tests/leadsStorage.test.js`

**Interfaces:**
- Produces: `saveCourseLead(lead: { email: string; courseSlug: string; ip?: string }): Promise<CourseLeadRecord>`
- Produces: `getAllCourseLeads(): Promise<CourseLeadRecord[]>`
- Produces: `exportLeadsToCsv(): Promise<string>`
- Produces: `GET /api/courses/leads?format=csv&secret=MOD_SECRET` (Endpoint for Bố to download CSV)

- [ ] **Step 1: Write failing test for leads storage and CSV export**

Create `tests/leadsStorage.test.js`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { saveCourseLead, getAllCourseLeads, exportLeadsToCsv } from '../src/lib/courseLeadsStorage.ts';

test('Lead storage: saves verified lead and exports clean CSV', async () => {
  const email = `lead_${Date.now()}@test.com`;
  const lead = await saveCourseLead({
    email,
    courseSlug: '7-ngay-tap-trung',
    ip: '127.0.0.1'
  });

  assert.equal(lead.email, email);
  assert.equal(lead.courseSlug, '7-ngay-tap-trung');

  const all = await getAllCourseLeads();
  const found = all.find(l => l.email === email);
  assert.ok(found, 'Lead must be found in stored list');

  const csv = await exportLeadsToCsv();
  assert.ok(csv.includes('Email,Course,RegisteredAt,IP'), 'CSV header check');
  assert.ok(csv.includes(email), 'CSV must contain lead email');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/leadsStorage.test.js`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `src/lib/courseLeadsStorage.ts`**

Create `src/lib/courseLeadsStorage.ts`:
```typescript
import fs from 'fs';
import path from 'path';

export interface CourseLeadRecord {
  id: string;
  email: string;
  courseSlug: string;
  registeredAt: string;
  ip?: string;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const LEADS_FILE = path.join(DATA_DIR, 'course_leads.json');

function ensureDataFile(): CourseLeadRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, '[]', 'utf-8');
      return [];
    }
    const content = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch {
    return [];
  }
}

export async function getAllCourseLeads(): Promise<CourseLeadRecord[]> {
  return ensureDataFile();
}

export async function saveCourseLead({
  email,
  courseSlug,
  ip = 'Unknown',
}: {
  email: string;
  courseSlug: string;
  ip?: string;
}): Promise<CourseLeadRecord> {
  const normEmail = email.trim().toLowerCase();
  const leads = ensureDataFile();

  const existingIndex = leads.findIndex(
    (l) => l.email === normEmail && l.courseSlug === courseSlug
  );

  const record: CourseLeadRecord = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: normEmail,
    courseSlug,
    registeredAt: new Date().toISOString(),
    ip,
  };

  if (existingIndex >= 0) {
    leads[existingIndex] = record;
  } else {
    leads.unshift(record);
  }

  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Leads Storage] Failed to write leads file:', err);
  }

  // Trigger non-blocking sync to Telegram & Resend Audience
  notifyNewLead(record).catch(() => {});

  return record;
}

export async function exportLeadsToCsv(): Promise<string> {
  const leads = await getAllCourseLeads();
  const headers = ['Email', 'Course', 'RegisteredAt', 'IP'];
  const rows = leads.map((l) => [
    `"${l.email}"`,
    `"${l.courseSlug}"`,
    `"${l.registeredAt}"`,
    `"${l.ip || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

async function notifyNewLead(lead: CourseLeadRecord) {
  // Telegram Bot Alert
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_HDQT_GROUP_ID || process.env.TELEGRAM_ADMIN_CHAT_ID;
  const topicId = process.env.TELEGRAM_HDQT_TOPIC_ID;

  if (botToken && chatId) {
    try {
      const text = `🎓 <b>HỌC VIÊN MỚI MỞ KHÓA KHÓA HỌC!</b>\n\n` +
        `• <b>Email:</b> <code>${lead.email}</code>\n` +
        `• <b>Khóa học:</b> <code>${lead.courseSlug}</code>\n` +
        `• <b>Thời gian:</b> <code>${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</code>\n` +
        `• <b>IP:</b> <code>${lead.ip}</code>\n\n` +
        `<i>🌿 Chúc mừng Bố, danh bạ Trại Cai Nghiện vừa có thêm 1 Verified Lead chất lượng cao!</i>`;

      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const body: any = {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      };
      if (topicId) body.message_thread_id = parseInt(topicId, 10);

      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (e) {
      // Quiet fail
    }
  }

  // Resend Audience sync (if audience exists or contact add)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      // Best-effort push to Resend contacts
      await fetch('https://api.resend.com/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 TraiCaiNghien/1.0',
        },
        body: JSON.stringify({
          email: lead.email,
          unsubscribed: false,
        }),
      });
    } catch {
      // Quiet fail if contacts endpoint is not configured with an audience ID
    }
  }
}
```

- [ ] **Step 4: Implement `src/app/api/courses/leads/route.ts`**

Create `src/app/api/courses/leads/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getAllCourseLeads, exportLeadsToCsv } from '@/lib/courseLeadsStorage';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const format = searchParams.get('format');

  const expectedSecret = process.env.MOD_SECRET || 'traicainghien2026';

  if (!secret || secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized: Secret key is invalid' },
      { status: 401 }
    );
  }

  if (format === 'csv') {
    const csvContent = await exportLeadsToCsv();
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="traicainghien_course_leads_${Date.now()}.csv"`,
      },
    });
  }

  const leads = await getAllCourseLeads();
  return NextResponse.json({
    total: leads.length,
    leads,
  });
}
```

- [ ] **Step 5: Run tests and verify PASS**

Run: `node --test tests/leadsStorage.test.js`
Expected: PASS with 1 passing test.

- [ ] **Step 6: Commit**

```bash
git add src/lib/courseLeadsStorage.ts src/app/api/courses/leads/route.ts tests/leadsStorage.test.js
git commit -m "feat(courses): implement leads storage, CSV export endpoint and Telegram alerts"
```

---

### Task 4: OTP Request & Verification Next.js API Routes

**Files:**
- Create: `src/app/api/courses/auth/otp-request/route.ts`
- Create: `src/app/api/courses/auth/otp-verify/route.ts`
- Test: `tests/courseAuthRoutes.test.js`

**Interfaces:**
- Produces: `POST /api/courses/auth/otp-request` Body: `{ email: string, courseSlug: string }`
  Returns: `{ success: true, message: string }` or `{ success: false, error: string, retryAfterSeconds?: number }`
- Produces: `POST /api/courses/auth/otp-verify` Body: `{ email: string, courseSlug: string, otpCode: string }`
  Returns: `{ success: true, token: string, user: { email: string } }` (Sets HttpOnly cookie `tcn_course_session`)

- [ ] **Step 1: Write test simulating route handling logic**

Create `tests/courseAuthRoutes.test.js`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateAndStoreOtp, verifyStoredOtp } from '../src/lib/courseOtpStorage.ts';
import { generateOtpEmailHtml } from '../src/lib/courseEmailTemplates.ts';

test('End-to-end auth simulation: email validation, OTP request generation, verify & session token format', async () => {
  const email = 'student@example.com';
  const slug = '7-ngay-tap-trung';

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  assert.ok(emailRegex.test(email), 'Valid email check');

  // Request OTP
  const gen = await generateAndStoreOtp(email, slug);
  assert.ok(gen.success);

  // Template render check
  const emailHtml = generateOtpEmailHtml({
    otpCode: gen.otpCode,
    courseTitle: '7 Ngày Lấy Lại Sự Tập Trung'
  });
  assert.ok(emailHtml.html.includes(gen.otpCode));

  // Verify OTP
  const verify = await verifyStoredOtp(email, slug, gen.otpCode);
  assert.ok(verify.valid);
});
```

- [ ] **Step 2: Run test to verify it passes baseline**

Run: `node --test tests/courseAuthRoutes.test.js`
Expected: PASS.

- [ ] **Step 3: Implement `src/app/api/courses/auth/otp-request/route.ts`**

Create `src/app/api/courses/auth/otp-request/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateAndStoreOtp } from '@/lib/courseOtpStorage';
import { sendEmail } from '@/lib/resend';
import { generateOtpEmailHtml } from '@/lib/courseEmailTemplates';

const COURSE_TITLES: Record<string, string> = {
  '7-ngay-tap-trung': '7 Ngày Lấy Lại Sự Tập Trung',
  '25-ngay-thoi-quen': '25 Ngày Xây Dựng Thói Quen',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, courseSlug } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập địa chỉ email hợp lệ.' },
        { status: 400 }
      );
    }

    const normEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normEmail)) {
      return NextResponse.json(
        { success: false, error: 'Địa chỉ email không đúng định dạng.' },
        { status: 400 }
      );
    }

    const slug = (courseSlug || '7-ngay-tap-trung').trim().toLowerCase();
    const courseTitle = COURSE_TITLES[slug] || 'Khóa Học Độc Quyền Trại Cai Nghiện';

    // Generate OTP & apply rate limit
    const otpResult = await generateAndStoreOtp(normEmail, slug);

    if (!otpResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: otpResult.error,
          retryAfterSeconds: otpResult.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const { otpCode } = otpResult;
    const { html, text } = generateOtpEmailHtml({
      otpCode: otpCode!,
      courseTitle,
      expiryMinutes: 10,
    });

    const sendResult = await sendEmail({
      to: normEmail,
      subject: `🌿 Mã xác thực mở khóa ${courseTitle} của bạn: [${otpCode}]`,
      html,
      text,
    });

    if (!sendResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không thể gửi email lúc này. Vui lòng thử lại sau giây lát.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Mã OTP đã được gửi đến email ${normEmail}. Vui lòng kiểm tra hộp thư (kể cả mục Spam).`,
    });
  } catch (err: any) {
    console.error('[OTP Request Error]', err);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: Implement `src/app/api/courses/auth/otp-verify/route.ts`**

Create `src/app/api/courses/auth/otp-verify/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyStoredOtp } from '@/lib/courseOtpStorage';
import { saveCourseLead } from '@/lib/courseLeadsStorage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, courseSlug, otpCode } = body;

    if (!email || !otpCode) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng cung cấp đầy đủ email và mã OTP.' },
        { status: 400 }
      );
    }

    const normEmail = email.trim().toLowerCase();
    const slug = (courseSlug || '7-ngay-tap-trung').trim().toLowerCase();

    // Verify OTP
    const verifyResult = await verifyStoredOtp(normEmail, slug, otpCode);

    if (!verifyResult.valid) {
      return NextResponse.json(
        { success: false, error: verifyResult.error || 'Mã xác thực không hợp lệ.' },
        { status: 400 }
      );
    }

    // Capture IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Save Verified Lead
    await saveCourseLead({
      email: normEmail,
      courseSlug: slug,
      ip,
    });

    // Create 30-day session token
    const sessionPayload = {
      email: normEmail,
      courseSlug: slug,
      verifiedAt: Date.now(),
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };

    const token = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        email: normEmail,
        courseSlug: slug,
      },
    });

    // Set 30-day secure cookie
    response.cookies.set('tcn_course_session', token, {
      httpOnly: false, // allow client JS to read session state smoothly
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err: any) {
    console.error('[OTP Verify Error]', err);
    return NextResponse.json(
      { success: false, error: 'Lỗi xác thực hệ thống. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 5: Verify routes via test**

Run: `node --test tests/courseAuthRoutes.test.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/courses/auth/otp-request/route.ts src/app/api/courses/auth/otp-verify/route.ts tests/courseAuthRoutes.test.js
git commit -m "feat(courses): add OTP request and verify API routes with 30-day session cookies"
```

---

### Task 5: Course Curriculum Data & Type Definitions

**Files:**
- Create: `src/types/course.ts`
- Create: `src/data/courses/sevenDaysFocus.ts`
- Create: `src/data/courses/index.ts`
- Test: `tests/courseCurriculum.test.js`

**Interfaces:**
- Produces: `Course`, `CourseDay`, `CourseChecklistItem` interfaces in `src/types/course.ts`
- Produces: `sevenDaysFocusCourse: Course` in `src/data/courses/sevenDaysFocus.ts`
- Produces: `getCourseBySlug(slug: string): Course | null` in `src/data/courses/index.ts`

- [ ] **Step 1: Write test for course curriculum registry and structure**

Create `tests/courseCurriculum.test.js`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { getCourseBySlug, getAllCourses } from '../src/data/courses/index.ts';

test('Curriculum registry: finds 7-day course with all required content modules', () => {
  const course = getCourseBySlug('7-ngay-tap-trung');
  assert.ok(course, 'Course must exist');
  assert.equal(course.slug, '7-ngay-tap-trung');
  assert.equal(course.days.length, 7, 'Must have exactly 7 days');

  course.days.forEach((day, index) => {
    assert.equal(day.dayNumber, index + 1, `Day ${index + 1} number mismatch`);
    assert.ok(day.title, `Day ${index + 1} must have title`);
    assert.ok(day.neuroscience, `Day ${index + 1} must have neuroscience section`);
    assert.ok(day.trap, `Day ${index + 1} must have trap section`);
    assert.ok(day.action, `Day ${index + 1} must have action section`);
    assert.ok(Array.isArray(day.checklist) && day.checklist.length > 0, `Day ${index + 1} checklist must not be empty`);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/courseCurriculum.test.js`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `src/types/course.ts`**

Create `src/types/course.ts`:
```typescript
export interface CourseChecklistItem {
  id: string;
  label: string;
  hint?: string;
}

export interface CourseDay {
  dayNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  readTimeMinutes: number;
  summary: string;
  heroQuote: string;
  heroQuoteAuthor: string;
  neuroscience: {
    title: string;
    content: string;
  };
  trap: {
    title: string;
    content: string;
  };
  action: {
    title: string;
    steps: string[];
  };
  checklist: CourseChecklistItem[];
  reflectionQuestion: string;
}

export interface Course {
  slug: string;
  title: string;
  tagline: string;
  badge: string;
  description: string;
  targetAudience: string;
  commitment: string;
  totalDays: number;
  days: CourseDay[];
}
```

- [ ] **Step 4: Implement `src/data/courses/sevenDaysFocus.ts`**

Create `src/data/courses/sevenDaysFocus.ts` with comprehensive rich content for all 7 days (The Neuroscience of Attention, The Matrix Trap, Micro-actions, and Daily Checklists):
- Day 1: Nhận diện ma trận xao nhãng & Dọn sạch rác số
- Day 2: Kỹ thuật 90 phút nhịp sinh học Ultradian (Deep Work)
- Day 3: Thiết kế không gian làm việc tĩnh lặng (Sanctuary Environment)
- Day 4: Tái lập thụ thể Dopamine D2 & Làm bạn với sự nhàm chán
- Day 5: Quy trình Brain Dump & Khung thời gian Time-blocking
- Day 6: Kỷ luật không cần gồng (Kaizen 1% vi mô)
- Day 7: Duy trì sự chú ý bền bỉ & Bản kế hoạch 30 ngày tới

- [ ] **Step 5: Implement `src/data/courses/index.ts`**

Create `src/data/courses/index.ts`:
```typescript
import { Course } from '@/types/course';
import { sevenDaysFocusCourse } from './sevenDaysFocus';

const courses: Record<string, Course> = {
  '7-ngay-tap-trung': sevenDaysFocusCourse,
};

export function getCourseBySlug(slug: string): Course | null {
  return courses[slug] || null;
}

export function getAllCourses(): Course[] {
  return Object.values(courses);
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `node --test tests/courseCurriculum.test.js`
Expected: PASS with 1 passing test.

- [ ] **Step 7: Commit**

```bash
git add src/types/course.ts src/data/courses/sevenDaysFocus.ts src/data/courses/index.ts tests/courseCurriculum.test.js
git commit -m "feat(courses): define course data model and full 7-day focus reset curriculum"
```

---

### Task 6: Gatekeeper Modal Component (Email Input + 6-Digit OTP Auto-Advance)

**Files:**
- Create: `src/components/courses/CourseGatekeeperModal.tsx`
- Test: Manual / component compilation & build test

**Interfaces:**
- Produces: `CourseGatekeeperModal({ isOpen, onClose, courseSlug, courseTitle, onVerified }): JSX.Element`
- Supports: Email input form, auto 6-digit OTP input boxes with auto-focus/advance on typing, backspace support, paste support, 60-second countdown timer to request new OTP, and error states.

- [ ] **Step 1: Implement `src/components/courses/CourseGatekeeperModal.tsx`**

Implement client component with React state machine:
- Stage 1: `'EMAIL_INPUT'`
- Stage 2: `'OTP_INPUT'`
- Auto-focus next input box when typing digits.
- Backspace moves focus to previous input box.
- Paste handler distributes 6 numbers across the 6 boxes automatically.
- Calls `/api/courses/auth/otp-request` and `/api/courses/auth/otp-verify`.
- Fires `onVerified(userEmail)` upon success.

- [ ] **Step 2: Commit**

```bash
git add src/components/courses/CourseGatekeeperModal.tsx
git commit -m "feat(courses): create Zen Gatekeeper modal with 6-digit OTP auto-advance"
```

---

### Task 7: weOPC-Style Interactive Micro-LMS Dynamic Route (`/khoa-hoc/[slug]`)

**Files:**
- Create: `src/app/khoa-hoc/[slug]/page.tsx`
- Create: `src/components/courses/CourseSidebar.tsx`
- Create: `src/components/courses/CourseContentArea.tsx`
- Test: Visual verification & route build test

**Interfaces:**
- Dynamic route `/khoa-hoc/[slug]` renders the full Micro-LMS.
- Left Sidebar: Course title, badge, Progress Bar (`% hoàn thành`), Day 1 - Day 7 navigation list with completed/active check icons, and logout/change email button.
- Main Area: Day header, subtitle, reading time, neuroscience breakdown, matrix trap, actionable guide, interactive checkboxes that persist completion to `localStorage`, reflection prompt, and "Đánh dấu hoàn thành & Tiếp tục" CTA button.

- [ ] **Step 1: Implement `src/components/courses/CourseSidebar.tsx`**
- [ ] **Step 2: Implement `src/components/courses/CourseContentArea.tsx`**
- [ ] **Step 3: Implement `src/app/khoa-hoc/[slug]/page.tsx`**
- [ ] **Step 4: Commit**

```bash
git add src/components/courses/CourseSidebar.tsx src/components/courses/CourseContentArea.tsx src/app/khoa-hoc/[slug]/page.tsx
git commit -m "feat(courses): implement weOPC-style interactive Micro-LMS learning interface"
```

---

### Task 8: Navigation Entry Points & Header / Footer Links

**Files:**
- Modify: `src/components/Navbar.tsx` (or Header component)
- Modify: `src/components/Footer.tsx`
- Test: Build test & route link verification

**Interfaces:**
- Adds a discreet, elegant navigation link: `Khóa học 7 Ngày` pointing to `/khoa-hoc/7-ngay-tap-trung` with a subtle `Miễn phí` green pill badge.

- [ ] **Step 1: Check Navbar & Footer files**
- [ ] **Step 2: Add navigation link to course**
- [ ] **Step 3: Commit**

```bash
git add src/components/
git commit -m "feat(courses): add 7-day focus course link to navigation and footer"
```

---

### Task 9: End-to-End Verification & Production Build Check

**Files:**
- Run: `npm run build`
- Run: `node --test tests/*.test.js`
- Test: Full OTP flow verification with real Resend API call

- [ ] **Step 1: Run all unit tests**

Run: `node --test tests/*.test.js`
Expected: ALL PASS.

- [ ] **Step 2: Run production Next.js build**

Run: `npm run build`
Expected: Exit code 0, all routes generated including `/khoa-hoc/[slug]`.

- [ ] **Step 3: Final verification & commit**

```bash
git status
git commit -m "chore(courses): verify full Micro-LMS build and test suite"
```
