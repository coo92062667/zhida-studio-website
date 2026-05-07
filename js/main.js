/* ═══════════════════════════════════════
   智答工作室 — Main JS v6
   ═══════════════════════════════════════ */


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
}, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
document.querySelectorAll('.fade-up,.fade-left,.fade-right,.fade-scale,.reveal').forEach(el => revObs.observe(el));


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


/* ════════════════
   NAV DROPDOWN
════════════════ */
(function () {
  const ddParent = document.querySelector('.nav-has-dropdown');
  const ddBtn    = ddParent?.querySelector('.nav-dd-btn');
  if (!ddParent || !ddBtn) return;

  ddBtn.addEventListener('click', e => {
    e.stopPropagation();
    const open = ddParent.classList.toggle('open');
    ddBtn.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', () => {
    ddParent.classList.remove('open');
    ddBtn.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      ddParent.classList.remove('open');
      ddBtn.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ════════════════
   HERO ROTATING TEXT
════════════════ */
(function () {
  const el = document.getElementById('hero-rotating');
  if (!el) return;
  const words = ['永不打烊', '自動回覆', '有溫度', '記住你'];
  let i = 0;
  setInterval(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 320);
  }, 2600);
})();


/* ════════════════
   CONTACT FORM — EmailJS
════════════════ */
(function () {
  var EMAILJS_PUBLIC_KEY  = 'wOI-I_iCN_0n7gTV1';
  var EMAILJS_SERVICE_ID  = 'service_zenbitc';
  var EMAILJS_TEMPLATE_ID = 'template_kniryza';

  var form    = document.getElementById('contact-form');
  var btn     = document.getElementById('form-submit-btn');
  var success = document.getElementById('form-success');
  var errorEl = document.getElementById('form-error');
  if (!form || !btn || !success) return;

  // 初始化 EmailJS
  if (window.emailjs) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // checkbox 勾選視覺回饋
  form.querySelectorAll('.checkbox-item').forEach(function (item) {
    item.addEventListener('change', function () {
      var cb = item.querySelector('input[type="checkbox"]');
      item.classList.toggle('is-checked', !!(cb && cb.checked));
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var submitText    = btn.querySelector('.submit-text');
    var submitLoading = btn.querySelector('.submit-loading');
    btn.disabled = true;
    if (submitText)    submitText.style.display    = 'none';
    if (submitLoading) submitLoading.style.display = 'inline';

    // 收集勾選的服務（逗號分隔）
    var checkedServices = [];
    form.querySelectorAll('input[name="services"]:checked').forEach(function (cb) {
      var span = cb.parentElement.querySelector('span');
      if (span) checkedServices.push(span.textContent.trim());
    });

    var params = {
      from_name:      form.querySelector('#cf-name').value    || '',
      from_email:     form.querySelector('#cf-email').value   || '',
      brand_name:     form.querySelector('#cf-brand').value   || '',
      message_volume: form.querySelector('#cf-volume').value  || '未填寫',
      services:       checkedServices.length ? checkedServices.join('、') : '未勾選',
      message:        form.querySelector('#cf-message').value || ''
    };

    if (!window.emailjs) {
      resetBtn(submitText, submitLoading);
      showError();
      return;
    }

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
      .then(function () {
        form.style.display = 'none';
        success.style.display = 'block';
      })
      .catch(function (err) {
        console.log('EmailJS 錯誤:', err);
        resetBtn(submitText, submitLoading);
        showError();
      });
  });

  function resetBtn(submitText, submitLoading) {
    btn.disabled = false;
    if (submitText)    submitText.style.display    = 'inline';
    if (submitLoading) submitLoading.style.display = 'none';
  }

  function showError() {
    if (errorEl) {
      form.style.display = 'none';
      errorEl.style.display = 'block';
    }
  }
})();


/* ════════════════
   COOKIE CONSENT
════════════════ */
(function () {
  if (localStorage.getItem('cookie-consent')) return;
  const overlay = document.getElementById('cookie-overlay');
  const banner  = document.getElementById('cookie-banner');
  if (!overlay || !banner) return;

  setTimeout(() => {
    overlay.classList.add('show');
    banner.classList.add('show');
  }, 1800);

  function hideBanner() {
    overlay.classList.remove('show');
    banner.classList.remove('show');
  }

  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'all');
    hideBanner();
  });

  document.getElementById('cookie-essential')?.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'essential');
    hideBanner();
  });
})();
