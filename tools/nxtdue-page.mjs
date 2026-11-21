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
  back: ["p:M14.8 5.4 8 12l6.8 6.6"],
  camera: ["p:M3.4 8.4h3.2L8.2 6h7.6l1.6 2.4h3.2a1 1 0 0 1 1 1v8.8a1 1 0 0 1-1 1H3.4a1 1 0 0 1-1-1V9.4a1 1 0 0 1 1-1z", "c:12 13.6 3.4"],
  document: ["p:M6.2 3.2h7L18.4 8.4v11.4a1.4 1.4 0 0 1-1.4 1.4H6.2a1.4 1.4 0 0 1-1.4-1.4V4.6a1.4 1.4 0 0 1 1.4-1.4z", "p:M13 3.4v5.4h5.2"],
  edit: ["p:M4 20.2h4.2L18.6 9.8a2 2 0 0 0 0-2.8l-1.6-1.6a2 2 0 0 0-2.8 0L4 15.8z", "p:m13.6 6.6 3.8 3.8"],
  eye: ["p:M2.6 12S6 5.8 12 5.8 21.4 12 21.4 12 18 18.2 12 18.2 2.6 12 2.6 12z", "c:12 12 3"],
  image: ["r:3.2 4.4 17.6 15.2 3.2", "p:m3.6 16.4 4.8-4.6 3.8 3.6 3-2.8 5.4 5", "c:8.6 9.2 1.4"],
  link: ["p:M10 13.4a4.6 4.6 0 0 0 6.6 0l2.2-2.2a4.6 4.6 0 0 0-6.5-6.5l-1.2 1.2", "p:M14 10.6a4.6 4.6 0 0 0-6.6 0l-2.2 2.2a4.6 4.6 0 0 0 6.5 6.5l1.2-1.2"],
  lock: ["r:4.4 10.2 15.2 10.6 3.2", "p:M8 10V7.4a4 4 0 0 1 8 0V10"],
  mail: ["r:2.6 5 18.8 14 3.2", "p:m3.4 7.6 8.6 5.8 8.6-5.8"],
  repeat: ["p:M4.2 9.4V7.6a2 2 0 0 1 2-2h11.2M14.6 2.6l3.2 3-3.2 3", "p:M19.8 14.6v1.8a2 2 0 0 1-2 2H6.6M9.4 21.4l-3.2-3 3.2-3"],
  shieldCheck: ["p:M12 3.2 19.6 6v6.1c0 4.8-3.3 7.6-7.6 8.7-4.3-1.1-7.6-3.9-7.6-8.7V6z", "p:m9 11.8 2.2 2.2 4-4.2"],
  trash: ["p:M4.4 6.6h15.2M9.4 6.6V4.4h5.2v2.2M6.4 6.6l1 13.2h9.2l1-13.2"],
  user: ["c:12 8 4.2", "p:M4.2 20.8a7.8 7.8 0 0 1 15.6 0"],
  whatsapp: ["p:M20.6 11.7a8.5 8.5 0 0 1-12.7 7.4L3.4 20.6l1.5-4.3A8.5 8.5 0 1 1 20.6 11.7z", "p:M9 8.8c.2 2.2 2 4 4.2 4.4"],
  wrench: ["p:M15.4 3.2a5.4 5.4 0 0 0-4.9 7.6L3.2 18v3h3l7.2-7.3a5.4 5.4 0 1 0 2-10.5z"],
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

// (tabs)/_layout.tsx: Home, Reminders, the violet +, Documents, Family.
const TABS = [["home", "Home"], ["bell", "Reminders"], null, ["folder", "Documents"], ["users", "Family"]];
const tabBar = (on = "Home") => `<div class="nav">${TABS.map((t) => t ? `<span class="nav-it${t[1] === on ? " on" : ""}"><span class="slot">${ic(t[0])}</span>${t[1]}</span>` : `<span class="fab">${ic("plus", "lg", "#fff", 2.4)}</span>`).join("")}</div>`;

