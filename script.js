/* ============================================================
   script.js — D0PPER. | Public Site Logic
   ============================================================ */

'use strict';

/* ── DEFAULT DATA ────────────────────────────────────────── */
const DEFAULT_DATA = {
  loadouts: [
    {
      id: 'load-001',
      weaponName: 'M4A1',
      favorite: true,
      category: 'Assault Rifle',
      builds: [
        { id: 'b-001-1', buildType: 'Build Stability',   code: 'M4-STAB-001-XR' },
        { id: 'b-001-2', buildType: 'Build Close Range', code: 'M4-CQB-002-SR'  },
        { id: 'b-001-3', buildType: 'Build Handling',    code: 'M4-HDL-003-FR'  }
      ]
    },
    {
      id: 'load-002',
      weaponName: 'AWM',
      favorite: true,
      category: 'Sniper',
      builds: [
        { id: 'b-002-1', buildType: 'Build Long Range',  code: 'AWM-LR-001-XS' },
        { id: 'b-002-2', buildType: 'Build Quickscope',  code: 'AWM-QS-002-YT' }
      ]
    },
    {
      id: 'load-003',
      weaponName: 'CI-19',
      favorite: false,
      category: 'Assault Rifle',
      builds: [
        { id: 'b-003-1', buildType: 'Build All-Rounder', code: 'CI19-AR-001-ZZ' }
      ]
    }
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
    currentIGN:     'd0pper',
    currentTeam:    'Team Alpha',
    birthplace:     'Indonesia',
    birthdayDay:    15,
    birthdayMonth:  'Maret',
    displayPhoto:   '',
    rank:           'Diamond',
    region:         'Asia',
    playstyle:      'Aggressive Assault',
    bio:            'Delta Force enthusiast. Competitive FPS player.',
    playerId:       'DF-123456',
    teamHistory: [
      {
        id: 'th-001',
        teamName:   'Solo Player',
        startMonth: 'Januari',
        startYear:  2024,
        endMonth:   'Juni',
        endYear:    2024,
        isCurrent:  false,
        ign:        'noob_d0pper'
      },
      {
        id: 'th-002',
        teamName:   'Team Alpha',
        startMonth: 'Juli',
        startYear:  2024,
        endMonth:   '',
        endYear:    0,
        isCurrent:  true,
        ign:        'd0pper'
      }
    ]
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
      title: 'Epic Squad Wipe',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      visible: true
    }
  ],
  testimonials: [
    {
      id: 'test-001',
      name: 'Ahmad Rifai',
      message: 'Loadout codes dari d0pper beneran OP! AWM setup bikin saya rank up cepat banget.',
      censorName: false,
      visible: true
    },
    {
      id: 'test-002',
      name: 'Budi Santoso',
      message: 'Settings yang dibagiin sangat membantu, aim jadi lebih konsisten.',
      censorName: true,
      visible: true
    }
  ],
  seasonStats: [
    {
      id: 'season-001',
      season: 'Season 1',
      adKpm: 2.5, adSpm: 350,
      vuKpm: 1.8, vuSpm: 280,
      radar: { shooting: 80, survival: 70, coop: 75, objective: 85, vehicle: 40 }
    }
  ],
  visitorBaseCount: 0
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
    loadouts:         getData('loadouts')         || DEFAULT_DATA.loadouts,
    settings:         getData('settings')         || DEFAULT_DATA.settings,
    achievements:     getData('achievements')     || DEFAULT_DATA.achievements,
    pcSpecs:          getData('pcSpecs')          || DEFAULT_DATA.pcSpecs,
    profile:          getData('profile')          || DEFAULT_DATA.profile,
    socialLinks:      getData('socialLinks')      || DEFAULT_DATA.socialLinks,
    stats:            getData('stats')            || DEFAULT_DATA.stats,
    clips:            getData('clips')            || DEFAULT_DATA.clips,
    testimonials:     getData('testimonials')     || DEFAULT_DATA.testimonials,
    seasonStats:      getData('seasonStats')      || DEFAULT_DATA.seasonStats,
    visitorBaseCount: getData('visitorBaseCount') !== null ? getData('visitorBaseCount') : DEFAULT_DATA.visitorBaseCount
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
  const baseCount = getData('visitorBaseCount') || 0;
  let realViews = parseInt(localStorage.getItem('dfloadout_real_views') || '0', 10);
  realViews += 1;
  localStorage.setItem('dfloadout_real_views', realViews);
  el.textContent = (baseCount + realViews).toLocaleString();
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
  const profile = data.profile || {};
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
      <div class="hero-stat-value">${escHtml(profile.rank || '—')}</div>
      <div class="hero-stat-label">Rank</div>
    </div>
    <div class="hero-stat">
      <div class="hero-stat-value">${escHtml(profile.region || '—')}</div>
      <div class="hero-stat-label">Region</div>
    </div>
  `;
}

/* ── RENDER LOADOUTS ─────────────────────────────────────── */
function renderLoadouts(loadouts) {
  const grid       = document.getElementById('loadoutGrid');
  const filterEl   = document.getElementById('loadoutFilter');
  const noResults  = document.getElementById('loadoutNoResults');
  const searchInput = document.getElementById('loadoutSearch');
  const clearBtn   = document.getElementById('searchClearBtn');
  if (!grid) return;

  let currentCategory = 'All';
  let currentSearch   = '';

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
        currentCategory = btn.dataset.cat;
        applyFilters();
      });
    });
  }

  /* Search input */
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value.trim().toLowerCase();
      if (clearBtn) clearBtn.style.display = currentSearch ? 'flex' : 'none';
      applyFilters();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) { searchInput.value = ''; currentSearch = ''; }
      clearBtn.style.display = 'none';
      applyFilters();
    });
  }

  /* Sort: favorites first */
  const favorites    = loadouts.filter(l => l.favorite);
  const nonFavorites = loadouts.filter(l => !l.favorite);
  const sorted       = [...favorites, ...nonFavorites];

  function renderGrid(filtered) {
    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (noResults) {
        const q = escHtml(currentSearch);
        noResults.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-search"></i>
            <p>No loadouts found${q ? ' for "<strong>' + q + '</strong>"' : ''}.</p>
          </div>`;
        noResults.style.display = 'block';
      }
      return;
    }
    if (noResults) noResults.style.display = 'none';

    grid.innerHTML = filtered.map(l => {
      const isFav   = l.favorite;
      const catTag  = l.category ? `<span class="loadout-category-tag">${escHtml(l.category)}</span>` : '';
      const favBadge = isFav ? `<div class="featured-badge">⭐ FAVORITE</div>` : '';
      const buildsHtml = (l.builds && l.builds.length > 0)
        ? l.builds.map(b => `
          <div class="build-item">
            <div class="build-type-label">${escHtml(b.buildType || 'Build')}</div>
            <div class="build-code">${escHtml(b.code)}</div>
            <button class="copy-btn" data-code="${escHtml(b.code)}">
              <i class="fas fa-copy"></i> Copy Code
            </button>
          </div>`).join('')
        : `<div class="build-empty"><i class="fas fa-info-circle"></i> No build codes added yet.</div>`;

      return `
        <div class="${isFav ? 'featured-loadout-card' : 'loadout-card'}" data-category="${escHtml(l.category || '')}" data-weapon="${escHtml((l.weaponName || '').toLowerCase())}">
          ${favBadge}
          <div class="loadout-card-header">
            <div class="loadout-icon"><i class="fas fa-crosshairs"></i></div>
            <div class="loadout-title">${escHtml(l.weaponName || 'Unknown Weapon')}</div>
            ${catTag}
          </div>
          <div class="builds-list">${buildsHtml}</div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', handleCopy);
    });
  }

  function applyFilters() {
    const filtered = sorted.filter(l => {
      const catMatch = currentCategory === 'All' || l.category === currentCategory;
      const searchMatch = !currentSearch || (l.weaponName || '').toLowerCase().includes(currentSearch);
      return catMatch && searchMatch;
    });
    renderGrid(filtered);
  }

  applyFilters();
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
    { icon: 'fas fa-desktop',    label: 'Resolution',          value: s.resolution  || '—' },
    { icon: 'fas fa-mouse',      label: 'DPI',                 value: s.dpi         || '—' },
    { icon: 'fas fa-gamepad',    label: 'General Sensitivity', value: s.generalSens || '—' },
    { icon: 'fas fa-crosshairs', label: 'ADS Sensitivity',     value: s.adsSens     || '—' },
    { icon: 'fas fa-eye',        label: 'FOV',                 value: (s.fov || '—') + (s.fov ? '°' : '') }
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

/* ── RENDER CLIPS ────────────────────────────────────────── */
function renderClips(clips) {
  const grid = document.getElementById('clipsGrid');
  if (!grid) return;

  const visible = clips.filter(c => c.visible);

  if (visible.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-film"></i>
        <p>No clips added yet.</p>
      </div>`;
    return;
  }

  grid.innerHTML = visible.map(c => {
    const embedUrl = getEmbedUrl(c.url || '');
    if (!embedUrl) return '';
    return `
      <div class="clip-card">
        <div class="clip-title">${escHtml(c.title || 'Clip')}</div>
        <div class="clip-embed-wrap">
          <iframe src="${escHtml(embedUrl)}" frameborder="0" allowfullscreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy" title="${escHtml(c.title || 'Clip')}"></iframe>
        </div>
      </div>`;
  }).filter(Boolean).join('');
}

