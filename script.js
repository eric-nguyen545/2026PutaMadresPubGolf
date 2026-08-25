// ============================================================
// PUTA MADRES PUB GOLF — site behavior
// ============================================================

// ---------------- Team roster (single source of truth) ----------------
// Move players between teams, rename teams, or reorder here — both the
// roster cards and the scorecard rows are rendered from this array.
const TEAMS = [
  { id: 'team1', name: "Designated Drivers", players: [
      { id: 'p1', name: 'Michael', fullName: 'Michael Prosch', img: 'images/team1-michael.jpg' },
      { id: 'p2', name: 'Ethan',   fullName: 'Ethan Mus',      img: 'images/team1-ethan.jpg' },
  ]},
  { id: 'team2', name: "Grip It and Sip It", players: [
      { id: 'p1', name: 'Alex',  fullName: 'Alex Gamber', img: 'images/team3-alex.jpg' },
      { id: 'p2', name: 'Hogan', fullName: 'Hogan Sinjem',  img: 'images/team2-hogan.jpg' },
  ]},
  { id: 'team3', name: "Par-Tee Animals", players: [
      { id: 'p1', name: 'Cole',  fullName: 'Cole Bridson',    img: 'images/team2-cole.jpg' },
      { id: 'p2', name: 'Nolan', fullName: 'Nolan Peterson', img: 'images/team3-nolan.jpg' },
  ]},
  { id: 'team4', name: "Teed Up and Turnt", players: [
      { id: 'p1', name: 'Colton', fullName: 'Colton Kayser', img: 'images/team4-colton.jpg' },
      { id: 'p2', name: 'Cullen', fullName: 'Cullen Mork',   img: 'images/team4-cullen.jpg' },
  ]},
  { id: 'team5', name: "Shankaholics", players: [
      { id: 'p1', name: 'Eric',  fullName: 'Eric Nguyen',  img: 'images/team5-eric.jpg' },
      { id: 'p2', name: 'Riley', fullName: 'Riley Lamott', img: 'images/team5-riley.jpg' },
  ]},
];