/* Small parts, each after its v1.0 component (main:mobile/components/clay/*.tsx). */
// AppBar.tsx: title h2 (h3 when there is a leading part), subtitle appBarSubtitle.
const appBar = (title, sub, { lead = "", action = "", h3 = false, raw = false } = {}) => `<div class="abar">${lead}<span class="abar-tt${h3 ? " h3" : ""}"><b>${esc(title)}</b><span>${raw ? sub : esc(sub)}</span></span>${action}</div>`;
// ClayIconButton.tsx: default (raised, muted glyph) or active (pressed, violet glyph).
const iconBtn = (name, active = false, cls = "") => `<span class="ibtn${active ? " ibtn-on" : ""} ${cls}">${ic(name, "md", active ? "#6c4ef6" : "currentColor")}</span>`;
// ClayButton.tsx: primary (violet), secondary (raised), ghost (flat); md 54 / sm 44 high.
const button = (label, { v = "secondary", icon, sm = false, cls = "" } = {}) => `<span class="cbtn cb-${v}${sm ? " cb-sm" : ""} ${cls}">${icon ? ic(icon, sm ? "sm" : "md", v === "primary" ? "#fff" : "currentColor") : ""}<span>${esc(label)}</span></span>`;
// StatusPill.tsx, pillTints in tokens.ts.
const pill = (label, tint) => `<span class="pill pl-${tint}">${esc(label)}</span>`;
// SectionHeader.tsx
const section = (title) => `<div class="hdr"><b>${esc(title)}</b></div>`;
// TileIcon.tsx: md 46 / sm 38, categoryTints.
const tileIcon = (tint, icon, sm = false) => `<span class="tile t-${tint}${sm ? " tile-sm" : ""}">${ic(icon, sm ? "sm" : "md")}</span>`;
// ClayBottomSheet.tsx: scrim, grabber, h3 title, muted subtitle.
const sheet = (title, sub, body, cls = "") => `<div class="sheet-wrap ${cls}"><div class="scrim"></div><div class="sheet"><i class="grab"></i><div class="sheet-hd"><b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ""}</div>${body}</div></div>`;

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
${statusBar()}
<div class="lock-time">9:00</div>
<img class="lock-nio" src="/assets/nio.webp" alt="" width="520" height="742" decoding="async" />
<div class="notif"><img src="/assets/apps/nxtdue-144.webp" alt="" width="38" height="38" /><span><b>Car insurance expires in 30 days</b><span>Due Fri 18 Dec</span></span></div>
</div>`;
}

/* ---------------------------------------------------------------- Family */
// (tabs)/family.tsx for a Premium owner with nobody invited yet. familySummary(1, 0)
// = "1 person" (lib/family/format.ts:109). "Arjun" is the name in 01_home.png.
function familyScreen() {
  return `<div class="scr scr-fam">
${statusBar()}
${appBar("Family", "1 person", { action: iconBtn("plus", true) })}
<div class="ccard own"><span class="av-ring"><span class="av av-52">A</span></span><span class="cc-tt"><b>Arjun</b><span>Owner · you</span></span>${pill("Admin", "new")}</div>
${section("Members")}
<div class="ccard"><b class="rt">Nobody else yet</b><span class="rs">Invite the people whose paperwork you track. They get their own login, and only ever see what you share.</span></div>
${button("Invite a family member", { icon: "users", cls: "fam-invite" })}
${tabBar("Family")}
</div>`;
}

// family/invite.tsx + INVITE_ROLES (lib/family/format.ts:11). "amma@gmail.com" and
// "Amma" are the screen's own placeholders, typed in.
const ROLES = [["edit", "Can edit", "Add, change and renew shared reminders"], ["eye", "View only", "Sees reminders, can't change them"], ["bell", "Alerts only", "Gets notified, sees nothing else"]];
function inviteScreen() {
  return `<div class="scr scr-inv">
${statusBar()}
${appBar("Invite someone", "They'll get their own login", { lead: iconBtn("close"), h3: true })}
<p class="flab">Email address</p>
<div class="field">${ic("mail", "md", "#948db8")}<span class="ph inv-ph1">amma@gmail.com</span><span class="val inv-v1">amma@gmail.com</span></div>
<p class="fnote">Where the invite is sent. They sign in with this address.</p>
<p class="flab">Name they'll appear as</p>
<div class="field">${ic("user", "md", "#948db8")}<span class="ph inv-ph2">Amma</span><span class="val inv-v2">Amma</span></div>
<p class="flab">What they can do</p>
<div class="roles">${ROLES.map(([i, l, d], n) => `<div class="role${n === 0 ? " role-on" : ""}"><span class="role-ic">${ic(i, "sm", n === 0 ? "#fff" : "#6e6795")}</span><span class="cc-tt"><b>${esc(l)}</b><span>${esc(d)}</span></span>${n === 0 ? ic("check", "sm", "#6c4ef6", 3) : ""}</div>`).join("")}</div>
<p class="fnote">Documents stay private unless you attach them to a shared reminder.</p>
${button("Send invite", { v: "primary", cls: "inv-send" })}
</div>`;
}

// The "Invite ready" view (invite.tsx:211-247), the email-sent case.
function inviteReady() {
  return `<div class="scr scr-ready">
