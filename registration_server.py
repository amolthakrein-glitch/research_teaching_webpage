#!/usr/bin/env python3
import csv
import json
import sys
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

try:
    from openpyxl import Workbook
except Exception:  # optional dependency
    Workbook = None

ROOT = Path(__file__).resolve().parent
LOG_DIR = ROOT / "registrations"
LOG_FILE = LOG_DIR / "registration_log.csv"
LIST_CSV_FILE = LOG_DIR / "registration_list.csv"
LIST_XLSX_FILE = LOG_DIR / "registration_list.xlsx"
HEADERS = [
    "timestamp",
    "student_name",
    "parent_name",
    "mobile",
    "email",
    "class_mix",
    "mode",
    "timing",
    "city",
    "notes",
    "ip",
    "user_agent",
]


def ensure_log_file() -> None:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    if not LOG_FILE.exists():
        with LOG_FILE.open("w", newline="", encoding="utf-8") as fh:
            writer = csv.writer(fh)
            writer.writerow(HEADERS)


def refresh_registration_lists() -> None:
    ensure_log_file()
    with LOG_FILE.open("r", newline="", encoding="utf-8") as fh:
        rows = list(csv.reader(fh))

    if not rows:
        rows = [HEADERS]

    with LIST_CSV_FILE.open("w", newline="", encoding="utf-8") as out_csv:
        writer = csv.writer(out_csv)
        writer.writerows(rows)

    if Workbook is not None:
        wb = Workbook()
        ws = wb.active
        ws.title = "Registrations"
        for row in rows:
            ws.append(row)
        wb.save(LIST_XLSX_FILE)


class RegistrationHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self):
        if self.path != "/api/register":
            self.send_error(HTTPStatus.NOT_FOUND, "Unknown endpoint")
            return

        length = self.headers.get("Content-Length")
        if not length:
            self._send_json({"error": "Missing request body"}, status=HTTPStatus.BAD_REQUEST)
            return

        try:
            raw = self.rfile.read(int(length))
            payload = json.loads(raw.decode("utf-8"))
        except Exception:
            self._send_json({"error": "Invalid JSON payload"}, status=HTTPStatus.BAD_REQUEST)
            return

        student_name = str(payload.get("student_name", "")).strip()
        mobile = str(payload.get("mobile", "")).strip()
        class_mix = str(payload.get("class_mix", "")).strip()
        mode = str(payload.get("mode", "")).strip()
        timing = str(payload.get("timing", "")).strip()

        if not all([student_name, mobile, class_mix, mode, timing]):
            self._send_json(
                {"error": "Required fields: student_name, mobile, class_mix, mode, timing"},
                status=HTTPStatus.BAD_REQUEST,
            )
            return

        row = [
            datetime.now(timezone.utc).isoformat(),
            student_name,
            str(payload.get("parent_name", "")).strip(),
            mobile,
            str(payload.get("email", "")).strip(),
            class_mix,
            mode,
            timing,
            str(payload.get("city", "")).strip(),
            str(payload.get("notes", "")).strip().replace("\n", " "),
            self.client_address[0] if self.client_address else "",
            self.headers.get("User-Agent", ""),
        ]

        ensure_log_file()
        with LOG_FILE.open("a", newline="", encoding="utf-8") as fh:
            writer = csv.writer(fh)
            writer.writerow(row)
        refresh_registration_lists()

        self._send_json({"status": "ok", "message": "Registration logged"})

    def _send_json(self, data, status=HTTPStatus.OK):
        body = json.dumps(data).encode("utf-8")
        self.send_response(int(status))
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main() -> int:
    port = 8010
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    ensure_log_file()
    refresh_registration_lists()
    server = ThreadingHTTPServer(("0.0.0.0", port), RegistrationHandler)
    print(f"Serving {ROOT} on http://127.0.0.1:{port}")
    print(f"Registration log file: {LOG_FILE}")
    server.serve_forever()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
