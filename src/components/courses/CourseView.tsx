'use client';

import React, { useState, useEffect } from 'react';
import { Course, CourseDay } from '@/types/course';
import CourseSidebar from './CourseSidebar';
import CourseContentArea from './CourseContentArea';
import CourseGatekeeperModal from './CourseGatekeeperModal';
import {
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Menu,
  BookOpen,
  Compass,
  Zap,
} from 'lucide-react';

interface CourseViewProps {
  course: Course;
}

export default function CourseView({ course }: CourseViewProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentDayNumber, setCurrentDayNumber] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    setIsHydrated(true);
    if (typeof window === 'undefined') return;

    // Check localStorage
    const savedEmail = localStorage.getItem(`tcn_course_auth_${course.slug}`);
    if (savedEmail) {
      setUserEmail(savedEmail);
    }

    // Check completed days
    const savedCompleted = localStorage.getItem(`tcn_course_completed_${course.slug}`);
    if (savedCompleted) {
      try {
        setCompletedDays(JSON.parse(savedCompleted));
      } catch {}
    }
  }, [course.slug]);

  const handleVerified = (email: string) => {
    setUserEmail(email);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất khỏi khóa học trên thiết bị này?')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`tcn_course_auth_${course.slug}`);
        // Clear session cookie
        document.cookie = 'tcn_course_session=; path=/; max-age=0';
      }
      setUserEmail(null);
    }
  };

  const handleCompleteDay = (dayNum: number) => {
    if (!completedDays.includes(dayNum)) {
      const next = [...completedDays, dayNum];
      setCompletedDays(next);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`tcn_course_completed_${course.slug}`, JSON.stringify(next));
        } catch {}
      }
    }
  };

  const currentDay = course.days.find((d) => d.dayNumber === currentDayNumber) || course.days[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D312E]">
      {/* Gatekeeper Modal */}
      <CourseGatekeeperModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseSlug={course.slug}
        courseTitle={course.title}
        onVerified={handleVerified}
      />

      {!userEmail && isHydrated ? (
        /* ======================================================== */
        /* LANDING / GATEKEEPER VIEW (CHƯA ĐĂNG NHẬP)             */
        /* ======================================================== */
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          {/* Hero Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A5A40]/10 text-[#3A5A40] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {course.badge}
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#2D312E] tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="max-w-2xl mx-auto text-base md:text-lg text-stone-600 leading-relaxed font-sans">
              {course.tagline}
            </p>

            {/* Quick Metrics */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-stone-600">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#3A5A40]" />
                {course.commitment}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#C27D53]" />
                Lộ trình 7 ngày thực chiến
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                Khoa học thần kinh & Kaizen
              </span>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#3A5A40] hover:bg-[#2F4A34] text-white font-semibold text-base md:text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Bắt Đầu Học Miễn Phí Ngay
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="mt-3 text-xs text-stone-500">
                Nhận mã OTP qua email • Không cần tạo tài khoản rườm rà • Mở khóa ngay lập tức
              </p>
            </div>
          </div>

          {/* Curriculum Outline Preview */}
          <div className="mt-16 bg-white rounded-3xl p-6 md:p-10 border border-[#EAE5DE] shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2D312E]">
                Lộ Trình 7 Ngày Chuyển Hóa
              </h2>
              <p className="mt-2 text-xs md:text-sm text-stone-500">
                Mỗi ngày mở ra một nguyên lý khoa học thần kinh và một bài tập hành động vi mô
              </p>
            </div>

            <div className="space-y-3">
              {course.days.map((day) => (
                <div
                  key={day.dayNumber}
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-between p-4 rounded-xl border border-[#EAE5DE] hover:border-[#3A5A40]/40 bg-[#FAF7F2] hover:bg-stone-100/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3.5 min-w-0 pr-4">
                    <span className="px-2.5 py-1 rounded-lg bg-[#3A5A40]/10 text-[#3A5A40] text-xs font-mono font-bold shrink-0 mt-0.5">
                      NGÀY 0{day.dayNumber}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm md:text-base font-semibold text-stone-800 group-hover:text-[#3A5A40] transition-colors leading-snug">
                        {day.title}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 font-sans">
                        {day.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-stone-400 group-hover:text-[#3A5A40] shrink-0">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs hidden sm:inline font-medium">Nhập email mở khóa</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Callout */}
            <div className="mt-8 text-center pt-6 border-t border-[#EAE5DE]">
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-semibold text-[#3A5A40] hover:text-[#2F4A34] inline-flex items-center gap-1.5 underline cursor-pointer"
              >
                Nhập email của bạn để vào học Ngày 01 ngay ➔
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* weOPC INTERACTIVE MICRO-LMS (ĐÃ XÁC THỰC EMAIL)         */
        /* ======================================================== */
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          {/* Mobile Top Bar */}
          <div className="lg:hidden flex items-center justify-between p-3.5 mb-6 rounded-xl bg-white border border-[#EAE5DE] shadow-sm">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800 text-xs font-semibold cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              Mục lục 7 ngày
            </button>
            <span className="text-xs font-mono font-bold text-[#3A5A40]">
              Ngày {currentDayNumber}/7
            </span>
          </div>

          {/* Split View Container */}
          <div className="flex gap-8 items-start">
            {/* Left Sidebar */}
            <CourseSidebar
              course={course}
              currentDayNumber={currentDayNumber}
              completedDays={completedDays}
              userEmail={userEmail}
              onSelectDay={(dayNum) => setCurrentDayNumber(dayNum)}
              onLogout={handleLogout}
              isOpenMobile={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main Learning Content Area */}
            <CourseContentArea
              day={currentDay}
              totalDays={course.totalDays}
              isCompleted={completedDays.includes(currentDayNumber)}
              onCompleteDay={handleCompleteDay}
              onGoToNextDay={() => {
                if (currentDayNumber < course.totalDays) {
                  setCurrentDayNumber((prev) => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onGoToPrevDay={() => {
                if (currentDayNumber > 1) {
                  setCurrentDayNumber((prev) => prev - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
