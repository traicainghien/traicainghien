import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const scheduleFile = path.join(process.cwd(), 'scripts', 'tcn_workflow_schedules.json');
    if (fs.existsSync(scheduleFile)) {
      const data = JSON.parse(fs.readFileSync(scheduleFile, 'utf-8'));
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json(
      { success: false, message: 'Schedule file not found' },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error loading schedules' },
      { status: 500 }
    );
  }
}
