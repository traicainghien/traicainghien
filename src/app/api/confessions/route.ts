import { NextRequest, NextResponse } from 'next/server';
import { getApprovedConfessions, createConfession } from '@/lib/confessionsStorage';
import { ConfessionSubmission, MoodTag, Confession } from '@/types/confession';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9249970693:AAFnHi-ZCx7N576orPkdMqapeRLWfHQLH6Q';
const HDQT_GROUP_ID = process.env.TELEGRAM_HDQT_GROUP_ID || '-1004401199553';
const HDQT_TOPIC_ID = process.env.TELEGRAM_HDQT_TOPIC_ID || '19';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://traicainghien.com';
const MOD_SECRET = process.env.MODERATION_SECRET || 'tcn-mod-secret-2026';

const MOOD_NAMES: Record<MoodTag, string> = {
  xao_nhang: '🍃 Xao nhãng số & Nghiện màn hình',
  tri_hoan: '⏳ Trì hoãn & Né tránh công việc',
  kiet_que: '🌧️ Sương mù não & Kiệt quệ năng lượng',
  dan_vat: '💔 Dằn vặt & Tự trách bản thân',
  hy_vong: '🌱 Hy vọng & Bắt đầu lại',
};

const COMPASSION_TEMPLATES: Record<MoodTag, string[]> = {
  xao_nhang: [
    'Bạn không hề yếu đuối hay vô kỷ luật đâu. Bộ não chúng ta đang đối đầu với cả một ngành công nghiệp thuật toán nghìn tỷ đô tối ưu hóa để gây nghiện. Hôm nay bạn nhận ra điều đó đã là một bước thức tỉnh lớn rồi. Đêm nay, thử để điện thoại ở phòng khách và cắm sạc xa tầm với nhé.',
    'Cảm ơn bạn đã trút bỏ gánh nặng này. Sự chú ý của bạn là tài sản quý giá nhất, đừng tự trách mình khi lỡ đánh rơi nó. Hãy tha thứ cho bản thân, uống một ly nước ấm và hít thở thật sâu bạn nhé.',
  ],
  tri_hoan: [
    'Trì hoãn không phải vì lười biếng, mà là phản ứng tự vệ của não bộ khi cảm thấy quá tải hoặc sợ thất bại. Hãy bẻ nhỏ việc cần làm xuống mức 2 phút (Kaizen) và bắt đầu một việc thật nhỏ thôi nhé. Mây luôn ở đây cùng bạn.',
    'Bạn không cần phải gồng mình để hoàn hảo mọi thứ. Hãy chấp nhận sự dang dở của hôm nay và cho phép mình làm tiếp vào ngày mai với một tâm thế nhẹ nhàng hơn.',
  ],
  kiet_que: [
    'Khi cơ thể và tâm trí phát ra tín hiệu kiệt quệ, điều bạn cần là sự nghỉ ngơi đích thực, không phải là nhồi nhét thêm thông tin. Hãy buông điện thoại xuống, nhắm mắt lại và lắng nghe nhịp thở của mình nhé. Ôm bạn thật chặt!',
    'Bạn đã gồng gánh quá nhiều thời gian qua rồi. Cho phép mình được dừng lại, được yếu đuối một chút hôm nay không có gì là sai cả. Bạn xứng đáng được đối xử dịu dàng.',
  ],
  dan_vat: [
    'Tự trắc ẩn (Self-compassion) là chìa khóa duy nhất để chữa lành sự dằn vặt. Tái nghiện hay lỡ trượt chân là một phần tự nhiên của hành trình thay đổi. Đừng để 1 đêm lỡ lầm xóa sạch nỗ lực của bạn. Hãy đứng dậy phủi bụi và bước tiếp nhé.',
    'Tha thứ cho chính mình là món quà vĩ đại nhất bạn có thể tự trao tặng ngay lúc này. Bạn vẫn đang trên đường trở về phiên bản tốt nhất của mình.',
  ],
  hy_vong: [
    'Cảm ơn bạn đã thắp lên một đốm lửa ấm áp trên bức tường này! Khoảnh khắc bạn giành lại được quyền làm chủ tâm trí chính là nguồn cảm hứng lớn lao cho hàng ngàn bạn đọc khác cùng bước đi.',
    'Một thay đổi nhỏ 1% mỗi ngày sẽ tạo nên một con người hoàn toàn mới sau một năm. Chúc bạn luôn giữ vững sự tĩnh tại và tự do bên trong nhé!',
  ],
};

