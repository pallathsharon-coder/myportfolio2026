# Sharon Pallath — Portfolio 2026

Portfolio for Sharon Pallath (3D Visualizer · Graphic Designer · Video Editor, Dubai).
Editorial fashion aesthetic: dark grid backdrop, bone ivory `#ECE8E0` on near-black,
Italiana display type + Inter labels.

## Run it

Open `index.html` in any modern browser — no build step. Internet needed on first load
(Google Fonts + GSAP CDN).

## Pages

| Page | What it is |
|---|---|
| `index.html` | Single-viewport home — 3D orbit gallery. Wheel/drag rotates 8 works on a perspective ring; **spiral ↔ list** toggle morphs ring into a flat row. B&W images colorize on hover; mouse move tilts the whole scene. Rotating circular text badge, live caption index. |
| `portfolio.html` | Selected-work row list with cursor-following image previews |
| `about.html` | Name, intro, portrait, story, selected seasons |
| `contact.html` | Email / phone / studio / socials / CV columns |

Menu (top-right pill) → Home / Portfolio / About / Contact on every page.

## Structure

| Path | Purpose |
|---|---|
| `css/style.css` | Whole theme — palette, type, grid bg, orbit stage, subpages |
| `js/home.js` | Orbit engine — ring math, scatter, list morph, wheel/drag input, parallax, loader |
| `js/site.js` | Shared — menu overlay, subpage reveals, portfolio hover previews |
| `assets/img/*.jpg` | Web-optimized works (Magnific / Nano Banana 2), `src/*.png` full-res |
| `cv.pdf` | Resume — "Download CV" on contact page |

Works are defined in the `WORKS` array in `js/home.js` (home) and the rows in
`portfolio.html` — swap image paths/captions there to update.
