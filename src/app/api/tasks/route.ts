import { NextRequest, NextResponse } from 'next/server';
import { recordTaskExecution, getTodayTasksSummary, getAllTaskLogs } from '@/lib/tasksStorage';

const MOD_SECRET = process.env.MODERATION_SECRET || 'tcn-mod-secret-2026';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');
    const all = searchParams.get('all') === 'true';

    if (all) {
      return NextResponse.json({
        success: true,
        data: getAllTaskLogs(),
      });
    }

    const summary = getTodayTasksSummary();

    if (format === 'md' || format === 'text') {
      let md = `# 📊 BÁO CÁO CÁC TASK N8N TRẠI CAI NGHIỆN • ${summary.date}\n\n`;
      md += `> **Trạng thái chung:** ${summary.statusSummary}\n`;
      md += `> **Tổng số task hôm nay:** ${summary.total} (✅ ${summary.successCount} thành công, ❌ ${summary.errorCount} lỗi)\n\n`;

      if (summary.tasks.length === 0) {
        md += `*Chưa có task nào được ghi nhận hôm nay.*\n`;
      } else {
        md += `| Thời gian | Tác vụ | Kênh | Trạng thái | Chi tiết / Lỗi |\n`;
        md += `| :--- | :--- | :--- | :--- | :--- |\n`;
        for (const t of summary.tasks) {
          const statusIcon = t.status === 'success' ? '✅ Thành công' : '❌ Lỗi';
          const info = t.error ? `Lỗi: ${t.error}` : (t.title ? `Tiêu đề: ${t.title}` : '-');
          md += `| ${t.timeStr} | ${t.task} | ${t.channel} | ${statusIcon} | ${info} |\n`;
        }
      }

      return new NextResponse(md, {
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
      });
    }

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error in /api/tasks GET:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi tải dữ liệu task log' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.secret || request.headers.get('x-task-token');

    // Kiểm tra token xác thực bảo mật
    if (token !== MOD_SECRET && token !== 'tcn-secret-key-2026') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (!body.task) {
      return NextResponse.json(
        { success: false, message: 'Thiếu tên task' },
        { status: 400 }
      );
    }

    const recorded = recordTaskExecution({
      timeStr: body.timeStr || body.time,
      task: body.task,
      channel: body.channel || 'Hệ thống tự động',
      status: body.status === 'error' ? 'error' : 'success',
      title: body.title,
      url: body.url,
      error: body.error,
      extraInfo: body.extraInfo,
    });

    return NextResponse.json({
      success: true,
      message: 'Đã ghi log task thành công',
      data: recorded,
    });
  } catch (error) {
    console.error('Error in /api/tasks POST:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi ghi log task' },
      { status: 500 }
    );
  }
}