function getEmbedUrl(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    /* YouTube */
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      let videoId = u.searchParams.get('v');
      if (!videoId && u.hostname === 'youtu.be') videoId = u.pathname.slice(1);
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    /* TikTok */
    if (u.hostname.includes('tiktok.com')) {
      const parts = u.pathname.split('/');
      const vidIdx = parts.indexOf('video');
      if (vidIdx !== -1 && parts[vidIdx + 1]) {
        return `https://www.tiktok.com/embed/v2/${parts[vidIdx + 1]}`;
      }
    }
  } catch (e) { /* ignore */ }
  return '';
}

/* ── RENDER TESTIMONIALS ─────────────────────────────────── */
function renderTestimonials(testimonials) {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;

  const visible = testimonials.filter(t => t.visible);

  if (visible.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-comment-dots"></i>
        <p>No testimonials yet.</p>
      </div>`;
    return;
  }

  grid.innerHTML = visible.map(t => {
    const displayName = t.censorName ? censorName(t.name || '') : escHtml(t.name || 'Anonymous');
    return `
      <div class="testimonial-card">
        <div class="testimonial-message">"${escHtml(t.message || '')}"</div>
        <div class="testimonial-sender">— ${displayName}</div>
      </div>`;
  }).join('');
}

function censorName(name) {
  if (!name) return 'Anonymous';
  return name.split(' ').map(word => {
    if (word.length <= 1) return escHtml(word);
    return escHtml(word[0]) + '*'.repeat(word.length - 2) + escHtml(word[word.length - 1]);
  }).join(' ');
}

/* ── RENDER LIGHTBOX ─────────────────────────────────────── */
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

/* ── RENDER SEASON STATS ─────────────────────────────────── */
function renderSeasonStats(seasonStats) {
  const grid = document.getElementById('seasonStatsGrid');
  if (!grid) return;

  if (!seasonStats || seasonStats.length === 0) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-chart-area"></i><p>No season stats added yet.</p></div>`;
    return;
  }

  grid.innerHTML = seasonStats.map((s, idx) => {
    const canvasId = 'radar-' + (s.id || idx);
    return `
      <div class="season-card">
        <div class="season-card-name">${escHtml(s.season || 'Season ?')}</div>
        <div class="season-card-body">
          <div class="season-kpms">
            <div class="season-mode-block">
              <div class="season-mode-label"><i class="fas fa-shield-alt"></i> A/D</div>
              <div class="season-stat-row">
                <span class="season-stat-key">KPM</span>
                <span class="season-stat-val">${Number(s.adKpm || 0).toFixed(2)}</span>
              </div>
              <div class="season-stat-row">
                <span class="season-stat-key">SPM</span>
                <span class="season-stat-val">${Number(s.adSpm || 0).toFixed(1)}</span>
              </div>
            </div>
            <div class="season-mode-block">
              <div class="season-mode-label"><i class="fas fa-flag"></i> Victory Unite</div>
              <div class="season-stat-row">
                <span class="season-stat-key">KPM</span>
                <span class="season-stat-val">${Number(s.vuKpm || 0).toFixed(2)}</span>
              </div>
              <div class="season-stat-row">
                <span class="season-stat-key">SPM</span>
                <span class="season-stat-val">${Number(s.vuSpm || 0).toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div class="season-radar-wrap">
            <canvas class="radar-chart" id="${canvasId}" width="220" height="220"
              data-shooting="${Number((s.radar && s.radar.shooting)  || 0)}"
              data-survival="${Number((s.radar && s.radar.survival)  || 0)}"
              data-coop="${Number((s.radar && s.radar.coop)          || 0)}"
              data-objective="${Number((s.radar && s.radar.objective)|| 0)}"
              data-vehicle="${Number((s.radar && s.radar.vehicle)    || 0)}">
            </canvas>
          </div>
        </div>
      </div>`;
  }).join('');

  /* Draw radar charts when visible */
  const canvases = grid.querySelectorAll('.radar-chart');
  const radarObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        drawRadarChart(entry.target);
        radarObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  canvases.forEach(c => radarObserver.observe(c));
}