// ---------------- Hole course (single source of truth) ----------------
// Move a hole to a new position, edit its drinks/links/par, or add a new
// hazard secret here — the hole sections AND the scorecard header/par row
// regenerate from this one array automatically. `unlockAfterHole` reveals
// a hazard's secret once every golfer has a score in for that earlier hole.
// `turnAfter: true` drops the Graze Food Hall "turn" section in right after
// that hole. `canned: true` flags a hole as canned-drinks-only on the
// scorecard header.
const HOLES = [
  {
    num: 1,
    name: 'Brit\'s Pub',
    par: 4,
    img: 'hole9.jpg',
    link: 'https://britspub.com/minneapolis-brit-s-pub-drink-menu',
    linkLabel: 'Brit\'s Pub Drink Menu',
    beer: ['Guinness Stout 4.2% ABV', 'Brit\'s ESB 6% ABV', 'Old Speckled Hen 5% ABV'],
    liquor: ['Brit\'s Gin & Tonic with Beefeater', 'Brit\'s Bootleg', 'The Brit\'s Ginger with Jameson'],
  },
  {
    num: 2,
    name: 'The Local',
    par: 3,
    img: 'hole8.jpg',
    link: 'https://thelocalminneapolis.com/beverage-menu/',
    linkLabel: 'The Local Beverages',
    beer: ['Guinness Stout 4.2% ABV', 'Smithwicks Red Ale 4.5% ABV', 'Harp Lager 5% ABV'],
    liquor: ['Ginger Locks', 'Irish Coffee', 'Local\'s Old Fashioned On Tap'],
  },
  {
    num: 3,
    name: 'Mackenzie Pub',
    par: 4,
    img: 'hole7.jpg',
    link: 'https://mackenziepub.com/minneapolis-theatre-district-mackenzie-pub-drink-menu',
    linkLabel: 'Mackenzie Pub Drink List',
    beer: ['805 Cerveza 4.5% ABV', 'This Beer Is NIIICE! 4.5% ABV', 'Deer Brand 4.7% ABV'],
    liquor: ['Blueberry Borealis 5.8% ABV', 'Magners Original Irish Cider 4.5% ABV', 'Mango Habanero 6% ABV'],
    note: 'Straight from the can - it cannot be poured into a glass. Canned drinks only at this hole.',
    secret: { id: 'secret-hole-3', titleFull: '💣 Caddie Secret - Bunker Shot', text: 'Every team owes one Irish Car Bomb here before moving on. Skip the drop shot and it\'s a 2-stroke penalty.' },
    unlockAfterHole: 2,
    canned: true,
  },
  {
    num: 4,
    name: 'Smorgies',
    par: 5,
    img: 'hole5.jpg',
    link: 'https://www.smorgiesbar.com/menu',
    linkLabel: 'Smorgies Menu',
    beer: ['Tap List', 'Is Unknown', 'But There are Canned Drinks'],
    liquor: ['Smorgies Hibiscus Spritz', 'Cucumber Cooler', 'Chelsea\'s Red Sangria'],
    bonus: { title: 'Earning the Par 5', text: 'To make this hole a true par five, each golfer must also take two shots.' },
  },
    {
    num: 5,
    name: 'Bassett Hound',
    par: 4,
    img: 'hole6.jpg',
    link: 'https://www.bassetthoundnlg.com/menu',
    linkLabel: 'Bassett Hound website',
    beer: ['Barrel Theory', 'Elm Creek Sour', 'MN Craft Beer Rotational'],
    liquor: ['Any Spritz', 'Minneapolis Mule', 'Far North Old Fashioned'],
    turnAfter: true,
  },
  {
    num: 6,
    name: 'Killens',
    par: 3,
    img: 'hole4.jpg',
    link: 'https://www.instagram.com/killens_irish_pub/?hl=en',
    linkLabel: 'Killens IG',
    beer: ['Guinness 4.2% ABV', 'Harp 4.5% ABV', 'Smithwick\'s Red Lager 4.8% ABV'],
    liquor: ['House Old Fashioned', 'Killen\'s House Margarita', 'House Manhattan'],
    secret: { id: 'secret-hole-6', titleFull: '🚱 Caddie Secret - Water Hazard', text: 'Killens is a certified water hazard. No peeing. Any golfer caught peeing takes a 2-stroke penalty.' },
    unlockAfterHole: 5,
  },
  {
    num: 7,
    name: 'Bricksworth',
    par: 5,
    img: 'hole3.jpg',
    link: 'https://www.bricksworthbeer.co/north-loop-drinks',
    linkLabel: 'Bricksworth Beer Co. Beer List',
    beer: ['Couplabeers 7% ABV', 'Naz Reid 7.5% ABV', 'Terms & Conditions 6.9% ABV'],
    liquor: ['Bricksworth Bootlegger', 'Space Cadet', 'Slushy Cocktails - Grape Ape or Ube Pina Colada'],
  },
  {
    num: 8,
    name: 'Cuzzy\'s',
    par: 3,
    img: 'hole2.jpg',
    link: 'https://cuzzys.com/beer-list/',
    linkLabel: 'Cuzzy\'s Beer List',
    beer: ['Castle Danger Cream Ale 5.5% ABV', 'Blue Moon 5.4% ABV', 'Bell\'s Evlipse 5.8% or 6.3% ABV'],
    liquor: ['No cocktail list', 'Highly recommend ordering', 'A beer *gasp*'],
  },
  {
    num: 9,
    name: 'Rabbit Hole',
    par: 4,
    img: 'hole1.jpg',
    link: 'https://www.therabbitholemn.com/menu',
    linkLabel: 'Rabbit Hole Menu',
    beer: ['Rabbit Hole Weiss 5.1% ABV', 'Beach Bum 4.2% ABV', 'Cane Fighter 6.3% ABV'],
    liquor: ['Rabbit Hole Mule', 'Rabbit Hole Paloma', 'Rabbit Hole Old Fashioned'],
  },
];

const HOLE_COUNT = HOLES.length;
const PAR = Object.fromEntries(HOLES.map(h => [h.num, h.par]));
const DRINK_MAX = { beer: 4, liquor: 4, dealer: 1 };
const DRINK_ICON = { beer: '🍺', liquor: '🥃', dealer: '🎲' };

// ---------------- Passwords (front-end only — not real security) ----------------
// Anyone who views source can read these. They exist to stop casual
// bumps/edits, not to protect anything sensitive. Change them freely.
const EDIT_PASSWORD = 'noBallsInH0les';        // required to edit the live scorecard
const TEST_BYPASS_PASSWORD = 'caddie';     // unlocks the scorecard early, for testing

// ---------------- Firebase (enables cross-device sync) ----------------
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAn0kqVeW2SlrDtwJ7cYVgC7LJA34ANr5k",
  authDomain: "putamadres-pub-golf.firebaseapp.com",
  databaseURL: "https://putamadres-pub-golf-default-rtdb.firebaseio.com",
  projectId: "putamadres-pub-golf",
};
const FIREBASE_PATH = 'putaMadresScorecard2026';

let fbRef = null;
let fbApp = null;
try {
  if (window.firebase && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY') {
    fbApp = firebase.initializeApp(FIREBASE_CONFIG);
    fbRef = firebase.database().ref(FIREBASE_PATH);
  }
} catch (e) {
  console.warn('Firebase not configured — scorecard will stay local to this device.', e);
  fbRef = null;
}

