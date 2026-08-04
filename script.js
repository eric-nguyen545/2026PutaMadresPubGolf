// ============================================================
// PUTA MADRES PUB GOLF — site behavior
// ============================================================

// ---------------- Team roster (single source of truth) ----------------
// Move players between teams, rename teams, or reorder here — both the
// roster cards and the scorecard rows are rendered from this array.
const TEAMS = [
  { id: 'team1', name: "[Insert Team Name Here]", players: [
      { id: 'p1', name: 'Michael', fullName: 'Michael Prosch', img: 'images/team1-michael.jpg' },
      { id: 'p2', name: 'Ethan',   fullName: 'Ethan Mus',      img: 'images/team1-ethan.jpg' },
  ]},
  { id: 'team2', name: "[Insert Team Name Here]", players: [
      { id: 'p1', name: 'Alex',  fullName: 'Alex Gamber', img: 'images/team3-alex.jpg' },
      { id: 'p2', name: 'Hogan', fullName: 'Hogan Sinjem',  img: 'images/team2-hogan.jpg' },
  ]},
  { id: 'team3', name: "[Insert Team Name Here]", players: [
      { id: 'p1', name: 'Cole',  fullName: 'Cole Bridson',    img: 'images/team2-cole.jpg' },
      { id: 'p2', name: 'Nolan', fullName: 'Nolan Peterson', img: 'images/team3-nolan.jpg' },
  ]},
  { id: 'team4', name: "[Insert Team Name Here]", players: [
      { id: 'p1', name: 'Colton', fullName: 'Colton Kayser', img: 'images/team4-colton.jpg' },
      { id: 'p2', name: 'Cullen', fullName: 'Cullen Mork',   img: 'images/team4-cullen.jpg' },
  ]},
  { id: 'team5', name: "[Insert Team Name Here]", players: [
      { id: 'p1', name: 'Eric',  fullName: 'Eric Nguyen',  img: 'images/team5-eric.jpg' },
      { id: 'p2', name: 'Riley', fullName: 'Riley Lamott', img: 'images/team5-riley.jpg' },
  ]},
];

const HOLE_COUNT = 9;
const PAR = { 1:4, 2:3, 3:4, 4:3, 5:5, 6:3, 7:5, 8:3, 9:4 };
const DRINK_MAX = { beer: 4, liquor: 4, dealer: 1 };
const DRINK_ICON = { beer: '🍺', liquor: '🥃', dealer: '🎲' };

// ---------------- Passwords (front-end only — not real security) ----------------
// Anyone who views source can read these. They exist to stop casual
// bumps/edits, not to protect anything sensitive. Change them freely.
const EDIT_PASSWORD = 'putagolf26';        // required to edit the live scorecard
const TEST_BYPASS_PASSWORD = 'caddie';     // unlocks the scorecard early, for testing

// ---------------- Firebase (optional — enables cross-device sync) ----------------
// Create a free project at https://console.firebase.google.com, enable
// "Realtime Database" (start in test mode so reads/writes are open), and
// paste your config below. Until you do, the scorecard still works fine —
// it just stays local to each device instead of syncing live.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAn0kqVeW2SlrDtwJ7cYVgC7LJA34ANr5k",
  authDomain: "putamadres-pub-golf.firebaseapp.com",
  databaseURL: "https://putamadres-pub-golf-default-rtdb.firebaseio.com",
  projectId: "putamadres-pub-golf",
};
const FIREBASE_PATH = 'putaMadresScorecard2026';

let fbRef = null;
try {
  if (window.firebase && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY') {
    firebase.initializeApp(FIREBASE_CONFIG);
    fbRef = firebase.database().ref(FIREBASE_PATH);
  }
} catch (e) {
  console.warn('Firebase not configured — scorecard will stay local to this device.', e);
  fbRef = null;
}

// ---------------- Scorecard countdown gate ----------------
// The scorecard itself opens August 29, 2026, 12:00 PM Central Time.
// Central is UTC-5 in late August (daylight time), so this offset is exact
// regardless of what timezone the visitor's device is set to.
// The rest of the page (holes, teams, rules, etc.) is always visible —
// only the scorecard table is hidden behind this countdown.
const REVEAL_TIME = new Date('2026-08-29T12:00:00-05:00').getTime();
const BYPASS_KEY = 'putaMadresScorecardBypass';

function isBypassed() {
  return sessionStorage.getItem(BYPASS_KEY) === 'true';
}

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
    if (isBypassed()) {
      unlockScorecard();
      clearInterval(timer);
      return;
    }
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

