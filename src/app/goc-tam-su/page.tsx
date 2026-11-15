"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Confession, ReactionType } from '@/types/confession';
import WashiCard from '@/components/confessions/WashiCard';
import MoodFilterBar from '@/components/confessions/MoodFilterBar';
import WritingEnvelopeModal from '@/components/confessions/WritingEnvelopeModal';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Send,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default function GocTamSuPage() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [activeMood, setActiveMood] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});

  const wallRef = useRef<HTMLDivElement>(null);

  // Load user reactions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tcn_user_reactions');
      if (saved) {
        setUserReactions(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  // Fetch approved confessions
  const loadConfessions = useCallback(async (mood: string) => {
    setIsLoading(true);
    try {
      const url = mood && mood !== 'all' ? `/api/confessions?mood=${mood}` : '/api/confessions';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setConfessions(json.data);
      }
    } catch (err) {
      console.error('Error loading confessions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfessions(activeMood);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [activeMood, loadConfessions]);

  // Handle reaction with optimistic update
  const handleReact = async (id: string, type: ReactionType) => {
    const key = `${id}-${type}`;
    if (userReactions[key]) return; // Already reacted

    // Optimistic update
    setConfessions((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            reactions: {
              ...c.reactions,
              [type]: (c.reactions[type] || 0) + 1,
            },
          };
        }
        return c;
      })
    );

    const updatedReactions = { ...userReactions, [key]: true };
    setUserReactions(updatedReactions);
    try {
      localStorage.setItem('tcn_user_reactions', JSON.stringify(updatedReactions));
    } catch (e) {}

    // Send to backend
    try {
      await fetch(`/api/confessions/${id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType: type }),
      });
    } catch (err) {
      console.error('Failed to sync reaction:', err);
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(confessions.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedConfessions = confessions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (wallRef.current) {
      wallRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-24">
      {/* 1. HERO HEADER */}
      <section className="pt-12 sm:pt-16 pb-10 px-4 sm:px-6 text-center border-b border-[#E6E1D8] dark:border-[#2E3531]">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#EBF0EC] text-[#3A5A40] dark:bg-[#222B25] dark:text-[#78A380]">
            <span>🌿 Trại Cai Nghiện</span> • <span>Bức Tường Ghi Chú Lắng Nghe</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#2D312E] dark:text-[#F0ECE6] tracking-tight leading-tight">
            Góc Tâm Sự • Không Phán Xét
          </h1>

          {/* Subtitle / Manifesto */}
          <p className="text-base sm:text-lg text-[#6B726E] dark:text-[#9DA39F] leading-relaxed max-w-2xl mx-auto">
            "Mỗi tờ note dán lại là một khoảnh khắc can đảm đối diện với chính mình. Hãy để lại gánh nặng của bạn ở đây, để bước tiếp nhẹ nhõm hơn."
          </p>

          {/* Central CTA to Write */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold text-white bg-[#3A5A40] hover:bg-[#2F4A34] dark:bg-[#527A59] dark:hover:bg-[#63926B] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5"
            >
              <Send className="w-4 h-4" />
              <span>✍️ Dán Một Tờ Note Lên Tường</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-[#6B726E] dark:text-[#9DA39F]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3A5A40] dark:text-[#78A380]" /> Hoàn toàn ẩn danh 100%
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#C27D53] dark:text-[#D48C62]" /> Tuyệt đối không phán xét
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#3A5A40] dark:text-[#78A380]" /> Nhận lời vỗ về từ Mây
            </span>
          </div>
        </div>
      </section>

      {/* 2. MOSAIC WALL FEED SECTION */}
      <section ref={wallRef} className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-24">
        {/* Mood Filter Pills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6E1D8] dark:border-[#2E3531] text-xs font-bold uppercase tracking-wider text-[#3A5A40] dark:text-[#78A380]">
            <div className="flex items-center gap-2">
              <span>📌</span>
              <span>BỨC TƯỜNG DÁN NOTE TÂM TƯ</span>
            </div>
            <span className="text-[#8C9490] dark:text-[#9DA39F] font-normal normal-case">
              {confessions.length} tờ note chia sẻ
            </span>
          </div>

          <MoodFilterBar
            activeMood={activeMood}
            onSelectMood={(mood) => setActiveMood(mood)}
          />
        </div>

        {/* The Grid */}
        {isLoading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 rounded-xl bg-[#FAF7F2] dark:bg-[#1D221F] border border-[#E6E1D8] dark:border-[#2E3531] animate-pulse p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="w-24 h-5 rounded-md bg-black/5 dark:bg-white/5" />
                  <div className="w-16 h-3 rounded-md bg-black/5 dark:bg-white/5" />
                </div>
                <div className="space-y-2 pt-2">
                  <div className="w-full h-3 rounded-md bg-black/5 dark:bg-white/5" />
                  <div className="w-5/6 h-3 rounded-md bg-black/5 dark:bg-white/5" />
                  <div className="w-4/6 h-3 rounded-md bg-black/5 dark:bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : confessions.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white dark:bg-[#1D221F] rounded-2xl border border-[#E6E1D8] dark:border-[#2E3531] space-y-4">
            <div className="text-4xl">🍃</div>
            <h3 className="text-lg font-bold text-[#2D312E] dark:text-[#F0ECE6] font-serif">
              Chưa có tờ note nào trong chủ đề này
            </h3>
            <p className="text-sm text-[#6B726E] dark:text-[#9DA39F] max-w-md mx-auto">
              Hãy là người đầu tiên dán lên bức tường một dòng tâm sự can đảm nhé.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3A5A40] dark:bg-[#527A59] text-white text-xs font-semibold hover:bg-[#2F4A34] dark:hover:bg-[#63926B]"
            >
              <span>Dán tờ note đầu tiên</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            {/* Actual Mosaic Wall Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-start">
              {paginatedConfessions.map((c) => (
                <WashiCard
                  key={c.id}
                  confession={c}
                  onReact={handleReact}
                  userReactions={userReactions}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E6E1D8] dark:border-[#2E3531]">
                <div className="text-xs text-[#8C9490] dark:text-[#9DA39F]">
                  Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, confessions.length)} trong số {confessions.length} tờ note
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Previous Page Button */}
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-2 rounded-lg border border-[#E6E1D8] dark:border-[#2E3531] bg-white dark:bg-[#1D221F] text-[#2D312E] dark:text-[#F0ECE6] hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    aria-label="Trang trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const isActive = page === currentPage;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-[#3A5A40] dark:bg-[#527A59] text-white shadow-xs'
                            : 'border border-[#E6E1D8] dark:border-[#2E3531] bg-white dark:bg-[#1D221F] text-[#2D312E] dark:text-[#F0ECE6] hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Next Page Button */}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-2 rounded-lg border border-[#E6E1D8] dark:border-[#2E3531] bg-white dark:bg-[#1D221F] text-[#2D312E] dark:text-[#F0ECE6] hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    aria-label="Trang sau"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* 3. BOTTOM CTA BANNER (COMMUNITY & LEAD FUNNEL) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF7F2] dark:bg-[#1D221F] border border-[#E6E1D8] dark:border-[#2E3531] shadow-xs text-center space-y-6 relative overflow-hidden">
          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-2xl">🌱</span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2D312E] dark:text-[#F0ECE6] leading-snug">
              Bạn Không Hề Đơn Độc Trong Cuộc Chiến Với
              <span className="block mt-1">Sự Mất Tập Trung</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#6B726E] dark:text-[#9DA39F] leading-relaxed">
              Trại Cai Nghiện xuất bản bản tin tâm lý học mỗi sáng lúc 8h30 và bức thư nhắc nhở đi ngủ dịu dàng lúc 22h00 trên kênh Telegram. Hãy tham gia cùng chúng mình nhé.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://t.me/traicainghiendaily"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#3A5A40] hover:bg-[#2F4A34] dark:bg-[#527A59] dark:hover:bg-[#63926B] transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Tham Gia Kênh Telegram Daily</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/trac-nghiem"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold border border-[#E6E1D8] dark:border-[#2E3531] text-[#2D312E] dark:text-[#F0ECE6] bg-white dark:bg-[#252C28] hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <span>Làm Bài Trắc Nghiệm Dopamine (3 phút)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FLOATING ACTION BUTTON (MOBILE ONLY) */}
      <div className="sm:hidden fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="p-4 rounded-full bg-[#3A5A40] dark:bg-[#527A59] text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          aria-label="Viết tâm sự"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* 5. MODAL FORM */}
      <WritingEnvelopeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostSuccess={() => loadConfessions(activeMood)}
      />
    </div>
  );
}
