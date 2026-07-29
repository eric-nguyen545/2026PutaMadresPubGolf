// ============================================================
// PUTA MADRES PUB GOLF — site behavior
// ============================================================

// ---------------- Scorecard countdown gate ----------------
// The scorecard itself opens August 29, 2026, 2:00 PM Central Time.
// Central is UTC-5 in late August (daylight time), so this offset is exact
// regardless of what timezone the visitor's device is set to.
// The rest of the page (holes, teams, rules, etc.) is always visible —
// only the scorecard table is hidden behind this countdown.
const REVEAL_TIME = new Date('2026-08-29T14:00:00-05:00').getTime();

function unlockScorecard() {
  const gate = document.getElementById('scorecard-gate');
  if (!gate || !gate.classList.contains('is-locked')) return;
  gate.classList.add('fade-unlock');
  setTimeout(() => {
    gate.classList.remove('is-locked');
    gate.classList.remove('fade-unlock');
  }, 550);
}

function initScorecardCountdown() {
  const gate = document.getElementById('scorecard-gate');
  if (!gate) return;

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  function tick() {
    const diff = REVEAL_TIME - Date.now();
    if (diff <= 0) {
      unlockScorecard();
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

  if (Date.now() >= REVEAL_TIME) {
    unlockScorecard();
  } else {
    initScorecardCountdown();
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
  const PAR = { 1:4, 2:3, 3:5, 4:3, 5:5, 6:3, 7:4, 8:3, 9:4 };
  const HOLE_COUNT = 9;

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveState(state) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

  function applyScoreStyle(input, hole) {
    input.classList.remove('under-par','over-par','diff-1','diff-2','diff-3');
    const val = parseInt(input.value, 10);
    const par = PAR[Number(hole)];   // force numeric lookup, matches data-hole exactly
    if (isNaN(val) || par === undefined) return;

    const diff = val - par;          // negative = birdie/under, positive = bogey/over
    if (diff === 0) return;

    const clamped = Math.min(Math.abs(diff), 3);
    input.classList.add(diff < 0 ? 'under-par' : 'over-par', `diff-${clamped}`);
  }

  function unlockSecret(secretId) {
    const box = document.getElementById(secretId);
    if (!box) return;
    box.classList.add('show');
    const lockNote = document.getElementById(secretId + '-locked');
    if (lockNote) lockNote.style.display = 'none';
  }

  function checkSecretTriggers(state) {
    const triggers = { 3: 'secret-hole-4', 6: 'secret-hole-7' };
    Object.entries(triggers).forEach(([holeNum, secretId]) => {
      const anyFilled = Object.values(state).some(scores => {
        const v = parseInt(scores && scores[holeNum], 10);
        return !isNaN(v);
      });
      if (anyFilled) unlockSecret(secretId);
    });
  }

  function updateScorecard() {
    document.querySelectorAll('tr.player-row').forEach(row => {
      let total = 0, filled = 0;
      row.querySelectorAll('input[type="number"]').forEach(input => {
        const hole = input.dataset.hole;
        applyScoreStyle(input, hole);
        const v = parseInt(input.value, 10);
        if (!isNaN(v)) { total += v; filled++; }
      });
      row.querySelector('.total-cell').textContent = filled > 0 ? total : '—';
    });

    const teamResults = [];
    document.querySelectorAll('tr.team-total-row').forEach(row => {
        const team = row.dataset.team;
        let grand = 0, anyFilled = false;
        for (let h = 1; h <= HOLE_COUNT; h++) {
          const p1 = document.querySelector(`tr.player-row[data-team="${team}"][data-player="1"] input[data-hole="${h}"]`);
          const p2 = document.querySelector(`tr.player-row[data-team="${team}"][data-player="2"] input[data-hole="${h}"]`);
          const v1 = parseInt(p1.value, 10), v2 = parseInt(p2.value, 10);
          let sum = 0, has = false;
          if (!isNaN(v1)) { sum += v1; has = true; }
          if (!isNaN(v2)) { sum += v2; has = true; }
          row.querySelector(`.team-hole-total[data-hole="${h}"]`).textContent = has ? sum : '—';
          if (has) { grand += sum; anyFilled = true; }
        }
        row.querySelector('.team-total-cell').textContent = anyFilled ? grand : '—';
        row.classList.remove('leader');
        teamResults.push({ row, grand, anyFilled });
      });

    const inPlay = teamResults.filter(t => t.anyFilled);
    if (inPlay.length) {
      const min = Math.min(...inPlay.map(t => t.grand));
      inPlay.forEach(t => {
        if (t.grand === min) {
          t.row.classList.add('leader');
          const totalCell = t.row.querySelector('.team-total-cell');
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

  function initScorecard() {
    const state = loadState();

    document.querySelectorAll('tr.player-row').forEach(row => {
      const key = `${row.dataset.team}-p${row.dataset.player}`;
      const scores = state[key] || {};
      row.querySelectorAll('input[type="number"]').forEach(input => {
        const hole = input.dataset.hole;
        if (scores[hole] !== undefined && scores[hole] !== '') input.value = scores[hole];
      });
    });

    updateScorecard();
    checkSecretTriggers(state);

    document.querySelectorAll('tr.player-row input[type="number"]').forEach(input => {
      input.addEventListener('input', () => {
        const row = input.closest('tr.player-row');
        const key = `${row.dataset.team}-p${row.dataset.player}`;
        const hole = input.dataset.hole;
        const state = loadState();
        if (!state[key]) state[key] = {};

        if (input.value === '') {
          delete state[key][hole];
        } else {
          let v = parseInt(input.value, 10);
          if (isNaN(v)) v = 0;
          v = Math.max(0, Math.min(20, v));
          input.value = v;
          state[key][hole] = v;
        }

        saveState(state);
        updateScorecard();
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
        input.classList.remove('under-par','over-par','diff-1','diff-2','diff-3');
      });
      document.querySelectorAll('.secret-box.unlocked').forEach(box => box.classList.remove('show'));
      document.querySelectorAll('[id$="-locked"]').forEach(el => el.style.display = 'flex');
      updateScorecard();
    });
  }

  if (document.querySelectorAll('tr.player-row').length) initScorecard();

});