function initEarlyAccess() {
  const btn = document.getElementById('early-access-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const code = window.prompt('Early-access code:');
    if (code === null) return;
    if (code === TEST_BYPASS_PASSWORD) {
      sessionStorage.setItem(BYPASS_KEY, 'true');
      unlockScorecard();
    } else {
      window.alert('Nope — try again.');
    }
  });
}

// ---------------- Roster + scorecard rendering ----------------
function renderRoster() {
  const grid = document.getElementById('roster-grid');
  if (!grid) return;

  grid.innerHTML = TEAMS.map((team, i) => {
    const delayClass = i > 0 ? ` reveal-delay-${Math.min(i, 4)}` : '';
    const playersHtml = team.players.map((p, idx) => {
      const amp = idx > 0 ? '<span class="roster-amp">&amp;</span>' : '';
      return `${amp}
      <div class="roster-player">
        <img src="${p.img}" alt="${p.fullName}" loading="lazy">
        <span>${p.fullName}</span>
      </div>`;
    }).join('\n');

    return `
    <div class="roster-card reveal${delayClass}">
      <div class="roster-card-head">
        <div class="roster-num">${i + 1}</div>
        <span class="roster-team-label">${team.name}</span>
      </div>
      <div class="roster-card-players">
        ${playersHtml}
      </div>
    </div>`;
  }).join('\n');
}

function drinkTypeGroup(team, player, hole) {
  const types = ['beer', 'liquor', 'dealer'];
  const chips = types.map(t =>
    `<button type="button" class="drink-chip" data-type="${t}" data-team="${team}" data-player="${player}" data-hole="${hole}" title="${t}">${DRINK_ICON[t]}</button>`
  ).join('');
  return `<div class="drink-type-group">${chips}</div>`;
}

function renderScorecard() {
  const body = document.getElementById('scorecard-body');
  if (!body) return;

  let rowsHtml = '';

  TEAMS.forEach(team => {
    team.players.forEach((player, pIdx) => {
      let cells = '';
      for (let h = 1; h <= HOLE_COUNT; h++) {
        cells += `<td class="score-cell">
          <input type="number" min="0" max="20" data-hole="${h}" disabled>
          ${drinkTypeGroup(team.id, pIdx + 1, h)}
        </td>`;
      }
      rowsHtml += `<tr class="player-row" data-team="${team.id}" data-player="${pIdx + 1}">
        <td><span class="player-name">${player.name}</span><span class="player-drink-counts" data-team="${team.id}" data-player="${pIdx + 1}"></span></td>
        ${cells}
        <td class="total-cell">—</td>
      </tr>`;
    });

    let teamTotalCells = '';
    for (let h = 1; h <= HOLE_COUNT; h++) {
      teamTotalCells += `<td class="team-hole-total" data-hole="${h}">—</td>`;
    }
    rowsHtml += `<tr class="team-total-row" data-team="${team.id}">
      <td>${team.name} Total</td>
      ${teamTotalCells}
      <td class="total-cell team-total-cell">—</td>
    </tr>`;
  });

  body.innerHTML = rowsHtml;
}

// ---------------- Scorecard state + logic ----------------
const STORAGE_KEY = 'putaMadresScorecard2026';
let scorecardState = {};
let editUnlocked = false;

function loadLocalState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch (e) { return {}; }
}
function saveLocalState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function pushState(state) {
  saveLocalState(state);
  if (fbRef) {
    fbRef.set(state).catch(err => console.warn('Firebase sync failed, saved locally only.', err));
  }
}

function applyScoreStyle(input, hole) {
  input.classList.remove('under-par', 'over-par', 'diff-1', 'diff-2', 'diff-3');
  const val = parseInt(input.value, 10);
  const par = PAR[Number(hole)];
  if (isNaN(val) || par === undefined) return;
  const diff = val - par;
  if (diff === 0) return;
  const clamped = Math.min(Math.abs(diff), 3);
  input.classList.add(diff < 0 ? 'under-par' : 'over-par', `diff-${clamped}`);
}

function unlockSecret(secretId) {
  const box = document.getElementById(secretId);
  if (box) box.classList.add('show');
}

function checkSecretTriggers(state) {
  // Entering a score for the hole right before a hazard hole reveals its secret.
  // Hole 3 (Mackenzie Pub — Irish Car Bomb) unlocks after Hole 2 is scored.
  // Hole 6 (Killens — Water Hazard) unlocks after Hole 5 is scored.
  const triggers = { 2: 'secret-hole-3', 5: 'secret-hole-6' };
  Object.entries(triggers).forEach(([holeNum, secretId]) => {
    const anyFilled = Object.values(state).some(scores => {
      const v = parseInt(scores && scores[holeNum] && scores[holeNum].score, 10);
      return !isNaN(v);
    });
    if (anyFilled) unlockSecret(secretId);
  });
}

