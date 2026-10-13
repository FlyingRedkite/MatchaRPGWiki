"""Assemble index.html from src/. Usage: python build.py

src/shell.html contains placeholders that are replaced here:
  {{VERSION}}, {{DATE}}   -> version (from VERSION) and build date
  /*CSS*/                 -> src/style.css
  /*DATA*/ null           -> src/data.json
  /*ADV*/                 -> src/adv.js
  /*APP*/                 -> src/app.js
"""

from datetime import date
from pathlib import Path

root = Path(__file__).parent
src = root / "src"


def read(path):
    return path.read_text(encoding="utf-8")


def inject(html, marker, content):
    if marker not in html:
        raise SystemExit(f"Marqueur introuvable dans shell.html : {marker}")
    return html.replace(marker, content, 1)


version = read(root / "VERSION").strip()
# "</" inside JSON strings would close the <script> tag early.
data = read(src / "data.json").replace("</", "<\\/")

html = read(src / "shell.html")
html = html.replace("{{VERSION}}", version).replace("{{DATE}}", date.today().isoformat())
html = inject(html, "/*CSS*/", read(src / "style.css"))
html = inject(html, "/*DATA*/ null", data)
html = inject(html, "/*ADV*/", read(src / "adv.js"))
html = inject(html, "/*APP*/", read(src / "app.js"))

(root / "index.html").write_text(html, encoding="utf-8")
print(f"index.html généré, v{version} ({len(html) // 1024} Ko)")
