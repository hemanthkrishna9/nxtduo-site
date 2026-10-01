// Sends www.nxtduo.com to nxtduo.com, then serves the static site.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.nxtduo.com') {
      url.hostname = 'nxtduo.com';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
