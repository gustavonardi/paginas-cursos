/*
  Aviso "top bar": barra celeste fija arriba de todo, en dos etapas. Se pega una sola vez en Divi (Opciones del tema > Integración).
  - Anuncio: dice en cuántos días empieza la oferta. No lleva a ningún lado, para que nadie compre antes a precio normal.
  - Oferta: cuenta regresiva y toda la barra clickeable.
  Para el próximo evento: cambiar solo el bloque AVISO de abajo y hacer commit.
  Fuera de las fechas no se muestra nada. Para verlo antes: agregar ?aviso=1 a la URL (etapa de hoy) o ?aviso=oferta (etapa de oferta).
*/
(function(){
  var AVISO = {
    anuncio: '2026-10-30T00:00:00-03:00',  // hora Argentina. Desde acá se muestra el anuncio
    desde: '2026-11-02T00:00:00-03:00',    // empieza la oferta
    hasta: '2026-11-05T00:00:00-03:00',    // la cuenta regresiva llega a cero y la barra se oculta en este momento
    reaparece: '2026-11-04T00:00:00-03:00',  // si la cerraron antes de este momento (o antes de que empiece la oferta), vuelve a mostrarse
    // Se muestra el último nombre cuya fecha ya pasó; el primero corre desde que arranca la oferta
    nombres: [
      { desde: '2026-11-02T00:00:00-03:00', nombre: 'Cyber Marketing' },
      { desde: '2026-11-04T00:00:00-03:00', nombre: 'Último día' },
      { desde: '2026-11-04T18:00:00-03:00', nombre: 'Últimas horas' }
    ],
    oferta: '20% OFF',
    detalle: 'ya aplicado',
    cierre: 'termina en',
    boton: 'Ver ofertas',
    link: 'https://cursos.desnudandoelmarketing.com/cybermarketing/',
    // Textos de la etapa de anuncio
    anuncioNombre: 'Cyber Marketing',
    anuncioDetalle: 'en todo',
    anuncioCierre: 'empieza',
    anuncioFecha: 'Lunes 2/11'
  };

  var ahora = Date.now();
  var inicio = new Date(AVISO.desde).getTime();
  var fin = new Date(AVISO.hasta).getTime();
  var forzarOferta = /[?&]aviso=oferta\b/.test(location.search);
  var forzado = forzarOferta || /[?&]aviso=1\b/.test(location.search);
  if (!forzado && (ahora < new Date(AVISO.anuncio).getTime() || ahora >= fin)) return;

  // Si la cerró, no vuelve durante esta sesión, salvo que la haya cerrado antes de que empiece la oferta o antes de AVISO.reaparece y ese momento ya haya llegado.
  // Puede fallar con el almacenamiento bloqueado: ahí solo se cierra hasta recargar.
  var CERRADA = 'dem-top-bar-cerrada';
  try {
    var cerradaEn = Number(sessionStorage.getItem(CERRADA));
    var vuelve = [inicio, new Date(AVISO.reaparece).getTime()].some(function (m) { return cerradaEn < m && ahora >= m; });
    if (!forzado && cerradaEn && !vuelve) return;
  } catch (e) {}

  // Todo va bajo #dem-top-bar para que los estilos de Divi no lo pisen (y viceversa)
  var css =
    '#dem-top-bar{position:fixed;top:var(--dem-top,0);left:0;right:0;z-index:100000;background:#359de1;box-shadow:0 6px 18px rgba(55,63,81,0.18);' +
      'font-family:"Montserrat",Helvetica,Arial,sans-serif;font-weight:700;font-size:14px;line-height:1.2}' +
    '#dem-top-bar *{box-sizing:border-box}' +
    '#dem-top-bar a{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 18px;min-height:48px;padding:10px 44px;color:#fff;text-decoration:none}' +
    '#dem-top-bar a:focus-visible,#dem-top-bar button:focus-visible{outline:2px solid #fff;outline-offset:-4px}' +
    '#dem-top-bar .dem-l1,#dem-top-bar .dem-l2{display:flex;align-items:center;gap:7px;letter-spacing:.12em;text-transform:uppercase;font-size:12px;white-space:nowrap}' +
    '#dem-top-bar .dem-l2{gap:18px}' +
    '#dem-top-bar b{background:#373f51;color:#fed766;font-weight:800;padding:3px 7px;border-radius:4px}' +
    '#dem-top-bar .dem-t{font-weight:800;font-size:16px;letter-spacing:0;font-variant-numeric:tabular-nums;text-transform:none}' +
    '#dem-top-bar .dem-btn{background:#fed766;color:#373f51;border-radius:999px;padding:7px 16px;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:none;white-space:nowrap}' +
    '#dem-top-bar a:hover .dem-btn{background:#e2bd57}' +
    '#dem-top-bar button{position:absolute;top:0;right:0;width:44px;height:44px;margin:0;padding:0;border:0;border-radius:0;background:none;box-shadow:none;color:#fff;font-family:inherit;font-size:30px;font-weight:400;line-height:44px;text-align:center;cursor:pointer}' +
    '@media (max-width:640px){' +
      '#dem-top-bar a{gap:5px 10px;min-height:0;padding:7px 36px 7px 10px}' +
      '#dem-top-bar .dem-l1{flex-basis:100%;justify-content:center;gap:6px;letter-spacing:.03em;font-size:11px}' +
      '#dem-top-bar .dem-l1 b{order:-1;padding:2px 6px}' +
      '#dem-top-bar .dem-l2{gap:10px;letter-spacing:.03em;font-size:11px}' +
      '#dem-top-bar .dem-sep-fin{display:none}' +
      '#dem-top-bar .dem-t{font-size:14px}' +
      '#dem-top-bar .dem-btn{padding:5px 12px;font-size:11px;letter-spacing:.03em}' +
      '#dem-top-bar button{width:36px;height:36px;font-size:26px;line-height:36px}' +
    '}';

  function iniciar() {
    if (document.getElementById('dem-top-bar')) return;

    // Montserrat propia, por si la página no trae los grosores que usa el aviso
    var fuente = document.createElement('link');
    fuente.rel = 'stylesheet';
    fuente.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(fuente);

    var estilo = document.createElement('style');
    estilo.textContent = css;
    document.head.appendChild(estilo);

    // En celular, el CSS pone la oferta primero y saca el separador del final
    var barra = document.createElement('div');
    barra.id = 'dem-top-bar';
    barra.innerHTML =
      '<a id="aviso-top-bar">' +
        '<span class="dem-l1">' +
          '<span class="dem-nombre"></span><span>·</span><b>' + AVISO.oferta + '</b><span class="dem-detalle"></span><span class="dem-sep-fin">·</span>' +
        '</span>' +
        '<span class="dem-l2">' +
          '<span class="dem-cierre"></span>' +
          '<span class="dem-t"></span>' +
          '<span class="dem-fecha">' + AVISO.anuncioFecha + '</span>' +
          '<span class="dem-btn">' + AVISO.boton + '</span>' +
        '</span>' +
      '</a>' +
      '<button type="button" aria-label="Cerrar aviso">×</button>';

    // Espacio del mismo alto que la barra, para que no tape el principio de la página
    var hueco = document.createElement('div');
    hueco.setAttribute('aria-hidden', 'true');

    document.body.insertBefore(hueco, document.body.firstChild);
    document.body.appendChild(barra);

    function medir() {
      // Con la sesión de WordPress iniciada, la barra va debajo de la barra de administración
      var admin = document.getElementById('wpadminbar');
      var fija = admin && getComputedStyle(admin).position === 'fixed';
      barra.style.setProperty('--dem-top', (fija ? admin.offsetHeight : 0) + 'px');
      hueco.style.height = barra.offsetHeight + 'px';
    }
    medir();
    window.addEventListener('resize', medir);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);

    var enlace = barra.querySelector('a');
    var reloj = barra.querySelector('.dem-t');
    var nombre = barra.querySelector('.dem-nombre');
    var detalle = barra.querySelector('.dem-detalle');
    var cierre = barra.querySelector('.dem-cierre');
    var fecha = barra.querySelector('.dem-fecha');
    var boton = barra.querySelector('.dem-btn');
    var etapa = '';
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var intervalo;
    function quitar() {
      clearInterval(intervalo);
      barra.remove();
      hueco.remove();
      window.removeEventListener('resize', medir);
    }
    barra.querySelector('button').addEventListener('click', function () {
      try { sessionStorage.setItem(CERRADA, String(Date.now())); } catch (e) {}
      quitar();
    });
    function tick() {
      var momento = Date.now();
      var resta = fin - momento;
      if (resta <= 0 && !forzado) {
        quitar();
        return;
      }
      resta = Math.max(0, resta);
      var enOferta = forzarOferta || momento >= inicio;
      var nueva;
      if (enOferta) {
        var i = 0;
        AVISO.nombres.forEach(function (t, j) { if (momento >= new Date(t.desde).getTime()) i = j; });
        nueva = 'oferta' + i;
      } else {
        nueva = 'anuncio';
      }
      if (nueva !== etapa) {
        etapa = nueva;
        if (enOferta) {
          enlace.href = AVISO.link;
          nombre.textContent = AVISO.nombres[i].nombre;
          detalle.textContent = AVISO.detalle;
          cierre.textContent = AVISO.cierre;
        } else {
          enlace.removeAttribute('href');
          nombre.textContent = AVISO.anuncioNombre;
          detalle.textContent = AVISO.anuncioDetalle;
          cierre.textContent = AVISO.anuncioCierre;
        }
        fecha.style.display = enOferta ? 'none' : '';
        boton.style.display = enOferta ? '' : 'none';
      }
      if (enOferta) {
        reloj.textContent =
          pad(Math.floor(resta / 36e5)) + 'h ' +
          pad(Math.floor(resta / 6e4) % 60) + 'm ' +
          pad(Math.floor(resta / 1e3) % 60) + 's';
      } else {
        var dias = Math.ceil((inicio - momento) / 864e5);
        reloj.textContent = dias === 1 ? 'mañana' : 'en ' + dias + ' días';
      }
      medir();
    }
    intervalo = setInterval(tick, 1000);
    tick();
  }

  // Desde Integración el script puede correr antes de que exista el body
  if (document.body) iniciar();
  else document.addEventListener('DOMContentLoaded', iniciar);
})();
