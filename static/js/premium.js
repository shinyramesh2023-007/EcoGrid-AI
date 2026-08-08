/* =========================================================
   EcoGrid AI — premium.js
   Cursor glow · magnetic buttons · ripple · 3D tilt ·
   card mouse-lighting · command palette (Ctrl+K) ·
   notification center · particle field
   Loaded after script.js on every page (vanilla JS only).
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Cursor glow ---------- */
  if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
    const glow = document.createElement('div');
    glow.id = 'cursorGlow';
    document.body.appendChild(glow);
    let raf = null, tx = 0, ty = 0;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add('active');
      if (!raf) raf = requestAnimationFrame(() => {
        glow.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`;
        raf = null;
      });
    }, { passive: true });
    document.addEventListener('mouseleave', () => glow.classList.remove('active'));
  }

  /* ---------- Card mouse-lighting (sets --mx/--my for the glow sheen) ---------- */
  document.querySelectorAll('.glass, .feature-card, .highlight-card, .testi-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  /* ---------- 3D tilt on floating hero cards + feature cards ---------- */
  if (!reducedMotion) {
    document.querySelectorAll('.float-card, .feature-card, .highlight-card').forEach(el => {
      el.classList.add('tilt');
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(700px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg) translateZ(0)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.btn-primary, .btn-outline, .fab').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const mx = (e.clientX - r.left - r.width / 2) * 0.25;
        const my = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = `translate(${mx}px, ${my}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- Ripple click effect ---------- */
  document.querySelectorAll('.btn, .nav-toggle, .theme-toggle, .notif-btn, .faq-q').forEach(el => {
    el.addEventListener('click', function (e) {
      const r = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(r.width, r.height);
      circle.className = 'ripple';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - r.left - size / 2) + 'px';
      circle.style.top = (e.clientY - r.top - size / 2) + 'px';
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  /* ---------- Particle field (subtle, hero sections only) ---------- */
  if (!reducedMotion) {
    document.querySelectorAll('.hero .mesh-bg, .page-header .mesh-bg').forEach(mesh => {
      mesh.classList.add('aurora');
      const field = document.createElement('div');
      field.className = 'particle-field';
      const count = window.innerWidth < 768 ? 8 : 16;
      for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        p.style.left = Math.random() * 100 + '%';
        p.style.bottom = (Math.random() * 20) + '%';
        p.style.animationDuration = (8 + Math.random() * 10) + 's';
        p.style.animationDelay = (Math.random() * 8) + 's';
        field.appendChild(p);
      }
      mesh.appendChild(field);
    });
  }

  /* ---------- Command palette (Ctrl+K / Cmd+K) ---------- */
  const routes = (window.ECOGRID_ROUTES) || [];
  if (routes.length) {
    const backdrop = document.createElement('div');
    backdrop.className = 'cmdk-backdrop';
    backdrop.innerHTML = `
      <div class="cmdk-box">
        <div class="cmdk-input-row">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search pages, actions…" id="cmdkInput" aria-label="Command palette search">
          <kbd>ESC</kbd>
        </div>
        <div class="cmdk-list" id="cmdkList"></div>
      </div>`;
    document.body.appendChild(backdrop);
    const input = backdrop.querySelector('#cmdkInput');
    const list = backdrop.querySelector('#cmdkList');
    let activeIdx = 0, filtered = routes;

    function renderList() {
      list.innerHTML = '';
      if (!filtered.length) {
        list.innerHTML = '<div class="cmdk-empty">No matching pages.</div>';
        return;
      }
      filtered.forEach((r, i) => {
        const row = document.createElement('div');
        row.className = 'cmdk-item' + (i === activeIdx ? ' active' : '');
        row.innerHTML = `<i class="fa-solid ${r.icon}"></i> ${r.label} <small>${r.hint || ''}</small>`;
        row.addEventListener('click', () => { window.location.href = r.url; });
        list.appendChild(row);
      });
    }
    function openPalette() {
      backdrop.classList.add('open');
      input.value = '';
      filtered = routes;
      activeIdx = 0;
      renderList();
      setTimeout(() => input.focus(), 50);
    }
    function closePalette() { backdrop.classList.remove('open'); }

    input.addEventListener('input', () => {
      const q = input.value.toLowerCase();
      filtered = routes.filter(r => r.label.toLowerCase().includes(q));
      activeIdx = 0;
      renderList();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, filtered.length - 1); renderList(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); renderList(); }
      if (e.key === 'Enter' && filtered[activeIdx]) { window.location.href = filtered[activeIdx].url; }
      if (e.key === 'Escape') { closePalette(); }
    });
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closePalette(); });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        backdrop.classList.contains('open') ? closePalette() : openPalette();
      }
    });
    document.querySelectorAll('.cmdk-trigger').forEach(t => t.addEventListener('click', openPalette));
  }

  /* ---------- Notification bell ---------- */
  const notifBtn = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notifPanel');
  if (notifBtn && notifPanel) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifPanel.classList.toggle('open');
      const dot = notifBtn.querySelector('.notif-dot');
      if (dot) dot.remove();
    });
    document.addEventListener('click', (e) => {
      if (!notifPanel.contains(e.target) && e.target !== notifBtn) notifPanel.classList.remove('open');
    });
  }

  /* ---------- Live clock (wherever #liveClock exists) ---------- */
  const clockEl = document.getElementById('liveClock');
  if (clockEl) {
    const tick = () => {
      clockEl.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Live-ish jitter for dashboard KPI numbers (cosmetic only) ---------- */
  document.querySelectorAll('[data-live-jitter]').forEach(el => {
    const base = parseFloat(el.dataset.liveJitter);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimal || '1', 10);
    if (isNaN(base) || reducedMotion) return;
    setInterval(() => {
      const jitter = base + (Math.random() - 0.5) * (base * 0.03);
      el.textContent = jitter.toFixed(decimals) + suffix;
    }, 2600);
  });

});
