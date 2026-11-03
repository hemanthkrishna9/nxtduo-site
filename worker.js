// Sends www.nxtduo.com to nxtduo.com, sends renamed app paths to their new
// home, then serves the static site.
// The assets layer adds or removes trailing slashes with a 307; make those 301.
const MOVED = {
  // Arunachala was renamed Talk With Swamy. The app and store listings link here.
  '/arunachala': '/talk-with-swamy/',
  '/arunachala/': '/talk-with-swamy/',
  '/arunachala/privacy': '/talk-with-swamy/privacy/',
  '/arunachala/privacy/': '/talk-with-swamy/privacy/',
};

// Store buttons pass through here so the daily report can count the clicks.
// 302 and no-store: a browser must ask every time, or repeat clicks go uncounted.
const OUTBOUND = {
  '/go/nxtdue': 'https://apps.apple.com/app/nxtdue-renewal-reminders/id6804763092',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.nxtduo.com') {
      url.hostname = 'nxtduo.com';
      return Response.redirect(url.toString(), 301);
    }
    const out = OUTBOUND[url.pathname];
    if (out) {
      return new Response(null, { status: 302, headers: { Location: out, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
    }
    const to = MOVED[url.pathname];
    if (to) {
      url.pathname = to;
      return Response.redirect(url.toString(), 301);
    }
    const res = await env.ASSETS.fetch(request);
    if (res.status === 307) {
      const loc = res.headers.get('location');
      if (loc) return Response.redirect(new URL(loc, url).toString(), 301);
    }
    return res;
  },
};
