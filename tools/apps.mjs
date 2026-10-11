// The NxtDuo app list. Order here is the order on the site.
// After editing, run `node tools/build.mjs` (and `node tools/og.mjs` for new
// social images). See tools/README.md.
//
// status.kind: live | review | dev | idea  (keep it honest)
// accentInk must pass 4.5:1 on white: it is used for text and buttons.
// privacy body lives in tools/privacy/<slug>.html

export const SITE = "https://nxtduo.com";
export const EMAIL = "support@nxtduo.com";

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
    status: { label: "Live on the web", kind: "live" },
    statusNote: "The Android and iPhone apps are in store review.",
    chips: ["Web", "Android", "iPhone", "Free"],
    accent: "#c9a23a",
    accentInk: "#2e7d4f",
    cta: { label: "Open Talk With Swamy", href: "https://ramana.nxtduo.com", external: true },
    facts: { Status: "Web live · apps in review", Platforms: "Web, Android, iPhone", Price: "Free", Language: "English" },
    seo: {
      title: "Talk With Swamy: chat with Ramana Maharshi's words",
      description:
        "Talk With Swamy is a free AI chat app that answers questions using only the recorded words of Sri Ramana Maharshi, and names the source book for every answer.",
      appCategory: "LifestyleApplication",
      os: "Web, Android, iOS",
      free: true,
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
        html: `<p>Use it now in your browser at <a href="https://ramana.nxtduo.com">ramana.nxtduo.com</a>. The Android and iPhone apps are in store review. It is free, with no paid tier; to keep it free, each device has a daily message limit.</p>`,
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
      "Vehicle insurance, PUC, passports, subscriptions, warranties: add them once and NxtDue reminds you in time, with notifications that actually arrive. Your data stays in India. No ads, no data selling.",
    status: { label: "In review", kind: "review" },
    statusNote: "The iPhone app is in App Store review; Android is in closed testing on Google Play.",
    chips: ["iPhone", "Android", "Free plan"],
    accent: "#8b72ff",
    accentInk: "#5b3fe0",
    cta: { label: "Visit nxtdue.com", href: "https://www.nxtdue.com", external: true },
    facts: { Status: "In store review", Platforms: "iPhone, Android", Price: "Free plan · Premium", "Data stored in": "India" },
    seo: {
      title: "NxtDue: renewal reminders for insurance, PUC, passports and more",
      description:
        "NxtDue reminds you before insurance, PUC, passports, subscriptions and warranties expire. Data stays in India. No ads, no data selling.",
      appCategory: "ProductivityApplication",
      os: "iOS, Android",
      free: true,
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
        html: `<p>The iPhone app is in App Store review and the Android app is in closed testing on Google Play. There is a free plan and an optional Premium plan. Plans and updates are on <a href="https://www.nxtdue.com">nxtdue.com</a>.</p>`,
      },
    ],
    faq: [
      ["Is NxtDue free?", "There is a free plan. Premium adds more; see nxtdue.com for what each plan includes."],
      ["Where is my data stored?", "On servers in India. NxtDue shows no ads and does not sell your data."],
      ["Can I delete my data?", "Yes. You can export or delete everything yourself in the app's Settings."],
    ],
    privacy: { effective: "5 October 2026", intro: "A short summary of how NxtDue handles your data. The full policy is on nxtdue.com." },
  },
  {
    slug: "publik",
    name: "Publik",
    short: "Bengaluru's public spaces",
    category: "City guide · Bengaluru",
    tagline: "Every park, lake and library in Bengaluru.",
    summary:
      "A free guide to 1,801 public spaces in Bengaluru: parks, playgrounds, lakes, libraries and public toilets, with timings, directions, \"open now\" and \"near me\". Visitors can flag a place that is under repair, anonymously.",
    status: { label: "Live", kind: "live" },
    statusNote: "Free on the web at publik.nxtduo.com.",
    chips: ["Web", "Works on phones", "Free", "No sign-in"],
    accent: "#f08db8",
    accentInk: "#1f5132",
    cta: { label: "Open Publik", href: "https://publik.nxtduo.com", external: true },
    facts: { Status: "Live", Platform: "Web (phone and laptop)", Price: "Free", Places: "1,801 in Bengaluru" },
    seo: {
      title: "Publik: parks, lakes, playgrounds and libraries in Bengaluru",
      description:
        "Publik is a free guide to 1,801 public spaces in Bengaluru, with timings, directions, open now and near me. Parks, playgrounds, lakes, libraries and public toilets.",
      appCategory: "TravelApplication",
      os: "Web",
      free: true,
    },
    sections: [
      {
        h: "What it does",
        html: `<ul class="features">
<li><b>Find a place</b><span>Search or filter parks, playgrounds, lakes, libraries and public toilets across Bengaluru.</span></li>
<li><b>Open now, near me</b><span>See what is open right now and what is closest, on a list or a map.</span></li>
<li><b>Before you go</b><span>Timings, directions, and short tips from people who went, including playground safety.</span></li>
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
      ["Does it track my location?", "No. \"Near me\" uses your location only inside your browser to sort places. It is never sent to us."],
      ["A place is wrong. What do I do?", "Use the report buttons on the place, or write to support@nxtduo.com."],
    ],
    privacy: { effective: "11 October 2026", intro: "Publik is a website with no accounts. This policy explains the little it stores and the services it loads." },
  },
  {
    slug: "fablefox",
    name: "FableFox",
    short: "Bedtime stories in your voice",
    category: "Kids · Bedtime stories",
    tagline: "Little ears. Big dreams.",
    summary:
      "Indian bedtime stories told in a parent's own voice. Read two short lines once, and FableFox tells stories from the Ramayana, the Panchatantra and Tenali Raman in your voice, calling your child by the pet name you use at home.",
    status: { label: "Testing with families", kind: "dev" },
    statusNote: "A test version is with a small group of families.",
    chips: ["Android", "हिंदी · తెలుగు · ಕನ್ನಡ · தமிழ் · മലയാളം", "Plays offline"],
    accent: "#f2a93b",
    accentInk: "#a84a0c",
    cta: { label: "Ask to join the test", href: mail("FableFox test"), external: false },
    facts: { Status: "Testing with families", Platform: "Android", Languages: "Hindi, Telugu, Kannada, Tamil, Malayalam", Works: "Offline at bedtime" },
    seo: {
      title: "FableFox: Indian bedtime stories in a parent's own voice",
      description:
        "FableFox tells Ramayana, Panchatantra and Tenali Raman bedtime stories in a parent's own voice, in Hindi, Telugu, Kannada, Tamil or Malayalam.",
      appCategory: "EducationalApplication",
      os: "Android",
      free: false,
    },
    sections: [
      {
        h: "How it works",
        html: `<ol>
<li>Choose your language, agree to the consent, and type your child's pet name.</li>
<li>Read two short lines on screen, about 6 to 20 seconds.</li>
<li>Hear a short preview in your voice. If it sounds like you, FableFox makes the stories.</li>
<li>Each story downloads once and plays offline. At bedtime the player locks the screen against small hands and fades out at the end.</li>
</ol>`,
      },
      {
        h: "Your voice stays yours",
        html: `<p>Only the person whose voice it is can agree to record it. Your voice makes stories for your family only and is never shared. You can delete your voice and every story at any time from the app. Read the <a href="/fablefox/privacy/">privacy policy</a>.</p>`,
      },
      {
        h: "Who it is for",
        html: `<p>Parents who travel, work late or live apart from their children for a while, and grandparents who want their voice at bedtime. Also any family that wants the old stories told in their own language.</p>`,
      },
    ],
    faq: [
      ["Can I use FableFox now?", "A test version is with a small group of families. Email support@nxtduo.com to ask to join."],
      ["Which languages are there?", "Hindi, Telugu, Kannada, Tamil and Malayalam."],
      ["Do the stories need the internet?", "Only to download them once. After that they play offline."],
    ],
    privacy: { effective: "11 October 2026", intro: "FableFox uses a parent's voice and a child's pet name, so we explain exactly what happens to them." },
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
  {
    slug: "nxtbrush",
    name: "NxtBrush",
    short: "Guided toothbrushing",
    category: "Health · Family",
    tagline: "Brush every zone, every time.",
    summary:
      "Guided, animated toothbrushing for ages 3 to 80. A mouth map shows the next zone, a timer counts down, a chime says when to move on. It works offline, with any toothbrush.",
    status: { label: "In development", kind: "dev" },
    statusNote: "Android first. Not in the stores yet.",
    chips: ["Android", "Offline", "Ages 3 to 80", "Free"],
    accent: "#14a3a8",
    accentInk: "#0b7377",
    cta: { label: "Ask for early access", href: mail("NxtBrush early access"), external: false },
    facts: { Status: "In development", Platform: "Android first", Price: "Free, no purchases", Works: "Offline" },
    seo: {
      title: "NxtBrush: guided, animated toothbrushing for the whole family",
      description:
        "NxtBrush guides you zone by zone with a mouth map, a timer and a chime. For ages 3 to 80, works offline, with any toothbrush.",
      appCategory: "HealthApplication",
      os: "Android",
      free: true,
    },
    sections: [
      {
        h: "What it does",
        html: `<p>You stand at the sink and tap Start. The phone does the rest:</p>
<ul class="features">
<li><b>Mouth map</b><span>Lights up the zone to brush next, with a short animation of the motion.</span></li>
<li><b>See, hear, feel</b><span>A timer ring, a soft chime and a gentle vibration at every zone change.</span></li>
<li><b>Kind streaks</b><span>Small rewards and a family board, with a streak freeze and no guilt.</span></li>
<li><b>Teeth check</b><span>Optional photos help it give more time to the spots that need it. Coaching, never a diagnosis.</span></li>
</ul>`,
      },
      {
        h: "Who it is for",
        html: `<p>Families. The look changes with age: playful for small children, a game for older kids, and calm with bigger text for teens, adults and older people. We built it as a brushing coach for our own kids.</p>`,
      },
      {
        h: "Status",
        html: `<p>NxtBrush is in development and not in the stores yet. If you want to try it early, <a href="${mail("NxtBrush early access")}">write to us</a>.</p>`,
      },
    ],
    faq: [
      ["Does NxtBrush need the internet?", "No. Brushing works offline. Only the optional teeth check needs a connection."],
      ["Is it medical advice?", "No. It gives brushing coaching, not a diagnosis. See a dentist for pain, bleeding that lasts, or anything unusual."],
      ["Does it need an account?", "No. There is no sign-in, and no ads."],
    ],
    privacy: { effective: "1 October 2026", intro: "NxtBrush is built for families, so we collect very little. This policy explains what and why." },
  },
  {
    slug: "chai-empire",
    name: "Chai Empire",
    short: "Chai stall tycoon game",
    category: "Game · Tycoon",
    tagline: "From one tapri to a chain of hotels.",
    summary:
      "A cosy 3D tycoon game. Start as a chaiwala kid with one roadside tapri, brew masala chai, serve customers before their patience runs out, and grow it into a chain of hotels. In English, Hindi and Telugu.",
    status: { label: "Playable prototype", kind: "dev" },
    statusNote: "The first stage is playable. Not released yet.",
    chips: ["3D game", "English · हिंदी · తెలుగు", "Touch or keyboard"],
    accent: "#ff8a3d",
    accentInk: "#b4461a",
    cta: { label: "Ask for early access", href: mail("Chai Empire early access"), external: false },
    facts: { Status: "Playable prototype", Languages: "English, Hindi, Telugu", Controls: "Touch or keyboard", Release: "Not yet" },
    seo: {
      title: "Chai Empire: a cosy chai stall tycoon game",
      description:
        "Chai Empire is a cosy 3D tycoon game: grow one roadside chai tapri into a chain of hotels. In English, Hindi and Telugu.",
      appCategory: "GameApplication",
      os: "Web",
      free: true,
    },
    sections: [
      {
        h: "How it plays",
        html: `<p>There are no menus to dig through. You walk the kid around the stall and stand in glowing rings to make things happen:</p>
<ul class="features">
<li><b>Collect</b><span>Milk from the cow and leaves from the tea bush.</span></li>
<li><b>Brew</b><span>Chai on the stove, and stock the counter with kulhads.</span></li>
<li><b>Serve</b><span>Customers before their patience runs out. Fast service earns tips.</span></li>
<li><b>Grow</b><span>A second cow, a bench, a masala garden, and one day, hotels.</span></li>
</ul>`,
      },
      {
        h: "Who it is for",
        html: `<p>Players who like short, relaxing tycoon games, and anyone who has stood at a roadside chai stall. The language button switches between English, Hindi and Telugu.</p>`,
      },
      {
        h: "Status",
        html: `<p>The first stage is playable from start to finish, and we are polishing it. It is not in any store yet. If you want to try it early, <a href="${mail("Chai Empire early access")}">write to us</a>.</p>`,
      },
    ],
    faq: [
      ["Can I play Chai Empire now?", "Not publicly yet. It is a playable prototype. Email support@nxtduo.com for early access."],
      ["Which languages does it support?", "English, Hindi and Telugu."],
    ],
    privacy: { effective: "11 October 2026", intro: "Chai Empire is not released yet. Here is what that means for your data today." },
  },
  {
    slug: "saathi",
    name: "Saathi",
    short: "Private journaling companion",
    category: "Wellbeing · Journal",
    tagline: "A diary that listens, and stays on your phone.",
    summary:
      "A journaling companion that runs entirely on your own phone. You write to it like a diary and it replies in a few warm lines, remembers what matters, and never sends your diary to the cloud.",
    status: { label: "In testing", kind: "dev" },
    statusNote: "Test builds are running on Android and iPhone.",
    chips: ["Android", "iPhone", "Fully offline", "No account"],
    accent: "#d9825b",
    accentInk: "#a84a24",
    cta: { label: "Join the test", href: mail("Saathi test"), external: false },
    facts: { Status: "In testing", Platforms: "Android, iPhone", Privacy: "Runs fully on your phone", Language: "English (understands Hinglish, Tenglish)" },
    seo: {
      title: "Saathi: a private, offline journaling companion",
      description:
        "Saathi is a journaling companion whose AI runs entirely on your phone. It replies warmly, remembers what matters, and never sends your diary to the cloud.",
      appCategory: "HealthApplication",
      os: "Android, iOS",
      free: true,
    },
    sections: [
      {
        h: "What it does",
        html: `<p>You write to Saathi the way you would write a diary. It replies in a few short, warm lines, like a friend who remembers your life. It can bring up the right earlier thing at the right moment, such as asking how Thursday's interview went.</p>
<p>You stay in charge of what it remembers. Before it keeps a new fact, it asks. You can see, edit or delete your memories.</p>`,
      },
      {
        h: "Private by design",
        html: `<p>The AI model runs on the phone itself. After a one-time model download, Saathi works with no internet at all. Your entries are encrypted on the phone, there is no account, and there is no cloud copy of your diary. If someone writes that they are in danger, safety comes first: it shows real helplines for their country.</p>`,
      },
      {
        h: "Status",
        html: `<p>Saathi is in testing on Android and iPhone. If you want to try it, <a href="${mail("Saathi test")}">write to us</a>.</p>`,
      },
    ],
    faq: [
      ["Does Saathi send my diary to the cloud?", "No. The AI runs on your phone, and your diary stays there, encrypted."],
      ["Does it need the internet?", "Only once, to download the AI model (about 3.5 GB). After that it works offline."],
      ["Can I use Saathi today?", "It is in testing. Email support@nxtduo.com to join."],
    ],
    privacy: { effective: "11 October 2026", intro: "Saathi is built so that we never see your diary. This policy explains how." },
  },
  {
    slug: "thodu",
    name: "Thodu",
    alt: { text: "తోడు", lang: "te" },
    short: "Telugu calls to parents",
    category: "Family · Elder care",
    tagline: "A Telugu check-in call, on your behalf.",
    summary:
      "For children who live far from their parents. Thodu would phone your amma and nanna in Telugu, ask what you would ask, and send you a short note on how they really are.",
    status: { label: "Concept", kind: "idea" },
    statusNote: "Nothing is built yet. We are talking to families first.",
    chips: ["Telugu", "Normal phone call", "No app for parents"],
    accent: "#4fa3ff",
    accentInk: "#1f5fbf",
    cta: { label: "Tell us you need this", href: mail("Thodu"), external: false },
    facts: { Status: "Concept", Language: "Telugu", "For parents": "A normal phone call", Release: "Not yet" },
    seo: {
      title: "Thodu: a Telugu check-in call to your parents",
      description:
        "Thodu is a concept: a Telugu phone call to your parents on your behalf, with a short note on how they really are.",
      appCategory: "LifestyleApplication",
      os: "Phone call",
      free: true,
    },
    sections: [
      {
        h: "The idea",
        html: `<p>Parents often say "all fine" when it is not. A BP tablet gets skipped, a doctor visit goes unmentioned. Thodu is planned to work like this:</p>
<ol>
<li>You add a parent and choose what to check: "Did you take the BP tablet?", "What did the doctor say?"</li>
<li>Thodu calls them in Telugu at the time you choose, and says it is calling on your behalf.</li>
<li>You get a short summary, and an alert if something sounds wrong.</li>
</ol>
<p>The plan is a normal phone call, so the parent does not need a smartphone or an app.</p>`,
      },
      {
        h: "Who it is for",
        html: `<p>Telugu families with children in another city or another country, and parents living on their own back home. <span lang="te">తోడు</span> means companion or support. It is a bridge to you, never a replacement for your own calls.</p>`,
      },
      {
        h: "Status",
        html: `<p>Thodu is a concept. We are still talking to families before we build anything. If this is something your family needs, <a href="${mail("Thodu")}">write to us</a>.</p>`,
      },
    ],
    faq: [
      ["Is Thodu available?", "No. It is a concept and is not built yet."],
      ["Will my parents need a smartphone?", "The plan is no. Thodu would make a normal phone call, so it works on a basic phone."],
    ],
    privacy: { effective: "11 October 2026", intro: "Thodu is not built yet, so it collects nothing. Here is what we keep if you write to us." },
  },
];
