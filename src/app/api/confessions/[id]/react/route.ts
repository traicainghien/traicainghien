import { NextRequest, NextResponse } from 'next/server';
import { addReaction } from '@/lib/confessionsStorage';
import { ReactionType } from '@/types/confession';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const reactionType: ReactionType = body.reactionType;

    if (!['feel_you', 'hug', 'not_alone'].includes(reactionType)) {
      return NextResponse.json(
        { success: false, message: 'Loại cảm xúc không hợp lệ.' },
        { status: 400 }
      );
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const result = await addReaction(id, reactionType, ip);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || 'Không thể cập nhật cảm xúc.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      counts: result.counts,
      message: result.message,
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi cập nhật phản hồi.' },
      { status: 500 }
    );
  }
}
