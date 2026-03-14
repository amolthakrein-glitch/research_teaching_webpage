#!/usr/bin/env python3
import csv
import json
import sys
import urllib.request
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LOG_DIR = ROOT / "registrations"
REG_FILE = LOG_DIR / "registration_log.csv"
VISIT_FILE = LOG_DIR / "visit_log.csv"

REG_HEADERS = [
    "timestamp", "student_name", "parent_name", "mobile", "email", 
    "class_mix", "mode", "timing", "city", "notes", "ip", "user_agent"
]

VISIT_HEADERS = [
    "timestamp", "ip", "page", "country", "region", "continent", 
    "org", "suspicious", "user_agent"
]

def ensure_logs() -> None:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    if not REG_FILE.exists():
        with REG_FILE.open("w", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerow(REG_HEADERS)
    if not VISIT_FILE.exists():
        with VISIT_FILE.open("w", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerow(VISIT_HEADERS)

def get_geo_info(ip: str):
    """Fetch geo info using ip-api.com (Free for non-commercial)"""
    try:
        if ip in ("127.0.0.1", "localhost", "::1"):
            return {"country": "Local", "region": "Local", "continent": "Local", "org": "Dev"}
        
        with urllib.request.urlopen(f"http://ip-api.com/json/{ip}?fields=status,country,regionName,continent,org,mobile,proxy,hosting") as response:
            data = json.loads(response.read().decode())
            if data.get("status") == "success":
                # Note: free ip-api doesn't give continent by default, mapping based on country or using different endpoint
                # Simplification for this local script:
                return {
                    "country": data.get("country", "Unknown"),
                    "region": data.get("regionName", "Unknown"),
                    "org": data.get("org", "Unknown"),
                    "suspicious": "Yes" if (data.get("mobile") or data.get("proxy") or data.get("hosting")) else "No"
                }
    except:
        pass
    return {"country": "Unknown", "region": "Unknown", "org": "Unknown", "suspicious": "No"}

class UnifiedHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

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
        
        row = [
            datetime.now(timezone.utc).isoformat(),
            payload.get("student_name", ""), payload.get("parent_name", ""),
            payload.get("mobile", ""), payload.get("email", ""),
            payload.get("class_mix", ""), payload.get("mode", "Offline"),
            payload.get("timing", ""), payload.get("city", ""),
            payload.get("notes", ""), self.client_address[0],
            self.headers.get("User-Agent", "")
        ]
        with REG_FILE.open("a", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerow(row)
        self._send_json({"status": "ok"})

    def handle_visit_log(self):
        payload = self._get_payload()
        if not payload: return
        
        ip = self.client_address[0]
        geo = get_geo_info(ip)
        
        row = [
            datetime.now(timezone.utc).isoformat(),
            ip, payload.get("page", "unknown"),
            geo.get("country"), geo.get("region"),
            "Unknown", # Continent mapping needs more data
            geo.get("org"), geo.get("suspicious"),
            self.headers.get("User-Agent", "")
        ]
        with VISIT_FILE.open("a", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerow(row)
        self._send_json({"status": "ok"})

    def _get_payload(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            return json.loads(self.rfile.read(length).decode("utf-8"))
        except:
            self.send_error(HTTPStatus.BAD_REQUEST)
            return None

    def _send_json(self, data, status=HTTPStatus.OK):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

def main():
    port = 8010
    ensure_logs()
    print(f"Server starting on http://127.0.0.1:{port}")
    ThreadingHTTPServer(("0.0.0.0", port), UnifiedHandler).serve_forever()

if __name__ == "__main__":
    main()
