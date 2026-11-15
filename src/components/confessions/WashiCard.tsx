"use client";

import React, { useState } from 'react';
import { Confession, ReactionType, MoodTag, NoteColorTheme } from '@/types/confession';
import { Heart, Sparkles, RefreshCw, Undo2 } from 'lucide-react';

interface WashiCardProps {
  confession: Confession;
  onReact: (id: string, type: ReactionType) => void;
  userReactions?: Record<string, boolean>;
}

const MOOD_META: Record<MoodTag, { label: string; icon: string; badgeColor: string }> = {
  xao_nhang: {
    label: 'Xao nhãng số',
    icon: '🍃',
    badgeColor: 'bg-black/5 dark:bg-white/10 text-[#3A5A40] dark:text-[#78A380]',
  },
  tri_hoan: {
    label: 'Trì hoãn',
    icon: '⏳',
    badgeColor: 'bg-black/5 dark:bg-white/10 text-[#C27D53] dark:text-[#D48C62]',
  },
  kiet_que: {
    label: 'Kiệt quệ',
    icon: '🌧️',
    badgeColor: 'bg-black/5 dark:bg-white/10 text-[#556987] dark:text-[#96A7BD]',
  },
  dan_vat: {
    label: 'Tự trách',
    icon: '💔',
    badgeColor: 'bg-black/5 dark:bg-white/10 text-[#B84233] dark:text-[#E57373]',
  },
  hy_vong: {
    label: 'Hy vọng',
    icon: '🌱',
    badgeColor: 'bg-black/5 dark:bg-white/10 text-[#2E7D32] dark:text-[#81C784]',
  },
};

const THEMES: Record<
  string,
  {
    card: string;
    tape: string;
    actionBg: string;
    backBg: string;
  }
