/* ============================================================
   admin.js — GUNSMITH DELTAFORCE by D0PPER. Admin Panel Logic
   ============================================================ */

'use strict';

/* ── CONSTANTS ───────────────────────────────────────────── */
// NOTE: This is a personal static site with no backend. The password below
// is a lightweight deterrent for casual access — not a true security measure.
// Anyone with access to the page source can view it. Change it to your own
// preferred password. Do NOT store sensitive data in this site.
const ADMIN_PASSWORD = 'd0pper2024';
const SESSION_KEY    = 'dfloadout_admin_session';

/* ── HELPERS ─────────────────────────────────────────────── */
function saveData(key, value) {
  try {
    localStorage.setItem('dfloadout_' + key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ── TOAST (admin) ───────────────────────────────────────── */
let adminToastTimer = null;
function showAdminToast(message, type = 'success') {
  const toast = document.getElementById('adminToast');
  if (!toast) return;
  const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
  toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
  toast.className = 'toast show' + (type === 'error' ? ' error' : '');
  clearTimeout(adminToastTimer);
  adminToastTimer = setTimeout(() => { toast.className = 'toast'; }, 3000);
}

/* ── AUTH ────────────────────────────────────────────────── */
function checkSession() {
  return sessionStorage.getItem(SESSION_KEY) === 'authenticated';
}

function initAuth() {
  const overlay   = document.getElementById('loginOverlay');
  const wrapper   = document.getElementById('adminWrapper');
  const form      = document.getElementById('loginForm');
  const errEl     = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');

  if (!overlay || !wrapper) return;

  if (checkSession()) {
    overlay.style.display = 'none';
    wrapper.style.display = 'block';
    initAdminApp();
    return;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const pw = document.getElementById('adminPassword').value;
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'authenticated');
      overlay.style.display = 'none';
      wrapper.style.display = 'block';
      errEl.textContent = '';
      initAdminApp();
    } else {
      errEl.textContent = 'Incorrect password. Access denied.';
      document.getElementById('adminPassword').value = '';
      document.getElementById('adminPassword').focus();
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEY);
      window.location.reload();
    });
  }
}

/* ── SIDEBAR NAVIGATION ──────────────────────────────────── */
function initSidebarNav() {
  const navLinks = document.querySelectorAll('.admin-nav-link');
  const sections = document.querySelectorAll('.admin-section');

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.dataset.section;

      navLinks.forEach(l => l.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      link.classList.add('active');
      const sec = document.getElementById('section-' + target);
      if (sec) sec.classList.add('active');
    });
  });
}

/* ── LOADOUT MANAGEMENT ──────────────────────────────────── */
function initLoadoutManager() {
  const form      = document.getElementById('loadoutForm');
  const cancelBtn = document.getElementById('loadoutCancelBtn');
  const idField   = document.getElementById('loadoutId');

  function renderList() {
    const loadouts = window.dfApp.getData('loadouts') || window.dfApp.DEFAULT_DATA.loadouts;
    const list     = document.getElementById('loadoutList');
    if (!list) return;

    if (loadouts.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;text-align:center;padding:1rem;">No loadouts yet. Add one above.</p>';
      return;
    }

    list.innerHTML = loadouts.map(l => {
      const catTag  = l.category ? `<span class="admin-tag">${window.dfApp.escHtml(l.category)}</span>` : '';
      const featTag = l.featured  ? `<span class="admin-tag featured-tag">⭐ Featured</span>` : '';
      return `
        <div class="admin-list-item" data-id="${l.id}">
          <div class="admin-list-item-info">
            <div class="admin-list-item-title">${window.dfApp.escHtml(l.title)} ${catTag} ${featTag}</div>
            <div class="admin-list-item-sub">${window.dfApp.escHtml(l.code)}</div>
          </div>
          <div class="admin-list-item-actions">
            <button class="btn btn-outline btn-sm edit-loadout-btn" data-id="${l.id}">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm delete-loadout-btn" data-id="${l.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>`;
    }).join('');

    list.querySelectorAll('.edit-loadout-btn').forEach(btn => {
      btn.addEventListener('click', () => editLoadout(btn.dataset.id));
    });
    list.querySelectorAll('.delete-loadout-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteLoadout(btn.dataset.id));
    });
  }

  function resetForm() {
    form.reset();
    idField.value = '';
    document.getElementById('loadoutFormTitle').textContent = 'Add New Loadout';
    document.getElementById('loadoutSubmitText').textContent = 'Add Loadout';
    cancelBtn.style.display = 'none';
  }

  function editLoadout(id) {
    const loadouts = window.dfApp.getData('loadouts') || window.dfApp.DEFAULT_DATA.loadouts;
    const item = loadouts.find(l => l.id === id);
    if (!item) return;

    idField.value = id;
    document.getElementById('loadoutTitle').value    = item.title    || '';
    document.getElementById('loadoutCode').value     = item.code     || '';
    document.getElementById('loadoutCategory').value = item.category || '';
    document.getElementById('loadoutFeatured').checked = !!item.featured;
    document.getElementById('loadoutFormTitle').textContent  = 'Edit Loadout';
    document.getElementById('loadoutSubmitText').textContent = 'Update Loadout';
    cancelBtn.style.display = 'inline-flex';
    document.getElementById('section-loadouts').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function deleteLoadout(id) {
    if (!confirm('Delete this loadout? This action cannot be undone.')) return;
    let loadouts = window.dfApp.getData('loadouts') || window.dfApp.DEFAULT_DATA.loadouts;
    loadouts = loadouts.filter(l => l.id !== id);
    saveData('loadouts', loadouts);
    renderList();
    showAdminToast('Loadout deleted.');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const title    = document.getElementById('loadoutTitle').value.trim();
    const code     = document.getElementById('loadoutCode').value.trim();
    const category = document.getElementById('loadoutCategory').value.trim();
    const featured = document.getElementById('loadoutFeatured').checked;
    if (!title || !code) return;

    let loadouts = window.dfApp.getData('loadouts') || window.dfApp.DEFAULT_DATA.loadouts;
    const existingId = idField.value;

    /* Only one featured at a time */
    if (featured) {
      loadouts = loadouts.map(l => ({ ...l, featured: false }));
    }

    if (existingId) {
      loadouts = loadouts.map(l => l.id === existingId ? { ...l, title, code, category, featured } : l);
      showAdminToast('Loadout updated successfully!');
    } else {
      loadouts.push({ id: generateId(), title, code, category, featured });
      showAdminToast('Loadout added successfully!');
    }

    saveData('loadouts', loadouts);
    renderList();
    resetForm();
  });

  cancelBtn.addEventListener('click', resetForm);
  renderList();
}

