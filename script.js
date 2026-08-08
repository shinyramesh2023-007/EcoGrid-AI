/* =========================================================
   EcoGrid AI — script.js (vanilla JS, no frameworks)
   ========================================================= */

/* ---------- Preloader (runs immediately, before DOMContentLoaded) ---------- */
(() => {
  const pre = document.createElement('div');
  pre.id = 'preloader';
  pre.innerHTML = `
    <svg class="pre-mark" width="34" height="34" viewBox="0 0 30 30"><path d="M15 2 L4 16 L14 16 L12 28 L26 12 L16 12 Z" fill="currentColor"/></svg>
    <div class="pre-bar"></div>
    <div class="pre-text">LOADING ECOGRID AI…</div>`;
  document.documentElement.appendChild(pre);
  window.addEventListener('load', () => {
    setTimeout(() => {
      pre.classList.add('hide');
      setTimeout(() => pre.remove(), 600);
    }, 250);
  });
})();

/* ---------- Dark mode: apply saved theme immediately (avoids flash) ---------- */
(() => {
  const saved = localStorage.getItem('ecogrid-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Dark mode toggle button ---------- */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ecogrid-theme', next);
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------- Toast notifications ---------- */
  window.showToast = function (message, type = 'success') {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    stack.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3800);
  };

  /* ---------- Password show/hide toggle (login & register) ---------- */
  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (!input) return;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.innerHTML = isPass ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
    });
  });

  /* ---------- Password strength meter (register page) ---------- */
  const regPassword = document.getElementById('regPassword');
  if (regPassword) {
    const bar = document.getElementById('pwStrengthBar');
    const label = document.getElementById('pwStrengthLabel');
    regPassword.addEventListener('input', () => {
      const v = regPassword.value;
      let score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v)) score++;
      if (/[0-9]/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      const levels = [
        { pct: 0, color: '#ff5f57', text: 'Enter a password' },
        { pct: 25, color: '#ff5f57', text: 'Weak' },
        { pct: 50, color: '#FFC107', text: 'Fair' },
        { pct: 75, color: '#1565C0', text: 'Good' },
        { pct: 100, color: '#00C853', text: 'Strong' }
      ];
      const lvl = levels[v.length === 0 ? 0 : score];
      if (bar) { bar.style.width = lvl.pct + '%'; bar.style.background = lvl.color; }
      if (label) label.textContent = lvl.text;
    });
  }

  /* ---------- Login form (client-side, posts to Flask) ---------- */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      const email = document.getElementById('loginEmail');
      const password = document.getElementById('loginPassword');
      let ok = true;
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { ok = false; email.classList.add('invalid'); }
      else if (email) email.classList.remove('invalid');
      if (password && password.value.length < 1) { ok = false; password.classList.add('invalid'); }
      if (!ok) { e.preventDefault(); showToast('Please enter a valid email and password.', 'error'); }
    });
  }

  /* ---------- Register form (client-side, posts to Flask) ---------- */
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      const pw = document.getElementById('regPassword');
      const cpw = document.getElementById('regConfirmPassword');
      const terms = document.getElementById('regTerms');
      let ok = true;
      if (pw && pw.value.length < 8) { ok = false; pw.classList.add('invalid'); showToast('Password must be at least 8 characters.', 'error'); }
      if (cpw && pw && cpw.value !== pw.value) { ok = false; cpw.classList.add('invalid'); showToast('Passwords do not match.', 'error'); }
      if (terms && !terms.checked) { ok = false; showToast('Please accept the Terms of Service.', 'error'); }
      if (!ok) e.preventDefault();
    });
  }

  /* Active nav highlighting is rendered server-side via `active_page`
     in base.html (Jinja), so no client-side override is needed here —
     a previous JS-based pass used to strip that class on every load. */

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Sticky nav shadow + back-to-top ---------- */
  const nav = document.getElementById('siteNav');
  const backTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    if (backTop) backTop.classList.toggle('show', window.scrollY > 500);
  });
  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      const duration = 1300;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------- Contact form: client-side validation + demo submit ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    const alertBox = document.getElementById('formAlert');
    const rules = {
      name: v => v.trim().length >= 2 || 'Please enter your full name.',
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
      phone: v => v.trim() === '' || /^[+\d][\d\s-]{7,15}$/.test(v.trim()) || 'Enter a valid phone number.',
      message: v => v.trim().length >= 10 || 'Message should be at least 10 characters.'
    };

    function validateField(field) {
      const rule = rules[field.id];
      if (!rule) return true;
      const result = rule(field.value);
      const errorEl = document.getElementById(field.id + 'Error');
      if (result === true) {
        field.classList.remove('invalid');
        if (errorEl) errorEl.classList.remove('show');
        return true;
      }
      field.classList.add('invalid');
      if (errorEl) { errorEl.textContent = result; errorEl.classList.add('show'); }
      return false;
    }

    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => { if (field.classList.contains('invalid')) validateField(field); });
    });

    form.addEventListener('submit', (e) => {
      const fields = form.querySelectorAll('#name, #email, #phone, #message');
      let allValid = true;
      fields.forEach(f => { if (!validateField(f)) allValid = false; });

      if (!allValid) {
        e.preventDefault();
        if (alertBox) {
          alertBox.textContent = 'Please fix the highlighted fields before sending.';
          alertBox.className = 'form-alert error show';
        }
        return;
      }

      // Valid — let the form submit for real to Flask (saves to the
      // ContactMessage table and redirects back with a flash message).
      const btn = form.querySelector('button[type="submit"]');
      btn.innerHTML = 'Sending… <i class="fa-solid fa-circle-notch fa-spin"></i>';
      btn.disabled = true;
    });
  }

  /* ---------- Newsletter form (demo only) ---------- */
  const newsletter = document.getElementById('newsletterForm');
  if (newsletter) {
    newsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletter.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Subscribed';
      setTimeout(() => { btn.textContent = original; newsletter.reset(); }, 2000);
    });
  }

  /* Dashboard charts now live in static/js/dashboard-charts.js
     (only loaded on dashboard.html, driven by DB-backed data). */

});
