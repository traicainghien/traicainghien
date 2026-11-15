"use client";

import React, { useState } from 'react';
import { Confession, ReactionType, MoodTag } from '@/types/confession';
import { Heart, Sparkles, RefreshCw, Undo2 } from 'lucide-react';

interface WashiCardProps {
  confession: Confession;
  onReact: (id: string, type: ReactionType) => void;
  userReactions?: Record<string, boolean>;
}

const MOOD_META: Record<MoodTag, { label: string; icon: string; badgeColor: string }> = {
  xao_nhang: { label: 'Xao nhãng số', icon: '🍃', badgeColor: 'bg-[#EBF0EC] text-[#3A5A40]' },
  tri_hoan: { label: 'Trì hoãn', icon: '⏳', badgeColor: 'bg-[#FDF3E7] text-[#C27D53]' },
  kiet_que: { label: 'Kiệt quệ', icon: '🌧️', badgeColor: 'bg-[#F0F2F5] text-[#556987]' },
  dan_vat: { label: 'Tự trách', icon: '💔', badgeColor: 'bg-[#FCEBEA] text-[#B84233]' },
  hy_vong: { label: 'Hy vọng', icon: '🌱', badgeColor: 'bg-[#EAF5EC] text-[#2E7D32]' },
};

function formatRelativeTime(dateString: string): string {
  try {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    return 'Gần đây';
  } catch {
    return 'Gần đây';
  }
}

export default function WashiCard({ confession, onReact, userReactions = {} }: WashiCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const moodInfo = MOOD_META[confession.moodTag] || MOOD_META.xao_nhang;
  const timeLabel = formatRelativeTime(confession.createdAt);

  const themeClasses = {
    be: 'bg-[#FAF7F2] border-[#E8E2D5]',
    green: 'bg-[#F2F5F3] border-[#D8DFDA]',
    terracotta: 'bg-[#FAF4F0] border-[#EBDDD6]',
  }[confession.cardColorTheme || 'be'];

  const tapeColor = {
    be: 'bg-[#E5DFCF]/80 border-[#D2CABA]',
    green: 'bg-[#DCE5DE]/80 border-[#C5D2C8]',
    terracotta: 'bg-[#E8DCD4]/80 border-[#D5C2B6]',
  }[confession.cardColorTheme || 'be'];

  const isLongContent = confession.content.length > 220;
  const displayContent = !isExpanded && isLongContent
    ? confession.content.slice(0, 220) + '...'
    : confession.content;

  return (
    <div className="relative group perspective-[1000px] w-full pt-4">
      {/* Visual Washi Tape on top */}
      <div
        className={`absolute left-1/2 -top-1 -translate-x-1/2 w-24 h-5 ${tapeColor} border-t border-b shadow-xs rounded-xs pointer-events-none z-20 rotate-[-1.5deg] backdrop-blur-[1px]`}
      />

      {/* Card Container with 3D Flip */}
      <div
        className={`relative w-full rounded-2xl border shadow-xs transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        } ${themeClasses}`}
      >
        {/* ================= FRONT FACE ================= */}
        <div className="p-6 sm:p-7 flex flex-col justify-between min-h-[320px] [backface-visibility:hidden]">
          <div className="space-y-4">
            {/* Header: Mood Tag & Relative Time */}
            <div className="flex items-center justify-between text-xs pb-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium ${moodInfo.badgeColor}`}>
                <span>{moodInfo.icon}</span>
                <span>{moodInfo.label}</span>
              </span>
              <span className="text-[#8C9490]">{timeLabel}</span>
            </div>

            {/* Content text */}
            <p className="text-[#2D312E] text-base leading-relaxed whitespace-pre-line font-serif italic text-opacity-95">
              "{displayContent}"
            </p>

            {isLongContent && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-semibold text-[#3A5A40] hover:underline"
              >
                {isExpanded ? 'Thu gọn' : 'Đọc thêm...'}
              </button>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-black/5 space-y-4">
            {/* Flip Button to see May's Compassion Note */}
            <button
              type="button"
              onClick={() => setIsFlipped(true)}
              className="w-full py-2 px-3 rounded-xl bg-white/70 hover:bg-white text-xs font-medium text-[#3A5A40] border border-black/5 transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đọc lời vỗ về từ Mây</span>
            </button>

            {/* 3 Non-Toxic Reactions */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onReact(confession.id, 'feel_you')}
                className={`py-1.5 px-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  userReactions[`${confession.id}-feel_you`]
                    ? 'bg-[#3A5A40] text-white shadow-xs'
                    : 'bg-white/60 hover:bg-white text-[#2D312E] border border-black/5'
                }`}
                title="Mình hiểu cảm giác này"
              >
                <span className="text-sm">🫂</span>
                <span className="font-sans font-semibold">{confession.reactions.feel_you}</span>
              </button>

              <button
                type="button"
                onClick={() => onReact(confession.id, 'hug')}
                className={`py-1.5 px-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  userReactions[`${confession.id}-hug`]
                    ? 'bg-[#C27D53] text-white shadow-xs'
                    : 'bg-white/60 hover:bg-white text-[#2D312E] border border-black/5'
                }`}
                title="Gửi bạn một cái ôm"
              >
                <span className="text-sm">🌿</span>
                <span className="font-sans font-semibold">{confession.reactions.hug}</span>
              </button>

              <button
                type="button"
                onClick={() => onReact(confession.id, 'not_alone')}
                className={`py-1.5 px-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  userReactions[`${confession.id}-not_alone`]
                    ? 'bg-[#556987] text-white shadow-xs'
                    : 'bg-white/60 hover:bg-white text-[#2D312E] border border-black/5'
                }`}
                title="Bạn không hề đơn độc"
              >
                <span className="text-sm">🕯️</span>
                <span className="font-sans font-semibold">{confession.reactions.not_alone}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= BACK FACE ================= */}
        <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between min-h-[320px] [transform:rotateY(180deg)] [backface-visibility:hidden] bg-[#FAF7F2] rounded-2xl border border-[#3A5A40]/20">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3A5A40] pb-2 border-b border-[#E6E1D8]">
              <Sparkles className="w-4 h-4 text-[#C27D53]" />
              <span>Lời Vỗ Về Tự Trắc Ẩn Từ Mây</span>
            </div>

            <p className="text-sm sm:text-base text-[#2D312E] leading-relaxed font-sans">
              {confession.aiCompassionReply || 'Bạn không hề đơn độc trên hành trình này. Hãy thở một hơi thật sâu và tha thứ cho chính mình nhé.'}
            </p>
          </div>

          <div className="pt-4 border-t border-black/5">
            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#3A5A40] text-white hover:bg-[#2F4A34] text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Quay lại mẩu tâm sự</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
