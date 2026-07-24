/* ═══════════════════════════════════════════════════════════
   SHARON PALLATH — HOME · 3D ORBIT GALLERY
   Single viewport. Wheel / drag rotates the orbit.
   Modes: spiral (scattered ring) ↔ list (flat row).
   ═══════════════════════════════════════════════════════════ */

gsap.registerPlugin(CustomEase);
CustomEase.create("silk", "0.22, 1, 0.36, 1");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const WORKS = [
  { src: "assets/img/hero.jpg",           caption: "GILDED HALL WITH FLOATING POLYHEDRON" },
  { src: "assets/img/work-interior.jpg",  caption: "EVENING LIGHT THROUGH SHEER CURTAINS" },
  { src: "assets/img/work-product.jpg",   caption: "DEVICE STUDY ON BLACK STONE" },
  { src: "assets/img/work-packaging.jpg", caption: "MATTE BOXES WITH GOLD FOIL DETAIL" },
  { src: "assets/img/work-brand.jpg",     caption: "EMBOSSED IDENTITY ON CREAM PAPER" },
  { src: "assets/img/work-video.jpg",     caption: "LIGHT TRAILS FROZEN IN THE DARK" },
  { src: "assets/img/about.jpg",          caption: "STONE BUST DISSOLVING INTO WIREFRAME" },
  { src: "assets/img/work-silk.jpg",      caption: "BONE SILK SUSPENDED IN A BLACK VOID" }
];
const N = WORKS.length;
const STEP = 360 / N;

/* per-card scatter (spiral mode): y offset px, scale, z jitter px */
const SCATTER = [
  { y: -90, s: 1.00, z: 40 },
  { y: 30,  s: 0.86, z: -30 },
  { y: -150, s: 0.78, z: 10 },
  { y: -20, s: 1.06, z: 60 },
  { y: 60,  s: 0.82, z: -50 },
  { y: -120, s: 0.9, z: 0 },
  { y: 10,  s: 0.95, z: 30 },
  { y: -60, s: 0.84, z: -20 }
];

const state = {
  rot: 0, rotTarget: 0,          // orbit rotation (deg)
  pos: 0, posTarget: 0,          // list scroll (card units)
  mix: 0,                        // 0 = spiral · 1 = list
  tiltX: 0, tiltY: 0,            // mouse parallax (deg)
  view: "spiral",
  active: -1,
  dragging: false,
  lastInteract: 0,               // ms timestamp of last wheel/drag
  autoDir: 1                     // list auto-drift direction (ping-pong)
};

/* auto-drift: very slow ambient motion, pauses while the user interacts */
const AUTO_DELAY = 2600;         // ms of idle before drift resumes
const AUTO_ROT = 1.6;            // deg per second (spiral)
const AUTO_POS = 0.07;           // cards per second (list)

let cards = [];
let orbitEl, capNum, capText;

/* ── geometry ─────────────────────────────────────────── */
function metrics() {
  const vw = window.innerWidth, vh = window.innerHeight;
  const cardW = Math.min(Math.max(vw * 0.21, 150), 340, vh * 0.42);
  const radius = Math.max((cardW + vw * 0.055) * N / (2 * Math.PI), cardW * 1.45);
  const spacing = cardW + Math.max(vw * 0.045, 34);
  return { cardW, radius, spacing };
}
let M = null;

/* ── build ────────────────────────────────────────────── */
function build() {
  orbitEl = document.getElementById("orbit");
  capNum = document.getElementById("cap-num");
  capText = document.getElementById("cap-text");
  WORKS.forEach((w, i) => {
    const el = document.createElement("figure");
    el.className = "card";
    el.innerHTML = `<img src="${w.src}" alt="${w.caption.toLowerCase()}" decoding="async">`;
    orbitEl.appendChild(el);
    cards.push(el);
  });
  M = metrics();
  document.documentElement.style.setProperty("--cardW", M.cardW + "px");
}

