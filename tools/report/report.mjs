// Daily traffic report for the NxtDuo sites, sent to Telegram.
// Shared by the Worker (index.mjs, every day at 6:00 IST) and setup.mjs (a first test run).
// Counts come from Cloudflare's own analytics for the nxtduo.com zone: nothing is added to the sites.
// People = visitors that loaded an HTML page and, from the same IP and user agent, its CSS or JS.
// Most scanners fetch only the page, often posing as a phone, so a browser-like user agent proves nothing.
// A returning visitor with CSS and JS still cached is missed, so the count is a floor.
// Only pages that loaded (status 200) count, so scans for /wp-admin/ and the like do not.

const IST_MS = (5 * 60 + 30) * 60 * 1000;
const SITES = [
  { host: "nxtduo.com", name: "nxtduo.com", url: "https://nxtduo.com/" },
  { host: "publik.nxtduo.com", name: "Publik", url: "https://publik.nxtduo.com/" },
  { host: "ramana.nxtduo.com", name: "Talk With Swamy", url: "https://ramana.nxtduo.com/" },
];
// Successful API calls worth a line in the report, per host.
const ACTIONS = {
  "publik.nxtduo.com": [["/api/reports", "place cards opened"], ["/api/report", "reports sent"], ["/api/visit", "“I went here”"]],
  "ramana.nxtduo.com": [["/api/chat", "chat messages"]],
};
const BOT_RE = /bot|crawl|spider|externalhit|whatsapp|telegram|slack|skype|preview|go-http|python|curl|wget|headless|read-aloud|forestengine|checker|networkingextension|scan|^node$|^mozilla\/5\.0( \(compatible\))?$|^$/i;
const BARE_RE = /^Mozilla\/5\.0 \([^)]*\) AppleWebKit\/537\.36$/;
// One fixed old iPhone string, used from hundreds of data-centre IPs and by no real phone we have seen.
const FAKE_PHONE_RE = /iPhone OS 13_2_3 /;
const isBot = (ua) => BOT_RE.test(ua || "") || BARE_RE.test(ua || "") || FAKE_PHONE_RE.test(ua || "");
// An IPv6 device changes its address often but keeps the first four groups (its /64 network).
const person = (ip) => (ip.includes(":") ? ip.split(":").slice(0, 4).join(":") : ip);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function cf(token, path, body) {
  const res = await fetch("https://api.cloudflare.com/client/v4" + path, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const out = await res.json();
  if (out.errors?.length) throw new Error("Cloudflare: " + out.errors.map((e) => e.message).join("; "));
  return out;
}

// IST calendar day that ended most recently, and the one before it, as UTC instants.
function days(now = Date.now()) {
  const todayIst = new Date(now + IST_MS);
  todayIst.setUTCHours(0, 0, 0, 0);
  const start = todayIst.getTime() - IST_MS - 86400000; // yesterday 00:00 IST
  return { prev: start - 86400000, start, end: start + 86400000 };
}

export async function buildReport(token, now = Date.now()) {
  const zone = (await cf(token, "/zones?name=nxtduo.com")).result?.[0]?.id;
  if (!zone) throw new Error("The token cannot see the nxtduo.com zone (it needs Zone Read and Analytics Read).");
  const { prev, start, end } = days(now);
  const hosts = SITES.map((s) => `"${s.host}"`).join(",");
  const f = (from, to) => `datetime_geq:$${from}, datetime_lt:$${to}, clientRequestHTTPHost_in:[${hosts}]`;
  const pages = (from, to) => `httpRequestsAdaptiveGroups(limit:10000, filter:{${f(from, to)}, edgeResponseContentTypeName:"html", edgeResponseStatus:200}){
      count dimensions{ clientRequestHTTPHost clientRequestPath clientIP userAgent clientCountryName } }`;
  const assets = (from, to) => `httpRequestsAdaptiveGroups(limit:10000, filter:{${f(from, to)}, edgeResponseContentTypeName_in:["css","js"]}){
      count dimensions{ clientIP userAgent } }`;
  const q = `query($z:String!,$p:Time!,$s:Time!,$u:Time!){viewer{zones(filter:{zoneTag:$z}){
    pagesY: ${pages("s", "u")}
    pagesP: ${pages("p", "s")}
    assetsY: ${assets("s", "u")}
    assetsP: ${assets("p", "s")}
    api: httpRequestsAdaptiveGroups(limit:200, filter:{${f("s", "u")}, clientRequestPath_like:"/api/%", edgeResponseStatus:200}){
      count dimensions{ clientRequestHTTPHost clientRequestPath } }
  }}}`;
  const vars = { z: zone, p: new Date(prev).toISOString(), s: new Date(start).toISOString(), u: new Date(end).toISOString() };
  const z = (await cf(token, "/graphql", { query: q, variables: vars })).data.viewer.zones[0];

  const key = (d) => d.clientIP + " " + d.userAgent;
  const tally = (rows, assetRows) => {
    const browsers = new Set(assetRows.map((r) => key(r.dimensions)));
    const sites = Object.fromEntries(SITES.map((s) => [s.host, { ips: new Set(), views: 0, paths: new Map() }]));
    const all = new Set(), filtered = new Set(), countries = new Map();
    for (const r of rows) {
      const d = r.dimensions;
      const s = sites[d.clientRequestHTTPHost];
      if (!s) continue;
      const who = person(d.clientIP);
      if (isBot(d.userAgent) || !browsers.has(key(d))) {
        filtered.add(who);
        continue;
      }
      s.ips.add(who);
      s.views += r.count;
      all.add(who);
      s.paths.set(d.clientRequestPath, (s.paths.get(d.clientRequestPath) || 0) + r.count);
      if (!countries.has(d.clientCountryName)) countries.set(d.clientCountryName, new Set());
      countries.get(d.clientCountryName).add(who);
    }
    for (const who of all) filtered.delete(who);
    return { sites, all, filtered, countries };
  };
  const yest = tally(z.pagesY, z.assetsY), before = tally(z.pagesP, z.assetsP);
  const actions = new Map();
  for (const r of z.api) {
    const d = r.dimensions;
    const k = d.clientRequestHTTPHost + d.clientRequestPath;
    actions.set(k, (actions.get(k) || 0) + r.count);
  }

  const trend = (a, b) => (b === 0 ? (a ? " (new)" : "") : ` (${a >= b ? "▲" : "▼"} ${Math.round((Math.abs(a - b) / b) * 100)}%)`);
  const label = new Date(start + IST_MS).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  const lines = [`📊 <b>NxtDuo daily report</b> · ${label}`, `👥 <b>${yest.all.size}</b> people across all sites${trend(yest.all.size, before.all.size)}`, ""];
  for (const site of SITES) {
    const y = yest.sites[site.host], p = before.sites[site.host];
    lines.push(`<b><a href="${site.url}">${esc(site.name)}</a></b>: ${y.ips.size} ${y.ips.size === 1 ? "person" : "people"}${trend(y.ips.size, p.ips.size)} · ${y.views} page ${y.views === 1 ? "view" : "views"}`);
    const top = [...y.paths].sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (top.length) lines.push(`   top: ${top.map(([path, n]) => `${esc(decodeURIComponent(path))} (${n})`).join(", ")}`);
    const acts = (ACTIONS[site.host] || []).map(([path, what]) => [actions.get(site.host + path) || 0, what]).filter(([n]) => n);
    if (acts.length) lines.push(`   ${acts.map(([n, what]) => `${n} ${what}`).join(" · ")}`);
  }
  const topC = [...yest.countries].map(([c, ips]) => [c, ips.size]).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (topC.length) lines.push("", `🌍 ${topC.map(([c, n]) => `${esc(c || "?")} ${n}`).join(" · ")}`);
  lines.push("", `🤖 ${yest.filtered.size} bots and scanners not counted`);
  lines.push("", "<i>People = browsers that loaded the page and its CSS or JS, so returning visitors can be missed. Day in IST.</i>");
  return lines.join("\n");
}

export async function sendTelegram(botToken, chatId, text) {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
  });
  const out = await res.json();
  if (!out.ok) throw new Error("Telegram: " + out.description);
}
