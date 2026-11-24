'use client';

import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, Lock, Flame, Heart, Users } from 'lucide-react';

interface VipMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourseTitle?: string;
}

export default function VipMembershipModal({
  isOpen,
  onClose,
  selectedCourseTitle,
}: VipMembershipModalProps) {
  const [step, setStep] = useState<'FORM' | 'QR'>('FORM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('QR');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl border border-[#EAE5DE] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-full transition-colors z-10 cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 md:p-8 bg-gradient-to-b from-[#F9F3EA] to-[#FAF7F2] border-b border-[#EAE5DE] text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            ★ Gói Hội Viên Trại Viên Chiến Binh
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2D312E] tracking-tight">
            Mở Khóa Toàn Bộ Lộ Trình Chuyên Sâu
          </h2>
          {selectedCourseTitle && (
            <p className="mt-2 text-xs md:text-sm text-stone-600">
              Bạn đang chọn mở khóa: <strong className="text-[#3A5A40]">&ldquo;{selectedCourseTitle}&rdquo;</strong>
            </p>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          {step === 'FORM' ? (
            <>
              {/* Privilege Highlights */}
              <div className="p-4 rounded-2xl bg-white border border-[#EAE5DE] space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Đặc quyền trọn gói Hội Viên:
                </div>
                <ul className="space-y-2 text-xs md:text-sm text-stone-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3A5A40] shrink-0 mt-0.5" />
                    <span>Mở khóa 100% các khóa chuyên sâu hiện tại và mọi khóa mới ra mắt.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3A5A40] shrink-0 mt-0.5" />
                    <span>Kho 10 âm thanh sóng não tĩnh tâm Binaural Beats (Lossless).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3A5A40] shrink-0 mt-0.5" />
                    <span>Tham gia Sprint 21 ngày ghép cặp 1-kèm-1 bạn đồng hành.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3A5A40] shrink-0 mt-0.5" />
                    <span>Trọn bộ Notion Dashboard & Sổ tay hành vi cá nhân hóa.</span>
                  </li>
                </ul>
              </div>

              {/* Price Banner */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                <div>
                  <div className="text-xs font-medium text-amber-900">Chi phí đầu tư trọn gói 1 năm</div>
                  <div className="text-2xl font-serif font-bold text-amber-900">
                    499.000đ <span className="text-xs font-normal text-stone-500 font-sans">/ năm</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-200/80 text-amber-900 text-xs font-bold">
                  Tiết kiệm 70%
                </span>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-1">
                    Họ và tên của bạn
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD6CB] text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#3A5A40] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-1">
                    Địa chỉ Email nhận quyền truy cập
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD6CB] text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#3A5A40] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-1">
                    Số điện thoại / Zalo (để ghép cặp bạn đồng hành)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD6CB] text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#3A5A40] text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#3A5A40] hover:bg-[#2F4A34] text-white font-semibold text-sm md:text-base shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    'Đang khởi tạo...'
                  ) : (
                    <>
                      Nhận Mã Thanh Toán VietQR
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* STEP 2: VIETQR DEMO VIEW */
            <div className="space-y-5 text-center">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs md:text-sm">
                🎉 Thông tin đăng ký của <strong>{name}</strong> đã được ghi nhận thành công!
              </div>

              {/* VietQR Mock Card */}
              <div className="p-6 bg-white rounded-2xl border-2 border-dashed border-[#3A5A40]/30 space-y-3">
                <div className="text-xs uppercase font-bold tracking-wider text-stone-500">
                  MÃ QUÉT VIETQR CHUYỂN KHOẢN TỰ ĐỘNG
                </div>

                {/* QR Code Graphic Mock */}
                <div className="w-44 h-44 mx-auto bg-stone-100 rounded-xl border border-stone-200 flex flex-col items-center justify-center p-3">
                  <div className="w-full h-full bg-stone-900/5 rounded-lg flex flex-col items-center justify-center text-xs text-stone-500">
                    <span className="text-3xl mb-1">📱</span>
                    <span>VietQR Demo</span>
                    <span className="font-mono font-bold text-stone-700 mt-1">499,000 đ</span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 space-y-1 font-mono">
                  <div>Số tiền: <strong className="text-amber-800 text-sm">499.000 VNĐ</strong></div>
                  <div>Nội dung CK: <strong className="text-[#3A5A40] text-sm font-bold">TCN {phone.replace(/\s/g, '')}</strong></div>
                </div>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                🌿 Sau khi chuyển khoản, hệ thống sẽ tự động kích hoạt tài khoản VIP và gửi email xác nhận cho bạn qua <strong>{email}</strong> trong vòng 1-3 phút.
              </p>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-sm font-medium transition-colors cursor-pointer"
              >
                Đã hiểu & Đóng lại
              </button>
            </div>
          )}

          {/* Footer Security Badges */}
          <div className="pt-4 border-t border-[#EAE5DE] flex items-center justify-center gap-4 text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3A5A40]" />
              Bảo mật 100%
            </span>
            <span>•</span>
            <span>Không rủi ro</span>
            <span>•</span>
            <span>Hỗ trợ 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
}
