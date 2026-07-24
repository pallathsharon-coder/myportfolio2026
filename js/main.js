/* ═══════════════════════════════════════════════════════════
   SHARON PALLATH — DIMENSIONAL PORTFOLIO
   Motion engine: GSAP 3.13 · ScrollSmoother · SplitText · ScrambleText
   ═══════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText, ScrambleTextPlugin, CustomEase);

CustomEase.create("museum", "0.625, 0.05, 0, 1");
const SCRAMBLE_CHARS = "▪▙◆SHARON3DVXZ█▚10";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isDesktop = window.matchMedia("(min-width: 901px)").matches;

let smoother = null;

/* ───────────── boot ───────────── */

window.addEventListener("load", () => {
  document.fonts.ready.then(init);
});

function init() {
  if (!reduceMotion) {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.4,
      effects: true,
      normalizeScroll: true
    });
    smoother.paused(true);
  }

  initClock();
  initCursor();
  initMenu();
  initHeroIntro();      // builds (paused) hero timeline
  initPreloader();      // plays, then triggers hero timeline
  initMarquee();
  initManifesto();
  initGallery();
  initCraft();
  initArchive();
  initContact();
  initScrambleOnView();
  initScrollProgress();
}

/* ───────────── preloader ───────────── */

function initPreloader() {
  const counterEl = document.getElementById("counter");
  const wordEl = document.getElementById("preloader-word");
  const barEl = document.getElementById("preloader-bar");
  const words = ["3D VISUALIZATION", "BRAND IDENTITY", "PACKAGING", "VIDEO EDITING", "AI VISUALS", "INTERIORS"];
  let wordIdx = 0;

  if (reduceMotion) {
    gsap.set("#preloader", { display: "none" });
    gsap.set("#hud", { opacity: 1 });
    revealHeroInstant();
    return;
  }

  const wordCycle = setInterval(() => {
    wordIdx = (wordIdx + 1) % words.length;
    gsap.to(wordEl, { duration: 0.5, scrambleText: { text: words[wordIdx], chars: SCRAMBLE_CHARS, speed: 0.9 } });
  }, 520);

  const state = { p: 0 };
  const tl = gsap.timeline({ onComplete: exitPreloader });

  tl.to(state, {
    p: 100,
    duration: 2.6,
    ease: "museum",
    onUpdate: () => {
      counterEl.textContent = String(Math.round(state.p)).padStart(3, "0");
    }
  })
  .to(barEl, { scaleX: 1, duration: 2.6, ease: "museum" }, 0);

  function exitPreloader() {
    clearInterval(wordCycle);
    const out = gsap.timeline({
      onComplete: () => {
        gsap.set("#preloader", { display: "none" });
        if (smoother) smoother.paused(false);
      }
    });
    out.to(".preloader__center", { yPercent: -30, autoAlpha: 0, duration: 0.7, ease: "power3.in" })
       .to(".preloader__corner", { autoAlpha: 0, duration: 0.4 }, "<0.1")
       .to(".preloader__slat", {
          yPercent: -100,
          duration: 1.05,
          ease: "museum",
          stagger: 0.07
        }, "-=0.15")
       .add(() => playHeroIntro(), "-=0.9");
  }
}

/* ───────────── hero ───────────── */

let heroTl = null;