> = {
  yellow: {
    card: 'bg-[#FEF9C3] dark:bg-[#252212] border-[#FDE047]/60 dark:border-[#4E4416]',
    tape: 'bg-[#FACC15]/40 dark:bg-[#685B1B]/70 border-[#EAB308]/40 dark:border-[#857422]/60',
    actionBg: 'bg-[#FEF08A]/70 hover:bg-[#FEF08A] dark:bg-[#342F17] dark:hover:bg-[#433C1D]',
    backBg: 'bg-[#FEFCE8] dark:bg-[#1E1C0E]',
  },
  mint: {
    card: 'bg-[#DCFCE7] dark:bg-[#122418] border-[#86EFAC]/60 dark:border-[#1E4D2E]',
    tape: 'bg-[#4ADE80]/40 dark:bg-[#1C5C32]/70 border-[#22C55E]/40 dark:border-[#277843]/60',
    actionBg: 'bg-[#BBF7D0]/70 hover:bg-[#BBF7D0] dark:bg-[#1B3825] dark:hover:bg-[#234A31]',
    backBg: 'bg-[#F0FDF4] dark:bg-[#0E1E14]',
  },
  blue: {
    card: 'bg-[#E0F2FE] dark:bg-[#112230] border-[#7DD3FC]/60 dark:border-[#1A4566]',
    tape: 'bg-[#38BDF8]/40 dark:bg-[#1D5882]/70 border-[#0EA5E9]/40 dark:border-[#256F9F]/60',
    actionBg: 'bg-[#BAE6FD]/70 hover:bg-[#BAE6FD] dark:bg-[#1A374E] dark:hover:bg-[#224867]',
    backBg: 'bg-[#F0F9FF] dark:bg-[#0D1B26]',
  },
  rose: {
    card: 'bg-[#FFE4E6] dark:bg-[#2A1418] border-[#FDA4AF]/60 dark:border-[#541E28]',
    tape: 'bg-[#FB7185]/40 dark:bg-[#702130]/70 border-[#F43F5E]/40 dark:border-[#8E293C]/60',
    actionBg: 'bg-[#FECDD3]/70 hover:bg-[#FECDD3] dark:bg-[#3E1A22] dark:hover:bg-[#52212C]',
    backBg: 'bg-[#FFF1F2] dark:bg-[#210F13]',
  },
  lavender: {
    card: 'bg-[#F3E8FF] dark:bg-[#20132B] border-[#D8B4FE]/60 dark:border-[#462161]',
    tape: 'bg-[#C084FC]/40 dark:bg-[#5C2485]/70 border-[#A855F7]/40 dark:border-[#772FA8]/60',
    actionBg: 'bg-[#E9D5FF]/70 hover:bg-[#E9D5FF] dark:bg-[#321B45] dark:hover:bg-[#43235D]',
    backBg: 'bg-[#FAF5FF] dark:bg-[#190E22]',
  },
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

  // Map theme or fallback to yellow
  let themeKey = confession.cardColorTheme || 'yellow';
  if (themeKey === 'be') themeKey = 'yellow';
  if (themeKey === 'green') themeKey = 'mint';
  if (themeKey === 'terracotta') themeKey = 'rose';

  const theme = THEMES[themeKey] || THEMES.yellow;

  const isLongContent = confession.content.length > 220;
  const displayContent = !isExpanded && isLongContent
    ? confession.content.slice(0, 220) + '...'
    : confession.content;

  return (
    <div className="relative group perspective-[1000px] w-full pt-4 transition-transform duration-300 hover:-translate-y-1">
      {/* Visual Post-it Tape / Adhesive Strip on top */}
      <div
        className={`absolute left-1/2 -top-1 -translate-x-1/2 w-28 h-5 ${theme.tape} border-t border-b shadow-2xs rounded-xs pointer-events-none z-20 rotate-[-1deg] backdrop-blur-[1px]`}
      />

      {/* Sticky Note Container with 3D Flip */}
      <div
        className={`relative w-full rounded-xl border shadow-[2px_5px_15px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        } ${theme.card}`}
      >
        {/* ================= FRONT FACE ================= */}
        <div className="p-6 sm:p-7 flex flex-col justify-between min-h-[320px] [backface-visibility:hidden]">
          <div className="space-y-4">
            {/* Header: Mood Badge & Time */}
            <div className="flex items-center justify-between text-xs pb-1 border-b border-black/5 dark:border-white/10">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold text-[11px] ${moodInfo.badgeColor}`}>
                <span>{moodInfo.icon}</span>
                <span>{moodInfo.label}</span>
              </span>
              <span className="text-black/50 dark:text-white/50 text-[11px] font-medium">{timeLabel}</span>
            </div>

            {/* Handwritten / Note Content */}
            <p className="text-[#2D312E] dark:text-[#F0ECE6] text-[15px] sm:text-base leading-relaxed whitespace-pre-line font-serif italic text-opacity-95">
              "{displayContent}"
            </p>

            {isLongContent && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-semibold text-[#2D312E] dark:text-[#F0ECE6] underline hover:opacity-80"
              >
                {isExpanded ? 'Thu gọn' : 'Đọc thêm...'}
              </button>
            )}
          </div>

          {/* Bottom Actions on Sticky Note */}
          <div className="pt-5 border-t border-black/5 dark:border-white/10 space-y-3">
            {/* Flip Button */}
            <button
              type="button"
              onClick={() => setIsFlipped(true)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold text-[#2D312E] dark:text-[#F0ECE6] transition-all flex items-center justify-center gap-1.5 shadow-2xs border border-black/5 dark:border-white/10 ${theme.actionBg}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đọc lời vỗ về từ Mây</span>
            </button>

            {/* 3 Reaction Buttons styled like stickers */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onReact(confession.id, 'feel_you')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 border border-black/5 dark:border-white/10 ${
                  userReactions[`${confession.id}-feel_you`]
                    ? 'bg-[#3A5A40] text-white shadow-xs'
                    : `${theme.actionBg} text-[#2D312E] dark:text-[#F0ECE6]`
                }`}
                title="Mình hiểu cảm giác này"
              >
                <span className="text-sm">🫂</span>
                <span className="font-sans font-semibold">{confession.reactions.feel_you}</span>
              </button>

              <button
                type="button"
                onClick={() => onReact(confession.id, 'hug')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 border border-black/5 dark:border-white/10 ${
                  userReactions[`${confession.id}-hug`]
                    ? 'bg-[#C27D53] text-white shadow-xs'
                    : `${theme.actionBg} text-[#2D312E] dark:text-[#F0ECE6]`
                }`}
                title="Gửi bạn một cái ôm"
              >
                <span className="text-sm">🌿</span>
                <span className="font-sans font-semibold">{confession.reactions.hug}</span>
              </button>

              <button
                type="button"
                onClick={() => onReact(confession.id, 'not_alone')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 border border-black/5 dark:border-white/10 ${
                  userReactions[`${confession.id}-not_alone`]
                    ? 'bg-[#556987] text-white shadow-xs'
                    : `${theme.actionBg} text-[#2D312E] dark:text-[#F0ECE6]`
                }`}
                title="Bạn không hề đơn độc"
              >
                <span className="text-sm">🕯️</span>
                <span className="font-sans font-semibold">{confession.reactions.not_alone}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= BACK FACE (Lời vỗ về) ================= */}
        <div
          className={`absolute inset-0 p-6 sm:p-7 flex flex-col justify-between min-h-[320px] [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-xl border border-black/10 dark:border-white/15 ${theme.backBg}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3A5A40] dark:text-[#78A380] pb-2 border-b border-black/5 dark:border-white/10">
              <Sparkles className="w-4 h-4 text-[#C27D53] dark:text-[#D48C62]" />
              <span>Lời Vỗ Về Tự Trắc Ẩn Từ Mây</span>
            </div>

            <p className="text-sm sm:text-base text-[#2D312E] dark:text-[#F0ECE6] leading-relaxed font-sans">
              {confession.aiCompassionReply ||
                'Bạn không hề đơn độc trên hành trình này. Hãy thở một hơi thật sâu và tha thứ cho chính mình nhé.'}
            </p>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/10">
            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              className="w-full py-2.5 px-4 rounded-lg bg-[#3A5A40] dark:bg-[#527A59] text-white hover:bg-[#2F4A34] dark:hover:bg-[#63926B] text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Quay lại tờ note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
