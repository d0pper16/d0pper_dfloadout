/* ============================================================
   script.js — d0pper_dfloadout | Public Site Logic
   ============================================================ */

'use strict';

/* ── DEFAULT DATA ────────────────────────────────────────── */
const DEFAULT_DATA = {
  loadouts: [
    {
      id: 'load-001',
      title: 'M4A1 CQB Build',
      code: 'DF-M4A1-CQB-4xX9-K2L8-R7M3'
    },
    {
      id: 'load-002',
      title: 'AWM Sniper Setup',
      code: 'DF-AWM-SNP-8xZ4-P1Q6-T9N2'
    },
    {
      id: 'load-003',
      title: 'CI-19 All-Rounder',
      code: 'DF-CI19-ALL-3xV7-B5W1-S4C6'
    }
  ],
  settings: {
    resolution: '1920x1080',
    dpi: '800',
    generalSens: '7.5',
    adsSens: '0.85',
    scopeSens: { '1x': '1.0', '2x': '0.9', '4x': '0.8', '6x': '0.7', '8x': '0.6' },
    fov: '95'
  },
  achievements: [
    {
      id: 'ach-001',
      title: 'First Blood',
      description: 'Got first kill in a Warfare mode match.',
      date: '2025-01-10',
      visible: true
    },
    {
      id: 'ach-002',
      title: 'Lone Wolf',
      description: 'Wiped an entire squad solo in Ranked mode.',
      date: '2025-02-18',
      visible: true
    }
  ],
  pcSpecs: {
    cpu: 'Intel Core i7-13700K',
    gpu: 'NVIDIA GeForce RTX 4070',
    ram: '32GB DDR5 6000MHz',
    monitor: '27" 1080p 165Hz',
    mouse: 'Logitech G Pro X Superlight',
    keyboard: 'Corsair K95 RGB Platinum',
    headset: 'HyperX Cloud II Wireless'
  },
  profile: {
    nickname: 'd0pper',
    playerId: 'DF-882741',
    rank: 'Elite IV',
    region: 'SEA',
    playstyle: 'Aggressive Assault',
    bio: 'Delta Force veteran focused on aggressive entry tactics and tight-quarters combat. Specializing in CQB loadouts and high-pressure engagements. Always pushing.'
  }
};

/* ── LOCAL STORAGE HELPERS ───────────────────────────────── */
function getData(key) {
  try {
    const raw = localStorage.getItem('dfloadout_' + key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function getAllData() {
  return {
    loadouts:     getData('loadouts')     || DEFAULT_DATA.loadouts,
    settings:     getData('settings')     || DEFAULT_DATA.settings,
    achievements: getData('achievements') || DEFAULT_DATA.achievements,
    pcSpecs:      getData('pcSpecs')      || DEFAULT_DATA.pcSpecs,
    profile:      getData('profile')      || DEFAULT_DATA.profile
  };
}

/* ── THEME MANAGEMENT ────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem('dfloadout_theme') || 'dark';
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('dfloadout_theme', next);
  applyTheme(next);
}

/* ── TOAST NOTIFICATION ──────────────────────────────────── */
let toastTimer = null;
function showToast(message, type = 'success') {
  const toast = document.getElementById('copyToast');
  if (!toast) return;
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  toast.className = 'toast show' + (type === 'error' ? ' error' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = 'toast'; }, 2500);
}

/* ── NAVBAR SCROLL HIGHLIGHT ─────────────────────────────── */
function initNavScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) {
        current = sec.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}

/* ── MOBILE HAMBURGER ────────────────────────────────────── */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('navLinks');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', nav.classList.contains('open'));
  });

  // Close on nav link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      nav.classList.remove('open');
    }
  });
}

