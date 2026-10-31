/*
  Aviso "on page": bloque dentro de la página (ej. home de cursos), se pega una sola vez en un módulo Código de Divi.
  Para el próximo evento: cambiar solo el bloque AVISO de abajo y hacer commit.
  Fuera de las fechas no se muestra nada. Para verlo antes: agregar ?aviso=1 a la URL.
*/
(function(){
  var AVISO = {
    desde: '2026-11-02T00:00:00-03:00',  // hora Argentina
    hasta: '2026-11-05T00:00:00-03:00',  // se oculta en este momento
    etiqueta: 'CYBER MARKETING',
    fecha: '2 al 4 de noviembre',
    titulo: '<span>20% OFF</span><br>+ 3 cuotas sin interés',
    bajada: 'En <strong>TODOS</strong> los combos y cursos',
    bonus: '<strong>NUEVO:</strong> con tu compra accedés al <strong>Hub Laboral</strong>. Tips de CV, entrevistas y LinkedIn',
    boton: 'Ver cursos con 20% OFF →',
    link: 'https://cursos.desnudandoelmarketing.com/cybermarketing/'
  };

  var caja = document.getElementById('dem-aviso-on-page');
  if (!caja) return;

  var ahora = new Date();
  var forzado = /[?&]aviso=1\b/.test(location.search);
  if (!forzado && (ahora < new Date(AVISO.desde) || ahora >= new Date(AVISO.hasta))) return;

  // Todo va bajo #dem-aviso-on-page para que los estilos de Divi no lo pisen (y viceversa)
  var css =
    '#dem-aviso-on-page{padding:32px 16px;font-family:"Montserrat",Helvetica,Arial,sans-serif}' +
    '#dem-aviso-on-page *{box-sizing:border-box}' +
    '#dem-aviso-on-page .dem-av{display:grid;grid-template-columns:1fr;gap:20px;max-width:1080px;margin:0 auto;padding:26px 22px;border-radius:20px;' +
      'background:#373f51;border:1px solid rgba(254,215,102,0.35);' +
      'box-shadow:0 24px 50px -24px rgba(55,63,81,0.7);color:#fff;text-decoration:none;transition:transform .15s ease,border-color .15s ease}' +
    '#dem-aviso-on-page .dem-av:hover{transform:translateY(-2px);border-color:#fed766}' +
    '#dem-aviso-on-page .dem-av:focus-visible{outline:2px solid #fed766;outline-offset:3px}' +
    '#dem-aviso-on-page .dem-col{display:flex;flex-direction:column;gap:12px;justify-content:center}' +
    '#dem-aviso-on-page .dem-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px}' +
    '#dem-aviso-on-page .dem-tag{background:linear-gradient(90deg,#f58220 0%,#e84b1a 100%);color:#fff;font-weight:800;font-size:12px;letter-spacing:.14em;padding:6px 11px;border-radius:4px;line-height:1.2}' +
    '#dem-aviso-on-page .dem-fecha{font-size:14px;font-weight:700;color:#eaf5fc;line-height:1.2}' +
    '#dem-aviso-on-page .dem-titulo{margin:0;padding:0;font-weight:800;font-size:28px;line-height:1.15;color:#fff;text-wrap:balance}' +
    '#dem-aviso-on-page .dem-titulo span{color:#fed766}' +
    '#dem-aviso-on-page .dem-bajada{margin:0;padding:0;font-size:16px;font-weight:600;color:#eaf5fc;line-height:1.4}' +
    '#dem-aviso-on-page .dem-bajada strong{color:#fff;font-weight:800}' +
    '#dem-aviso-on-page .dem-bonus{display:flex;gap:10px;align-items:flex-start;background:rgba(254,215,102,0.1);border:1px solid rgba(254,215,102,0.3);' +
      'border-radius:12px;padding:13px 15px;font-size:15px;line-height:1.45;color:#fff}' +
    '#dem-aviso-on-page .dem-bonus strong{color:#fed766;font-weight:800}' +
    '#dem-aviso-on-page .dem-ico{flex:none;font-size:18px;line-height:1.3}' +
    '#dem-aviso-on-page .dem-btn{display:block;text-align:center;background:#fed766;color:#373f51;font-weight:800;font-size:16px;line-height:1.2;' +
      'padding:15px 20px;border-radius:999px;transition:background .15s ease}' +
    '#dem-aviso-on-page .dem-av:hover .dem-btn{background:#e2bd57}' +
    '@media (min-width:860px){' +
      '#dem-aviso-on-page{padding:48px 24px}' +
      '#dem-aviso-on-page .dem-av{grid-template-columns:1.1fr 1fr;gap:36px;padding:36px 40px}' +
      '#dem-aviso-on-page .dem-titulo{font-size:40px}' +
      '#dem-aviso-on-page .dem-bajada{font-size:18px}' +
    '}' +
    '@media (prefers-reduced-motion:reduce){#dem-aviso-on-page .dem-av,#dem-aviso-on-page .dem-btn{transition:none}}';

  // Montserrat propia, por si la página no trae los grosores que usa el aviso
  var fuente = document.createElement('link');
  fuente.rel = 'stylesheet';
  fuente.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(fuente);

  var estilo = document.createElement('style');
  estilo.textContent = css;
  document.head.appendChild(estilo);

  caja.innerHTML =
    '<a class="dem-av" id="aviso-on-page" href="' + AVISO.link + '">' +
      '<div class="dem-col">' +
        '<div class="dem-top"><span class="dem-tag">' + AVISO.etiqueta + '</span><span class="dem-fecha">' + AVISO.fecha + '</span></div>' +
        '<p class="dem-titulo">' + AVISO.titulo + '</p>' +
        '<p class="dem-bajada">' + AVISO.bajada + '</p>' +
      '</div>' +
      '<div class="dem-col">' +
        '<div class="dem-bonus"><span class="dem-ico" aria-hidden="true">🎁</span><span>' + AVISO.bonus + '</span></div>' +
        '<span class="dem-btn">' + AVISO.boton + '</span>' +
      '</div>' +
    '</a>';
})();
