"""Assemble index.html from src/. Usage: python build.py"""
from pathlib import Path
root = Path(__file__).parent
src = root / "src"
shell = (src / "shell.html").read_text(encoding="utf-8")
data = (src / "data.json").read_text(encoding="utf-8").replace("</", "<\\/")
html = (shell.replace("/*DATA*/null", data, 1)
             .replace("/*ADV*/", (src / "adv.js").read_text(encoding="utf-8"), 1)
             .replace("/*APP*/", (src / "app.js").read_text(encoding="utf-8"), 1))
(root / "index.html").write_text(html, encoding="utf-8")
print(f"index.html généré ({len(html)//1024} Ko)")
