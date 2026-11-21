import { NextRequest, NextResponse } from 'next/server';
import { moderateConfession } from '@/lib/confessionsStorage';
import { Confession } from '@/types/confession';

const MOD_SECRET = process.env.MODERATION_SECRET || 'tcn-mod-secret-2026';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const token = searchParams.get('token');
  const dataParam = searchParams.get('data');

  if (token !== MOD_SECRET) {
    return new NextResponse('⛔ Không có quyền thực hiện thao tác này.', { status: 403 });
  }

  if (action !== 'approve' && action !== 'reject') {
    return new NextResponse('Thao tác không hợp lệ.', { status: 400 });
  }

  let fallbackData: Partial<Confession> | undefined;
  if (dataParam) {
    try {
      fallbackData = JSON.parse(Buffer.from(dataParam, 'base64url').toString('utf-8'));
    } catch (e) {
      console.warn('Could not parse fallback data in moderation link:', e);
    }
  }

  const updated = await moderateConfession(id, action, 'Bố Long', fallbackData);

  if (!updated) {
    return new NextResponse('Không tìm thấy bài tâm sự hoặc bài đã bị xóa.', { status: 404 });
  }

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kết quả duyệt tâm sự • Trại Cai Nghiện</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #FAF7F2;
      color: #2D312E;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #E6E1D8;
      border-radius: 20px;
      padding: 32px;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 20px;
      color: ${action === 'approve' ? '#3A5A40' : '#C27D53'};
      margin-bottom: 12px;
    }
    p {
      color: #6B726E;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    a {
      display: inline-block;
      background: #3A5A40;
      color: #FFFFFF;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${action === 'approve' ? '🌿' : '🛑'}</div>
    <h1>${action === 'approve' ? 'Đã duyệt bài thành công!' : 'Đã từ chối bài viết'}</h1>
    <p>
      ${
        action === 'approve'
          ? 'Bài tâm sự đã được xuất bản công khai lên Bức Tường Góc Tâm Sự. Độc giả đã có thể đọc và gửi cái ôm ấm áp.'
          : 'Bài tâm sự đã bị từ chối và sẽ không hiển thị trên website.'
      }
    </p>
    <a href="/goc-tam-su">Xem Bức Tường Góc Tâm Sự →</a>
  </div>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
