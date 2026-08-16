/* ============================================================
   Gallery lightbox — view one photo at a time.
   Click a photo → overlay with prev / next and a counter.
   Keyboard: ← → navigate, Esc closes. No captions by design;
   internal photo names live in each item's data-name attribute.
   Also handles the fade-in-on-scroll reveal for each photo.
   ============================================================ */
(function () {
  'use strict';

  var items = Array.prototype.slice.call(document.querySelectorAll('.g-grid .g-item'));
  if (!items.length) return;

  /* reveal each photo as it scrolls into view */
  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.g-item[data-reveal]');
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
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML =
    '<div class="lb-top">' +
      '<span class="lb-counter"></span>' +
      '<button class="lb-close" type="button" aria-label="Close">Close &times;</button>' +
    '</div>' +
    '<div class="lb-frame"></div>' +
    '<div class="lb-bottom">' +
      '<button class="lb-prev" type="button" aria-label="Previous photo">&larr; Prev</button>' +
      '<button class="lb-next" type="button" aria-label="Next photo">Next &rarr;</button>' +
    '</div>';
  document.body.appendChild(lb);

  var frame = lb.querySelector('.lb-frame');
  var counter = lb.querySelector('.lb-counter');
  var current = 0, open = false;

  function show(i) {
    current = (i + items.length) % items.length;
    var img = items[current].querySelector('img');
    frame.innerHTML = '';
    if (img) {
      var big = img.cloneNode(false);
      big.removeAttribute('loading');
      frame.appendChild(big);
    }
    counter.textContent =
      String(current + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
  }

  function openAt(i) {
    show(i);
    lb.classList.add('is-open');
    document.body.classList.add('lb-lock');
    open = true;
    lb.querySelector('.lb-close').focus();
  }
  function close() {
    lb.classList.remove('is-open');
    document.body.classList.remove('lb-lock');
    open = false;
    items[current].focus();
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      openAt(i);
    });
  });

  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });

  document.addEventListener('keydown', function (e) {
    if (!open) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });
})();
