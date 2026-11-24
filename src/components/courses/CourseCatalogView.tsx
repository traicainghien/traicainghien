'use client';

import React, { useState } from 'react';
import { freeCourses, vipCourses } from '@/data/coursesCatalog';
import CourseCatalogCard from './CourseCatalogCard';
import VipMembershipModal from './VipMembershipModal';
import { Sparkles, Compass, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export default function CourseCatalogView() {
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string | undefined>(undefined);

  const handleOpenVip = (title: string) => {
    setSelectedCourseTitle(title);
    setIsVipModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#151816] text-[#2D312E] dark:text-[#F0ECE6] pb-24 transition-colors">
      <VipMembershipModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        selectedCourseTitle={selectedCourseTitle}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-12 sm:space-y-16">
        {/* Main Heading Area (Exactly like weOPC Khu vực học tập) */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#3A5A40]/10 text-[#3A5A40] dark:bg-[#527A59]/20 dark:text-emerald-400">
            <Compass className="w-3.5 h-3.5" />
            Hệ Thống Chuyển Hóa Hành Vi Thực Chiến
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2D312E] dark:text-[#F0ECE6] tracking-tight">
            Khu vực học tập & rèn luyện
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-2xl font-sans leading-relaxed">
            Khu miễn phí mở cho mọi thành viên. Khu nâng cao dành riêng cho Trại Viên Chiến Binh.
          </p>
        </div>

        {/* SECTION 1: KHU HỌC TẬP MIỄN PHÍ — MỌI THÀNH VIÊN */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#3A5A40] dark:text-emerald-400">
            <span>🧤 KHU HỌC TẬP MIỄN PHÍ — MỌI THÀNH VIÊN</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {freeCourses.map((course) => (
              <CourseCatalogCard
                key={course.id}
                course={course}
                onOpenVipModal={handleOpenVip}
              />
            ))}
          </div>
        </section>

        {/* SECTION 2: KHU KHÓA NÂNG CAO — DÀNH CHO TRẠI VIÊN CHIẾN BINH */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
            <span>🚀 KHU KHÓA NÂNG CAO — DÀNH CHO TRẠI VIÊN CHIẾN BINH</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {vipCourses.map((course) => (
              <CourseCatalogCard
                key={course.id}
                course={course}
                onOpenVipModal={handleOpenVip}
              />
            ))}
          </div>
        </section>

        {/* SECTION 3: MEMBERSHIP CALL TO ACTION BANNER */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#F5EFE6] via-[#FAF7F2] to-[#EFE8DC] dark:from-stone-900 dark:to-stone-950 border border-[#EAE5DE] dark:border-stone-800 shadow-md">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Gói Hội Viên Toàn Diện
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D312E] dark:text-[#F0ECE6]">
              Trở Thành Trại Viên Chiến Binh (Founding Member)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl mx-auto">
              Không mua lẻ từng khóa. Một tài khoản duy nhất mở khóa toàn bộ khóa nâng cao, kho âm thanh sóng não và quyền tham gia Sprint ghép cặp bạn đồng hành trọn đời.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedCourseTitle('Trọn Bộ Hội Viên Trại Viên Chiến Binh');
                  setIsVipModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#3A5A40] hover:bg-[#2F4A34] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Gia Nhập Ngay Chỉ 499k/năm
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
