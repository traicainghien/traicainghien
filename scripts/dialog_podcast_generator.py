#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TRẠI CAI NGHIỆN - DIALOG PODCAST GENERATOR (PODCAST ĐỐI THOẠI 2 NGƯỜI)
Tự động chuyển kịch bản hội thoại 2 người (Nam & Nữ) thành file Podcast hoàn chỉnh.
Mô phỏng phong cách NotebookLM / Cozy Coffee Talk (Nam Minh & Hoài My).
Hoàn toàn miễn phí 0 đồng, sử dụng Edge-TTS và FFmpeg.
"""

import os
import sys
import asyncio
import subprocess
import edge_tts
import time

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

VOICE_CONFIG = {
    'Nam': {
        'voice': 'vi-VN-NamMinhNeural',
        'rate': '-4%',
        'pitch': '-2Hz',
        'label': 'Minh (Host Nam)'
    },
    'Nữ': {
        'voice': 'vi-VN-HoaiMyNeural',
        'rate': '-3%',
        'pitch': '-2Hz',
        'label': 'My (Co-host Nữ)'
    }
}

SAMPLE_DIALOG = """
Nam: Chào My, hôm nay anh muốn hỏi My một câu rất thật lòng nhé.
Nữ: Chào anh Minh! Anh cứ hỏi đi, chuyện gì mà nghe nghiêm túc thế ạ?
Nam: Có bao giờ em tự hứa là chỉ lướt điện thoại đúng mười lăm phút thôi rồi sẽ đi ngủ, nhưng chớp mắt một cái nhìn lên đồng hồ đã thấy hai giờ sáng chưa?
Nữ: Ôi, chuyện cơm bữa của em luôn đấy anh! Cả ngày đi làm về mệt rã rời, em chỉ định nằm lướt TikTok một xíu để xả stress thôi. Nhưng kỳ lạ là càng lướt, em lại càng không dứt ra được, mắt thì cay xè mà đầu óc cứ tỉnh bơ.
Nam: Đó chính là cái bẫy mà hàng triệu người trẻ đang mắc phải. Thật ra em không hề thiếu kỷ luật đâu. Bộ não của chúng ta lúc mệt mỏi sẽ rơi vào trạng thái đói dopamine, và chiếc điện thoại chính là con đường tắt rẻ tiền nhất để não ăn vặt dopamine.
Nữ: Ra là vậy! Em cứ nghĩ là do bản thân mình chưa đủ kỷ luật. Vậy làm sao để chúng ta thay đổi thói quen này hả anh?
Nam: Đơn giản lắm, nguyên tắc đầu tiên là đừng cố gồng mình. Chúng ta phải học cách thiết lập lại môi trường trước khi lên giường ngủ. Trong tập hôm nay, anh và My sẽ cùng chia sẻ ba bước cực kỳ nhẹ nhàng nhé.
"""

async def generate_segment(text: str, voice_cfg: dict, out_file: str):
    communicate = edge_tts.Communicate(
        text=text,
        voice=voice_cfg['voice'],
        rate=voice_cfg['rate'],
        pitch=voice_cfg['pitch']
    )
    await communicate.save(out_file)

def build_dialog_podcast(script_text: str, output_path: str, pause_duration: float = 0.5):
    temp_dir = os.path.join("public", "audio", "temp_dialog")
    os.makedirs(temp_dir, exist_ok=True)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    lines = [line.strip() for line in script_text.strip().split("\n") if line.strip()]
    
    print("=" * 60)
    print("🎙️ TRẠI CAI NGHIỆN - DIALOG PODCAST CO-HOST (2 NGƯỜI)")
    print(f"• Số lượt đối thoại: {len(lines)} đoạn")
    print(f"• File đầu ra: {output_path}")
    print("=" * 60)

    # 1. Tạo file âm thanh khoảng lặng (silence)
    silence_file = os.path.join(temp_dir, "silence.mp3")
    if not os.path.exists(silence_file) or os.path.getsize(silence_file) == 0:
        subprocess.run([
            'ffmpeg', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono',
            '-t', str(pause_duration), '-q:a', '9', '-acodec', 'libmp3lame', silence_file
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # 2. Xử lý từng đoạn thoại
    concat_list_file = os.path.join(temp_dir, "concat_list.txt")
    with open(concat_list_file, "w", encoding="utf-8") as list_f:
        for idx, line in enumerate(lines, 1):
            speaker = "Nam"
            content = line
            if line.startswith("Nam:") or line.startswith("nam:"):
                speaker = "Nam"
                content = line[4:].strip()
            elif line.startswith("Nữ:") or line.startswith("nữ:") or line.startswith("Nu:") or line.startswith("nu:"):
                speaker = "Nữ"
                content = line[3:].strip()
            
            cfg = VOICE_CONFIG[speaker]
            seg_file = os.path.join(temp_dir, f"seg_{idx:03d}_{speaker}.mp3")
            
            # Nếu file đã tồn tại và > 10KB thì dùng lại
            if os.path.exists(seg_file) and os.path.getsize(seg_file) > 10000:
                print(f"[{idx}/{len(lines)}] ⏩ Đã có sẵn: {cfg['label']}", flush=True)
            else:
                print(f"[{idx}/{len(lines)}] 🗣️ {cfg['label']}: \"{content[:35]}...\"", flush=True)
                for attempt in range(1, 4):
                    try:
                        asyncio.run(generate_segment(content, cfg, seg_file))
                        if os.path.exists(seg_file) and os.path.getsize(seg_file) > 1000:
                            print(f"    ✅ Tạo xong ({os.path.getsize(seg_file)/1024:.1f} KB)", flush=True)
                            break
                    except Exception as e:
                        print(f"    ⚠️ Thử lại {attempt}: {e}", flush=True)
                        time.sleep(2)
                time.sleep(1)

            norm_seg = os.path.abspath(seg_file).replace('\\', '/')
            norm_silence = os.path.abspath(silence_file).replace('\\', '/')
            list_f.write(f"file '{norm_seg}'\n")
            if idx < len(lines):
                list_f.write(f"file '{norm_silence}'\n")

    # 3. Dùng FFmpeg nối tất cả và Master âm thanh
    print("\n🎛️ Đang ghép nối và làm ấm âm thanh tổng thể qua FFmpeg...", flush=True)
    raw_joined = os.path.join(temp_dir, "raw_joined.mp3")
    subprocess.run([
        'ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', concat_list_file,
        '-c', 'copy', raw_joined
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # 4. Master chất âm Studio (tăng bass ấm nhẹ, cân bằng âm lượng)
    subprocess.run([
        'ffmpeg', '-y', '-i', raw_joined,
        '-af', 'bass=g=3:f=150,treble=g=1:f=3500,acompressor=threshold=-16dB:ratio=2.5:attack=10:release=100',
        output_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    size_kb = os.path.getsize(output_path) / 1024
    print(f"\n🎉 HOÀN THÀNH XUẤT SẮC! File Podcast Đối Thoại 2 Người: {output_path} ({size_kb:.1f} KB)")

if __name__ == "__main__":
    out_demo = "public/audio/podcast_doi_thoai_2_nguoi_demo.mp3"
    build_dialog_podcast(SAMPLE_DIALOG, out_demo)
