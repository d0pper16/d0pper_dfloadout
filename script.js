/* ============================================================
   script.js — D0PPER. | Public Site Logic
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
  clips: [],
  testimonials: [],
  seasonStats: [
    {
      id: 'season-001',
      season: 'Season 1',
      ad: { kpm: 2.1, spm: 155 },
      victoryUnite: { kpm: 2.8, spm: 190 },
      radar: { shooting: 75, survival: 65, coop: 55, objective: 70, vehicle: 40 }
    },
    {
      id: 'season-002',
      season: 'Season 2',
      ad: { kpm: 2.8, spm: 180 },
      victoryUnite: { kpm: 3.5, spm: 240 },
      radar: { shooting: 85, survival: 72, coop: 68, objective: 78, vehicle: 50 }
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
  let viewsData;
  try {
    viewsData = JSON.parse(localStorage.getItem('dfloadout_views') || 'null');
  } catch(e) { viewsData = null; }
  if (!viewsData || typeof viewsData !== 'object') {
    const oldVal = parseInt(localStorage.getItem('dfloadout_views') || '0', 10);
    viewsData = { baseCount: 0, realVisits: isNaN(oldVal) ? 0 : oldVal };
  }
  viewsData.realVisits = (viewsData.realVisits || 0) + 1;
  localStorage.setItem('dfloadout_views', JSON.stringify(viewsData));
  const total = (viewsData.baseCount || 0) + viewsData.realVisits;
  el.textContent = total.toLocaleString();
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
  const grid        = document.getElementById('loadoutGrid');
  const filterEl    = document.getElementById('loadoutFilter');
  const favSection  = document.getElementById('favoriteSection');
  const favGrid     = document.getElementById('favoriteGrid');
  if (!grid) return;

  if (!loadouts || loadouts.length === 0) {
    if (filterEl) filterEl.innerHTML = '';
    if (favSection) favSection.style.display = 'none';
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
        grid.querySelectorAll('.loadout-card').forEach(card => {
          card.style.display = (cat === 'All' || card.dataset.category === cat) ? '' : 'none';
        });
        if (favGrid) {
          favGrid.querySelectorAll('.favorite-loadout-card').forEach(card => {
            card.style.display = (cat === 'All' || card.dataset.category === cat) ? '' : 'none';
          });
        }
      });
    });
  }

  /* Render favorites */
  const favorites    = loadouts.filter(l => l.featured);
  const nonFavorites = loadouts.filter(l => !l.featured);

  if (favSection) {
    if (favorites.length > 0) {
      favSection.style.display = 'block';
      favGrid.innerHTML = favorites.map(l => {
        const catTag = l.category ? `<span class="loadout-category-tag">${escHtml(l.category)}</span>` : '';
        return `
          <div class="favorite-loadout-card" data-category="${escHtml(l.category || '')}">
            <div class="favorite-badge">⭐ FAVORITE</div>
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
      favGrid.querySelectorAll('.copy-btn').forEach(btn => btn.addEventListener('click', handleCopy));
    } else {
      favSection.style.display = 'none';
    }
  }

  /* Render non-favorites */
  grid.innerHTML = nonFavorites.map(l => {
    const catTag = l.category ? `<span class="loadout-category-tag">${escHtml(l.category)}</span>` : '';
    return `
      <div class="loadout-card" data-category="${escHtml(l.category || '')}">
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

  grid.querySelectorAll('.copy-btn').forEach(btn => btn.addEventListener('click', handleCopy));
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
function convertToEmbedUrl(url) {
  if (!url) return '';
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  if (url.includes('youtube.com/embed/') || url.includes('tiktok.com/embed')) return url;
  return url;
}

function renderClips(clips) {
  const grid = document.getElementById('clipsGrid');
  if (!grid) return;
  const visible = clips.filter(c => c.visible);
  if (visible.length === 0) {
    grid.innerHTML = '<div class="empty-state"><i class="fas fa-video"></i><p>No clips added yet.</p></div>';
    return;
  }
  grid.innerHTML = visible.map(c => {
    const embedUrl = convertToEmbedUrl(c.videoUrl);
    const desc = c.description ? `<p class="clip-desc">${escHtml(c.description)}</p>` : '';
    return `
      <div class="clip-card">
        <div class="clip-title">${escHtml(c.title)}</div>
        <div class="clip-embed">
          <iframe src="${escHtml(embedUrl)}" frameborder="0" allowfullscreen loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
          </iframe>
        </div>
        ${desc}
      </div>`;
  }).join('');
}

/* ── RENDER TESTIMONIALS ─────────────────────────────────── */
function censorName(name) {
  if (!name) return 'Anonymous';
  return name.split(' ').map(word => {
    if (word.length <= 2) return word;
    return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
  }).join(' ');
}

function renderTestimonials(testimonials) {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;
  const visible = testimonials.filter(t => t.visible);
  if (visible.length === 0) {
    grid.innerHTML = '<div class="empty-state"><i class="fas fa-comment"></i><p>No testimonials yet.</p></div>';
    return;
  }
  grid.innerHTML = visible.map(t => {
    const displayName = t.censored ? censorName(t.senderName) : escHtml(t.senderName);
    return `
      <div class="testimonial-card">
        <div class="testimonial-quote"><i class="fas fa-quote-left"></i></div>
        <p class="testimonial-message">${escHtml(t.message)}</p>
        <div class="testimonial-sender">— ${displayName}${t.censored ? ' <span class="censored-badge">🔒</span>' : ''}</div>
      </div>`;
  }).join('');
}

/* ── RENDER SEASON STATS ─────────────────────────────────── */
function buildRadarSVG(radar) {
  const cx = 110, cy = 110, maxR = 80;
  const axes = [
    { key: 'shooting',  label: 'Shooting',  angle: 90 },
    { key: 'survival',  label: 'Survival',  angle: 18 },
    { key: 'coop',      label: 'Co-op',     angle: -54 },
    { key: 'objective', label: 'Objective', angle: -126 },
    { key: 'vehicle',   label: 'Vehicle',   angle: 162 }
  ];

  function pt(angle, r) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  }

  const gridLevels = [20, 40, 60, 80, 100];
  const gridLines = gridLevels.map(level => {
    const r = (level / 100) * maxR;
    const points = axes.map(a => pt(a.angle, r));
    return `<polygon points="${points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`;
  }).join('');

  const axisLines = axes.map(a => {
    const end = pt(a.angle, maxR);
    return `<line x1="${cx}" y1="${cy}" x2="${end.x.toFixed(1)}" y2="${end.y.toFixed(1)}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;
  }).join('');

  const dataPoints = axes.map(a => {
    const val = Math.min(100, Math.max(0, radar[a.key] || 0));
    return pt(a.angle, (val / 100) * maxR);
  });
  const dataPolygon = `<polygon points="${dataPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="rgba(15,247,150,0.3)" stroke="#0ff796" stroke-width="2"/>`;
  const dataDots = dataPoints.map(p => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="#0ff796"/>`).join('');

  const labels = axes.map(a => {
    const labelR = maxR + 22;
    const p = pt(a.angle, labelR);
    const anchor = p.x < cx - 5 ? 'end' : p.x > cx + 5 ? 'start' : 'middle';
    return `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="middle" fill="rgba(255,255,255,0.8)" font-size="10" font-family="Rajdhani,sans-serif">${a.label}</text>`;
  }).join('');

  return `<svg class="radar-chart" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
    ${gridLines}${axisLines}${dataPolygon}${dataDots}${labels}
  </svg>`;
}

function renderSeasonStats(seasonStats) {
  const grid = document.getElementById('seasonStatsGrid');
  if (!grid) return;
  if (!seasonStats || seasonStats.length === 0) {
    grid.innerHTML = '<div class="empty-state"><i class="fas fa-chart-bar"></i><p>No season stats added yet.</p></div>';
    return;
  }
  grid.innerHTML = seasonStats.map(s => {
    const radar = s.radar || {};
    const ad = s.ad || {};
    const vu = s.victoryUnite || {};
    return `
      <div class="season-card">
        <div class="season-header">
          <h3 class="season-name">${escHtml(s.season || 'Season')}</h3>
        </div>
        <div class="season-body">
          <div class="season-stats-cols">
            <div class="season-stat-col">
              <div class="season-mode-label">⚔️ A/D</div>
              <div class="season-stat-row"><span>KPM</span><span class="stat-val">${escHtml(String(ad.kpm ?? '—'))}</span></div>
              <div class="season-stat-row"><span>SPM</span><span class="stat-val">${escHtml(String(ad.spm ?? '—'))}</span></div>
            </div>
            <div class="season-stat-col">
              <div class="season-mode-label">🏆 Victory Unite</div>
              <div class="season-stat-row"><span>KPM</span><span class="stat-val">${escHtml(String(vu.kpm ?? '—'))}</span></div>
              <div class="season-stat-row"><span>SPM</span><span class="stat-val">${escHtml(String(vu.spm ?? '—'))}</span></div>
            </div>
          </div>
          <div class="radar-chart-container">
            ${buildRadarSVG(radar)}
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ── SCROLL ANIMATIONS ───────────────────────────────────── */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.loadout-card, .favorite-loadout-card, .achievement-card, .setting-card, .stat-bar-item, .spec-item, .clip-card, .testimonial-card, .season-card'
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
    renderProfile(data.profile);
    renderClips(data.clips);
    renderTestimonials(data.testimonials);
    renderSeasonStats(data.seasonStats);
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
