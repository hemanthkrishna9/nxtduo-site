// Builds the static site from tools/apps.mjs:
//   index.html, 404.html, <slug>/index.html, <slug>/privacy/index.html,
//   sitemap.xml, llms.txt
// Usage: node tools/build.mjs        (no dependencies)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { apps, SITE, EMAIL } from "./apps.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TODAY = new Date().toISOString().slice(0, 10);
const N = apps.length;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pad = (n) => String(n).padStart(2, "0");
const icon = (a) => `/assets/apps/${a.slug}.webp`;
const iconSm = (a) => `/assets/apps/${a.slug}-144.webp`;
const og = (slug) => (existsSync(join(ROOT, `assets/og/${slug}.jpg`)) ? `${SITE}/assets/og/${slug}.jpg` : `${SITE}/assets/og/home.jpg`);
const tagClass = (a) => (a.status.kind === "live" ? "tag live" : "tag");
const nameHtml = (a) => esc(a.name) + (a.alt ? ` <span class="alt" lang="${a.alt.lang}">${a.alt.text}</span>` : "");
const ext = (l) => (l.external ? ` rel="noopener"` : "");
const arrow = (l) => (l.external ? "↗" : "→");

function write(rel, html) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// Warn about accent-ink colours that would fail 4.5:1 on white
function contrast(hex) {
  const c = hex.match(/\w\w/g).map((h) => parseInt(h, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return 1.05 / (L + 0.05);
}
for (const a of apps) {
  const r = contrast(a.accentInk);
  if (r < 4.5) console.warn(`! ${a.slug}: accentInk ${a.accentInk} is only ${r.toFixed(2)}:1 on white`);
  for (const f of [icon(a), iconSm(a), `/tools/privacy/${a.slug}.html`]) if (!existsSync(join(ROOT, f))) console.warn(`! ${a.slug}: missing ${f}`);
}

const FONTS = `<link rel="preload" href="/fonts/plus-jakarta-sans-latin-var.woff2" as="font" type="font/woff2" crossorigin />`;

function meta({ title, description, url, image, imageAlt, noindex = false }) {
  return `<meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="robots" content="${noindex ? "noindex" : "index,follow"}" />
  <meta name="theme-color" content="#f3f8f6" />
  <link rel="canonical" href="${url}" />
  <link rel="icon" href="/assets/favicon-32.png" type="image/png" sizes="32x32" />
  <link rel="icon" href="/assets/favicon.png" type="image/png" sizes="128x128" />
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="NxtDuo" />
  <meta property="og:locale" content="en_IN" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${esc(imageAlt)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${image}" />`;
}

const ORG = { "@type": "Organization", "@id": `${SITE}/#organization`, name: "NxtDuo", url: `${SITE}/`, logo: `${SITE}/assets/nxtduo-icon-512.png`, email: EMAIL };
const ld = (obj) => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 1)}\n  </script>`;

/* ==========================================================================
   Home page
   ========================================================================== */
const BOT = `<div class="cursor" id="cursor" aria-hidden="true">
    <svg class="bot" viewBox="0 0 64 64" width="54" height="54">
      <defs>
        <linearGradient id="botBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3fe0b0" /><stop offset="1" stop-color="#1f8f7c" /></linearGradient>
        <linearGradient id="botFace" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f3d37" /><stop offset="1" stop-color="#0b2a26" /></linearGradient>
      </defs>
      <line x1="32" y1="14" x2="32" y2="7" stroke="#2a9d8f" stroke-width="3" stroke-linecap="round" />
      <circle class="bot-light" cx="32" cy="6" r="4" fill="#3fe0b0" />
      <rect x="6" y="28" width="6" height="14" rx="3" fill="#0f4c45" />
      <rect x="52" y="28" width="6" height="14" rx="3" fill="#0f4c45" />
      <rect x="11" y="14" width="42" height="40" rx="12" fill="url(#botBody)" />
      <rect x="16" y="20" width="32" height="28" rx="8" fill="url(#botFace)" />
      <g class="bot-eyes">
        <circle cx="25" cy="33" r="4.2" fill="#3fe0b0" /><circle class="bot-pupil" cx="25" cy="33" r="1.8" fill="#071412" />
        <circle cx="39" cy="33" r="4.2" fill="#3fe0b0" /><circle class="bot-pupil" cx="39" cy="33" r="1.8" fill="#071412" />
      </g>
      <g class="bot-happy" fill="none" stroke="#3fe0b0" stroke-width="3" stroke-linecap="round"><path d="M21 34 q4 -5 8 0" /><path d="M35 34 q4 -5 8 0" /></g>
      <path class="bot-mouth" d="M27 41 q5 3 10 0" fill="none" stroke="#3fe0b0" stroke-width="2.2" stroke-linecap="round" />
    </svg>
  </div>`;

function appPanel(a, i) {
  const next = apps[i + 1];
  const upNext = next
    ? `<a class="up-next" href="#${next.slug}" data-goto><img src="${iconSm(next)}" alt="" width="44" height="44" loading="lazy" decoding="async" /><span>Up next · ${pad(i + 2)}</span><b>${esc(next.name)} →</b></a>`
    : `<a class="up-next" href="#studio" data-goto><span class="mark" aria-hidden="true">✦</span><span>Up next</span><b>The studio →</b></a>`;
  return `
      <!-- ${pad(i + 1)} ${a.name} -->
      <section class="panel p-app" id="${a.slug}" data-app="${pad(i + 1)} / ${pad(N)}" data-name="${esc(a.name)}" style="--accent:${a.accent};--accent-ink:${a.accentInk}" aria-labelledby="${a.slug}-name">
        <div class="app-num" aria-hidden="true">${pad(i + 1)}</div>
        <div class="app-grid">
          <div class="app-visual reveal">
            <div class="halo"></div>
            <div class="ring"></div>
            <div class="ring ring-2"></div>
            <img class="app-icon" src="${icon(a)}" alt="${esc(a.name)} app icon" width="512" height="512" loading="${i < 2 ? "eager" : "lazy"}" decoding="async" />
            <div class="app-icon-shine" aria-hidden="true"></div>
          </div>
          <div class="app-copy">
            <p class="app-meta reveal"><span class="${tagClass(a)}">${esc(a.status.label)}</span><span class="app-cat">${esc(a.category)}</span></p>
            <h2 class="app-name reveal" id="${a.slug}-name">${nameHtml(a)}</h2>
            <p class="app-tagline reveal">${esc(a.tagline)}</p>
            <p class="app-desc reveal">${esc(a.summary)}</p>
            <ul class="chips reveal" aria-label="Details">${a.chips.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
            <div class="app-ctas reveal">
              <a class="btn primary" href="${esc(a.cta.href)}"${ext(a.cta)}>${esc(a.cta.label)} <i aria-hidden="true">${arrow(a.cta)}</i></a>
              <a class="btn ghost" href="/${a.slug}/">About ${esc(a.name)}</a>
              <a class="text-link" href="/${a.slug}/privacy/">Privacy</a>
            </div>
          </div>
        </div>
        ${upNext}
      </section>`;
}

function home() {
  const live = apps.filter((a) => a.status.kind === "live").length;
  const title = "NxtDuo | Apps that look after the people you love";
  const description = `NxtDuo is a two-person app studio making apps for families around the world. Our apps: ${apps.map((a) => a.name).join(", ")}.`;
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      { ...ORG, description: "A two-person app studio making apps for families around the world.", founder: [{ "@type": "Person", name: "Hemanth Krishna" }, { "@type": "Person", name: "Mahesh Chandu" }], areaServed: "Worldwide" },
      { "@type": "WebSite", "@id": `${SITE}/#website`, name: "NxtDuo", url: `${SITE}/`, inLanguage: "en", publisher: { "@id": `${SITE}/#organization` } },
      { "@type": "ItemList", "@id": `${SITE}/#apps`, name: "Apps by NxtDuo", numberOfItems: N, itemListElement: apps.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: a.name, url: `${SITE}/${a.slug}/` })) },
    ],
  };

  return `<!doctype html>
<html lang="en">
<head>
  ${meta({ title, description, url: `${SITE}/`, image: og("home"), imageAlt: "NxtDuo apps" })}
  ${FONTS}
  <link rel="stylesheet" href="/style.css" />
  ${ld(jsonld)}
</head>
<body>
  <!-- Generated by tools/build.mjs from tools/apps.mjs. Edit those, not this file. -->
  <a class="skip" href="#${apps[0].slug}">Skip to the apps</a>
  ${BOT}

  <header class="nav" id="nav">
    <a class="brand" href="#home" data-goto aria-label="NxtDuo home">
      <img src="/assets/nxtduo-icon-96.webp" alt="" width="48" height="48" decoding="async" />
      <span class="brand-word">NXT<b>Duo</b></span>
      <span class="brand-tag">App studio</span>
    </a>
    <div class="nav-right">
      <span class="counter is-empty" aria-hidden="true"><b id="counterNow"></b><span class="counter-name" id="counterName"></span></span>
      <a class="pill" href="#contact" data-goto>Say hello</a>
    </div>
  </header>
  <div class="progress" aria-hidden="true"><i id="progressBar"></i></div>

  <nav class="dock" aria-label="All apps">
    <a class="dock-home" href="#home" data-goto><img src="/assets/nxtduo-icon-96.webp" alt="" width="44" height="44" /><span class="dock-tip">Home</span><span class="sr-only">Home</span></a>
    <span class="dock-sep" aria-hidden="true"></span>
${apps.map((a) => `    <a href="#${a.slug}" data-goto><img src="${iconSm(a)}" alt="" width="44" height="44" decoding="async" /><span class="dock-tip">${esc(a.name)}</span><span class="sr-only">${esc(a.name)}</span></a>`).join("\n")}
    <span class="dock-sep" aria-hidden="true"></span>
    <a href="#contact" data-goto><span class="dock-mail" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg></span><span class="dock-tip">Contact</span><span class="sr-only">Contact</span></a>
  </nav>

  <main class="track-wrap" id="trackWrap">
    <div class="track" id="track">

      <!-- Hero -->
      <section class="panel p-hero" id="home" aria-labelledby="hero-title">
        <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">NxtDuo · an independent studio of two</p>
            <h1 class="display" id="hero-title">Apps that look after the people you <span class="serif">love.</span></h1>
            <p class="lead">We build calm, honest apps for family life: reminders that keep you on time, bedtime stories in a parent&rsquo;s own voice, a brushing coach for the kids, a private place for your thoughts. Each one is made for our own family first, then shared with yours.</p>
            <div class="cta">
              <a class="btn primary" href="#${apps[0].slug}" data-goto>Start with ${esc(apps[0].name)} <i aria-hidden="true">→</i></a>
              <a class="btn ghost" href="#studio" data-goto>About the studio</a>
            </div>
            <p class="hero-note">${live} live today · tap any app to jump to it <span class="arrow" aria-hidden="true">→</span></p>
          </div>

          <div class="hero-phone-wrap">
            <div class="phone">
              <div class="screen">
                <div class="status" aria-hidden="true"><span>9:41</span><span class="island"></span><span class="status-icons">●●● ▮</span></div>
                <div class="screen-date" aria-hidden="true"><b>Made for families</b><span>Our apps</span></div>
                <ul class="apps-grid" aria-label="Our apps">
${apps.map((a) => `                  <li><a href="#${a.slug}" data-goto><img src="${iconSm(a)}" alt="" width="66" height="66" decoding="async" /><span>${esc(a.name)}</span></a></li>`).join("\n")}
                </ul>
                <div class="screen-dock" aria-hidden="true"><img src="/assets/nxtduo-icon-96.webp" alt="" width="34" height="34" />NxtDuo</div>
              </div>
            </div>
          </div>
        </div>
      </section>
${apps.map(appPanel).join("\n")}

      <!-- Studio -->
      <section class="panel p-about" id="studio" aria-labelledby="studio-title">
        <div class="about-grid">
          <div>
            <p class="eyebrow reveal">The studio</p>
            <h2 class="display reveal" id="studio-title">Two people. One <span class="serif">studio.</span></h2>
            <p class="lead reveal">NxtDuo is a small, independent studio making apps for families everywhere. We build things we want for our own family first: a reminder app because we kept missing renewals, bedtime stories for when we are away, a brushing coach for the kids.</p>
            <p class="quote reveal">With great power comes great responsibility.</p>
          </div>
          <ul class="values">
            <li class="reveal"><i>01</i><div><b>Kind by default.</b><span>No dark patterns, no guilt trips, no selling your data.</span></div></li>
            <li class="reveal"><i>02</i><div><b>Made for the world.</b><span>Your language, your city, your everyday life, wherever you are.</span></div></li>
            <li class="reveal"><i>03</i><div><b>Honest about status.</b><span>Live means live. Concepts are called concepts.</span></div></li>
            <li class="reveal"><i>04</i><div><b>Small and careful.</b><span>Fewer features, done properly.</span></div></li>
          </ul>
        </div>
      </section>

      <!-- Contact -->
      <section class="panel p-contact" id="contact" aria-labelledby="contact-title">
        <div class="contact-inner">
          <div class="emblem reveal" aria-hidden="true"><span class="emblem-ring"></span><span class="emblem-ring"></span><img src="/assets/nxtduo-icon.webp" alt="" width="640" height="640" loading="lazy" decoding="async" /><span class="emblem-floor"></span></div>
          <h2 class="display reveal" id="contact-title">Let&rsquo;s <span class="serif">talk.</span></h2>
          <p class="reveal">Feedback, early access, partnerships or just a hello. We read every message.</p>
          <a class="mail reveal" href="mailto:${EMAIL}">${EMAIL} <span aria-hidden="true">↗</span></a>
        </div>
        <footer class="foot reveal">
          <ul class="foot-apps" aria-label="App pages and privacy policies">
${apps.map((a) => `            <li><img src="${iconSm(a)}" alt="" width="22" height="22" loading="lazy" /><span><a href="/${a.slug}/">${esc(a.name)}</a> <small><a href="/${a.slug}/privacy/">Privacy</a></small></span></li>`).join("\n")}
          </ul>
          <div class="foot-row">
            <span>© <span id="year">2026</span> NxtDuo · Made with ☕ for families everywhere</span>
            <a href="mailto:${EMAIL}">${EMAIL}</a>
          </div>
        </footer>
      </section>

    </div>
  </main>

  <script src="/vendor/gsap-3.12.5.min.js" defer></script>
  <script src="/vendor/ScrollTrigger-3.12.5.min.js" defer></script>
  <script src="/main.js" defer></script>
</body>
</html>
`;
}

