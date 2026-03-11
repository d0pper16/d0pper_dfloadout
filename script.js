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
  ],
  clips: [
    {
      id: 'clip-001',
      title: 'Insane AWM Quickscope Montage',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      platform: 'youtube',
      visible: true
    },
    {
      id: 'clip-002',
      title: 'CQB Highlights — Delta Force',
      embedUrl: 'https://www.tiktok.com/embed/v2/7000000000000000000',
      platform: 'tiktok',
      visible: true
    }
  ],
  testimonials: [
    {
      id: 'test-001',
      senderName: 'Alexander',
      message: 'Best Delta Force player I\'ve ever teamed with! Insane game sense and always clutching rounds.',
      censored: false,
      visible: true
    },
    {
      id: 'test-002',
      senderName: 'Sarah',
      message: 'D0pper\'s loadout codes are top-tier. My K/D went up immediately after using the M4A1 CQB build.',
      censored: true,
      visible: true
    },
    {
      id: 'test-003',
      senderName: 'Muhammad',
      message: 'Teaming up with d0pper is always a W. Solid comms, precise aim, and great strategy every match.',
      censored: true,
      visible: true
    }
  ],
  seasonStats: [
    {
      id: 'season-001',
      seasonName: 'Season 1',
      adStats: { kpm: 2.45, spm: 185.3 },
      victoryUnite: { kpm: 3.12, spm: 220.5 },
      radarChart: { shooting: 85, survival: 70, coop: 90, objective: 65, vehicle: 40 }
    },
    {
      id: 'season-002',
      seasonName: 'Season 2',
      adStats: { kpm: 2.78, spm: 210.0 },
      victoryUnite: { kpm: 3.45, spm: 255.8 },
      radarChart: { shooting: 88, survival: 75, coop: 82, objective: 72, vehicle: 55 }
    }
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
    stats:        getData('stats')        || DEFAULT_DATA.stats,
    clips:        getData('clips')        || DEFAULT_DATA.clips,
    testimonials: getData('testimonials') || DEFAULT_DATA.testimonials,
    seasonStats:  getData('seasonStats')  || DEFAULT_DATA.seasonStats
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

/* ── RENDER CLIPS ────────────────────────────────────────── */
function renderClips(clips) {
  const grid = document.getElementById('clipsGrid');
  if (!grid) return;

  const visible = clips ? clips.filter(c => c.visible) : [];

  if (visible.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-film"></i>
        <p>No gameplay clips available yet.<br>Check back soon for highlights!</p>
      </div>`;
    return;
  }

  grid.innerHTML = visible.map(c => {
    const platformIcon = c.platform === 'tiktok' ? 'fab fa-tiktok' : 'fab fa-youtube';
    const platformLabel = c.platform === 'tiktok' ? 'TikTok' : 'YouTube';
    return `
      <div class="clip-card">
        <div class="clip-header">
          <i class="${platformIcon}"></i>
          <span class="clip-platform-label">${platformLabel}</span>
          <div class="clip-title">${escHtml(c.title)}</div>
        </div>
        <div class="clip-embed-wrapper">
          <iframe
            src="${escHtml(c.embedUrl)}"
            title="${escHtml(c.title)}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </div>`;
  }).join('');
}

