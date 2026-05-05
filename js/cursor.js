/* 滑鼠光暈追蹤（無自訂游標，使用系統預設游標） */
(function () {
  const glow = document.getElementById('mouse-glow');
  if (!glow) return;

  let raf;
  document.addEventListener('mousemove', e => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
      glow.classList.add('active');
    });
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    glow.classList.remove('active');
  });
})();
