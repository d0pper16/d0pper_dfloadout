/* ============================================================
   script.js — GUNSMITH DELTAFORCE by D0PPER. | Public Site Logic
   ============================================================ */

'use strict';

/* ── DEFAULT DATA ────────────────────────────────────────── */
const DEFAULT_DATA = {
  loadouts: [
    { id: 'load-001', title: 'M4A1 CQB Build',    code: 'DF-M4A1-CQB-4xX9-K2L8-R7M3', category: 'Assault', featured: false },
    { id: 'load-002', title: 'AWM Sniper Setup',   code: 'DF-AWM-SNP-8xZ4-P1Q6-T9N2',  category: 'Sniper',  featured: false },
    { id: 'load-003', title: 'CI-19 All-Rounder',  code: 'DF-CI19-ALL-3xV7-B5W1-S4C6', category: 'SMG',     featured: false }
  ],
  settings: {
    resolution:  '1920x1080',
    dpi:         '800',
    generalSens: '7.5',
    adsSens:     '0.85',
    scopeSens:   { '1x': '1.0', '2x': '0.9', '4x': '0.8', '6x': '0.7', '8x': '0.6' },
    fov:         '95'
  },
  achievements: [
    {
      id: 'ach-001',
      placement: 'Juara 1',
      tournament: 'Delta Force Community Cup',
      monthYear: 'Januari 2025',
      team: 'Team Alpha',
      description: 'First place in regional community tournament.',
      photos: [],
      visible: true
    },
    {
      id: 'ach-002',
      placement: 'Top 4',
      tournament: 'SEA Regional Championship',
      monthYear: 'Februari 2025',
      team: 'Team Alpha',
      description: 'Top 4 finish in a 32-team bracket.',
      photos: [],
      visible: true
    }
  ],
  pcSpecs: {
    cpu:      'Intel Core i7-13700K',
    gpu:      'NVIDIA GeForce RTX 4070',
    ram:      '32GB DDR5 6000MHz',
    monitor:  '27" 1080p 165Hz',
    mouse:    'Logitech G Pro X Superlight',
    keyboard: 'Corsair K95 RGB Platinum',
    headset:  'HyperX Cloud II Wireless'
  },
  profile: {
    nickname:  'd0pper',
    playerId:  'DF-882741',
    rank:      'Elite IV',
    region:    'SEA',
    playstyle: 'Aggressive Assault',
    bio:       'Delta Force veteran focused on aggressive entry tactics and tight-quarters combat. Specializing in CQB loadouts and high-pressure engagements. Always pushing.'
  },
  socialLinks: {
    youtube:   '#',
    tiktok:    '#',
    sociabuzz: '#',
    whatsapp:  '#',
    email:     '#'
  },
  stats: [
    { name: 'Aim Accuracy',    value: 78 },
    { name: 'Game Sense',      value: 85 },
    { name: 'Recoil Control',  value: 82 },
    { name: 'Communication',   value: 90 },
    { name: 'Map Awareness',   value: 75 }
  ]
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
    profile:      getData('profile')      || DEFAULT_DATA.profile,
    socialLinks:  getData('socialLinks')  || DEFAULT_DATA.socialLinks,
    stats:        getData('stats')        || DEFAULT_DATA.stats
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
  const navLinks  = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
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

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });

  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !btn.contains(e.target)) nav.classList.remove('open');
  });
}

/* ── VISITOR COUNTER ─────────────────────────────────────── */
function initVisitorCounter() {
  const el = document.getElementById('viewCount');
  if (!el) return;
  let views = parseInt(localStorage.getItem('dfloadout_views') || '0', 10);
  views += 1;
  localStorage.setItem('dfloadout_views', views);
  el.textContent = views.toLocaleString();
}

