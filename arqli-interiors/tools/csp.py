"""Write the SHA-256 hashes of the inline scripts (the head class script and the import map) into the
Content-Security-Policy <meta> of index.html. Run after changing either of them:

  python3 tools/csp.py
"""
import base64
import hashlib
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, "index.html")

html = open(PATH, encoding="utf-8").read()
hashes = []
for attrs, body in re.findall(r"<script((?:\s[^>]*)?)>(.*?)</script>", html, re.S):
    if "src=" in attrs or "ld+json" in attrs:
        continue
    hashes.append("'sha256-" + base64.b64encode(hashlib.sha256(body.encode("utf-8")).digest()).decode() + "'")
html = re.sub(r"script-src 'self'[^;]*;", "script-src 'self' " + " ".join(hashes) + ";", html, count=1)
open(PATH, "w", encoding="utf-8").write(html)
print("\n".join(hashes))
