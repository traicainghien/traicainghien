const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const CONFESSIONS_FILE = path.join(DATA_DIR, 'confessions.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'confession_contacts.json');
const REACTIONS_FILE = path.join(DATA_DIR, 'confession_reactions.json');

console.log('🧪 Testing Confessions Storage Layer...');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const seedConfessions = [
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

if (!fs.existsSync(CONFESSIONS_FILE)) {
  fs.writeFileSync(CONFESSIONS_FILE, JSON.stringify(seedConfessions, null, 2), 'utf-8');
}
if (!fs.existsSync(CONTACTS_FILE)) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2), 'utf-8');
}
if (!fs.existsSync(REACTIONS_FILE)) {
  fs.writeFileSync(REACTIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

assert(fs.existsSync(CONFESSIONS_FILE), 'confessions.json must exist');
const confessions = JSON.parse(fs.readFileSync(CONFESSIONS_FILE, 'utf-8'));
assert(Array.isArray(confessions), 'confessions must be an array');
assert(confessions.length >= 6, 'Must have at least 6 initial seed confessions');

const first = confessions[0];
assert(first.id, 'id is required');
assert(first.moodTag, 'moodTag is required');
assert(first.content, 'content is required');
assert(first.reactions, 'reactions object is required');
assert(first.aiCompassionReply, 'aiCompassionReply is required');
assert(first.status === 'approved', 'Seed confessions must be approved');

console.log(`✅ Seed confessions verified: ${confessions.length} items`);
console.log(`✅ Sample mood: ${first.moodTag}, reactions: feel_you=${first.reactions.feel_you}`);
console.log('🎉 Task 1 Storage Layer tests PASSED completely!');
