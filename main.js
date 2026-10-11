/* ==========================================================================
   NxtDuo — home page motion
   Wide screens: GSAP pins one horizontal track and snaps to each panel.
   Every entrance is tied to scroll position (scrubbed), so a panel always
   looks the same at the same spot, however fast you scroll or jump.
   Narrow screens, or if GSAP fails to load: a normal vertical page with a
   simple reveal. Content is visible without JS.
   ========================================================================== */

(() => {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wideQuery = window.matchMedia("(min-width: 901px)");
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const horizontal = hasGsap && wideQuery.matches;

  const track = $("#track");
  const panels = $$(".panel");
  const dockLinks = $$(".dock [data-goto]");
  const counterNow = $("#counterNow");
  const counterName = $("#counterName");
  const progress = $("#progressBar");

  root.classList.add("js");
  if (horizontal) root.classList.add("h");
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Active panel: dock highlight, counter, progress
     ------------------------------------------------------------------ */
  let active = -1;
  function setActive(i) {
    if (i === active || !panels[i]) return;
    active = i;
    const id = panels[i].id;
    dockLinks.forEach((a) => a.setAttribute("aria-current", a.getAttribute("href") === "#" + id ? "true" : "false"));
    const appNo = panels[i].dataset.app;
    if (counterNow) counterNow.textContent = appNo || "";
    if (counterName) counterName.textContent = appNo ? panels[i].dataset.name : "";
    $(".counter")?.classList.toggle("is-empty", !appNo);
    // keep the active dock icon in view when the dock scrolls (phones)
    const current = dockLinks.find((a) => a.getAttribute("aria-current") === "true");
    if (current && $(".dock").scrollWidth > $(".dock").clientWidth) {
      current.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
    }
  }
  const setProgress = (p) => { if (progress) progress.style.transform = `scaleX(${p})`; };

  /* ------------------------------------------------------------------
     Horizontal mode
     ------------------------------------------------------------------ */
  let pin = null;
  let horiz = null;

  function panelScrollY(i) {
    if (pin) return pin.start + (i / (panels.length - 1)) * (pin.end - pin.start);
    return panels[i].getBoundingClientRect().top + window.scrollY;
  }

  // The scroll tween behind dock/arrow jumps. Any wheel or touch from the
  // person cancels it, so a jump never fights their hand.
  const jump = { y: 0 };
  const cancelJump = (e) => { if (!e || e.type !== "wheel" || Math.abs(e.deltaY) >= Math.abs(e.deltaX)) gsap.killTweensOf(jump); };
  if (horizontal) {
    window.addEventListener("wheel", cancelJump, { passive: true });
    window.addEventListener("touchstart", cancelJump, { passive: true });
  }

  function goTo(i) {
    i = Math.max(0, Math.min(panels.length - 1, i));
    if (horiz && !reduce) {
      // Animate the scroll ourselves so snapping never fights a smooth scroll
      const from = window.scrollY, to = panelScrollY(i);
      const dist = Math.abs(to - from) / window.innerHeight;
      gsap.killTweensOf(jump);
      jump.y = from;
      gsap.to(jump, { y: to, duration: Math.min(1.6, 0.6 + dist * 0.12), ease: "power3.inOut", onUpdate: () => window.scrollTo(0, jump.y) });
    } else {
      window.scrollTo({ top: panelScrollY(i), behavior: reduce ? "auto" : "smooth" });
    }
  }

  function indexOfHash(hash) {
    if (!hash || hash.length < 2) return -1;
    return panels.findIndex((p) => "#" + p.id === hash);
  }

  $$("[data-goto]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const i = indexOfHash(el.getAttribute("href"));
      if (i < 0) return;
      e.preventDefault();
      goTo(i);
      history.replaceState(null, "", i === 0 ? location.pathname : "#" + panels[i].id);
    });
  });

  function buildHorizontal() {
    gsap.registerPlugin(ScrollTrigger);
    const n = panels.length;
    const distance = () => track.scrollWidth - window.innerWidth;

    horiz = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: "#trackWrap",
        pin: true,
        start: "top top",
        end: () => "+=" + distance(),
        scrub: reduce ? true : 0.35,
        invalidateOnRefresh: true,
        snap: reduce ? false : {
          snapTo: 1 / (n - 1),
          duration: { min: 0.25, max: 0.7 },
          delay: 0.08,
          ease: "power2.inOut",
        },
        onUpdate: (st) => {
          setProgress(st.progress);
          setActive(Math.round(st.progress * (n - 1)));
        },
      },
    });
    pin = horiz.scrollTrigger;

    // Trackpads: a sideways swipe steps one whole panel. Moving the scroll
    // by deltaX directly leaves the track stranded between panels.
    // One gesture = one step: stay locked until the inertia tail goes quiet.
    let swipe = 0, swipeLocked = false, quiet;
    window.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      clearTimeout(quiet);
      quiet = setTimeout(() => { swipeLocked = false; swipe = 0; }, 180);
      if (swipeLocked) return;
      swipe += e.deltaX;
      if (Math.abs(swipe) > 40) {
        swipeLocked = true;
        goTo(active + Math.sign(swipe));
      }
    }, { passive: false });

    // Keyboard: arrows / Page keys step one panel
    window.addEventListener("keydown", (e) => {
      if (e.target.closest?.("input, textarea, select") || e.metaKey || e.ctrlKey || e.altKey) return;
      const next = ["ArrowRight", "ArrowDown", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey);
      const prev = ["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey);
      if (next || prev) { e.preventDefault(); goTo(active + (next ? 1 : -1)); }
      if (e.key === "Home") { e.preventDefault(); goTo(0); }
      if (e.key === "End") { e.preventDefault(); goTo(n - 1); }
    });

    if (reduce) return;

    // Scrubbed entrance + exit for each panel. Entrance moves inner pieces,
    // exit moves the wrapper, so the two never animate the same property.
    const enter = (p) => ({ trigger: p, containerAnimation: horiz, start: "left 92%", end: "left 8%", scrub: true });
    const leave = (p) => ({ trigger: p, containerAnimation: horiz, start: "left left", end: "right left", scrub: true });

    panels.forEach((p) => {
      if (p.classList.contains("p-app")) {
        const tl = gsap.timeline({ scrollTrigger: enter(p) });
        tl.fromTo($(".app-visual", p), { xPercent: 55, rotate: 14, scale: 0.7 }, { xPercent: 0, rotate: 0, scale: 1, ease: "power2.out", duration: 1 }, 0)
          .fromTo($$(".app-copy > *", p), { x: 160, opacity: 0 }, { x: 0, opacity: 1, ease: "power2.out", duration: 0.7, stagger: 0.05 }, 0.1)
          .fromTo($(".app-num", p), { x: 260 }, { x: 0, ease: "none", duration: 1 }, 0)
          .fromTo($(".up-next", p), { x: 120, opacity: 0 }, { x: 0, opacity: 1, ease: "power2.out", duration: 0.5 }, 0.5);
        gsap.to($(".app-grid", p), { xPercent: -18, opacity: 0.25, ease: "none", scrollTrigger: leave(p) });
        gsap.to($(".ring", p), { rotate: 120, ease: "none", scrollTrigger: { trigger: p, containerAnimation: horiz, start: "left right", end: "right left", scrub: true } });
      } else if (p.classList.contains("p-about") || p.classList.contains("p-contact")) {
        const tl = gsap.timeline({ scrollTrigger: enter(p) });
        tl.fromTo($$(".reveal", p), { x: 140, opacity: 0 }, { x: 0, opacity: 1, ease: "power2.out", duration: 0.7, stagger: 0.06 }, 0);
      }
    });

    const hero = $(".p-hero");
    gsap.to($(".hero-grid", hero), { xPercent: -16, opacity: 0.2, ease: "none", scrollTrigger: leave(hero) });
  }

  /* ------------------------------------------------------------------
     Vertical mode (phones, tablets, or no GSAP)
     ------------------------------------------------------------------ */
  function buildVertical() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    $$(".reveal").forEach((el) => io.observe(el));

    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(panels.indexOf(en.target)); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    panels.forEach((p) => spy.observe(p));

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------
     Hero intro (short: people came to see the apps)
     ------------------------------------------------------------------ */
  function heroIntro() {
    if (!hasGsap || reduce) return;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".hero-copy > *", { y: 40, opacity: 0, duration: 1, stagger: 0.08 }, 0)
      .from(".phone", { y: 80, rotateY: -40, opacity: 0, duration: 1.4 }, 0.1)
      .from(".apps-grid li", { scale: 0.4, opacity: 0, duration: 0.7, stagger: 0.05, ease: "back.out(1.8)" }, 0.45)
      .from(".dock", { y: 120, duration: 1 }, 0.5);
    gsap.to(".phone", { y: -10, duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.6 });
  }

  /* ------------------------------------------------------------------
     Pointer: bot cursor and a slight tilt on the phone
     ------------------------------------------------------------------ */
  function pointer() {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || reduce || !hasGsap) return;
    const cursor = $("#cursor");
    const bot = $(".bot", cursor);
    const pupils = $$(".bot-pupil", cursor);
    const qx = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" });
    const qy = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" });
    const qr = gsap.quickTo(bot, "rotation", { duration: 0.5, ease: "power2" });
    const phone = $(".phone");
    const pr = phone && { y: gsap.quickTo(phone, "rotationY", { duration: 0.9, ease: "power2" }), x: gsap.quickTo(phone, "rotationX", { duration: 0.9, ease: "power2" }) };
    let last = { x: 0, y: 0, t: 0 };
    let still;

    window.addEventListener("pointermove", (e) => {
      cursor.classList.add("is-on");
      qx(e.clientX); qy(e.clientY);
      const now = performance.now();
      const dt = Math.max(now - last.t, 8);
      const vx = (e.clientX - last.x) / dt, vy = (e.clientY - last.y) / dt;
      last = { x: e.clientX, y: e.clientY, t: now };
      qr(gsap.utils.clamp(-18, 18, vx * 14));
      const px = gsap.utils.clamp(-2, 2, vx * 2.5), py = gsap.utils.clamp(-2, 2, vy * 2.5);
      pupils.forEach((p) => (p.style.transform = `translate(${px}px, ${py}px)`));
      if (pr && active === 0) {
        pr.y(-14 + (e.clientX / window.innerWidth - 0.5) * 16);
        pr.x(4 - (e.clientY / window.innerHeight - 0.5) * 10);
      }
      clearTimeout(still);
      still = setTimeout(() => { qr(0); pupils.forEach((p) => (p.style.transform = "")); }, 120);
    });
    document.addEventListener("pointerover", (e) => cursor.classList.toggle("is-hover", !!e.target.closest("a, button")));
    window.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
    window.addEventListener("pointerup", () => cursor.classList.remove("is-down"));
    document.addEventListener("pointerleave", () => cursor.classList.remove("is-on"));
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  if (horizontal) buildHorizontal(); else buildVertical();
  setActive(0);

  // Open at the panel named in the URL, e.g. nxtduo.com/#publik
  const start = indexOfHash(location.hash);
  const settle = () => {
    if (hasGsap) ScrollTrigger.refresh();
    if (start > 0) window.scrollTo(0, panelScrollY(start));
  };
  if (document.readyState === "complete") settle(); else window.addEventListener("load", settle);
  if (start <= 0) heroIntro();
  window.addEventListener("hashchange", () => { const i = indexOfHash(location.hash); if (i >= 0) goTo(i); });
  pointer();

  // The layout changes shape across the breakpoint: rebuild from scratch
  wideQuery.addEventListener("change", () => location.reload());
})();
