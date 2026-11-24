import { NextRequest, NextResponse } from 'next/server';
import { generateAndStoreOtp } from '@/lib/courseOtpStorage';
import { sendEmail } from '@/lib/resend';
import { generateOtpEmailHtml } from '@/lib/courseEmailTemplates';

const COURSE_TITLES: Record<string, string> = {
  '7-ngay-tap-trung': '7 Ngày Lấy Lại Sự Tập Trung',
  '25-ngay-thoi-quen': '25 Ngày Xây Dựng Thói Quen',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, courseSlug } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập địa chỉ email hợp lệ.' },
        { status: 400 }
      );
    }

    const normEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normEmail)) {
      return NextResponse.json(
        { success: false, error: 'Địa chỉ email không đúng định dạng.' },
        { status: 400 }
      );
    }

    const slug = (courseSlug || '7-ngay-tap-trung').trim().toLowerCase();
    const courseTitle = COURSE_TITLES[slug] || 'Khóa Học Độc Quyền Trại Cai Nghiện';

    // Generate OTP & apply rate limit
    const otpResult = await generateAndStoreOtp(normEmail, slug);

    if (!otpResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: otpResult.error,
          retryAfterSeconds: otpResult.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const { otpCode } = otpResult;
    const { html, text } = generateOtpEmailHtml({
      otpCode: otpCode!,
      courseTitle,
      expiryMinutes: 10,
    });

    const sendResult = await sendEmail({
      to: normEmail,
      subject: `🌿 Mã xác thực mở khóa ${courseTitle} của bạn: [${otpCode}]`,
      html,
      text,
    });

    if (!sendResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không thể gửi email lúc này. Vui lòng thử lại sau giây lát.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Mã OTP đã được gửi đến email ${normEmail}. Vui lòng kiểm tra hộp thư (kể cả mục Spam).`,
    });
  } catch (err: any) {
    console.error('[OTP Request Error]', err);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
