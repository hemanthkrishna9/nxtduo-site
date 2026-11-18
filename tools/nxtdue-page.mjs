// NxtDue's own page sections (T-20261118-01 proof): the top of the page and
// demo 1 ("create a reminder -> the notification"). Used by build.mjs for any
// app with `page: "clay"`. Styles are in /nxtdue.css.
//
// Every word on a phone comes from NxtDue v1.0 (git -C NXTDue show main:...);
// the list with file:line is in ops/reports/T-20261118-01/words.md.
// Data values (Arjun, Honda City, amounts) are from the real v1.0 Home
// screenshot, Promotional-Videos/.../screens/01_home.png.

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// The app's own glyphs, copied from main:mobile/components/clay/Icon.tsx (GLYPHS).
const GLYPHS = {
  bell: ["p:M18.5 8.5a6.5 6.5 0 1 0-13 0c0 6.5-2.5 6.5-2.5 8.5h18c0-2-2.5-2-2.5-8.5z", "p:M10.2 20.4a2.2 2.2 0 0 0 3.6 0"],
  calendar: ["r:3.2 5.2 17.6 15.6 3.4", "p:M8 3.2v4M16 3.2v4M3.2 10.2h17.6"],
  cake: ["p:M3.6 20.4h16.8", "p:M5.2 20.4v-6a2 2 0 0 1 2-2h9.6a2 2 0 0 1 2 2v6", "p:M5.2 14.8c1.36 0 1.36 1.6 2.72 1.6s1.36-1.6 2.72-1.6 1.36 1.6 2.72 1.6 1.36-1.6 2.72-1.6 1.36 1.6 2.72 1.6", "p:M12 12.4V9.6", "p:M12 9.4c1 0 1.7-.7 1.7-1.6 0-1.1-1.7-2.6-1.7-2.6s-1.7 1.5-1.7 2.6c0 .9.7 1.6 1.7 1.6z"],
  car: ["p:M3.2 13.4 5 8.6A3 3 0 0 1 7.8 6.6h8.4a3 3 0 0 1 2.8 2l1.8 4.8V18a1 1 0 0 1-1 1h-1.6a1 1 0 0 1-1-1v-1.2H6.8V18a1 1 0 0 1-1 1H4.2a1 1 0 0 1-1-1z", "cf:7.4 14.6 .9", "cf:16.6 14.6 .9"],
  check: ["p:m5 12.6 4.6 4.6L19 6.8"],
  clock: ["c:12 12 8.6", "p:M12 6.8V12l3.4 2"],
  close: ["p:M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6"],
  fire: ["p:M12 2.8s5.2 4 5.2 9.2a5.2 5.2 0 0 1-10.4 0c0-1.6.6-2.8.6-2.8s1.6 1 1.6 2.4c0-3.6 3-6.6 3-8.8z"],
  folder: ["p:M3 7.2a2 2 0 0 1 2-2h3.6l2 2.6H19a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"],
  home: ["p:M3 10.6 12 3.2l9 7.4V20a1 1 0 0 1-1 1h-5v-6.2H9V21H4a1 1 0 0 1-1-1z"],
  plus: ["p:M12 5.5v13M5.5 12h13"],
  search: ["c:11 11 6.8", "p:M20 20.2 16 16.2"],
  settings: ["c:12 12 3.1", "p:M18.7 14.2a1.5 1.5 0 0 0 .3 1.7l.1.1a1.9 1.9 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-2.5 1.1v.3a1.9 1.9 0 1 1-3.8 0v-.2a1.5 1.5 0 0 0-2.6-1 1.9 1.9 0 1 1-2.6-2.7 1.5 1.5 0 0 0-1-2.6H3.8a1.9 1.9 0 1 1 0-3.8H4a1.5 1.5 0 0 0 1-2.6 1.9 1.9 0 1 1 2.7-2.6 1.5 1.5 0 0 0 2.6-1V3.8a1.9 1.9 0 1 1 3.8 0V4a1.5 1.5 0 0 0 2.6 1 1.9 1.9 0 1 1 2.6 2.7 1.5 1.5 0 0 0-1 2.6v.1a1.9 1.9 0 1 1 0 3.8z"],
  shield: ["p:M12 3.2 19.6 6v6.1c0 4.8-3.3 7.6-7.6 8.7-4.3-1.1-7.6-3.9-7.6-8.7V6z"],
  tv: ["r:2.4 5.4 19.2 12.6 3.2", "p:M8.4 21h7.2M12 18v3"],
  users: ["p:M15.5 21v-1.8a3.8 3.8 0 0 0-3.8-3.8H6.3a3.8 3.8 0 0 0-3.8 3.8V21", "c:9 7.4 3.8", "p:M21.5 21v-1.8a3.8 3.8 0 0 0-3-3.7M17 3.9a3.8 3.8 0 0 1 0 7"],
};
// Icon.tsx PRESETS: sm 16/2.1, md 20/1.9, lg 24/1.8.
const SIZE = { sm: [16, 2.1], md: [20, 1.9], lg: [24, 1.8] };
function ic(name, size = "md", color = "currentColor", sw) {
  const [px, w] = SIZE[size];
  const parts = GLYPHS[name].map((g) => {
    const [k, v] = [g.slice(0, g.indexOf(":")), g.slice(g.indexOf(":") + 1)];
    const n = v.split(" ");
    const fill = k.endsWith("f") ? ` fill="${color}" stroke="none"` : "";
    if (k === "p") return `<path d="${v}"/>`;
    if (k[0] === "c") return `<circle cx="${n[0]}" cy="${n[1]}" r="${n[2]}"${fill}/>`;
    return `<rect x="${n[0]}" y="${n[1]}" width="${n[2]}" height="${n[3]}" rx="${n[4]}"/>`;
  });
  return `<svg class="ic" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw ?? w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${parts.join("")}</svg>`;
}

