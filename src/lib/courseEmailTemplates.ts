export interface OtpEmailOptions {
  otpCode: string;
  courseTitle: string;
  expiryMinutes?: number;
}

export function generateOtpEmailHtml({
  otpCode,
  courseTitle,
  expiryMinutes = 10,
}: OtpEmailOptions): { html: string; text: string } {
  const text = `Chào bạn,

Mã xác thực mở khóa khóa học "${courseTitle}" của bạn là: ${otpCode}

Mã có hiệu lực trong vòng ${expiryMinutes} phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.

Nếu bạn không yêu cầu mã này, bạn có thể yên tâm bỏ qua email này.

Thân ái,
Mây • Trại Cai Nghiện
Làm chủ sự tập trung, sống có chủ đích.
https://traicainghien.com`;

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã xác thực Trại Cai Nghiện</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #2D312E; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF7F2; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #EAE5DE; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);" cellspacing="0" cellpadding="0" border="0">
          <!-- Header Banner -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; background: linear-gradient(180deg, #F4EFE6 0%, #FFFFFF 100%); text-align: center; border-bottom: 1px solid #F0ECE4;">
              <div style="display: inline-block; padding: 6px 14px; background-color: #3A5A40; color: #FFFFFF; border-radius: 999px; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px;">
                Trại Cai Nghiện
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #2D312E; letter-spacing: -0.01em;">
                Mã Xác Thực Nhận Khóa Học
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #6E746E;">
                ${courseTitle}
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #2D312E;">
                Chào bạn,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #555D56; line-height: 1.6;">
                Bạn vừa đăng ký truy cập khóa học <strong>"${courseTitle}"</strong>. Dưới đây là mã xác thực 6 chữ số dùng để mở khóa không gian học tập độc quyền của bạn:
              </p>

              <!-- OTP Code Display Box -->
              <div style="background-color: #F8F5EE; border: 1px dashed #C27D53; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #C27D53; letter-spacing: 0.1em; margin-bottom: 8px;">
                  MÃ XÁC THỰC CỦA BẠN
                </div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #3A5A40; letter-spacing: 8px; margin: 0;">
                  ${otpCode}
                </div>
                <div style="font-size: 12px; color: #8C928B; margin-top: 10px;">
                  Mã có hiệu lực trong vòng <strong>${expiryMinutes} phút</strong>
                </div>
              </div>

              <p style="margin: 24px 0 0 0; font-size: 13px; color: #7B827A; line-height: 1.5;">
                • Nhập mã này tại cửa sổ đang mở trên website để vào học ngay.<br>
                • Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #FAF7F2; border-top: 1px solid #EAE5DE; text-align: center;">
              <p style="margin: 0; font-size: 13px; font-weight: 600; color: #3A5A40;">
                Mây • Trại Cai Nghiện
              </p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #8C928B;">
                Làm chủ sự tập trung, sống có chủ đích.
              </p>
              <p style="margin: 10px 0 0 0; font-size: 11px; color: #A4AAA2;">
                © 2026 traicainghien.com. Mọi quyền được bảo lưu.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { html, text };
}
