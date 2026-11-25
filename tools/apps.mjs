// The NxtDuo app list. Order here is the order on the site.
// After editing, run `node tools/build.mjs` (and `node tools/og.mjs` for new
// social images). See tools/README.md.
//
// status.kind: live | review | dev | idea  (keep it honest)
// accentInk must pass 4.5:1 on white: it is used for text and buttons.
// privacy body lives in tools/privacy/<slug>.html

export const SITE = "https://nxtduo.com";
export const EMAIL = "support@nxtduo.com";

// Company profiles, shown on the home page and listed as sameAs for search engines.
// icon: a key in tools/social-icons.mjs
export const SOCIAL = [
  { name: "Instagram", icon: "instagram", href: "https://www.instagram.com/nxtduoworld" },
  { name: "Facebook", icon: "facebook", href: "https://www.facebook.com/profile.php?id=61595713337787" },
  { name: "X", icon: "x", href: "https://x.com/NxtDuo" },
  { name: "YouTube", icon: "youtube", href: "https://www.youtube.com/@nxtduoworld" },
  { name: "Reddit", icon: "reddit", href: "https://www.reddit.com/user/nxtduoworld/" },
];

const mail = (subject) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;

export const apps = [
  {
    slug: "talk-with-swamy",
    name: "Talk With Swamy",
    short: "Ramana Maharshi's words",
    category: "Spiritual · Chat",
    tagline: "Sit with Ramana Maharshi's words.",
    summary:
      "A quiet chat on the teachings of Sri Ramana Maharshi. Ask in your own words; it answers in his calm style, using only passages from his recorded words in 10 books, and names the book each answer comes from.",
    status: { label: "Live on the web & iPhone", kind: "live" },
    statusNote: "Free on the web and the App Store. Android is coming soon.",
    chips: ["Web", "iPhone", "Android soon", "Free"],
    accent: "#c9a23a",
    accentInk: "#2e7d4f",
    cta: { label: "Open Talk With Swamy", href: "https://ramana.nxtduo.com", external: true },
    cta2: { label: "Get it on the App Store", href: "/go/talk-with-swamy", external: true },
    facts: { Status: "Live on web and iPhone · Android soon", Platforms: "Web, iPhone (Android soon)", Price: "Free", Language: "English" },
    seo: {
      title: "Talk With Swamy: chat with Ramana Maharshi's words",
      description:
        "Talk With Swamy is a free AI chat app that answers questions using only the recorded words of Sri Ramana Maharshi, and names the source book for every answer.",
      appCategory: "LifestyleApplication",
      os: "Web, iOS",
      sameAs: ["https://apps.apple.com/app/arunachala-talk-with-swamy/id6820882475"],
      free: true,
      download: "https://apps.apple.com/app/arunachala-talk-with-swamy/id6820882475",
    },
    legacy: ["arunachala"],
    sections: [
      {
        h: "What it does",
        html: `<p>Behind every answer is a small library: 436 passages from 10 books of his recorded words. The app finds the passages closest to your question and answers from those passages alone. Each answer names its source book, so you can go back to the book and read the full passage. Quotes are checked word for word against the books.</p>
<p>It does not make up teachings, and it does not pretend to be him. If you ask, it says plainly that it is an AI.</p>`,
      },
      {
        h: "Who it is for",
        html: `<p>For anyone drawn to self-enquiry, the question "Who am I?", or simply to his way of seeing a worry, a loss or a busy mind. It is a way to sit with his words for a few minutes. It is not a replacement for reading the books, for a teacher, or for professional help.</p>
<p>Talk With Swamy is an independent project by NxtDuo. It is not an official app of Sri Ramanasramam and is not endorsed by it. It was earlier called Arunachala.</p>`,
      },
      {
        h: "How to get it",
        html: `<p>Use it now in your browser at <a href="https://ramana.nxtduo.com">ramana.nxtduo.com</a>. New to his teaching? Read <a href="https://ramana.nxtduo.com/who-am-i-nan-yar/">Who am I? (Nan Yar) explained</a> or <a href="https://ramana.nxtduo.com/faq/">the questions and answers</a>. On iPhone, get it free on the <a href="/go/talk-with-swamy">App Store</a>. The Android app is coming soon. It is free, with no paid tier; to keep it free, each device has a daily message limit.</p>`,
      },
    ],
    faq: [
      ["Is it Ramana Maharshi speaking?", "No. It is an AI that answers only from passages of his recorded words, and every answer names the book it comes from. If you ask, it tells you it is an AI."],
      ["Is it free?", "Yes. Talk With Swamy is free and has no paid tier. Each device has a daily message limit so that it can stay free."],
      ["What if I am feeling very low?", "Please talk to a person. In India, the Tele-MANAS helpline is free: call 14416 or 1-800-891-4416. The app shows this helpline when a message suggests someone is in distress."],
    ],
    privacy: { effective: "11 October 2026", intro: "This policy explains what happens to your data when you use Talk With Swamy on iPhone, Android or the web. In short: there are no accounts, no ads and no tracking, and we do not keep your conversations." },
  },
  {
    slug: "nxtdue",
    name: "NxtDue",
    short: "Renewal reminders",
    category: "Productivity · Reminders",
    tagline: "Never miss a renewal.",
    summary:
      "Vehicle insurance, PUC, passports, subscriptions, warranties: add them once and NxtDue reminds you in time, with notifications that actually arrive. No ads, no data selling.",
    status: { label: "Live on iPhone & Android", kind: "live" },
    statusNote: "Free on the App Store and Google Play.",
    chips: ["iPhone", "Android", "Free plan"],
    accent: "#8b72ff",
    accentInk: "#5b3fe0",
    cta: { label: "Get it on the App Store", href: "/go/nxtdue", external: true },
    cta2: { label: "Get it on Google Play", href: "/go/nxtdue-android", external: true },
    // Own page template (tools/nxtdue-page.mjs). demo1 reuses the live "What it does" line below.
    page: "clay",
    // Section titles reuse the live "What it does" lines below.
    clay: { demo1: "Reminders that arrive early", family: "Share with family", docs: "Documents kept with the reminder" },
    facts: { Status: "Live on iPhone and Android", Platforms: "iPhone, Android", Price: "Free plan · Premium" },
    seo: {
      title: "NxtDue: renewal reminders for insurance, PUC, passports and more",
      description:
        "NxtDue reminds you before insurance, PUC, passports, subscriptions and warranties expire. No ads, no data selling.",
      appCategory: "ProductivityApplication",
      os: "iOS, Android",
      sameAs: ["https://apps.apple.com/app/nxtdue-renewal-reminders/id6804763092", "https://play.google.com/store/apps/details?id=com.nxtdue.app"],
      free: true,
      download: "https://apps.apple.com/app/nxtdue-renewal-reminders/id6804763092",
    },
    sections: [
      {
        h: "What it does",
        html: `<ul class="features">
<li><b>Reminders that arrive early</b><span>30, 15, 7 and 3 days before, and on the day, by push and email. Recurring renewals roll forward with one tap.</span></li>
<li><b>Documents kept with the reminder</b><span>Attach the policy PDF, the warranty card or a photo of the receipt, so the paperwork is there when you need to claim.</span></li>
<li><b>Share with family</b><span>Share one reminder, not your whole account. Everyone sees what is due.</span></li>
<li><b>Built for patchy networks</b><span>Add reminders offline; they sync later. Lock the app with Face ID or your fingerprint.</span></li>
</ul>`,
      },
      {
        h: "Who it is for",
        html: `<p>Anyone in India who has ever paid a late fee, driven with an expired PUC, or found a forgotten subscription on a card statement. We built it for our own family first, because we kept missing renewals.</p>`,
      },
      {
        h: "How to get it",
        html: `<p>Get it free on the <a href="/go/nxtdue">App Store</a> for iPhone or on <a href="/go/nxtdue-android">Google Play</a> for Android. There is a free plan and an optional Premium plan.</p>`,
      },
    ],
    faq: [
      ["Is NxtDue free?", "There is a free plan, and an optional Premium plan."],
      ["Can I delete my data?", "Yes. You can export or delete everything yourself in the app's Settings."],
    ],
    privacy: { effective: "5 October 2026", intro: "A short summary of how NxtDue handles your data. The full policy is on nxtdue.com." },
  },
  {
    slug: "passon",
    name: "PassOn",
    short: "Pass on a ticket you can't use",
    category: "Community · Tickets",
    tagline: "Can't go? Pass it on.",
    summary:
      "Can't use your movie or event ticket? List it on PassOn and give it free to someone who needs one. You chat on PassOn without sharing your phone number. PassOn never handles money.",
    status: { label: "Live on the web", kind: "live" },
    statusNote: "Free at passon.nxtduo.com. The App Store and Google Play apps are coming soon.",
    chips: ["Web", "Works on phones", "Free", "English · తెలుగు · हिंदी"],
    accent: "#2bb3a3",
    accentInk: "#0f4c45",
    cta: { label: "Open PassOn", href: "https://passon.nxtduo.com", external: true },
    facts: { Status: "Live on the web · apps coming soon", Platform: "Web (phone and laptop)", Price: "Free", Languages: "English, Telugu, Hindi" },
    seo: {
      title: "PassOn: can't go? Pass your movie or event ticket on, free",
      description:
        "PassOn is a free website to pass on a movie or event ticket you can't use. Chat without sharing your number. PassOn never handles money.",
      appCategory: "LifestyleApplication",
      os: "Web",
      sameAs: ["https://passon.nxtduo.com/"],
      free: true,
    },
    sections: [
      {
        h: "How it works",
        html: `<ol>
<li>Can't go? List your movie or event ticket. Every ticket on PassOn is free to take.</li>
<li>People who need a ticket chat with you on PassOn. Nobody sees your phone number unless you choose to share it.</li>
<li>You give the ticket to one person in the chat. Only that person sees the ticket.</li>
<li>Once they are inside, they can say thank you by UPI if they want. Never pay before you are inside.</li>
</ol>`,
      },
      {
        h: "Who it is for",
        html: `<p>Anyone whose plans changed after booking, and anyone looking for a ticket to a show that is sold out. PassOn is a free help-people project: no ads, no fees, and PassOn never touches money.</p>`,
      },
      {
        h: "How to get it",
        html: `<p>Open <a href="https://passon.nxtduo.com">passon.nxtduo.com</a> on any phone or laptop. You can add it to your home screen from the browser. The App Store and Google Play apps are coming soon.</p>`,
      },
    ],
    faq: [
      ["Is PassOn free?", "Yes. Every ticket on PassOn is free to take, and there are no fees or ads."],
      ["Will people see my phone number?", "No. You chat on PassOn without sharing it. People see it only if you choose to share it."],
      ["Is there an app?", "Use it now on the web at passon.nxtduo.com. The App Store and Google Play apps are coming soon."],
    ],
    privacy: { effective: "20 November 2026", intro: "A short summary of how PassOn handles your data. The full policy is on passon.nxtduo.com." },
  },
  {
    slug: "publik",
    name: "Publik",
    short: "Bengaluru's public spaces",
    category: "City guide · Bengaluru",
    tagline: "Every park, lake and library in Bengaluru.",
    summary:
      "A free guide to about 1,880 public spaces in Bengaluru: parks, playgrounds, lakes, libraries and public toilets, with timings, directions, \"open now\" and \"near me\". Visitors can add photos and notes, and flag a place that is under repair.",
    status: { label: "Live", kind: "live" },
    statusNote: "Free on the web at publik.nxtduo.com.",
    chips: ["Web", "Works on phones", "Free", "No sign-in"],
    accent: "#f08db8",
    accentInk: "#1f5132",
    cta: { label: "Open Publik", href: "https://publik.nxtduo.com", external: true },
    facts: { Status: "Live", Platform: "Web (phone and laptop)", Price: "Free", Places: "About 1,880 in Bengaluru" },
    seo: {
      title: "Publik: Bengaluru Parks, Lakes and Libraries",
      description:
        "Publik is a free guide to about 1,880 public spaces in Bengaluru: parks, playgrounds, lakes, libraries and public toilets, with timings, directions and photos.",
      appCategory: "TravelApplication",
      os: "Web",
      sameAs: ["https://publik.nxtduo.com/"],
      free: true,
    },
    sections: [
      {
        h: "What it does",
        html: `<ul class="features">
<li><b>Find a place</b><span>Search or filter parks, playgrounds, lakes, libraries and public toilets across Bengaluru.</span></li>
<li><b>Open now, near me</b><span>See what is open right now and what is closest, on a list or a map.</span></li>
<li><b>Before you go</b><span>Timings, directions, and short tips from people who went, including playground safety.</span></li>
<li><b>Add a photo or a note</b><span>Share a photo or a short note about a place, so the next visitor knows what to expect.</span></li>
<li><b>Flag a problem</b><span>Report a place that is under repair. No account, nothing about you is stored.</span></li>
</ul>`,
      },
      {
        h: "Where the data comes from",
        html: `<p>The list combines the BBMP park list (via OpenCity), OpenStreetMap, and publicly listed opening hours. Places change, so the tips and reports from visitors help keep it honest.</p>`,
      },
      {
        h: "Who it is for",
        html: `<p>Parents looking for a playground, walkers looking for a quiet lake, students looking for a library, and anyone who needs a public toilet in a hurry. It is a website, so it works on any phone with nothing to install.</p>`,
      },
    ],
    faq: [
      ["Is Publik free?", "Yes. It is a free website at publik.nxtduo.com, with no sign-in."],
      ["How many places are in Publik?", "About 1,880 public spaces in Bengaluru: parks, playgrounds, lakes, libraries and public toilets."],
      ["Does it track my location?", "No. \"Near me\" uses your location only inside your browser to sort places. It is never sent to us."],
      ["A place is wrong. What do I do?", "Use the report buttons on the place, or write to support@nxtduo.com."],
    ],
    privacy: { effective: "13 October 2026", intro: "Publik is a website with no accounts. This policy explains what it stores, including the photos and notes people post, and the services it uses." },
  },
  {
    slug: "meter-mele",
    name: "Meter Mele",
    alt: { text: "ಮೀಟರ್ ಮೇಲೆ", lang: "kn" },
    short: "Bengaluru auto game",
    category: "Game · Driving",
    tagline: "Beat the meter across real Bengaluru.",
    summary:
      "Drive an auto through streets built from real map data. Pick up passengers and get them there before the meter beats you. Potholes, rain, night rides and leaderboards, in the browser on any phone or laptop.",
    status: { label: "Live · Play free", kind: "live" },
    statusNote: "Free in your browser at meter-mele.pages.dev.",
    chips: ["Browser game", "Phones and laptops", "Leaderboards", "Free"],
    accent: "#f5c518",
    accentInk: "#7a5600",
    cta: { label: "Play now", href: "https://meter-mele.pages.dev", external: true },
    facts: { Status: "Live", Platform: "Browser (phone and laptop)", Price: "Free", Install: "Nothing to install" },
    seo: {
      title: "Meter Mele: a Bengaluru auto-rickshaw game in your browser",
      description:
        "Meter Mele is a free browser game: drive an auto through real Bengaluru streets, beat the meter, dodge potholes and climb the leaderboards.",
      appCategory: "GameApplication",
      os: "Web",
      sameAs: ["https://meter-mele.pages.dev/"],
      free: true,
    },
    sections: [
      {
        h: "What it does",
        html: `<p>The map is a slice of real central Bengaluru from OpenStreetMap: MG Road, Brigade Road, Church Street, Cubbon Park, Vidhana Soudha and the purple metro line. You hail a passenger, agree the fare, and race the clock through traffic where nobody follows the rules.</p>
<ul class="features">
<li><b>Real roads</b><span>Potholes, speed humps and monsoon rain that floods the road.</span></li>
<li><b>Night shifts</b><span>Night falls during your shift, and the streetlights flicker.</span></li>
<li><b>Challans</b><span>Red-light cameras and e-challans for bad driving.</span></li>
<li><b>Leaderboards</b><span>Sign in if you want to put your best shift on the board.</span></li>
</ul>`,
      },
      {
        h: "How to play",
        html: `<p>Open <a href="https://meter-mele.pages.dev">meter-mele.pages.dev</a> in a browser. On a phone you steer by dragging, or switch to tilt or buttons. You can install it as an app from the browser, and after the first load it also works offline.</p>`,
      },
      {
        h: "Who it is for",
        html: `<p>Anyone who has ridden an auto in Bengaluru and heard "meter mele" (the name means "above the meter"). Locals spot their own streets. Everyone else gets a quick, silly, very local driving game.</p>`,
      },
    ],
    faq: [
      ["Is Meter Mele free?", "Yes. It is free to play in your browser at meter-mele.pages.dev."],
      ["Do I need to install anything?", "No. It runs in the browser on phones and laptops. You can install it as an app from the browser if you like."],
      ["Are the streets real?", "Yes. The roads, buildings and landmarks come from OpenStreetMap data of central Bengaluru."],
    ],
    privacy: { effective: "11 October 2026", intro: "You can play Meter Mele as a guest. This policy explains what we keep if you sign in for the leaderboards." },
  },
];
