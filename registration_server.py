#!/usr/bin/env python3
import csv
import json
import sys
import urllib.request
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parent
LOG_DIR = ROOT / "registrations"
REG_FILE = LOG_DIR / "registration_log.csv"
VISIT_FILE = LOG_DIR / "visit_log.csv"
CHAT_FILE = LOG_DIR / "chat_request_log.csv"

REG_HEADERS = ["timestamp", "student_name", "parent_name", "mobile", "email", "class_mix", "mode", "timing", "city", "notes", "ip", "user_agent"]
VISIT_HEADERS = ["timestamp", "ip", "page", "country", "region", "continent", "org", "suspicious", "user_agent"]
CHAT_HEADERS = ["timestamp", "ip", "page", "intent", "message", "student_name", "class_mix", "mobile", "user_agent"]

def ensure_logs() -> None:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    if not REG_FILE.exists():
        with REG_FILE.open("w", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerow(REG_HEADERS)
    if not VISIT_FILE.exists():
        with VISIT_FILE.open("w", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerow(VISIT_HEADERS)
    if not CHAT_FILE.exists():
        with CHAT_FILE.open("w", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerow(CHAT_HEADERS)

def get_geo_info(ip: str):
    try:
        if ip in ("127.0.0.1", "localhost", "::1"):
            return {"country": "Local", "region": "Local", "org": "Dev", "suspicious": "No"}
        with urllib.request.urlopen(f"http://ip-api.com/json/{ip}?fields=status,country,regionName,org,mobile,proxy,hosting") as response:
            data = json.loads(response.read().decode())
            if data.get("status") == "success":
                return {
                    "country": data.get("country", "Unknown"),
                    "region": data.get("regionName", "Unknown"),
                    "org": data.get("org", "Unknown"),
                    "suspicious": "Yes" if (data.get("proxy") or data.get("hosting")) else "No"
                }
    except: pass
    return {"country": "Unknown", "region": "Unknown", "org": "Unknown", "suspicious": "No"}

class UnifiedHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/admin":
            self.handle_admin()
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == "/api/register":
            self.handle_registration()
        elif self.path == "/api/log_visit":
            self.handle_visit_log()
        elif self.path == "/api/log_chat_request":
            self.handle_chat_request_log()
        else:
            self.send_error(HTTPStatus.NOT_FOUND)

    def handle_registration(self):
        payload = self._get_payload()
        if not payload: return
        row = [datetime.now(timezone.utc).isoformat()] + [payload.get(h, "") for h in REG_HEADERS[1:-2]] + [self.client_address[0], self.headers.get("User-Agent", "")]
        with REG_FILE.open("a", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerow(row)
        self._send_json({"status": "ok"})

    def handle_visit_log(self):
        payload = self._get_payload()
        if not payload: return
        ip = self.client_address[0]
        geo = get_geo_info(ip)
        row = [datetime.now(timezone.utc).isoformat(), ip, payload.get("page", "unknown"), geo.get("country"), geo.get("region"), "Unknown", geo.get("org"), geo.get("suspicious"), self.headers.get("User-Agent", "")]
        with VISIT_FILE.open("a", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerow(row)
        self._send_json({"status": "ok"})

    def handle_chat_request_log(self):
        payload = self._get_payload()
        if not payload: return
        row = [
            datetime.now(timezone.utc).isoformat(),
            self.client_address[0],
            payload.get("page", "unknown"),
            payload.get("intent", "general"),
            payload.get("message", "")[:1000],
            payload.get("student_name", ""),
            payload.get("class_mix", ""),
            payload.get("mobile", ""),
            self.headers.get("User-Agent", "")
        ]
        with CHAT_FILE.open("a", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerow(row)
        self._send_json({"status": "ok"})

    def handle_admin(self):
        visits = []
        if VISIT_FILE.exists():
            with VISIT_FILE.open("r", encoding="utf-8") as fh:
                visits = list(csv.DictReader(fh))
        
        regs = []
        if REG_FILE.exists():
            with REG_FILE.open("r", encoding="utf-8") as fh:
                regs = list(csv.DictReader(fh))

        chats = []
        if CHAT_FILE.exists():
            with CHAT_FILE.open("r", encoding="utf-8") as fh:
                chats = list(csv.DictReader(fh))

        country_data = Counter([v['country'] for v in visits])
        page_data = Counter([v['page'].split('/')[-1] or 'home' for v in visits])
        target_data = Counter([r['class_mix'] for r in regs])
        suspicious_count = len([v for v in visits if v['suspicious'] == 'Yes'])

        html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Analytics Dashboard | Dr. Amol Thakre</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {{ font-family: 'Inter', sans-serif; background: #f1f5f9; color: #1e293b; margin: 0; padding: 30px; }}
        .container {{ max-width: 1300px; margin: 0 auto; }}
        .stats-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }}
        .stat-card {{ background: white; padding: 25px; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }}
        .stat-card h3 {{ margin: 0; font-size: 13px; color: #64748b; letter-spacing: 0.05em; text-transform: uppercase; }}
        .stat-card p {{ margin: 10px 0 0; font-size: 32px; font-weight: 800; color: #0f172a; }}
        .charts-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }}
        .chart-container {{ background: white; padding: 25px; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); height: 350px; }}
        .chart-container h2 {{ margin: 0 0 20px; font-size: 18px; font-weight: 700; }}
        .table-container {{ background: white; padding: 25px; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 30px; }}
        table {{ width: 100%; border-collapse: collapse; }}
        th, td {{ padding: 14px; text-align: left; border-bottom: 1px solid #f1f5f9; font-size: 14px; }}
        th {{ background: #f8fafc; font-weight: 600; color: #475569; }}
        .suspicious-text {{ color: #ef4444; font-weight: 700; }}
        .geo-tag {{ background: #eff6ff; color: #2563eb; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; }}
    </style>
</head>
<body>
    <div class="container">
        <div style="margin-bottom:40px;">
            <h1 style="font-size:28px; margin:0; font-weight:800;">Executive Analytics</h1>
            <p style="color:#64748b; margin:5px 0 0;">Continuous Traffic & Lead Monitoring</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card"><h3>Total Visits</h3><p>{len(visits)}</p></div>
            <div class="stat-card"><h3>Total Enquiries</h3><p>{len(regs)}</p></div>
            <div class="stat-card"><h3>Chat Requests</h3><p>{len(chats)}</p></div>
            <div class="stat-card"><h3>Security Flags</h3><p class="suspicious-text">{suspicious_count}</p></div>
        </div>

        <div class="charts-grid">
            <div class="chart-container">
                <h2>Traffic by Geography</h2>
                <canvas id="countryChart"></canvas>
            </div>
            <div class="chart-container">
                <h2>Program Interest (Leads)</h2>
                <canvas id="targetChart"></canvas>
            </div>
        </div>

        <div class="table-container">
            <h2 style="font-size:18px; font-weight:700;">Recent Verified Leads</h2>
            <table>
                <thead><tr><th>Time</th><th>Student Name</th><th>Target Exam</th><th>Contact</th><th>Status</th></tr></thead>
                <tbody>
                    {"".join([f"<tr><td>{r['timestamp'][:16]}</td><td style='font-weight:600;'>{r['student_name']}</td><td>{r['class_mix']}</td><td>{r['mobile']}</td><td><span style='color:#10b981;'>● Active</span></td></tr>" for r in regs[::-1][:10]])}
                </tbody>
            </table>
        </div>

        <div class="table-container">
            <h2 style="font-size:18px; font-weight:700;">Recent Chat Requests</h2>
            <table>
                <thead><tr><th>Time</th><th>Intent</th><th>Message</th><th>Name</th><th>Program</th><th>Mobile</th></tr></thead>
                <tbody>
                    {"".join([f"<tr><td>{c['timestamp'][:16]}</td><td><strong>{c['intent']}</strong></td><td>{c['message'][:120]}</td><td>{c['student_name']}</td><td>{c['class_mix']}</td><td>{c['mobile']}</td></tr>" for c in chats[::-1][:12]])}
                </tbody>
            </table>
        </div>

        <div class="table-container">
            <h2 style="font-size:18px; font-weight:700;">Live Traffic Heartbeat</h2>
            <table>
                <thead><tr><th>Time</th><th>Page</th><th>Location</th><th>ISP / Provider</th><th>Sec Score</th></tr></thead>
                <tbody>
                    {"".join([f"<tr><td>{v['timestamp'][:16]}</td><td><code>{v['page']}</code></td><td><span class='geo-tag'>{v['country']}, {v['region']}</span></td><td>{v['org'][:40]}</td><td class='{'suspicious-text' if v['suspicious']=='Yes' else ''}'>{v['suspicious']}</td></tr>" for v in visits[::-1][:15]])}
                </tbody>
            </table>
        </div>
    </div>

    <script>
        const ctxCountry = document.getElementById('countryChart').getContext('2d');
        new Chart(ctxCountry, {{
            type: 'pie',
            data: {{
                labels: {list(country_data.keys())},
                datasets: [{{
                    data: {list(country_data.values())},
                    backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b']
                }}]
            }},
            options: {{ maintainAspectRatio: false, plugins: {{ legend: {{ position: 'right' }} }} }}
        }});

        const ctxTarget = document.getElementById('targetChart').getContext('2d');
        new Chart(ctxTarget, {{
            type: 'bar',
            data: {{
                labels: {list(target_data.keys())},
                datasets: [{{
                    label: 'Enquiries',
                    data: {list(target_data.values())},
                    backgroundColor: '#2563eb',
                    borderRadius: 8
                }}]
            }},
            options: {{ maintainAspectRatio: false, scales: {{ y: {{ beginAtZero: true, grid: {{ display: false }} }} }} }}
        }});
    </script>
</body>
</html>"""
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(html.encode("utf-8"))

    def _get_payload(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            return json.loads(self.rfile.read(length).decode("utf-8"))
        except: return None

    def _send_json(self, data, status=HTTPStatus.OK):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status); self.send_header("Content-Type", "application/json"); self.send_header("Content-Length", str(len(body))); self.end_headers(); self.wfile.write(body)

def main():
    port = 8010; ensure_logs(); print(f"🚀 Admin Dashboard: http://localhost:{port}/admin"); ThreadingHTTPServer(("0.0.0.0", port), UnifiedHandler).serve_forever()

if __name__ == "__main__":
    main()