/* ==========================================================================
   App pages
   ========================================================================== */
function topBar(a, current) {
  return `<a class="skip" href="#main">Skip to content</a>
  <header class="top">
    <div class="wrap">
      <a class="brand" href="/"><img src="/assets/nxtduo-icon-96.webp" width="40" height="40" alt="" /><span class="brand-word">NXT<b>Duo</b></span><span class="sr-only">home</span></a>
      <nav aria-label="${esc(a.name)}">
        <a class="crumb hide-sm" href="/${a.slug}/"${current === "app" ? ` aria-current="page"` : ""}><img src="${iconSm(a)}" alt="" width="24" height="24" />${esc(a.name)}</a>
        <a href="/${a.slug}/privacy/"${current === "privacy" ? ` aria-current="page"` : ""}>Privacy</a>
        <a href="/#${a.slug}">All apps</a>
      </nav>
    </div>
  </header>`;
}

function moreApps(a) {
  return `<nav class="more" aria-labelledby="more-title">
      <h2 id="more-title">More from NxtDuo</h2>
      <ul>
${apps.filter((b) => b !== a).map((b) => `        <li><a href="/${b.slug}/"><img src="${iconSm(b)}" alt="" width="44" height="44" loading="lazy" /><b>${esc(b.name)}</b><span>${esc(b.short)} · ${esc(b.status.label)}</span></a></li>`).join("\n")}
      </ul>
    </nav>`;
}