// ---------------- Sync status indicator ----------------
function initSyncStatus() {
  const el = document.getElementById('sync-status');
  if (!el) return;

  if (!fbRef) {
    el.textContent = '⚪ Local only (this device)';
    el.title = 'Firebase isn\'t configured — scores stay on this device only.';
    return;
  }

  const connectedRef = firebase.database().ref('.info/connected');
  connectedRef.on('value', (snap) => {
    if (snap.val() === true) {
      el.textContent = '🟢 Live sync';
      el.title = 'Connected — scores sync across every device viewing this page.';
    } else {
      el.textContent = '🟡 Reconnecting…';
      el.title = 'Not connected right now — edits save locally and will sync once back online.';
    }
  });
}

// ---------------- Scorecard countdown gate ----------------
// The scorecard itself opens August 29, 2026, 2:00 PM Central Time.
// Central is UTC-5 in late August (daylight time), so this offset is exact
// regardless of what timezone the visitor's device is set to.
// The rest of the page (holes, teams, rules, etc.) is always visible —
// only the scorecard table is hidden behind this countdown.
const REVEAL_TIME = new Date('2026-08-29T14:00:00-05:00').getTime();
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

// ---------------- Roster rendering ----------------
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

// ---------------- Hole section rendering ----------------
function drinkSlots(items) {
  const padded = items.concat([null, null, null]).slice(0, 3);
  return padded.map(item =>
    item ? `<li>${item}</li>` : `<li class="empty">—</li>`
  ).join('\n');
}