/* ── SETTINGS MANAGEMENT ─────────────────────────────────── */
function initSettingsManager() {
  const form = document.getElementById('settingsForm');
  if (!form) return;

  function loadSettings() {
    const s = window.dfApp.getData('settings') || window.dfApp.DEFAULT_DATA.settings;
    document.getElementById('settingResolution').value  = s.resolution  || '';
    document.getElementById('settingDpi').value         = s.dpi         || '';
    document.getElementById('settingGeneralSens').value = s.generalSens || '';
    document.getElementById('settingAdsSens').value     = s.adsSens     || '';
    document.getElementById('settingFov').value         = s.fov         || '';
    if (s.scopeSens) {
      document.getElementById('scopeSens1x').value = s.scopeSens['1x'] || '';
      document.getElementById('scopeSens2x').value = s.scopeSens['2x'] || '';
      document.getElementById('scopeSens4x').value = s.scopeSens['4x'] || '';
      document.getElementById('scopeSens6x').value = s.scopeSens['6x'] || '';
      document.getElementById('scopeSens8x').value = s.scopeSens['8x'] || '';
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const settings = {
      resolution:  document.getElementById('settingResolution').value.trim(),
      dpi:         document.getElementById('settingDpi').value.trim(),
      generalSens: document.getElementById('settingGeneralSens').value.trim(),
      adsSens:     document.getElementById('settingAdsSens').value.trim(),
      fov:         document.getElementById('settingFov').value.trim(),
      scopeSens: {
        '1x': document.getElementById('scopeSens1x').value.trim(),
        '2x': document.getElementById('scopeSens2x').value.trim(),
        '4x': document.getElementById('scopeSens4x').value.trim(),
        '6x': document.getElementById('scopeSens6x').value.trim(),
        '8x': document.getElementById('scopeSens8x').value.trim()
      }
    };
    saveData('settings', settings);
    showAdminToast('Settings saved successfully!');
  });

  loadSettings();
}

