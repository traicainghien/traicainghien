import React from 'react';
import type { Metadata } from 'next';
import CourseCatalogView from '@/components/courses/CourseCatalogView';

export const metadata: Metadata = {
  title: 'Khu Vực Học Tập & Rèn Luyện | Trại Cai Nghiện',
  description: 'Thư viện lộ trình rèn luyện, cai nghiện dopamine và phục hồi sự tập trung.',
};

export default function CoursesCatalogRootPage() {
  return <CourseCatalogView />;
}
