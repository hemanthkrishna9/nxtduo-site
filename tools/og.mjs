// Renders the 1200x630 social preview cards (assets/og/<slug>.jpg and
// assets/og/home.jpg) with local Google Chrome over the DevTools protocol.
// Usage: node tools/og.mjs   then   node tools/build.mjs
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { apps } from "./apps.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const asset = (p) => pathToFileURL(join(ROOT, p)).href;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

const BASE = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{font-family:"Plus Jakarta Sans",sans-serif;color:#0b2a26;background:#f3f8f6;position:relative}
.brand{position:absolute;left:64px;bottom:52px;display:flex;align-items:center;gap:12px;font-weight:800;font-size:26px}
.brand img{width:44px;height:44px}.brand b{color:#13866f;font-weight:600}
.url{position:absolute;right:64px;bottom:58px;font-weight:700;font-size:22px;color:#4d6b65}
</style>`;

function appCard(a) {
  return `${BASE}<style>
body{background:radial-gradient(60% 90% at 22% 45%, color-mix(in srgb, ${a.accent} 38%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in srgb, ${a.accent} 10%, #f3f8f6), #f3f8f6)}
.icon{position:absolute;left:70px;top:105px;width:330px;height:330px;border-radius:76px;box-shadow:0 40px 70px color-mix(in srgb, ${a.accentInk} 35%, transparent)}
.copy{position:absolute;left:470px;right:64px;top:118px}
.tag{display:inline-block;padding:8px 16px;border-radius:999px;background:#fff;color:${a.accentInk};font-weight:800;font-size:18px;letter-spacing:.08em;text-transform:uppercase;border:2px solid color-mix(in srgb, ${a.accentInk} 25%, transparent)}
h1{margin:22px 0 0;font-size:${a.name.length > 12 ? 84 : 100}px;line-height:1;letter-spacing:-.045em;font-weight:800}
p{margin:16px 0 0;font-family:"Instrument Serif",serif;font-style:italic;font-size:46px;line-height:1.1;color:${a.accentInk}}
</style>
<img class="icon" src="${asset(`assets/apps/${a.slug}.webp`)}">
<div class="copy"><span class="tag">${esc(a.status.label)}</span><h1>${esc(a.name)}</h1><p>${esc(a.tagline)}</p></div>
<div class="brand"><img src="${asset("assets/nxtduo-icon-96.webp")}"><span>NXT<b>Duo</b></span></div>
<div class="url">nxtduo.com/${a.slug}</div>`;
}

function homeCard() {
  const icons = apps.map((a) => `<img src="${asset(`assets/apps/${a.slug}.webp`)}">`).join("");
  return `${BASE}<style>
body{background:radial-gradient(60% 80% at 85% 40%, #c9f0e2, transparent 70%), #f3f8f6}
h1{position:absolute;left:64px;top:120px;margin:0;width:560px;font-size:92px;line-height:.98;letter-spacing:-.045em;font-weight:800}
h1 em{font-family:"Instrument Serif",serif;font-weight:400;color:#13866f}
.grid{position:absolute;right:70px;top:70px;display:grid;grid-template-columns:repeat(3,140px);gap:24px}
.grid img{width:140px;height:140px;border-radius:32px;box-shadow:0 14px 28px rgba(11,42,38,.2)}
</style>
<h1>${apps.length} apps for <em>everyday</em> life.</h1>
<div class="grid">${icons}</div>
<div class="brand"><img src="${asset("assets/nxtduo-icon-96.webp")}"><span>NXT<b>Duo</b></span></div>
<div class="url" style="left:64px;right:auto;bottom:118px">nxtduo.com</div>`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tmp = mkdtempSync(join(tmpdir(), "nxtduo-og-"));
const port = 9500 + Math.floor(Math.random() * 300);
const chrome = spawn(CHROME, ["--headless=new", "--hide-scrollbars", "--allow-file-access-from-files", `--remote-debugging-port=${port}`, `--user-data-dir=${join(tmp, "profile")}`, "about:blank"], { stdio: "ignore" });
try {
  let wsUrl;
  for (let i = 0; i < 40 && !wsUrl; i++) {
    await sleep(250);
    try { wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page")?.webSocketDebuggerUrl; } catch {}
  }
  if (!wsUrl) throw new Error("Chrome did not start. Set CHROME=/path/to/chrome");
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });

  mkdirSync(join(ROOT, "assets/og"), { recursive: true });
  const cards = [["home", homeCard()], ...apps.map((a) => [a.slug, appCard(a)])];
  for (const [slug, html] of cards) {
    const file = join(tmp, `${slug}.html`);
    writeFileSync(file, html);
    await send("Page.navigate", { url: pathToFileURL(file).href });
    await sleep(1500); // fonts
    const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 86 });
    writeFileSync(join(ROOT, `assets/og/${slug}.jpg`), Buffer.from(data, "base64"));
    console.log(`assets/og/${slug}.jpg`);
  }
  ws.close();
} finally {
  chrome.kill();
  await sleep(300);
  rmSync(tmp, { recursive: true, force: true });
}
