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
