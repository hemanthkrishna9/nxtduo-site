# NxtDuo — company site

Static site for https://nxtduo.com. No build step.

- `index.html` — the page (six panels on one horizontal track)
- `style.css` — styles; the palette comes from the brand sheet in `assets/brand-sheet.png`
- `main.js` — motion: GSAP + ScrollTrigger drive a pinned horizontal scroll on screens wider than 900px and a normal vertical page below that; Lenis smooths the scroll
- `assets/` — the NxtDuo icon (`nxtduo-icon.png` transparent, `nxtduo-icon-bg.png` for social previews) and product images

## Run locally

    python3 -m http.server 8787

then open http://localhost:8787/. Arrow keys and the dots in the header move between panels.

## Deploy

Push the folder as-is to Cloudflare Pages (or any static host). Set `/` as the root; there is nothing to build.