function drinkCounts(playerScores) {
  const counts = { beer: 0, liquor: 0, dealer: 0 };
  Object.values(playerScores || {}).forEach(entry => {
    if (entry && entry.type && counts[entry.type] !== undefined) counts[entry.type]++;
  });
  return counts;
}

function reorderTeamRows(sortedTeamIds) {
  const tbody = document.getElementById('scorecard-body');
  if (!tbody) return;

  const currentOrder = Array.from(tbody.querySelectorAll('tr.team-total-row')).map(r => r.dataset.team);
  const unchanged = currentOrder.length === sortedTeamIds.length &&
    currentOrder.every((id, i) => id === sortedTeamIds[i]);
  if (unchanged) return;

  sortedTeamIds.forEach(teamId => {
    tbody.querySelectorAll(`tr[data-team="${teamId}"]`).forEach(row => {
      tbody.appendChild(row); // moving an existing node relocates it; focus/state is preserved
    });
  });
}

function updateScorecard() {
  document.querySelectorAll('tr.player-row').forEach(row => {
    const team = row.dataset.team;
    const player = row.dataset.player;
    const key = `${team}-p${player}`;
    const playerScores = scorecardState[key] || {};

    let total = 0, filled = 0;
    row.querySelectorAll('input[type="number"]').forEach(input => {
      const hole = input.dataset.hole;
      const entry = playerScores[hole];
      const scoreVal = entry && entry.score !== undefined && entry.score !== null ? entry.score : '';
      if (document.activeElement !== input) input.value = scoreVal;
      applyScoreStyle(input, hole);
      const v = parseInt(scoreVal, 10);
      if (!isNaN(v)) { total += v; filled++; }
    });
    row.querySelector('.total-cell').textContent = filled > 0 ? total : '—';

    // Drink-type chip active states + disabling maxed-out types
    const counts = drinkCounts(playerScores);
    row.querySelectorAll('.drink-chip').forEach(chip => {
      const hole = chip.dataset.hole;
      const type = chip.dataset.type;
      const selected = playerScores[hole] && playerScores[hole].type === type;
      chip.classList.toggle('active', !!selected);
      const atMax = counts[type] >= DRINK_MAX[type] && !selected;
      chip.disabled = atMax || !editUnlocked;
      chip.classList.toggle('maxed', atMax);
    });

    const countsLabel = row.querySelector('.player-drink-counts');
    if (countsLabel) {
      countsLabel.textContent = ` 🍺${counts.beer}/${DRINK_MAX.beer} 🥃${counts.liquor}/${DRINK_MAX.liquor} 🎲${counts.dealer}/${DRINK_MAX.dealer}`;
    }
  });

  const teamResults = [];
  document.querySelectorAll('tr.team-total-row').forEach(row => {
    const team = row.dataset.team;
    let grand = 0, anyFilled = false;
    for (let h = 1; h <= HOLE_COUNT; h++) {
      const e1 = scorecardState[`${team}-p1`] && scorecardState[`${team}-p1`][h];
      const e2 = scorecardState[`${team}-p2`] && scorecardState[`${team}-p2`][h];
      let sum = 0, has = false;
      if (e1 && e1.score !== '' && e1.score !== undefined && e1.score !== null && !isNaN(parseInt(e1.score, 10))) { sum += parseInt(e1.score, 10); has = true; }
      if (e2 && e2.score !== '' && e2.score !== undefined && e2.score !== null && !isNaN(parseInt(e2.score, 10))) { sum += parseInt(e2.score, 10); has = true; }
      row.querySelector(`.team-hole-total[data-hole="${h}"]`).textContent = has ? sum : '—';
      if (has) { grand += sum; anyFilled = true; }
    }
    const totalCell = row.querySelector('.team-total-cell');
    totalCell.textContent = anyFilled ? grand : '—';
    row.classList.remove('leader');
    teamResults.push({ row, grand, anyFilled, totalCell });
  });

  const inPlay = teamResults.filter(t => t.anyFilled);
  if (inPlay.length) {
    const min = Math.min(...inPlay.map(t => t.grand));
    inPlay.forEach(t => {
      if (t.grand === min) {
        t.row.classList.add('leader');
        if (!t.totalCell.querySelector('.leader-tag')) {
          const tag = document.createElement('span');
          tag.className = 'leader-tag';
          tag.textContent = 'LEAD';
          t.totalCell.appendChild(tag);
        }
      }
    });
  }

  // Lowest total climbs to the top of the card; teams with no scores yet
  // stay put at the bottom in their original order.
  const sortedTeamIds = teamResults
    .map((t, i) => ({ id: t.row.dataset.team, sortKey: t.anyFilled ? t.grand : Infinity, i }))
    .sort((a, b) => a.sortKey - b.sortKey || a.i - b.i)
    .map(t => t.id);
  reorderTeamRows(sortedTeamIds);

  checkSecretTriggers(scorecardState);
}

