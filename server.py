#!/usr/bin/env python3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ZIP_NAME = "BISON-Z-Brand-Book.zip"
ZIP_PATH = ROOT / ZIP_NAME


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def _is_download(self):
        path = self.path.split("?", 1)[0].rstrip("/")
        return path in ("/download", "/download.zip", f"/{ZIP_NAME}")

    def do_HEAD(self):
        if self._is_download():
            self._send_zip_headers()
            return
        return super().do_HEAD()

    def do_GET(self):
        if self._is_download():
            data = ZIP_PATH.read_bytes()
            self._send_zip_headers(len(data))
            self.wfile.write(data)
            return
        return super().do_GET()

    def _send_zip_headers(self, length=None):
        size = length if length is not None else ZIP_PATH.stat().st_size
        self.send_response(200)
        self.send_header("Content-Type", "application/zip")
        self.send_header("Content-Disposition", f'attachment; filename="{ZIP_NAME}"')
        self.send_header("Content-Length", str(size))
        self.end_headers()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", 8080), Handler)
    print("BISON Z brand book on http://0.0.0.0:8080")
    server.serve_forever()
