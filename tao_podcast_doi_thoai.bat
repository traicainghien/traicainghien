@echo off
chcp 65001 > nul
echo ========================================================
echo  TRẠI CAI NGHIỆN - TẠO PODCAST ĐỐI THOẠI 2 NGƯỜI (0 ĐỒNG)
echo ========================================================
echo.
echo Đang đọc kịch bản phân vai Nam/Nữ từ scripts/sample_dialog_script.txt...
echo.

python -c "
import os
import sys
from scripts.dialog_podcast_generator import build_dialog_podcast

with open('scripts/sample_dialog_script.txt', 'r', encoding='utf-8') as f:
    text = f.read()

out_file = 'public/audio/podcast_doi_thoai_2_nguoi_demo.mp3'
build_dialog_podcast(text, out_file)
"

echo.
echo ========================================================
echo  ĐÃ XONG! File âm thanh lưu tại: public/audio/podcast_doi_thoai_2_nguoi_demo.mp3
echo ========================================================
pause
