import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Confession, ConfessionSubmission, ContactLead, ReactionRecord, ReactionType, MoodTag } from '@/types/confession';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const CONFESSIONS_FILE = path.join(DATA_DIR, 'confessions.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'confession_contacts.json');
const REACTIONS_FILE = path.join(DATA_DIR, 'confession_reactions.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(CONFESSIONS_FILE)) {
    const seedConfessions: Confession[] = [
      {
        id: 'cf-seed-01',
        slug: 'lai-thuc-den-2h-sang-luot-short-video',
        moodTag: 'xao_nhang',
        content: 'Đêm qua mình lại lướt TikTok đến tận 2h30 sáng cay xè cả hai mắt. Cứ tự nhủ "thôi nốt video này rồi ngủ", nhưng ngón tay cứ tự động gạt lên như bị thôi miên. Sáng dậy đầu óc mục rỗng, trễ giờ làm và cả ngày hôm nay mình tự mắng bản thân thậm tệ.',
        createdAt: '2026-11-15T02:30:00.000Z',
        isPublic: true,
        status: 'approved',
        approvedAt: '2026-11-15T06:00:00.000Z',
        approvedBy: 'Mây (Tổng Biên Tập)',
        aiCompassionReply: 'Bạn không hề yếu đuối đâu. Bộ não sinh học của chúng ta chưa kịp tiến hóa để chống lại hàng ngàn kỹ sư thuật toán đang tối ưu hóa giật dây thần kinh mỗi 3 giây. Đêm nay, thử để điện thoại ở phòng khách và cắm sạc xa tầm với nhé. Hãy tha thứ cho chính mình, bạn đã vất vả rồi.',
        reactions: {
          feel_you: 142,
          hug: 98,
          not_alone: 65,
        },
        cardColorTheme: 'be',
      },
      {
        id: 'cf-seed-02',
        slug: 'mo-30-tab-nhung-khong-hoan-thanh-noi-mot-viec',
        moodTag: 'tri_hoan',
        content: 'Mình ngồi trước laptop từ 8h sáng với danh sách 5 việc quan trọng. Nhưng cứ làm được 3 phút là lại mở tab Facebook, nhảy sang YouTube nghe lofi, rồi lại check email. Giờ là 4h chiều, 30 tab vẫn mở mà không có việc nào xong hẳn. Cảm giác bất lực và ghét bản thân kinh khủng.',
        createdAt: '2026-11-15T09:15:00.000Z',
        isPublic: true,
        status: 'approved',
        approvedAt: '2026-11-15T10:00:00.000Z',
        approvedBy: 'Bố Long',
        aiCompassionReply: 'Hiện tượng nhảy tab liên tục là tiếng kêu cứu của não bộ khi bị kiệt quệ dopamine nền. Bạn không cần thêm ý chí để gồng lên, bạn chỉ cần giảm bớt kích thích. Thử đóng hết 29 tab, chỉ để lại duy nhất 1 việc và làm đúng 10 phút xem sao nhé. Mây tin bạn làm được.',
        reactions: {
          feel_you: 189,
          hug: 112,
          not_alone: 84,
        },
        cardColorTheme: 'green',
      },
      {
        id: 'cf-seed-03',
        slug: 'suong-mu-nao-va-cam-giac-cai-gi-cung-ngai',
        moodTag: 'kiet_que',
        content: 'Dạo này mình cảm thấy một màn sương mù dày đặc bao trùm tâm trí. Trí nhớ giảm sút, đọc một đoạn văn ngắn cũng phải đọc lại 3 lần mới hiểu. Ai rủ đi đâu cũng thấy ngán, chỉ muốn chui vào chăn trùm kín đầu ôm điện thoại nhưng xem xong lại càng mệt hơn.',
        createdAt: '2026-11-14T20:45:00.000Z',
        isPublic: true,
        status: 'approved',
        approvedAt: '2026-11-14T21:00:00.000Z',
        approvedBy: 'Mây (Tổng Biên Tập)',
        aiCompassionReply: 'Sương mù não (Brain Fog) là tín hiệu cơ thể đang xin được nghỉ ngơi thật sự. Lướt điện thoại trong chăn không phải là nghỉ ngơi, mà là nạp thêm rác số. Hãy cho phép mình uống một ly nước ấm, đi dạo 15 phút dưới ánh mặt trời sáng sớm để reset lại đồng hồ sinh học bạn nhé.',
        reactions: {
          feel_you: 215,
          hug: 178,
          not_alone: 130,
        },
        cardColorTheme: 'terracotta',
      },
      {
        id: 'cf-seed-04',
        slug: 'lai-tai-nghien-sau-10-ngay-co-gang',
        moodTag: 'dan_vat',
        content: 'Mình đã giữ được chuỗi 10 ngày không thức khuya, không lướt mạng xã hội vô thức. Vậy mà tối qua vì một chút buồn chuyện gia đình, mình lại buông xuôi và cày game suốt đêm. Cảm giác công sức 10 ngày qua đổ sông đổ biển khiến mình muốn bỏ cuộc luôn.',
        createdAt: '2026-11-14T14:10:00.000Z',
        isPublic: true,
        status: 'approved',
        approvedAt: '2026-11-14T15:30:00.000Z',
        approvedBy: 'Bố Long',
        aiCompassionReply: '10 ngày vừa qua không hề mất đi, các nơ-ron thần kinh mới đã bắt đầu hình thành rồi. Hồi phục không phải là một đường thẳng tắp, mà là học cách đứng dậy sau mỗi lần trượt chân. Đừng để 1 đêm lỡ lầm xóa bỏ 10 ngày nỗ lực của bạn. Ôm bạn thật chặt!',
        reactions: {
          feel_you: 96,
          hug: 145,
          not_alone: 82,
        },
        cardColorTheme: 'be',
      },
      {
        id: 'cf-seed-05',
        slug: 'hom-nay-minh-de-dien-thoai-trong-ngan-keo-4-tieng',
        moodTag: 'hy_vong',
        content: 'Hôm nay mình thử làm theo lời khuyên của bài viết trên Trại Cai Nghiện: cất điện thoại vào ngăn kéo và khóa lại trong 4 tiếng buổi sáng. Lần đầu tiên sau nhiều tháng, mình hoàn thành xong toàn bộ báo cáo tuần trước 11h30 trưa. Cảm giác tự do và tĩnh lặng thật sự rất kỳ diệu!',
        createdAt: '2026-11-15T11:45:00.000Z',
        isPublic: true,
        status: 'approved',
        approvedAt: '2026-11-15T12:00:00.000Z',
        approvedBy: 'Mây (Tổng Biên Tập)',
        aiCompassionReply: 'Chúc mừng bạn! Bạn vừa trải nghiệm cảm giác làm chủ tâm trí (Deep Work) đích thực. Khoảng lặng đó chính là mảnh đất màu mỡ để tái sinh sự tự do và năng lượng sống. Hãy ghi nhớ cảm giác tuyệt vời này để tiếp tục Kaizen mỗi ngày 1% nhé.',
        reactions: {
          feel_you: 130,
          hug: 168,
          not_alone: 95,
        },
        cardColorTheme: 'green',
      },
      {
        id: 'cf-seed-06',
        slug: 'so-bi-bo-roi-fomo-khi-khong-online',
        moodTag: 'xao_nhang',
        content: 'Mỗi khi tắt mạng hay không kiểm tra thông báo chừng 30 phút là tim mình đập nhanh, bồn chồn lo lắng sợ mình bỏ lỡ tin giật gân gì đó (FOMO). Giờ mình mới nhận ra mình không sợ lỡ tin tức, mình sợ cảm giác phải đối diện với sự im lặng và chính mình.',
        createdAt: '2026-11-13T18:20:00.000Z',
        isPublic: true,
        status: 'approved',
        approvedAt: '2026-11-13T19:00:00.000Z',
        approvedBy: 'Mây (Tổng Biên Tập)',
        aiCompassionReply: 'Nhận ra được nỗi sợ khoảng lặng đã là một bước tiến vĩ đại rồi. Sự im lặng không hề đáng sợ, nó là nơi tâm trí bạn được rửa sạch sau những giờ ngập trong ồn ào công nghiệp. Hãy thở cùng khoảng lặng đó một chút mỗi ngày nhé.',
        reactions: {
          feel_you: 110,
          hug: 85,
          not_alone: 76,
        },
        cardColorTheme: 'terracotta',
      },
    ];
    fs.writeFileSync(CONFESSIONS_FILE, JSON.stringify(seedConfessions, null, 2), 'utf-8');
  }

  if (!fs.existsSync(CONTACTS_FILE)) {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }

  if (!fs.existsSync(REACTIONS_FILE)) {
    fs.writeFileSync(REACTIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function hashIp(ip: string): string {
  const salt = 'traicainghien-wabi-sabi-2026';
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
}

export function generateSlug(content: string): string {
  const words = content
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 7)
    .join('-');
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${words || 'tam-su'}-${randomSuffix}`;
}

export async function getApprovedConfessions(mood?: string): Promise<Confession[]> {
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(CONFESSIONS_FILE, 'utf-8');
    const all: Confession[] = JSON.parse(raw);
    const approved = all.filter((c) => c.status === 'approved' && c.isPublic);

    let filtered = approved;
    if (mood && mood !== 'all') {
      filtered = approved.filter((c) => c.moodTag === mood);
    }

    // Sắp xếp mới nhất lên đầu
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error reading confessions:', error);
    return [];
  }
}

export async function getConfessionById(id: string): Promise<Confession | null> {
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(CONFESSIONS_FILE, 'utf-8');
    const all: Confession[] = JSON.parse(raw);
    return all.find((c) => c.id === id) || null;
  } catch (error) {
    return null;
  }
}

export async function createConfession(
  data: ConfessionSubmission,
  ip: string,
  aiReply?: string
): Promise<{ confession: Confession; leadSaved: boolean }> {
  ensureDataFiles();
  const raw = fs.readFileSync(CONFESSIONS_FILE, 'utf-8');
  const all: Confession[] = JSON.parse(raw);

  const colors: Array<'yellow' | 'mint' | 'rose' | 'blue' | 'lavender'> = [
    'yellow',
    'mint',
    'rose',
    'blue',
    'lavender',
  ];
  const colorTheme = colors[Math.floor(Math.random() * colors.length)];

  const newConfession: Confession = {
    id: `cf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    slug: generateSlug(data.content),
    moodTag: data.moodTag,
    content: data.content.trim(),
    createdAt: new Date().toISOString(),
    isPublic: data.isPublic,
    status: 'pending', // Luôn chờ duyệt qua Telegram
    aiCompassionReply: aiReply || 'Cảm ơn bạn đã dũng cảm thành thật với chính mình. Hãy thở một hơi thật sâu và đón nhận bản thân trọn vẹn nhé.',
    reactions: {
      feel_you: 1,
      hug: 1,
      not_alone: 1,
    },
    cardColorTheme: colorTheme,
  };

  all.unshift(newConfession);
  fs.writeFileSync(CONFESSIONS_FILE, JSON.stringify(all, null, 2), 'utf-8');

  // Lưu Lead Email nếu người dùng cung cấp
  let leadSaved = false;
  if (data.email && data.email.includes('@')) {
    try {
      const contactsRaw = fs.readFileSync(CONTACTS_FILE, 'utf-8');
      const contacts: ContactLead[] = JSON.parse(contactsRaw);
      const cleanEmail = data.email.trim().toLowerCase();

      const existingIndex = contacts.findIndex((c) => c.email === cleanEmail);
      if (existingIndex >= 0) {
        if (!contacts[existingIndex].tags.includes('LEAD_GOC_TAM_SU')) {
          contacts[existingIndex].tags.push('LEAD_GOC_TAM_SU');
        }
      } else {
        contacts.push({
          id: `lead-${Date.now()}`,
          email: cleanEmail,
          source: 'goc_tam_su',
          tags: ['LEAD_GOC_TAM_SU', `MOOD_${data.moodTag.toUpperCase()}`],
          createdAt: new Date().toISOString(),
          metadata: {
            wantHealingLetter: !!data.wantHealingLetter,
            firstConfessionId: newConfession.id,
          },
        });
      }
      fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf-8');
      leadSaved = true;
    } catch (e) {
      console.error('Error saving contact lead:', e);
    }
  }

  return { confession: newConfession, leadSaved };
}

export async function addReaction(
  id: string,
  type: ReactionType,
  ip: string
): Promise<{ success: boolean; counts: Record<ReactionType, number>; message?: string }> {
  ensureDataFiles();
  const raw = fs.readFileSync(CONFESSIONS_FILE, 'utf-8');
  const all: Confession[] = JSON.parse(raw);
  const target = all.find((c) => c.id === id);

  if (!target) {
    return { success: false, counts: { feel_you: 0, hug: 0, not_alone: 0 }, message: 'Không tìm thấy bài viết' };
  }

  // Chống spam: Kiểm tra IP hash trong confession_reactions.json
  const hashedIp = hashIp(ip);
  const reactionsRaw = fs.readFileSync(REACTIONS_FILE, 'utf-8');
  const reactions: ReactionRecord[] = JSON.parse(reactionsRaw);

  const existing = reactions.find(
    (r) => r.confessionId === id && r.reactionType === type && r.ipHash === hashedIp
  );

  if (existing) {
    // Đã bấm rồi, không tăng thêm để chống spam
    return { success: true, counts: target.reactions, message: 'Bạn đã gửi cảm xúc này rồi' };
  }

  // Tăng đếm
  target.reactions[type] = (target.reactions[type] || 0) + 1;
  reactions.push({
    confessionId: id,
    reactionType: type,
    ipHash: hashedIp,
    createdAt: new Date().toISOString(),
  });

  fs.writeFileSync(CONFESSIONS_FILE, JSON.stringify(all, null, 2), 'utf-8');
  fs.writeFileSync(REACTIONS_FILE, JSON.stringify(reactions, null, 2), 'utf-8');

  return { success: true, counts: target.reactions };
}

export async function moderateConfession(
  id: string,
  action: 'approve' | 'reject',
  reviewer: string
): Promise<Confession | null> {
  ensureDataFiles();
  const raw = fs.readFileSync(CONFESSIONS_FILE, 'utf-8');
  const all: Confession[] = JSON.parse(raw);
  const target = all.find((c) => c.id === id);

  if (!target) return null;

  target.status = action === 'approve' ? 'approved' : 'rejected';
  target.approvedAt = new Date().toISOString();
  target.approvedBy = reviewer;

  fs.writeFileSync(CONFESSIONS_FILE, JSON.stringify(all, null, 2), 'utf-8');
  return target;
}