/* ── RENDER SOCIAL LINKS ─────────────────────────────────── */
function renderSocialLinks(socialLinks) {
  const el = document.getElementById('socialLinks');
  if (!el) return;

  const links = [
    { key: 'youtube',   icon: 'fab fa-youtube',  label: 'YouTube'   },
    { key: 'tiktok',    icon: 'fab fa-tiktok',   label: 'TikTok'    },
    { key: 'sociabuzz', icon: 'fas fa-link',      label: 'Sociabuzz' },
    { key: 'whatsapp',  icon: 'fab fa-whatsapp',  label: 'WhatsApp'  },
    { key: 'email',     icon: 'fas fa-envelope',  label: 'Email'     }
  ];

  el.innerHTML = links.map(l => {
    const href = socialLinks[l.key] || '#';
    return `<a href="${escHtml(href)}" class="social-btn social-btn-${l.key}" title="${l.label}" target="_blank" rel="noopener noreferrer">
      <i class="${l.icon}"></i>
    </a>`;
  }).join('');
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
      <div class="hero-stat-value">${escHtml(data.profile.rank || '—')}</div>
      <div class="hero-stat-label">Rank</div>
    </div>
    <div class="hero-stat">
      <div class="hero-stat-value">${escHtml(data.profile.region || '—')}</div>
      <div class="hero-stat-label">Region</div>
    </div>
  `;
}

/* ── RENDER LOADOUTS ─────────────────────────────────────── */
function renderLoadouts(loadouts) {
  const grid       = document.getElementById('loadoutGrid');
  const filterEl   = document.getElementById('loadoutFilter');
  if (!grid) return;

  if (!loadouts || loadouts.length === 0) {
    if (filterEl) filterEl.innerHTML = '';
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-crosshairs"></i>
        <p>No loadouts added yet.<br>Visit the admin panel to add loadout codes.</p>
      </div>`;
    return;
  }

  /* Build filter bar */
  const categories = ['All', ...new Set(loadouts.map(l => l.category).filter(Boolean))];
  if (filterEl) {
    filterEl.innerHTML = categories.map(cat => `
      <button class="filter-btn${cat === 'All' ? ' active' : ''}" data-cat="${escHtml(cat)}">${escHtml(cat)}</button>
    `).join('');

    filterEl.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        grid.querySelectorAll('.loadout-card, .featured-loadout-card').forEach(card => {
          if (cat === 'All' || card.dataset.category === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* Sort: featured first */
  const featured    = loadouts.filter(l => l.featured);
  const nonFeatured = loadouts.filter(l => !l.featured);
  const sorted      = [...featured, ...nonFeatured];

  grid.innerHTML = sorted.map(l => {
    const isFeat  = l.featured;
    const catTag  = l.category ? `<span class="loadout-category-tag">${escHtml(l.category)}</span>` : '';
    const featBadge = isFeat ? `<div class="featured-badge">⭐ FEATURED</div>` : '';
    return `
      <div class="${isFeat ? 'featured-loadout-card' : 'loadout-card'}" data-category="${escHtml(l.category || '')}">
        ${featBadge}
        <div class="loadout-card-header">
          <div class="loadout-icon"><i class="fas fa-crosshairs"></i></div>
          <div class="loadout-title">${escHtml(l.title)}</div>
          ${catTag}
        </div>
        <div class="loadout-code-label">Weapon Code</div>
        <div class="loadout-code">${escHtml(l.code)}</div>
        <button class="copy-btn" data-code="${escHtml(l.code)}">
          <i class="fas fa-copy"></i> Copy Code
        </button>
      </div>`;
  }).join('');

  grid.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', handleCopy);
  });
}

function handleCopy(e) {
  const btn  = e.currentTarget;
  const code = btn.dataset.code;
  const doUpdate = () => {
    btn.classList.add('copied');
    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    showToast('Code copied to clipboard!');
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = '<i class="fas fa-copy"></i> Copy Code';
    }, 2000);
  };
  navigator.clipboard.writeText(code).then(doUpdate).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = code; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy');
    document.body.removeChild(ta); doUpdate();
  });
}

/* ── RENDER SETTINGS ─────────────────────────────────────── */
function renderSettings(settings) {
  const dash = document.getElementById('settingsDashboard');
  if (!dash) return;

  const s = settings;
  const cards = [
    { icon: 'fas fa-desktop',   label: 'Resolution',          value: s.resolution  || '—' },
    { icon: 'fas fa-mouse',     label: 'DPI',                 value: s.dpi         || '—' },
    { icon: 'fas fa-gamepad',   label: 'General Sensitivity', value: s.generalSens || '—' },
    { icon: 'fas fa-crosshairs',label: 'ADS Sensitivity',     value: s.adsSens     || '—' },
    { icon: 'fas fa-eye',       label: 'FOV',                 value: (s.fov || '—') + (s.fov ? '°' : '') }
  ];

  const scopeKeys  = ['1x','2x','4x','6x','8x'];
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

  grid.innerHTML = visible.map(a => {
    const photosHtml = (a.photos && a.photos.length > 0)
      ? `<div class="photo-thumb-row">${a.photos.map(src =>
          `<img class="photo-thumb" src="${escHtml(src)}" alt="Achievement photo" loading="lazy" />`
        ).join('')}</div>`
      : '';

    return `
      <div class="achievement-card">
        <div class="achievement-placement">
          <i class="fas fa-trophy"></i> ${escHtml(a.placement || '—')}
        </div>
        <div class="achievement-body">
          <div class="achievement-tournament">${escHtml(a.tournament || '')}</div>
          ${a.monthYear ? `<div class="achievement-date"><i class="fas fa-calendar-alt"></i> ${escHtml(a.monthYear)}</div>` : ''}
          ${a.team      ? `<div class="achievement-team"><i class="fas fa-users"></i> ${escHtml(a.team)}</div>` : ''}
          ${a.description ? `<div class="achievement-desc">${escHtml(a.description)}</div>` : ''}
          ${photosHtml}
        </div>
      </div>`;
  }).join('');

  /* Photo lightbox triggers */
  grid.querySelectorAll('.photo-thumb').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLightbox(img.src));
  });
}

