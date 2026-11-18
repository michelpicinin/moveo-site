/* MOVEO: Text und Bilder beim Scrollen sanft einblenden.
   Abschnitte mit Hintergrundfoto: erst kurz die Höhenlinien, dann legen sich Papiergrund und Foto langsam darüber. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var groups = '.grid-2, .grid-3, .room-circles, .bullet-grid, .btn-row, .class-tags';
  var targets = [];
  document.querySelectorAll('section .wrap').forEach(function (wrap) {
    var i = 0;
    Array.prototype.forEach.call(wrap.children, function (child) {
      if (child.matches(groups)) {
        Array.prototype.forEach.call(child.children, function (item, j) {
          item.style.setProperty('--reveal-delay', (0.08 * j).toFixed(2) + 's');
          targets.push(item);
        });
      } else {
        child.style.setProperty('--reveal-delay', (0.06 * Math.min(i, 4)).toFixed(2) + 's');
        targets.push(child);
      }
      i++;
    });
  });
  var photoSections = document.querySelectorAll('section.hero-photo, section.head-treatment, section.head-yoga, section.head-career, section.visit-bg');
  targets.forEach(function (el) { el.classList.add('reveal'); });
  photoSections.forEach(function (s) { s.classList.add('reveal-bg'); });
  document.documentElement.classList.add('reveal-on');

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add(e.target.classList.contains('reveal-bg') ? 'bg-visible' : 'is-visible');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  targets.forEach(function (el) { io.observe(el); });
  photoSections.forEach(function (s) { io.observe(s); });

  /* Sicherung: falls der Browser den Observer verzögert oder nicht auslöst,
     alles im sichtbaren Bereich per Positionsprüfung zeigen (beim Laden, Scrollen, nach Zeit). */
  function show(el) {
    el.classList.add(el.classList.contains('reveal-bg') ? 'bg-visible' : 'is-visible');
    io.unobserve(el);
  }
  function check() {
    var h = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('.reveal:not(.is-visible), .reveal-bg:not(.bg-visible)').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < h * 0.95 && r.bottom > 0) show(el);
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    setTimeout(function () { ticking = false; check(); }, 120);
  }, { passive: true });
  window.addEventListener('resize', check);
  window.addEventListener('load', function () { setTimeout(check, 400); });
  setTimeout(check, 1200);
  /* Letzte Sicherung: nach 8 Sekunden alles zeigen, was noch versteckt ist und über dem sichtbaren Bereich liegt */
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.is-visible), .reveal-bg:not(.bg-visible)').forEach(function (el) {
      if (el.getBoundingClientRect().top < (window.innerHeight || 0)) show(el);
    });
  }, 8000);
})();
