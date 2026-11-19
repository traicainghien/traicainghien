# -*- coding: utf-8 -*-
import json
import re

slug = "100-ngay-cai-dien-thoai-nao-bo-tai-sinh-ky-dieu-the-nao"

# 1. Update article_registry.json
registry_path = 'src/data/article_registry.json'
with open(registry_path, 'r', encoding='utf-8') as f:
    registry = json.load(f)

if slug not in registry:
    registry.insert(0, slug)
    print(f"Prepended '{slug}' to registry. Total: {len(registry)}")
    with open(registry_path, 'w', encoding='utf-8') as f:
        json.dump(registry, f, ensure_ascii=False, indent=2)
else:
    print(f"'{slug}' already in registry.")

# 2. Update articleComments.ts
comments_path = 'src/data/articleComments.ts'
with open(comments_path, 'r', encoding='utf-8') as f:
    comments_ts = f.read()

new_comments_code = f"""  "{slug}": [
    {{
      "id": "cdt-1",
      "name": "Hoàng Minh (Kỹ sư phần mềm • 27 tuổi)",
      "content": "Trời ơi, đọc đến đoạn 'ngón tay ma quẹt vô thức' và 'đứng ngơ ngác trước tủ lạnh' mà mình thấy chính xác 100% bản thân mình trong đó! Đã có những giai đoạn screen time của mình lên tới 9 tiếng rưỡi mỗi ngày. Cứ mỗi sáng thức dậy là đầu óc nặng trĩu sương mù não, đọc tài liệu chuyên ngành được 5 phút là mắt díu lại. Mình đã quyết định học theo bài viết, mua một chiếc hộp sắt có khóa số và nhốt điện thoại vào lúc 21h30. Đúng 72 giờ đầu tiên vật vã kinh khủng, bứt dứt như kiến bò trong xương. Nhưng sang đến tuần thứ 2, khi vượt qua Vực thẳm chán nản, mình lần đầu tiên cảm nhận được vị ngọt của Dopamine nỗ lực khi ngồi code liền 3 tiếng không cần nhìn màn hình điện thoại. Bài viết giải thích cơ chế sinh học thần kinh quá sáng rõ và thực tế!",
      "date": "Vừa xong",
      "likes": 95,
      "isLongStory": true
    }},
    {{
      "id": "cdt-2",
      "name": "Lan Chi (Sinh viên năm cuối Ngoại Thương)",
      "content": "Phân tích về thụ thể Dopamine D2 và hormone Melatonin giải thích lý do vì sao trước đây mình luôn thức đến 2h sáng mà không buồn ngủ. Bỏ điện thoại ra khỏi phòng ngủ là quyết định thay đổi cuộc đời mình: Giấc ngủ sâu trở lại, sáng thức dậy tỉnh táo không cần báo thức. Cảm ơn Mây và Trại Cai Nghiện!",
      "date": "3 giờ trước",
      "likes": 52
    }},
    {{
      "id": "cdt-3",
      "name": "Đức Huy",
      "content": "Nguyên tắc bàn học chỉ có 3 thứ: sách vở, bút và ly nước lọc đơn giản mà uy lực không ngờ. Loại bỏ hoàn toàn ma sát xao nhãng giúp mình bước vào Flow State nhanh hơn rất nhiều. Khuyên thật lòng các bạn đang mất tập trung hãy thử thử thách này ít nhất 7 ngày!",
      "date": "Hôm qua",
      "likes": 64
    }}
  ],
"""

if f'"{slug}":' in comments_ts:
    print("Comments for this slug already exist in articleComments.ts. Replacing...")
    pattern = rf'  "{slug}":\s*\[[\s\S]*?\],\n'
    comments_ts = re.sub(pattern, new_comments_code, comments_ts)
else:
    print("Inserting comments for slug into articleComments.ts...")
    idx = comments_ts.find("export const articleCommentsMap: Record<string, Comment[]> = {")
    if idx != -1:
        insert_pos = comments_ts.find("\n", idx) + 1
        comments_ts = comments_ts[:insert_pos] + new_comments_code + comments_ts[insert_pos:]
    else:
        print("Could not find articleCommentsMap!")

with open(comments_path, 'w', encoding='utf-8') as f:
    f.write(comments_ts)
print("Updated articleComments.ts successfully.")

# 3. Update articles.ts
with open('scripts/draft_100_days_article.json', 'r', encoding='utf-8') as f:
    article_obj = json.load(f)

articles_path = 'src/data/articles.ts'
with open(articles_path, 'r', encoding='utf-8') as f:
    text = f.read()

if f'"slug": "{slug}"' in text:
    print("Article already exists in articles.ts. Skipping duplicate insert.")
else:
    article_json_str = json.dumps(article_obj, ensure_ascii=False, indent=2)
    indented = "\n".join("  " + line for line in article_json_str.splitlines())

    target = "const rawArticles: Article[] = [\n"
    pos = text.find(target)
    if pos != -1:
        insert_pos = pos + len(target)
        new_text = text[:insert_pos] + indented + ",\n" + text[insert_pos:]
        with open(articles_path, 'w', encoding='utf-8') as f:
            f.write(new_text)
        print("Properly inserted article into rawArticles in articles.ts!")
    else:
        print("Could not find 'const rawArticles: Article[] = [' in articles.ts")
