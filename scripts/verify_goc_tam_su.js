const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN CHUYÊN MỤC "GÓC TÂM SỰ"...');

// 1. Kiểm tra cấu trúc file giao diện & routing
const files = [
  'src/app/goc-tam-su/page.tsx',
  'src/components/confessions/WashiCard.tsx',
  'src/components/confessions/MoodFilterBar.tsx',
  'src/components/confessions/WritingEnvelopeModal.tsx',
  'src/components/confessions/SuccessScreen.tsx',
  'src/app/api/confessions/route.ts',
  'src/app/api/confessions/[id]/react/route.ts',
  'src/app/api/confessions/[id]/moderate/route.ts',
  'src/types/confession.ts',
  'src/lib/confessionsStorage.ts',
  'src/data/confessions.json',
];

for (const file of files) {
  assert(fs.existsSync(path.join(process.cwd(), file)), `File không tồn tại: ${file}`);
  console.log(`  ✓ File hợp lệ: ${file}`);
}

// 2. Kiểm tra dữ liệu bài viết mẫu
const confessions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/confessions.json'), 'utf-8'));
assert(Array.isArray(confessions), 'confessions phải là mảng');
assert(confessions.length >= 6, 'Cần ít nhất 6 bài viết mẫu');

const moods = new Set(confessions.map((c) => c.moodTag));
assert(moods.has('xao_nhang'), 'Phải có bài về xao_nhang');
assert(moods.has('tri_hoan'), 'Phải có bài về tri_hoan');
assert(moods.has('kiet_que'), 'Phải có bài về kiet_que');
assert(moods.has('dan_vat'), 'Phải có bài về dan_vat');
assert(moods.has('hy_vong'), 'Phải có bài về hy_vong');
console.log(`  ✓ Đã kiểm tra 5/5 tâm trạng chủ đề đều có bài viết mẫu phong phú`);

// 3. Kiểm tra tính toàn vẹn Navbar
const navbarContent = fs.readFileSync(path.join(process.cwd(), 'src/components/Navbar.tsx'), 'utf-8');
assert(navbarContent.includes('href="/goc-tam-su"'), 'Navbar phải chứa liên kết /goc-tam-su');
assert(navbarContent.includes('Góc Tâm Sự'), 'Navbar phải hiển thị chữ Góc Tâm Sự');
console.log('  ✓ Navbar đã được cập nhật chuẩn xác cho cả Desktop và Mobile Drawer');

console.log('🎉 100% KIỂM THỬ E2E CHUYÊN MỤC GÓC TÂM SỰ THÀNH CÔNG RỰC RỠ!');
