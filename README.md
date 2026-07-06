# Whitecast — Landing Page

Single-page marketing site for **Whitecast**, a modular prediction market platform for humans and AI agents. Static HTML/CSS/JS — no build step required.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

(Any static server works. Opening `index.html` directly also works, but a server is recommended so the hero canvas can pixel-sample the wordmark font.)

## Structure

```
index.html          All 7 sections (hero, why, agentic, roadmap, aquarium, team, footer)
css/tokens.css      Design tokens: colors, spacing, type scale, radii, shadows, motion
css/fonts.css       @font-face declarations for the 3-font system
css/main.css        Component and section styles
js/main.js          Hero particle field, tilt cards, scrollytelling, reveal-on-scroll
assets/fonts/       Self-hosted woff2 files
assets/img/         AI-generated portraits and decorative art
```

## Type system

| Role  | Font           | Source                                    |
|-------|----------------|-------------------------------------------|
| Title | Nippo          | Fontshare (ITF Free Font License)          |
| Body  | IBM Plex Sans  | Google Fonts (OFL), variable weight 100–700 |
| Mono  | Departure Mono | Helena Zhang (OFL)                         |

## Notes

- All motion respects `prefers-reduced-motion`; the hero particle canvas is disabled for reduced-motion users and on mobile (static gradient glow remains).
- The hero particles are seeded by pixel-sampling the "WHITECAST" wordmark on an offscreen canvas; they spring to their home points and are repelled by the cursor.
- `whitecast-structure.md` was not present in the workspace, so section copy (card text, roadmap milestones, article titles, team roster) was authored to match the brief; swap it for canonical copy when available.
