# Páginas de cursos.desnudandoelmarketing.com

Todas las páginas que se publican **sin pasar por WordPress**, en un solo repo. Cada push a `main` las sube al servidor en unos 30 segundos.

## Páginas

| Carpeta | Página publicada |
|---|---|
| `menu/` | Link en bio: https://cursos.desnudandoelmarketing.com/menu/ |
| `cybermarketing/` | Cyber Marketing: https://cursos.desnudandoelmarketing.com/cybermarketing/ |

**No van acá** las páginas que necesitan WordPress:
- Hub Laboral (`gustavonardi/hub-laboral`): usa shortcode por la restricción de usuarios.
- Lista de espera curso IA (`gustavonardi/lista-de-espera-curso-ia`): se pega en un módulo de Divi y usa el formulario de Brevo.

## Avisos de eventos (`avisos/`)

Bloques que se muestran dentro de páginas de WordPress (Cyber, Black Friday, etc.). En Divi se pega **una sola vez** un código corto que trae el aviso desde acá; para cada evento nuevo se cambia el archivo en GitHub y no se toca WordPress.

| Archivo | Qué es | Contenedor en Divi | ID para GTM |
|---|---|---|---|
| `avisos/on-page.js` | Bloque dentro de la página (home de cursos, abajo del primer bloque) | `dem-aviso-on-page` | `aviso-on-page` |
| `avisos/top-bar.js` | Barra celeste fija arriba de todo: anuncio previo y luego cuenta regresiva (todo el sitio) | No necesita: se agrega sola | `aviso-top-bar` |

- Arriba de cada archivo está el bloque `AVISO` con fechas (`desde` / `hasta`, hora Argentina), textos y link. Es lo único que hay que cambiar.
- Fuera de las fechas no se muestra nada. Para verlo antes: agregar `?aviso=1` a la URL de la página.
- Las fechas las chequea el navegador de cada visitante; no depende de un cron ni de la hora del servidor.
- Cambios visibles en 10 minutos como mucho (Cloudflare guarda los .js un año, por eso el código de Divi pide versión nueva cada 10 min).

Código para el módulo Código de Divi (on page):

```html
<div id="dem-aviso-on-page"></div>
<script>
(function(){var s=document.createElement('script');s.src='https://cursos.desnudandoelmarketing.com/avisos/on-page.js?v='+Math.floor(Date.now()/6e5);s.defer=true;document.head.appendChild(s);})();
</script>
```

Código de la top bar. Va en **Divi > Opciones del tema > Integración > "Agregar código al <head>"**, para que se vea en todo el sitio (home, cursos y aula). No carga en carrito, checkout, inicio de sesión ni mi cuenta:

```html
<script>
(function(){if(/^\/(checkout|carrito|inicio-de-sesion|mi-cuenta)(\/|$)/.test(location.pathname))return;var s=document.createElement('script');s.src='https://cursos.desnudandoelmarketing.com/avisos/top-bar.js?v='+Math.floor(Date.now()/6e5);s.defer=true;document.head.appendChild(s);})();
</script>
```

La top bar tiene dos etapas: anuncio ("empieza en X días", con link al formulario de la página del Cyber, que hasta ese día no tiene botones de compra) y oferta (cuenta regresiva y toda la barra clickeable). Para probarla: `?aviso=1` muestra la etapa de hoy y `?aviso=oferta` la de oferta.

## Cómo funciona

```
Commit en GitHub (main)
   -> GitHub Actions copia cada carpeta del repo
   -> Las sube por SSH a /var/www/cursos.desnudandoelmarketing.com/<carpeta>/
```

- Cada carpeta es una página. El nombre de la carpeta es la URL.
- La página principal de cada carpeta se llama `index.html`.
- Los archivos que se borran del repo **no** se borran del servidor.

## Agregar una página nueva

1. Creá una carpeta con el nombre que querés en la URL (por ejemplo `black-friday/`) y poné adentro el `index.html` y sus imágenes.
2. Commit en `main`. Listo, no hay que tocar el workflow ni las claves.

Antes de elegir el nombre:
- **Que no exista una página de WordPress con esa URL.** La carpeta real gana y la página de WordPress deja de verse.
- El workflow frena si la carpeta se llama `wp-...`, `cgi-bin` o `.well-known`, para no pisar WordPress.

## Qué se configuró (una sola vez)

1. **xCloud, Site SSH/sFTP Access:** clave pública "github cyber-marketing" tildada (solo autenticación por clave).
2. **GitHub, Settings > Secrets and variables > Actions:**
   - `SSH_KEY`: clave privada (solo existe ahí).
   - `SSH_HOST`: IP del servidor.
   - `SSH_USER`: usuario SSH del sitio.
   - `SSH_FINGERPRINT`: huella del servidor, tipo **ECDSA** (empieza con `SHA256:`).

## Seguridad

- Autenticación solo por clave SSH y verificación de la huella del servidor antes de conectar.
- IP, usuario y clave como secrets, no en el código.
- Acciones fijadas por SHA, permisos mínimos y checkout sin credenciales guardadas.
- Repo privado.
- `Options -Indexes`: no se listan las carpetas (probado: da 404).
- **Cabeceras de seguridad:** el servidor (LiteSpeed en xCloud) **ignora** las cabeceras del `.htaccess`. Se configuran en Cloudflare: HSTS en *SSL/TLS > Edge Certificates* y el resto con una regla en *Rules > Transform Rules > Modify Response Header*.
- La política de referrer está como `<meta name="referrer">` en cada página, porque eso sí funciona sin el servidor.

## Uso diario

- **Editar:** abrí el `index.html` de la carpeta en GitHub, tocá el lápiz y hacé *Commit changes*.
- **Desde la compu:** antes de editar, `git pull`. Al terminar, `git push`. (Se trabaja desde notebook y escritorio: GitHub es la versión oficial.)
- **Publicar a mano:** Actions > "Deploy paginas" > Run workflow.
- **Ver si funcionó:** pestaña Actions. Verde = publicado.

## Notas por página

### menu (Link en bio)
- Tiene GTM `GTM-NDP2Z9X` y el píxel de Meta en el HTML.
- Para medir clics usá activadores "Clic - Solo enlaces" (los botones tienen `<span>` adentro).

### cybermarketing
- Página activa solo durante el Cyber (2 al 4 de noviembre). El resto del año queda oculta.
- **Precios fijos** escritos en `index.html` (precio de lista, precio Cyber al 20% y 3 cuotas). No consulta a WooCommerce, así no le suma carga a WordPress durante el pico de ventas. Si cambia un precio, hay que cambiarlo a mano en el HTML.
- Los botones llevan directo al checkout (`/checkout/?add-to-cart=ID`). El 20% se activa en WooCommerce el domingo previo a las 23:59.
- La cuenta regresiva termina el 4/11/2026 23:59 (hora Argentina): variable `END` en `cyber.js`.
- Si cambiás `cyber.js`, subí el número de `cyber.js?v=2` en `index.html` (Cloudflare lo cachea).
- Tiene GTM `GTM-NDP2Z9X` y el píxel de Meta `1192997017474111` (PageView). Las compras las mide PixelYourSite en el checkout de WordPress.

## Si algo falla

- **No veo el cambio:** Cloudflare cachea. Recargá con Cmd+Shift+R.
- **"host key fingerprint mismatch":** el secret `SSH_FINGERPRINT` está mal. Se saca con `ssh-keyscan -t ecdsa IP | ssh-keygen -lf -`.
- **"permission denied":** revisá que la clave siga tildada en xCloud y que `SSH_KEY` tenga la clave privada completa.
