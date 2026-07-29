# Puta Madres Pub Golf — 2026

A single-scroll site built from the pub golf slideshow, with a sticky jump-to nav and a live, phone-friendly scorecard.

## What's in here

```
index.html   — all page content/sections
style.css    — all styling (colors, fonts, layout, animations)
script.js    — nav highlighting, scroll reveals, scorecard logic
images/      — every photo used on the site, already resized for web
```

No build step, no dependencies. It's plain HTML/CSS/JS.

## Hosting it on GitHub Pages

1. Create a new repo on GitHub (e.g. `puta-madres-pub-golf`).
2. Add these four items (`index.html`, `style.css`, `script.js`, `images/`) to the root of the repo — don't put them in a subfolder, or GitHub Pages won't find `index.html` automatically.
3. Push to GitHub.
4. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**. Pick `main` (or whatever your default branch is) and `/ (root)`, then Save.
5. GitHub gives you a URL like `https://yourusername.github.io/puta-madres-pub-golf/` within a minute or two.

If you'd rather use a custom domain, GitHub's Pages settings has a field for that — just add a `CNAME` file or type it into the settings box, and set up the DNS records GitHub shows you.

## Placeholders you still need to fill in

Every one of these shows up on the live site as a dashed gold button labeled **"Add link"** so they're easy to spot. Open `index.html`, search for `href="#"`, and swap in the real URL:

- **Route section** — Google Maps link for the walking route
- **Each of the 9 hole cards** — venue website or Instagram link (Rabbit Hole, Cuzzy's, Bricksworth, Killens, Smorgies, O'Donovan's, Mackenzie Pub, The Local, Brit's Pub)
- **Closing section** — photo gallery / upload link for after the event

Just replace the `#` inside the matching `<a href="#" class="placeholder-link">` tag with your real link, e.g.:

```html
<a href="https://maps.app.goo.gl/yourlink" class="placeholder-link">
```

## The live scorecard

- The rest of the site (holes, teams, rules, route) is visible to everyone right away — only the scorecard table itself is gated.
- The scorecard unlocks automatically at **August 29, 2026 · 2:00 PM Central**, showing a live days/hours/minutes/seconds countdown until then. It's calculated from a fixed UTC offset, so it fires at the right moment regardless of a visitor's device timezone.
- This is a friendly gate, not real security — anyone who opens the page source could find the markup underneath. Good for "no peeking at scores before tee time," not for anything that needs to stay actually private.
- 5 teams × 9 holes, all editable strokes-per-hole inputs.
- Totals and the current leader (lowest total) update live as scores are entered.
- Scores save automatically to whoever's browser/phone is entering them (via `localStorage`) — no login, no server, no signal needed once the page is loaded. Note this means each device keeps its own copy; it's built for one caddie/scorekeeper's phone to run the card, not for everyone's phones to sync live.
- Two caddie secrets are hidden until the right moment:
  - Entering any team's score for **Hole 3** unlocks the Hole 4 water-hazard warning.
  - Entering any team's score for **Hole 6** unlocks the Hole 7 Irish Car Bomb warning.
- **Reset scorecard** clears all scores and re-locks both secrets — good to hit once the season's over, or before a rerun.

## Notes on content

- Hole 6 (O'Donovan's) and Hole 7 (Mackenzie Pub) numbering follows the "HOLE X OF 9" footer text from the original slides, per your call.
- The two "CADDIE ONLY — do not display" notes from the speaker notes are wired into the scorecard secrets above rather than shown as static text.
