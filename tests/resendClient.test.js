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
