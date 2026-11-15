"""
Publisher Bridge Service for n8n (Trại Cai Nghiện)
Runs locally on VPS host, listening on port 5005.
Receives webhook from n8n to execute python dispatchers and returns clean JSON.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import subprocess
import urllib.parse
import os
import sys

PORT = 5005
BIND_HOST = "0.0.0.0"

class PublisherHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok", "service": "traicainghien-publisher-bridge"}).encode())
            return
            
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b"{}"
        
        try:
            body = json.loads(post_data.decode("utf-8")) if post_data else {}
        except:
            body = {}

        # 1. Flow 01: Bản Tin Tâm Lý Y Khoa Quốc Tế (Psychology Today)
        if parsed_url.path == "/daily-news":
            print(f"[{self.date_time_string()}] Received request for Flow 01: daily-news", flush=True)
            cmd = [
                sys.executable,
                "/root/traicainghien/scripts/daily_news_dispatcher.py"
            ]
            try:
                proc = subprocess.run(
                    cmd,
                    cwd="/root/traicainghien",
                    capture_output=True,
                    text=True,
                    timeout=180
                )
                output = proc.stdout
                err_output = proc.stderr
                returncode = proc.returncode

                response_data = {
                    "status": "success" if returncode == 0 else "error",
                    "returncode": returncode,
                    "flow": "flow_01_daily_news",
                    "stdout_snippet": output[-800:] if output else "",
                    "stderr_snippet": err_output[-400:] if err_output else ""
                }
                self.send_response(200 if returncode == 0 else 500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode("utf-8"))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode("utf-8"))
                return

        # 2. Luồng Trạm Tích Cực (Quote Động Lực Facebook 10h00 & 21h00)
        elif parsed_url.path == "/tram-tich-cuc":
            print(f"[{self.date_time_string()}] Received request for Trạm Tích Cực quote", flush=True)
            cmd = [
                sys.executable,
                "/root/traicainghien/scripts/tram_tich_cuc_publisher.py"
            ]
            try:
                proc = subprocess.run(
                    cmd,
                    cwd="/root/traicainghien",
                    capture_output=True,
                    text=True,
                    timeout=120
                )
                output = proc.stdout
                err_output = proc.stderr
                returncode = proc.returncode

                response_data = {
                    "status": "success" if returncode == 0 else "error",
                    "returncode": returncode,
                    "flow": "tram_tich_cuc",
                    "stdout_snippet": output[-800:] if output else "",
                    "stderr_snippet": err_output[-400:] if err_output else ""
                }
                self.send_response(200 if returncode == 0 else 500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode("utf-8"))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode("utf-8"))
                return

        # 3. Luồng Khoa Học Hành Vi Trại Cai Nghiện (10h10 Sáng hàng ngày)
        elif parsed_url.path == "/tcn-behavior-post":
            print(f"[{self.date_time_string()}] Received request for Trại Cai Nghiện Behavior Post (10h10)", flush=True)
            cmd = [
                sys.executable,
                "/root/traicainghien/scripts/tcn_behavior_publisher.py"
            ]
            try:
                proc = subprocess.run(
                    cmd,
                    cwd="/root/traicainghien",
                    capture_output=True,
                    text=True,
                    timeout=180
                )
                output = proc.stdout
                err_output = proc.stderr
                returncode = proc.returncode

                response_data = {
                    "status": "success" if returncode == 0 else "error",
                    "returncode": returncode,
                    "flow": "tcn_behavior_publisher",
                    "stdout_snippet": output[-800:] if output else "",
                    "stderr_snippet": err_output[-400:] if err_output else ""
                }
                self.send_response(200 if returncode == 0 else 500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode("utf-8"))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode("utf-8"))
                return

        # 4. Luồng Đào YouTube 21 Kênh & Xuất Bản Website (15h00 Chiều hàng ngày)
        elif parsed_url.path in ["/youtube-website-publish", "/publish"]:
            topic = body.get("topic", "auto")
            print(f"[{self.date_time_string()}] Received request for YouTube Website Publish (15h00), topic: {topic}", flush=True)
            cmd = [
                sys.executable,
                "/root/traicainghien/scripts/omnichannel_dispatcher.py",
                f"--topic={topic}"
            ]
            try:
                proc = subprocess.run(
                    cmd,
                    cwd="/root/traicainghien",
                    capture_output=True,
                    text=True,
                    timeout=360
                )
                output = proc.stdout
                err_output = proc.stderr
                returncode = proc.returncode

                response_data = {
                    "status": "success" if returncode == 0 else "error",
                    "returncode": returncode,
                    "flow": "youtube_website_publish",
                    "stdout_snippet": output[-800:] if output else "",
                    "stderr_snippet": err_output[-400:] if err_output else ""
                }
                self.send_response(200 if returncode == 0 else 500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode("utf-8"))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode("utf-8"))
                return

        # 5. Luồng Dẫn Đọc Bài Viết Web - Fanpage Trại Cai Nghiện (20h30 Tối hàng ngày)
        elif parsed_url.path == "/tcn-evening-article":
            print(f"[{self.date_time_string()}] Received request for TCN Evening Article Teaser (20h30)", flush=True)
            cmd = [
                sys.executable,
                "/root/traicainghien/scripts/tcn_article_teaser_publisher.py"
            ]
            try:
                proc = subprocess.run(
                    cmd,
                    cwd="/root/traicainghien",
                    capture_output=True,
                    text=True,
                    timeout=180
                )
                output = proc.stdout
                err_output = proc.stderr
                returncode = proc.returncode

                response_data = {
                    "status": "success" if returncode == 0 else "error",
                    "returncode": returncode,
                    "flow": "tcn_article_teaser_publisher",
                    "stdout_snippet": output[-800:] if output else "",
                    "stderr_snippet": err_output[-400:] if err_output else ""
                }
                self.send_response(200 if returncode == 0 else 500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode("utf-8"))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode("utf-8"))
                return

        # 6. Luồng Lời Nhắc Đi Ngủ Dịu Dàng (22h00 Đêm hàng ngày)
        elif parsed_url.path == "/bedtime-reminder":
            print(f"[{self.date_time_string()}] Received request for Bedtime Reminder (22h00)", flush=True)
            cmd = [
                sys.executable,
                "/root/traicainghien/scripts/bedtime_publisher.py"
            ]
            try:
                proc = subprocess.run(
                    cmd,
                    cwd="/root/traicainghien",
                    capture_output=True,
                    text=True,
                    timeout=180
                )
                output = proc.stdout
                err_output = proc.stderr
                returncode = proc.returncode

                response_data = {
                    "status": "success" if returncode == 0 else "error",
                    "returncode": returncode,
                    "flow": "bedtime_reminder",
                    "stdout_snippet": output[-800:] if output else "",
                    "stderr_snippet": err_output[-400:] if err_output else ""
                }
                self.send_response(200 if returncode == 0 else 500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode("utf-8"))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode("utf-8"))
                return

        self.send_response(404)
        self.end_headers()

def run_service():
    server_address = (BIND_HOST, PORT)
    httpd = HTTPServer(server_address, PublisherHandler)
    print(f"🚀 Publisher Bridge Service running on {BIND_HOST}:{PORT}...", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()
        print("Service stopped.", flush=True)

if __name__ == "__main__":
    run_service()
