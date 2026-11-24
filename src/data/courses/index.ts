import type { Course } from '../../types/course';
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
