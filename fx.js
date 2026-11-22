(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // number keys 1-5 jump between pages
  var links = document.querySelectorAll('.ov nav a');
  addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || e.target.isContentEditable) return;
    var link = links[Number(e.key) - 1];
    if (link) location.href = link.href;
  });

  // typed boot log
  var lines = document.querySelectorAll('[data-type]');
  if (!reduce && lines.length) {
    var html = [];
    lines.forEach(function (el) { html.push(el.innerHTML); el.textContent = ''; el.style.visibility = 'hidden'; });
    var i = 0;
    (function next() {
      if (i >= lines.length) return;
      var el = lines[i], full = html[i], tmp = document.createElement('div');
      tmp.innerHTML = full;
      var text = tmp.textContent, n = 0;
      el.style.visibility = 'visible';
      i++;
      (function tick() {
        el.textContent = text.slice(0, ++n);
        if (n < text.length) setTimeout(tick, 14);
        else { el.innerHTML = full; setTimeout(next, 110); }
      })();
    })();
  }

  // progress bars: width set via CSSOM (allowed by the strict CSP)
  var bars = document.querySelectorAll('.bar i[data-p]');
  function fill() { bars.forEach(function (b) { b.style.width = b.dataset.p + '%'; }); }
  if (bars.length) {
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.style.width = e.target.dataset.p + '%'; io.unobserve(e.target); } });
      });
      bars.forEach(function (b) { io.observe(b); });
    } else fill();
    addEventListener('beforeprint', fill);
  }

  // copy email
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      navigator.clipboard && navigator.clipboard.writeText(b.dataset.copy).then(function () {
        var t = b.textContent; b.textContent = 'copied!'; setTimeout(function () { b.textContent = t; }, 1400);
      });
    });
  });

  var pr = document.getElementById('print');
  if (pr) pr.addEventListener('click', function () { fill(); print(); });

  // radar
  var cv = document.getElementById('radar');
  if (!cv) return;
  var x = cv.getContext('2d'), S = 0, blips = [], ang = 0, running = true;
  var labels = ['ssh brute', 'port scan', 'sqli probe', 'ftp anon', 'dns axfr', 'smb null', 'snmp walk', 'beacon', 'arp spoof'];
  function size() { var r = cv.getBoundingClientRect(), d = devicePixelRatio || 1; cv.width = S = Math.round(r.width * d); cv.height = S; }
  size(); addEventListener('resize', size);
  document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running && !reduce) requestAnimationFrame(draw); });
  function draw() {
    var c = S / 2, R = c - 4;
    x.clearRect(0, 0, S, S);
    x.strokeStyle = 'rgba(77,243,255,.22)'; x.lineWidth = 1;
    for (var k = 1; k <= 4; k++) { x.beginPath(); x.arc(c, c, R * k / 4, 0, 7); x.stroke(); }
    x.beginPath(); x.moveTo(c, c - R); x.lineTo(c, c + R); x.moveTo(c - R, c); x.lineTo(c + R, c); x.stroke();
    if (x.createConicGradient) {
      var g = x.createConicGradient(ang - 1.2, c, c);
      g.addColorStop(0, 'rgba(77,243,255,0)'); g.addColorStop(.19, 'rgba(77,243,255,.45)'); g.addColorStop(.2, 'rgba(77,243,255,0)');
      x.fillStyle = g; x.beginPath(); x.arc(c, c, R, 0, 7); x.fill();
    }
    if (Math.random() < .035) {
      var a = Math.random() * 6.28, r = (.25 + Math.random() * .65) * R;
      blips.push({ x: c + Math.cos(a) * r, y: c + Math.sin(a) * r, t: 1, k: labels[Math.random() * labels.length | 0] });
    }
    blips = blips.filter(function (b) { return b.t > 0; });
    blips.forEach(function (b) {
      b.t -= .006;
      x.fillStyle = 'rgba(255,79,163,' + b.t + ')'; x.beginPath(); x.arc(b.x, b.y, S / 100 * (1 + (1 - b.t) * 2), 0, 7); x.fill();
      x.strokeStyle = 'rgba(255,79,163,' + b.t * .7 + ')'; x.beginPath(); x.arc(b.x, b.y, S / 40 * (2 - b.t), 0, 7); x.stroke();
      x.fillStyle = 'rgba(255,185,56,' + b.t + ')'; x.font = Math.round(S / 26) + 'px VT323, monospace'; x.fillText(b.k, b.x + S / 40, b.y - S / 60);
    });
    ang += .022;
    if (!reduce && running) requestAnimationFrame(draw);
  }
  if (reduce) { for (var j = 0; j < 4; j++) blips.push({ x: S * (.3 + .12 * j), y: S * (.35 + .1 * (j % 2)), t: .9, k: labels[j] }); }
  draw();
})();
