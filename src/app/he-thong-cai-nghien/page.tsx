import React from 'react';
import type { Metadata } from 'next';
import CourseCatalogView from '@/components/courses/CourseCatalogView';

export const metadata: Metadata = {
  title: 'Hệ Thống Cai Nghiện & Khu Vực Học Tập | Trại Cai Nghiện',
  description: 'Thư viện lộ trình rèn luyện, cai nghiện dopamine và phục hồi sự tập trung. Khu miễn phí cho mọi thành viên, khu nâng cao dành riêng cho Trại Viên Chiến Binh.',
  openGraph: {
    title: 'Hệ Thống Cai Nghiện & Khu Vực Học Tập | Trại Cai Nghiện',
    description: 'Thư viện lộ trình rèn luyện, cai nghiện dopamine và phục hồi sự tập trung.',
    url: 'https://www.traicainghien.com/he-thong-cai-nghien',
    siteName: 'Trại Cai Nghiện',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function HeThongCaiNghienPage() {
  return <CourseCatalogView />;
}