/* ── ACHIEVEMENTS MANAGEMENT ─────────────────────────────── */
function initAchievementManager() {
  const form      = document.getElementById('achievementForm');
  const cancelBtn = document.getElementById('achievementCancelBtn');
  const idField   = document.getElementById('achievementId');
  const photoInput = document.getElementById('achievementPhotos');
  const previewEl  = document.getElementById('achievementPhotoPreview');

  let pendingPhotos = []; /* array of base64 strings */

  function renderPhotoPreview() {
    if (!previewEl) return;
    if (pendingPhotos.length === 0) { previewEl.innerHTML = ''; return; }
    previewEl.innerHTML = pendingPhotos.map((src, i) => `
      <div class="photo-preview-item">
        <img src="${window.dfApp.escHtml(src)}" alt="preview" />
        <button type="button" class="photo-preview-remove" data-index="${i}" title="Remove">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
    previewEl.querySelectorAll('.photo-preview-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingPhotos.splice(Number(btn.dataset.index), 1);
        renderPhotoPreview();
      });
    });
  }

  if (photoInput) {
    photoInput.addEventListener('change', () => {
      const files = Array.from(photoInput.files);
      const remaining = 5 - pendingPhotos.length;
      const toProcess = files.slice(0, remaining);

      if (files.length > remaining) {
        showAdminToast(`Max 5 photos. Only first ${remaining} added.`, 'error');
      }

      toProcess.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
          pendingPhotos.push(e.target.result);
          renderPhotoPreview();
        };
        reader.readAsDataURL(file);
      });
      photoInput.value = '';
    });
  }

  function renderList() {
    const achievements = window.dfApp.getData('achievements') || window.dfApp.DEFAULT_DATA.achievements;
    const list = document.getElementById('achievementList');
    if (!list) return;

    if (achievements.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;text-align:center;padding:1rem;">No achievements yet. Add one above.</p>';
      return;
    }

    list.innerHTML = achievements.map(a => `
      <div class="admin-list-item ${a.visible ? '' : 'hidden-item'}" data-id="${a.id}">
        <div class="admin-list-item-info">
          <div class="admin-list-item-title">${window.dfApp.escHtml(a.placement || '—')} — ${window.dfApp.escHtml(a.tournament || '')}</div>
          <div class="admin-list-item-meta">${window.dfApp.escHtml(a.monthYear || '')}${a.team ? ' · ' + window.dfApp.escHtml(a.team) : ''}</div>
          ${(a.photos && a.photos.length) ? `<div class="admin-list-item-meta"><i class="fas fa-image"></i> ${a.photos.length} photo${a.photos.length > 1 ? 's' : ''}</div>` : ''}
        </div>
        <div class="admin-list-item-actions">
          <span class="visibility-badge ${a.visible ? 'visible' : 'hidden'}">
            <i class="fas fa-${a.visible ? 'eye' : 'eye-slash'}"></i>
            ${a.visible ? 'Visible' : 'Hidden'}
          </span>
          <button class="btn btn-outline btn-sm toggle-ach-btn" data-id="${a.id}" title="Toggle Visibility">
            <i class="fas fa-${a.visible ? 'eye-slash' : 'eye'}"></i>
          </button>
          <button class="btn btn-outline btn-sm edit-ach-btn" data-id="${a.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm delete-ach-btn" data-id="${a.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.toggle-ach-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleAchievementVisibility(btn.dataset.id));
    });
    list.querySelectorAll('.edit-ach-btn').forEach(btn => {
      btn.addEventListener('click', () => editAchievement(btn.dataset.id));
    });
    list.querySelectorAll('.delete-ach-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteAchievement(btn.dataset.id));
    });
  }

  function resetForm() {
    form.reset();
    idField.value  = '';
    pendingPhotos  = [];
    renderPhotoPreview();
    document.getElementById('achievementFormTitle').textContent  = 'Add New Achievement';
    document.getElementById('achievementSubmitText').textContent = 'Add Achievement';
    cancelBtn.style.display = 'none';
  }

  function editAchievement(id) {
    const achievements = window.dfApp.getData('achievements') || window.dfApp.DEFAULT_DATA.achievements;
    const item = achievements.find(a => a.id === id);
    if (!item) return;

    idField.value = id;
    document.getElementById('achievementPlacement').value  = item.placement  || '';
    document.getElementById('achievementTournament').value = item.tournament  || '';
    document.getElementById('achievementMonthYear').value  = item.monthYear   || '';
    document.getElementById('achievementTeam').value       = item.team        || '';
    document.getElementById('achievementDesc').value       = item.description || '';
    pendingPhotos = Array.isArray(item.photos) ? [...item.photos] : [];
    renderPhotoPreview();
    document.getElementById('achievementFormTitle').textContent  = 'Edit Achievement';
    document.getElementById('achievementSubmitText').textContent = 'Update Achievement';
    cancelBtn.style.display = 'inline-flex';
    document.getElementById('section-achievements').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleAchievementVisibility(id) {
    let achievements = window.dfApp.getData('achievements') || window.dfApp.DEFAULT_DATA.achievements;
    achievements = achievements.map(a => a.id === id ? { ...a, visible: !a.visible } : a);
    saveData('achievements', achievements);
    renderList();
    const updated = achievements.find(a => a.id === id);
    showAdminToast(`Achievement ${updated.visible ? 'shown' : 'hidden'} on public site.`);
  }

  function deleteAchievement(id) {
    if (!confirm('Delete this achievement? This action cannot be undone.')) return;
    let achievements = window.dfApp.getData('achievements') || window.dfApp.DEFAULT_DATA.achievements;
    achievements = achievements.filter(a => a.id !== id);
    saveData('achievements', achievements);
    renderList();
    showAdminToast('Achievement deleted.');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const placement   = document.getElementById('achievementPlacement').value.trim();
    const tournament  = document.getElementById('achievementTournament').value.trim();
    const monthYear   = document.getElementById('achievementMonthYear').value.trim();
    const team        = document.getElementById('achievementTeam').value.trim();
    const description = document.getElementById('achievementDesc').value.trim();
    if (!placement || !tournament || !monthYear) return;

    let achievements = window.dfApp.getData('achievements') || window.dfApp.DEFAULT_DATA.achievements;
    const existingId = idField.value;
    const photos     = pendingPhotos.slice(0, 5);

    if (existingId) {
      achievements = achievements.map(a =>
        a.id === existingId ? { ...a, placement, tournament, monthYear, team, description, photos } : a
      );
      showAdminToast('Achievement updated successfully!');
    } else {
      achievements.push({
        id: generateId(),
        placement, tournament, monthYear, team, description, photos,
        visible: true
      });
      showAdminToast('Achievement added successfully!');
    }

    saveData('achievements', achievements);
    renderList();
    resetForm();
  });

  cancelBtn.addEventListener('click', resetForm);
  renderList();
}

