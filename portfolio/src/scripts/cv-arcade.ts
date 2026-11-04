// src/scripts/cv-arcade.ts — la borne d'arcade autour du CV jeu (mise à l'échelle, caméra d'intro)
// et les boutons Reculer / Avancer
import { prefersReducedMotion } from "../lib/motion";

// Hauteur minimale de la page dans l'écran : en dessous, elle est réduite pour tenir sans déborder.
// En mode empilé (mêmes conditions que la page), elle défile à la verticale dans l'écran, sans réduction.
const PAGE_MIN_H = 680;
const stackedMode = window.matchMedia("(max-height: 640px), (prefers-reduced-motion: reduce)");
// Intro : plan large ~1 s, puis zoom ~1,5 s vers le cadrage final
const HOLD_MS = 1000;
const ZOOM_MS = 1500;

// À appeler avant initCvWorld, qui mesure le monde.
export function initCabinet() {
  const room = document.querySelector<HTMLElement>("[data-arcade-room]");
  const stage = room?.querySelector<HTMLElement>("[data-arcade-stage]");
  const glass = room?.querySelector<HTMLElement>("[data-cab-glass]");
  const fit = room?.querySelector<HTMLElement>("[data-cab-fit]");
  if (!room || !stage || !glass || !fit) return;
  room.dataset.ready = "";

  // La page garde au moins PAGE_MIN_H de haut et est réduite d'autant pour remplir l'écran.
  // Le transform reste posé même à l'échelle 1 : il contient les éléments fixes de la page.
  const syncFit = () => {
    const w = glass.clientWidth;
    const h = glass.clientHeight;
    const scale = stackedMode.matches ? 1 : Math.min(1, h / PAGE_MIN_H);
    fit.style.width = `${w / scale}px`;
    fit.style.height = `${h / scale}px`;
    fit.style.transform = `scale(${scale})`;
  };
  syncFit();
  new ResizeObserver(syncFit).observe(glass);
  stackedMode.addEventListener("change", syncFit);

  const focusPage = () => {
    const scroller = room.querySelector<HTMLElement>("[data-hscroll]");
    const horizontal = scroller && scroller.scrollWidth > scroller.clientWidth;
    (horizontal ? scroller : room.querySelector<HTMLElement>("[data-cab-scroll]"))?.focus({ preventScroll: true });
  };
  if (prefersReducedMotion()) {
    focusPage();
    return;
  }

  // Caméra : on part du plan large (toute la scène, borne et salle, dans la fenêtre) et on
  // revient au repos, qui est le cadrage final. Origine du transform : coin haut gauche de la scène.
  const r = stage.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const k = Math.min((vw * 0.94) / r.width, (vh * 0.94) / r.height);
  const tx = vw / 2 - r.left - (k * r.width) / 2;
  const ty = vh / 2 - r.top - (k * r.height) / 2;
  const wide = `translate(${tx}px, ${ty}px) scale(${k})`;
  const camera = stage.animate(
    [
      { transform: wide },
      { transform: wide, offset: HOLD_MS / (HOLD_MS + ZOOM_MS), easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
      { transform: "none" },
    ],
    { duration: HOLD_MS + ZOOM_MS }
  );
  // Une touche ou un clic passe directement au cadrage final
  const skip = () => camera.finish();
  window.addEventListener("keydown", skip, { once: true });
  window.addEventListener("pointerdown", skip, { once: true });
  camera.finished
    .then(() => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      focusPage();
    })
    .catch(() => {});
}

export function initArcadeControls() {
  const scroller = document.querySelector<HTMLElement>("[data-hscroll]");
  if (!scroller) return;

  // Mode empilé (la piste ne défile plus à l'horizontale) : on fait défiler la page à la verticale,
  // dans l'écran de la borne s'il y en a une
  const pane = document.querySelector<HTMLElement>("[data-cab-scroll]") ?? document.scrollingElement;
  const vertical = () => scroller.scrollWidth <= scroller.clientWidth && pane;

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
          const v = vertical();
          if (v) v.scrollTop += dir * 12;
          else scroller.scrollLeft += dir * 12;
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
      const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
      const v = vertical();
      if (v) v.scrollBy({ top: dir * Math.round(v.clientHeight * 0.6), behavior });
      else scroller.scrollBy({ left: dir * Math.round(scroller.clientWidth * 0.6), behavior });
    });
  });
}
