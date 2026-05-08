#!/usr/bin/env python3
"""Append ?v=<md5hash> to local CSS/JS references in every HTML file."""
import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).parent
SKIP = {'.git', '.idea', 'node_modules', 'vendor', '__pycache__'}


def file_hash(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()[:8]


def build_hash_map() -> dict:
    hashes = {}
    for f in ROOT.rglob('*'):
        if f.suffix not in ('.css', '.js'):
            continue
        if any(part in SKIP for part in f.parts):
            continue
        hashes[f.relative_to(ROOT).as_posix()] = file_hash(f)
    return hashes


def bust_file(html_path: Path, hashes: dict) -> bool:
    text = html_path.read_text(encoding='utf-8')
    original = text
    html_dir = html_path.parent

    def repl(m):
        prefix = m.group(1)  # e.g. href=" or src="
        url    = m.group(2)  # e.g. css/base.css  or  ../../js/app.js?v=old
        suffix = m.group(3)  # closing quote
        base   = re.sub(r'\?v=[0-9a-f]+$', '', url)
        h      = hashes.get(base)
        if not h:
            # Resolve relative paths (e.g. ../../js/app.js) to repo-root keys
            try:
                rel = (html_dir / base).resolve().relative_to(ROOT)
                h   = hashes.get(rel.as_posix())
            except ValueError:
                pass
        if h:
            return f'{prefix}{base}?v={h}{suffix}'
        return m.group(0)

    text = re.sub(
        r'((?:href|src)=["\'])([^"\']+\.(?:css|js)(?:\?v=[0-9a-f]+)?)(["\'])',
        repl,
        text,
    )

    if text != original:
        html_path.write_text(text, encoding='utf-8')
        return True
    return False


def main():
    hashes = build_hash_map()
    print(f'Hashed {len(hashes)} assets:')
    for path, h in sorted(hashes.items()):
        print(f'  {path}  →  {h}')
    print()
    for html_file in sorted(ROOT.rglob('*.html')):
        if any(part in SKIP for part in html_file.parts):
            continue
        changed = bust_file(html_file, hashes)
        print(f'  {"updated  " if changed else "unchanged"}: {html_file.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
