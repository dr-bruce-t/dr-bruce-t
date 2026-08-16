/* ============================================================
   Landing-page animations only. Inner pages load no JS.
   Loader counter → curtain lift → line reveals (CSS-driven),
   scroll reveals, hero mouse parallax, custom cursor.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- loader: number counts up, line draws with it ---------- */
  var countEl = document.querySelector('.loader-count');
  var barEl = document.querySelector('.loader-bar');

  function done() {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-loaded');
  }

  if (reduced || !countEl) {
    done();
  } else {
    var DUR = 1300, t0 = null;
    var tick = function (now) {
      if (t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / DUR);
      var eased = 1 - Math.pow(1 - p, 3);
      countEl.textContent = Math.round(eased * 100);
      if (barEl) barEl.style.transform = 'scaleX(' + eased + ')';
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(done, 150);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- scroll reveals ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- hero mouse parallax ---------- */
  var hero = document.querySelector('.hero');
  var floats = document.querySelectorAll('.float');
  if (hero && floats.length && !reduced) {
    var tx = 0, ty = 0, mx = 0, my = 0;
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    hero.addEventListener('mouseleave', function () { tx = 0; ty = 0; });
    (function loop() {
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      floats.forEach(function (f) {
        var d = parseFloat(f.getAttribute('data-depth')) || 1;
        f.style.transform = 'translate(' + (-mx * d * 14) + 'px,' + (-my * d * 14) + 'px)';
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- custom cursor ---------- */
  var cursor = document.querySelector('.cursor');
  if (cursor && !reduced && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      cursor.classList.add('on');
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseover', function (e) {
      cursor.classList.toggle('grow', !!(e.target.closest && e.target.closest('a')));
    });
    document.addEventListener('mouseleave', function () { cursor.classList.remove('on'); });
  }
})();