function initHeroIntro() {
  const title = document.querySelectorAll(".hero__title [data-split]");
  const splits = [];
  title.forEach(el => splits.push(new SplitText(el, { type: "chars", charsClass: "char" })));

  gsap.set("#hero-img", { scale: 1.28 });
  splits.forEach(s => gsap.set(s.chars, { yPercent: 115, rotate: 4 }));
  gsap.set([".hero__eyebrow", ".hero__sub-line", ".hero__foot-item", ".hero__scroll"], { autoAlpha: 0, y: 14 });

  heroTl = gsap.timeline({ paused: true });
  heroTl
    .to("#hero-img", { scale: 1, duration: 2.4, ease: "museum" }, 0)
    .to(splits[0].chars, { yPercent: 0, rotate: 0, duration: 1.3, ease: "museum", stagger: 0.035 }, 0.25)
    .to(splits[1].chars, { yPercent: 0, rotate: 0, duration: 1.3, ease: "museum", stagger: 0.035 }, 0.45)
    .to(".hero__eyebrow", { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, 1.0)
    .to(".hero__sub-line", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }, 1.15)
    .to(".hero__foot-item", { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" }, 1.3)
    .to(".hero__scroll", { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 1.5)
    .to("#hud", { opacity: 1, duration: 1 }, 1.2);

  // slow parallax drift + fade of hero content on scroll
  if (!reduceMotion) {
    gsap.to(".hero__content", {
      yPercent: -18,
      autoAlpha: 0,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "85% top", scrub: true }
    });
    gsap.to("#hero-img", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }
}

function playHeroIntro() { heroTl && heroTl.play(); }

function revealHeroInstant() {
  gsap.set("#hero-img", { scale: 1 });
  gsap.set(".hero__title .char", { yPercent: 0, rotate: 0 });
  gsap.set([".hero__eyebrow", ".hero__sub-line", ".hero__foot-item", ".hero__scroll"], { autoAlpha: 1, y: 0 });
}

/* ───────────── clock + scroll progress ───────────── */

function initClock() {
  const el = document.getElementById("clock");
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Dubai", hour12: false });
  };
  tick();
  setInterval(tick, 1000);
}

function initScrollProgress() {
  const el = document.getElementById("scroll-progress");
  ScrollTrigger.create({
    trigger: "#smooth-content",
    start: "top top",
    end: "bottom bottom",
    onUpdate: self => {
      el.textContent = String(Math.round(self.progress * 100)).padStart(3, "0") + "%";
    }
  });
}

/* ───────────── cursor ───────────── */

function initCursor() {
  if (window.matchMedia("(hover: none)").matches) return;
  const ring = document.getElementById("cursor");
  const dot = document.getElementById("cursor-dot");
  const label = document.getElementById("cursor-label");

  const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
  const ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
  const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
  const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

  window.addEventListener("mousemove", e => {
    rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY);
  });

  document.addEventListener("mouseover", e => {
    const labelled = e.target.closest("[data-cursor]");
    const hoverable = e.target.closest("[data-hover], a, button");
    if (labelled) {
      label.textContent = labelled.getAttribute("data-cursor");
      ring.classList.add("is-label");
      ring.classList.remove("is-hover");
    } else if (hoverable) {
      ring.classList.add("is-hover");
      ring.classList.remove("is-label");
    } else {
      ring.classList.remove("is-hover", "is-label");
    }
  });
}

/* ───────────── menu ───────────── */

function initMenu() {
  const menu = document.getElementById("menu");
  const btn = document.getElementById("menu-btn");
  const btnLabel = document.getElementById("menu-btn-label");
  const links = gsap.utils.toArray(".menu__link span");
  let open = false;

  const splitLinks = links.map(el => new SplitText(el, { type: "chars", charsClass: "char" }));

  const tl = gsap.timeline({ paused: true });
  tl.set(menu, { visibility: "visible" })
    .to(menu, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "museum" })
    .from(splitLinks.map(s => s.chars).flat(), {
      yPercent: 110, duration: 0.7, ease: "museum", stagger: 0.012
    }, "-=0.35")
    .from(".menu__meta-col", { autoAlpha: 0, y: 20, duration: 0.5, stagger: 0.08 }, "-=0.4");

  const toggle = (force) => {
    open = force !== undefined ? force : !open;
    document.body.classList.toggle("menu-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    if (open) {
      if (smoother) smoother.paused(true);
      tl.timeScale(1).play();
      gsap.to(btnLabel, { duration: 0.4, scrambleText: { text: "CLOSE", chars: SCRAMBLE_CHARS } });
    } else {
      tl.timeScale(1.6).reverse();
      if (smoother) smoother.paused(false);
      gsap.to(btnLabel, { duration: 0.4, scrambleText: { text: "MENU", chars: SCRAMBLE_CHARS } });
    }
  };

  btn.addEventListener("click", () => toggle());

  document.querySelectorAll(".menu__link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = link.getAttribute("href");
      toggle(false);
      gsap.delayedCall(0.65, () => scrollToTarget(target));
    });
  });

  document.getElementById("back-to-top").addEventListener("click", () => scrollToTarget("#top"));
  document.querySelector(".hud__logo").addEventListener("click", e => { e.preventDefault(); scrollToTarget("#top"); });
}

