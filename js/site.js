/* ═══════════════════════════════════════════════════════════
   SHARON PALLATH — shared: menu overlay · subpage reveals
   ═══════════════════════════════════════════════════════════ */

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── menu ─────────────────────────────────────────────── */
  const menu = document.getElementById("menu");
  const btn = document.getElementById("menu-btn");
  const btnLabel = document.getElementById("menu-btn-label");
  let open = false;

  function toggleMenu(force) {
    open = force !== undefined ? force : !open;
    document.body.classList.toggle("menu-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    btnLabel.textContent = open ? "close" : "menu";
    if (reduceMotion) {
      menu.style.visibility = open ? "visible" : "hidden";
      menu.style.opacity = open ? "1" : "0";
      return;
    }
    if (open) {
      gsap.timeline()
        .set(menu, { visibility: "visible" })
        .to(menu, { opacity: 1, duration: 0.5, ease: "power2.out" })
        .fromTo(".menu__link", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.06 }, 0.08)
        .fromTo(".menu__foot", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.35);
    } else {
      gsap.to(menu, { opacity: 0, duration: 0.4, ease: "power2.in", onComplete: () => gsap.set(menu, { visibility: "hidden" }) });
    }
  }

  if (btn) btn.addEventListener("click", () => toggleMenu());
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && open) toggleMenu(false); });

  /* mark current page in menu */
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu__link").forEach(a => {
    if (a.getAttribute("href") === here) a.classList.add("is-current");
  });

  /* ── subpage entrance ─────────────────────────────────── */
  const page = document.querySelector(".page");
  if (page && !reduceMotion && typeof gsap !== "undefined") {
    gsap.fromTo(".page__eyebrow, .page__title, .page__intro",
      { y: 26, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.15 });
    gsap.fromTo(".page > *:not(.page__head)",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.09, delay: 0.4 });
  }

  /* ── portfolio hover previews ─────────────────────────── */
  const rows = document.querySelectorAll(".work-row");
  const preview = document.getElementById("work-preview");
  if (rows.length && preview && window.matchMedia("(hover: hover) and (min-width: 761px)").matches) {
    const img = preview.querySelector("img");
    const px = gsap.quickTo(preview, "x", { duration: 0.5, ease: "power3" });
    const py = gsap.quickTo(preview, "y", { duration: 0.5, ease: "power3" });
    window.addEventListener("mousemove", (e) => { px(e.clientX + 26); py(e.clientY - preview.offsetHeight / 2); });
    rows.forEach(row => {
      row.addEventListener("mouseenter", () => {
        const src = row.dataset.img;
        if (src && img.getAttribute("src") !== src) img.setAttribute("src", src);
        gsap.to(preview, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" });
      });
    });
    document.querySelector(".works-list").addEventListener("mouseleave", () => {
      gsap.to(preview, { opacity: 0, scale: 0.9, duration: 0.35, ease: "power2.in" });
    });
  }
})();