// iPhone status bar, as in the v1.0 screenshots.
const statusBar = (light = false) => `<div class="sb${light ? " sb-light" : ""}"><span class="sb-time">9:41</span><span class="sb-island"></span><span class="sb-icons"><svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><path d="M8 2.6c2.4 0 4.6.9 6.2 2.5l1.2-1.2A10.4 10.4 0 0 0 8 .9 10.4 10.4 0 0 0 .6 3.9l1.2 1.2A8.7 8.7 0 0 1 8 2.6zm0 3.4c1.5 0 2.9.6 3.9 1.6l1.2-1.2A7 7 0 0 0 8 4.3a7 7 0 0 0-5.1 2.1l1.2 1.2c1-1 2.4-1.6 3.9-1.6zM8 9.2c.6 0 1.1.2 1.5.6L8 11.4 6.5 9.8c.4-.4.9-.6 1.5-.6z"/></svg><span class="sb-batt"><i></i></span></span></div>`;

/* ------------------------------------------------------------------ Home */
// The five rows of 01_home.png (DashboardService.cs:20 NextUpCount = 5). Tints: categoryTints in tokens.ts.
const NEXT_UP = [
  { tint: "subscriptions", icon: "tv", title: "Netflix Premium", sub: "Netflix", amt: "₹649", days: 3 },
  { tint: "vehicle", icon: "car", title: "Pollution certificate (PUC)", sub: "Honda City", amt: "₹150", days: 7 },
  { tint: "vehicle", icon: "car", title: "Car insurance", sub: "Honda City", amt: "₹12,500", days: 14 },
  { tint: "insurance", icon: "shield", title: "Family health insurance", sub: "Star Health", amt: "₹24,800", days: 22 },
  { tint: "birthday", icon: "cake", title: "Mom’s birthday", days: 26 },
];
// v1.0 tokens.ts urgency.amberWithinDays. Founder 18 Nov: follow the v1.0 code, not the screenshot.
const AMBER_WITHIN_DAYS = 15;
// Split as (tabs)/index.tsx:133-138; pill tone as DaysPill.tsx:27 (amber "soon" else mint).
const NEEDS_NOW = NEXT_UP.filter((r) => r.days <= AMBER_WITHIN_DAYS);
const LATER = NEXT_UP.filter((r) => r.days > AMBER_WITHIN_DAYS);
const row = (r) => `<div class="rrow"><span class="tile t-${r.tint}">${ic(r.icon)}</span><span class="rrow-tt"><b>${esc(r.title)}</b>${r.sub ? `<span>${esc(r.sub)} · <em>${esc(r.amt)}</em></span>` : ""}</span><span class="days ${r.days <= AMBER_WITHIN_DAYS ? "soon" : "ok"}"><b>${r.days}</b><s>days</s></span></div>`;

const tabBar = () => `<div class="nav"><span class="nav-it on"><span class="slot">${ic("home")}</span>Home</span><span class="nav-it"><span class="slot">${ic("bell")}</span>Reminders</span><span class="fab">${ic("plus", "lg", "#fff", 2.4)}</span><span class="nav-it"><span class="slot">${ic("folder")}</span>Documents</span><span class="nav-it"><span class="slot">${ic("users")}</span>Family</span></div>`;

