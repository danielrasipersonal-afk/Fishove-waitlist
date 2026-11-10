"""Build static Pages files with absolute social preview URLs."""
import os
import shutil
from pathlib import Path
from urllib.parse import urlsplit

root = Path(__file__).resolve().parent.parent
site_url = os.environ.get("SITE_URL", "").strip().rstrip("/")
parsed = urlsplit(site_url)
if parsed.scheme != "https" or not parsed.netloc or parsed.query or parsed.fragment:
    raise SystemExit("SITE_URL must be an absolute HTTPS URL without query or fragment")

output = root / "_site"
output.mkdir(exist_ok=True)
for name in ("assets", "css", "js"):
    shutil.copytree(root / name, output / name, dirs_exist_ok=True)
for name in ("index.html", "index-2.html"):
    html = (root / name).read_text()
    (output / name).write_text(html.replace("{{SITE_URL}}", site_url))
(output / ".nojekyll").touch()
