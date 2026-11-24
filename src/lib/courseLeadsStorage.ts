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
    } catch {
      // Quiet fail
    }
  }

  // Resend Audience sync (if audience exists or contact add)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
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
      // Quiet fail
    }
  }
}