function scrollToTarget(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  if (smoother) {
    const y = smoother.offset(el, "top top");
    gsap.to(smoother, { scrollTop: Math.max(0, y), duration: 1.5, ease: "museum", overwrite: "auto" });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

/* ───────────── marquee ───────────── */

function initMarquee() {
  const track = document.querySelector(".marquee__track");
  if (!track) return;
  const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
  if (reduceMotion) return;
  ScrollTrigger.create({
    trigger: ".marquee-band",
    start: "top bottom",
    end: "bottom top",
    onUpdate: self => {
      const v = Math.abs(self.getVelocity());
      gsap.to(loop, { timeScale: 1 + Math.min(v / 900, 3.5), duration: 0.4, overwrite: true });
    }
  });
}

/* ───────────── manifesto ───────────── */

function initManifesto() {
  // big statement — line-mask reveal
  const statement = document.querySelector("[data-lines]");
  if (statement) {
    const split = new SplitText(statement, { type: "lines", linesClass: "line" });
    const inner = split.lines.map(line => {
      const span = document.createElement("span");
      span.style.display = "inline-block";
      while (line.firstChild) span.appendChild(line.firstChild);
      line.appendChild(span);
      return span;
    });
    gsap.set(inner, { yPercent: 110 });
    gsap.to(inner, {
      yPercent: 0, duration: 1.2, ease: "museum", stagger: 0.09,
      scrollTrigger: { trigger: statement, start: "top 78%" }
    });
  }

  // figure clip reveal
  document.querySelectorAll("[data-reveal-img]").forEach(mask => {
    gsap.to(mask, {
      clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "museum",
      scrollTrigger: { trigger: mask, start: "top 82%" }
    });
    const img = mask.querySelector("img");
    if (img) gsap.fromTo(img, { scale: 1.25 }, {
      scale: 1.06, duration: 1.8, ease: "museum",
      scrollTrigger: { trigger: mask, start: "top 82%" }
    });
  });

  // paragraph + stats
  gsap.from(".manifesto__para", {
    autoAlpha: 0, y: 30, duration: 1, ease: "power2.out",
    scrollTrigger: { trigger: ".manifesto__aside", start: "top 80%" }
  });
  gsap.from(".stat", {
    autoAlpha: 0, y: 34, duration: 0.9, ease: "power2.out", stagger: 0.1,
    scrollTrigger: { trigger: ".manifesto__stats", start: "top 85%" }
  });

  // counters
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = +el.dataset.count;
    const state = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => gsap.to(state, {
        v: target, duration: 1.6, ease: "museum",
        onUpdate: () => { el.textContent = Math.round(state.v); }
      })
    });
  });
}

/* ───────────── gallery (horizontal pin) ───────────── */

function initGallery() {
  const pin = document.getElementById("gallery-pin");
  const track = document.getElementById("gallery-track");
  const bar = document.getElementById("gallery-progress-bar");
  if (!pin || !track) return;

  const mm = gsap.matchMedia();

  mm.add("(min-width: 901px)", () => {
    const getDistance = () => track.scrollWidth - window.innerWidth;

    const scrollTween = gsap.to(track, {
      x: () => -getDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: () => "+=" + getDistance(),
        pin: true,
        scrub: 1.1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: self => { if (bar) gsap.set(bar, { scaleX: self.progress }); }
      }
    });

    // inner parallax per exhibit
    gsap.utils.toArray(".exhibit__media img").forEach(img => {
      gsap.fromTo(img, { xPercent: -12 }, {
        xPercent: 0, ease: "none",
        scrollTrigger: {
          trigger: img.closest(".exhibit"),
          containerAnimation: scrollTween,
          start: "left right",
          end: "right left",
          scrub: true
        }
      });
    });

    // exhibits rise in as they enter
    gsap.utils.toArray(".exhibit").forEach(ex => {
      gsap.from(ex, {
        y: 60, autoAlpha: 0.25, duration: 0.5, ease: "power2.out",
        scrollTrigger: {
          trigger: ex,
          containerAnimation: scrollTween,
          start: "left 95%",
          toggleActions: "play none none reverse"
        }
      });
    });

    return () => {};
  });

  mm.add("(max-width: 900px)", () => {
    gsap.utils.toArray(".exhibit").forEach(ex => {
      const media = ex.querySelector(".exhibit__media");
      if (media) {
        gsap.set(media, { clipPath: "inset(100% 0 0 0)" });
        gsap.to(media, {
          clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "museum",
          scrollTrigger: { trigger: ex, start: "top 85%" }
        });
      }
      gsap.from(ex.querySelector(".exhibit__info"), {
        autoAlpha: 0, y: 26, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: ex, start: "top 75%" }
      });
    });
    return () => {};
  });
}

