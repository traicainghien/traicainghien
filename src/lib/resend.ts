export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo = 'choenchoet22@gmail.com',
}: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Hỗ Trợ • Trại Cai Nghiện <hotro@traicainghien.com>';

  if (!apiKey) {
    console.error('[Resend] RESEND_API_KEY is not defined in environment variables.');
    return { success: false, error: 'RESEND_API_KEY is missing' };
  }

  try {
    const payload = {
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || '',
      reply_to: replyTo,
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TraiCaiNghien/1.0',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Resend Error]', data);
      return { success: false, error: data?.message || 'Failed to send email via Resend' };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('[Resend Network Error]', err);
    return { success: false, error: err?.message || 'Network exception when calling Resend' };
  }
}
