import urllib.request

exact_slugs = [
    'phan-biet-adhd-va-xao-nhang-so-co-le-ban-khong-bi-20261127',
    'giai-ma-con-nghien-dopamine-lay-lai-su-tap-trung-20261126',
    'sieu-nhan-thuc-lay-lai-su-tap-trung-ky-nguyen-ai-20261125',
    'ky-luat-tu-dong-bien-thoi-quen-thanh-phan-xa-20261124',
    'lay-lai-su-tap-trung-thoat-khoi-doomscrolling-20261123',
    'phim-pon-va-cu-lua-dopamine-lay-lai-ban-linh-dan-o-20261121'
]

for s in exact_slugs:
    url = f'https://www.traicainghien.com/bai-viet/{s}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as r:
            print(f'✅ LIVE 200 OK: {s}')
    except Exception as e:
        print(f'❌ FAIL ({e}): {s}')


