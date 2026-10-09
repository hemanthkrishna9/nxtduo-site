// Sends www.nxtduo.com to nxtduo.com, then serves the static site.
// The assets layer adds or removes trailing slashes with a 307; make those 301.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.nxtduo.com') {
      url.hostname = 'nxtduo.com';
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
