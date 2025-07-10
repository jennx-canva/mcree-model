#!/usr/bin/env python3
"""
Simple HTTP server for running the Pass Through Portals static website locally.
"""

import os
import sys
import http.server
import socketserver
import webbrowser
from pathlib import Path

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow loading of assets
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        super().end_headers()

def main():
    # Change to the directory containing this script
    os.chdir(Path(__file__).parent)
    
    # Check if required files exist
    required_files = ['index.html', 'low_poly_mccree-transformed.glb']
    missing_files = []
    
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(f"Error: Missing required files: {', '.join(missing_files)}")
        print("Please ensure all files are in the same directory as this script.")
        sys.exit(1)
    
    # Start server
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"Pass Through Portals - Static Website")
        print(f"Server running at: http://localhost:{PORT}")
        print(f"Press Ctrl+C to stop the server")
        
        # Try to open browser
        try:
            webbrowser.open(f'http://localhost:{PORT}')
            print("Opening browser...")
        except Exception as e:
            print(f"Could not open browser automatically: {e}")
            print(f"Please manually open: http://localhost:{PORT}")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.shutdown()

if __name__ == "__main__":
    main() 