# NxtDuo company website (nxtduo.com)

Static showcase site for NxtDuo, the user's two-person app studio. Plain HTML, CSS and JS, no build step, no framework. Keep it that way unless asked. The design came from Mahesh's NxtDuo-Web repo on 2026-10-09: a horizontal-scroll home page (`index.html`, `style.css`, `main.js` with GSAP, ScrollTrigger and Lenis served from `vendor/`) plus one SEO page per app in `/<slug>/index.html` sharing `apps.css`.

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
- Apps, in this order: Arunachala (Ramana Maharshi chat, links to ramana.nxtduo.com, access code by email), NxtDue, Meter Mele (the only live product), then the workshop cards Chai Empire, NxtBrush, Saathi and Thodu. Arunachala and NxtDue are "In review".
- Keep status claims honest. Do not add invented stats, ratings or founder biography.
- Not shown: trading research (ha-breakout, jev-intraday) and the pencil-anim videos.
- Contact: support@nxtduo.com.
- Style: light mint background, teal and mint accents, Plus Jakarta Sans and Instrument Serif self-hosted in `fonts/`. Check desktop (1440) and phone (390) widths after layout changes.
- SEO is part of done: a new app gets its own `/<slug>/` page, unique title and description, JSON-LD, a sitemap entry and an llms.txt line. Plans are in W:/apps/nxtduo-plans/.
- If GSAP or Lenis fail to load, `nomotion.css` shows a plain vertical page. Keep that fallback working.

## Status (2026-10-01)
The office DNS may briefly cache "not found" for new hostnames; check with Cloudflare DoH before assuming a fault.

- [x] Site built, on GitHub, auto-deploying on push
- [x] nxtduo.com on Cloudflare (Free), nameservers hope/jake.ns.cloudflare.com set at GoDaddy, zone active
- [x] Custom domains + www → root redirect (via wrangler.jsonc + worker.js)
- [ ] Make sure that support@nxtduo.com receives mail (Zoho)
- [ ] Google Search Console and Bing Webmaster Tools (needs the owner login)
