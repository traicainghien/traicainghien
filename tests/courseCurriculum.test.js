import test from 'node:test';
import assert from 'node:assert/strict';
import { sevenDaysFocusCourse } from '../src/data/courses/sevenDaysFocus.ts';

test('Curriculum registry: finds 7-day course with all required content modules', () => {
  const course = sevenDaysFocusCourse;
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
