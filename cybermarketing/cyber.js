// Cyber Marketing: cuenta regresiva, barra fija y carrusel de reseñas.
// Los precios son fijos y están escritos en index.html.
(function () {
  var END = new Date('2026-11-04T23:59:59-03:00').getTime();

  // Cuenta regresiva (todos los elementos con data-cd)
  var pad = function (n) { return String(n).padStart(2, '0'); };
  function tick() {
    var now = Date.now();
    var diff = Math.max(0, END - now);
    var v = {
      label: now > END ? 'Terminó Cyber Marketing' : 'La oferta termina en',
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
    bar.querySelector('a').tabIndex = past ? 0 : -1;
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
