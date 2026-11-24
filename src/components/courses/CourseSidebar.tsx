'use client';

import React from 'react';
import { Course, CourseDay } from '@/types/course';
import { CheckCircle2, Circle, PlayCircle, BookOpen, LogOut, ChevronRight, Award } from 'lucide-react';

interface CourseSidebarProps {
  course: Course;
  currentDayNumber: number;
  completedDays: number[];
  userEmail: string | null;
  onSelectDay: (dayNumber: number) => void;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export default function CourseSidebar({
  course,
  currentDayNumber,
  completedDays,
  userEmail,
  onSelectDay,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}: CourseSidebarProps) {
  const percentCompleted = Math.round((completedDays.length / course.totalDays) * 100);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-20 z-40 h-[100dvh] lg:h-[calc(100vh-5rem)] w-80 shrink-0 bg-[#FAF7F2] lg:bg-transparent border-r lg:border-r-0 border-[#EAE5DE] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full bg-[#FAF7F2] lg:rounded-2xl lg:border lg:border-[#EAE5DE] lg:shadow-sm overflow-hidden">
          {/* Header Card */}
          <div className="p-5 border-b border-[#EAE5DE] bg-gradient-to-b from-[#F2ECE1] to-[#FAF7F2]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3A5A40]/10 text-[#3A5A40] text-[11px] font-semibold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              {course.badge}
            </div>
            <h2 className="text-base font-serif font-bold text-[#2D312E] leading-snug">
              {course.title}
            </h2>

            {/* Progress Meter */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-stone-600 font-medium">Tiến độ của bạn</span>
                <span className="font-mono font-bold text-[#3A5A40]">
                  {completedDays.length}/{course.totalDays} ngày ({percentCompleted}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                <div
                  className="h-full bg-[#3A5A40] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentCompleted}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Item List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
            {course.days.map((day: CourseDay) => {
              const isSelected = day.dayNumber === currentDayNumber;
              const isCompleted = completedDays.includes(day.dayNumber);

              return (
                <button
                  key={day.dayNumber}
                  onClick={() => {
                    onSelectDay(day.dayNumber);
                    onCloseMobile();
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 group cursor-pointer ${
                    isSelected
                      ? 'bg-[#3A5A40] text-white shadow-sm'
                      : 'hover:bg-stone-200/60 text-stone-800'
                  }`}
                >
                  {/* Status Icon */}
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2
                        className={`w-5 h-5 ${
                          isSelected ? 'text-emerald-300' : 'text-emerald-600'
                        }`}
                      />
                    ) : isSelected ? (
                      <PlayCircle className="w-5 h-5 text-amber-200 animate-pulse" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 group-hover:text-stone-400" />
                    )}
                  </div>

                  {/* Day Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-mono font-semibold tracking-wider uppercase ${
                          isSelected ? 'text-stone-200' : 'text-stone-500'
                        }`}
                      >
                        NGÀY 0{day.dayNumber}
                      </span>
                      <span
                        className={`text-[10px] ${
                          isSelected ? 'text-stone-200' : 'text-stone-400'
                        }`}
                      >
                        {day.readTimeMinutes}p
                      </span>
                    </div>
                    <div
                      className={`text-xs md:text-sm font-medium leading-snug line-clamp-2 mt-0.5 ${
                        isSelected ? 'text-white' : 'text-stone-800'
                      }`}
                    >
                      {day.title}
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 mt-2 shrink-0 transition-transform ${
                      isSelected
                        ? 'text-white translate-x-0.5'
                        : 'text-stone-300 group-hover:text-stone-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* User Account & Logout Footer */}
          {userEmail && (
            <div className="p-3.5 border-t border-[#EAE5DE] bg-[#F7F3EB] flex items-center justify-between text-xs">
              <div className="min-w-0 pr-2">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                  Tài khoản học viên
                </div>
                <div className="text-stone-800 font-medium truncate" title={userEmail}>
                  {userEmail}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="shrink-0 p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Đăng xuất / Đổi email"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