/* ── RENDER HERO STATS ───────────────────────────────────── */
function renderHeroStats(data) {
  const el = document.getElementById('heroStats');
  if (!el) return;

  const visibleAch = data.achievements.filter(a => a.visible).length;
  el.innerHTML = `
    <div class="hero-stat">
      <div class="hero-stat-value">${data.loadouts.length}</div>
      <div class="hero-stat-label">Loadouts</div>
    </div>
    <div class="hero-stat">
      <div class="hero-stat-value">${visibleAch}</div>
      <div class="hero-stat-label">Achievements</div>
    </div>
    <div class="hero-stat">
      <div class="hero-stat-value">${data.profile.rank || '—'}</div>
      <div class="hero-stat-label">Rank</div>
    </div>
    <div class="hero-stat">
      <div class="hero-stat-value">${data.profile.region || '—'}</div>
      <div class="hero-stat-label">Region</div>
    </div>
  `;
}

/* ── RENDER LOADOUTS ─────────────────────────────────────── */
function renderLoadouts(loadouts) {
  const grid = document.getElementById('loadoutGrid');
  if (!grid) return;

  if (!loadouts || loadouts.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-crosshairs"></i>
        <p>No loadouts added yet.<br>Visit the admin panel to add loadout codes.</p>
      </div>`;
    return;
  }

  grid.innerHTML = loadouts.map(l => `
    <div class="loadout-card">
      <div class="loadout-card-header">
        <div class="loadout-icon"><i class="fas fa-crosshairs"></i></div>
        <div class="loadout-title">${escHtml(l.title)}</div>
      </div>
      <div class="loadout-code-label">Weapon Code</div>
      <div class="loadout-code">${escHtml(l.code)}</div>
      <button class="copy-btn" data-code="${escHtml(l.code)}">
        <i class="fas fa-copy"></i> Copy Code
      </button>
    </div>
  `).join('');

  // Attach copy handlers
  grid.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', handleCopy);
  });
}

function handleCopy(e) {
  const btn = e.currentTarget;
  const code = btn.dataset.code;
  navigator.clipboard.writeText(code).then(() => {
    btn.classList.add('copied');
    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    showToast('Code copied to clipboard!');
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = '<i class="fas fa-copy"></i> Copy Code';
    }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = code;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.classList.add('copied');
    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    showToast('Code copied to clipboard!');
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = '<i class="fas fa-copy"></i> Copy Code';
    }, 2000);
  });
}

/* ── RENDER SETTINGS ─────────────────────────────────────── */
function renderSettings(settings) {
  const dash = document.getElementById('settingsDashboard');
  if (!dash) return;

  const s = settings;
  const cards = [
    { icon: 'fas fa-desktop', label: 'Resolution', value: s.resolution || '—' },
    { icon: 'fas fa-mouse', label: 'DPI', value: s.dpi || '—' },
    { icon: 'fas fa-gamepad', label: 'General Sensitivity', value: s.generalSens || '—' },
    { icon: 'fas fa-crosshairs', label: 'ADS Sensitivity', value: s.adsSens || '—' },
    { icon: 'fas fa-eye', label: 'FOV', value: (s.fov || '—') + (s.fov ? '°' : '') },
  ];

  const scopeKeys = ['1x', '2x', '4x', '6x', '8x'];
  const scopeItems = scopeKeys.map(k => {
    const val = (s.scopeSens && s.scopeSens[k]) ? s.scopeSens[k] : '—';
    return `
      <div class="scope-item">
        <div class="scope-item-mag">${k}</div>
        <div class="scope-item-val">${escHtml(val)}</div>
      </div>`;
  }).join('');

  dash.innerHTML = cards.map(c => `
    <div class="setting-card">
      <div class="setting-icon"><i class="${c.icon}"></i></div>
      <div class="setting-info">
        <div class="setting-label">${c.label}</div>
        <div class="setting-value">${escHtml(String(c.value))}</div>
      </div>
    </div>
  `).join('') + `
    <div class="scope-sens-card">
      <div class="scope-sens-title">Scope Sensitivity</div>
      <div class="scope-sens-grid">${scopeItems}</div>
    </div>
  `;
}

/* ── RENDER ACHIEVEMENTS ─────────────────────────────────── */
function renderAchievements(achievements) {
  const grid = document.getElementById('achievementsGrid');
  if (!grid) return;

  const visible = achievements.filter(a => a.visible);

  if (visible.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-trophy"></i>
        <p>No achievements to display yet.</p>
      </div>`;
    return;
  }

  grid.innerHTML = visible.map(a => `
    <div class="achievement-card">
      <div class="achievement-badge"><i class="fas fa-medal"></i></div>
      <div class="achievement-body">
        <div class="achievement-title">${escHtml(a.title)}</div>
        <div class="achievement-desc">${escHtml(a.description)}</div>
        ${a.date ? `<div class="achievement-date"><i class="fas fa-calendar-alt"></i> ${escHtml(a.date)}</div>` : ''}
      </div>
    </div>
  `).join('');
}

