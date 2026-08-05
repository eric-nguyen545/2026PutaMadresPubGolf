# Puta Madres Pub Golf — 2026

A single-scroll site with a sticky jump-to nav and a live, password-gated, cross-device scorecard.

## What's in here

```
index.html   — page shell + nav/hero/rules/route/scorecard/penalties markup
style.css    — all styling
script.js    — team + hole data, all rendering, scorecard logic, countdown gate
images/      — every photo used on the site
```

## Teams and holes are both data-driven

Open `script.js`:

- **`TEAMS`** — move a player to a different team, rename a team, or reorder
  teams. Both the roster cards and the scorecard rows regenerate from this
  one array automatically.
- **`HOLES`** — move a hole to a new spot in the order, edit its drinks/par/
  link, relocate a hazard secret, or move the "Turn" food stop. The hole
  sections *and* the scorecard's column headers/par row both regenerate from
  this one array, so they can never drift out of sync with each other again.
  - `unlockAfterHole` controls which hole's full completion reveals a
    hazard's secret.
  - `turnAfter: true` on a hole drops the Graze Food Hall section in right
    after it, and the Turn's "before teeing off on Hole X" text updates
    itself to match whatever hole actually comes next.
  - `canned: true` marks a hole as canned-drinks-only, which shows a 🥫
    marker on that hole's card and on its scorecard column header.

## The scorecard

- Visible to everyone once it unlocks (countdown to Aug 29, 2026, 12:00 PM CT)
  — no password needed just to view it.
- **Editing** (entering scores or drink types) requires a password:
  `putagolf26` — change `EDIT_PASSWORD` in `script.js`.
- **Testing before tee time**: "Have an early-access code?" in the locked
  countdown box, code is `caddie` (change `TEST_BYPASS_PASSWORD`).
- Each player gets a strokes input per hole plus three drink-type chips
  (🍺 beer / 🥃 liquor / 🎲 dealer's choice), gated at 4 beer / 4 liquor /
  1 dealer's choice per player.
- **Caddie secrets only reveal once every golfer has a score in** for the
  hole right before the hazard — not the moment the first score comes in.
- **Team ranking only reorders once a whole hole has been completed by
  every golfer** — totals and the leader tag still update live on every
  keystroke, but the row order itself won't jump around mid-entry.
- A small sync indicator next to the edit button shows 🟢 live / 🟡
  reconnecting / ⚪ local-only, so it's obvious on event night whether the
  scorecard is actually syncing.

### Cross-device sync (Firebase)

Already wired up and pointed at a live Firebase Realtime Database
(`FIREBASE_CONFIG` in `script.js`). Score/drink-type edits now write to just
that one team-and-hole path (not the whole scorecard) and are debounced
~350ms after typing stops, so two phones editing different teams at the same
moment won't overwrite each other. If you ever need to point this at a
different Firebase project, swap the values in `FIREBASE_CONFIG`.

## Hosting on GitHub Pages

1. Push `index.html`, `style.css`, `script.js`, and `images/` to the root of
   the repo.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**
   (workflow included at `.github/workflows/deploy.yml`).
3. Push to `main` and it deploys automatically.

## Notes

- The countdown gate and password system are front-end conveniences, not
  real security — anyone who views source can read the passwords. They stop
  casual bumps and keep spoilers off the page before tee time, nothing more.
- Reset scorecard clears all scores/drink picks for everyone and re-locks
  every caddie secret.
