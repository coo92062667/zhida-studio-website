/* ══ PAGE LOADER ══ */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('page-loader').classList.add('hidden'), 500);
});

/* ══ FULL-PAGE PARTICLE SYSTEM ══ */
(function() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  const mobile = window.matchMedia('(max-width:680px)').matches;
  const NUM    = mobile ? 28 : 72;
  const DIST   = mobile ? 90 : 145;
  const ATTRACT_R = 160;
  let W, H, mouse = { x:-9999, y:-9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, {passive:true});
  resize();

  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, {passive:true});
  document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  const pts = Array.from({length: NUM}, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r:  Math.random() * 1.6 + 1.1
  }));

  function frame() {
    ctx.clearRect(0, 0, W, H);

    // Connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,107,53,${(1 - d/DIST) * 0.32})`;
          ctx.lineWidth = 0.65;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    // Dots + mouse attraction
    pts.forEach(p => {
      // Draw glow
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      g.addColorStop(0, 'rgba(255,120,60,0.55)');
      g.addColorStop(1, 'rgba(255,107,53,0)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI*2);
      ctx.fillStyle = g;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,150,90,0.85)';
      ctx.fill();

      // Mouse attraction
      const mdx = mouse.x - p.x;
      const mdy = mouse.y - p.y;
      const md  = Math.sqrt(mdx*mdx + mdy*mdy);
      if (md < ATTRACT_R && md > 0) {
        const force = (1 - md / ATTRACT_R) * 0.55;
        p.vx += (mdx / md) * force;
        p.vy += (mdy / md) * force;
      }

      // Speed cap + friction
      const sp = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
      if (sp > 2.2) { p.vx = p.vx/sp*2.2; p.vy = p.vy/sp*2.2; }
      p.vx *= 0.978; p.vy *= 0.978;

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
      if (p.x > W) { p.x = W; p.vx = -Math.abs(p.vx); }
      if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
      if (p.y > H) { p.y = H; p.vy = -Math.abs(p.vy); }
    });

    requestAnimationFrame(frame);
  }
  frame();
})();

/* ══ SCROLL ══ */
const progressBar  = document.getElementById('scroll-progress');
const navbar       = document.getElementById('navbar');
const backTop      = document.getElementById('back-top');
const heroBlob1    = document.querySelector('.blob-1');
const heroBlob2    = document.querySelector('.blob-2');
const heroContent  = document.querySelector('.hero-content');
const heroDots     = document.querySelector('.hero-dots');

const floatCta  = document.getElementById('float-cta');
const contactEl = document.getElementById('contact');

window.addEventListener('scroll', () => {
  const sy    = window.scrollY;
  const max   = document.body.scrollHeight - window.innerHeight;
  const pct   = max > 0 ? sy / max : 0;
  progressBar.style.width = (pct * 100) + '%';
  navbar.classList.toggle('scrolled', sy > 60);
  backTop.classList.toggle('show',    sy > 300);

  // Float CTA: show after 50% scroll, hide near contact section
  if (floatCta) {
    const nearContact = contactEl
      ? contactEl.getBoundingClientRect().top < window.innerHeight * 0.8
      : false;
    floatCta.classList.toggle('show', pct > 0.5 && !nearContact);
  }

  if (sy < window.innerHeight * 1.3) {
    if (heroBlob1)   heroBlob1.style.transform   = `translate(${sy*0.04}px,${sy*0.14}px)`;
    if (heroBlob2)   heroBlob2.style.transform   = `translate(${-sy*0.03}px,${sy*0.09}px)`;
    if (heroContent) heroContent.style.transform = `translateY(${sy*0.065}px)`;
    if (heroDots)    heroDots.style.transform    = `translateY(${sy*0.18}px)`;
  }
}, {passive:true});

/* ══ DARK MODE ══ */
let theme = 'dark';
document.getElementById('theme-toggle').addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('theme-toggle').textContent = theme === 'dark' ? '🌙' : '☀️';
});

/* ══ MOBILE MENU ══ */
function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobile-menu').classList.toggle('open');
  document.body.style.overflow = document.getElementById('mobile-menu').classList.contains('open') ? 'hidden' : '';
}
function closeMobile() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobile-menu').classList.remove('open');
  document.body.style.overflow = '';
}

/* ══ TYPEWRITER ══ */
(function() {
  const el    = document.getElementById('tw-text');
  const words = ['人情味', '溫度感', '品牌靈魂'];
  let wi = 0, ci = 0, del = false;
  function tick() {
    const w = words[wi];
    el.textContent = del ? w.slice(0, ci--) : w.slice(0, ci++);
    let d = del ? 75 : 125;
    if (!del && ci > w.length) { d = 2000; del = true; }
    if (del && ci < 0) { del = false; wi = (wi+1) % words.length; ci = 0; d = 450; }
    setTimeout(tick, d);
  }
  setTimeout(tick, 1200);
})();

/* ══ SCROLL REVEAL ══ */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); revObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin:'0px 0px -44px 0px' });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el => revObs.observe(el));

/* ══ NUMBER COUNTER (cubic ease-out) ══ */
function animCounter(el) {
  const target = parseFloat(el.dataset.target);
  const dec    = target % 1 !== 0;
  const start  = performance.now();
  const dur    = 2400;
  (function step(now) {
    const t = Math.min(1, (now - start) / dur);
    const e = 1 - Math.pow(1 - t, 3);
    el.textContent = dec ? (target * e).toFixed(1) : Math.floor(target * e);
    if (t < 1) requestAnimationFrame(step);
  })(start);
}
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animCounter(e.target); cntObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => cntObs.observe(el));

/* ══ 3D CARD TILT ══ */
document.querySelectorAll('.feature-card,.pain-card,.testimonial-card,.pricing-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x*9}deg) rotateX(${-y*9}deg) translateY(-9px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ══ MAGNETIC BUTTONS ══ */
document.querySelectorAll('.mag-wrap').forEach(wrap => {
  const btn = wrap.querySelector('a,button');
  if (!btn) return;
  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2)  * 0.28;
    const y = (e.clientY - r.top  - r.height/2) * 0.28;
    btn.style.transform = `translate(${x}px,${y}px)`;
  });
  wrap.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ══ CONTACT FORM ══ */
function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  btn.style.opacity = '0.65'; btn.style.pointerEvents = 'none';
  document.getElementById('btn-text').textContent = '傳送中...';
  document.getElementById('btn-arrow').style.display = 'none';
  setTimeout(() => {
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('form-success').classList.add('show');
  }, 1500);
}

/* ══ FAQ ACCORDION ══ */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item   = q.parentElement;
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    // Open clicked (unless it was already open)
    if (!isOpen) item.classList.add('open');
  });
});
