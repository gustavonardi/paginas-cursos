# Genera dem-nav-pegar.html: el mismo dem-nav.html sin comentarios, líneas vacías
# ni saltos entre etiquetas, para que el módulo Código de Divi no le meta <p> ni <br>.
import re
from pathlib import Path
d = Path(__file__).parent
h = (d / 'dem-nav.html').read_text(encoding='utf8')
h = re.sub(r'<!--.*?-->', '', h, flags=re.S)
parts = re.split(r'(<style>.*?</style>|<script>.*?</script>)', h, flags=re.S)
out = []
for p in parts:
    if p.startswith(('<style>', '<script>')):
        out.append('\n'.join(l for l in p.splitlines() if l.strip()))
    else:
        p = re.sub(r'\s*\n\s*', '', p)
        out.append(p)
(d / 'dem-nav-pegar.html').write_text('\n'.join(x for x in out if x.strip()) + '\n', encoding='utf8')
