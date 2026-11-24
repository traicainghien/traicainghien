import { NextRequest, NextResponse } from 'next/server';
import { getAllCourseLeads, exportLeadsToCsv } from '@/lib/courseLeadsStorage';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const format = searchParams.get('format');

  const expectedSecret = process.env.MOD_SECRET || 'traicainghien2026';

  if (!secret || secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized: Secret key is invalid' },
      { status: 401 }
    );
  }

  if (format === 'csv') {
    const csvContent = await exportLeadsToCsv();
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="traicainghien_course_leads_${Date.now()}.csv"`,
      },
    });
  }

  const leads = await getAllCourseLeads();
  return NextResponse.json({
    total: leads.length,
    leads,
  });
}
