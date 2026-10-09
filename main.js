/* ==========================================================================
   NxtDuo — site motion
   GSAP + ScrollTrigger drive a pinned horizontal track on wide screens and
   a normal vertical page on narrow ones. Each panel owns its own entrance.
   ========================================================================== */

(() => {
  gsap.registerPlugin(ScrollTrigger);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isWide = () => window.matchMedia("(min-width: 901px)").matches;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  const track = $("#track");
  const panels = $$(".panel");
  const dots = $$(".dot");
  const counterNow = $("#counterNow");
  const progressBar = $("#progressBar");

  $("#year").textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Smooth scroll (Lenis) wired into GSAP's ticker
     ------------------------------------------------------------------ */
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();

  /* ------------------------------------------------------------------
     Horizontal track. `horiz` is the container tween every panel's
     ScrollTrigger rides on when the track is pinned.
     ------------------------------------------------------------------ */
  let horiz = null;
  let pinST = null;

  function buildHorizontal() {
    const distance = () => track.scrollWidth - window.innerWidth;
    horiz = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: "#trackWrap",
        pin: true,
        scrub: 0.9,
        start: "top top",
        end: () => "+=" + distance(),
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (st) => gsap.set(progressBar, { scaleX: st.progress, width: "100%" }),
      },
    });
    pinST = horiz.scrollTrigger;
  }

  function buildVerticalProgress() {
    ScrollTrigger.create({
      trigger: "#trackWrap",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (st) => gsap.set(progressBar, { scaleX: st.progress, width: "100%" }),
    });
  }

  // ScrollTrigger options for "panel enters the viewport", in either mode
  const enter = (panel, startPct = 70, extra = {}) =>
    horiz
      ? { trigger: panel, containerAnimation: horiz, start: `left ${startPct}%`, toggleActions: "play none none reverse", ...extra }
      : { trigger: panel, start: `top ${startPct}%`, toggleActions: "play none none reverse", ...extra };

  // Scrubbed version for parallax-style layers
  const scrub = (panel, extra = {}) =>
    horiz
      ? { trigger: panel, containerAnimation: horiz, start: "left right", end: "right left", scrub: true, ...extra }
      : { trigger: panel, start: "top bottom", end: "bottom top", scrub: true, ...extra };

  /* ------------------------------------------------------------------
     Navigation between panels (dots, links, keyboard)
     ------------------------------------------------------------------ */
  function scrollToPanel(i) {
    const panel = panels[i];
    if (!panel) return;
    if (horiz && pinST) {
      const d = track.scrollWidth - window.innerWidth;
      const y = pinST.start + (panel.offsetLeft / d) * (pinST.end - pinST.start);
      lenis.scrollTo(Math.min(y, pinST.end), { duration: 1.4 });
    } else {
      lenis.scrollTo(panel, { duration: 1.2, offset: -8 });
    }
  }

  $$("[data-goto]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToPanel(+el.dataset.goto);
    });
  });

  window.addEventListener("keydown", (e) => {
    if (!horiz) return;
    if (e.key === "ArrowRight") scrollToPanel(activeIndex + 1);
    if (e.key === "ArrowLeft") scrollToPanel(activeIndex - 1);
  });

  let activeIndex = 0;
  function setActive(i) {
    if (i === activeIndex && dots[i].classList.contains("is-active")) return;
    activeIndex = i;
    dots.forEach((d, j) => d.classList.toggle("is-active", j === i));
    gsap.fromTo(counterNow, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
    counterNow.textContent = String(i + 1).padStart(2, "0");
  }

  function buildActiveTracking() {
    panels.forEach((panel, i) => {
      ScrollTrigger.create({
        ...(horiz
          ? { trigger: panel, containerAnimation: horiz, start: "left 50%", end: "right 50%" }
          : { trigger: panel, start: "top 50%", end: "bottom 50%" }),
        onToggle: (st) => st.isActive && setActive(i),
      });
    });
  }

  /* ------------------------------------------------------------------
     01 Hero — plays once the loader lifts
     ------------------------------------------------------------------ */
  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to("#nav", { y: 0, duration: 1 }, 0)
      .to(".p-hero .split-line > span", { y: 0, duration: 0.9 }, 0.1)
      .to(".p-hero .line > span", { y: 0, duration: 1.1, stagger: 0.1 }, 0.2)
      .to(".p-hero .reveal-up", { y: 0, opacity: 1, duration: 1, stagger: 0.12 }, 0.5)
      .fromTo("#heroIcon", { opacity: 0, scale: 0.6, rotateY: -60, y: 60 }, { opacity: 1, scale: 1, rotateY: 0, y: 0, duration: 1.5, ease: "expo.out" }, 0.25)
      .to(".orbit", { opacity: 1, duration: 1.2, stagger: 0.15 }, 0.7)
      .fromTo(".mini", { opacity: 0, y: 60, scale: 0.6 }, { opacity: 1, y: 0, scale: 1, duration: 1.1, stagger: 0.12, ease: "back.out(1.4)" }, 0.8)
      .to("#nextCard", { opacity: 1, x: 0, duration: 1.1, ease: "expo.out", startAt: { x: 120 } }, 1.2)
      .to("#ticker", { opacity: 1, duration: 0.8 }, 1.2)
      .to("#scrollHint", { opacity: 1, duration: 0.8 }, 1.3);

    // The headline's last word cycles: lighter → simpler → kinder → calmer
    const flip = $("#flipWord");
    if (flip && !reduce) {
      const words = ["lighter.", "simpler.", "kinder.", "calmer."];
      let i = 0;
      setInterval(() => {
        i = (i + 1) % words.length;
        gsap.timeline()
          .to(flip, { yPercent: -60, opacity: 0, duration: 0.22, ease: "power2.in" })
          .add(() => { flip.textContent = words[i]; })
          .fromTo(flip, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "expo.out" });
      }, 3600);
    }

    // Count-up numbers
    $$("[data-count]").forEach((el) => {
      const n = +el.dataset.count;
      const c = { v: 0 };
      gsap.to(c, { v: n, duration: 1.4, delay: 0.8, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(c.v)), onComplete: () => (el.textContent = n) });
    });

    if (!reduce) {
      // Idle float for the icon and chips
      gsap.to("#heroIcon", { y: -14, rotateZ: 1.5, duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.6 });
      gsap.to(".orbit-1", { rotate: 360, duration: 40, repeat: -1, ease: "none" });
      gsap.to(".orbit-2", { rotate: -360, duration: 60, repeat: -1, ease: "none" });
      $$(".mini").forEach((c, i) => gsap.to(c, { rotation: i % 2 ? 2.5 : -2.5, duration: 2.6 + i * 0.4, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 }));
      gsap.to("#nextCard", { y: "-=10", duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2.4 });
      gsap.to(".ticker-row", { xPercent: -50, duration: 24, repeat: -1, ease: "none" });
    }
    return tl;
  }

  function heroScroll() {
    // The hero drifts away slower than the track: a parallax exit
    const hero = $(".p-hero");
    gsap.to("#heroArt", { xPercent: horiz ? 40 : 0, yPercent: horiz ? 0 : -20, opacity: 0.2, ease: "none", scrollTrigger: scrub(hero, horiz ? { start: "left left", end: "right left" } : { start: "top top", end: "bottom top" }) });
    gsap.to(".p-hero .hero-copy", { xPercent: horiz ? -25 : 0, opacity: 0, ease: "none", scrollTrigger: scrub(hero, horiz ? { start: "left left", end: "right left" } : { start: "top top", end: "bottom top" }) });
  }

  /* ------------------------------------------------------------------
     02 NxtDue — a curtain wipe reveals the screen, bubbles pop in
     ------------------------------------------------------------------ */
  function nxtdue() {
    const p = $(".p-nxtdue");
    const tl = gsap.timeline({ scrollTrigger: enter(p, 65), defaults: { ease: "expo.out" } });
    tl.to(p.querySelectorAll(".line > span"), { y: 0, duration: 1.1 }, 0)
      .to(p.querySelectorAll(".reveal-up"), { y: 0, opacity: 1, duration: 0.9, stagger: 0.09 }, 0.15)
      .to(p.querySelector(".wipe .frame"), { clipPath: "inset(0 0% 0 0 round 24px)", duration: 1.4, ease: "expo.inOut" }, 0)
      .to(p.querySelector(".wipe .frame img"), { scale: 1, duration: 1.6, ease: "expo.out" }, 0.2)
      .fromTo(p.querySelectorAll(".bubble"), { opacity: 0, y: 30, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.18, ease: "back.out(1.8)" }, 0.9);

    gsap.to(p.querySelector(".big-bg"), { xPercent: horiz ? -30 : 0, yPercent: horiz ? 0 : -30, ease: "none", scrollTrigger: scrub(p) });
    gsap.to(p.querySelector(".product-art"), { y: horiz ? -40 : 0, ease: "none", scrollTrigger: scrub(p) });
    if (!reduce) $$(".bubble", p).forEach((b, i) => gsap.to(b, { y: i ? 8 : -8, duration: 2.4, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 }));
  }

  /* ------------------------------------------------------------------
     03 Meter Mele — the screen drives in with speed lines,
     the road marquee keeps moving
     ------------------------------------------------------------------ */
  function mele() {
    const p = $(".p-mele");
    const tl = gsap.timeline({ scrollTrigger: enter(p, 65), defaults: { ease: "expo.out" } });
    tl.to(p.querySelector(".drive .frame"), { x: 0, skewX: 0, opacity: 1, duration: 1.3, ease: "expo.out" }, 0)
      .fromTo(p.querySelectorAll(".speed-lines i"), { opacity: 0, x: -80, scaleX: 0.2 }, { opacity: 1, x: 0, scaleX: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" }, 0.05)
      .to(p.querySelectorAll(".speed-lines i"), { opacity: 0, x: 60, duration: 0.6, stagger: 0.04, ease: "power2.in" }, 0.6)
      .to(p.querySelectorAll(".line > span"), { y: 0, duration: 1.1 }, 0.25)
      .to(p.querySelectorAll(".reveal-up"), { y: 0, opacity: 1, duration: 0.9, stagger: 0.09 }, 0.4);

    gsap.to(p.querySelector(".big-bg"), { xPercent: horiz ? 30 : 0, yPercent: horiz ? 0 : -30, ease: "none", scrollTrigger: scrub(p) });
    if (!reduce) gsap.to(p.querySelector(".road-stripe"), { xPercent: -50, duration: 28, repeat: -1, ease: "none" });
    if (!reduce) gsap.to(p.querySelector(".drive .frame"), { rotateZ: 0.6, y: -6, duration: 1.8, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
  }

  /* ------------------------------------------------------------------
     04 Workshop — cards flip in like a deck being dealt
     ------------------------------------------------------------------ */
  function lab() {
    const p = $(".p-lab");
    const tl = gsap.timeline({ scrollTrigger: enter(p, 75), defaults: { ease: "expo.out" } });
    tl.to(p.querySelectorAll(".line > span"), { y: 0, duration: 1.1 }, 0)
      .to(p.querySelectorAll(".reveal-up"), { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.1)
      .to(p.querySelectorAll(".card"), { opacity: 1, rotateY: 0, x: 0, duration: 1.2, stagger: 0.12, ease: "expo.out" }, 0.25);

    // Cards drift at slightly different speeds for depth
    $$(".card", p).forEach((c, i) => gsap.to(c, { y: horiz ? (i % 2 ? -12 : 12) : 0, ease: "none", scrollTrigger: scrub(p) }));
  }

  /* ------------------------------------------------------------------
     05 About — words light up as you scroll, values slide in,
     the quote fills with colour
     ------------------------------------------------------------------ */
  function about() {
    const p = $(".p-about");
    const wordsEl = $("#aboutWords");
    wordsEl.innerHTML = wordsEl.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
    const words = $$(".w", wordsEl);

    const tl = gsap.timeline({ scrollTrigger: enter(p, 70), defaults: { ease: "expo.out" } });
    tl.to(p.querySelectorAll(".line > span"), { y: 0, duration: 1.1, stagger: 0.1 }, 0)
      .to(p.querySelectorAll(".reveal-up"), { y: 0, opacity: 1, duration: 0.9 }, 0.1)
      .to(words, { opacity: 1, duration: 0.6, stagger: 0.025, ease: "power2.out" }, 0.3)
      .to(p.querySelectorAll(".value"), { opacity: 1, x: 0, duration: 1, stagger: 0.14, ease: "expo.out" }, 0.45)
      .fromTo("#quote", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 0.8);

    // The quote's gradient sweeps left→right with scroll position
    gsap.to("#quoteText", {
      backgroundPosition: "0% 0",
      ease: "none",
      scrollTrigger: horiz
        ? { trigger: p, containerAnimation: horiz, start: "left 60%", end: "left 5%", scrub: 0.5 }
        : { trigger: "#quote", start: "top 85%", end: "top 35%", scrub: 0.5 },
    });
  }

  /* ------------------------------------------------------------------
     06 Contact — the icon spins in, the address comes into focus
     ------------------------------------------------------------------ */
  function contact() {
    const p = $(".p-contact");
    const tl = gsap.timeline({ scrollTrigger: enter(p, 60), defaults: { ease: "expo.out" } });
    tl.to("#contactIcon", { opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: "elastic.out(1, 0.6)" }, 0)
      .to(p.querySelectorAll(".reveal-up"), { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 }, 0.2)
      .to("#mailLink", { opacity: 1, filter: "blur(0px)", scale: 1, duration: 1.2, ease: "expo.out" }, 0.45)
      .to(".foot", { opacity: 1, y: 0, duration: 0.9 }, 0.7);

    if (!reduce) gsap.to("#contactIcon", { y: -10, duration: 2.8, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
  }

  /* ------------------------------------------------------------------
     Pointer: cursor, magnetic buttons, background parallax
     ------------------------------------------------------------------ */
  function pointer() {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || reduce) return;

    const cursor = $("#cursor");
    const bot = $(".bot", cursor);
    const pupils = $$(".bot-pupil", cursor);
    const qc = { x: gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" }), y: gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" }) };
    const qt = gsap.quickTo(bot, "rotation", { duration: 0.5, ease: "power2" });
    let last = { x: 0, y: 0, t: 0 };
    const ga = { x: gsap.quickTo(".glow-a", "x", { duration: 1.6, ease: "power2" }), y: gsap.quickTo(".glow-a", "y", { duration: 1.6, ease: "power2" }) };
    const gb = { x: gsap.quickTo(".glow-b", "x", { duration: 2.2, ease: "power2" }), y: gsap.quickTo(".glow-b", "y", { duration: 2.2, ease: "power2" }) };
    const hi = { rx: gsap.quickTo(".hero-icon", "rotationY", { duration: 0.8, ease: "power2" }), ry: gsap.quickTo(".hero-icon", "rotationX", { duration: 0.8, ease: "power2" }) };
    const minis = $$(".mini").map((m) => ({ d: +m.dataset.depth * 1000, x: gsap.quickTo(m, "x", { duration: 1.1, ease: "power2" }), y: gsap.quickTo(m, "y", { duration: 1.1, ease: "power2" }) }));

    window.addEventListener("pointermove", (e) => {
      cursor.classList.add("is-on");
      qc.x(e.clientX); qc.y(e.clientY);
      // Tilt with horizontal speed and look where the pointer is heading
      const now = performance.now();
      const dt = Math.max(now - last.t, 8);
      const vx = (e.clientX - last.x) / dt, vy = (e.clientY - last.y) / dt;
      last = { x: e.clientX, y: e.clientY, t: now };
      qt(gsap.utils.clamp(-18, 18, vx * 14));
      const px = gsap.utils.clamp(-2, 2, vx * 2.5), py = gsap.utils.clamp(-2, 2, vy * 2.5);
      pupils.forEach((p) => (p.style.transform = `translate(${px}px, ${py}px)`));
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      ga.x(nx * 80); ga.y(ny * 80);
      gb.x(-nx * 120); gb.y(-ny * 120);
      if (activeIndex === 0) { hi.rx(nx * 24); hi.ry(-ny * 18); minis.forEach((m) => { m.x(nx * m.d); m.y(ny * m.d); }); }
    });

    $$("a, button").forEach((el) => {
      el.addEventListener("pointerenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("pointerleave", () => cursor.classList.remove("is-hover"));
    });
    window.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
    window.addEventListener("pointerup", () => cursor.classList.remove("is-down"));
    // Settle the tilt when the pointer stops
    let still;
    window.addEventListener("pointermove", () => { clearTimeout(still); still = setTimeout(() => { qt(0); pupils.forEach((p) => (p.style.transform = "")); }, 120); });

    $$(".magnetic").forEach((el) => {
      const mx = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      const my = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.25);
        my((e.clientY - (r.top + r.height / 2)) * 0.25);
      });
      el.addEventListener("pointerleave", () => { mx(0); my(0); });
    });
  }

  /* ------------------------------------------------------------------
     Build everything for the current layout mode
     ------------------------------------------------------------------ */
  function build() {
    if (isWide()) buildHorizontal(); else buildVerticalProgress();
    buildActiveTracking();
    heroScroll();
    nxtdue();
    mele();
    lab();
    about();
    contact();
  }

  // Rebuild when crossing the wide/narrow breakpoint (layout changes shape)
  let wasWide = isWide();
  window.addEventListener("resize", () => {
    if (isWide() !== wasWide) location.reload();
  });

  /* ------------------------------------------------------------------
     Loader → hero
     ------------------------------------------------------------------ */
  function boot() {
    document.body.classList.add("is-loading");
    const count = { n: 0 };
    const countEl = $("#loaderCount");
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove("is-loading");
        lenis.start();
        window.scrollTo(0, 0);
        build();
        ScrollTrigger.refresh();
        heroIntro();
        pointer();
      },
    });
    tl.to(".loader-logo", { opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.7)" }, 0)
      .to(".loader-word", { opacity: 1, duration: 0.6 }, 0.3)
      .to(".loader-bar i", { width: "100%", duration: 1.2, ease: "power2.inOut" }, 0.2)
      .to(count, { n: 100, duration: 1.2, ease: "power2.inOut", onUpdate: () => (countEl.textContent = Math.round(count.n)) }, 0.2)
      .to(".loader-logo", { scale: 1.15, rotate: 8, duration: 0.5, ease: "power2.inOut" }, 1.5)
      .to(".loader-inner", { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" }, 1.75)
      .to("#loader", { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, 1.9)
      .set("#loader", { display: "none" });

    if (reduce) { tl.progress(1); }
  }

  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot);
})();
