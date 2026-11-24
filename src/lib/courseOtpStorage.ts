import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import os from 'os';

export interface OtpRecord {
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
