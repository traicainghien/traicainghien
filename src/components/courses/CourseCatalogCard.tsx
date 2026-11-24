'use client';

import React from 'react';
import Link from 'next/link';
import { CatalogCourse } from '@/data/coursesCatalog';
import { BookOpen, Lock, Sparkles, ArrowRight } from 'lucide-react';

interface CourseCatalogCardProps {
  course: CatalogCourse;
  onOpenVipModal: (courseTitle: string) => void;
}

export default function CourseCatalogCard({
  course,
  onOpenVipModal,
}: CourseCatalogCardProps) {
  const isVip = course.tier === 'vip';

  const handleClick = (e: React.MouseEvent) => {
    if (isVip) {
      e.preventDefault();
      onOpenVipModal(course.title);
    }
  };

  const cardContent = (
    <div className="flex flex-col h-full rounded-3xl overflow-hidden border border-[#EAE5DE] dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
      {/* Top Half: Pastel Gradient Banner with 3D Centered Emoji */}
      <div
        className={`h-36 sm:h-44 w-full bg-gradient-to-br ${course.bgGradient} flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]`}
      >
        <span className="text-5xl sm:text-6xl drop-shadow-sm select-none transform transition-transform group-hover:scale-110 duration-300">
          {course.emoji}
        </span>

        {/* Lock indicator for VIP */}
        {isVip && (
          <div className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm text-amber-700 shadow-sm">
            <Lock className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Bottom Half: Clean Course Info */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#2D312E] dark:text-[#F0ECE6] leading-snug group-hover:text-[#3A5A40] dark:group-hover:text-emerald-400 transition-colors">
            {course.title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-2">
            {course.subtitle}
          </p>
        </div>

        {/* Bottom Meta Row */}
        <div className="mt-5 pt-4 border-t border-[#F0ECE4] dark:border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="truncate max-w-[170px] sm:max-w-none">
              {course.lessonsCount} · {course.duration}
            </span>
          </div>

          <div>
            {isVip ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                ★ Trại Viên VIP
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Miễn phí
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isVip) {
    return (
      <div onClick={handleClick}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={course.href}>
      {cardContent}
    </Link>
  );
}