function setEditMode(enabled) {
  editUnlocked = enabled;
  document.querySelectorAll('table.scorecard input[type="number"]').forEach(input => {
    input.disabled = !enabled;
  });
  const resetBtn = document.getElementById('reset-scorecard');
  if (resetBtn) resetBtn.disabled = !enabled;
  const editBtn = document.getElementById('edit-toggle-btn');
  if (editBtn) editBtn.textContent = enabled ? 'Lock Editing' : 'Enable Editing';
  const label = document.getElementById('edit-status-label');
  if (label) label.textContent = enabled ? '✏️ Editing enabled' : '🔒 View only';
  updateScorecard();
}

function initScorecardInteractivity() {
  if (!document.getElementById('scorecard-body')) return;

  // Score inputs
  document.querySelectorAll('table.scorecard input[type="number"]').forEach(input => {
    input.addEventListener('input', () => {
      const row = input.closest('tr.player-row');
      const key = `${row.dataset.team}-p${row.dataset.player}`;
      const hole = input.dataset.hole;
      if (!scorecardState[key]) scorecardState[key] = {};
      if (!scorecardState[key][hole]) scorecardState[key][hole] = {};

      if (input.value === '') {
        delete scorecardState[key][hole].score;
      } else {
        let v = parseInt(input.value, 10);
        if (isNaN(v)) v = 0;
        v = Math.max(0, Math.min(20, v));
        input.value = v;
        scorecardState[key][hole].score = v;
      }

      pushState(scorecardState);
      updateScorecard();
    });
  });

  // Drink-type chips
  document.querySelectorAll('.drink-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (!editUnlocked) return;
      const key = `${chip.dataset.team}-p${chip.dataset.player}`;
      const hole = chip.dataset.hole;
      const type = chip.dataset.type;
      if (!scorecardState[key]) scorecardState[key] = {};
      if (!scorecardState[key][hole]) scorecardState[key][hole] = {};

      const current = scorecardState[key][hole].type;
      if (current === type) {
        delete scorecardState[key][hole].type;
      } else {
        const counts = drinkCounts(scorecardState[key]);
        const atMax = counts[type] >= DRINK_MAX[type];
        if (atMax) return; // guarded visually too, but double check here
        scorecardState[key][hole].type = type;
      }

      pushState(scorecardState);
      updateScorecard();
    });
  });

  // Edit toggle
  const editBtn = document.getElementById('edit-toggle-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      if (editUnlocked) {
        setEditMode(false);
        return;
      }
      const pw = window.prompt('Password to edit the scorecard:');
      if (pw === null) return;
      if (pw === EDIT_PASSWORD) {
        localStorage.setItem('scorecardEditUnlocked', 'true');
        setEditMode(true);
      } else {
        window.alert('Wrong password.');
      }
    });
  }

  // Reset
  const resetBtn = document.getElementById('reset-scorecard');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!editUnlocked) return;
      const confirmed = window.confirm('Clear all scores and re-lock the caddie secrets for everyone? This cannot be undone.');
      if (!confirmed) return;
      scorecardState = {};
      pushState(scorecardState);
      document.querySelectorAll('.secret-box.unlocked').forEach(box => box.classList.remove('show'));
      updateScorecard();
    });
  }

  // Restore edit mode if this device already unlocked it before
  if (localStorage.getItem('scorecardEditUnlocked') === 'true') {
    setEditMode(true);
  } else {
    setEditMode(false);
  }
}

function initScorecardData() {
  scorecardState = loadLocalState();
  updateScorecard();

  if (fbRef) {
    fbRef.on('value', (snapshot) => {
      const remote = snapshot.val();
      if (remote) {
        scorecardState = remote;
        saveLocalState(scorecardState);
        updateScorecard();
      }
    });
  }
}

// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  renderRoster();
  renderScorecard();
  initScorecardInteractivity();
  initScorecardData();
  initEarlyAccess();

  if (Date.now() >= REVEAL_TIME || isBypassed()) {
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

});