/* ── PC SPECS MANAGEMENT ─────────────────────────────────── */
function initPcSpecsManager() {
  const form = document.getElementById('pcSpecsForm');
  if (!form) return;

  function loadSpecs() {
    const s = window.dfApp.getData('pcSpecs') || window.dfApp.DEFAULT_DATA.pcSpecs;
    document.getElementById('specCpu').value      = s.cpu      || '';
    document.getElementById('specGpu').value      = s.gpu      || '';
    document.getElementById('specRam').value      = s.ram      || '';
    document.getElementById('specMonitor').value  = s.monitor  || '';
    document.getElementById('specMouse').value    = s.mouse    || '';
    document.getElementById('specKeyboard').value = s.keyboard || '';
    document.getElementById('specHeadset').value  = s.headset  || '';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const pcSpecs = {
      cpu:      document.getElementById('specCpu').value.trim(),
      gpu:      document.getElementById('specGpu').value.trim(),
      ram:      document.getElementById('specRam').value.trim(),
      monitor:  document.getElementById('specMonitor').value.trim(),
      mouse:    document.getElementById('specMouse').value.trim(),
      keyboard: document.getElementById('specKeyboard').value.trim(),
      headset:  document.getElementById('specHeadset').value.trim()
    };
    saveData('pcSpecs', pcSpecs);
    showAdminToast('PC Specs saved successfully!');
  });

  loadSpecs();
}

/* ── PROFILE MANAGEMENT ──────────────────────────────────── */
function initProfileManager() {
  const form = document.getElementById('profileForm');
  if (!form) return;

  function loadProfile() {
    const p = window.dfApp.getData('profile') || window.dfApp.DEFAULT_DATA.profile;
    document.getElementById('profileNickname').value  = p.nickname   || '';
    document.getElementById('profilePlayerId').value  = p.playerId   || '';
    document.getElementById('profileRank').value      = p.rank       || '';
    document.getElementById('profileRegion').value    = p.region     || '';
    document.getElementById('profilePlaystyle').value = p.playstyle  || '';
    document.getElementById('profileBio').value       = p.bio        || '';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const profile = {
      nickname:  document.getElementById('profileNickname').value.trim(),
      playerId:  document.getElementById('profilePlayerId').value.trim(),
      rank:      document.getElementById('profileRank').value.trim(),
      region:    document.getElementById('profileRegion').value.trim(),
      playstyle: document.getElementById('profilePlaystyle').value.trim(),
      bio:       document.getElementById('profileBio').value.trim()
    };
    saveData('profile', profile);
    showAdminToast('Profile saved successfully!');
  });

  loadProfile();
}

/* ── SOCIAL LINKS MANAGEMENT ─────────────────────────────── */
function initSocialManager() {
  const form = document.getElementById('socialForm');
  if (!form) return;

  function loadSocial() {
    const s = window.dfApp.getData('socialLinks') || window.dfApp.DEFAULT_DATA.socialLinks;
    document.getElementById('socialYoutube').value   = s.youtube   || '';
    document.getElementById('socialTiktok').value    = s.tiktok    || '';
    document.getElementById('socialSociabuzz').value = s.sociabuzz || '';
    document.getElementById('socialWhatsapp').value  = s.whatsapp  || '';
    document.getElementById('socialEmail').value     = s.email     || '';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const socialLinks = {
      youtube:   document.getElementById('socialYoutube').value.trim(),
      tiktok:    document.getElementById('socialTiktok').value.trim(),
      sociabuzz: document.getElementById('socialSociabuzz').value.trim(),
      whatsapp:  document.getElementById('socialWhatsapp').value.trim(),
      email:     document.getElementById('socialEmail').value.trim()
    };
    saveData('socialLinks', socialLinks);
    showAdminToast('Social links saved!');
  });

  loadSocial();
}

