# Genera dem-nav-sitio.html: el mismo dem-nav.html sin comentarios, líneas vacías
# ni saltos entre etiquetas. Es el archivo que muestra el shortcode [dem_nav].
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
(d / 'dem-nav-sitio.html').write_text('\n'.join(x for x in out if x.strip()) + '\n', encoding='utf8')
