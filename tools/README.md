# Site generator

All app content lives here. The HTML pages in the repo root are generated: do
not edit them by hand.

| File | What it holds |
|---|---|
| `apps.mjs` | The app list, in site order: name, status, colours, button, page text, FAQ |
| `privacy/<slug>.html` | Each app's privacy policy body (HTML sections) |
| `build.mjs` | Writes `index.html`, `404.html`, `<slug>/index.html`, `<slug>/privacy/index.html`, `sitemap.xml`, `llms.txt` |
| `og.mjs` | Renders the 1200x630 social cards in `assets/og/` with local Chrome |

## Add a new app

1. Put a square icon in `assets/apps/`: `<slug>.webp` (512 px) and `<slug>-144.webp` (144 px).
   From a 1024 PNG: `cwebp -q 86 -resize 512 512 icon.png -o assets/apps/<slug>.webp`
   and `cwebp -q 86 -resize 144 144 icon.png -o assets/apps/<slug>-144.webp`.
2. Add an entry to `apps.mjs` where it should appear. Copy an existing entry.
3. Write `privacy/<slug>.html`. Describe only what the app really does with data.
4. Run `node tools/og.mjs` (social card) and `node tools/build.mjs`.
5. Check at 1440 and 390 widths: `python3 -m http.server 8787`.

The new app gets a home panel, a dock icon, its own page, a privacy page, and
entries in the sitemap, `llms.txt` and the 404 page.

## Rename an app

Change it in `apps.mjs`. If the slug changes, add the old paths to `MOVED` in
`worker.js` so store listings and shared links keep working (see Arunachala →
Talk With Swamy).
