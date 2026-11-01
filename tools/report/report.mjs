// Daily traffic report for the NxtDuo sites, sent to Telegram.
// Shared by the Worker (index.mjs, every day at 6:00 IST) and setup.mjs (a first test run).
// Counts come from Cloudflare's own analytics for the nxtduo.com zone: nothing is added to the sites.
// People = distinct IPs that loaded an HTML page, with bots, crawlers and link previews removed
// (same rules as PUBLIK-Bangalore/scripts/traffic.py).
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
const BOT_RE = /bot|crawl|spider|externalhit|whatsapp|telegram|slack|skype|preview|go-http|python|curl|wget|headless|read-aloud|forestengine|checker|networkingextension|^mozilla\/5\.0 \(compatible\)$|^$/i;
const BARE_RE = /^Mozilla\/5\.0 \([^)]*\) AppleWebKit\/537\.36$/;
const isBot = (ua) => BOT_RE.test(ua || "") || BARE_RE.test(ua || "");
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
  const f = `datetime_geq:$s, datetime_lt:$u, clientRequestHTTPHost_in:[${hosts}]`;
  const q = `query($z:String!,$s:Time!,$u:Time!){viewer{zones(filter:{zoneTag:$z}){
    pages: httpRequestsAdaptiveGroups(limit:10000, filter:{${f}, edgeResponseContentTypeName:"html", edgeResponseStatus:200}){
      count dimensions{ clientRequestHTTPHost clientRequestPath clientIP userAgent clientCountryName datetimeHour } }
    api: httpRequestsAdaptiveGroups(limit:200, filter:{${f}, clientRequestPath_like:"/api/%", edgeResponseStatus:200}){
      count dimensions{ clientRequestHTTPHost clientRequestPath datetimeHour } }
  }}}`;
  const vars = { z: zone, s: new Date(prev).toISOString(), u: new Date(end).toISOString() };
  const z = (await cf(token, "/graphql", { query: q, variables: vars })).data.viewer.zones[0];

  const blank = () => ({ ips: new Set(), views: 0, paths: new Map() });
  const day = { y: Object.fromEntries(SITES.map((s) => [s.host, blank()])), p: Object.fromEntries(SITES.map((s) => [s.host, blank()])) };
  const countries = new Map();
  const allY = new Set(), allP = new Set();
  for (const r of z.pages) {
    const d = r.dimensions;
    if (isBot(d.userAgent)) continue;
    const yesterday = Date.parse(d.datetimeHour) >= start;
    const s = (yesterday ? day.y : day.p)[d.clientRequestHTTPHost];
    if (!s) continue;
    s.ips.add(d.clientIP);
    s.views += r.count;
    (yesterday ? allY : allP).add(d.clientIP);
    if (yesterday) {
      s.paths.set(d.clientRequestPath, (s.paths.get(d.clientRequestPath) || 0) + r.count);
      if (!countries.has(d.clientCountryName)) countries.set(d.clientCountryName, new Set());
      countries.get(d.clientCountryName).add(d.clientIP);
    }
  }
  const actions = new Map();
  for (const r of z.api) {
    const d = r.dimensions;
    if (Date.parse(d.datetimeHour) < start) continue;
    const k = d.clientRequestHTTPHost + d.clientRequestPath;
    actions.set(k, (actions.get(k) || 0) + r.count);
  }

  const trend = (a, b) => (b === 0 ? (a ? " (new)" : "") : ` (${a >= b ? "▲" : "▼"} ${Math.round((Math.abs(a - b) / b) * 100)}%)`);
  const label = new Date(start + IST_MS).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  const lines = [`📊 <b>NxtDuo daily report</b> · ${label}`, `👥 <b>${allY.size}</b> people across all sites${trend(allY.size, allP.size)}`, ""];
  for (const site of SITES) {
    const y = day.y[site.host], p = day.p[site.host];
    lines.push(`<b><a href="${site.url}">${esc(site.name)}</a></b>: ${y.ips.size} people${trend(y.ips.size, p.ips.size)} · ${y.views} page views`);
    const top = [...y.paths].sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (top.length) lines.push(`   top: ${top.map(([path, n]) => `${esc(decodeURIComponent(path))} (${n})`).join(", ")}`);
    const acts = (ACTIONS[site.host] || []).map(([path, what]) => [actions.get(site.host + path) || 0, what]).filter(([n]) => n);
    if (acts.length) lines.push(`   ${acts.map(([n, what]) => `${n} ${what}`).join(" · ")}`);
  }
  const topC = [...countries].map(([c, ips]) => [c, ips.size]).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (topC.length) lines.push("", `🌍 ${topC.map(([c, n]) => `${esc(c || "?")} ${n}`).join(" · ")}`);
  lines.push("", "<i>People = different visitors (by IP), bots removed. Day in IST.</i>");
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
