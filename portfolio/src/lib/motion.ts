// src/lib/motion.ts — détection du mouvement réduit (sans dépendance d'animation)
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