/* ── LIGHTBOX ────────────────────────────────────────────── */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const overlay  = document.getElementById('lightboxOverlay');
  const closeBtn = document.getElementById('lightboxClose');
  if (!lightbox) return;

  function closeLightbox() {
    lightbox.classList.remove('active');
  }
  if (overlay)  overlay.addEventListener('click', closeLightbox);
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const img      = document.getElementById('lightboxImg');
  if (!lightbox || !img) return;
  img.src = src;
  lightbox.classList.add('active');
}

/* ── RENDER PC SPECS ─────────────────────────────────────── */
function renderPcSpecs(specs) {
  const card = document.getElementById('specsCard');
  if (!card) return;

  const items = [
    { icon: 'fas fa-microchip', label: 'CPU',      value: specs.cpu      },
    { icon: 'fas fa-film',      label: 'GPU',      value: specs.gpu      },
    { icon: 'fas fa-memory',    label: 'RAM',      value: specs.ram      },
    { icon: 'fas fa-tv',        label: 'Monitor',  value: specs.monitor  },
    { icon: 'fas fa-mouse',     label: 'Mouse',    value: specs.mouse    },
    { icon: 'fas fa-keyboard',  label: 'Keyboard', value: specs.keyboard },
    { icon: 'fas fa-headphones',label: 'Headset',  value: specs.headset  }
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

/* ── RENDER STATS ────────────────────────────────────────── */
function renderStats(stats) {
  const el = document.getElementById('statsBars');
  if (!el) return;

  if (!stats || stats.length === 0) {
    el.innerHTML = `<div class="empty-state"><i class="fas fa-chart-bar"></i><p>No stats configured yet.</p></div>`;
    return;
  }

  el.innerHTML = stats.map(s => `
    <div class="stat-bar-item">
      <div class="stat-bar-label">
        <span>${escHtml(s.name)}</span>
        <span>${Number(s.value) || 0}%</span>
      </div>
      <div class="stat-bar-track">
        <div class="stat-bar-fill" data-value="${Number(s.value) || 0}" style="width:0%"></div>
      </div>
    </div>
  `).join('');

  /* Intersection Observer to animate fills */
  const fills = el.querySelectorAll('.stat-bar-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.value + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.1 });

  fills.forEach(fill => observer.observe(fill));
}

/* ── RENDER PROFILE ──────────────────────────────────────── */
function renderProfile(profile) {
  const card = document.getElementById('profileCard');
  if (!card) return;

  const metaItems = [
    { icon: 'fas fa-id-badge',    val: profile.playerId  },
    { icon: 'fas fa-globe-asia',  val: profile.region    },
    { icon: 'fas fa-running',     val: profile.playstyle }
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

/* ── SCROLL ANIMATIONS ───────────────────────────────────── */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.loadout-card, .featured-loadout-card, .achievement-card, .setting-card, .stat-bar-item, .spec-item'
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach((el, i) => {
    el.style.animationDelay = (i % 8) * 0.07 + 's';
    observer.observe(el);
  });
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

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  if (!document.getElementById('loginOverlay')) {
    const data = getAllData();
    renderHeroStats(data);
    initVisitorCounter();
    renderSocialLinks(data.socialLinks);
    renderLoadouts(data.loadouts);
    renderSettings(data.settings);
    renderAchievements(data.achievements);
    renderPcSpecs(data.pcSpecs);
    renderStats(data.stats);
    renderProfile(data.profile);
    initLightbox();
    initNavScroll();
    initHamburger();
    setFooterYear();
    initScrollAnimations();
  }
});

/* ── EXPORTS (for admin.js to use) ──────────────────────── */
window.dfApp = {
  getData,
  getAllData,
  escHtml,
  DEFAULT_DATA
};