${statusBar()}
${appBar("Invite ready", "Amma · Can edit", { lead: iconBtn("close"), h3: true })}
<div class="ccard sent"><span class="sent-badge">${ic("check", "lg", "#fff", 2.4)}</span><span class="cc-tt"><b>Emailed to amma@gmail.com</b><span>They can also use the link below.</span></span></div>
${button("WhatsApp", { v: "primary", icon: "whatsapp", cls: "rd-wa" })}
${button("Copy link", { icon: "link", cls: "rd-f" })}
${button("Done", { v: "ghost", sm: true, cls: "rd-f" })}
</div>`;
}

/* ------------------------------------------------------------- Documents */
// (tabs)/documents.tsx, Premium (1 GB), starting empty. Sample data: the file
// "Car insurance.pdf" and its size 2.1 MB (the size is the one in format.ts:69's comment).
// Text from lib/documents/format.ts: formatVaultSummary, formatQuota, formatDocumentSubtitle.
const DOC_CHIPS = ["All", "Identity", "Vehicle", "Policies", "Bills", "Other"];
const FILE = "Car insurance.pdf";
function documentsScreen() {
  return `<div class="scr scr-doc">
${statusBar()}
${appBar("Documents", `<span class="d0">0 files · 0 KB used</span><span class="d1">1 file · 2.1 MB used</span>`, { action: iconBtn("plus", true, "doc-plus"), raw: true })}
<div class="chips doc-chips">${DOC_CHIPS.map((c, i) => `<span class="chip${i === 0 ? " chip-sel" : ""}">${c}</span>`).join("")}</div>
<div class="doc-body">
<div class="doc-empty"><b class="rt">Your vault is empty</b><span class="rs">Keep the papers you need — policies, licences, warranties — where you can find them.</span>${button("Add a document", { icon: "plus" })}</div>
<div class="doc-list">${section("Recently added")}<div class="ccard doc-row">${tileIcon("services", "document", true)}<span class="cc-tt"><b>${FILE}</b><span class="unlinked">2.1 MB · not linked yet</span></span></div></div>
<div class="ccard storage"><div class="st-row"><b class="rs">Storage</b><span class="rs"><span class="d0">0 KB of 1 GB</span><span class="d1">2.1 MB of 1 GB</span></span></div><div class="track"><i></i></div></div>
</div>
${sheet("Add a document", "Photos are compressed before they leave your phone.", `${button("Take a photo", { icon: "camera" })}${button("Choose from photos", { icon: "image" })}${button("Browse files", { icon: "folder", cls: "doc-browse" })}`, "doc-sheet")}
${tabBar("Documents")}
</div>`;
}

// document/[id].tsx for that file. Kind "Other" is the server default (Document.cs:36).
// The Link sheet lists "Not linked" and the reminders; these are the first rows of
// 01_home.png in due order (sample data: the real order is the API's).
const LINK_ROWS = ["Netflix Premium", "Pollution certificate (PUC)", "Car insurance", "Family health insurance", "Mom’s birthday"];
function documentScreen() {
  return `<div class="scr scr-docd">
