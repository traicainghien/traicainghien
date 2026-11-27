import urllib.request
import re
import sys
import json
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')

video_url = sys.argv[1] if len(sys.argv) > 1 else 'https://www.youtube.com/watch?v=KbyySgCmCg4'
m_vid = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11})', video_url)
vid = m_vid.group(1) if m_vid else 'KbyySgCmCg4'
canonical_url = f'https://www.youtube.com/watch?v={vid}'

req = urllib.request.Request(
    canonical_url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'vi,en;q=0.9'
    }
)

with urllib.request.urlopen(req, timeout=15) as r:
    html = r.read().decode('utf-8', errors='ignore')

m = re.search(r'ytInitialPlayerResponse\s*=\s*({.+?});', html)
if m:
    data = json.loads(m.group(1))
    video_details = data.get('videoDetails', {})
    print("Video Title:", video_details.get('title'))
    print("Author / Channel:", video_details.get('author'))
    print("Length seconds:", video_details.get('lengthSeconds'))
    print("Full Description:\n", video_details.get('shortDescription'))

    captions = data.get('captions', {}).get('playerCaptionsTracklistRenderer', {}).get('captionTracks', [])
    vi_track = next((c for c in captions if c.get('languageCode') == 'vi'), None)
    if not vi_track and captions:
        vi_track = captions[0]

    if vi_track:
        track_url = vi_track.get('baseUrl')
        print(f"\nSelected track: {vi_track.get('languageCode')} ({vi_track.get('name', {}).get('simpleText')})")
        # Try fetching XML
        req_c = urllib.request.Request(
            track_url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
        )
        try:
            with urllib.request.urlopen(req_c, timeout=20) as rc:
                raw_bytes = rc.read()
                print("Downloaded caption bytes:", len(raw_bytes))
                xml_data = raw_bytes.decode('utf-8', errors='ignore')
                if xml_data.strip():
                    root = ET.fromstring(xml_data)
                    texts = [elem.text for elem in root.findall('.//text') if elem.text]
                    full_transcript = " ".join(texts)
                    print("Transcript length:", len(full_transcript))
                    out_file = f'scripts/transcript_{vid}.txt'
                    with open(out_file, 'w', encoding='utf-8') as f:
                        f.write(full_transcript)
                    print(f"Saved transcript to {out_file}")
                    print("\n--- TRANSCRIPT PREVIEW (FIRST 2000 CHARS) ---\n")
                    print(full_transcript[:2000])
                else:
                    print("Caption response was empty.")
        except Exception as e:
            print("Error fetching/parsing caption:", e)
else:
    print("No ytInitialPlayerResponse found.")
