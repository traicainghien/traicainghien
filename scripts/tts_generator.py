#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TRẠI CAI NGHIỆN - CÔNG CỤ TẠO GIỌNG ĐỌC AI MIỄN PHÍ (EDGE-TTS 0 ĐỒNG)
Sử dụng công nghệ Microsoft Natural Voice Neural (Hoàn toàn miễn phí, không giới hạn ký tự)
Tối ưu hóa tone giọng Podcast trầm ấm (Dong Gon / Loliteo style) hoặc Short Video dứt khoát.

Cách dùng:
1. Đọc văn bản trực tiếp:
   python scripts/tts_generator.py --text "Lời thoại cần đọc..." --output demo.mp3
2. Đọc từ file kịch bản:
   python scripts/tts_generator.py --file scripts/sample_script.txt --output podcast_ep1.mp3 --preset podcast
3. Tùy chọn giọng:
   --voice nam (mặc định: vi-VN-NamMinhNeural)
   --voice nu (vi-VN-HoaiMyNeural)
"""

import os
import sys
import argparse
import asyncio
import edge_tts

# Thiết lập stdout utf-8 cho Windows Terminal
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

VOICE_MAP = {
    'nam': 'vi-VN-NamMinhNeural',
    'nu': 'vi-VN-HoaiMyNeural',
    'male': 'vi-VN-NamMinhNeural',
    'female': 'vi-VN-HoaiMyNeural',
}

PRESETS = {
    'podcast': {
        'rate': '-4%',      # Đọc chậm rãi, tự sự
        'pitch': '-2Hz',    # Trầm ấm hơn, sâu lắng
        'volume': '+0%',
        'desc': 'Podcast ấm áp, tự sự đêm muộn (Dong Gon / Loliteo style)'
    },
    'short': {
        'rate': '+4%',      # Nhịp nhanh vừa phải, dứt khoát
        'pitch': '+0Hz',    # Tone tự nhiên
        'volume': '+0%',
        'desc': 'Short video 90s (TikTok / Reels / Shorts)'
    },
    'normal': {
        'rate': '+0%',
        'pitch': '+0Hz',
        'volume': '+0%',
        'desc': 'Tự nhiên mặc định'
    }
}

async def generate_speech(text: str, output_file: str, voice_key: str = 'nam', preset_key: str = 'podcast', custom_rate: str = None, custom_pitch: str = None):
    voice = VOICE_MAP.get(voice_key.lower(), 'vi-VN-NamMinhNeural')
    preset = PRESETS.get(preset_key.lower(), PRESETS['podcast'])
    
    rate = custom_rate if custom_rate else preset['rate']
    pitch = custom_pitch if custom_pitch else preset['pitch']
    volume = preset['volume']

    # Đảm bảo thư mục đầu ra tồn tại
    output_dir = os.path.dirname(output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)

    print("=" * 60, flush=True)
    print("🎙️ TRẠI CAI NGHIỆN - AI VOICE GENERATOR (0 ĐỒNG)", flush=True)
    print(f"• Giọng đọc: {voice} ({voice_key.upper()})", flush=True)
    print(f"• Phong cách: {preset_key.upper()} ({preset['desc']})", flush=True)
    print(f"• Tinh chỉnh: Tốc độ={rate} | Độ trầm={pitch}", flush=True)
    print(f"• Độ dài văn bản: {len(text)} ký tự (~{len(text.split())} từ)", flush=True)
    print(f"• Xuất ra file: {output_file}", flush=True)
    print("=" * 60, flush=True)
    print("⏳ Đang tổng hợp âm thanh chất lượng cao...", flush=True)

    communicate = edge_tts.Communicate(
        text=text,
        voice=voice,
        rate=rate,
        pitch=pitch,
        volume=volume
    )

    # Xuất file mp3
    await communicate.save(output_file)
    
    # Kiểm tra kích thước file
    if os.path.exists(output_file):
        file_size_kb = os.path.getsize(output_file) / 1024
        print(f"✅ THÀNH CÔNG! Đã tạo file: {output_file} ({file_size_kb:.1f} KB)", flush=True)
        print(f"🎧 Bố có thể mở file nghe thử ngay bây giờ!", flush=True)
    else:
        print("❌ Lỗi: Không thể tạo file âm thanh.", flush=True)

def main():
    parser = argparse.ArgumentParser(description="Tạo file âm thanh AI giọng đọc Tiếng Việt miễn phí cho Trại Cai Nghiện")
    parser.add_argument("--text", type=str, help="Văn bản cần đọc")
    parser.add_argument("--file", type=str, help="Đường dẫn file văn bản (.txt) chứa kịch bản")
    parser.add_argument("--output", "-o", type=str, default="public/audio/podcast_demo.mp3", help="Đường dẫn file .mp3 đầu ra")
    parser.add_argument("--voice", "-v", type=str, default="nam", choices=["nam", "nu", "male", "female"], help="Giọng đọc (nam / nu)")
    parser.add_argument("--preset", "-p", type=str, default="podcast", choices=["podcast", "short", "normal"], help="Cấu hình phong cách (podcast, short, normal)")
    parser.add_argument("--rate", type=str, default=None, help="Ghi đè tốc độ đọc (ví dụ: '-5%%', '+10%%')")
    parser.add_argument("--pitch", type=str, default=None, help="Ghi đè độ trầm bổng (ví dụ: '-3Hz', '+2Hz')")

    args = parser.parse_args()

    content = ""
    if args.file:
        if not os.path.exists(args.file):
            print(f"❌ Không tìm thấy file: {args.file}")
            sys.exit(1)
        with open(args.file, "r", encoding="utf-8") as f:
            content = f.read().strip()
    elif args.text:
        content = args.text.strip()
    else:
        # Đoạn văn bản mẫu phong cách Trại Cai Nghiện để demo
        content = (
            "Chào bạn, chào mừng bạn đã đến với Trại Cai Nghiện. "
            "Có bao giờ bạn trải qua một buổi tối như thế này chưa: "
            "Bạn nằm trên giường, tự nhủ là mình chỉ lướt điện thoại đúng mười lăm phút thôi rồi sẽ đi ngủ. "
            "Nhưng rồi khi bạn giật mình nhìn lên đồng hồ, kim ngắn đã điểm hai giờ sáng. "
            "Mắt bạn cay xè, đầu óc thì trống rỗng, và một cảm giác tội lỗi nặng trĩu bắt đầu bóp nghẹt lấy tâm trí bạn. "
            "Ngày trước, mình cũng từng dằn vặt bản thân như vậy. Mình nghĩ mình là một kẻ vô kỷ luật. "
            "Nhưng sau nhiều năm nghiên cứu về tâm lý học hành vi, mình mới nhận ra: Bạn không hề lười. "
            "Bộ não sinh học của bạn chỉ đang bị sập vào một cái bẫy kích thích dopamine rẻ tiền được thiết kế quá tinh vi. "
            "Trong tập podcast hôm nay, chúng ta sẽ không nói về sự gồng mình hay ép buộc kỷ luật. "
            "Chúng ta sẽ cùng nhau bóc tách cơ chế của bộ não, để bạn có thể giành lại sự tập trung và quyền làm chủ cuộc đời mình, một cách tự nhiên và nhẹ nhàng nhất."
        )

    asyncio.run(generate_speech(
        text=content,
        output_file=args.output,
        voice_key=args.voice,
        preset_key=args.preset,
        custom_rate=args.rate,
        custom_pitch=args.pitch
    ))

if __name__ == "__main__":
    main()
