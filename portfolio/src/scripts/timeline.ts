// src/scripts/timeline.ts
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./smooth-scroll";

const clip = (p: number) => `inset(0 -24px ${((1 - p) * 100).toFixed(2)}% -24px)`;

export function initTimeline() {
  const root = document.querySelector<HTMLElement>("#timeline");
  const reveal = document.querySelector<HTMLElement>("[data-line-reveal]");
  const head = document.querySelector<HTMLElement>("[data-line-head]");
  const commits = document.querySelectorAll<HTMLElement>("[data-commit]");
  if (!root || !reveal || !head) return;

  // --- Mouvement réduit : tout est affiché, rien ne s'anime ---
  if (prefersReducedMotion()) {
    reveal.style.clipPath = clip(1);
    head.style.display = "none";
    commits.forEach((c) => c.classList.add("is-active"));
    return;
  }

  // --- Position du point de bascule Dev → Gouvernance (en % de hauteur) ---
  const gov = document.querySelector<HTMLElement>("#governance");
  const placeSwitch = () => {
    if (!gov) return;
    const pct = (gov.offsetTop / root.offsetHeight) * 100;
    reveal.style.setProperty("--gov", `${pct.toFixed(2)}%`);
  };
  placeSwitch();
  ScrollTrigger.addEventListener("refresh", placeSwitch);

  // --- Progression de la ligne ---
  // start/end "center" : le HEAD reste exactement au centre du viewport
  reveal.style.clipPath = clip(0);
  ScrollTrigger.create({
    trigger: root,
    start: "top center",
    end: "bottom center",
    onUpdate: (self) => {
      reveal.style.clipPath = clip(self.progress);
      head.style.top = `${self.progress * 100}%`;
    },
  });

  // --- Allumage des nœuds de commit ---
  commits.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 60%",
      toggleClass: { targets: el, className: "is-active" },
    });
  });

  // --- Changement de "zone" (le code devient un environnement structuré) ---
  if (gov) {
    ScrollTrigger.create({
      trigger: gov,
      start: "top 50%",
      toggleClass: { targets: document.documentElement, className: "zone-gov" },
    });
  }
}
