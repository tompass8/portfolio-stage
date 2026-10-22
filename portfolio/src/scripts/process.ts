// src/scripts/process.ts — section « méthode » sticky pilotée au scroll
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, getLenis } from "./smooth-scroll";

export function initProcess() {
  const root = document.querySelector<HTMLElement>("[data-process]");
  if (!root) return;

  const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-process-step]"));
  const tabs = Array.from(root.querySelectorAll<HTMLElement>("[data-process-tab]"));
  const images = Array.from(root.querySelectorAll<HTMLElement>("[data-process-image]"));
  const caption = root.querySelector<HTMLElement>("[data-process-caption]");
  const fill = root.querySelector<HTMLElement>("[data-process-fill]");
  if (!steps.length) return;

  // --- Mouvement réduit (ou pas de JS) : pile verticale statique, tout visible ---
  if (prefersReducedMotion()) return;

  root.classList.add("is-animated");
  if (fill) gsap.set(fill, { scaleX: 0 });

  let current = -1;
  const setCurrent = (index: number) => {
    if (index === current) return;
    current = index;
    steps.forEach((s, i) => s.classList.toggle("is-active", i === index));
    tabs.forEach((t, i) => t.classList.toggle("is-active", i === index));
    images.forEach((img, i) => img.classList.toggle("is-active", i === index));
    if (caption) caption.textContent = images[index]?.dataset.caption ?? "";
  };
  setCurrent(0);

  ScrollTrigger.create({
    trigger: root,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      if (fill) fill.style.transform = `scaleX(${self.progress.toFixed(4)})`;
      const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
      setCurrent(idx);
    },
  });

  // Clic sur un onglet → saut à la position correspondante dans la séquence
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      const travel = Math.max(1, root.offsetHeight - window.innerHeight);
      const y = root.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / steps.length) * travel;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { duration: 1 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
}