${statusBar()}
${appBar(FILE, "Added 18 Nov 2026 · 2.1 MB", { lead: iconBtn("back") })}
<div class="ccard doc-prev">${tileIcon("services", "document")}<span class="rs">Open to view this file</span></div>
<div class="doc-acts">${button("Open", { icon: "eye" })}${button("Link", { icon: "link", cls: "doc-link" })}${button("Delete", { icon: "trash" })}</div>
<div class="ccard doc-det">
<div class="det"><span class="rs">Kind</span><b>Other</b></div><i class="div"></i>
<div class="det"><span class="rs">Linked reminder</span><b><span class="d0 muted">Not linked yet</span><span class="d1">Car insurance</span></b></div><i class="div"></i>
<div class="det"><span class="rs">Visible to</span><b><span class="d0">Only you, until it is linked to a shared reminder</span><span class="d1">You, and anyone the linked reminder is shared with</span></b></div>
</div>
${sheet("Link to a reminder", "", `<div class="link-list">${button("Not linked", { v: "primary" })}${LINK_ROWS.map((r) => button(r, { cls: r === "Car insurance" ? "link-car" : "" })).join("")}</div>`, "link-sheet")}
</div>`;
}

/* ----------------------------------------------------------------- Plans */
// PLAN_FEATURES, main:mobile/lib/billing/copy.ts:125-141, word for word. No price.
const PLAN_FEATURES = [
  { icon: "bell", label: "Active reminders", free: "10", premium: "Unlimited" },
  { icon: "folder", label: "Document storage", free: "100 MB", premium: "1 GB" },
  { icon: "users", label: "Family sharing", free: "—", premium: "You plus 5" },
];

/* ------------------------------------------------------------ Categories */
// CategorySeed.cs:22-28 (name, slug = tint, icon key; "certificate" maps to shieldCheck,
// lib/reminders/format.ts:99). Counts are sample data: the five rows of 01_home.png.
const CATS = [
  ["Vehicle", "vehicle", "car", 2], ["Documents", "documents", "document", 0], ["Insurance", "insurance", "shield", 1],
  ["Subscriptions", "subscriptions", "repeat", 1], ["Birthday", "birthday", "cake", 1], ["Services", "services", "wrench", 0],
  ["Warranty", "warranty", "shieldCheck", 0],
];
// categories.tsx: 2-column cards, "N items", the remove X on an empty card the owner may
// remove (CategoryService.cs:62), then "New category".
function categoriesScreen() {
  const total = CATS.reduce((s, c) => s + c[3], 0);
  return `<div class="scr scr-cats">
${statusBar()}
${appBar("Categories", `${total} reminders across ${CATS.length} groups`, { lead: iconBtn("back") })}
<div class="cat-grid">${CATS.map(([n, t, i, k]) => `<div class="cat${n === "Vehicle" ? " cat-veh" : ""}">${tileIcon(t, i)}<b class="rt">${n}</b><span class="tiny">${k} item${k === 1 ? "" : "s"}</span>${k === 0 ? `<span class="cat-x">${ic("close", "sm")}</span>` : ""}</div>`).join("")}<div class="cat-new"><span class="cat-new-ic">${ic("plus")}</span><span>New category</span></div></div>
</div>`;
}

// category/[id].tsx for Vehicle: health bar mint (nothing overdue), "Next:" = the PUC
// date, 7 days after 18 Nov 2026 (formatDateShort, en-IN).
function vehicleScreen() {
  const rows = NEXT_UP.filter((r) => r.tint === "vehicle");
  return `<div class="scr scr-veh">
