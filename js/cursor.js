(function () {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  let visible = false;

  // Dot: instant follow
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    if (!visible) {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
      visible = true;
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
    visible = false;
  });

  // Ring: 0.1s delayed lerp
  (function tick() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  })();

  // Hover state on interactive elements
  const SEL = 'a,button,input,select,textarea,label,[role="button"],[onclick],.ptab,.faq-q,.feat-card,.proc-step';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(SEL)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(SEL)) document.body.classList.remove('cursor-hover');
  });

  // Click: ripple explode
  document.addEventListener('click', e => {
    const r = document.createElement('div');
    r.className = 'cursor-ripple';
    r.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:40px;height:40px;`;
    document.body.appendChild(r);
    r.addEventListener('animationend', () => r.remove(), { once: true });
  });
})();
