/* ============================================================
   Gallery masonry — packs photos tightly by their own height
   instead of letting a whole grid row size to its tallest photo.
   Each .g-item gets an inline grid-row-end span computed from its
   rendered height against the grid's fine-grained auto-row unit
   (see .g-grid { grid-auto-rows: 1px } in css/style.css). Because
   this only changes each item's row-span — never its position in
   the markup — the left-to-right, top-to-bottom reading order set
   in the HTML is left untouched; items simply pack more snugly.
   ============================================================ */
(function () {
  'use strict';

  var ROW_UNIT = 1;   // must match grid-auto-rows in css/style.css
  var GAP = 48;        // desired visual gap between photos, baked into the span

  function autoSpan(item) {
    var h = item.getBoundingClientRect().height;
    if (!h) return;
    var span = Math.max(1, Math.ceil((h + GAP) / ROW_UNIT));
    item.style.gridRowEnd = 'span ' + span;
  }

  function init(grid) {
    var items = Array.prototype.slice.call(grid.children).filter(function (el) {
      return el.classList.contains('g-item');
    });
    if (!items.length) return;

    items.forEach(function (item) {
      var img = item.querySelector('img');
      if (!img) { autoSpan(item); return; }
      if (img.complete && img.naturalWidth) {
        autoSpan(item);
      } else {
        img.addEventListener('load', function () { autoSpan(item); });
        img.addEventListener('error', function () { autoSpan(item); });
      }
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        items.forEach(autoSpan);
      }, 150);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grids = document.querySelectorAll('.g-grid');
    Array.prototype.forEach.call(grids, init);
  });
})();
