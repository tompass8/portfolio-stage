// src/scripts/cv-helicopter.ts — hélicoptère de police du ciel (CV gamifié)
// Tire au sort la variante d'impact (coque ou sol) et relance le cycle de vol.
import { prefersReducedMotion } from "../lib/motion";

const VARIANTS = ["hit", "ground"] as const;

type Variant = (typeof VARIANTS)[number];

// Position du redémarrage dans le cycle CSS (l'hélico est invisible à ce moment)
const RESTART_AT: Record<Variant, number> = {
  hit: 0.62,
  ground: 1,
};

const FALLBACK_CYCLE_MS = 20000;

export function initCvHelicopter() {
  const heli = document.querySelector<HTMLElement>("[data-heli]");
  if (!heli) return;

  if (prefersReducedMotion()) return;

  let timer = 0;

  function cycleMs() {
    const raw = getComputedStyle(heli).getPropertyValue("--heli-cycle").trim();
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value) || value <= 0) return FALLBACK_CYCLE_MS;
    return raw.endsWith("ms") ? value : value * 1000;
  }

  // Relance toutes les animations de l'hélico depuis 0
  function restart() {
    const nodes = [heli, ...Array.from(heli.querySelectorAll<HTMLElement>("*"))];
    nodes.forEach((el) => {
      el.style.animation = "none";
    });
    void heli.offsetWidth;
    nodes.forEach((el) => {
      el.style.animation = "";
    });
  }

  function pick(): Variant {
    return VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
  }

  function schedule(variant: Variant) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => apply(pick()), cycleMs() * RESTART_AT[variant]);
  }

  function apply(variant: Variant) {
    heli.dataset.heliVariant = variant;
    restart();
    schedule(variant);
  }

  apply(pick());

  return () => window.clearTimeout(timer);
}

