import React from 'react';
import type { Metadata } from 'next';
import CourseCatalogView from '@/components/courses/CourseCatalogView';

export const metadata: Metadata = {
  title: 'Khu Vực Rèn Luyện & Khôi Phục Sự Tập Trung | Trại Cai Nghiện',
  description: 'Thư viện lộ trình rèn luyện, giải phóng khỏi xao nhãng số và khôi phục sự tập trung sâu.',
};

export default function CoursesCatalogRootPage() {
  return <CourseCatalogView />;
}
