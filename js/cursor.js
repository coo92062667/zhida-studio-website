(function() {
  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function tick() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  })();

  // Enlarge on interactive elements
  const SEL = 'a,button,.social-btn,.pricing-btn,.btn-submit,[onclick],label,input,select,textarea';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(SEL)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(SEL)) document.body.classList.remove('cursor-hover');
  });

  // Click ripple
  document.addEventListener('click', e => {
    const r = document.createElement('div');
    r.className = 'cursor-ripple';
    r.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:44px;height:44px;`;
    document.body.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
})();
