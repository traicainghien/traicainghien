@echo off
chcp 65001 > nul
echo ========================================================
echo  TRẠI CAI NGHIỆN - TẠO GIỌNG ĐỌC AI PODCAST (0 ĐỒNG)
echo ========================================================
echo.
echo Đang chuyển kịch bản từ scripts/sample_podcast_script.txt 
echo sang file âm thanh giọng Nam trầm ấm...
echo.

python scripts/tts_generator.py --file scripts/sample_podcast_script.txt --output public/audio/podcast_demo.mp3 --preset podcast

echo.
echo ========================================================
echo  ĐÃ XONG! File âm thanh lưu tại: public/audio/podcast_demo.mp3
echo ========================================================
pause
