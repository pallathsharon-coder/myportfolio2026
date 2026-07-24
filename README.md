# Sharon Pallath — Portfolio Prototype

A single-page portfolio for Sharon Pallath (Graphic Designer · 3D Visualizer · Video Editor, Dubai),
styled after the motion language of [indrajaal-museum.com](https://www.indrajaal-museum.com/):
black void, parchment-cream accents, huge condensed display type, monospace HUD labels,
scramble-text, and scroll-driven choreography.

## Run it

Just open `index.html` in any modern browser (double-click works — no build step, no server needed).
Internet is required on first load for the Google Fonts + GSAP CDN files.

## What's inside

| Path | Purpose |
|---|---|
| `index.html` | All content/markup (from the resume PDF) |
| `css/style.css` | Museum aesthetic — palette, type scale, layout, responsive rules |
| `js/main.js` | Motion engine (GSAP 3.13: ScrollSmoother, ScrollTrigger, SplitText, ScrambleText, CustomEase) |
| `assets/img/*.jpg` | Web-optimized visuals, generated with Magnific / Google Nano Banana 2 Pro |
| `assets/img/src/*.png` | Full-resolution originals of the generated images |
| `assets/cv-pages/` | Page renders of the resume PDF |
| `cv.pdf` | The resume (linked as "Download CV" in the contact section) |

## Motion map

- **Preloader** — 000→100 counter, cycling scramble words, five-slat curtain reveal
- **Hero** — character-by-character title rise, slow image de-zoom, parallax + fade on scroll
- **Marquee** — outlined text band whose speed reacts to scroll velocity
- **The Artist** — line-masked statement reveal, clip-path figure reveal, animated stat counters
- **The Gallery** — pinned horizontal exhibition (vertical on mobile), inner-image parallax, progress rail
- **The Craft** — hoverable discipline rows with a floating image preview that follows the cursor
- **The Archive** — timeline with a scroll-drawn spine
- **Contact** — giant per-character reveal with elastic hover wave; custom cursor with "SAY HI" label

Regenerate or replace any visual by dropping a new file over `assets/img/*.jpg` (4:3 for work images,
wide for `hero.jpg`, 4:5 for `about.jpg`).