/* ───────────── craft ───────────── */

function initCraft() {
  const rows = gsap.utils.toArray(".craft__row");
  const preview = document.getElementById("craft-preview");
  const previewImg = document.getElementById("craft-preview-img");

  gsap.from(rows, {
    autoAlpha: 0, y: 40, duration: 0.8, ease: "power2.out", stagger: 0.07,
    scrollTrigger: { trigger: ".craft__list", start: "top 82%" }
  });
  gsap.from(".tool-chip", {
    autoAlpha: 0, y: 18, duration: 0.5, ease: "power2.out", stagger: 0.05,
    scrollTrigger: { trigger: ".craft__tools", start: "top 90%" }
  });

  if (!preview || window.matchMedia("(hover: none)").matches || !isDesktop) return;

  const px = gsap.quickTo(preview, "x", { duration: 0.6, ease: "power3" });
  const py = gsap.quickTo(preview, "y", { duration: 0.6, ease: "power3" });

  const list = document.querySelector(".craft__list");
  list.addEventListener("mousemove", e => {
    px(e.clientX + 30);
    py(e.clientY - preview.offsetHeight / 2);
  });

  rows.forEach(row => {
    row.addEventListener("mouseenter", () => {
      const src = row.getAttribute("data-preview");
      if (src && previewImg.getAttribute("src") !== src) previewImg.setAttribute("src", src);
      gsap.to(preview, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" });
    });
  });
  list.addEventListener("mouseleave", () => {
    gsap.to(preview, { opacity: 0, scale: 0.85, duration: 0.4, ease: "power3.in" });
  });
}

/* ───────────── archive ───────────── */

function initArchive() {
  const spine = document.getElementById("archive-spine");
  if (spine) {
    gsap.fromTo(spine, { scaleY: 0 }, {
      scaleY: 1, ease: "none",
      scrollTrigger: { trigger: ".archive__timeline", start: "top 75%", end: "bottom 60%", scrub: true }
    });
  }
  gsap.utils.toArray(".era").forEach(era => {
    gsap.from(era.children, {
      autoAlpha: 0, y: 36, duration: 0.9, ease: "power2.out", stagger: 0.08,
      scrollTrigger: { trigger: era, start: "top 82%" }
    });
  });
}

/* ───────────── contact ───────────── */

function initContact() {
  const lines = document.querySelectorAll(".contact__line[data-split]");
  lines.forEach(line => {
    const split = new SplitText(line, { type: "chars", charsClass: "char" });
    gsap.from(split.chars, {
      yPercent: 115, duration: 1.1, ease: "museum", stagger: 0.04,
      scrollTrigger: { trigger: line, start: "top 88%" }
    });

    // hover wave
    split.chars.forEach(ch => {
      ch.addEventListener("mouseenter", () => {
        gsap.timeline()
          .to(ch, { yPercent: -14, color: "#ece3c2", duration: 0.18, ease: "power2.out" })
          .to(ch, { yPercent: 0, color: "inherit", duration: 0.5, ease: "elastic.out(1, 0.45)" });
      });
    });
  });

  gsap.from([".contact__col", ".footer"], {
    autoAlpha: 0, y: 26, duration: 0.8, ease: "power2.out", stagger: 0.08,
    scrollTrigger: { trigger: ".contact__meta", start: "top 88%" }
  });
}

/* ───────────── scramble-on-view ───────────── */

function initScrambleOnView() {
  document.querySelectorAll("[data-scramble]").forEach(el => {
    const original = el.textContent;
    ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          duration: 0.9,
          scrambleText: { text: original, chars: SCRAMBLE_CHARS, speed: 0.8, revealDelay: 0.1 }
        });
      }
    });
  });
}
