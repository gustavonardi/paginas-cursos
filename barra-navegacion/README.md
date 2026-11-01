# Barra de navegación (Divi)

Barra de navegación de cursos.desnudandoelmarketing.com, hecha con código para no usar el módulo de menú de Divi. Sale del diseño de Claude Design "Barra de navegación".

**Importante:** esta barra no se publica sola. El sitio usa lo que está pegado en Divi, así que un cambio en este repo no cambia la barra hasta que se vuelve a pegar el código.

## Archivos

| Archivo | Para qué |
|---|---|
| `dem-nav.html` | El original para editar. Los links están marcados con comentarios `LINK`. |
| `dem-nav-pegar.html` | El que se pega en Divi. Se genera con `build.py`; no se edita a mano. |
| `build.py` | Saca comentarios y saltos de línea para que Divi no agregue `<p>` ni `<br>`. |

## Cómo instalarla

1. En Divi > Theme Builder, abrir el Header.
2. Agregar una sección con una fila de una columna, debajo del banner de avisos.
3. Sumar un módulo **Código** y pegar todo `dem-nav-pegar.html`.
4. Desactivar las secciones del menú viejo, sin borrarlas, y dejar el banner.
5. Guardar y mirar el sitio con Ctrl+Shift+R (Cloudflare cachea).

## Cómo cambiar un link o un texto

1. Editar `dem-nav.html` (buscar `LINK`).
2. Generar el archivo para pegar:

   ```bash
   python build.py
   ```

3. Volver a pegar `dem-nav-pegar.html` en el módulo Código de Divi.

## Cómo se comporta

- **Sin sesión:** muestra "Ingresar" (en desktop en la barra fina de arriba, en mobile dentro del menú).
- **Con sesión:** usa la clase `logged-in` que WordPress pone en el `<body>`. Muestra "Ver mis cursos", "Mi cuenta", "Cerrar sesión" y "Hub Laboral".
- **Hasta 1199 px:** menú hamburguesa. Entre 640 y 1199 px abre como panel lateral de 400 px.
- **Carrito:** el contador se actualiza con la Store API de WooCommerce. Si no responde, se oculta y el carrito sigue andando.
- **Logo:** es un SVG dentro del código, así que no hay que subir ninguna imagen.
- **Medición:** la barra no carga píxel ni GTM. Para medir clics, usar activadores "Clic - Solo enlaces".

## Cerrar sesión

El link apunta a `/logout/`. Al hacer clic, el código busca el link que WordPress generó para ese usuario y lo usa; si no lo encuentra, va a `/logout/`.

**No pegar en el código la URL larga de `wp-login.php`.** Trae un código que vence y cambia por usuario, y además la clave que esconde el login del sitio.
