/* =========================================================
   EcoGrid AI — animations.js
   Small, self-contained enhancement layer. Loaded after
   script.js/premium.js. Does not touch existing app logic —
   only adds: (1) pause-on-hidden-tab, (2) wind particle spawn
   for the new energy diagram. Counters and .reveal scroll-ins
   are already handled by script.js and apply automatically to
   any new [data-count] / .reveal elements, so nothing is
   duplicated here.
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Pause all CSS animations when the tab is inactive ---------- */
  const applyVisibilityState = () => {
    document.body.classList.toggle('eg-anim-paused', document.hidden);
  };
  document.addEventListener('visibilitychange', applyVisibilityState);
  applyVisibilityState();

  /* ---------- Wind particles: a few drifting dashes per wind node ---------- */
  if (!reducedMotion) {
    document.querySelectorAll('.wind-particles').forEach((wrap) => {
      const count = 3;
      for (let i = 0; i < count; i++) {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        p.setAttribute('class', 'wind-particle');
        p.setAttribute('x1', 70 + i * 6);
        p.setAttribute('y1', 18 + i * 8);
        p.setAttribute('x2', 84 + i * 6);
        p.setAttribute('y2', 18 + i * 8);
        p.setAttribute('stroke', '#1565C0');
        p.setAttribute('stroke-width', '2');
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('opacity', '0');
        wrap.appendChild(p);
      }
    });
  }

});