${statusBar()}
${appBar("Vehicle", `${rows.length} reminders`, { lead: iconBtn("back") })}
<div class="ccard veh-sum"><div class="track track-ok"><i></i></div><div class="st-row"><span class="tiny">Nothing overdue</span><span class="tiny">Next: 25 Nov</span></div></div>
<div class="hdr veh-hdr"><b>Reminders</b></div>
${rows.map(row).join("")}
</div>`;
}

const phone = (inner, cls = "") => `<div class="phone-box ${cls}"><div class="phone"><div class="screen">${inner}</div></div></div>`;

/* ------------------------------------------------------------- Sections */
export function nxtdueSections(a, { ext, arrow }) {
  const demoAlt = "NxtDue demo: tap plus, type Car insurance, pick Insurance and 18 Dec 2026, tap Save. The phone then shows the notification: Car insurance expires in 30 days. Due Fri 18 Dec.";
  const docAlt = "NxtDue demo: on Documents, tap plus, choose Browse files. Car insurance.pdf lands in Recently added, not linked yet. Open it, tap Link, choose Car insurance in Link to a reminder.";
  const catAlt = "NxtDue demo: the Categories grid with Vehicle, Documents, Insurance, Subscriptions, Birthday, Services and Warranty. Tap Vehicle: Nothing overdue, and its two reminders.";
  const famAlt = "NxtDue demo: on Family, tap Invite a family member, type amma@gmail.com and Amma, keep Can edit, tap Send invite. The phone shows Invite ready, with WhatsApp and Copy link.";
  return `<section class="cl-hero" aria-labelledby="cl-title">
      <span class="tag live">${esc(a.status.label)}</span>
      <h1 id="cl-title">${esc(a.tagline)}</h1>
      <div class="cl-btns"><a class="cl-btn" href="${esc(a.cta.href)}"${ext(a.cta)}>${esc(a.cta.label)} <span aria-hidden="true">${arrow(a.cta)}</span></a>${a.cta2 ? `<a class="cl-btn" href="${esc(a.cta2.href)}"${ext(a.cta2)}>${esc(a.cta2.label)} <span aria-hidden="true">${arrow(a.cta2)}</span></a>` : ""}</div>
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
    </section>

    <section class="cl-demo cl-rev cl-fam" aria-labelledby="demo-fam-title">
      <div class="cl-demo-copy">
        <h2 id="demo-fam-title">${esc(a.clay.family)}</h2>
        <ol class="cl-steps" aria-hidden="true"><li><b>Invite someone</b><i></i></li><li><b>Send invite</b><i></i></li><li><b>Invite ready</b><i></i></li></ol>
        <p class="cl-note">${ic("lock", "sm")}Family sharing is Premium</p>
      </div>
      <div class="cl-demo-phone" role="img" aria-label="${esc(famAlt)}">
        ${phone(`${familyScreen()}${inviteScreen()}${inviteReady()}<span class="tap"></span>`, "ph-fam")}
      </div>
    </section>

    <section class="cl-demo cl-doc" aria-labelledby="demo-doc-title">
      <div class="cl-demo-copy">
        <h2 id="demo-doc-title">${esc(a.clay.docs)}</h2>
        <ol class="cl-steps" aria-hidden="true"><li><b>Add a document</b><i></i></li><li><b>Recently added</b><i></i></li><li><b>Link to a reminder</b><i></i></li></ol>
      </div>
      <div class="cl-demo-phone" role="img" aria-label="${esc(docAlt)}">
        ${phone(`${documentsScreen()}${documentScreen()}<span class="tap"></span>`, "ph-doc")}
      </div>
    </section>

    <section class="cl-cats" aria-labelledby="cats-title">
      <h2 id="cats-title">Categories</h2>
      <div class="bento">
        <div class="bento-card bento-phone" role="img" aria-label="${esc(catAlt)}">${phone(`${categoriesScreen()}${vehicleScreen()}<span class="tap"></span>`, "ph-cat")}</div>
${CATS.map(([n, t, i], k) => `        <div class="bento-card" style="--k:${k}">${tileIcon(t, i)}<b>${n}</b></div>`).join("\n")}
        <div class="bento-card bento-new" style="--k:7"><span class="cat-new-ic">${ic("plus")}</span><b>New category</b></div>
      </div>
    </section>

    <section class="cl-plans" aria-labelledby="plans-title">
      <h2 id="plans-title">Free vs Premium</h2>
      <div class="plans">
${[["Free", "free"], ["Premium", "premium"]].map(([name, key]) => `        <div class="plan plan-${key}"><h3>${name}</h3><ul>${PLAN_FEATURES.map((f) => `<li>${ic(f.icon, "md")}<span>${esc(f.label)}</span><b>${esc(f[key])}</b></li>`).join("")}</ul></div>`).join("\n")}
      </div>
    </section>

    <section class="cl-end" aria-labelledby="end-title">
      <img src="/assets/apps/nxtdue.webp" alt="" width="120" height="120" loading="lazy" />
      <h2 id="end-title">${esc(a.tagline)}</h2>
      <div class="cl-btns"><a class="cl-btn" href="${esc(a.cta.href)}"${ext(a.cta)}>${esc(a.cta.label)} <span aria-hidden="true">${arrow(a.cta)}</span></a>${a.cta2 ? `<a class="cl-btn" href="${esc(a.cta2.href)}"${ext(a.cta2)}>${esc(a.cta2.label)} <span aria-hidden="true">${arrow(a.cta2)}</span></a>` : ""}</div>
    </section>`;
}
