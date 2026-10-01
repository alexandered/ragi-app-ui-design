#!/usr/bin/env python3
"""Tiny local server for the HTML prototype. Sends no-cache headers so edits show up on reload.
Usage: python3 serve.py [port]   (default 8765), then open http://localhost:8765/03_Screens/working/index.html"""
import http.server, sys, os

class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    try:
        srv = http.server.ThreadingHTTPServer(("127.0.0.1", port), H)
    except OSError:
        sys.exit(f"Port {port} is already in use (a server may already be running). Open http://localhost:{port}/03_Screens/working/index.html, or pick another port: python3 serve.py {port + 1}")
    print(f"Serving on http://localhost:{port}/03_Screens/working/index.html  (Ctrl+C to stop)")
    srv.serve_forever()
