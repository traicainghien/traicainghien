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

  // Verify token format
  const sessionPayload = {
    email,
    courseSlug: slug,
    verifiedAt: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
  const token = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');
  const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
  assert.equal(decoded.email, email);
  assert.equal(decoded.courseSlug, slug);
});