/* ── STATS MANAGEMENT ────────────────────────────────────── */
function initStatsManager() {
  const form       = document.getElementById('statsForm');
  const fieldsEl   = document.getElementById('statsFormFields');
  const addStatBtn = document.getElementById('addStatBtn');
  if (!form || !fieldsEl) return;

  function loadStats() {
    const stats = window.dfApp.getData('stats') || window.dfApp.DEFAULT_DATA.stats;
    renderStatFields(stats);
  }

  function renderStatFields(stats) {
    fieldsEl.innerHTML = stats.map((s, i) => `
      <div class="stat-field-row" data-index="${i}">
        <div class="form-row">
          <div class="form-group">
            <label class="label-sm">Stat Name</label>
            <input type="text" class="stat-name-input" value="${window.dfApp.escHtml(s.name)}" placeholder="e.g. Aim Accuracy" />
          </div>
          <div class="form-group" style="max-width:120px;">
            <label class="label-sm">Value (0–100)</label>
            <input type="number" class="stat-value-input" value="${Number(s.value) || 0}" min="0" max="100" />
          </div>
          <div class="form-group" style="max-width:50px;display:flex;align-items:flex-end;padding-bottom:.1rem;">
            <button type="button" class="btn btn-danger btn-sm delete-stat-btn" title="Remove stat">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    fieldsEl.querySelectorAll('.delete-stat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.stat-field-row').remove();
      });
    });
  }

  if (addStatBtn) {
    addStatBtn.addEventListener('click', () => {
      const row = document.createElement('div');
      row.className = 'stat-field-row';
      row.innerHTML = `
        <div class="form-row">
          <div class="form-group">
            <label class="label-sm">Stat Name</label>
            <input type="text" class="stat-name-input" placeholder="e.g. Aim Accuracy" />
          </div>
          <div class="form-group" style="max-width:120px;">
            <label class="label-sm">Value (0–100)</label>
            <input type="number" class="stat-value-input" value="50" min="0" max="100" />
          </div>
          <div class="form-group" style="max-width:50px;display:flex;align-items:flex-end;padding-bottom:.1rem;">
            <button type="button" class="btn btn-danger btn-sm delete-stat-btn" title="Remove stat">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>`;
      row.querySelector('.delete-stat-btn').addEventListener('click', () => row.remove());
      fieldsEl.appendChild(row);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const rows  = fieldsEl.querySelectorAll('.stat-field-row');
    const stats = [];
    rows.forEach(row => {
      const name  = row.querySelector('.stat-name-input').value.trim();
      const value = Math.min(100, Math.max(0, parseInt(row.querySelector('.stat-value-input').value, 10) || 0));
      if (name) stats.push({ name, value });
    });
    saveData('stats', stats);
    showAdminToast('Stats saved successfully!');
  });

  loadStats();
}

/* ── SEASON STATS MANAGEMENT ─────────────────────────────── */
function initSeasonStatsManager() {
  const form      = document.getElementById('seasonForm');
  const cancelBtn = document.getElementById('seasonCancelBtn');
  const idField   = document.getElementById('seasonId');
  const previewCanvas = document.getElementById('adminRadarPreview');
  if (!form) return;

  function getRadarValues() {
    return {
      shooting:  Math.min(100, Math.max(0, parseInt(document.getElementById('radarShooting').value,  10) || 0)),
      survival:  Math.min(100, Math.max(0, parseInt(document.getElementById('radarSurvival').value,  10) || 0)),
      coop:      Math.min(100, Math.max(0, parseInt(document.getElementById('radarCoop').value,      10) || 0)),
      objective: Math.min(100, Math.max(0, parseInt(document.getElementById('radarObjective').value, 10) || 0)),
      vehicle:   Math.min(100, Math.max(0, parseInt(document.getElementById('radarVehicle').value,   10) || 0))
    };
  }

  function updatePreview() {
    if (previewCanvas && window.dfApp && window.dfApp.drawRadarChart) {
      window.dfApp.drawRadarChart(previewCanvas, getRadarValues());
    }
  }

  /* Live preview on input change */
  document.querySelectorAll('.radar-input').forEach(inp => {
    inp.addEventListener('input', updatePreview);
  });
  updatePreview();

  function renderList() {
    const seasons = window.dfApp.getData('seasonStats') || window.dfApp.DEFAULT_DATA.seasonStats;
    const list    = document.getElementById('seasonList');
    if (!list) return;

    if (!seasons || seasons.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;text-align:center;padding:1rem;">No seasons yet. Add one above.</p>';
      return;
    }

    list.innerHTML = seasons.map(s => `
      <div class="admin-list-item" data-id="${s.id}">
        <div class="admin-list-item-info">
          <div class="admin-list-item-title">${window.dfApp.escHtml(s.seasonName)}</div>
          <div class="admin-list-item-meta">
            A/D: KPM ${s.adStats?.kpm ?? '—'} · SPM ${s.adStats?.spm ?? '—'} &nbsp;|&nbsp;
            VU: KPM ${s.victoryUnite?.kpm ?? '—'} · SPM ${s.victoryUnite?.spm ?? '—'}
          </div>
        </div>
        <div class="admin-list-item-actions">
          <button class="btn btn-outline btn-sm edit-season-btn" data-id="${s.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm delete-season-btn" data-id="${s.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.edit-season-btn').forEach(btn => {
      btn.addEventListener('click', () => editSeason(btn.dataset.id));
    });
    list.querySelectorAll('.delete-season-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteSeason(btn.dataset.id));
    });
  }

  function resetForm() {
    form.reset();
    idField.value = '';
    document.getElementById('seasonFormTitle').textContent  = 'Add New Season';
    document.getElementById('seasonSubmitText').textContent = 'Add Season';
    cancelBtn.style.display = 'none';
    ['radarShooting','radarSurvival','radarCoop','radarObjective','radarVehicle'].forEach(id => {
      document.getElementById(id).value = 50;
    });
    updatePreview();
  }

  function editSeason(id) {
    const seasons = window.dfApp.getData('seasonStats') || window.dfApp.DEFAULT_DATA.seasonStats;
    const item = seasons.find(s => s.id === id);
    if (!item) return;

    idField.value = id;
    document.getElementById('seasonName').value  = item.seasonName || '';
    document.getElementById('adKpm').value       = item.adStats      ? item.adStats.kpm      : '';
    document.getElementById('adSpm').value       = item.adStats      ? item.adStats.spm      : '';
    document.getElementById('vuKpm').value       = item.victoryUnite ? item.victoryUnite.kpm  : '';
    document.getElementById('vuSpm').value       = item.victoryUnite ? item.victoryUnite.spm  : '';
    const r = item.radarChart || {};
    document.getElementById('radarShooting').value  = r.shooting  || 0;
    document.getElementById('radarSurvival').value  = r.survival  || 0;
    document.getElementById('radarCoop').value      = r.coop      || 0;
    document.getElementById('radarObjective').value = r.objective || 0;
    document.getElementById('radarVehicle').value   = r.vehicle   || 0;
    updatePreview();
    document.getElementById('seasonFormTitle').textContent  = 'Edit Season';
    document.getElementById('seasonSubmitText').textContent = 'Update Season';
    cancelBtn.style.display = 'inline-flex';
    document.getElementById('section-seasonStats').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function deleteSeason(id) {
    if (!confirm('Delete this season? This action cannot be undone.')) return;
    let seasons = window.dfApp.getData('seasonStats') || window.dfApp.DEFAULT_DATA.seasonStats;
    seasons = seasons.filter(s => s.id !== id);
    saveData('seasonStats', seasons);
    renderList();
    showAdminToast('Season deleted.');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const seasonName  = document.getElementById('seasonName').value.trim();
    if (!seasonName) return;

    const entry = {
      seasonName,
      adStats: {
        kpm: parseFloat(document.getElementById('adKpm').value) || 0,
        spm: parseFloat(document.getElementById('adSpm').value) || 0
      },
      victoryUnite: {
        kpm: parseFloat(document.getElementById('vuKpm').value) || 0,
        spm: parseFloat(document.getElementById('vuSpm').value) || 0
      },
      radarChart: getRadarValues()
    };

    let seasons  = window.dfApp.getData('seasonStats') || window.dfApp.DEFAULT_DATA.seasonStats;
    const existingId = idField.value;

    if (existingId) {
      seasons = seasons.map(s => s.id === existingId ? { ...s, ...entry } : s);
      showAdminToast('Season updated successfully!');
    } else {
      seasons.push({ id: generateId(), ...entry });
      showAdminToast('Season added successfully!');
    }

    saveData('seasonStats', seasons);
    renderList();
    resetForm();
  });

  cancelBtn.addEventListener('click', resetForm);
  renderList();
}

