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

REG_HEADERS = ["timestamp", "student_name", "parent_name", "mobile", "email", "class_mix", "mode", "timing", "city", "notes", "ip", "user_agent"]
VISIT_HEADERS = ["timestamp", "ip", "page", "country", "region", "continent", "org", "suspicious", "user_agent"]

def ensure_logs() -> None:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    if not REG_FILE.exists():
        with REG_FILE.open("w", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerow(REG_HEADERS)
    if not VISIT_FILE.exists():
        with VISIT_FILE.open("w", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerow(VISIT_HEADERS)

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

    def handle_admin(self):
        visits = []
        if VISIT_FILE.exists():
            with VISIT_FILE.open("r", encoding="utf-8") as fh:
                visits = list(csv.DictReader(fh))
        
        regs = []
        if REG_FILE.exists():
            with REG_FILE.open("r", encoding="utf-8") as fh:
                regs = list(csv.DictReader(fh))

        country_stats = Counter([v['country'] for v in visits])
        suspicious_count = len([v for v in visits if v['suspicious'] == 'Yes'])

        html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard | Dr. Amol Thakre</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {{ font-family: 'Inter', sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }}
        .container {{ max-width: 1200px; margin: 0 auto; }}
        .header {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }}
        .stats-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }}
        .stat-card {{ background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }}
        .stat-card h3 {{ margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; }}
        .stat-card p {{ margin: 10px 0 0; font-size: 28px; font-weight: 700; color: #0f172a; }}
        .table-container {{ background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 30px; overflow-x: auto; }}
        table {{ width: 100%; border-collapse: collapse; }}
        th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }}
        th {{ background: #f1f5f9; font-weight: 600; color: #475569; }}
        .suspicious {{ color: #dc2626; font-weight: 600; }}
        .tag {{ padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }}
        .tag-geo {{ background: #dbeafe; color: #1e40af; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header"><h1>Website Analytics Dashboard</h1></div>
        <div class="stats-grid">
            <div class="stat-card"><h3>Total Visits</h3><p>{len(visits)}</p></div>
            <div class="stat-card"><h3>Registrations</h3><p>{len(regs)}</p></div>
            <div class="stat-card"><h3>Suspicious</h3><p class="suspicious">{suspicious_count}</p></div>
            <div class="stat-card"><h3>Top Country</h3><p>{country_stats.most_common(1)[0][0] if country_stats else 'N/A'}</p></div>
        </div>
        <div class="table-container">
            <h2>Recent Registrations</h2>
            <table>
                <thead><tr><th>Time</th><th>Name</th><th>Target</th><th>Mobile</th><th>IP</th></tr></thead>
                <tbody>
                    {"".join([f"<tr><td>{r['timestamp'][:16]}</td><td>{r['student_name']}</td><td>{r['class_mix']}</td><td>{r['mobile']}</td><td>{r['ip']}</td></tr>" for r in regs[::-1][:10]])}
                </tbody>
            </table>
        </div>
        <div class="table-container">
            <h2>Traffic Log</h2>
            <table>
                <thead><tr><th>Time</th><th>IP</th><th>Page</th><th>Location</th><th>ISP/Org</th><th>Safe?</th></tr></thead>
                <tbody>
                    {"".join([f"<tr><td>{v['timestamp'][:16]}</td><td>{v['ip']}</td><td>{v['page']}</td><td><span class='tag tag-geo'>{v['country']}, {v['region']}</span></td><td>{v['org'][:30]}</td><td class='{'suspicious' if v['suspicious']=='Yes' else ''}'>{v['suspicious']}</td></tr>" for v in visits[::-1][:20]])}
                </tbody>
            </table>
        </div>
    </div>
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
    port = 8010; ensure_logs(); print(f"Admin Dashboard: http://localhost:{port}/admin"); ThreadingHTTPServer(("0.0.0.0", port), UnifiedHandler).serve_forever()

if __name__ == "__main__":
    main()
