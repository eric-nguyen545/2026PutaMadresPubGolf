# Puta Madres Pub Golf — 2026

A single-scroll site with a sticky jump-to nav and a live, password-gated, cross-device scorecard.

## What's in here

```
index.html   — all page content/sections
style.css    — all styling
script.js    — team data, rendering, scorecard logic, countdown gate
images/      — every photo used on the site
```

## Route (reversed)

The crawl now starts at Brit's Pub and ends at Rabbit Hole. Both hazards stayed
attached to the same bars, they just moved to new hole numbers:
- Hole 3 = Mackenzie Pub (Irish Car Bomb secret, unlocks after Hole 2 is scored)
- Hole 6 = Killens (Water Hazard secret, unlocks after Hole 5 is scored)

The route map image and Google Maps link are both updated to the reversed route.

## Teams — now data-driven

Open `script.js` and edit the `TEAMS` array at the top. Move a player to a
different team, rename a team, or reorder teams — both the roster cards and
the scorecard rows regenerate from that one array automatically.

## The scorecard

- Visible to everyone once it unlocks (countdown to Aug 29, 2026, 2:00 PM CT) —
  no password needed just to view it.
- **Editing** (entering scores or drink types) requires a password:
  `putagolf26` — change `EDIT_PASSWORD` in `script.js`. Once someone enters it
  correctly on a device, that device stays unlocked for editing on future visits.
- **Testing before tee time**: click "Have an early-access code?" in the locked
  countdown box and enter `caddie` (change `TEST_BYPASS_PASSWORD` in `script.js`)
  to preview the live scorecard early. This only bypasses the countdown for
  that browser tab session — it doesn't touch the real countdown for anyone else.
- Each player gets a strokes input per hole plus three drink-type chips
  (🍺 beer / 🥃 liquor / 🎲 dealer's choice). The chips gate at 4 beer, 4 liquor,
  1 dealer's choice per player — once a category is maxed, its chip disables
  until you free up a slot by switching another hole's choice.
- Totals, team totals, and the current leader update live.

### Cross-device sync (optional — Firebase)

By default the scorecard only saves to whichever device is editing it
(localStorage). To make scores sync live across every phone watching the page:

1. Create a free project at https://console.firebase.google.com
2. Add a Realtime Database, and start it in **test mode** (open read/write) —
   good enough for a private one-day event.
3. In `script.js`, find `FIREBASE_CONFIG` near the top and paste in your
   project's config values (apiKey, authDomain, databaseURL, projectId).

That's it — no other code changes needed. Until you fill that in, the site
works exactly the same, just without cross-device sync.

## Placeholders still open

- **Closing section** — the "Back To Top" link works as-is (an empty `#`
  anchor jumps to page top by default).
- Every hole's venue link and the Google Maps route link are already filled in.

## Hosting on GitHub Pages

1. Push `index.html`, `style.css`, `script.js`, and `images/` to the root of
   a repo (not a subfolder).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub
   Actions** (a workflow is included at `.github/workflows/deploy.yml`).
3. Push to `main` and the site deploys automatically.

## Notes

- The countdown gate and password system are front-end conveniences, not real
  security — anyone who views source can read the passwords. They're meant to
  stop casual bumps and keep spoilers off the page before tee time, not to
  protect anything sensitive.
- Reset scorecard clears all scores/drink picks for everyone (if Firebase is
  configured) and re-locks the two caddie secrets.