/* ── CLIPS MANAGEMENT ────────────────────────────────────── */
function initClipsManager() {
  const form      = document.getElementById('clipForm');
  const cancelBtn = document.getElementById('clipCancelBtn');
  const idField   = document.getElementById('clipId');
  if (!form) return;

  function renderList() {
    const clips = window.dfApp.getData('clips') || window.dfApp.DEFAULT_DATA.clips;
    const list  = document.getElementById('clipList');
    if (!list) return;

    if (!clips || clips.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;text-align:center;padding:1rem;">No clips yet. Add one above.</p>';
      return;
    }

    list.innerHTML = clips.map(c => {
      const platformIcon = c.platform === 'tiktok' ? 'fab fa-tiktok' : 'fab fa-youtube';
      return `
        <div class="admin-list-item ${c.visible ? '' : 'hidden-item'}" data-id="${c.id}">
          <div class="admin-list-item-info">
            <div class="admin-list-item-title">
              <i class="${platformIcon}"></i>
              ${window.dfApp.escHtml(c.title)}
            </div>
            <div class="admin-list-item-sub">${window.dfApp.escHtml(c.embedUrl)}</div>
          </div>
          <div class="admin-list-item-actions">
            <span class="visibility-badge ${c.visible ? 'visible' : 'hidden'}">
              <i class="fas fa-${c.visible ? 'eye' : 'eye-slash'}"></i>
              ${c.visible ? 'Visible' : 'Hidden'}
            </span>
            <button class="btn btn-outline btn-sm toggle-clip-btn" data-id="${c.id}" title="Toggle Visibility">
              <i class="fas fa-${c.visible ? 'eye-slash' : 'eye'}"></i>
            </button>
            <button class="btn btn-outline btn-sm edit-clip-btn" data-id="${c.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger btn-sm delete-clip-btn" data-id="${c.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>`;
    }).join('');

    list.querySelectorAll('.toggle-clip-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleClipVisibility(btn.dataset.id));
    });
    list.querySelectorAll('.edit-clip-btn').forEach(btn => {
      btn.addEventListener('click', () => editClip(btn.dataset.id));
    });
    list.querySelectorAll('.delete-clip-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteClip(btn.dataset.id));
    });
  }

  function resetForm() {
    form.reset();
    idField.value = '';
    document.getElementById('clipFormTitle').textContent  = 'Add New Clip';
    document.getElementById('clipSubmitText').textContent = 'Add Clip';
    cancelBtn.style.display = 'none';
  }

  function editClip(id) {
    const clips = window.dfApp.getData('clips') || window.dfApp.DEFAULT_DATA.clips;
    const item = clips.find(c => c.id === id);
    if (!item) return;

    idField.value = id;
    document.getElementById('clipTitle').value    = item.title    || '';
    document.getElementById('clipEmbedUrl').value = item.embedUrl || '';
    document.getElementById('clipPlatform').value = item.platform || 'youtube';
    document.getElementById('clipFormTitle').textContent  = 'Edit Clip';
    document.getElementById('clipSubmitText').textContent = 'Update Clip';
    cancelBtn.style.display = 'inline-flex';
    document.getElementById('section-clips').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleClipVisibility(id) {
    let clips = window.dfApp.getData('clips') || window.dfApp.DEFAULT_DATA.clips;
    clips = clips.map(c => c.id === id ? { ...c, visible: !c.visible } : c);
    saveData('clips', clips);
    renderList();
    const updated = clips.find(c => c.id === id);
    showAdminToast(`Clip ${updated.visible ? 'shown' : 'hidden'} on public site.`);
  }

  function deleteClip(id) {
    if (!confirm('Delete this clip? This action cannot be undone.')) return;
    let clips = window.dfApp.getData('clips') || window.dfApp.DEFAULT_DATA.clips;
    clips = clips.filter(c => c.id !== id);
    saveData('clips', clips);
    renderList();
    showAdminToast('Clip deleted.');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const title    = document.getElementById('clipTitle').value.trim();
    const embedUrl = document.getElementById('clipEmbedUrl').value.trim();
    const platform = document.getElementById('clipPlatform').value;
    if (!title || !embedUrl) return;

    let clips = window.dfApp.getData('clips') || window.dfApp.DEFAULT_DATA.clips;
    const existingId = idField.value;

    if (existingId) {
      clips = clips.map(c => c.id === existingId ? { ...c, title, embedUrl, platform } : c);
      showAdminToast('Clip updated successfully!');
    } else {
      clips.push({ id: generateId(), title, embedUrl, platform, visible: true });
      showAdminToast('Clip added successfully!');
    }

    saveData('clips', clips);
    renderList();
    resetForm();
  });

  cancelBtn.addEventListener('click', resetForm);
  renderList();
}

