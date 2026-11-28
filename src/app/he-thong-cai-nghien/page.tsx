import React from 'react';
import type { Metadata } from 'next';
import CourseCatalogView from '@/components/courses/CourseCatalogView';

export const metadata: Metadata = {
  title: 'Hệ Thống Rèn Luyện & Lấy Lại Sự Tập Trung | Trại Cai Nghiện',
  description: 'Thư viện lộ trình rèn luyện, giải phóng khỏi xao nhãng số và khôi phục sự tập trung sâu. Khu miễn phí cho mọi thành viên, khu nâng cao dành riêng cho Trại Viên Chiến Binh.',
  openGraph: {
    title: 'Hệ Thống Rèn Luyện & Lấy Lại Sự Tập Trung | Trại Cai Nghiện',
    description: 'Thư viện lộ trình rèn luyện, giải phóng khỏi xao nhãng số và khôi phục sự tập trung sâu.',
    url: 'https://www.traicainghien.com/he-thong-cai-nghien',
    siteName: 'Trại Cai Nghiện',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function HeThongCaiNghienPage() {
  return <CourseCatalogView />;
}
