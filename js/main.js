/* ═══════════════════════════════════════
   智答工作室 — Main JS v5
   ═══════════════════════════════════════ */

/* ════════════════
   SPLASH SCREEN
   只有第一次訪問才顯示
════════════════ */
(function () {
  const splash = document.getElementById('splash');
  if (!splash) return;

  const shown = sessionStorage.getItem('splash_shown');
  if (shown) { splash.style.display = 'none'; return; }

  /* Typewriter for English subtitle */
  const enEl = document.getElementById('splash-en');
  if (enEl) {
    const TEXT = 'ZHIDA STUDIO';
    const cursor = document.createElement('span');
    cursor.className = 'splash-tw-cursor';
    enEl.appendChild(cursor);
    let i = 0;
    setTimeout(() => {
      const iv = setInterval(() => {
        if (i < TEXT.length) { cursor.before(TEXT[i++]); }
        else clearInterval(iv);
      }, 70);
    }, 700);
  }

  /* Canvas particle scatter */
  const canvas = document.getElementById('splash-canvas');
  if (canvas) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const cx  = canvas.width  / 2;
    const cy  = canvas.height / 2;

    const particles = Array.from({ length: 80 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1.5;
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r:  Math.random() * 3 + 1,
        life: 1,
        decay: Math.random() * .014 + .007,
        color: Math.random() > .5 ? [255,107,53] : [0,212,170]
      };
    });

    let active = false;
    setTimeout(() => { active = true; }, 400);

    (function draw() {
      if (!document.getElementById('splash') || splash.style.display === 'none') return;
      if (splash.classList.contains('hidden')) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (active) {
        particles.forEach(p => {
          if (p.life <= 0) return;
          const [r,g,b] = p.color;
          const g2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
          g2.addColorStop(0, `rgba(${r},${g},${b},${p.life})`);
          g2.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = g2; ctx.fill();
          p.x += p.vx; p.y += p.vy;
          p.vx *= .975; p.vy *= .975;
          p.life -= p.decay;
        });
      }
      requestAnimationFrame(draw);
    })();
  }

  /* Dismiss after 2.8s */
  setTimeout(() => {
    splash.classList.add('hidden');
    sessionStorage.setItem('splash_shown', '1');
  }, 2800);
})();


/* ════════════════
   DARK / LIGHT MODE
════════════════ */
(function () {
  const btn = document.getElementById('theme-toggle');
  const html = document.documentElement;
  let theme = localStorage.getItem('theme') || 'light';

  function applyTheme(t) {
    html.classList.add('theme-transitioning');
    html.setAttribute('data-theme', t);
    if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', t);
    setTimeout(() => html.classList.remove('theme-transitioning'), 400);
  }

  applyTheme(theme);

  if (btn) {
    btn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
    });
  }
})();


/* ════════════════
   SCROLL: progress + navbar + back-to-top
════════════════ */
const progressBar = document.getElementById('scroll-progress');
const navbar      = document.getElementById('navbar');
const backTop     = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  const sy  = window.scrollY;
  const max = document.body.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (max > 0 ? sy / max * 100 : 0) + '%';
  if (navbar)  navbar.classList.toggle('scrolled', sy > 60);
  if (backTop) backTop.classList.toggle('show',    sy > 400);
}, { passive: true });

if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ════════════════
   MOBILE MENU
════════════════ */
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


/* ════════════════
   SCROLL REVEAL
════════════════ */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });
document.querySelectorAll('.fade-up,.fade-left,.fade-right,.fade-scale').forEach(el => revObs.observe(el));


/* ════════════════
   COUNTER ANIMATION
════════════════ */
function animCounter(el) {
  const target     = parseFloat(el.dataset.target);
  const hasDecimal = target % 1 !== 0;
  const dur = 2200, start = performance.now();
  (function step(now) {
    const t    = Math.min(1, (now - start) / dur);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = hasDecimal ? (target * ease).toFixed(1) : Math.floor(target * ease);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = hasDecimal ? target.toFixed(1) : target;
  })(start);
}
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animCounter(e.target); cntObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => cntObs.observe(el));


/* ════════════════
   PRICING TABS
════════════════ */
function switchPlan(plan) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.toggle('active', t.dataset.plan === plan));
  document.querySelectorAll('.pricing-panel').forEach(p => p.classList.toggle('active', p.dataset.plan === plan));
}
document.querySelectorAll('.ptab').forEach(tab => {
  tab.addEventListener('click', () => switchPlan(tab.dataset.plan));
});


/* ════════════════
   FAQ ACCORDION
════════════════ */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item   = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});


/* ════════════════
   PHONE CHAT DEMO (sequential bubble animation)
════════════════ */
(function () {
  const container = document.querySelector('.ph-msgs');
  if (!container) return;

  const msgs = [
    { type: 'user', text: '請問這款有素食版本嗎？', delay: 1000 },
    { type: 'typing', delay: 1700 },
    { type: 'ai',   text: '有的！原味完全植物性 🌱\n附素食認證標章～', delay: 2600 },
    { type: 'user', text: '今天方便到貨嗎？', delay: 3800 },
    { type: 'typing', delay: 4500 },
    { type: 'ai',   text: '下午3點前下單可今日出貨 ✅\n要幫您保留一份嗎？', delay: 5400 },
  ];

  container.innerHTML = '';

  msgs.forEach(({ type, text, delay }) => {
    setTimeout(() => {
      const existing = container.querySelector('.ph-bubble.typing');
      if (existing) existing.remove();

      const el = document.createElement('div');
      if (type === 'typing') {
        el.className = 'ph-bubble typing';
        el.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
      } else {
        el.className = `ph-bubble ${type}`;
        el.textContent = text;
      }
      container.appendChild(el);
      container.scrollTop = container.scrollHeight;
    }, delay);
  });
})();


/* ════════════════
   3D CARD TILT (hover)
════════════════ */
document.querySelectorAll('.feat-card,.proc-step').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-9px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});


/* ════════════════
   MAGNETIC BUTTONS
════════════════ */
document.querySelectorAll('.btn-primary,.btn-ghost,.btn-mint,.nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.28;
    const y = (e.clientY - r.top  - r.height / 2) * 0.28;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});


/* ════════════════
   SMOOTH ANCHOR SCROLL
════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMobile();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 80,
      behavior: 'smooth'
    });
  });
});
