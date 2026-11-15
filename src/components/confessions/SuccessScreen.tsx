"use client";

import React from 'react';
import { CheckCircle2, Heart, ExternalLink, X } from 'lucide-react';

interface SuccessScreenProps {
  isPublic: boolean;
  leadSaved: boolean;
  onClose: () => void;
}

export default function SuccessScreen({ isPublic, leadSaved, onClose }: SuccessScreenProps) {
  return (
    <div className="space-y-6 text-center py-4">
      {/* Icon Badge */}
      <div className="w-16 h-16 mx-auto rounded-full bg-[#EBF0EC] text-[#3A5A40] flex items-center justify-center text-3xl shadow-xs">
        🌿
      </div>

      {/* Title & Message */}
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2D312E]">
          {isPublic ? 'Tâm Sự Đã Được Gửi An Toàn' : 'Gánh Nặng Đã Được Thả Trôi'}
        </h3>
        <p className="text-sm sm:text-base text-[#6B726E] leading-relaxed max-w-md mx-auto">
          {isPublic
            ? 'Cảm ơn bạn đã dũng cảm thành thật với chính mình hôm nay. Mây sẽ sớm duyệt và dán mẩu giấy của bạn lên Bức Tường để cộng đồng cùng gửi gắm cái ôm ấm áp nhé.'
            : 'Những muộn phiền đã tan biến vào hư không. Hãy thở một hơi thật sâu và tha thứ cho chính mình nhé.'}
        </p>

        {leadSaved && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF4F0] text-[#C27D53] text-xs font-semibold mt-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cẩm nang 7 Ngày Reset Dopamine sẽ sớm gửi tới email của bạn!</span>
          </div>
        )}
      </div>

      {/* Social Action CTAs */}
      <div className="pt-4 border-t border-[#E6E1D8] space-y-3 text-left">
        <p className="text-xs uppercase font-bold tracking-wider text-[#3A5A40] text-center">
          Kết nối cùng cộng đồng Trại Cai Nghiện
        </p>

        {/* Facebook Fanpage CTA */}
        <a
          href="https://www.facebook.com/traicainghienvn2026"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2EFE8] border border-[#E6E1D8] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center shrink-0 text-xl font-bold">
            f
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-semibold text-[#2D312E] group-hover:text-[#1877F2] transition-colors">
                Thích Fanpage Facebook Trại Cai Nghiện
              </h4>
              <ExternalLink className="w-3.5 h-3.5 text-[#8C9490] group-hover:text-[#1877F2]" />
            </div>
            <p className="text-xs text-[#6B726E] mt-0.5 line-clamp-1">
              Nhận lời nhắc dịu dàng và bài học tâm lý hành vi mỗi ngày.
            </p>
          </div>
        </a>

        {/* Telegram Daily Channel CTA */}
        <a
          href="https://t.me/traicainghiendaily"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2EFE8] border border-[#E6E1D8] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#229ED9]/10 text-[#229ED9] flex items-center justify-center shrink-0 text-xl">
            ✈️
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-semibold text-[#2D312E] group-hover:text-[#229ED9] transition-colors">
                Kênh Telegram Trại Cai Nghiện Daily
              </h4>
              <ExternalLink className="w-3.5 h-3.5 text-[#8C9490] group-hover:text-[#229ED9]" />
            </div>
            <p className="text-xs text-[#6B726E] mt-0.5 line-clamp-1">
              Bản tin tâm lý học lúc 8h30 sáng & lời nhắc đi ngủ dịu dàng 22h00.
            </p>
          </div>
        </a>
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="w-full py-3 px-4 rounded-xl bg-[#3A5A40] text-white font-semibold text-sm hover:bg-[#2F4A34] transition-all shadow-xs"
      >
        Đóng và quay lại Bức Tường
      </button>
    </div>
  );
}
