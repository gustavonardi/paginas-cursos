# Barra de navegación (Divi)

Barra de navegación de cursos.desnudandoelmarketing.com, hecha con código para no usar el módulo de menú de Divi. Sale del diseño de Claude Design "Barra de navegación".

**Se sincroniza sola:** cada push a `main` sube `dem-nav-sitio.html` al servidor, y el shortcode `[dem_nav]` lo muestra en el Header de Divi. Un error subido acá llega a todo el sitio.

## Archivos

| Archivo | Para qué |
|---|---|
| `dem-nav.html` | El original para editar. Los links están marcados con comentarios `LINK`. |
| `dem-nav-sitio.html` | El que muestra el sitio. Se genera con `build.py`; no se edita a mano. |
| `build.py` | Genera `dem-nav-sitio.html` a partir de `dem-nav.html`. |

## Cómo instalarla (una sola vez)

1. Agregar este código al `functions.php` del tema hijo:

   ```php
   // Barra de navegación: muestra el archivo que se sincroniza desde GitHub
   add_shortcode( 'dem_nav', function () {
       $archivo = ABSPATH . 'barra-navegacion/dem-nav-sitio.html';
       return is_readable( $archivo ) ? file_get_contents( $archivo ) : '';
   } );
   ```

2. En Divi > Theme Builder > Header, agregar una sección con una fila de una columna, debajo del banner de avisos.
3. Sumar un módulo **Código** que tenga solo esto:

   ```text
   [dem_nav]
   ```

4. Desactivar las secciones del menú viejo, sin borrarlas, y dejar el banner.
5. Guardar y mirar el sitio con Ctrl+Shift+R (Cloudflare cachea).

Si se ve el texto `[dem_nav]` en la página, falta el paso 1. Si no aparece ninguna barra, el archivo no está en el servidor.

## Cómo cambiar un link o un texto

1. Editar `dem-nav.html` (buscar `LINK`).
2. Generar el archivo del sitio:

   ```bash
   python build.py
   ```

3. Hacer commit y push a `main`. Hay que subir los dos archivos: si falta el paso 2, el sitio no cambia.

No hace falta tocar WordPress ni Divi.

## Cómo se comporta

- **Sin sesión:** muestra "Iniciar sesión" en la barra fina de arriba, en mobile y desktop.
- **Con sesión:** usa la clase `logged-in` que WordPress pone en el `<body>`. Muestra "Ver mis cursos", "Mi cuenta", "Cerrar sesión" y "Hub Laboral".
- **Hasta 1199 px:** menú hamburguesa. Entre 640 y 1199 px abre como panel lateral de 400 px.
- **Carrito:** el contador se actualiza con la Store API de WooCommerce. Si no responde, se oculta y el carrito sigue andando.
- **Logo:** es un SVG dentro del código, así que no hay que subir ninguna imagen.
- **Medición:** la barra no carga píxel ni GTM. Para medir clics, usar activadores "Clic - Solo enlaces".

## Cerrar sesión

El link apunta a `/logout/`. Al hacer clic, el código busca el link que WordPress generó para ese usuario y lo usa; si no lo encuentra, va a `/logout/`.

**No poner en el código la URL larga de `wp-login.php`.** Trae un código que vence y cambia por usuario, y además la clave que esconde el login del sitio.
