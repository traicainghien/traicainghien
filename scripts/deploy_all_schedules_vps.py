import urllib.request, time, paramiko, json, sys, uuid
from datetime import datetime

print("1. Kiểm tra kết nối tới VPS...")
connected = False
for attempt in range(4):
    try:
        req = urllib.request.Request('http://103.157.218.111:60000/C1sco1234', headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=4) as r:
            print("   -> Knock port 60000 thành công!")
            connected = True
            break
    except Exception as e:
        time.sleep(2)

time.sleep(2)

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect('103.157.218.111', port=11985, username='root', password='TCN@Root2026#Secure', timeout=15)
    print("2. Kết nối SSH thành công!")
except Exception as e:
    print(f"Lỗi kết nối SSH: {e}")
    sys.exit(1)

# Upload updated scripts
sftp = ssh.open_sftp()
for script in [
    'scripts/task_notifier.py',
    'scripts/bedtime_publisher.py',
    'scripts/daily_news_dispatcher.py',
    'scripts/tram_tich_cuc_publisher.py',
    'scripts/tcn_behavior_publisher.py',
    'scripts/tcn_article_teaser_publisher.py',
    'scripts/omnichannel_dispatcher.py',
    'scripts/publisher_bridge_service.py',
    'scripts/telegram_reporter.py'
]:
    remote_path = f"/root/traicainghien/{script}"
    sftp.put(script, remote_path)
    print(f"   Đã upload {script} lên VPS.")
sftp.close()

