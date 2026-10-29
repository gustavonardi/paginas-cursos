// Cyber Marketing: cuenta regresiva, barra fija, carrusel de reseñas y precios en vivo.
(function () {
  var END = new Date('2026-11-04T23:59:59-03:00').getTime();
  var STORE = 'https://cursos.desnudandoelmarketing.com';

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

  // Precios en vivo desde WooCommerce. Si falla, quedan los precios escritos en el HTML.
  var fmt = function (cents) { return '$ ' + Math.round(cents / 100).toLocaleString('es-AR'); };
  var cards = document.querySelectorAll('[data-id]');
  var ids = Array.prototype.map.call(cards, function (c) { return c.getAttribute('data-id'); });
  fetch(STORE + '/wp-json/wc/store/v1/products?include=' + ids.join(',') + '&per_page=50')
    .then(function (r) { return r.json(); })
    .then(function (list) {
      cards.forEach(function (card) {
        var p = list.find(function (x) { return String(x.id) === card.getAttribute('data-id'); });
        if (!p) return;
        var regular = +p.prices.regular_price, price = +p.prices.price;
        if (!price) return;
        var off = regular > price ? Math.round((1 - price / regular) * 100) : 0;
        card.querySelector('.reg').textContent = fmt(regular);
        card.querySelector('.reg').hidden = !off;
        card.querySelector('.cuota').textContent = fmt(price / 3);
        card.querySelector('.pago-val').textContent = fmt(price);
        var tag = card.querySelector('.tag-off');
        tag.textContent = off + '% OFF';
        tag.hidden = !off;
      });
    })
    .catch(function () {});
})();
