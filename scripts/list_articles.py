import re

with open('src/data/articles.ts', 'r', encoding='utf-8') as f:
    text = f.read()

articles = re.findall(r'"slug":\s*"([^"]+)".*?"title":\s*"([^"]+)"', text, re.DOTALL)
for i, (slug, title) in enumerate(articles[:15]):
    print(f"{i+1}. [{slug}] {title}")

