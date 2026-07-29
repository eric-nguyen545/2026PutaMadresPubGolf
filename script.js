// ============================================================
// PUTA MADRES PUB GOLF — site behavior
// ============================================================

// ---------------- Countdown gate ----------------
// Course "opens" August 29, 2026, 2:00 PM Central Time.
// Central is UTC-5 in late August (daylight time), so this offset is exact
// regardless of what timezone the visitor's device is set to.

window.addEventListener("keydown", e => {

    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "p") {

        const password = prompt("Admin Password");

        if (password === ADMIN_PASSWORD) {

            sessionStorage.setItem("preview", "true");

            location.reload();

        } else if (password !== null) {

            alert("Incorrect password.");

        }

    }

});

const ADMIN_PASSWORD = "birdie2026";

const params = new URLSearchParams(window.location.search);

const previewMode =
    sessionStorage.getItem("preview") === "true" ||
    params.get("preview") === ADMIN_PASSWORD;
    
const REVEAL_TIME = new Date('2026-08-29T14:00:00-05:00').getTime();

function unlockSite() {
  document.body.classList.remove('is-locked');
  const overlay = document.getElementById('countdown-overlay');
  if (overlay && !overlay.classList.contains('fade-out')) {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 700);
  }
}

function initCountdown() {
  const overlay = document.getElementById('countdown-overlay');
  if (!overlay) return;

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  function tick() {
    const diff = REVEAL_TIME - Date.now();
    if (diff <= 0) {
      unlockSite();
      clearInterval(timer);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }

  tick();
  const timer = setInterval(tick, 1000);
}

document.addEventListener('DOMContentLoaded', () => {

  const unlocked =
    Date.now() >= REVEAL_TIME || previewMode;

  if (unlocked) {
      unlockSite();
  } else {
      initCountdown();
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-img');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------- Nav active-section highlight ---------------- */
  const navLinks = Array.from(document.querySelectorAll('.nav-link[data-target]'));
  const targets = navLinks
    .map(link => document.getElementById(link.dataset.target))
    .filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = navLinks.find(l => l.dataset.target === entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  targets.forEach(t => navObserver.observe(t));

  /* ---------------- Scorecard ---------------- */
  const STORAGE_KEY = 'putaMadresScorecard2026';
  const teamRows = document.querySelectorAll('table.scorecard tbody tr');
  const holeCount = 9;

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getState() {
    return loadState();
  }

  function updateTotalsAndLeader() {
    const state = getState();
    let rows = [];

    teamRows.forEach(row => {
      const teamId = row.dataset.team;
      const scores = state[teamId] || {};
      let total = 0;
      let filledCount = 0;
      for (let h = 1; h <= holeCount; h++) {
        const v = parseInt(scores[h], 10);
        if (!isNaN(v)) { total += v; filledCount++; }
      }
      const totalCell = row.querySelector('.total-cell');
      totalCell.textContent = filledCount > 0 ? total : '—';
      row.classList.remove('leader');
      rows.push({ row, total, filledCount });
    });

    // Determine leader: lowest total among rows with at least all holes filled at least once
    const inPlay = rows.filter(r => r.filledCount > 0);
    if (inPlay.length > 0) {
      const minTotal = Math.min(...inPlay.map(r => r.total));
      inPlay.forEach(r => {
        if (r.total === minTotal) {
          r.row.classList.add('leader');
          const totalCell = r.row.querySelector('.total-cell');
          if (!totalCell.querySelector('.leader-tag')) {
            const tag = document.createElement('span');
            tag.className = 'leader-tag';
            tag.textContent = 'LEAD';
            totalCell.appendChild(tag);
          }
        }
      });
    }
  }

  function unlockSecret(secretId) {
    const box = document.getElementById(secretId);
    if (!box) return;
    box.classList.add('show');
    const lockNote = document.getElementById(secretId + '-locked');
    if (lockNote) lockNote.style.display = 'none';
  }

  function checkSecretTriggers(state) {
    // Hole 3 filled (any team) -> unlock Hole 4 secret
    // Hole 6 filled (any team) -> unlock Hole 7 secret
    const triggers = { 3: 'secret-hole-4', 6: 'secret-hole-7' };
    Object.entries(triggers).forEach(([holeNum, secretId]) => {
      const anyFilled = Object.values(state).some(scores => {
        const v = parseInt(scores && scores[holeNum], 10);
        return !isNaN(v);
      });
      if (anyFilled) unlockSecret(secretId);
    });
  }

  function initScorecard() {
    const state = loadState();

    // populate inputs from saved state
    teamRows.forEach(row => {
      const teamId = row.dataset.team;
      const scores = state[teamId] || {};
      row.querySelectorAll('input[type="number"]').forEach(input => {
        const hole = input.dataset.hole;
        if (scores[hole] !== undefined && scores[hole] !== null && scores[hole] !== '') {
          input.value = scores[hole];
        }
      });
    });

    updateTotalsAndLeader();
    checkSecretTriggers(state);

    // listen for changes
    document.querySelectorAll('table.scorecard input[type="number"]').forEach(input => {
      input.addEventListener('input', () => {
        const row = input.closest('tr');
        const teamId = row.dataset.team;
        const hole = input.dataset.hole;
        const state = loadState();
        if (!state[teamId]) state[teamId] = {};

        if (input.value === '') {
          delete state[teamId][hole];
        } else {
          let v = parseInt(input.value, 10);
          if (isNaN(v)) v = 0;
          if (v < 0) v = 0;
          if (v > 20) v = 20;
          input.value = v;
          state[teamId][hole] = v;
        }

        saveState(state);
        updateTotalsAndLeader();
        checkSecretTriggers(state);
      });
    });
  }

  const resetBtn = document.getElementById('reset-scorecard');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const confirmed = window.confirm('Clear all scores and re-lock the caddie secrets? This cannot be undone.');
      if (!confirmed) return;
      localStorage.removeItem(STORAGE_KEY);
      document.querySelectorAll('table.scorecard input[type="number"]').forEach(input => {
        input.value = '';
      });
      document.querySelectorAll('.secret-box.unlocked').forEach(box => box.classList.remove('show'));
      document.querySelectorAll('[id$="-locked"]').forEach(el => el.style.display = 'flex');
      updateTotalsAndLeader();
    });
  }

  if (teamRows.length) initScorecard();

});
