"""Validación estática de páginas, rutas y recursos para CHATBOOT V6."""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit,unquote
import re,sys,json
root=Path(__file__).resolve().parents[1]; public=root/'public'
htmls=sorted(public.rglob('index.html'))
issues=[]; routes=[]
for doc in htmls:
 soup=BeautifulSoup(doc.read_text('utf8'),'html.parser')
 rel='/' if doc==public/'index.html' else '/'+doc.relative_to(public).parent.as_posix()+'/'
 routes.append(rel)
 if not soup.find('h1'):issues.append(f'Falta H1 en {rel}')
 if soup.body and soup.body.get('data-build')!='tucredito-v61-20261112-foto-redes-posiciones':issues.append(f'No es V6 en {rel}')
 for tag in soup.select('a[href],img[src],script[src],link[href]'):
  v=tag.get('href') or tag.get('src')
  if not v or not v.startswith('/') or v.startswith('//'):continue
  dest=unquote(urlsplit(v).path)
  if dest.startswith('/api/'):continue
  target=(public/dest.lstrip('/'))
  if dest.endswith('/'):
   target=target/'index.html'
  if not target.exists():issues.append(f'{rel}: archivo/ruta faltante {dest}')
for slug in ['managua','leon','esteli','chinandega','matagalpa']:
 p=public/'sucursales'/slug/'index.html'
 if not p.exists():issues.append(f'No existe sucursal {slug}')
text=(root/'src/index.ts').read_text('utf8')
if "version:'V6.1'" not in text:issues.append('Endpoint /api/version no marca V6')
if 'pages:50' not in text:issues.append('Contador de páginas incorrecto')
if 'Orientación en español' in (public/'index.html').read_text('utf8'):issues.append('No se eliminó la frase solicitada')
if 'asesora-tucredito-v61.webp' not in (public/'index.html').read_text('utf8'):issues.append('No se incorporó la nueva fotografía')
if not (public/'assets/asesora-tucredito-v61.webp').exists():issues.append('Falta el archivo fotográfico')
if 'right:auto!important' not in (public/'styles.css').read_text('utf8'):issues.append('No se corrigió la ubicación de IA')
if len(htmls)!=50:issues.append(f'Se esperaban 50 páginas, se encontraron {len(htmls)}')
print('Páginas',len(htmls),'Sucursales',len([x for x in routes if x.startswith('/sucursales/')]),'Incidencias',len(issues))
for i in issues[:35]: print('ERROR',i)
if issues:sys.exit(1)
print('Todas las rutas internas y assets locales están presentes.')