function foot(a) {
  return `<footer class="foot">
    <div class="wrap">
      <span>&copy; 2026 NxtDuo &middot; A two-person app studio, making apps for the world</span>
      <span><a href="/${a.slug}/privacy/">${esc(a.name)} privacy policy</a> &middot; <a href="mailto:${EMAIL}">${EMAIL}</a> &middot; <a href="/">All apps</a></span>
    </div>
  </footer>`;
}

function appPage(a) {
  const url = `${SITE}/${a.slug}/`;
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      ORG,
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "NxtDuo", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: a.name, item: url }] },
      { "@type": "SoftwareApplication", "@id": `${url}#app`, name: a.name, description: a.seo.description, image: `${SITE}${icon(a).replace(".webp", ".webp")}`, publisher: { "@id": `${SITE}/#organization` }, url, applicationCategory: a.seo.appCategory, operatingSystem: a.seo.os, ...(a.seo.free ? { isAccessibleForFree: true } : {}) },
      { "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: a.faq.map(([q, ans]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: ans } })) },
    ],
  };
  return `<!doctype html>
<html lang="en">
<head>
  ${meta({ title: `${a.seo.title} | NxtDuo`, description: a.seo.description, url, image: og(a.slug), imageAlt: `${a.name} by NxtDuo` })}
  ${FONTS}
  <link rel="stylesheet" href="/apps.css" />
  ${ld(jsonld)}
</head>
<body style="--accent:${a.accent};--accent-ink:${a.accentInk}">
  <!-- Generated by tools/build.mjs from tools/apps.mjs. Edit those, not this file. -->
  ${topBar(a, "app")}

  <main class="wrap" id="main">
    <div class="hero">
      <div>
        <span class="${tagClass(a)}">${esc(a.status.label)}</span>
        <h1>${nameHtml(a)}</h1>
        <p class="promise">${esc(a.tagline)}</p>
        <p class="intro">${esc(a.summary)}</p>
        <div class="ctas">
          <a class="btn" href="${esc(a.cta.href)}"${ext(a.cta)}>${esc(a.cta.label)} <span aria-hidden="true">${arrow(a.cta)}</span></a>
          <a class="btn ghost" href="/${a.slug}/privacy/">Privacy policy</a>
        </div>
        <p class="cta-note">${esc(a.statusNote)}</p>
      </div>
      <div class="visual"><img src="${icon(a)}" width="512" height="512" alt="${esc(a.name)} app icon" fetchpriority="high" /></div>
    </div>

    <dl class="facts">
${Object.entries(a.facts).map(([k, v]) => `      <div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("\n")}
    </dl>

    <div class="content">
