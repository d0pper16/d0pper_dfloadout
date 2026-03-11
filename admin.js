/* ============================================================
   admin.js — d0pper_dfloadout Admin Panel Logic
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
  const overlay  = document.getElementById('loginOverlay');
  const wrapper  = document.getElementById('adminWrapper');
  const form     = document.getElementById('loginForm');
  const errEl    = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');

  if (!overlay || !wrapper) return;

  // Check existing session
  if (checkSession()) {
    overlay.style.display = 'none';
    wrapper.style.display = 'block';
    initAdminApp();
    return;
  }

  // Login form submit
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

  // Logout
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
  const form       = document.getElementById('loadoutForm');
  const cancelBtn  = document.getElementById('loadoutCancelBtn');
  const idField    = document.getElementById('loadoutId');

  function renderList() {
    const loadouts = window.dfApp.getData('loadouts') || window.dfApp.DEFAULT_DATA.loadouts;
    const list     = document.getElementById('loadoutList');
    if (!list) return;

    if (loadouts.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;text-align:center;padding:1rem;">No loadouts yet. Add one above.</p>';
      return;
    }

    list.innerHTML = loadouts.map(l => `
      <div class="admin-list-item" data-id="${l.id}">
        <div class="admin-list-item-info">
          <div class="admin-list-item-title">${window.dfApp.escHtml(l.title)}</div>
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
      </div>
    `).join('');

    // Edit handlers
    list.querySelectorAll('.edit-loadout-btn').forEach(btn => {
      btn.addEventListener('click', () => editLoadout(btn.dataset.id));
    });

    // Delete handlers
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
    document.getElementById('loadoutTitle').value = item.title;
    document.getElementById('loadoutCode').value  = item.code;
    document.getElementById('loadoutFormTitle').textContent = 'Edit Loadout';
    document.getElementById('loadoutSubmitText').textContent = 'Update Loadout';
    cancelBtn.style.display = 'inline-flex';

    // Scroll to form
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
    const title = document.getElementById('loadoutTitle').value.trim();
    const code  = document.getElementById('loadoutCode').value.trim();
    if (!title || !code) return;

    let loadouts = window.dfApp.getData('loadouts') || window.dfApp.DEFAULT_DATA.loadouts;
    const existingId = idField.value;

    if (existingId) {
      // Update
      loadouts = loadouts.map(l => l.id === existingId ? { ...l, title, code } : l);
      showAdminToast('Loadout updated successfully!');
    } else {
      // Add
      loadouts.push({ id: generateId(), title, code });
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

  // Load existing values
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
          <div class="admin-list-item-title">${window.dfApp.escHtml(a.title)}</div>
          <div class="admin-list-item-meta">${window.dfApp.escHtml(a.description)}</div>
          ${a.date ? `<div class="admin-list-item-meta" style="margin-top:.15rem;"><i class="fas fa-calendar-alt" style="color:var(--text-muted)"></i> ${window.dfApp.escHtml(a.date)}</div>` : ''}
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
    idField.value = '';
    document.getElementById('achievementFormTitle').textContent = 'Add New Achievement';
    document.getElementById('achievementSubmitText').textContent = 'Add Achievement';
    cancelBtn.style.display = 'none';
  }

  function editAchievement(id) {
    const achievements = window.dfApp.getData('achievements') || window.dfApp.DEFAULT_DATA.achievements;
    const item = achievements.find(a => a.id === id);
    if (!item) return;

    idField.value = id;
    document.getElementById('achievementTitle').value = item.title;
    document.getElementById('achievementDesc').value  = item.description;
    document.getElementById('achievementDate').value  = item.date || '';
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
    const title       = document.getElementById('achievementTitle').value.trim();
    const description = document.getElementById('achievementDesc').value.trim();
    const date        = document.getElementById('achievementDate').value;
    if (!title || !description) return;

    let achievements = window.dfApp.getData('achievements') || window.dfApp.DEFAULT_DATA.achievements;
    const existingId = idField.value;

    if (existingId) {
      achievements = achievements.map(a => a.id === existingId ? { ...a, title, description, date } : a);
      showAdminToast('Achievement updated successfully!');
    } else {
      achievements.push({ id: generateId(), title, description, date, visible: true });
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

/* ── INIT ALL ────────────────────────────────────────────── */
function initAdminApp() {
  initSidebarNav();
  initLoadoutManager();
  initSettingsManager();
  initAchievementManager();
  initPcSpecsManager();
  initProfileManager();
}

/* ── BOOT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});
