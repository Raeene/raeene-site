'use strict';
// raeene.0vuln.com: progress bars, print button, number-key navigation
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bars = document.querySelectorAll('.bar i[data-p]');
  const fill = () => bars.forEach(b => { b.style.width = b.dataset.p + '%'; });
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.p + '%'; io.unobserve(e.target); } }), { threshold: .4 });
    bars.forEach(b => io.observe(b));
  } else fill();
  addEventListener('beforeprint', fill);

  const pr = document.getElementById('print');
  if (pr) pr.addEventListener('click', () => { fill(); print(); });

  // 1-5 jump between pages
  const pages = ['/', '/about/', '/projects/', '/resume/', '/now/'];
  addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey || /INPUT|TEXTAREA/.test(e.target.tagName) || e.target.isContentEditable) return;
    const p = pages[+e.key - 1]; if (p && location.pathname !== p) location.href = p;
  });
})();