${a.sections.map((s) => `      <section class="block">\n        <h2>${esc(s.h)}</h2>\n        ${s.html}\n      </section>`).join("\n")}
      <section class="block faq">
        <h2>Questions</h2>
${a.faq.map(([q, ans]) => `        <h3>${esc(q)}</h3>\n        <p>${esc(ans)}</p>`).join("\n")}
      </section>
    </div>

    ${moreApps(a)}
  </main>

  ${foot(a)}
</body>
</html>
`;
}

function privacyPage(a) {
  const url = `${SITE}/${a.slug}/privacy/`;
  const body = readFileSync(join(ROOT, `tools/privacy/${a.slug}.html`), "utf8").trim().replace(/^/gm, "      ");
  const heads = [...body.matchAll(/<h2>([^<]+)<\/h2>/g)].map((m) => m[1]);
  const withIds = heads.length > 4
    ? body.replace(/<section class="block">\s*<h2>([^<]+)<\/h2>/g, (_, h) => `<section class="block" id="${h.toLowerCase().replace(/&amp;/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}">\n        <h2>${h}</h2>`)
    : body;
  const toc = heads.length > 4
    ? `<nav class="block toc" aria-label="On this page"><ol>${heads.map((h) => `<li><a href="#${h.toLowerCase().replace(/&amp;/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}">${h}</a></li>`).join("")}</ol></nav>\n      `
    : "";
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      ORG,
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "NxtDuo", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: a.name, item: `${SITE}/${a.slug}/` }, { "@type": "ListItem", position: 3, name: "Privacy Policy", item: url }] },
      { "@type": "WebPage", "@id": url, url, name: `${a.name} Privacy Policy`, isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${SITE}/${a.slug}/#app` } },
    ],
  };
  const description = `How ${a.name} by NxtDuo handles your data: what is collected, why, and how to delete it.`;
  return `<!doctype html>
<html lang="en">
<head>
  ${meta({ title: `${a.name} Privacy Policy | NxtDuo`, description, url, image: og(a.slug), imageAlt: `${a.name} by NxtDuo` })}
  ${FONTS}
  <link rel="stylesheet" href="/apps.css" />
  ${ld(jsonld)}
</head>
<body style="--accent:${a.accent};--accent-ink:${a.accentInk}">
  <!-- Generated by tools/build.mjs. The policy text is in tools/privacy/${a.slug}.html. -->
  ${topBar(a, "privacy")}

  <main class="wrap" id="main">
    <div class="policy-head">
      <a class="app-line" href="/${a.slug}/"><img src="${iconSm(a)}" width="48" height="48" alt="" />${esc(a.name)}</a>
      <h1>Privacy Policy</h1>
      <p class="intro">${esc(a.privacy.intro)} ${esc(a.name)} is made by NxtDuo, a two-person app studio in India.</p>
      <p class="meta">Effective date: ${esc(a.privacy.effective)} · Contact: <a href="mailto:${EMAIL}">${EMAIL}</a></p>
    </div>

    <div class="content policy">
      ${toc}${withIds.trim()}
    </div>

    ${moreApps(a)}
  </main>

  ${foot(a)}
</body>
</html>
`;
}

