'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mail, KeyRound, ArrowRight, ShieldCheck, RefreshCw, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface CourseGatekeeperModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseSlug: string;
  courseTitle: string;
  onVerified: (email: string) => void;
}

export default function CourseGatekeeperModal({
  isOpen,
  onClose,
  courseSlug,
  courseTitle,
  onVerified,
}: CourseGatekeeperModalProps) {
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown effect for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // Focus first OTP input when transitioning to OTP step
  useEffect(() => {
    if (step === 'OTP' && otpInputsRef.current[0]) {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  if (!isOpen) return null;

  // Handle Request OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const normEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!normEmail || !emailRegex.test(normEmail)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/courses/auth/otp-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normEmail, courseSlug }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Không thể gửi mã xác thực. Vui lòng thử lại.');
        if (data.retryAfterSeconds) {
          setCountdown(data.retryAfterSeconds);
        }
      } else {
        setStep('OTP');
        setCountdown(60);
        setSuccessMessage(`Mã xác thực đã được gửi tới ${normEmail}.`);
      }
    } catch {
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleDigitChange = (index: number, val: string) => {
    setError(null);
    const cleaned = val.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];

    if (!cleaned) {
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    newDigits[index] = cleaned[cleaned.length - 1]; // take the last digit entered
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (index < 5 && cleaned) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // If all 6 digits are filled, automatically verify
    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) {
      handleVerifyOtp(fullCode);
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Handle Paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pasted.length >= 6) {
      const digits = pasted.slice(0, 6).split('');
      setOtpDigits(digits);
      otpInputsRef.current[5]?.focus();
      handleVerifyOtp(digits.join(''));
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length < 6) {
      setError('Vui lòng nhập đủ 6 chữ số mã xác thực.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/courses/auth/otp-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          courseSlug,
          otpCode: code,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Mã xác thực không đúng hoặc đã hết hạn.');
      } else {
        // Save session locally as fallback
        if (typeof window !== 'undefined') {
          localStorage.setItem(`tcn_course_auth_${courseSlug}`, email.trim().toLowerCase());
        }
        onVerified(email.trim().toLowerCase());
        onClose();
      }
    } catch {
      setError('Lỗi kết nối khi xác thực. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl border border-[#EAE5DE] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-full transition-colors z-10"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 md:p-8 bg-gradient-to-b from-[#F2ECE1] to-[#FAF7F2] border-b border-[#EAE5DE] text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A5A40]/10 text-[#3A5A40] text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Khóa Học Miễn Phí • Độc Quyền
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2D312E] tracking-tight">
            {courseTitle}
          </h2>
          <p className="mt-2 text-xs md:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
            Nhập email của bạn để nhận mã xác thực 6 số mở khóa toàn bộ hành trình học tập và bảng bài tập thực hành.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs md:text-sm flex items-start gap-2.5">
              <span className="text-amber-600 font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          {step === 'EMAIL' ? (
            /* STEP 1: EMAIL INPUT */
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-1.5">
                  Địa Chỉ Email Của Bạn
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ban@example.com"
                    required
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#DDD6CB] text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#3A5A40] focus:border-transparent transition-all text-sm md:text-base"
                  />
                </div>
                <p className="mt-2 text-[11px] text-stone-500 leading-normal">
                  🌿 Trại Cai Nghiện cam kết 100% không gửi thư rác, không chia sẻ dữ liệu với bên thứ ba.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#3A5A40] hover:bg-[#2F4A34] text-white font-medium text-sm md:text-base shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang gửi mã...
                  </>
                ) : (
                  <>
                    Nhận Mã Xác Thực Qua Email
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: 6-DIGIT OTP INPUT */
            <div className="space-y-5">
              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs md:text-sm flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-600">
                    Nhập 6 Số Mã Xác Thực
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('EMAIL');
                      setError(null);
                    }}
                    className="text-xs text-[#C27D53] hover:underline"
                  >
                    Đổi email khác
                  </button>
                </div>

                {/* 6 Digit Input Boxes */}
                <div className="flex justify-between gap-2 md:gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={idx === 0 ? handlePaste : undefined}
                      disabled={loading}
                      className="w-11 h-13 md:w-13 md:h-15 text-center text-xl md:text-2xl font-mono font-bold rounded-xl bg-white border border-[#DDD6CB] text-[#3A5A40] focus:outline-none focus:ring-2 focus:ring-[#3A5A40] focus:border-transparent transition-all shadow-sm"
                    />
                  ))}
                </div>
                <p className="mt-2 text-center text-[11px] text-stone-500">
                  Mã có hiệu lực trong 10 phút. Kiểm tra hộp thư Đến hoặc mục Quảng cáo/Spam.
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={loading || otpDigits.join('').length < 6}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#3A5A40] hover:bg-[#2F4A34] text-white font-medium text-sm md:text-base shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Xác Thực & Mở Khóa Khóa Học
                  </>
                )}
              </button>

              {/* Resend Countdown */}
              <div className="text-center pt-1">
                {countdown > 0 ? (
                  <p className="text-xs text-stone-500">
                    Gửi lại mã sau <span className="font-semibold text-stone-700">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRequestOtp()}
                    disabled={loading}
                    className="text-xs font-medium text-[#C27D53] hover:text-[#A15F37] underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Chưa nhận được mã? Bấm gửi lại
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Trust badges footer */}
          <div className="mt-6 pt-5 border-t border-[#EAE5DE] flex items-center justify-center gap-4 text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3A5A40]" />
              Bảo mật 100%
            </span>
            <span>•</span>
            <span>Miễn phí trọn đời</span>
            <span>•</span>
            <span>Không quảng cáo rác</span>
          </div>
        </div>
      </div>
    </div>
  );
}
