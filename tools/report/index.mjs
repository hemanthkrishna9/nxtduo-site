// nxtduo-report Worker: posts yesterday's traffic to the NxtDuo Telegram channel every day at 6:00 IST.
// It has no web address (no routes, no workers.dev), only the cron in wrangler.jsonc.
// Secrets (set by setup.mjs, never in git): CF_ANALYTICS_TOKEN, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
import { buildReport, sendTelegram } from "./report.mjs";

export default {
  async scheduled(_event, env) {
    let text;
    try {
      text = await buildReport(env.CF_ANALYTICS_TOKEN);
    } catch (e) {
      text = `⚠️ NxtDuo daily report failed: ${String(e.message || e).slice(0, 200)}`;
    }
    await sendTelegram(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID, text);
  },
};
