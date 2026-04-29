/* Line System - Decorative SVG lines connecting sections */
(function () {
  var isMobile = window.innerWidth < 768;
  if (isMobile) return;

  var LINE_COLOR = '#C4B8A8';
  var DOT_COLOR = '#1A1A1A';
  var STROKE_WIDTH = 1.5;
  var DOT_RADIUS = 4;

  // Create SVG element for a section
  function createSvg(parent) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'line-svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.overflow = 'visible';
    svg.style.zIndex = '1';
    parent.style.position = 'relative';
    parent.appendChild(svg);
    return svg;
  }

  function createPath(svg, d) {
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', LINE_COLOR);
    path.setAttribute('stroke-width', STROKE_WIDTH);
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);

    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    return { el: path, length: len };
  }

  function createDot(svg, cx, cy) {
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', DOT_RADIUS);
    circle.setAttribute('fill', DOT_COLOR);
    circle.style.opacity = '0';
    circle.style.transition = 'opacity 0.3s';
    svg.appendChild(circle);
    return circle;
  }

  // Get element center relative to parent
  function getRelativeCenter(el, parent) {
    var elRect = el.getBoundingClientRect();
    var parentRect = parent.getBoundingClientRect();
    return {
      x: elRect.left - parentRect.left + elRect.width / 2,
      y: elRect.top - parentRect.top + elRect.height / 2
    };
  }

  // ---- SECTION LINES ----

  var segments = [];

  // Contacto: converging lines to CTA button
  function initContactoLines() {
    var section = document.getElementById('contacto');
    if (!section) return;

    var btn = section.querySelector('.btn-contacto');
    if (!btn) return;

    var svg = createSvg(section);

    requestAnimationFrame(function () {
      var sectionRect = section.getBoundingClientRect();
      var w = section.offsetWidth;
      var h = section.offsetHeight;
      var btnPos = getRelativeCenter(btn, section);

      // Multiple lines converging from edges to button
      var origins = [
        { x: w * 0.1, y: h * 0.1 },
        { x: w * 0.9, y: h * 0.15 },
        { x: w * 0.05, y: h * 0.5 },
        { x: w * 0.95, y: h * 0.45 },
        { x: w * 0.2, y: h * 0.2 }
      ];

      origins.forEach(function (origin) {
        var midX = (origin.x + btnPos.x) / 2;
        var midY = (origin.y + btnPos.y) / 2;
        var d = 'M ' + origin.x + ' ' + origin.y +
                ' Q ' + midX + ' ' + origin.y + ', ' + btnPos.x + ' ' + btnPos.y;

        var seg = createPath(svg, d);
        var dot = createDot(svg, origin.x, origin.y);

        segments.push({
          section: section,
          path: seg,
          dots: [
            { el: dot, t: 0 }
          ]
        });
      });
    });
  }

  // ---- SCROLL ANIMATION ----

  function animateSegments() {
    segments.forEach(function (seg) {
      var rect = seg.section.getBoundingClientRect();
      var vh = window.innerHeight;

      // Progress: 0 when section enters viewport, 1 when fully scrolled through
      var progress = Math.max(0, Math.min(1,
        (vh - rect.top) / (vh + rect.height)
      ));

      // Draw path
      var offset = seg.path.length * (1 - progress);
      seg.path.el.style.strokeDashoffset = offset;

      // Show dots when drawing reaches them
      seg.dots.forEach(function (dot) {
        dot.el.style.opacity = progress >= dot.t ? '1' : '0';
      });
    });
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        animateSegments();
        ticking = false;
      });
      ticking = true;
    }
  }

  // ---- INIT ----

  function init() {
    initContactoLines();

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial draw
    setTimeout(function () { animateSegments(); }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Recalculate on resize (debounced)
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth < 768) return;
      // Remove existing SVGs and reinitialize
      document.querySelectorAll('.line-svg').forEach(function (svg) {
        svg.remove();
      });
      segments = [];
      init();
    }, 300);
  });
})();
