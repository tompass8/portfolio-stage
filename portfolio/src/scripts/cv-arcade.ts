// src/scripts/cv-arcade.ts — intro de la borne (zoom dans l'écran) et boutons Reculer / Avancer
import { prefersReducedMotion } from "../lib/motion";

const isStacked = () =>
  prefersReducedMotion() || window.matchMedia("(max-height: 640px)").matches;

export function initArcadeIntro() {
  const root = document.querySelector<HTMLElement>("[data-arcade]");
  if (!root) return;
  if (isStacked()) {
    root.remove();
    return;
  }
  const svg = root.querySelector<SVGSVGElement>("svg");
  const screen = root.querySelector<SVGGraphicsElement>("[data-arcade-screen]");
  const skip = root.querySelector<HTMLButtonElement>("[data-arcade-skip]");
  if (!svg || !screen) return;

  // Écran en portrait : on cadre la borne entière (la salle déborde du cadre, sans bande vide)
  if (window.innerWidth / window.innerHeight < 1) {
    svg.setAttribute("viewBox", "460 40 680 900");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }
  root.hidden = false;
  skip?.focus({ preventScroll: true });

  let done = false;
  let zoomAnim: Animation | null = null;
  let startTimer = 0;

  const finish = () => {
    if (done) return;
    done = true;
    window.clearTimeout(startTimer);
    window.removeEventListener("keydown", onKey);
    zoomAnim?.pause();
    root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: "ease-out", fill: "forwards" })
      .finished.then(() => {
        root.remove();
        document.querySelector<HTMLElement>("[data-hscroll]")?.focus({ preventScroll: true });
      });
  };

  const zoom = () => {
    // Agrandit l'écran de la borne jusqu'à couvrir la fenêtre, centré
    const r = screen.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const s = Math.max(vw / r.width, vh / r.height) * 1.04;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    zoomAnim = svg.animate(
      [{ transform: "none" }, { transform: `translate(${vw / 2 - cx * s}px, ${vh / 2 - cy * s}px) scale(${s})` }],
      { duration: 1800, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" }
    );
    zoomAnim.finished.then(finish).catch(() => {});
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
  };
  window.addEventListener("keydown", onKey);
  root.addEventListener("click", finish);
  startTimer = window.setTimeout(zoom, 1100);
}

export function initArcadeControls() {
  const scroller = document.querySelector<HTMLElement>("[data-hscroll]");
  if (!scroller) return;

  document.querySelectorAll<HTMLButtonElement>("[data-cv-step]").forEach((btn) => {
    const dir = Number(btn.dataset.cvStep) || 1;
    let holdTimer = 0;
    let raf = 0;
    let held = false;

    // Appui long : on marche tant que le bouton est tenu
    const stop = () => {
      window.clearTimeout(holdTimer);
      cancelAnimationFrame(raf);
      btn.classList.remove("is-held");
    };
    btn.addEventListener("pointerdown", (e) => {
      held = false;
      btn.classList.add("is-held");
      btn.setPointerCapture(e.pointerId);
      holdTimer = window.setTimeout(() => {
        held = true;
        const walk = () => {
          scroller.scrollLeft += dir * 12;
          raf = requestAnimationFrame(walk);
        };
        walk();
      }, 180);
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => btn.addEventListener(ev, stop));

    // Appui court (ou clavier) : un pas de 60 % de l'écran
    btn.addEventListener("click", () => {
      if (held) {
        held = false;
        return;
      }
      scroller.scrollBy({
        left: dir * Math.round(scroller.clientWidth * 0.6),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    });
  });
}
