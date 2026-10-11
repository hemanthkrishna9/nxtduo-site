# NxtDuo — company site

Static site for https://nxtduo.com. Every app has its own page and privacy
policy here; these are the links used in the stores and on social media.

- `tools/` — the app list and generator. Edit `tools/apps.mjs` and
  `tools/privacy/*.html`, then run `node tools/build.mjs`. See `tools/README.md`.
- `index.html`, `<app>/index.html`, `<app>/privacy/index.html`, `404.html`,
  `sitemap.xml`, `llms.txt` — generated; do not edit by hand
- `style.css` + `main.js` — home page look and motion (GSAP ScrollTrigger:
  a pinned horizontal track that snaps to each app on wide screens, a vertical
  page below 900px)
- `apps.css` — app and privacy pages
- `worker.js` — www → root redirect and old-path redirects, then static files
- `assets/apps/` — app icons; `assets/og/` — social preview cards

## Run locally

    python3 -m http.server 8787

then open http://localhost:8787/. The dock, arrow keys and trackpad swipes
move between apps.

## Deploy

Push to `main`. Cloudflare Workers Builds deploys it in about 30 seconds.
