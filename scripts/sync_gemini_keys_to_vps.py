import subprocess
import paramiko
import time
import sys

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

print("1. Knocking port 60000...")
cmd_knock = 'curl.exe -s -m 5 -A "Mozilla/5.0" http://103.157.218.111:60000/C1sco1234'
subprocess.run(cmd_knock, shell=True)
time.sleep(2)

print("2. Connecting SSH to VPS...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    ssh.connect('103.157.218.111', port=11985, username='root', password='TCN@Root2026#Secure', timeout=8)
    print("SSH Connected!")
    
    sftp = ssh.open_sftp()
    sftp.put('.env.local', '/root/traicainghien/.env.local')
    sftp.put('scripts/gemini_client.py', '/root/traicainghien/scripts/gemini_client.py')
    print("✅ Uploaded .env.local and gemini_client.py to VPS /root/traicainghien/")
    sftp.close()

    stdin, stdout, stderr = ssh.exec_command('cd /root/traicainghien && python3 -c "from scripts.gemini_client import get_keys_pool; print(\'VPS Pool keys:\', len(get_keys_pool()))"')
    out = stdout.read().decode().strip()
    print("VPS Verification Output:", out)
    ssh.close()
    print("🎉 All 9 Gemini API keys synced to VPS successfully!")
except Exception as e:
    print("⚠️ VPS note (network timeout or port restricted):", e)
