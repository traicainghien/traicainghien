import sys
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

import os
import json
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi

HISTORY_FILE = "scripts/processed_youtube_videos.json"

CHANNELS = [
    "https://www.youtube.com/@vuilearn4173/videos",
    "https://www.youtube.com/@hacthaybachthay/videos",
    "https://www.youtube.com/@dannytranlol/videos",
    "https://www.youtube.com/@BeyondLimitsSpi/videos",
    "https://www.youtube.com/@Lena.Innerworld/videos",
    "https://www.youtube.com/@summarybooksvn/videos",
    "https://www.youtube.com/@Loliteo/videos",
    "https://www.youtube.com/@Journey.withMay/videos",
    "https://www.youtube.com/@summaryversion/videos",
    "https://www.youtube.com/@mineasyleben/videos",
    "https://www.youtube.com/@questforself258/videos",
    "https://www.youtube.com/@podcastTothonmoingay/videos",
    "https://www.youtube.com/@ChillTamLyHoc/videos",
    "https://www.youtube.com/@betterversionvn/videos",
    "https://www.youtube.com/@T%C3%A2mL%C3%BDH%E1%BB%8Dc%C4%90%C6%A1nGi%E1%BA%A3n666/videos",
    "https://www.youtube.com/@tamnhintamlyhoc/videos",
    "https://www.youtube.com/@CosmicWriter/videos",
    "https://www.youtube.com/@nguhaynghi/videos",
    "https://www.youtube.com/@psychologie-france/videos",
    "https://www.youtube.com/@Anniethefree/videos",
    "https://www.youtube.com/@HieuTheConsul_Official/videos"
]

TOPIC_KEYWORDS = {
    # 1. Sự tập trung, Não bộ & Giải phóng khỏi xao nhãng số (Trọng tâm số 1 tuyệt đối)
    "focus": [
        "tập trung", "focus", "deep work", "mất tập trung", "xao nhãng",
        "sương mù não", "brain fog", "brain rot", "nhũn não", "chú ý", "attention",
        "dopamine", "dopamine detox", "cai điện thoại", "nghiện điện thoại",
        "lướt điện thoại", "short video", "tiktok", "reels", "đơn nhiệm",
        "não", "bộ não", "hành vi", "adhd", "thần kinh", "neuroscience",
        "flow state", "dòng chảy", "quản trị năng lượng"
    ],
    # 2. Thay đổi thói quen & Kỷ luật không cần gồng (Bổ trợ cho sự tập trung)
    "habit": [
        "thói quen", "habit", "atomic habit", "kỷ luật", "trì hoãn",
        "procrastination", "kaizen", "dậy sớm", "lối sống", "thay đổi bản thân",
        "thói quen nguyên tử", "buông bỏ"
    ]
}


def load_processed_ids():
    processed = set()
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                for item in data:
                    if isinstance(item, str):
                        processed.add(item)
                    elif isinstance(item, dict) and "id" in item:
                        processed.add(item["id"])
        except:
            pass

    # Also inspect src/data/articles.ts for existing sources
    articles_ts = "src/data/articles.ts"
    if os.path.exists(articles_ts):
        try:
            with open(articles_ts, "r", encoding="utf-8") as f:
                text = f.read()
            import re
            urls = re.findall(r'https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})', text)
            for vid in urls:
                processed.add(vid)
        except:
            pass

    return list(processed)


def save_processed_id(video_id):
    history = set(load_processed_ids())
    history.add(video_id)
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(sorted(list(history)), f, ensure_ascii=False, indent=2)


def search_top_video(topic="auto", max_per_channel=8):
    """
    Crawls the 21 specified YouTube channels for top engaged videos
    matching:
    - Thay đổi thói quen / Xây dựng thói quen tốt
    - Não bộ và hành vi / Sự tập trung
    """
    if topic in TOPIC_KEYWORDS:
        keywords = TOPIC_KEYWORDS[topic]
    else:
        # Combine all 4 topics
        keywords = list(set(TOPIC_KEYWORDS["habit"] + TOPIC_KEYWORDS["focus"]))

    processed_ids = set(load_processed_ids())

    candidates = []
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'playlistend': max_per_channel
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        for ch_url in CHANNELS:
            try:
                res = ydl.extract_info(ch_url, download=False)
                ch_name = res.get('channel') or res.get('title') or ch_url
                entries = res.get('entries', [])
                for e in entries:
                    vid = e.get('id')
                    title = e.get('title') or ""
                    views = e.get('view_count') or 0

                    if not vid or vid in processed_ids or any(c["id"] == vid for c in candidates):
                        continue

                    title_lower = title.lower()
                    matched = [kw for kw in keywords if kw in title_lower]
                    if matched:
                        # Bonus điểm gấp đôi cho chủ đề Sự Tập Trung theo chỉ thị mới của Bố
                        focus_matched = [kw for kw in matched if kw in TOPIC_KEYWORDS["focus"]]
                        score = len(matched) * 15 + len(focus_matched) * 25 + (views ** 0.5)
                        # Determine topic classification
                        is_focus = len(focus_matched) > 0
                        cand_topic = "focus" if is_focus else "habit"
                        candidates.append({
                            "id": vid,
                            "title": title,
                            "views": views,
                            "channel": ch_name,
                            "url": f"https://www.youtube.com/watch?v={vid}",
                            "matched_kws": matched,
                            "topic": cand_topic,
                            "score": score
                        })
            except Exception as e:
                print(f"Error checking channel {ch_url}: {e}")

    # Sort candidates by score descending
    candidates.sort(key=lambda x: x["score"], reverse=True)
    return candidates


def fetch_video_transcript(video_id):
    """
    Fetch Vietnamese or English transcript of a YouTube video.
    """
    try:
        api = YouTubeTranscriptApi()
        transcripts = api.list(video_id)
        # 1. Prioritize Vietnamese
        t = None
        try:
            t = transcripts.find_transcript(['vi'])
        except:
            try:
                t = transcripts.find_transcript(['en'])
            except:
                for tr in transcripts:
                    t = tr
                    break
        if t:
            fetched = t.fetch()
            full_text = " ".join([seg.text for seg in fetched])
            return full_text
    except Exception as e:
        print(f"Transcript fetch note for {video_id}:", e)
    return ""


def get_best_video_content(topic="auto"):
    """
    Picks the #1 top candidate video across the 21 channels and returns its metadata + full transcript.
    """
    candidates = search_top_video(topic=topic)
    if not candidates:
        print(f"No new candidates found for topic: {topic}")
        return None

    for cand in candidates:
        transcript = fetch_video_transcript(cand["id"])
        if transcript and len(transcript) > 300:
            cand["transcript"] = transcript
            print(f"Selected Video: '{cand['title']}' ({cand['views']:,} views, Channel: {cand['channel']})")
            print(f"Assigned topic: {cand.get('topic', topic)}")
            print(f"Transcript length: {len(transcript)} characters")
            return cand

    # Fallback to top candidate even if transcript fails
    top = candidates[0]
    top["transcript"] = ""
    print(f"Selected Top Video (no transcript): '{top['title']}'")
    return top


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--topic", default="auto", choices=["auto", "focus", "habit"])
    args = parser.parse_args()

    print(f"--- Mining YouTube Across 21 Channels for Topic: {args.topic} ---")
    data = get_best_video_content(args.topic)
    if data:
        print("Success! Extracted candidate:")
        print("Title:", data["title"])
        print("Channel:", data["channel"])
        print("Views:", f"{data['views']:,}")
        print("URL:", data["url"])