# Update n8n SQLite database for both wWXJoMhbchKzrkqr and TtCuc2026AutoFb
update_db_code = """
import sqlite3, json, uuid
from datetime import datetime

conn = sqlite3.connect('/root/n8n_data/database.sqlite')
c = conn.cursor()

now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]

# ==========================================
# 1. Update wWXJoMhbchKzrkqr (Telegram Daily: 8h30, 15h30, 21h30)
# ==========================================
wf1_id = 'wWXJoMhbchKzrkqr'
wf1_ver = str(uuid.uuid4())
wf1_nodes = [
    {
        "parameters": {
            "rule": {
                "interval": [
                    {"field": "cronExpression", "expression": "30 8 * * *"},
                    {"field": "cronExpression", "expression": "30 15 * * *"},
                    {"field": "cronExpression", "expression": "30 21 * * *"}
                ]
            }
        },
        "name": "Lịch 8h30 - 15h30 - 21h30",
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1.2,
        "position": [240, 300],
        "id": "node-sched-daily-news"
    },
    {
        "parameters": {
            "method": "POST",
            "url": "http://172.17.0.1:5005/daily-news",
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={\\n  \\"trigger\\": \\"schedule\\"\\n}",
            "options": {"timeout": 180000}
        },
        "name": "Quét Tin Tức Tâm Lý & Phát Sóng Telegram",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [520, 300],
        "id": "node-fetch-dispatch-news"
    }
]
wf1_conn = {
    "Lịch 8h30 - 15h30 - 21h30": {
        "main": [[{"node": "Quét Tin Tức Tâm Lý & Phát Sóng Telegram", "type": "main", "index": 0}]]
    }
}
wf1_nodes_json = json.dumps(wf1_nodes, ensure_ascii=False)
wf1_conn_json = json.dumps(wf1_conn, ensure_ascii=False)
wf1_static = json.dumps({
    "node:Lịch 8h30 - 15h30 - 21h30": {
        "recurrenceRules": [None, None, None],
        "recurrenceRuleSignatures": [None, None, None]
    }
})

c.execute('''
    UPDATE workflow_entity 
    SET name = 'Bản tin telegram Daily', nodes = ?, connections = ?, versionId = ?, activeVersionId = ?, staticData = ?, active = 1, updatedAt = ?
    WHERE id = ?
''', (wf1_nodes_json, wf1_conn_json, wf1_ver, wf1_ver, wf1_static, now_str, wf1_id))

c.execute("DELETE FROM workflow_history WHERE workflowId = ?", (wf1_id,))
c.execute('''
    INSERT INTO workflow_history (versionId, workflowId, authors, createdAt, updatedAt, nodes, connections, name, autosaved)
    VALUES (?, ?, '[]', ?, ?, ?, ?, 'Bản tin telegram Daily', 0)
''', (wf1_ver, wf1_id, now_str, now_str, wf1_nodes_json, wf1_conn_json))

c.execute("DELETE FROM workflow_published_version WHERE workflowId = ?", (wf1_id,))
c.execute('''
    INSERT INTO workflow_published_version (workflowId, publishedVersionId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?)
''', (wf1_id, wf1_ver, now_str, now_str))

print("✅ Đã cập nhật wWXJoMhbchKzrkqr: 08:30 • 15:30 • 21:30")

# ==========================================
# 2. Update TtCuc2026AutoFb (Trạm Tích Cực: 10h00, 14h30, 21h00)
# ==========================================
wf4_id = 'TtCuc2026AutoFb'
wf4_ver = str(uuid.uuid4())
wf4_nodes = [
    {
        "parameters": {
            "rule": {
                "interval": [
                    {"field": "cronExpression", "expression": "0 10 * * *"},
                    {"field": "cronExpression", "expression": "30 14 * * *"},
                    {"field": "cronExpression", "expression": "0 21 * * *"}
                ]
            }
        },
        "name": "Lịch 10h00 - 14h30 - 21h00",
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1.2,
        "position": [240, 300],
        "id": "node-sched-ttc"
    },
    {
        "parameters": {
            "method": "POST",
            "url": "http://172.17.0.1:5005/tram-tich-cuc",
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={\\n  \\"trigger\\": \\"schedule\\"\\n}",
            "options": {"timeout": 180000}
        },
        "name": "Quét Quote & Đăng Fanpage Trạm Tích Cực",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [520, 300],
        "id": "node-post-ttc"
    }
]
wf4_conn = {
    "Lịch 10h00 - 14h30 - 21h00": {
        "main": [[{"node": "Quét Quote & Đăng Fanpage Trạm Tích Cực", "type": "main", "index": 0}]]
    }
}
wf4_nodes_json = json.dumps(wf4_nodes, ensure_ascii=False)
wf4_conn_json = json.dumps(wf4_conn, ensure_ascii=False)
wf4_static = json.dumps({
    "node:Lịch 10h00 - 14h30 - 21h00": {
        "recurrenceRules": [None, None, None],
        "recurrenceRuleSignatures": [None, None, None]
    }
})

c.execute('''
    UPDATE workflow_entity 
    SET name = 'Quote fan page Trạm Tích Cực', nodes = ?, connections = ?, versionId = ?, activeVersionId = ?, staticData = ?, active = 1, updatedAt = ?
    WHERE id = ?
''', (wf4_nodes_json, wf4_conn_json, wf4_ver, wf4_ver, wf4_static, now_str, wf4_id))

c.execute("DELETE FROM workflow_history WHERE workflowId = ?", (wf4_id,))
c.execute('''
    INSERT INTO workflow_history (versionId, workflowId, authors, createdAt, updatedAt, nodes, connections, name, autosaved)
    VALUES (?, ?, '[]', ?, ?, ?, ?, 'Quote fan page Trạm Tích Cực', 0)
''', (wf4_ver, wf4_id, now_str, now_str, wf4_nodes_json, wf4_conn_json))

c.execute("DELETE FROM workflow_published_version WHERE workflowId = ?", (wf4_id,))
c.execute('''
    INSERT INTO workflow_published_version (workflowId, publishedVersionId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?)
''', (wf4_id, wf4_ver, now_str, now_str))

print("✅ Đã cập nhật TtCuc2026AutoFb: 10:00 • 14:30 • 21:00")

# ==========================================
# 3. Create / Update TcnEveningArticleAuto20h30 (Facebook 20h30 Tối)
# ==========================================
wf6_id = 'TcnEveningArticleAuto20h30'
wf6_ver = str(uuid.uuid4())
wf6_nodes = [
    {
        "parameters": {
            "rule": {
                "interval": [
                    {"field": "cronExpression", "expression": "30 20 * * *"}
                ]
            }
        },
        "name": "Lịch 20h30 Tối Hàng Ngày",
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1.2,
        "position": [240, 300],
        "id": "node-sched-tcn-evening"
    },
    {
        "parameters": {
            "method": "POST",
            "url": "http://172.17.0.1:5005/tcn-evening-article",
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={\\n  \\"trigger\\": \\"schedule\\"\\n}",
            "options": {"timeout": 180000}
        },
        "name": "Biên Soạn Teaser & Đăng Fanpage Trại Cai Nghiện",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [520, 300],
        "id": "node-post-tcn-evening"
    }
]
wf6_conn = {
    "Lịch 20h30 Tối Hàng Ngày": {
        "main": [[{"node": "Biên Soạn Teaser & Đăng Fanpage Trại Cai Nghiện", "type": "main", "index": 0}]]
    }
}
wf6_nodes_json = json.dumps(wf6_nodes, ensure_ascii=False)
wf6_conn_json = json.dumps(wf6_conn, ensure_ascii=False)
wf6_static = json.dumps({
    "node:Lịch 20h30 Tối Hàng Ngày": {
        "recurrenceRules": [None],
        "recurrenceRuleSignatures": [None]
    }
})

c.execute("SELECT id FROM workflow_entity WHERE id = ?", (wf6_id,))
exists_wf6 = c.fetchone()

if exists_wf6:
    c.execute('''
        UPDATE workflow_entity 
        SET nodes = ?, connections = ?, versionId = ?, activeVersionId = ?, staticData = ?, active = 1, updatedAt = ?
        WHERE id = ?
    ''', (wf6_nodes_json, wf6_conn_json, wf6_ver, wf6_ver, wf6_static, now_str, wf6_id))
else:
    c.execute("SELECT * FROM workflow_entity WHERE id = 'E6PVBHKrtYPlfevu'")
    col_names = [description[0] for description in c.description]
    sample_row = c.fetchone()
    row_dict = dict(zip(col_names, sample_row))
    row_dict['id'] = wf6_id
    row_dict['name'] = 'Trại Cai Nghiện - Dẫn Đọc Bài Viết Web Facebook 20h30'
    row_dict['active'] = 1
    row_dict['nodes'] = wf6_nodes_json
    row_dict['connections'] = wf6_conn_json
    row_dict['staticData'] = wf6_static
    row_dict['versionId'] = wf6_ver
    row_dict['activeVersionId'] = wf6_ver
    row_dict['createdAt'] = now_str
    row_dict['updatedAt'] = now_str
    
    cols = ', '.join([f'"{k}"' for k in row_dict.keys()])
    placeholders = ', '.join(['?' for _ in row_dict])
    c.execute(f"INSERT INTO workflow_entity ({cols}) VALUES ({placeholders})", list(row_dict.values()))

c.execute("DELETE FROM workflow_history WHERE workflowId = ?", (wf6_id,))
c.execute('''
    INSERT INTO workflow_history (versionId, workflowId, authors, createdAt, updatedAt, nodes, connections, name, autosaved)
    VALUES (?, ?, '[]', ?, ?, ?, ?, 'Trại Cai Nghiện - Dẫn Đọc Bài Viết Web Facebook 20h30', 0)
''', (wf6_ver, wf6_id, now_str, now_str, wf6_nodes_json, wf6_conn_json))

c.execute("DELETE FROM workflow_published_version WHERE workflowId = ?", (wf6_id,))
c.execute('''
    INSERT INTO workflow_published_version (workflowId, publishedVersionId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?)
''', (wf6_id, wf6_ver, now_str, now_str))

print("✅ Đã cấu hình & xuất bản TcnEveningArticleAuto20h30: 20:30 Tối Hàng Ngày!")

# ==========================================
# 4. Update E6PVBHKrtYPlfevu (Lời Nhắc Đi Ngủ 22h00 Đêm)
# ==========================================
wf2_id = 'E6PVBHKrtYPlfevu'
wf2_ver = str(uuid.uuid4())
wf2_nodes = [
    {
        "parameters": {
            "rule": {
                "interval": [
                    {"field": "cronExpression", "expression": "0 22 * * *"}
                ]
            }
        },
        "name": "Lịch 22h00 Đêm Hàng Ngày",
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1.2,
        "position": [240, 300],
        "id": "node-sched-bedtime"
    },
    {
        "parameters": {
            "method": "POST",
            "url": "http://172.17.0.1:5005/bedtime-reminder",
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={\\n  \\"trigger\\": \\"schedule\\"\\n}",
            "options": {"timeout": 180000}
        },
        "name": "Phát Sóng Lời Nhắc Đi Ngủ & Báo Cáo",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [520, 300],
        "id": "node-post-bedtime"
    }
]
wf2_conn = {
    "Lịch 22h00 Đêm Hàng Ngày": {
        "main": [[{"node": "Phát Sóng Lời Nhắc Đi Ngủ & Báo Cáo", "type": "main", "index": 0}]]
    }
}
wf2_nodes_json = json.dumps(wf2_nodes, ensure_ascii=False)
wf2_conn_json = json.dumps(wf2_conn, ensure_ascii=False)
wf2_static = json.dumps({
    "node:Lịch 22h00 Đêm Hàng Ngày": {
        "recurrenceRules": [None],
        "recurrenceRuleSignatures": [None]
    }
})

c.execute('''
    UPDATE workflow_entity 
    SET name = 'Trại Cai Nghiện - Lời Nhắc Đi Ngủ 22h00', nodes = ?, connections = ?, versionId = ?, activeVersionId = ?, staticData = ?, active = 1, updatedAt = ?
    WHERE id = ?
''', (wf2_nodes_json, wf2_conn_json, wf2_ver, wf2_ver, wf2_static, now_str, wf2_id))

c.execute("DELETE FROM workflow_history WHERE workflowId = ?", (wf2_id,))
c.execute('''
    INSERT INTO workflow_history (versionId, workflowId, authors, createdAt, updatedAt, nodes, connections, name, autosaved)
    VALUES (?, ?, '[]', ?, ?, ?, ?, 'Trại Cai Nghiện - Lời Nhắc Đi Ngủ 22h00', 0)
''', (wf2_ver, wf2_id, now_str, now_str, wf2_nodes_json, wf2_conn_json))

c.execute("DELETE FROM workflow_published_version WHERE workflowId = ?", (wf2_id,))
c.execute('''
    INSERT INTO workflow_published_version (workflowId, publishedVersionId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?)
''', (wf2_id, wf2_ver, now_str, now_str))

print("✅ Đã cập nhật E6PVBHKrtYPlfevu (Lời Nhắc Đi Ngủ): 22:00 Đêm!")

conn.commit()
conn.close()
"""

stdin, stdout, stderr = ssh.exec_command(f'python3 -c "{update_db_code}"')
print("4. Output SQLite update:\n", stdout.read().decode())
err = stderr.read().decode()
if err:
    print("Error SQLite update:\n", err)

# Restart service & n8n
stdin, stdout, stderr = ssh.exec_command("systemctl restart traicainghien-publisher.service")
print("5. Đã khởi động lại traicainghien-publisher.service")

stdin, stdout, stderr = ssh.exec_command("docker restart n8n")
print("6. Đã khởi động lại docker n8n để nạp lịch mới.")

ssh.close()
print("🎉 HOÀN TẤT ĐỒNG BỘ TOÀN BỘ LỊCH TRÌNH TRÊN VPS!")