function holeSectionHtml(hole, position) {
  const isEven = position % 2 === 0;
  const sectionBg = isEven ? ' style="background:var(--white)"' : '';
  const cardFlip = isEven ? ' flip' : '';
  const numStr = String(hole.num).padStart(2, '0');

  const noteHtml = hole.note ? `        <p class="hole-note">${hole.note}</p>\n` : '';

  const bonusHtml = hole.bonus ? `        <div class="hole-bonus">
          <strong>${hole.bonus.title}</strong>
          ${hole.bonus.text}
        </div>\n` : '';

  const secretHtml = hole.secret ? `
          <div id="${hole.secret.id}" class="secret-box unlocked">
            <strong>${hole.secret.titleFull}</strong>
            ${hole.secret.text}
          </div>\n` : '';

  return `<!-- ============================================================
     HOLE ${hole.num} - ${hole.name}
     ============================================================ -->
<section id="hole-${hole.num}" class="hole-section"${sectionBg}>
  <div class="container">
    <div class="hole-card${cardFlip} reveal">
      <div class="hole-photo">
        <div class="hole-photo-num">${numStr}</div>
        <img src="images/${hole.img}" alt="${hole.name}" loading="lazy">
      </div>
      <div class="hole-body">
        <p class="hole-eyebrow">Hole ${hole.num} of ${HOLE_COUNT}${hole.canned ? ' · 🥫 Canned drinks only' : ''}</p>
        <h3 class="hole-name">${hole.name}</h3>
        <span class="hole-par">PAR ${hole.par}</span>
        <p class="hole-pour-label">The Pour</p>
        <div class="hole-drinks">
      <div class="hole-drinks-col">
        <p class="hole-drinks-label">🍺 Beer</p>
        <ul class="hole-drinks-slots">
${drinkSlots(hole.beer)}
        </ul>
      </div>
      <div class="hole-drinks-col">
        <p class="hole-drinks-label">🥃 Liquor</p>
        <ul class="hole-drinks-slots">
${drinkSlots(hole.liquor)}
        </ul>
      </div>
        </div>
${noteHtml}${bonusHtml}${secretHtml}
        <div class="hole-links">
          <a href="${hole.link}" class="placeholder-link"> ${hole.linkLabel}</a>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function turnSectionHtml(nextHole) {
  const nextText = nextHole ? `before teeing off on Hole ${nextHole.num}` : 'before the back nine';
  return `<!-- ============================================================
     THE TURN
     ============================================================ -->
<section id="turn" class="section-dark">
  <div class="container">
    <p class="eyebrow reveal">The Turn</p>
    <h2 class="section-title reveal">Graze Food Hall</h2>
    <p class="section-sub reveal">Food stop - refuel between the front and back nine ${nextText}.</p>
    <div class="turn-photos">
      <img class="reveal-img" src="images/turn1.jpg" alt="Graze Food Hall spread" loading="lazy">
      <img class="reveal-img reveal-delay-1" src="images/turn2.jpg" alt="Graze Food Hall spread" loading="lazy">
      <img class="reveal-img reveal-delay-2" src="images/turn3.jpg" alt="Graze Food Hall spread" loading="lazy">
    </div>
    <div class="section-footer-tag on-dark">
      <span>Puta Madres Pub Golf · 2026</span>
      <span>The Turn</span>
    </div>
  </div>
</section>`;
}

function renderHoles() {
  const container = document.getElementById('holes-container');
  if (!container) return;

  const sorted = [...HOLES].sort((a, b) => a.num - b.num);
  const blocks = sorted.map((hole, i) => {
    let html = holeSectionHtml(hole, i + 1);
    if (hole.turnAfter) {
      html += '\n\n' + turnSectionHtml(sorted[i + 1] || null);
    }
    return html;
  });

  container.innerHTML = blocks.join('\n\n');
}

// ---------------- Scorecard header + par row rendering ----------------
function renderScorecardHead() {
  const headerRow = document.getElementById('scorecard-hole-header');
  const parRow = document.getElementById('scorecard-par-row');
  if (!headerRow || !parRow) return;

  const sorted = [...HOLES].sort((a, b) => a.num - b.num);
  let parTotal = 0;

  const headerCells = sorted.map(h =>
    `<th${h.canned ? ' class="canned-col" title="Canned drinks only at this hole"' : ''}>H${h.num}${h.canned ? ' 🥫' : ''}</th>`
  ).join('');
  headerRow.innerHTML = `<th>Player</th>${headerCells}<th>Total</th>`;

  const parCells = sorted.map(h => {
    parTotal += h.par;
    return `<td${h.canned ? ' class="canned-col"' : ''}>${h.par}</td>`;
  }).join('');
  parRow.innerHTML = `<td>Par</td>${parCells}<td>${parTotal}</td>`;
}

// ---------------- Scorecard rows rendering ----------------
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
let lastCompletedSetKey = '';
const pendingPushes = {};

function loadLocalState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch (e) { return {}; }
}
function saveLocalState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Pushes only the single team/hole path that changed (not the whole
// scorecard), and debounces rapid typing, so two phones editing different
// teams at the same moment can't clobber each other's writes.
function pushEntry(key, hole, entry) {
  saveLocalState(scorecardState);
  if (!fbRef) return;

  const pendingKey = `${key}/${hole}`;
  clearTimeout(pendingPushes[pendingKey]);
  pendingPushes[pendingKey] = setTimeout(() => {
    fbRef.child(key).child(hole).set(entry)
      .catch(err => console.warn('Firebase sync failed, saved locally only.', err));
  }, 350);
}

function pushFullReset() {
  saveLocalState(scorecardState);
  if (fbRef) {
    fbRef.set({}).catch(err => console.warn('Firebase reset failed, saved locally only.', err));
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

function totalGolferCount() {
  return TEAMS.reduce((n, t) => n + t.players.length, 0);
}

function isHoleFullyEntered(hole) {
  // True once every golfer in the field has a score entered for this hole.
  let count = 0;
  TEAMS.forEach(team => {
    team.players.forEach((_, idx) => {
      const key = `${team.id}-p${idx + 1}`;
      const entry = scorecardState[key] && scorecardState[key][hole];
      if (entry && entry.score !== undefined && entry.score !== null && entry.score !== '') count++;
    });
  });
  return count === totalGolferCount();
}

function checkSecretTriggers() {
  // A hazard's secret only shows once every golfer has finished the hole
  // right before it — not the moment the first score comes in.
  HOLES.forEach(hole => {
    if (hole.secret && isHoleFullyEntered(hole.unlockAfterHole)) {
      unlockSecret(hole.secret.id);
    }
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
  // stay put at the bottom in their original order. Reordering only fires
  // when a whole hole has just been completed by every golfer, so rows
  // don't jump around mid-entry while people are still typing.
  const completedSetKey = HOLES.map(h => isHoleFullyEntered(h.num) ? '1' : '0').join('');
  if (completedSetKey !== lastCompletedSetKey) {
    lastCompletedSetKey = completedSetKey;
    const sortedTeamIds = teamResults
      .map((t, i) => ({ id: t.row.dataset.team, sortKey: t.anyFilled ? t.grand : Infinity, i }))
      .sort((a, b) => a.sortKey - b.sortKey || a.i - b.i)
      .map(t => t.id);
    reorderTeamRows(sortedTeamIds);
  }

  checkSecretTriggers();
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

      pushEntry(key, hole, scorecardState[key][hole]);
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

      pushEntry(key, hole, scorecardState[key][hole]);
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
      lastCompletedSetKey = '';
      pushFullReset();
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
  renderHoles();
  renderScorecardHead();
  renderScorecard();
  initScorecardInteractivity();
  initScorecardData();
  initEarlyAccess();
  initSyncStatus();

  if (Date.now() >= REVEAL_TIME || isBypassed()) {
    unlockScorecard();
  } else {
    initScorecardCountdown();
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .reveal-img').forEach(el => revealObserver.observe(el));

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