/* ── RENDER PC SPECS ─────────────────────────────────────── */
function renderPcSpecs(specs) {
  const card = document.getElementById('specsCard');
  if (!card) return;

  const items = [
    { icon: 'fas fa-microchip', label: 'CPU', value: specs.cpu },
    { icon: 'fas fa-film', label: 'GPU', value: specs.gpu },
    { icon: 'fas fa-memory', label: 'RAM', value: specs.ram },
    { icon: 'fas fa-tv', label: 'Monitor', value: specs.monitor },
    { icon: 'fas fa-mouse', label: 'Mouse', value: specs.mouse },
    { icon: 'fas fa-keyboard', label: 'Keyboard', value: specs.keyboard },
    { icon: 'fas fa-headphones', label: 'Headset', value: specs.headset }
  ];

  card.innerHTML = items.map(item => `
    <div class="spec-item">
      <div class="spec-icon"><i class="${item.icon}"></i></div>
      <div class="spec-info">
        <div class="spec-label">${item.label}</div>
        <div class="spec-value">${escHtml(item.value || '—')}</div>
      </div>
    </div>
  `).join('');
}

/* ── RENDER PROFILE ──────────────────────────────────────── */
function renderProfile(profile) {
  const card = document.getElementById('profileCard');
  if (!card) return;

  const metaItems = [
    { icon: 'fas fa-id-badge', val: profile.playerId },
    { icon: 'fas fa-globe-asia', val: profile.region },
    { icon: 'fas fa-running', val: profile.playstyle }
  ].filter(m => m.val);

  card.innerHTML = `
    <div class="profile-avatar"><i class="fas fa-user-astronaut"></i></div>
    <div class="profile-nickname">${escHtml(profile.nickname || 'Unknown Player')}</div>
    ${profile.rank ? `<div class="profile-rank-badge"><i class="fas fa-star"></i> ${escHtml(profile.rank)}</div>` : ''}
    <div class="profile-meta">
      ${metaItems.map(m => `
        <span class="profile-meta-item">
          <i class="${m.icon}"></i> ${escHtml(m.val)}
        </span>
      `).join('')}
    </div>
    ${profile.bio ? `<div class="profile-bio">${escHtml(profile.bio)}</div>` : ''}
  `;
}

/* ── HTML ESCAPE ─────────────────────────────────────────── */
function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/* ── FOOTER YEAR ─────────────────────────────────────────── */
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  // Theme toggle button
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Only run public page logic if not admin page
  if (!document.getElementById('loginOverlay')) {
    const data = getAllData();
    renderHeroStats(data);
    renderLoadouts(data.loadouts);
    renderSettings(data.settings);
    renderAchievements(data.achievements);
    renderPcSpecs(data.pcSpecs);
    renderProfile(data.profile);
    initNavScroll();
    initHamburger();
    setFooterYear();
  }
});

/* ── EXPORTS (for admin.js to use) ──────────────────────── */
window.dfApp = {
  getData,
  getAllData,
  escHtml,
  DEFAULT_DATA
};
