// Cyber Marketing: cuenta regresiva, barra fija y carrusel de reseñas.
// Los precios son fijos y están escritos en index.html.
(function () {
  var START = new Date('2026-11-02T00:00:00-03:00').getTime();
  var END = new Date('2026-11-04T23:59:59-03:00').getTime();
  var previo = document.documentElement.classList.contains('previo');
  var forzado = /[?&]modo=previo\b/.test(location.search);

  // Modo previo: los botones de compra llevan al formulario y los precios avisan desde cuándo valen
  if (previo) {
    document.querySelectorAll('.combo-foot .btn, .single > .btn, .club-precio .btn').forEach(function (a) {
      a.href = '#avisame';
      a.removeAttribute('target');
      a.removeAttribute('rel');
      a.textContent = 'Avisame el lunes';
    });
    document.querySelectorAll('.precio, .club-precio .reg').forEach(function (el) {
      var tag = document.createElement('span');
      tag.className = 'previo-tag';
      tag.textContent = 'Precio desde el lunes';
      if (el.classList.contains('precio')) el.insertBefore(tag, el.firstChild);
      else el.parentNode.insertBefore(tag, el);
    });

    // Textos del formulario de Brevo (tienen que estar antes de cargar su script)
    window.REQUIRED_CODE_ERROR_MESSAGE = 'Please choose a country code';
    window.LOCALE = 'en';
    window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = 'La información es inválida. Intentá de nuevo.';
    window.REQUIRED_ERROR_MESSAGE = 'No podés dejar este campo en blanco.';
    window.GENERIC_INVALID_MESSAGE = 'La información es inválida. Intentá de nuevo.';
    window.INVALID_NUMBER = 'La información es inválida. Intentá de nuevo.';
    window.INVALID_DATE = 'Please enter a valid date';
    window.REQUIRED_MULTISELECT_MESSAGE = 'Please select at least 1 option';
    window.translation = { common: { selectedList: '{quantity} list selected', selectedLists: '{quantity} lists selected', selectedOption: '{quantity} selected', selectedOptions: '{quantity} selected' } };
    window.AUTOHIDE = false;
    var sib = document.createElement('script');
    sib.src = 'https://sibforms.com/forms/end-form/build/main.js';
    document.body.appendChild(sib);
  }

  // Cuenta regresiva (todos los elementos con data-cd)
  var pad = function (n) { return String(n).padStart(2, '0'); };
  function tick() {
    var now = Date.now();
    // Si la página quedó abierta hasta el inicio, recarga para pasar al modo oferta
    if (previo && !forzado && now >= START) { location.reload(); return; }
    var diff = Math.max(0, (previo ? START : END) - now);
    var v = {
      label: previo ? 'La oferta empieza en' : now > END ? 'Terminó Cyber Marketing' : 'La oferta termina en',
      d: pad(Math.floor(diff / 864e5)),
      h: pad(Math.floor(diff / 36e5) % 24),
      m: pad(Math.floor(diff / 6e4) % 60),
      s: pad(Math.floor(diff / 1e3) % 60)
    };
    document.querySelectorAll('[data-cd]').forEach(function (el) {
      var k = el.getAttribute('data-cd');
      if (el.textContent !== v[k]) el.textContent = v[k];
    });
  }
  tick();
  setInterval(tick, 1000);

  // Barra amarilla: aparece cuando la cuenta regresiva del hero sale de la pantalla
  var bar = document.getElementById('cd-bar');
  var heroCd = document.getElementById('hero-cd');
  function onScroll() {
    var past = heroCd.getBoundingClientRect().bottom < 0;
    bar.classList.toggle('on', past);
    bar.setAttribute('aria-hidden', past ? 'false' : 'true');
    bar.querySelectorAll('a').forEach(function (a) { a.tabIndex = past ? 0 : -1; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Carrusel de reseñas
  var car = document.getElementById('car');
  var dots = document.querySelectorAll('#dots button');
  function step() {
    var c = car.children[0];
    return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(car).columnGap || 0) : 300;
  }
  document.getElementById('car-prev').addEventListener('click', function () { car.scrollBy({ left: -step(), behavior: 'smooth' }); });
  document.getElementById('car-next').addEventListener('click', function () { car.scrollBy({ left: step(), behavior: 'smooth' }); });
  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { car.scrollTo({ left: i * step(), behavior: 'smooth' }); });
  });
  car.addEventListener('scroll', function () {
    var i = Math.round(car.scrollLeft / step());
    dots.forEach(function (d, j) { d.classList.toggle('on', i === j); });
  }, { passive: true });
})();
