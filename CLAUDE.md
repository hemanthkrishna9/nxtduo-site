# NxtDuo company website (nxtduo.com)

Static showcase site for NxtDuo, the user's two-person app studio. Plain `index.html` + `style.css`, no build step, no framework. Keep it that way unless asked.

## Hosting and CI/CD
- Repo: github.com/hemanthkrishna9/nxtduo-site (branch `main`).
- Cloudflare **Workers static assets** (not Pages), Worker name `nxtduo`, connected to the repo with Workers Builds. **Every push to `main` goes live in ~30 s.** No manual deploy needed.
- Preview URL: https://nxtduo.nxtduo1.workers.dev
- `wrangler.jsonc` serves the repo root and uses `404.html` for unknown paths. `.assetsignore` keeps repo-only files (this one, wrangler.jsonc, README) off the site. Add any new non-public file to it.
- `_headers` sets security and cache headers. It works with Workers assets.

## Rules
- Commits: author `hemanthkrishna9` only. **No "Co-Authored-By: Claude" or "Generated with Claude Code" lines**, ever.
- This is often run from a monitored work laptop: no tunnels, no exposed ports. Pushing to this repo is approved; ask before other logins or deploys.
- The repo is public. Never commit tokens, account IDs or personal emails.
- Verify after a push: fetch the page (use `node --use-system-ca`, plain curl fails behind the corporate proxy).

## Content
- Live: NxtDue (nxtdue.com), Meter Mele (meter-mele.pages.dev).
- Coming soon: Chai Empire, NxtBrush, Saathi, Thodu. Images in `assets/` are copied from those projects under W:/apps.
- Deliberately not shown: trading research (ha-breakout, jev-intraday) and the pencil-anim videos.
- Contact: hello@nxtduo.com (needs Cloudflare Email Routing).
- Style: dark background, violet→pink→amber gradient, Plus Jakarta Sans, cards with an `--accent` colour each. Check desktop (1440) and phone (390) widths after layout changes.

## Status (2026-10-01)
- [x] Site built, on GitHub, auto-deploying to the workers.dev URL
- [ ] nxtduo.com added to Cloudflare + nameservers changed at the registrar
- [ ] Custom domains nxtduo.com and www.nxtduo.com on the `nxtduo` Worker (Settings → Domains & Routes)
- [ ] www → root redirect rule
- [ ] Email Routing for hello@nxtduo.com
- [ ] Update sitemap/canonical if the final URL differs; submit to Google Search Console