/* ── TESTIMONIALS MANAGEMENT ─────────────────────────────── */
function initTestimonialsManager() {
  const form      = document.getElementById('testimonialForm');
  const cancelBtn = document.getElementById('testimonialCancelBtn');
  const idField   = document.getElementById('testimonialId');
  if (!form) return;

  function renderList() {
    const testimonials = window.dfApp.getData('testimonials') || window.dfApp.DEFAULT_DATA.testimonials;
    const list = document.getElementById('testimonialList');
    if (!list) return;

    if (!testimonials || testimonials.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;text-align:center;padding:1rem;">No testimonials yet. Add one above.</p>';
      return;
    }

    list.innerHTML = testimonials.map(t => `
      <div class="admin-list-item ${t.visible ? '' : 'hidden-item'}" data-id="${t.id}">
        <div class="admin-list-item-info">
          <div class="admin-list-item-title">
            ${window.dfApp.escHtml(t.senderName)}
            ${t.censored ? '<span class="admin-tag">Censored</span>' : ''}
          </div>
          <div class="admin-list-item-sub">${window.dfApp.escHtml(t.message)}</div>
        </div>
        <div class="admin-list-item-actions">
          <span class="visibility-badge ${t.visible ? 'visible' : 'hidden'}">
            <i class="fas fa-${t.visible ? 'eye' : 'eye-slash'}"></i>
            ${t.visible ? 'Visible' : 'Hidden'}
          </span>
          <button class="btn btn-outline btn-sm toggle-test-btn" data-id="${t.id}" title="Toggle Visibility">
            <i class="fas fa-${t.visible ? 'eye-slash' : 'eye'}"></i>
          </button>
          <button class="btn btn-outline btn-sm edit-test-btn" data-id="${t.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm delete-test-btn" data-id="${t.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.toggle-test-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleTestimonialVisibility(btn.dataset.id));
    });
    list.querySelectorAll('.edit-test-btn').forEach(btn => {
      btn.addEventListener('click', () => editTestimonial(btn.dataset.id));
    });
    list.querySelectorAll('.delete-test-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteTestimonial(btn.dataset.id));
    });
  }

  function resetForm() {
    form.reset();
    idField.value = '';
    document.getElementById('testimonialFormTitle').textContent  = 'Add New Testimonial';
    document.getElementById('testimonialSubmitText').textContent = 'Add Testimonial';
    cancelBtn.style.display = 'none';
  }

  function editTestimonial(id) {
    const testimonials = window.dfApp.getData('testimonials') || window.dfApp.DEFAULT_DATA.testimonials;
    const item = testimonials.find(t => t.id === id);
    if (!item) return;

    idField.value = id;
    document.getElementById('testimonialSenderName').value = item.senderName || '';
    document.getElementById('testimonialMessage').value    = item.message    || '';
    document.getElementById('testimonialCensored').checked = !!item.censored;
    document.getElementById('testimonialFormTitle').textContent  = 'Edit Testimonial';
    document.getElementById('testimonialSubmitText').textContent = 'Update Testimonial';
    cancelBtn.style.display = 'inline-flex';
    document.getElementById('section-testimonials').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleTestimonialVisibility(id) {
    let testimonials = window.dfApp.getData('testimonials') || window.dfApp.DEFAULT_DATA.testimonials;
    testimonials = testimonials.map(t => t.id === id ? { ...t, visible: !t.visible } : t);
    saveData('testimonials', testimonials);
    renderList();
    const updated = testimonials.find(t => t.id === id);
    showAdminToast(`Testimonial ${updated.visible ? 'shown' : 'hidden'} on public site.`);
  }

  function deleteTestimonial(id) {
    if (!confirm('Delete this testimonial? This action cannot be undone.')) return;
    let testimonials = window.dfApp.getData('testimonials') || window.dfApp.DEFAULT_DATA.testimonials;
    testimonials = testimonials.filter(t => t.id !== id);
    saveData('testimonials', testimonials);
    renderList();
    showAdminToast('Testimonial deleted.');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const senderName = document.getElementById('testimonialSenderName').value.trim();
    const message    = document.getElementById('testimonialMessage').value.trim();
    const censored   = document.getElementById('testimonialCensored').checked;
    if (!senderName || !message) return;

    let testimonials = window.dfApp.getData('testimonials') || window.dfApp.DEFAULT_DATA.testimonials;
    const existingId = idField.value;

    if (existingId) {
      testimonials = testimonials.map(t => t.id === existingId ? { ...t, senderName, message, censored } : t);
      showAdminToast('Testimonial updated successfully!');
    } else {
      testimonials.push({ id: generateId(), senderName, message, censored, visible: true });
      showAdminToast('Testimonial added successfully!');
    }

    saveData('testimonials', testimonials);
    renderList();
    resetForm();
  });

  cancelBtn.addEventListener('click', resetForm);
  renderList();
}

/* ── INIT ALL ────────────────────────────────────────────── */
function initAdminApp() {
  initSidebarNav();
  initLoadoutManager();
  initSettingsManager();
  initAchievementManager();
  initPcSpecsManager();
  initProfileManager();
  initSocialManager();
  initStatsManager();
  initSeasonStatsManager();
  initClipsManager();
  initTestimonialsManager();
}

/* ── BOOT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});
