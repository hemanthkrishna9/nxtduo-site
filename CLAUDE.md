# NxtDuo company website (nxtduo.com)

Static showcase site for NxtDuo, the user's two-person app studio. No framework and no deploy-time build. The HTML pages are generated locally from `tools/apps.mjs` and `tools/privacy/*.html` by `node tools/build.mjs` (see `tools/README.md`); never hand-edit the generated HTML.

## Hosting and CI/CD
- Repo: github.com/hemanthkrishna9/nxtduo-site (branch `main`).
- Cloudflare **Workers static assets** (not Pages), Worker name `nxtduo`, connected to the repo with Workers Builds. **Every push to `main` goes live in ~30 s.** No manual deploy needed.
- Live at https://nxtduo.com. The custom domains (nxtduo.com, www.nxtduo.com) are declared in `wrangler.jsonc` `routes`, not set in the dashboard. The workers.dev URL is off since routes were added.
- `worker.js` 301-redirects www.nxtduo.com to nxtduo.com, then serves files via the ASSETS binding (`run_worker_first: true`). `wrangler.jsonc` serves the repo root and uses `404.html` for unknown paths. `worker.js` also turns missing-slash redirects into 301s. `.assetsignore` keeps repo-only files (this one, wrangler.jsonc, README) off the site. Add any new non-public file to it.
- `_headers` sets security and cache headers. It works with Workers assets.

## Rules
- Commits: author `hemanthkrishna9` only. **No "Co-Authored-By: Claude" or "Generated with Claude Code" lines**, ever.
- This is often run from a monitored work laptop: no tunnels, no exposed ports. Pushing to this repo is approved; ask before other logins or deploys.
- The repo is public. Never commit tokens, account IDs or personal emails.
- Verify after a push: fetch the page (use `node --use-system-ca`, plain curl fails behind the corporate proxy).

## Content
- Since 2026-10-11 the site shows 9 apps in this order (the user's): Talk With Swamy, NxtDue, Publik, FableFox, Meter Mele, NxtBrush, Chai Empire, Saathi, Thodu. More apps will be added.
- Every app has `/<slug>/` and `/<slug>/privacy/`. These URLs go into the App Store, Google Play and social posts, so never change a slug without adding a 301 to `MOVED` in `worker.js`. `/arunachala/*` (Talk With Swamy's old name) already redirects.
- Home: hero with a phone home screen of all app icons, one panel per app, studio, contact, plus a fixed dock with every app icon. Use app icons, not screenshots.
- Horizontal scroll on wide screens: GSAP ScrollTrigger pin + snap, no Lenis; GSAP is served from `vendor/` so a CDN outage cannot break the page. Entrances are scrubbed to scroll position so they cannot get stuck. Narrow screens, and pages where GSAP fails to load, fall back to a vertical page.
- Placeholder icons drawn by Claude, to replace when real ones exist: Publik, Chai Empire, Thodu.
- Keep status claims honest (live / in review / testing / prototype / concept). Do not add invented stats or founder biography. Privacy pages must match what each app really does.
- Also not shown: trading research (ha-breakout, jev-intraday) and the pencil-anim videos.
- Contact: support@nxtduo.com.
- Style: light theme (#f3f8f6) around the teal N mark, Plus Jakarta Sans + Instrument Serif self-hosted in `fonts/`, each app coloured by its `accent` / `accentInk` (ink must pass 4.5:1; build.mjs warns). Check desktop (1440) and phone (390) widths after layout changes.
- SEO is part of done: a new app gets its own `/<slug>/` page, unique title and description, JSON-LD, a sitemap entry and an llms.txt line (build.mjs does all of these). Plans are in W:/apps/nxtduo-plans/.

## Status (2026-10-01)
The office DNS may briefly cache "not found" for new hostnames; check with Cloudflare DoH before assuming a fault.

- [x] Site built, on GitHub, auto-deploying on push
- [x] nxtduo.com on Cloudflare (Free), nameservers hope/jake.ns.cloudflare.com set at GoDaddy, zone active
- [x] Custom domains + www → root redirect (via wrangler.jsonc + worker.js)
- [ ] Make sure that support@nxtduo.com receives mail (Zoho)
- [ ] Google Search Console and Bing Webmaster Tools (needs the owner login)
