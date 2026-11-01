// One-time setup for the nxtduo-report Worker. Run it yourself in a terminal (tokens are typed, never shown):
//   cd ~/WorkSpace/NxtDuo-Web/tools/report && node --use-system-ca setup.mjs
// It finds the Telegram channel the bot was added to, sends a test report there,
// then stores the three secrets in Cloudflare with `wrangler secret put`.
import { spawnSync } from "node:child_process";
import { buildReport, sendTelegram } from "./report.mjs";

const WRANGLER = new URL("../../../PUBLIK-Bangalore/node_modules/.bin/wrangler", import.meta.url).pathname;

function askHidden(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const onData = (ch) => {
      if (ch === "\r" || ch === "\n") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.off("data", onData);
        process.stdout.write("\n");
        resolve(value.trim());
      } else if (ch === "\u0003") process.exit(1);
      else if (ch === "\u007f") value = value.slice(0, -1);
      else value += ch;
    };
    stdin.on("data", onData);
  });
}

function putSecret(name, value) {
  const r = spawnSync(WRANGLER, ["secret", "put", name], { input: value, encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "--use-system-ca" } });
  if (r.status !== 0) throw new Error(`wrangler secret put ${name} failed:\n${r.stderr || r.stdout}`);
  console.log(`  saved ${name}`);
}

console.log("NxtDuo daily report setup\n");
const bot = await askHidden("1. Paste the bot token from BotFather, then press Enter (it stays hidden): ");
const me = await (await fetch(`https://api.telegram.org/bot${bot}/getMe`)).json();
if (!me.ok) throw new Error("That bot token did not work: " + me.description);
console.log(`   Bot: @${me.result.username}`);

const upd = await (await fetch(`https://api.telegram.org/bot${bot}/getUpdates?allowed_updates=%5B%22channel_post%22%2C%22my_chat_member%22%2C%22message%22%5D`)).json();
const chats = new Map();
for (const u of upd.result || []) {
  const c = (u.channel_post || u.my_chat_member || u.message)?.chat;
  if (c && c.type !== "private") chats.set(c.id, c.title);
}
if (!chats.size) throw new Error("No channel found. Make sure the bot is an admin of the channel, send a new message in the channel, then run this again.");
const [chatId, title] = [...chats].pop();
console.log(`   Channel: ${title}`);

console.log("\n2. Cloudflare token: dashboard > My Profile > API Tokens > Create Token > Custom token.");
console.log("   Permissions: Zone / Zone / Read  and  Zone / Analytics / Read.  Zone resources: Include > Specific zone > nxtduo.com.");
const cf = await askHidden("   Paste the Cloudflare token, then press Enter (it stays hidden): ");

console.log("\n3. Sending a test report to the channel...");
await sendTelegram(bot, chatId, (await buildReport(cf)) + "\n\n✅ <i>Test from setup. From tomorrow this arrives every day at 6:00 am IST.</i>");
console.log("   Sent. Check the channel.");

console.log("\n4. Saving the secrets in Cloudflare (Worker nxtduo-report)...");
putSecret("TELEGRAM_BOT_TOKEN", bot);
putSecret("TELEGRAM_CHAT_ID", String(chatId));
putSecret("CF_ANALYTICS_TOKEN", cf);
console.log("\nDone. The report will arrive every day at 6:00 am IST.");
