export interface CatalogCourse {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tier: 'free' | 'vip';
  lessonsCount: string;
  duration: string;
  emoji: string;
  bgGradient: string;
  status: 'ready' | 'upcoming';
  href: string;
}

export const freeCourses: CatalogCourse[] = [
  {
    id: '7-ngay-tap-trung',
    slug: '7-ngay-tap-trung',
    title: '7 Ngày Lấy Lại Sự Tập Trung',
    subtitle: 'Dọn dẹp sương mù não, thoát khỏi bẫy dopamine ngắn và làm chủ sự chú ý sâu.',
    tier: 'free',
    lessonsCount: '7 ngày học',
    duration: '~5 phút đọc · 15 phút thực hành/ngày',
    emoji: '🎯',
    bgGradient: 'from-[#FDF0E6] via-[#FAF4EE] to-[#F5EEE6]',
    status: 'ready',
    href: '/khoa-hoc/7-ngay-tap-trung',
  },
  {
    id: '25-ngay-thoi-quen',
    slug: '25-ngay-thoi-quen',
    title: '25 Ngày Xây Dựng Thói Quen',
    subtitle: 'Ứng dụng Kaizen 1% và Thói quen nguyên tử để kiến tạo nếp sống kỷ luật không cần gồng.',
    tier: 'free',
    lessonsCount: '25 bài học',
    duration: '~5 phút đọc/ngày',
    emoji: '🌱',
    bgGradient: 'from-[#EBF5EE] via-[#F2F9F4] to-[#F7FCF9]',
    status: 'upcoming',
    href: '/khoa-hoc/7-ngay-tap-trung',
  },
  {
    id: 'chien-dich-man-hinh-tinh-lang',
    slug: 'man-hinh-tinh-lang',
    title: 'Chiến Dịch Màn Hình Tĩnh Lặng',
    subtitle: 'Gỡ bỏ 100% móc câu chú ý trên điện thoại, máy tính và thiết kế không gian làm việc sâu.',
    tier: 'free',
    lessonsCount: '5 bài học',
    duration: '~45 phút đọc · 20 phút làm',
    emoji: '⚡',
    bgGradient: 'from-[#F3EDF8] via-[#F7F3FA] to-[#FAF8FC]',
    status: 'upcoming',
    href: '/khoa-hoc/7-ngay-tap-trung',
  },
  {
    id: 'giai-ma-nao-bo-dopamine',
    slug: 'nao-bo-dopamine',
    title: 'Giải Mã Não Bộ Dopamine',
    subtitle: 'Hiểu cơ chế bập bênh thần kinh, hạ nhiệt kích thích siêu ngưỡng và trị chứng bồn chồn.',
    tier: 'free',
    lessonsCount: '6 bài học',
    duration: '~1 giờ đọc',
    emoji: '🧠',
    bgGradient: 'from-[#EAF2F8] via-[#F1F6FB] to-[#F7FAFD]',
    status: 'upcoming',
    href: '/khoa-hoc/7-ngay-tap-trung',
  },
];

export const vipCourses: CatalogCourse[] = [
  {
    id: 'deep-focus-protocol',
    slug: 'deep-focus-protocol',
    title: 'Deep Focus Protocol 90 Phút',
    subtitle: 'Hệ thống làm việc sâu đỉnh cao với nhịp sinh học Ultradian Rhythm và Mono-tasking.',
    tier: 'vip',
    lessonsCount: '12 bài chuyên sâu',
    duration: '~3 giờ học · Kèm bảng tính',
    emoji: '👑',
    bgGradient: 'from-[#FFF7ED] via-[#FEF3C7] to-[#FAF5E6]',
    status: 'upcoming',
    href: '#vip',
  },
  {
    id: 'giao-thuc-cat-con-nghien-sos',
    slug: 'sos-cat-con-nghien',
    title: 'Giao Thức Cắt Cơn Nghiện SOS 3 Phút',
    subtitle: 'Giao thức khẩn cấp cắt đứt xung động bốc đồng khi cơn thèm dopamine rẻ tiền ập đến.',
    tier: 'vip',
    lessonsCount: '8 bài chuyên sâu',
    duration: '~2 giờ đọc · Kèm audio SOS',
    emoji: '🛡️',
    bgGradient: 'from-[#FEF2F2] via-[#FFF5F5] to-[#FAF0F0]',
    status: 'upcoming',
    href: '#vip',
  },
  {
    id: 'tan-so-song-nao-binaural',
    slug: 'song-nao-binaural',
    title: 'Kho Tần Số Sóng Não Binaural Beats',
    subtitle: 'Thư viện âm thanh 4Hz - 10Hz kích hoạt sóng não Alpha & Theta đưa tâm trí vào dòng chảy.',
    tier: 'vip',
    lessonsCount: '10 audio lossless',
    duration: '~15 giờ âm thanh tĩnh tâm',
    emoji: '🎧',
    bgGradient: 'from-[#EEF2FF] via-[#F4F6FF] to-[#FAF8FF]',
    status: 'upcoming',
    href: '#vip',
  },
  {
    id: 'sprint-21-ngay-buddy',
    slug: 'sprint-21-ngay',
    title: 'Thử Thách Kỷ Luật 21 Ngày Có Buddy',
    subtitle: 'Ghép cặp 1-kèm-1 bạn đồng hành, check-in mỗi tối và chấm dứt sự cô đơn khi cai nghiện.',
    tier: 'vip',
    lessonsCount: 'Chương trình 21 ngày',
    duration: 'Đồng hành hàng ngày',
    emoji: '🤝',
    bgGradient: 'from-[#FDF2F8] via-[#FAF5F9] to-[#FBF8FA]',
    status: 'upcoming',
    href: '#vip',
  },
];
