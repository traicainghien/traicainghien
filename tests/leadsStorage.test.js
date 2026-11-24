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
