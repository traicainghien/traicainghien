import { NextRequest, NextResponse } from 'next/server';
import { verifyStoredOtp } from '@/lib/courseOtpStorage';
import { saveCourseLead } from '@/lib/courseLeadsStorage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, courseSlug, otpCode } = body;

    if (!email || !otpCode) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng cung cấp đầy đủ email và mã OTP.' },
        { status: 400 }
      );
    }

    const normEmail = email.trim().toLowerCase();
    const slug = (courseSlug || '7-ngay-tap-trung').trim().toLowerCase();

    // Verify OTP
    const verifyResult = await verifyStoredOtp(normEmail, slug, otpCode);

    if (!verifyResult.valid) {
      return NextResponse.json(
        { success: false, error: verifyResult.error || 'Mã xác thực không hợp lệ.' },
        { status: 400 }
      );
    }

    // Capture IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Save Verified Lead
    await saveCourseLead({
      email: normEmail,
      courseSlug: slug,
      ip,
    });

    // Create 30-day session token
    const sessionPayload = {
      email: normEmail,
      courseSlug: slug,
      verifiedAt: Date.now(),
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };

    const token = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        email: normEmail,
        courseSlug: slug,
      },
    });

    // Set 30-day cookie
    response.cookies.set('tcn_course_session', token, {
      httpOnly: false, // allow client JS to read session state smoothly
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err: any) {
    console.error('[OTP Verify Error]', err);
    return NextResponse.json(
      { success: false, error: 'Lỗi xác thực hệ thống. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
