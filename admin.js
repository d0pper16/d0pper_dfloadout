/* ============================================================
   admin.js — D0PPER. Admin Panel Logic
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

/* ── LOADOUT MANAGEMENT (new structure) ──────────────────── */
function initLoadoutManager() {
  const form       = document.getElementById('loadoutForm');
  const cancelBtn  = document.getElementById('loadoutCancelBtn');
  const idField    = document.getElementById('loadoutId');
  const addBuildBtn = document.getElementById('addBuildBtn');
  const buildsContainer = document.getElementById('buildsContainer');

  if (!form) return;

  function getBuildRows() {
    return Array.from(buildsContainer.querySelectorAll('.build-row'));
  }

  function addBuildRow(buildType = '', code = '') {
    const rows = getBuildRows();
    if (rows.length >= 5) {
      showAdminToast('Maximum 5 builds per weapon.', 'error');
      return;
    }
    const rowId = generateId();
    const row = document.createElement('div');
    row.className = 'build-row';
    row.dataset.rowId = rowId;
    row.innerHTML = `
      <div class="form-row build-row-inner">
        <div class="form-group">
          <label class="label-sm">Build Type</label>
          <input type="text" class="build-type-input" list="buildTypeList"
            placeholder="e.g. Build Stability" value="${window.dfApp.escHtml(buildType)}" />
        </div>
        <div class="form-group" style="flex:2;">
          <label class="label-sm">Code</label>
          <input type="text" class="build-code-input" placeholder="Paste loadout code here..."
            value="${window.dfApp.escHtml(code)}" />
        </div>
        <div class="form-group" style="max-width:50px;display:flex;align-items:flex-end;padding-bottom:.1rem;">
          <button type="button" class="btn btn-danger btn-sm remove-build-btn" title="Remove">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>`;
    row.querySelector('.remove-build-btn').addEventListener('click', () => row.remove());
    buildsContainer.appendChild(row);
  }

  if (addBuildBtn) {
    addBuildBtn.addEventListener('click', () => addBuildRow());
  }

  function renderList() {
    const loadouts = window.dfApp.getData('loadouts') || window.dfApp.DEFAULT_DATA.loadouts;
    const list     = document.getElementById('loadoutList');
    if (!list) return;

    if (loadouts.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;text-align:center;padding:1rem;">No weapons yet. Add one above.</p>';
      return;
    }

    list.innerHTML = loadouts.map(l => {
      const catTag  = l.category ? `<span class="admin-tag">${window.dfApp.escHtml(l.category)}</span>` : '';
      const favTag  = l.favorite ? `<span class="admin-tag featured-tag">⭐ Favorite</span>` : '';
      const buildCount = (l.builds && l.builds.length) ? l.builds.length : 0;
      return `
        <div class="admin-list-item" data-id="${l.id}">
          <div class="admin-list-item-info">
            <div class="admin-list-item-title">${window.dfApp.escHtml(l.weaponName || '—')} ${catTag} ${favTag}</div>
            <div class="admin-list-item-meta">${buildCount} build${buildCount !== 1 ? 's' : ''}</div>
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
    buildsContainer.innerHTML = '';
    document.getElementById('loadoutFormTitle').textContent  = 'Add New Weapon';
    document.getElementById('loadoutSubmitText').textContent = 'Add Weapon';
    cancelBtn.style.display = 'none';
  }

  function editLoadout(id) {
    const loadouts = window.dfApp.getData('loadouts') || window.dfApp.DEFAULT_DATA.loadouts;
    const item = loadouts.find(l => l.id === id);
    if (!item) return;

    idField.value = id;
    document.getElementById('loadoutWeaponName').value  = item.weaponName  || '';
    document.getElementById('loadoutCategory').value    = item.category    || '';
    document.getElementById('loadoutFavorite').checked  = !!item.favorite;

    buildsContainer.innerHTML = '';
    if (item.builds && item.builds.length > 0) {
      item.builds.forEach(b => addBuildRow(b.buildType || '', b.code || ''));
    }

    document.getElementById('loadoutFormTitle').textContent  = 'Edit Weapon';
    document.getElementById('loadoutSubmitText').textContent = 'Update Weapon';
    cancelBtn.style.display = 'inline-flex';
    document.getElementById('section-loadouts').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function deleteLoadout(id) {
    if (!confirm('Delete this weapon and all its builds? This action cannot be undone.')) return;
    let loadouts = window.dfApp.getData('loadouts') || window.dfApp.DEFAULT_DATA.loadouts;
    loadouts = loadouts.filter(l => l.id !== id);
    saveData('loadouts', loadouts);
    renderList();
    showAdminToast('Weapon deleted.');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const weaponName = document.getElementById('loadoutWeaponName').value.trim();
    const category   = document.getElementById('loadoutCategory').value.trim();
    const favorite   = document.getElementById('loadoutFavorite').checked;
    if (!weaponName) return;

    const builds = getBuildRows().map(row => ({
      id:        generateId(),
      buildType: row.querySelector('.build-type-input').value.trim(),
      code:      row.querySelector('.build-code-input').value.trim()
    })).filter(b => b.buildType || b.code);

    let loadouts = window.dfApp.getData('loadouts') || window.dfApp.DEFAULT_DATA.loadouts;
    const existingId = idField.value;

    if (existingId) {
      loadouts = loadouts.map(l => l.id === existingId
        ? { ...l, weaponName, category, favorite, builds }
        : l
      );
      showAdminToast('Weapon updated successfully!');
    } else {
      loadouts.push({ id: generateId(), weaponName, category, favorite, builds });
      showAdminToast('Weapon added successfully!');
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

  if (!form) return;

  let pendingPhotos = [];

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
        reader.onload = e => { pendingPhotos.push(e.target.result); renderPhotoPreview(); };
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
      list.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;text-align:center;padding:1rem;">No achievements yet.</p>';
      return;
    }

    list.innerHTML = achievements.map(a => `
      <div class="admin-list-item ${a.visible ? '' : 'hidden-item'}" data-id="${a.id}">
        <div class="admin-list-item-info">
          <div class="admin-list-item-title">${window.dfApp.escHtml(a.placement || '—')} — ${window.dfApp.escHtml(a.tournament || '')}</div>
          <div class="admin-list-item-meta">${window.dfApp.escHtml(a.monthYear || '')}${a.team ? ' · ' + window.dfApp.escHtml(a.team) : ''}</div>
          ${(a.photos && a.photos.length) ? `<div class="admin-list-item-meta"><i class="fas fa-image"></i> ${a.photos.length} photo(s)</div>` : ''}
        </div>
        <div class="admin-list-item-actions">
          <span class="visibility-badge ${a.visible ? 'visible' : 'hidden'}">
            <i class="fas fa-${a.visible ? 'eye' : 'eye-slash'}"></i> ${a.visible ? 'Visible' : 'Hidden'}
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
      </div>`).join('');

    list.querySelectorAll('.toggle-ach-btn').forEach(btn => btn.addEventListener('click', () => toggleAchievementVisibility(btn.dataset.id)));
    list.querySelectorAll('.edit-ach-btn').forEach(btn => btn.addEventListener('click', () => editAchievement(btn.dataset.id)));
    list.querySelectorAll('.delete-ach-btn').forEach(btn => btn.addEventListener('click', () => deleteAchievement(btn.dataset.id)));
  }

  function resetForm() {
    form.reset(); idField.value = ''; pendingPhotos = []; renderPhotoPreview();
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
    if (!confirm('Delete this achievement?')) return;
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
      achievements = achievements.map(a => a.id === existingId ? { ...a, placement, tournament, monthYear, team, description, photos } : a);
      showAdminToast('Achievement updated successfully!');
    } else {
      achievements.push({ id: generateId(), placement, tournament, monthYear, team, description, photos, visible: true });
      showAdminToast('Achievement added successfully!');
    }

    saveData('achievements', achievements);
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

    if (clips.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;text-align:center;padding:1rem;">No clips yet.</p>';
      return;
    }

    list.innerHTML = clips.map(c => `
      <div class="admin-list-item ${c.visible ? '' : 'hidden-item'}" data-id="${c.id}">
        <div class="admin-list-item-info">
          <div class="admin-list-item-title">${window.dfApp.escHtml(c.title || 'Untitled')}</div>
          <div class="admin-list-item-meta" style="word-break:break-all;">${window.dfApp.escHtml(c.url || '')}</div>
        </div>
        <div class="admin-list-item-actions">
          <span class="visibility-badge ${c.visible ? 'visible' : 'hidden'}">
            <i class="fas fa-${c.visible ? 'eye' : 'eye-slash'}"></i> ${c.visible ? 'Visible' : 'Hidden'}
          </span>
          <button class="btn btn-outline btn-sm toggle-clip-btn" data-id="${c.id}">
            <i class="fas fa-${c.visible ? 'eye-slash' : 'eye'}"></i>
          </button>
          <button class="btn btn-outline btn-sm edit-clip-btn" data-id="${c.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm delete-clip-btn" data-id="${c.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>`).join('');

    list.querySelectorAll('.toggle-clip-btn').forEach(btn => btn.addEventListener('click', () => {
      let clips = window.dfApp.getData('clips') || window.dfApp.DEFAULT_DATA.clips;
      clips = clips.map(c => c.id === btn.dataset.id ? { ...c, visible: !c.visible } : c);
      saveData('clips', clips);
      renderList();
    }));
    list.querySelectorAll('.edit-clip-btn').forEach(btn => btn.addEventListener('click', () => {
      const clips = window.dfApp.getData('clips') || window.dfApp.DEFAULT_DATA.clips;
      const item  = clips.find(c => c.id === btn.dataset.id);
      if (!item) return;
      idField.value = item.id;
      document.getElementById('clipTitle').value = item.title || '';
      document.getElementById('clipUrl').value   = item.url   || '';
      document.getElementById('clipFormTitle').textContent  = 'Edit Clip';
      document.getElementById('clipSubmitText').textContent = 'Update Clip';
      cancelBtn.style.display = 'inline-flex';
      document.getElementById('section-clips').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    list.querySelectorAll('.delete-clip-btn').forEach(btn => btn.addEventListener('click', () => {
      if (!confirm('Delete this clip?')) return;
      let clips = window.dfApp.getData('clips') || window.dfApp.DEFAULT_DATA.clips;
      clips = clips.filter(c => c.id !== btn.dataset.id);
      saveData('clips', clips);
      renderList();
      showAdminToast('Clip deleted.');
    }));
  }

  function resetForm() {
    form.reset(); idField.value = '';
    document.getElementById('clipFormTitle').textContent  = 'Add New Clip';
    document.getElementById('clipSubmitText').textContent = 'Add Clip';
    cancelBtn.style.display = 'none';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('clipTitle').value.trim();
    const url   = document.getElementById('clipUrl').value.trim();
    if (!title || !url) return;

    let clips = window.dfApp.getData('clips') || window.dfApp.DEFAULT_DATA.clips;
    const existingId = idField.value;

    if (existingId) {
      clips = clips.map(c => c.id === existingId ? { ...c, title, url } : c);
      showAdminToast('Clip updated successfully!');
    } else {
      clips.push({ id: generateId(), title, url, visible: true });
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

    if (testimonials.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;text-align:center;padding:1rem;">No testimonials yet.</p>';
      return;
    }

    list.innerHTML = testimonials.map(t => {
      const censorTag = t.censorName ? '<span class="admin-tag">Censored</span>' : '';
      return `
        <div class="admin-list-item ${t.visible ? '' : 'hidden-item'}" data-id="${t.id}">
          <div class="admin-list-item-info">
            <div class="admin-list-item-title">${window.dfApp.escHtml(t.name || 'Anonymous')} ${censorTag}</div>
            <div class="admin-list-item-meta">${window.dfApp.escHtml((t.message || '').slice(0, 80))}${(t.message || '').length > 80 ? '…' : ''}</div>
          </div>
          <div class="admin-list-item-actions">
            <span class="visibility-badge ${t.visible ? 'visible' : 'hidden'}">
              <i class="fas fa-${t.visible ? 'eye' : 'eye-slash'}"></i> ${t.visible ? 'Visible' : 'Hidden'}
            </span>
            <button class="btn btn-outline btn-sm toggle-test-btn" data-id="${t.id}">
              <i class="fas fa-${t.visible ? 'eye-slash' : 'eye'}"></i>
            </button>
            <button class="btn btn-outline btn-sm edit-test-btn" data-id="${t.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger btn-sm delete-test-btn" data-id="${t.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>`;
    }).join('');

    list.querySelectorAll('.toggle-test-btn').forEach(btn => btn.addEventListener('click', () => {
      let testimonials = window.dfApp.getData('testimonials') || window.dfApp.DEFAULT_DATA.testimonials;
      testimonials = testimonials.map(t => t.id === btn.dataset.id ? { ...t, visible: !t.visible } : t);
      saveData('testimonials', testimonials);
      renderList();
    }));
    list.querySelectorAll('.edit-test-btn').forEach(btn => btn.addEventListener('click', () => {
      const testimonials = window.dfApp.getData('testimonials') || window.dfApp.DEFAULT_DATA.testimonials;
      const item = testimonials.find(t => t.id === btn.dataset.id);
      if (!item) return;
      idField.value = item.id;
      document.getElementById('testimonialName').value    = item.name    || '';
      document.getElementById('testimonialMessage').value = item.message || '';
      document.getElementById('testimonialCensor').checked = !!item.censorName;
      document.getElementById('testimonialFormTitle').textContent  = 'Edit Testimonial';
      document.getElementById('testimonialSubmitText').textContent = 'Update Testimonial';
      cancelBtn.style.display = 'inline-flex';
      document.getElementById('section-testimonials').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    list.querySelectorAll('.delete-test-btn').forEach(btn => btn.addEventListener('click', () => {
      if (!confirm('Delete this testimonial?')) return;
      let testimonials = window.dfApp.getData('testimonials') || window.dfApp.DEFAULT_DATA.testimonials;
      testimonials = testimonials.filter(t => t.id !== btn.dataset.id);
      saveData('testimonials', testimonials);
      renderList();
      showAdminToast('Testimonial deleted.');
    }));
  }

  function resetForm() {
    form.reset(); idField.value = '';
    document.getElementById('testimonialFormTitle').textContent  = 'Add New Testimonial';
    document.getElementById('testimonialSubmitText').textContent = 'Add Testimonial';
    cancelBtn.style.display = 'none';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name       = document.getElementById('testimonialName').value.trim();
    const message    = document.getElementById('testimonialMessage').value.trim();
    const censorName = document.getElementById('testimonialCensor').checked;
    if (!name || !message) return;

    let testimonials = window.dfApp.getData('testimonials') || window.dfApp.DEFAULT_DATA.testimonials;
    const existingId = idField.value;

    if (existingId) {
      testimonials = testimonials.map(t => t.id === existingId ? { ...t, name, message, censorName } : t);
      showAdminToast('Testimonial updated!');
    } else {
      testimonials.push({ id: generateId(), name, message, censorName, visible: true });
      showAdminToast('Testimonial added!');
    }

    saveData('testimonials', testimonials);
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

/* ── SKILL STATS MANAGEMENT ──────────────────────────────── */
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
            <button type="button" class="btn btn-danger btn-sm delete-stat-btn" title="Remove">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>`).join('');

    fieldsEl.querySelectorAll('.delete-stat-btn').forEach(btn => {
      btn.addEventListener('click', () => btn.closest('.stat-field-row').remove());
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
            <button type="button" class="btn btn-danger btn-sm delete-stat-btn" title="Remove">
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
  if (!form) return;

  function renderList() {
    const seasons = window.dfApp.getData('seasonStats') || window.dfApp.DEFAULT_DATA.seasonStats;
    const list    = document.getElementById('seasonList');
    if (!list) return;

    if (seasons.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;text-align:center;padding:1rem;">No seasons yet.</p>';
      return;
    }

    list.innerHTML = seasons.map(s => `
      <div class="admin-list-item" data-id="${s.id}">
        <div class="admin-list-item-info">
          <div class="admin-list-item-title">${window.dfApp.escHtml(s.season || '—')}</div>
          <div class="admin-list-item-meta">
            A/D: KPM ${Number(s.adKpm || 0).toFixed(2)} / SPM ${Number(s.adSpm || 0).toFixed(1)} &nbsp;|&nbsp;
            Victory: KPM ${Number(s.vuKpm || 0).toFixed(2)} / SPM ${Number(s.vuSpm || 0).toFixed(1)}
          </div>
        </div>
        <div class="admin-list-item-actions">
          <button class="btn btn-outline btn-sm edit-season-btn" data-id="${s.id}"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-sm delete-season-btn" data-id="${s.id}"><i class="fas fa-trash"></i></button>
        </div>
      </div>`).join('');

    list.querySelectorAll('.edit-season-btn').forEach(btn => btn.addEventListener('click', () => editSeason(btn.dataset.id)));
    list.querySelectorAll('.delete-season-btn').forEach(btn => btn.addEventListener('click', () => {
      if (!confirm('Delete this season?')) return;
      let seasons = window.dfApp.getData('seasonStats') || window.dfApp.DEFAULT_DATA.seasonStats;
      seasons = seasons.filter(s => s.id !== btn.dataset.id);
      saveData('seasonStats', seasons);
      renderList();
      showAdminToast('Season deleted.');
    }));
  }

  function resetForm() {
    form.reset(); idField.value = '';
    document.getElementById('seasonFormTitle').textContent  = 'Add New Season';
    document.getElementById('seasonSubmitText').textContent = 'Add Season';
    cancelBtn.style.display = 'none';
  }

  function editSeason(id) {
    const seasons = window.dfApp.getData('seasonStats') || window.dfApp.DEFAULT_DATA.seasonStats;
    const item    = seasons.find(s => s.id === id);
    if (!item) return;
    idField.value = id;
    document.getElementById('seasonName').value      = item.season  || '';
    document.getElementById('adKpm').value           = item.adKpm   || '';
    document.getElementById('adSpm').value           = item.adSpm   || '';
    document.getElementById('vuKpm').value           = item.vuKpm   || '';
    document.getElementById('vuSpm').value           = item.vuSpm   || '';
    const r = item.radar || {};
    document.getElementById('radarShooting').value   = r.shooting   || '';
    document.getElementById('radarSurvival').value   = r.survival   || '';
    document.getElementById('radarCoop').value       = r.coop       || '';
    document.getElementById('radarObjective').value  = r.objective  || '';
    document.getElementById('radarVehicle').value    = r.vehicle    || '';
    document.getElementById('seasonFormTitle').textContent  = 'Edit Season';
    document.getElementById('seasonSubmitText').textContent = 'Update Season';
    cancelBtn.style.display = 'inline-flex';
    document.getElementById('section-seasons').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function clampRadar(val) { return Math.min(100, Math.max(0, Number(val) || 0)); }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const season = document.getElementById('seasonName').value.trim();
    if (!season) return;

    const entry = {
      id:     idField.value || generateId(),
      season,
      adKpm:  parseFloat(document.getElementById('adKpm').value)  || 0,
      adSpm:  parseFloat(document.getElementById('adSpm').value)  || 0,
      vuKpm:  parseFloat(document.getElementById('vuKpm').value)  || 0,
      vuSpm:  parseFloat(document.getElementById('vuSpm').value)  || 0,
      radar: {
        shooting:  clampRadar(document.getElementById('radarShooting').value),
        survival:  clampRadar(document.getElementById('radarSurvival').value),
        coop:      clampRadar(document.getElementById('radarCoop').value),
        objective: clampRadar(document.getElementById('radarObjective').value),
        vehicle:   clampRadar(document.getElementById('radarVehicle').value)
      }
    };

    let seasons = window.dfApp.getData('seasonStats') || window.dfApp.DEFAULT_DATA.seasonStats;
    if (idField.value) {
      seasons = seasons.map(s => s.id === idField.value ? entry : s);
      showAdminToast('Season updated!');
    } else {
      seasons.push(entry);
      showAdminToast('Season added!');
    }

    saveData('seasonStats', seasons);
    renderList();
    resetForm();
  });

  cancelBtn.addEventListener('click', resetForm);
  renderList();
}

/* ── PROFILE MANAGEMENT ──────────────────────────────────── */
function initProfileManager() {
  const form = document.getElementById('profileForm');
  if (!form) return;

  let pendingPhoto = null;

  function loadProfile() {
    const p = window.dfApp.getData('profile') || window.dfApp.DEFAULT_DATA.profile;
    document.getElementById('profileCurrentIGN').value    = p.currentIGN    || p.nickname    || '';
    document.getElementById('profileCurrentTeam').value   = p.currentTeam   || '';
    document.getElementById('profileBirthplace').value    = p.birthplace    || '';
    document.getElementById('profileBirthdayDay').value   = p.birthdayDay   || '';
    const bdMonthEl = document.getElementById('profileBirthdayMonth');
    if (bdMonthEl) bdMonthEl.value = p.birthdayMonth || '';
    document.getElementById('profileRank').value          = p.rank          || '';
    document.getElementById('profileRegion').value        = p.region        || '';
    document.getElementById('profilePlayerId').value      = p.playerId      || '';
    document.getElementById('profilePlaystyle').value     = p.playstyle     || '';
    document.getElementById('profileBio').value           = p.bio           || '';

    pendingPhoto = p.displayPhoto || null;
    renderPhotoPreview();
  }

  function renderPhotoPreview() {
    const preview = document.getElementById('profilePhotoPreview');
    const removeBtn = document.getElementById('profilePhotoRemoveBtn');
    if (!preview) return;
    if (pendingPhoto) {
      preview.innerHTML = `<div class="photo-preview-item"><img src="${window.dfApp.escHtml(pendingPhoto)}" alt="Profile Photo" style="max-height:100px;" /></div>`;
      if (removeBtn) removeBtn.style.display = 'inline-flex';
    } else {
      preview.innerHTML = '<p style="font-size:.8rem;color:var(--text-muted);margin-top:.5rem;">No photo uploaded — silhouette placeholder will show.</p>';
      if (removeBtn) removeBtn.style.display = 'none';
    }
  }

  const photoInput = document.getElementById('profilePhoto');
  if (photoInput) {
    photoInput.addEventListener('change', () => {
      const file = photoInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => { pendingPhoto = e.target.result; renderPhotoPreview(); };
      reader.readAsDataURL(file);
      photoInput.value = '';
    });
  }

  const removeBtn = document.getElementById('profilePhotoRemoveBtn');
  if (removeBtn) {
    removeBtn.addEventListener('click', () => { pendingPhoto = null; renderPhotoPreview(); });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const existing = window.dfApp.getData('profile') || window.dfApp.DEFAULT_DATA.profile;
    const profile = {
      ...existing,
      currentIGN:    document.getElementById('profileCurrentIGN').value.trim(),
      nickname:      document.getElementById('profileCurrentIGN').value.trim(),
      currentTeam:   document.getElementById('profileCurrentTeam').value.trim(),
      birthplace:    document.getElementById('profileBirthplace').value.trim(),
      birthdayDay:   parseInt(document.getElementById('profileBirthdayDay').value, 10) || 0,
      birthdayMonth: document.getElementById('profileBirthdayMonth').value,
      displayPhoto:  pendingPhoto || '',
      rank:          document.getElementById('profileRank').value.trim(),
      region:        document.getElementById('profileRegion').value.trim(),
      playerId:      document.getElementById('profilePlayerId').value.trim(),
      playstyle:     document.getElementById('profilePlaystyle').value.trim(),
      bio:           document.getElementById('profileBio').value.trim()
    };
    saveData('profile', profile);
    showAdminToast('Profile saved successfully!');
  });

  loadProfile();
  initTeamHistoryManager();
}

/* ── TEAM HISTORY MANAGEMENT ─────────────────────────────── */
function initTeamHistoryManager() {
  const form      = document.getElementById('teamHistoryForm');
  const cancelBtn = document.getElementById('thCancelBtn');
  const idField   = document.getElementById('teamHistoryId');
  if (!form) return;

  function renderList() {
    const profile = window.dfApp.getData('profile') || window.dfApp.DEFAULT_DATA.profile;
    const history = Array.isArray(profile.teamHistory) ? profile.teamHistory : [];
    const list    = document.getElementById('teamHistoryList');
    if (!list) return;

    const sorted = [...history].sort((a, b) => {
      const ay = a.startYear || 0; const by = b.startYear || 0;
      return ay !== by ? by - ay : 0;
    });

    if (sorted.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;text-align:center;padding:1rem;">No team history yet.</p>';
      return;
    }

    list.innerHTML = sorted.map(th => {
      const start = `${th.startMonth || ''} ${th.startYear || ''}`.trim();
      const end   = th.isCurrent ? 'Sekarang' : `${th.endMonth || ''} ${th.endYear || ''}`.trim();
      const activeBadge = th.isCurrent ? '<span class="admin-tag featured-tag">ACTIVE</span>' : '';
      return `
        <div class="admin-list-item" data-id="${th.id}">
          <div class="admin-list-item-info">
            <div class="admin-list-item-title">${window.dfApp.escHtml(th.teamName || '—')} ${activeBadge}</div>
            <div class="admin-list-item-meta">${window.dfApp.escHtml(start)} — ${window.dfApp.escHtml(end)} · IGN: ${window.dfApp.escHtml(th.ign || '—')}</div>
          </div>
          <div class="admin-list-item-actions">
            <button class="btn btn-outline btn-sm edit-th-btn" data-id="${th.id}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-danger btn-sm delete-th-btn" data-id="${th.id}"><i class="fas fa-trash"></i></button>
          </div>
        </div>`;
    }).join('');

    list.querySelectorAll('.edit-th-btn').forEach(btn => btn.addEventListener('click', () => editEntry(btn.dataset.id)));
    list.querySelectorAll('.delete-th-btn').forEach(btn => btn.addEventListener('click', () => {
      if (!confirm('Delete this team history entry?')) return;
      const profile = window.dfApp.getData('profile') || window.dfApp.DEFAULT_DATA.profile;
      profile.teamHistory = (profile.teamHistory || []).filter(e => e.id !== btn.dataset.id);
      saveData('profile', profile);
      renderList();
      showAdminToast('Entry deleted.');
    }));
  }

  function resetForm() {
    form.reset(); idField.value = '';
    document.getElementById('teamHistoryFormTitle').textContent = 'Add Team History Entry';
    document.getElementById('thSubmitText').textContent         = 'Add Entry';
    cancelBtn.style.display = 'none';
  }

  function editEntry(id) {
    const profile = window.dfApp.getData('profile') || window.dfApp.DEFAULT_DATA.profile;
    const item    = (profile.teamHistory || []).find(e => e.id === id);
    if (!item) return;
    idField.value = id;
    document.getElementById('thTeamName').value    = item.teamName   || '';
    document.getElementById('thIgn').value         = item.ign        || '';
    document.getElementById('thStartMonth').value  = item.startMonth || '';
    document.getElementById('thStartYear').value   = item.startYear  || '';
    document.getElementById('thEndMonth').value    = item.endMonth   || '';
    document.getElementById('thEndYear').value     = item.endYear    || '';
    document.getElementById('thIsCurrent').checked = !!item.isCurrent;
    document.getElementById('teamHistoryFormTitle').textContent = 'Edit Team History Entry';
    document.getElementById('thSubmitText').textContent         = 'Update Entry';
    cancelBtn.style.display = 'inline-flex';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const teamName   = document.getElementById('thTeamName').value.trim();
    const ign        = document.getElementById('thIgn').value.trim();
    const startMonth = document.getElementById('thStartMonth').value;
    const startYear  = parseInt(document.getElementById('thStartYear').value, 10) || 0;
    const endMonth   = document.getElementById('thEndMonth').value;
    const endYear    = parseInt(document.getElementById('thEndYear').value, 10) || 0;
    const isCurrent  = document.getElementById('thIsCurrent').checked;
    if (!teamName || !ign) return;

    const profile = window.dfApp.getData('profile') || window.dfApp.DEFAULT_DATA.profile;
    if (!Array.isArray(profile.teamHistory)) profile.teamHistory = [];

    const entry = {
      id:         idField.value || generateId(),
      teamName, ign, startMonth, startYear,
      endMonth:   isCurrent ? '' : endMonth,
      endYear:    isCurrent ? 0  : endYear,
      isCurrent
    };

    if (idField.value) {
      profile.teamHistory = profile.teamHistory.map(e => e.id === idField.value ? entry : e);
      showAdminToast('Entry updated!');
    } else {
      profile.teamHistory.push(entry);
      showAdminToast('Entry added!');
    }

    saveData('profile', profile);
    renderList();
    resetForm();
  });

  cancelBtn.addEventListener('click', resetForm);
  renderList();
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

/* ── VISITOR COUNTER MANAGEMENT ──────────────────────────── */
function initVisitorCounterManager() {
  const form = document.getElementById('visitorForm');
  if (!form) return;

  function loadVisitor() {
    const baseCount = window.dfApp.getData('visitorBaseCount') || 0;
    const realViews = parseInt(localStorage.getItem('dfloadout_real_views') || '0', 10);
    const inputEl   = document.getElementById('visitorBaseCount');
    if (inputEl) inputEl.value = baseCount;
    const realEl  = document.getElementById('visitorRealCount');
    if (realEl)  realEl.textContent  = realViews.toLocaleString();
    const totalEl = document.getElementById('visitorTotalDisplay');
    if (totalEl) totalEl.textContent = (baseCount + realViews).toLocaleString();
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const baseCount = parseInt(document.getElementById('visitorBaseCount').value, 10) || 0;
    saveData('visitorBaseCount', baseCount);
    loadVisitor();
    showAdminToast('Visitor base count saved!');
  });

  const resetBtn = document.getElementById('resetVisitorBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!confirm('Reset real visit count to 0?')) return;
      localStorage.setItem('dfloadout_real_views', '0');
      loadVisitor();
      showAdminToast('Real visit count reset.');
    });
  }

  loadVisitor();
}

/* ── INIT ALL ────────────────────────────────────────────── */
function initAdminApp() {
  initSidebarNav();
  initLoadoutManager();
  initSettingsManager();
  initAchievementManager();
  initClipsManager();
  initTestimonialsManager();
  initPcSpecsManager();
  initStatsManager();
  initSeasonStatsManager();
  initProfileManager();
  initSocialManager();
  initVisitorCounterManager();
}

/* ── BOOT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});
