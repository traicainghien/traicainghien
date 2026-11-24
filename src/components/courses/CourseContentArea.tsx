'use client';

import React, { useState, useEffect } from 'react';
import { CourseDay } from '@/types/course';
import {
  Brain,
  AlertTriangle,
  Flame,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Quote,
  HelpCircle,
  Share2,
} from 'lucide-react';

interface CourseContentAreaProps {
  day: CourseDay;
  totalDays: number;
  isCompleted: boolean;
  onCompleteDay: (dayNumber: number) => void;
  onGoToNextDay: () => void;
  onGoToPrevDay: () => void;
}

export default function CourseContentArea({
  day,
  totalDays,
  isCompleted,
  onCompleteDay,
  onGoToNextDay,
  onGoToPrevDay,
}: CourseContentAreaProps) {
  // Checklist local persistence
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storageKey = `tcn_checklist_day_${day.dayNumber}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      } else {
        setCheckedItems({});
      }
    } catch {
      setCheckedItems({});
    }
  }, [day.dayNumber]);

  const toggleCheck = (id: string) => {
    const next = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(next);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`tcn_checklist_day_${day.dayNumber}`, JSON.stringify(next));
      } catch {}
    }

    // Auto mark day complete if all items checked
    const allChecked = day.checklist.every((item) => next[item.id]);
    if (allChecked && !isCompleted) {
      onCompleteDay(day.dayNumber);
    }
  };

  const allItemsChecked = day.checklist.length > 0 && day.checklist.every((item) => checkedItems[item.id]);

  return (
    <div className="flex-1 min-w-0 max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAE5DE]">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#3A5A40] text-white text-xs font-mono font-bold tracking-wider uppercase">
            NGÀY 0{day.dayNumber} / 0{totalDays}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-stone-500">
            <Clock className="w-3.5 h-3.5" />
            {day.readTimeMinutes} phút đọc • {day.durationMinutes} phút thực hành
          </span>
        </div>

        {isCompleted && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đã hoàn thành bài học
          </span>
        )}
      </div>

      {/* Main Lesson Header */}
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#2D312E] tracking-tight leading-tight">
          {day.title}
        </h1>
        <p className="mt-3 text-base md:text-lg text-stone-600 leading-relaxed font-sans">
          {day.subtitle}
        </p>
      </div>

      {/* Zen Quote Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#F4EFE6] to-[#FAF7F2] border border-[#EAE5DE] relative overflow-hidden">
        <Quote className="absolute right-4 bottom-4 w-20 h-20 text-[#3A5A40]/10 pointer-events-none" />
        <p className="text-base md:text-lg font-serif italic text-[#2D312E] leading-relaxed relative z-10">
          &ldquo;{day.heroQuote}&rdquo;
        </p>
        <p className="mt-3 text-xs md:text-sm font-semibold tracking-wide text-[#C27D53] uppercase relative z-10">
          — {day.heroQuoteAuthor}
        </p>
      </div>

      {/* Module 1: The Neuroscience */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-[#EAE5DE] shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-[#3A5A40]">
          <Brain className="w-6 h-6 shrink-0" />
          <h2 className="text-lg md:text-xl font-serif font-bold text-[#2D312E]">
            {day.neuroscience.title}
          </h2>
        </div>
        <div className="prose prose-stone max-w-none text-stone-700 text-sm md:text-base leading-relaxed space-y-3 whitespace-pre-line font-sans">
          {day.neuroscience.content}
        </div>
      </section>

      {/* Module 2: The Trap */}
      <section className="bg-amber-50/40 rounded-2xl p-6 md:p-8 border border-amber-200/60 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-amber-800">
          <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600" />
          <h2 className="text-lg md:text-xl font-serif font-bold text-[#2D312E]">
            {day.trap.title}
          </h2>
        </div>
        <div className="prose prose-stone max-w-none text-stone-700 text-sm md:text-base leading-relaxed space-y-3 whitespace-pre-line font-sans">
          {day.trap.content}
        </div>
      </section>

      {/* Module 3: Micro-Action Guide */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-[#EAE5DE] shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 text-[#C27D53]">
          <Flame className="w-6 h-6 shrink-0" />
          <h2 className="text-lg md:text-xl font-serif font-bold text-[#2D312E]">
            {day.action.title}
          </h2>
        </div>
        <div className="space-y-3">
          {day.action.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DE]">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3A5A40] text-white text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm md:text-base text-stone-800 leading-relaxed font-sans">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Module 4: Interactive Daily Action Worksheet */}
      <section className="bg-gradient-to-b from-[#F9F6F0] to-[#FAF7F2] rounded-2xl p-6 md:p-8 border-2 border-[#3A5A40]/20 shadow-sm space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5 text-[#3A5A40]">
            <CheckSquare className="w-6 h-6 shrink-0" />
            <h2 className="text-lg md:text-xl font-serif font-bold text-[#2D312E]">
              Bảng Bài Tập Hành Động Hôm Nay
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Tự động lưu tiến độ trên máy của bạn
          </span>
        </div>

        <p className="text-xs md:text-sm text-stone-600">
          Hãy đánh dấu vào các ô bên dưới sau khi bạn đã thực tế hoàn thành từng hành động:
        </p>

        <div className="space-y-3">
          {day.checklist.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <label
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-50/70 border-emerald-300 text-stone-900 shadow-sm'
                    : 'bg-white border-[#EAE5DE] hover:border-stone-400 text-stone-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}} // handled by parent onClick
                  className="w-5 h-5 mt-0.5 rounded text-[#3A5A40] focus:ring-[#3A5A40] cursor-pointer"
                />
                <span className={`text-sm md:text-base font-medium leading-relaxed ${isChecked ? 'line-through text-stone-500' : ''}`}>
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Module 5: Mindful Reflection Question */}
      <div className="p-6 rounded-2xl bg-[#F4EFE6] border border-[#EAE5DE] flex items-start gap-3.5">
        <HelpCircle className="w-5 h-5 text-[#C27D53] shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#C27D53] mb-1">
            Câu Hỏi Tự Vấn Cuối Ngày
          </div>
          <p className="text-sm md:text-base text-stone-800 italic leading-relaxed">
            &ldquo;{day.reflectionQuestion}&rdquo;
          </p>
        </div>
      </div>

      {/* Bottom Action & Navigation Bar */}
      <div className="pt-6 border-t border-[#EAE5DE] flex flex-col sm:flex-row items-center justify-between gap-4">
        {day.dayNumber > 1 ? (
          <button
            onClick={onGoToPrevDay}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-200/50 text-stone-700 text-sm font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Ngày 0{day.dayNumber - 1}
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isCompleted && (
            <button
              onClick={() => onCompleteDay(day.dayNumber)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium shadow-sm transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Đánh dấu đã học xong
            </button>
          )}

          {day.dayNumber < totalDays && (
            <button
              onClick={() => {
                if (!isCompleted) onCompleteDay(day.dayNumber);
                onGoToNextDay();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#3A5A40] hover:bg-[#2F4A34] text-white text-sm font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Học Ngày Tiếp Theo ➔
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