function drawRadarChart(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.min(cx, cy) - 30;

  const labels = ['Shooting', 'Survival', 'Co-op', 'Objective', 'Vehicle'];
  const values = [
    Number(canvas.dataset.shooting  || 0),
    Number(canvas.dataset.survival  || 0),
    Number(canvas.dataset.coop      || 0),
    Number(canvas.dataset.objective || 0),
    Number(canvas.dataset.vehicle   || 0)
  ];
  const n = labels.length;
  const angles = labels.map((_, i) => (Math.PI * 2 * i / n) - Math.PI / 2);

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const gridColor  = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
  const labelColor = isDark ? 'rgba(255,255,255,0.7)'  : 'rgba(0,0,0,0.7)';
  const accentFill   = 'rgba(15,247,150,0.25)';
  const accentStroke = '#0ff796';

  ctx.clearRect(0, 0, w, h);

  /* Grid circles */
  [20, 40, 60, 80, 100].forEach(level => {
    ctx.beginPath();
    angles.forEach((ang, i) => {
      const r = maxR * level / 100;
      const x = cx + r * Math.cos(ang);
      const y = cy + r * Math.sin(ang);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  /* Axes */
  angles.forEach(ang => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + maxR * Math.cos(ang), cy + maxR * Math.sin(ang));
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  /* Data polygon */
  ctx.beginPath();
  angles.forEach((ang, i) => {
    const r = maxR * (values[i] / 100);
    const x = cx + r * Math.cos(ang);
    const y = cy + r * Math.sin(ang);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = accentFill;
  ctx.fill();
  ctx.strokeStyle = accentStroke;
  ctx.lineWidth = 2;
  ctx.stroke();

  /* Data point dots */
  angles.forEach((ang, i) => {
    const r = maxR * (values[i] / 100);
    const x = cx + r * Math.cos(ang);
    const y = cy + r * Math.sin(ang);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = accentStroke;
    ctx.fill();
  });

  /* Labels */
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillStyle = labelColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  angles.forEach((ang, i) => {
    const r = maxR + 18;
    const x = cx + r * Math.cos(ang);
    const y = cy + r * Math.sin(ang);
    ctx.fillText(labels[i], x, y);
  });
}

/* ── RENDER PROFILE ──────────────────────────────────────── */
function renderProfile(profile) {
  const card = document.getElementById('profileCard');
  if (!card) return;

  const p = profile || {};

  /* Build photo / silhouette */
  const photoHtml = p.displayPhoto
    ? `<div class="profile-photo-wrap"><img class="profile-photo" src="${escHtml(p.displayPhoto)}" alt="Profile Photo" /></div>`
    : `<div class="profile-photo-wrap"><div class="profile-shadow-placeholder"><i class="fas fa-user"></i></div></div>`;

  /* Birthday */
  const birthdayHtml = (p.birthdayDay && p.birthdayMonth)
    ? `<div class="profile-field"><i class="fas fa-birthday-cake"></i> ${escHtml(String(p.birthdayDay))} ${escHtml(p.birthdayMonth)}</div>`
    : '';

  /* Team history */
  const teamHistory = Array.isArray(p.teamHistory) ? p.teamHistory : [];
  const sortedHistory = [...teamHistory].sort((a, b) => {
    const ay = a.startYear || 0; const by = b.startYear || 0;
    return ay !== by ? by - ay : 0;
  });

  const teamHistoryHtml = sortedHistory.length > 0 ? `
    <div class="team-history-wrap">
      <div class="team-history-title"><i class="fas fa-history"></i> Team History</div>
      <div class="team-history-list">
        ${sortedHistory.map(th => {
          const start = `${th.startMonth || ''} ${th.startYear || ''}`.trim();
          const end   = th.isCurrent ? 'Sekarang' : `${th.endMonth || ''} ${th.endYear || ''}`.trim();
          const period = [start, end].filter(Boolean).join(' — ');
          const activeBadge = th.isCurrent ? `<span class="active-badge">ACTIVE</span>` : '';
          return `
            <div class="team-history-item${th.isCurrent ? ' current' : ''}">
              <div class="th-team-name">${escHtml(th.teamName || '—')} ${activeBadge}</div>
              <div class="th-period">${escHtml(period)}</div>
              <div class="th-ign"><i class="fas fa-id-badge"></i> ${escHtml(th.ign || '—')}</div>
            </div>`;
        }).join('')}
      </div>
    </div>` : '';

  card.innerHTML = `
    ${photoHtml}
    <div class="profile-nickname">${escHtml(p.currentIGN || p.nickname || 'Unknown Player')}</div>
    ${p.currentTeam ? `<div class="profile-team"><i class="fas fa-users"></i> ${escHtml(p.currentTeam)}</div>` : ''}
    ${p.rank ? `<div class="profile-rank-badge"><i class="fas fa-star"></i> ${escHtml(p.rank)}</div>` : ''}
    <div class="profile-fields">
      ${birthdayHtml}
      ${p.birthplace ? `<div class="profile-field"><i class="fas fa-map-marker-alt"></i> ${escHtml(p.birthplace)}</div>` : ''}
      ${p.region     ? `<div class="profile-field"><i class="fas fa-globe-asia"></i> ${escHtml(p.region)}</div>` : ''}
      ${p.playstyle  ? `<div class="profile-field"><i class="fas fa-running"></i> ${escHtml(p.playstyle)}</div>` : ''}
      ${p.playerId   ? `<div class="profile-field"><i class="fas fa-id-card"></i> ${escHtml(p.playerId)}</div>` : ''}
    </div>
    ${p.bio ? `<div class="profile-bio">"${escHtml(p.bio)}"</div>` : ''}
    ${teamHistoryHtml}
  `;
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
    renderAchievements(data.achievements);
    renderClips(data.clips);
    renderTestimonials(data.testimonials);
    renderPcSpecs(data.pcSpecs);
    renderStats(data.stats);
    renderSeasonStats(data.seasonStats);
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