/* ── CENSOR NAME ─────────────────────────────────────────── */
function censorName(name) {
  if (!name) return '';
  if (name.length <= 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

/* ── RENDER TESTIMONIALS ─────────────────────────────────── */
function renderTestimonials(testimonials) {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;

  const visible = testimonials ? testimonials.filter(t => t.visible) : [];

  if (visible.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-quote-left"></i>
        <p>No testimonials yet.</p>
      </div>`;
    return;
  }

  grid.innerHTML = visible.map(t => {
    const displayName = t.censored ? censorName(t.senderName) : t.senderName;
    return `
      <div class="testimonial-card">
        <div class="testimonial-quote-icon"><i class="fas fa-quote-left"></i></div>
        <div class="testimonial-message">${escHtml(t.message)}</div>
        <div class="testimonial-sender">
          <i class="fas fa-user-circle"></i>
          <span>${escHtml(displayName)}</span>
        </div>
      </div>`;
  }).join('');
}

/* ── DRAW RADAR CHART ────────────────────────────────────── */
function drawRadarChart(canvas, radarData) {
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  const size   = canvas.width;
  const cx     = size / 2;
  const cy     = size / 2;
  const maxR   = size * 0.38;
  const labels = ['Shooting', 'Survival', 'Co-op', 'Objective', 'Vehicle'];
  const values = [
    Number(radarData.shooting)  || 0,
    Number(radarData.survival)  || 0,
    Number(radarData.coop)      || 0,
    Number(radarData.objective) || 0,
    Number(radarData.vehicle)   || 0
  ];
  const n      = 5;
  const step   = (2 * Math.PI) / n;
  const start  = -Math.PI / 2; /* top */
  const accent = '#0ff796';

  ctx.clearRect(0, 0, size, size);

  /* Grid rings */
  [20, 40, 60, 80, 100].forEach(pct => {
    const r = maxR * (pct / 100);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const angle = start + i * step;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth   = 1;
    ctx.stroke();
  });

  /* Axis lines */
  for (let i = 0; i < n; i++) {
    const angle = start + i * step;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth   = 1;
    ctx.stroke();
  }

  /* Filled polygon */
  ctx.beginPath();
  values.forEach((val, i) => {
    const r     = maxR * Math.min(val, 100) / 100;
    const angle = start + i * step;
    const x     = cx + r * Math.cos(angle);
    const y     = cy + r * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle   = 'rgba(15,247,150,0.25)';
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth   = 2;
  ctx.stroke();

  /* Dots at each vertex */
  values.forEach((val, i) => {
    const r     = maxR * Math.min(val, 100) / 100;
    const angle = start + i * step;
    ctx.beginPath();
    ctx.arc(cx + r * Math.cos(angle), cy + r * Math.sin(angle), 3, 0, 2 * Math.PI);
    ctx.fillStyle = accent;
    ctx.fill();
  });

  /* Labels */
  const labelOffset = maxR + 20;
  ctx.fillStyle  = 'rgba(255,255,255,0.75)';
  ctx.font       = `bold ${Math.floor(size * 0.065)}px Rajdhani, sans-serif`;
  ctx.textAlign  = 'center';
  ctx.textBaseline = 'middle';
  labels.forEach((label, i) => {
    const angle = start + i * step;
    const lx = cx + labelOffset * Math.cos(angle);
    const ly = cy + labelOffset * Math.sin(angle);
    ctx.fillText(label, lx, ly);
  });
}

/* ── RENDER SEASON STATS ─────────────────────────────────── */
function renderSeasonStats(seasonStats) {
  const grid = document.getElementById('seasonStatsGrid');
  if (!grid) return;

  if (!seasonStats || seasonStats.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-chart-area"></i>
        <p>No season stats available yet.</p>
      </div>`;
    return;
  }

  grid.innerHTML = seasonStats.map(s => {
    const r = s.radarChart || {};
    const radarValues = [
      { label: 'Shooting',  value: r.shooting  || 0 },
      { label: 'Survival',  value: r.survival  || 0 },
      { label: 'Co-op',     value: r.coop      || 0 },
      { label: 'Objective', value: r.objective || 0 },
      { label: 'Vehicle',   value: r.vehicle   || 0 }
    ];
    return `
      <div class="season-card">
        <div class="season-card-title">
          <i class="fas fa-chart-area"></i>
          ${escHtml(s.seasonName)}
        </div>
        <div class="season-card-body">
          <div class="season-stats-row">
            <div class="season-stats-col">
              <div class="season-stat-group-title">A/D Stats</div>
              <div class="season-stat-line"><span>KPM</span><span>${Number(s.adStats?.kpm) || 0}</span></div>
              <div class="season-stat-line"><span>SPM</span><span>${Number(s.adStats?.spm) || 0}</span></div>
            </div>
            <div class="season-stats-col">
              <div class="season-stat-group-title">Victory Unite</div>
              <div class="season-stat-line"><span>KPM</span><span>${Number(s.victoryUnite?.kpm) || 0}</span></div>
              <div class="season-stat-line"><span>SPM</span><span>${Number(s.victoryUnite?.spm) || 0}</span></div>
            </div>
          </div>
          <div class="season-radar-wrapper">
            <canvas class="radar-canvas" data-id="${escHtml(s.id)}" width="260" height="260"></canvas>
          </div>
          <div class="season-radar-legend">
            ${radarValues.map(rv => `
              <div class="radar-legend-item">
                <span class="radar-legend-dot"></span>
                <span>${escHtml(rv.label)}</span>
                <span class="radar-legend-val">${rv.value}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }).join('');

  /* Draw radar charts after DOM is ready */
  grid.querySelectorAll('.radar-canvas').forEach(canvas => {
    const id = canvas.dataset.id;
    const s  = seasonStats.find(x => x.id === id);
    if (s && s.radarChart) drawRadarChart(canvas, s.radarChart);
  });
}

/* ── SCROLL ANIMATIONS ───────────────────────────────────── */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.loadout-card, .featured-loadout-card, .achievement-card, .setting-card, .stat-bar-item, .spec-item, .clip-card, .testimonial-card, .season-card'
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
    renderSeasonStats(data.seasonStats);
    renderAchievements(data.achievements);
    renderClips(data.clips);
    renderPcSpecs(data.pcSpecs);
    renderStats(data.stats);
    renderProfile(data.profile);
    renderTestimonials(data.testimonials);
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
  DEFAULT_DATA,
  drawRadarChart,
  censorName
};