function generateCompassionReply(mood: MoodTag): string {
  const templates = COMPASSION_TEMPLATES[mood] || COMPASSION_TEMPLATES.xao_nhang;
  return templates[Math.floor(Math.random() * templates.length)];
}

async function sendTelegramApprovalNotification(
  confession: Confession,
  email?: string
) {
  try {
    const payloadData = Buffer.from(
      JSON.stringify({
        id: confession.id,
        slug: confession.slug,
        moodTag: confession.moodTag,
        content: confession.content,
        aiCompassionReply: confession.aiCompassionReply,
        cardColorTheme: confession.cardColorTheme,
        createdAt: confession.createdAt,
      })
    ).toString('base64url');

    const approveUrl = `${SITE_URL}/api/confessions/${confession.id}/moderate?action=approve&token=${MOD_SECRET}&data=${payloadData}`;
    const rejectUrl = `${SITE_URL}/api/confessions/${confession.id}/moderate?action=reject&token=${MOD_SECRET}`;

    const text = `🌿 <b>[GÓC TÂM SỰ MỚI CẦN DUYỆT]</b>
⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}
🏷 <b>Chủ đề:</b> ${MOOD_NAMES[confession.moodTag] || confession.moodTag}
📧 <b>Email:</b> ${email ? `<code>${email}</code> (Đăng ký nhận cẩm nang)` : '<i>(Ẩn danh hoàn toàn)</i>'}

📝 <b>Nội dung tâm sự:</b>
<i>"${confession.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}"</i>

💬 <b>Lời vỗ về từ Mây:</b>
<i>"${confession.aiCompassionReply?.replace(/</g, '&lt;').replace(/>/g, '&gt;')}"</i>

👉 <i>Bố hoặc Mây bấm nút bên dưới để duyệt cho bài hiển thị lên website:</i>`;

    const payload = {
      chat_id: HDQT_GROUP_ID,
      message_thread_id: parseInt(HDQT_TOPIC_ID, 10),
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Duyệt Lên Web', url: approveUrl },
            { text: '❌ Từ Chối', url: rejectUrl },
          ],
        ],
      },
    };

    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Telegram API error response:', errText);
    }
  } catch (error) {
    console.error('Failed to send Telegram moderation notification:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mood = searchParams.get('mood') || undefined;
    const confessions = await getApprovedConfessions(mood);

    return NextResponse.json({
      success: true,
      data: confessions,
      total: confessions.length,
    });
  } catch (error) {
    console.error('Error fetching confessions:', error);
    return NextResponse.json({ success: false, message: 'Lỗi tải dữ liệu tâm sự' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ConfessionSubmission = await request.json();

    if (!body.content || body.content.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: 'Nội dung tâm sự cần ít nhất 10 ký tự.' },
        { status: 400 }
      );
    }

    if (!body.moodTag) {
      body.moodTag = 'xao_nhang';
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Sinh lời hồi đáp tự trắc ẩn từ Mây
    const aiReply = generateCompassionReply(body.moodTag);

    // Lưu vào database
    const { confession, leadSaved } = await createConfession(body, ip, aiReply);

    // Nếu chọn chia sẻ lên cộng đồng, gửi duyệt qua Telegram
    if (body.isPublic) {
      await sendTelegramApprovalNotification(confession, body.email);
    }

    return NextResponse.json({
      success: true,
      message: body.isPublic
        ? 'Tâm sự của bạn đã được gửi an toàn vào Hốc Cây. Mây sẽ sớm đưa lên tường sau khi duyệt nhé!'
        : 'Tâm sự của bạn đã được thả trôi vào hư không nhẹ nhõm.',
      data: {
        id: confession.id,
        slug: confession.slug,
        aiCompassionReply: aiReply,
        leadSaved,
      },
    });
  } catch (error) {
    console.error('Error creating confession:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi bài.',
      },
      { status: 500 }
    );
  }
}
