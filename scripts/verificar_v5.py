"""Verifica sin dependencias que el paquete V5 no es la plantilla V3."""
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
PUB=ROOT/'public'
VERSION='tucredito-v5-20261112'
pages=sorted(PUB.rglob('index.html'))
checks={
 '38 páginas HTML':len(pages)==38,
 'las 38 páginas tienen etiqueta V5':all(VERSION in p.read_text(encoding='utf-8') for p in pages),
 'las 38 páginas tienen WhatsApp':all('id="wa-panel"' in p.read_text(encoding='utf-8') for p in pages),
 'las 38 páginas tienen redes':all('class="socialbar"' in p.read_text(encoding='utf-8') for p in pages),
 'la portada incluye héroe V5': 'v5-hero-card' in (PUB/'index.html').read_text(encoding='utf-8'),
 'la portada contiene 5 redes sociales':(PUB/'index.html').read_text(encoding='utf-8').count('class="social-item ')==10,
 'la portada ya no dice Orientación en español':'Orientación en español' not in (PUB/'index.html').read_text(encoding='utf-8'),
 'la versión HTML incluye hoja CSS y JS nuevos':all('/styles.css?v='+VERSION in p.read_text(encoding='utf-8') and '/app.js?v='+VERSION in p.read_text(encoding='utf-8') for p in pages),
 'API de versión V5':'/api/version' in (ROOT/'src/index.ts').read_text(encoding='utf-8'),
 'README tiene V5 como título':(ROOT/'README.md').read_text(encoding='utf-8').startswith('# Tu Crédito Nicaragua — CHATBOOT V5'),
}
for name,ok in checks.items():
 print(('OK' if ok else 'ERROR')+' — '+name)
print('RESULTADO:',sum(checks.values()),'/',len(checks))
sys.exit(0 if all(checks.values()) else 1)
