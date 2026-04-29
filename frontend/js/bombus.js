/* Bombus - Wing loader for hero bee animation */
(function () {
  var container = document.getElementById('heroBombus');
  if (!container) return;

  fetch('assets/bombus/wings.svg')
    .then(function (r) { return r.text(); })
    .then(function (svgText) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(svgText, 'image/svg+xml');
      var svgEl = doc.querySelector('svg');
      if (!svgEl) return;

      var viewBox = svgEl.getAttribute('viewBox') || '0 0 1493.33 1237.33';
      var vbWidth = viewBox.split(' ')[2] || '1493.33';

      function buildWing(id, mirrorTransform) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'bombus-wing-svg');
        svg.setAttribute('id', id);
        svg.setAttribute('viewBox', viewBox);
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('fill', '#1a1a1a');
        g.setAttribute('opacity', '0.85');
        if (mirrorTransform) g.setAttribute('transform', mirrorTransform);
        for (var i = 0; i < svgEl.childNodes.length; i++) {
          g.appendChild(svgEl.childNodes[i].cloneNode(true));
        }
        svg.appendChild(g);
        return svg;
      }

      var wingR = buildWing('wingRight', null);
      var wingL = buildWing('wingLeft', 'translate(' + vbWidth + ',0) scale(-1,1)');

      var bodyImg = container.querySelector('picture') || container.querySelector('.bombus-body');
      container.insertBefore(wingR, bodyImg);
      container.insertBefore(wingL, bodyImg);
    })
    .catch(function (err) { console.error('Bombus wing load failed:', err); });
})();