/* ── render loop ──────────────────────────────────────── */
function render(time, dtMs) {
  const { radius, spacing } = M;

  /* ambient auto-scroll */
  const idle = performance.now() - state.lastInteract > AUTO_DELAY;
  if (!reduceMotion && idle && !state.dragging && !document.body.classList.contains("menu-open")) {
    const dt = Math.min(dtMs || 16.7, 64) / 1000;
    if (state.view === "spiral") {
      state.rotTarget -= AUTO_ROT * dt;
    } else {
      state.posTarget += AUTO_POS * state.autoDir * dt;
      if (state.posTarget >= N - 1) { state.posTarget = N - 1; state.autoDir = -1; }
      if (state.posTarget <= 0) { state.posTarget = 0; state.autoDir = 1; }
    }
  }

  const ease = state.dragging ? 0.22 : 0.075;
  state.rot += (state.rotTarget - state.rot) * ease;
  state.pos += (state.posTarget - state.pos) * ease;

  const m = state.mix;
  const rad = Math.PI / 180;

  cards.forEach((el, i) => {
    /* spiral placement: card on ring, facing outward */
    const theta = i * STEP + state.rot;
    const sx = Math.sin(theta * rad) * radius;
    const sz = Math.cos(theta * rad) * radius - radius * 0.55;
    const sy = SCATTER[i].y;
    const sry = theta;
    const ss = SCATTER[i].s;

    /* list placement: flat row */
    const lx = (i - state.pos) * spacing;
    const ly = -40;
    const lz = 0;
    const lry = 0;
    const ls = 1;

    const x = sx + (lx - sx) * m;
    const y = sy + (ly - sy) * m;
    const z = (sz + SCATTER[i].z) + (lz - (sz + SCATTER[i].z)) * m;
    const ry = sry + (lry - sry) * m;
    const s = ss + (ls - ss) * m;

    el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${ry.toFixed(2)}deg) scale(${s.toFixed(3)})`;

    /* depth dimming (spiral only) */
    const depth = Math.cos(theta * rad);                 // 1 front · -1 back
    const bright = 1 - (1 - Math.max(0.38, (depth + 1) / 2 * 0.9 + 0.28)) * (1 - m);
    el.style.filter = `brightness(${Math.min(1, bright).toFixed(3)})`;
    el.style.zIndex = Math.round(100 + (m ? -Math.abs(i - state.pos) * 5 : depth * 50));
  });

  /* stage parallax */
  orbitEl.style.transform = `rotateX(${state.tiltX.toFixed(2)}deg) rotateY(${state.tiltY.toFixed(2)}deg)`;

  /* active caption */
  const idx = state.view === "spiral"
    ? ((Math.round(-state.rot / STEP) % N) + N) % N
    : Math.round(Math.max(0, Math.min(N - 1, state.pos)));
  if (idx !== state.active) {
    state.active = idx;
    capNum.textContent = "0" + (idx + 1);
    capText.textContent = WORKS[idx].caption;
    if (!reduceMotion) gsap.fromTo([capNum, capText], { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "silk", overwrite: true });
  }
}

/* ── input: wheel · drag · mouse parallax ─────────────── */
function bindInput() {
  const stage = document.getElementById("stage");

  window.addEventListener("wheel", (e) => {
    if (document.body.classList.contains("menu-open")) return;
    state.lastInteract = performance.now();
    const d = Math.max(-140, Math.min(140, e.deltaY));
    if (state.view === "spiral") state.rotTarget -= d * 0.09;
    else state.posTarget = Math.max(0, Math.min(N - 1, state.posTarget + d * 0.004));
  }, { passive: true });

  let px = 0, moved = 0;
  stage.addEventListener("pointerdown", (e) => {
    state.dragging = true; moved = 0; px = e.clientX;
    state.lastInteract = performance.now();
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (state.dragging) {
      const dx = e.clientX - px; px = e.clientX; moved += Math.abs(dx);
      state.lastInteract = performance.now();
      if (state.view === "spiral") state.rotTarget += dx * 0.22;
      else state.posTarget = Math.max(0, Math.min(N - 1, state.posTarget - dx * 0.006));
    }
    /* parallax — perspective shift with cursor */
    if (!reduceMotion && !state.dragging) {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      gsap.to(state, { tiltY: nx * 7, tiltX: ny * -5, duration: 1.1, ease: "power2.out", overwrite: "auto" });
    }
  });
  ["pointerup", "pointercancel"].forEach(ev => stage.addEventListener(ev, () => { state.dragging = false; }));

  /* snap rotation to nearest card after wheel idle (spiral) */
  let idleT;
  window.addEventListener("wheel", () => {
    clearTimeout(idleT);
    idleT = setTimeout(() => {
      if (state.view === "spiral") state.rotTarget = Math.round(state.rotTarget / STEP) * STEP;
      else state.posTarget = Math.round(state.posTarget);
    }, 240);
  }, { passive: true });

  window.addEventListener("resize", () => {
    M = metrics();
    document.documentElement.style.setProperty("--cardW", M.cardW + "px");
  });
}

/* ── view toggle ──────────────────────────────────────── */
function bindToggle() {
  const bS = document.getElementById("btn-spiral");
  const bL = document.getElementById("btn-list");

  const setView = (v) => {
    if (state.view === v) return;
    state.view = v;
    bS.classList.toggle("is-active", v === "spiral");
    bL.classList.toggle("is-active", v === "list");
    if (v === "list") state.posTarget = state.active;
    else state.rotTarget = -state.active * STEP;
    gsap.to(state, { mix: v === "list" ? 1 : 0, duration: 1.25, ease: "silk", overwrite: "auto" });
  };

  bS.addEventListener("click", () => setView("spiral"));
  bL.addEventListener("click", () => setView("list"));

  /* card click → bring to front */
  cards.forEach((el, i) => {
    el.addEventListener("click", () => {
      state.lastInteract = performance.now();
      if (state.view === "spiral") {
        let t = -i * STEP;
        while (t - state.rotTarget > 180) t -= 360;
        while (t - state.rotTarget < -180) t += 360;
        state.rotTarget = t;
      } else state.posTarget = i;
    });
  });
}

/* ── loader + intro ───────────────────────────────────── */
function intro() {
  const loader = document.getElementById("loader");
  const pct = document.getElementById("loader-pct");

  if (reduceMotion) { loader.style.display = "none"; return; }

  gsap.set([".bar", ".hero-type", ".caption", ".badge", ".hero-hint"], { opacity: 0 });
  gsap.set(cards, { opacity: 0 });

  const p = { v: 0 };
  gsap.timeline()
    .to(p, { v: 100, duration: 1.7, ease: "power2.inOut", onUpdate: () => { pct.textContent = Math.round(p.v) + "%"; } })
    .to(loader, { opacity: 0, duration: 0.7, ease: "power2.out", onComplete: () => { loader.style.display = "none"; } })
    .fromTo(state, { rotTarget: 130 }, { rotTarget: 0, rot: 130, duration: 0.01 }, "<")
    .to(cards, { opacity: 1, duration: 0.9, stagger: 0.06, ease: "power2.out" }, "-=0.3")
    .to(".hero-type", { opacity: 1, duration: 1.1, ease: "power2.out" }, "-=0.7")
    .to([".bar", ".badge", ".caption", ".hero-hint"], { opacity: 1, duration: 0.9, stagger: 0.1 }, "-=0.7");

  gsap.to(".hero-hint", { opacity: 0.35, duration: 1.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 3 });
}

/* ── boot ─────────────────────────────────────────────── */
window.addEventListener("load", () => document.fonts.ready.then(() => {
  build();
  bindInput();
  bindToggle();
  intro();
  gsap.ticker.add(render);
  window.__orbitState = state;   // exposed for tooling/tests
}));
