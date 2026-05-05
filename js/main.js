/* ═══════════════════════════════
   智答工作室 — Main JS v4
   ═══════════════════════════════ */

/* ── Scroll progress + navbar + back-to-top ── */
const progressBar = document.getElementById('scroll-progress');
const navbar      = document.getElementById('navbar');
const backTop     = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  const sy  = window.scrollY;
  const max = document.body.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (max > 0 ? (sy / max * 100) : 0) + '%';
  if (navbar)  navbar.classList.toggle('scrolled', sy > 60);
  if (backTop) backTop.classList.toggle('show',    sy > 400);
}, { passive: true });

if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Mobile menu ── */
function toggleMenu() {
  const hb   = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!hb || !menu) return;
  hb.classList.toggle('open');
  menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}
function closeMobile() {
  const hb   = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!hb || !menu) return;
  hb.classList.remove('open');
  menu.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Scroll reveal (Intersection Observer) ── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
document.querySelectorAll('.fade-up,.fade-left,.fade-right,.fade-scale').forEach(el => revObs.observe(el));

/* ── Counter animation ── */
function animCounter(el) {
  const target  = parseFloat(el.dataset.target);
  const hasDecimal = target % 1 !== 0;
  const dur = 2200;
  const start = performance.now();
  (function step(now) {
    const t = Math.min(1, (now - start) / dur);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = hasDecimal
      ? (target * ease).toFixed(1)
      : Math.floor(target * ease);
    if (t < 1) requestAnimationFrame(step);
  })(start);
}
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animCounter(e.target); cntObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => cntObs.observe(el));

/* ── Pricing tabs ── */
function switchPlan(plan) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.toggle('active', t.dataset.plan === plan));
  document.querySelectorAll('.pricing-panel').forEach(p => p.classList.toggle('active', p.dataset.plan === plan));
}
document.querySelectorAll('.ptab').forEach(tab => {
  tab.addEventListener('click', () => switchPlan(tab.dataset.plan));
});

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item   = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── Phone chat demo typing animation ── */
(function () {
  const msgs = [
    { type: 'user', text: '請問這款有素食版本嗎？', delay: 800 },
    { type: 'typing', delay: 1400 },
    { type: 'ai',   text: '有的！我們的原味口味完全植物性成分 🌱\n附上素食認證標章～', delay: 2200 },
    { type: 'user', text: '方便今天到貨嗎？', delay: 3400 },
    { type: 'typing', delay: 4000 },
    { type: 'ai',   text: '下午3點前下單可安排今日出貨 ✅\n要幫您保留一份嗎？', delay: 4800 },
  ];

  const container = document.querySelector('.ph-msgs');
  if (!container) return;

  msgs.forEach(({ type, text, delay }) => {
    setTimeout(() => {
      // Remove typing indicator if exists
      const existing = container.querySelector('.ph-bubble.typing');
      if (existing) existing.remove();

      if (type === 'typing') {
        const el = document.createElement('div');
        el.className = 'ph-bubble typing';
        el.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        container.appendChild(el);
      } else {
        const el = document.createElement('div');
        el.className = `ph-bubble ${type}`;
        el.textContent = text;
        el.style.animationDelay = '0s';
        container.appendChild(el);
      }
      // Auto scroll
      container.scrollTop = container.scrollHeight;
    }, delay);
  });
})();

/* ── 3D card tilt on hover ── */
document.querySelectorAll('.feat-card,.proc-step').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-8px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ── Smooth anchor scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMobile();
    const offset = 80;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});