/* ==========================================================================
   404, sitemap, llms.txt
   ========================================================================== */
function notFound() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Page not found | NxtDuo</title>
  <meta name="robots" content="noindex" />
  <meta name="theme-color" content="#f3f8f6" />
  <link rel="icon" href="/assets/favicon.png" type="image/png" />
  ${FONTS}
  <link rel="stylesheet" href="/apps.css" />
  <style>
    .nf { text-align: center; padding: clamp(48px, 10vw, 110px) 0 24px; }
    .nf .code { font-size: 13px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--mint-text); }
    .nf h1 { margin-top: 8px; }
    .nf .intro { margin-inline: auto; }
    .nf .ctas { justify-content: center; }
  </style>
</head>
<body>
  <!-- Generated by tools/build.mjs -->
  <main class="wrap">
    <div class="nf">
      <p class="code">404</p>
      <h1>Page not found</h1>
      <p class="intro">This page does not exist, or it has moved. Every NxtDuo app is below.</p>
      <div class="ctas"><a class="btn" href="/">Back to NxtDuo</a></div>
    </div>
    <nav class="more" aria-labelledby="more-title">
      <h2 id="more-title">Our apps</h2>
      <ul>
${apps.map((b) => `        <li><a href="/${b.slug}/"><img src="${iconSm(b)}" alt="" width="44" height="44" /><b>${esc(b.name)}</b><span>${esc(b.short)} · ${esc(b.status.label)}</span></a></li>`).join("\n")}
      </ul>
    </nav>
  </main>
</body>
</html>
`;
}

function sitemap() {
  const urls = ["/", ...apps.flatMap((a) => [`/${a.slug}/`, `/${a.slug}/privacy/`])];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod></url>`).join("\n")}
</urlset>
`;
}

function llms() {
  return `# NxtDuo

> NxtDuo is a small, independent, two-person app studio making apps for families around the world. It builds small, careful products for everyday life: apps, games and tools in local languages, with no dark patterns and no selling of user data.

Contact: ${EMAIL}
Website: ${SITE}/

## Apps

${apps.map((a) => `- [${a.name}](${SITE}/${a.slug}/): ${a.summary} Status: ${a.status.label}. ${a.statusNote} Privacy policy: ${SITE}/${a.slug}/privacy/`).join("\n")}
`;
}

/* ========================================================================== */
write("index.html", home());
write("404.html", notFound());
write("sitemap.xml", sitemap());
write("llms.txt", llms());
for (const a of apps) {
  write(`${a.slug}/index.html`, appPage(a));
  write(`${a.slug}/privacy/index.html`, privacyPage(a));
}
console.log(`Built home, 404, sitemap, llms.txt and ${N} apps × 2 pages.`);
