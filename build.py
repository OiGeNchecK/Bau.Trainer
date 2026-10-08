#!/usr/bin/env python3
"""Збирає встановлюваний вебзастосунок (PWA) у docs/ для GitHub Pages.

index.html у корені — це тіло сторінки (так його публікує Claude Artifact).
Тут воно загортається в повний HTML-документ, додаються manifest, service worker та іконки.
Запуск: python3 build.py
"""
import json, shutil, struct, time, zlib
from pathlib import Path

ROOT = Path(__file__).parent
OUT = ROOT / "docs"
JS = ["draw.js", "l0.js", "l1.js", "l2.js", "l3.js"]
BG, INK, RED = (17, 38, 58), (220, 235, 242), (255, 129, 99)


def png(path, n):
    """Іконка: план поверху з лінією розрізу. Малюється прямокутниками, без сторонніх бібліотек."""
    px = [[BG] * n for _ in range(n)]

    def rect(x0, y0, x1, y1, c):
        for y in range(int(y0 * n), int(y1 * n)):
            row = px[y]
            for x in range(int(x0 * n), int(x1 * n)):
                row[x] = c

    t = 0.045
    rect(.24, .26, .76, .74, INK); rect(.24 + t, .26 + t, .76 - t, .74 - t, BG)   # зовнішні стіни
    rect(.52, .26, .52 + t * .7, .74, INK)                                        # внутрішня стіна
    rect(.52 - .005, .52, .52 + t, .64, BG)                                       # дверний проріз
    rect(.32, .26 - .005, .44, .26 + t + .005, BG); rect(.32, .26 + t * .35, .44, .26 + t * .65, INK)  # вікно
    for a, b in ((.17, .27), (.31, .34), (.38, .48), (.52, .55), (.59, .69), (.73, .83)):
        rect(.385, a, .405, b, RED)                                              # лінія розрізу
    raw = b"".join(b"\x00" + bytes(v for p in row for v in p) for row in px)
    chunk = lambda k, d: struct.pack(">I", len(d)) + k + d + struct.pack(">I", zlib.crc32(k + d))
    path.write_bytes(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", n, n, 8, 2, 0, 0, 0))
                     + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))


def main():
    OUT.mkdir(exist_ok=True)
    src = (ROOT / "index.html").read_text(encoding="utf-8")
    head, body = src.split('<svg width="0"', 1)
    doc = f"""<!doctype html>
<html lang="uk">
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#11263a">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Bauplan">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="icon-180.png">
<style>:root{{padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}}body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
{head}</head>
<body>
<svg width="0"{body}
<script>if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js')</script>
</body>
</html>
"""
    (OUT / "index.html").write_text(doc, encoding="utf-8")
    for f in JS:
        shutil.copy(ROOT / f, OUT / f)
    for n in (180, 192, 512):
        png(OUT / f"icon-{n}.png", n)
    (OUT / "manifest.webmanifest").write_text(json.dumps({
        "name": "Bauplan-Trainer", "short_name": "Bauplan", "lang": "uk",
        "description": "Курс читання німецьких будівельних планів від нуля до рівня Bauleiter",
        "start_url": "./", "scope": "./", "display": "standalone",
        "background_color": "#0b1823", "theme_color": "#11263a",
        "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
                  {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}],
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    assets = ["./", "index.html", *JS, "manifest.webmanifest", "icon-192.png", "icon-512.png"]
    (OUT / "sw.js").write_text(f"""// Офлайн-кеш: віддає збережене одразу і тихо оновлює його з мережі
const CACHE = 'bauplan-{int(time.time())}';
const ASSETS = {json.dumps(assets)};
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {{
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async c => {{
    const hit = await c.match(e.request, {{ignoreSearch: true}});
    const net = fetch(e.request).then(r => {{ if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; }}).catch(() => hit);
    return hit || net;
  }}));
}});
""", encoding="utf-8")
    print("docs/ готово:", ", ".join(sorted(p.name for p in OUT.iterdir())))


if __name__ == "__main__":
    main()
