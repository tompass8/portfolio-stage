// src/scripts/smooth-scroll.ts
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function initSmoothScroll() {
  // Accessibilité : pas de scroll "inertiel" si l'utilisateur le refuse
  if (prefersReducedMotion()) return null;

  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

  // Lenis informe ScrollTrigger à chaque frame de scroll
  lenis.on("scroll", ScrollTrigger.update);

  // GSAP pilote Lenis (une seule boucle d'animation pour tout)
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Liens d'ancre (#projets, #contact…) → défilement fluide
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis!.scrollTo(target as HTMLElement, { offset: -40 });
    });
  });

  return lenis;
}