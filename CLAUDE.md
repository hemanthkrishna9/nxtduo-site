# NxtDuo company website (nxtduo.com)

Static showcase site for NxtDuo, the user's two-person app studio. Plain `index.html` + `style.css`, no build step, no framework. Keep it that way unless asked.

## Hosting and CI/CD
- Repo: github.com/hemanthkrishna9/nxtduo-site (branch `main`).
- Cloudflare **Workers static assets** (not Pages), Worker name `nxtduo`, connected to the repo with Workers Builds. **Every push to `main` goes live in ~30 s.** No manual deploy needed.
- Live at https://nxtduo.com. The custom domains (nxtduo.com, www.nxtduo.com) are declared in `wrangler.jsonc` `routes`, not set in the dashboard. The workers.dev URL is off since routes were added.
- `worker.js` 301-redirects www.nxtduo.com to nxtduo.com, then serves files via the ASSETS binding (`run_worker_first: true`). `wrangler.jsonc` serves the repo root and uses `404.html` for unknown paths. `.assetsignore` keeps repo-only files (this one, wrangler.jsonc, README) off the site. Add any new non-public file to it.
- `_headers` sets security and cache headers. It works with Workers assets.

## Rules
- Commits: author `hemanthkrishna9` only. **No "Co-Authored-By: Claude" or "Generated with Claude Code" lines**, ever.
- This is often run from a monitored work laptop: no tunnels, no exposed ports. Pushing to this repo is approved; ask before other logins or deploys.
- The repo is public. Never commit tokens, account IDs or personal emails.
- Verify after a push: fetch the page (use `node --use-system-ca`, plain curl fails behind the corporate proxy).

## Content
- Since 2026-10-07 the site shows only Saathi (offline AI tutor, education) and Thodu (Telugu calls to parents, relationships), to position NxtDuo for the Claude startup program. NxtDue, Meter Mele, Chai Empire and NxtBrush were removed on purpose. No images: the phone mockups are HTML/CSS.
- Keep status claims honest (prototype / next / pilot). Do not add invented stats or founder biography.
- Also not shown: trading research (ha-breakout, jev-intraday) and the pencil-anim videos.
- Contact: hello@nxtduo.com (needs Cloudflare Email Routing).
- Style: dark background, violet→pink→amber gradient, Plus Jakarta Sans, cards with an `--accent` colour each. Check desktop (1440) and phone (390) widths after layout changes.

## Status (2026-10-01)
The office DNS may briefly cache "not found" for new hostnames; check with Cloudflare DoH before assuming a fault.

- [x] Site built, on GitHub, auto-deploying on push
- [x] nxtduo.com on Cloudflare (Free), nameservers hope/jake.ns.cloudflare.com set at GoDaddy, zone active
- [x] Custom domains + www → root redirect (via wrangler.jsonc + worker.js)
- [ ] Email Routing for hello@nxtduo.com
- [ ] Update sitemap/canonical if the final URL differs; submit to Google Search Console