function homeScreen() {
  return `<div class="scr scr-home">
${statusBar()}
<div class="abar"><span class="av">A</span><span class="abar-tt"><b>Hi, Arjun</b><span>5 need your attention</span></span><span class="ibtn">${ic("search")}</span><span class="ibtn">${ic("settings")}</span></div>
<div class="stats"><div class="stat st-soon"><i>${ic("clock", "sm")}</i><b>5</b><span>Expiring soon</span></div><div class="stat st-dead"><i>${ic("fire", "sm")}</i><b>0</b><span>Expired</span></div><div class="stat st-ok"><i>${ic("check", "sm")}</i><b>4</b><span>Active</span></div></div>
<div class="hdr"><b>Needs you now</b><s>See all (9)</s></div>
${NEEDS_NOW.map(row).join("")}
<div class="hdr"><b>Coming up</b></div>
${LATER.map(row).join("")}
${tabBar()}
</div>`;
}

/* ------------------------------------------- New reminder, step 1 (05_add.png) */
const CHIPS = ["Vehicle", "Documents", "Insurance", "Subscriptions", "Birthday", "Services", "Warranty"];
function addScreen() {
  return `<div class="scr scr-add">
${statusBar()}
<div class="abar"><span class="ibtn">${ic("close")}</span><span class="abar-tt"><b>New reminder</b><span>Step 1 of 3 · Details</span></span><span class="save">Save</span></div>
<div class="steps"><i class="on"></i><i></i><i></i></div>
<p class="flab">What are you tracking?</p>
<div class="field f-title"><span class="ph ph-title">What you want to be reminded about</span><span class="val typed">Car insurance</span></div>
<p class="flab">Category</p>
<div class="chips">${CHIPS.map((c) => `<span class="chip${c === "Insurance" ? " chip-ins" : ""}">${c}${c === "Insurance" ? `<span class="chip-on">${c}</span>` : ""}</span>`).join("")}<span class="chip chip-new">${ic("plus", "sm")}New</span></div>
<div class="pair"><div><p class="flab"><span class="lab-due">Due on</span><span class="lab-renew">Renews on</span></p><div class="field f-date">${ic("calendar", "md")}<span class="ph ph-date">Pick a date</span><span class="val val-date">18 Dec 2026</span></div></div><div><p class="flab">Amount (₹)</p><div class="field"><span class="ph">0.00</span></div></div></div>
<div class="card"><div class="card-top"><span><b>Repeats</b><span>Auto-creates the next one when renewed</span></span><span class="tog"><i></i></span></div><div class="seg"><span>Monthly</span><span>Quarterly</span><span>Half-yearly</span><span class="on">Yearly</span></div></div>
<div class="btn-next">Next — reminders</div>
</div>`;
}

/* -------------------------------------------- Lock screen + the notification */
// Title and body from main:src/NxtDue.Application/Notifications/AlertContent.cs:
// "{title} expires in {n} days" and "Due {ddd d MMM}" (no subject, no vendor:
// step 1 sets neither). 30 days is the first default alert.
function lockScreen() {
  return `<div class="scr scr-lock">
${statusBar(true)}
<div class="lock-time">9:00</div>
<div class="notif"><img src="/assets/apps/nxtdue-144.webp" alt="" width="38" height="38" /><span><b>Car insurance expires in 30 days</b><span>Due Fri 18 Dec</span></span></div>
</div>`;
}

const phone = (inner, cls = "") => `<div class="phone-box ${cls}"><div class="phone"><div class="screen">${inner}</div></div></div>`;

/* ------------------------------------------------------------- Sections */
export function nxtdueSections(a, { ext, arrow }) {
  const demoAlt = "NxtDue demo: tap plus, type Car insurance, pick Insurance and 18 Dec 2026, tap Save. The phone then shows the notification: Car insurance expires in 30 days. Due Fri 18 Dec.";
  return `<section class="cl-hero" aria-labelledby="cl-title">
      <span class="tag live">${esc(a.status.label)}</span>
      <h1 id="cl-title">${esc(a.tagline)}</h1>
      <a class="cl-btn" href="${esc(a.cta.href)}"${ext(a.cta)}>${esc(a.cta.label)} <span aria-hidden="true">${arrow(a.cta)}</span></a>
      ${phone(homeScreen(), "ph-hero")}
    </section>

    <section class="cl-demo" aria-labelledby="demo1-title">
      <div class="cl-demo-copy">
        <h2 id="demo1-title">${esc(a.clay.demo1)}</h2>
        <ol class="cl-steps" aria-hidden="true"><li><b>New reminder</b><i></i></li><li><b>Save</b><i></i></li><li><b>Push notification</b><i></i></li></ol>
      </div>
      <div class="cl-demo-phone" role="img" aria-label="${esc(demoAlt)}">
        ${phone(`${homeScreen()}${addScreen()}${lockScreen()}<span class="tap"></span>`, "ph-demo")}
      </div>
    </section>`;
}
