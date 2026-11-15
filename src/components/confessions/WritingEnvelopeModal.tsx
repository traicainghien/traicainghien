"use client";

import React, { useState, useEffect } from 'react';
import { MoodTag } from '@/types/confession';
import { X, Send, Wind, Sparkles, ShieldCheck } from 'lucide-react';
import SuccessScreen from './SuccessScreen';

interface WritingEnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSuccess: () => void;
}

const MOODS: Array<{ id: MoodTag; label: string; icon: string }> = [
  { id: 'xao_nhang', label: 'Xao nhãng số', icon: '🍃' },
  { id: 'tri_hoan', label: 'Trì hoãn', icon: '⏳' },
  { id: 'kiet_que', label: 'Kiệt quệ', icon: '🌧️' },
  { id: 'dan_vat', label: 'Tự trách', icon: '💔' },
  { id: 'hy_vong', label: 'Hy vọng', icon: '🌱' },
];

export default function WritingEnvelopeModal({ isOpen, onClose, onPostSuccess }: WritingEnvelopeModalProps) {
  const [moodTag, setMoodTag] = useState<MoodTag>('xao_nhang');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPublicSubmitted, setIsPublicSubmitted] = useState(true);
  const [leadSaved, setLeadSaved] = useState(false);

  // Lead capture state
  const [wantGuide, setWantGuide] = useState(true);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Xử lý "Thả trôi vào hư không"
  const handleDissolve = () => {
    if (!content.trim()) {
      setErrorMessage('Hãy viết vài dòng trước khi thả trôi nhé.');
      return;
    }
    setErrorMessage('');
    setIsDissolving(true);

    setTimeout(() => {
      setIsDissolving(false);
      setIsPublicSubmitted(false);
      setShowSuccess(true);
    }, 1200);
  };

  // Xử lý gửi lên Bức Tường
  const handleSubmitPublic = async () => {
    if (content.trim().length < 10) {
      setErrorMessage('Tâm sự của bạn cần ít nhất 10 ký tự nhé.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/confessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodTag,
          content,
          isPublic: true,
          email: wantGuide && email ? email : undefined,
          wantHealingLetter: wantGuide,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi gửi bài');
      }

      setIsPublicSubmitted(true);
      setLeadSaved(!!data.data?.leadSaved);
      setShowSuccess(true);
      onPostSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Có lỗi xảy ra, bạn thử lại nhé.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setContent('');
    setEmail('');
    setShowSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-[#FAF7F2] rounded-3xl border border-[#E6E1D8] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute right-5 top-5 p-2 rounded-full text-[#8C9490] hover:text-[#2D312E] hover:bg-black/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {showSuccess ? (
          <SuccessScreen
            isPublic={isPublicSubmitted}
            leadSaved={leadSaved}
            onClose={handleResetAndClose}
          />
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-1.5 pt-2">
              <span className="text-2xl">✍️</span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2D312E]">
                Dán Một Tờ Giấy Lên Tường
              </h3>
              <p className="text-xs sm:text-sm text-[#6B726E]">
                Ở đây không có sự phán xét. Hãy viết ra thật lòng mọi trăn trở của bạn.
              </p>
            </div>

            {/* Step 1: Mood Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3A5A40]">
                1. Tâm trạng của bạn lúc này:
              </label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMoodTag(m.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                      moodTag === m.id
                        ? 'bg-[#3A5A40] text-white shadow-xs'
                        : 'bg-white text-[#2D312E] border border-[#E6E1D8] hover:border-[#3A5A40]/40'
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Content Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3A5A40]">
                  2. Trút bỏ tâm sự của bạn:
                </label>
                <span className="text-[11px] text-[#8C9490]">{content.length} ký tự</span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  isDissolving ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100'
                }`}
              >
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Điều gì đang khiến tâm trí bạn nặng nề nhất hôm nay? Có phải bạn lại lướt điện thoại đêm, hay đang né tránh một việc quan trọng? Cứ viết ra đây thật lòng nhé..."
                  className="w-full p-4 rounded-2xl bg-white border border-[#E6E1D8] focus:border-[#3A5A40] focus:ring-1 focus:ring-[#3A5A40] text-sm text-[#2D312E] placeholder-[#8C9490] leading-relaxed resize-none font-serif italic"
                />
              </div>

              {isDissolving && (
                <div className="text-center py-2 text-xs font-medium text-[#C27D53] animate-pulse">
                  🍃 Chữ đang tan biến vào hư không nhẹ nhõm...
                </div>
              )}
            </div>

            {/* Step 3: Lead Capture (Email for Dopamine Guide) */}
            <div className="p-4 rounded-2xl bg-white border border-[#E6E1D8] space-y-3">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wantGuide}
                  onChange={(e) => setWantGuide(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-xs border-gray-300 text-[#3A5A40] focus:ring-[#3A5A40]"
                />
                <span className="text-xs text-[#2D312E] leading-relaxed">
                  Nhận <b>Cẩm nang 7 Ngày Tái Lập Thụ Thể Dopamine</b> và thư hồi đáp dịu dàng từ Mây qua email.
                </span>
              </label>

              {wantGuide && (
                <div className="space-y-1.5 pt-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn (Ví dụ: ban@gmail.com)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6E1D8] focus:border-[#3A5A40] text-xs text-[#2D312E] placeholder-[#8C9490]"
                  />
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8C9490]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3A5A40]" />
                    <span>Email được bảo mật 100%, không bao giờ hiển thị trên bài viết.</span>
                  </div>
                </div>
              )}
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 font-medium text-center">{errorMessage}</p>
            )}

            {/* Actions: Dissolve vs Submit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={isSubmitting || isDissolving}
                onClick={handleDissolve}
                className="py-3 px-4 rounded-xl border border-[#E6E1D8] bg-white hover:bg-black/5 text-[#6B726E] text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2"
                title="Chữ sẽ mờ dần và biến mất, không lưu lại đâu cả"
              >
                <Wind className="w-4 h-4 text-[#C27D53]" />
                <span>Thả trôi vào hư không</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting || isDissolving}
                onClick={handleSubmitPublic}
                className="py-3 px-4 rounded-xl bg-[#3A5A40] hover:bg-[#2F4A34] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang gửi...' : 'Dán Lên Bức Tường'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
