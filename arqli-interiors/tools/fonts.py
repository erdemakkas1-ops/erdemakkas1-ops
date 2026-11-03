"""Download the site's fonts from Google Fonts into fonts/ (SIL OFL), latin + latin-ext for Turkish.

  python3 tools/fonts.py

Fraunces (variable, 300-500, roman + italic) for display, Manrope (variable, 400-600) for text,
JetBrains Mono 500 for measurements. The @font-face rules in css/site.css point at these files.
"""
import os
import re
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "fonts")
FAMILIES = {
    "fraunces": "Fraunces:ital,opsz,wght@0,9..144,300..500;1,9..144,300..500",
    "manrope": "Manrope:wght@400..600",
    "jetbrains-mono": "JetBrains+Mono:wght@500",
}
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30).read()


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, family in FAMILIES.items():
        css = get(f"https://fonts.googleapis.com/css2?family={family}&display=swap").decode()
        for subset, block in re.findall(r"/\* ([\w-]+) \*/\s*@font-face\s*{([^}]*)}", css):
            if subset not in ("latin", "latin-ext"):
                continue
            style = re.search(r"font-style:\s*(\w+)", block).group(1)
            url = re.search(r"url\((https://[^)]+)\)", block).group(1)
            suffix = "-italic" if style == "italic" else ""
            path = os.path.join(OUT, f"{name}{suffix}-{subset}.woff2")
            with open(path, "wb") as f:
                f.write(get(url))
            print(path, os.path.getsize(path))


if __name__ == "__main__":
    main()
