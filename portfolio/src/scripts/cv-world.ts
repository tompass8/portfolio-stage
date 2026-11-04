// src/scripts/cv-world.ts — moteur du CV gamifié (side-scrolling 2D, axe horizontal)
import { createAvatar } from "./cv-avatar";
import { prefersReducedMotion } from "../lib/motion";
import type { SpriteState } from "../data/resumeData";

const LAYER_SPEED: Record<string, number> = {
  sky: 0.1,
  far: 0.3,
  mid: 0.6,
};

// Empilé uniquement si mouvement réduit ou fenêtre très courte (paysage téléphone).
const isStacked = () =>
  prefersReducedMotion() || window.matchMedia("(max-height: 640px)").matches;

export function initCvWorld() {
  const worldEl = document.querySelector<HTMLElement>("[data-world]");
  if (!worldEl) return;
  const world = worldEl;

  const scroller = world.querySelector<HTMLElement>("[data-hscroll]");
  const viewport = world.querySelector<HTMLElement>("[data-viewport]");
  const container = world.querySelector<HTMLElement>("[data-world-container]")!;
  const avatarRoot = world.querySelector<HTMLElement>("[data-avatar]")!;
  const layers = Array.from(world.querySelectorAll<HTMLElement>("[data-layer]"));
  const progressBars = Array.from(document.querySelectorAll<HTMLElement>("[data-progress-bar]"));
  const progressLabel = document.querySelector<HTMLElement>("[data-progress-label]");
  const scrollHint = document.querySelector<HTMLElement>("[data-scroll-hint]");
  const teleports = Array.from(document.querySelectorAll<HTMLElement>("[data-teleport]"));
  const checkpoints = Array.from(world.querySelectorAll<HTMLElement>("[data-checkpoint-dot]"));
  const projectCards = Array.from(world.querySelectorAll<HTMLElement>("[data-project]"));
  const avatar = createAvatar(avatarRoot);

  const staticMode = () => isStacked() || prefersReducedMotion();
  const viewportWidth = () => scroller?.clientWidth ?? window.innerWidth;
  const distance = () => Math.max(container.offsetWidth - viewportWidth(), 0);
  const maxScroll = () => (scroller ? Math.max(scroller.scrollWidth - scroller.clientWidth, 1) : 1);

  function syncViewportWidth() {
    if (!scroller) return;
    world.style.setProperty("--vp-w", `${scroller.clientWidth}px`);
  }

  function setProgress(p: number) {
    progressBars.forEach((b) => (b.style.width = `${p * 100}%`));
    if (progressLabel) progressLabel.textContent = `${Math.round(p * 100)}%`;
  }

  // Translation courante du monde : les positions à l'écran s'en déduisent sans relire le layout
  let currentX = 0;

  function moveWorld(x: number) {
    currentX = x;
    container.style.transform = `translate3d(${x}px, 0, 0)`;
  }

  function moveLayers(x: number) {
    layers.forEach((layer) => {
      const speed = LAYER_SPEED[layer.dataset.layer ?? ""] ?? 0.3;
      layer.style.transform = `translate3d(${x * speed}px, 0, 0)`;
    });
  }

  // Zones déclenchant une action de l'avatar quand elles passent près de lui (left:20%)
  const jumpProps = Array.from(world.querySelectorAll<HTMLElement>("[data-jump-prop], [data-jump-platform]"));
  const useTargets = Array.from(world.querySelectorAll<HTMLElement>("[data-avatar-use-target]"));
  const gauges = Array.from(world.querySelectorAll<HTMLElement>("[data-energy-gauge]"));

  // Positions horizontales mesurées une fois par mise en page (setup, resize), relatives au monde.
  // Tout est en px du monde, relatif au viewport : le monde peut être réduit (écran de la borne).
  const boxes = new Map<HTMLElement, { left: number; width: number }>();

  function measure() {
    const vp = viewport?.getBoundingClientRect();
    const vpLeft = vp?.left ?? 0;
    const scale = vp && viewport!.offsetWidth ? vp.width / viewport!.offsetWidth : 1;
    [...jumpProps, ...useTargets, ...gauges, ...checkpoints, ...projectCards].forEach((el) => {
      const r = el.getBoundingClientRect();
      boxes.set(el, { left: (r.left - vpLeft) / scale - currentX, width: r.width / scale });
    });
  }

  function screenBox(el: HTMLElement) {
    const b = boxes.get(el) ?? { left: 0, width: 0 };
    const left = b.left + currentX;
    return { left, right: left + b.width, center: left + b.width / 2 };
  }

  const onScreen = (r: { left: number; right: number }) => r.left < viewportWidth() && r.right > 0;

  function nearAvatar(el: HTMLElement, tolerance = 80) {
    return Math.abs(screenBox(el).center - viewportWidth() * 0.2) < tolerance;
  }

  function nearViewportCenter(el: HTMLElement) {
    const r = screenBox(el);
    return r.left < viewportWidth() / 2 && r.right > 0;
  }

  function applyAvatarFromVelocity(direction: number, velocity: number) {
    if (jumping || using) return;
    if (Math.abs(velocity) > 5) {
      const next: SpriteState = direction < 0 ? "run-left" : "run-right";
      avatar.setState(next);
      avatar.idleIn(150);
    }
  }

  let jumping = false;
  let using = false;
  function updateProximityEffects() {
    if (jumpProps.some((el) => nearAvatar(el)) && !jumping) {
      jumping = true;
      avatar.setState("jump");
      window.setTimeout(() => {
        jumping = false;
      }, 500);
    }
    const nowUsing = useTargets.some((el) => nearAvatar(el, 120));
    if (nowUsing && !using) {
      using = true;
      avatar.setState("use");
    } else if (!nowUsing && using) {
      using = false;
      avatar.setState("idle");
    }
  }

  // Jauges d'énergie (zone compétences) : s'allument et comptent au passage
  const gaugeActive = new Map<HTMLElement, boolean>();

  // Le HTML les livre pleines (lisibles sans JS) : on les vide pour qu'elles se chargent au passage
  gauges.forEach((gauge) => {
    gauge.querySelectorAll<HTMLElement>("[data-seg]").forEach((seg) => (seg.style.background = "rgb(255 255 255 / 0.15)"));
    const valueEl = gauge.closest<HTMLElement>("[data-reveal]")?.querySelector<HTMLElement>("[data-energy-value]");
    if (valueEl) valueEl.textContent = "0%";
  });

  function updateGauges() {
    gauges.forEach((gauge) => {
      if (gaugeActive.get(gauge) || !nearViewportCenter(gauge)) return;
      gaugeActive.set(gauge, true);
      const segs = Array.from(gauge.querySelectorAll<HTMLElement>("[data-seg]"));
      segs.forEach((seg, i) => {
        const lit = seg.dataset.lit === "1";
        window.setTimeout(() => {
          seg.style.background = lit ? "var(--color-sign)" : "rgb(255 255 255 / 0.15)";
          seg.style.outline = "none";
          seg.style.outlineOffset = "-2px";
        }, i * 60);
      });
      const card = gauge.closest<HTMLElement>("[data-reveal]");
      const valueEl = card?.querySelector<HTMLElement>("[data-energy-value]");
      const target = Number(valueEl?.dataset.target ?? 0);
      if (valueEl) {
        let cur = 0;
        const step = () => {
          cur += Math.max(1, Math.round(target / 24));
          if (cur >= target) {
            valueEl.textContent = `${target}%`;
            return;
          }
          valueEl.textContent = `${cur}%`;
          window.setTimeout(step, 24);
        };
        step();
      }
    });
  }

  // Position monde de chaque zone → téléportation et zone courante du HUD
  const zoneOffsets: Record<string, number> = {};
  const zoneOrder: { hash: string; start: number }[] = [];
  let acc = 0;
  world.querySelectorAll<HTMLElement>("[data-zone]").forEach((zone) => {
    const hash = zone.dataset.zone ?? "";
    zoneOffsets[hash] = acc;
    zoneOrder.push({ hash, start: acc });
    acc += Number(zone.dataset.zoneWidth ?? 0);
  });

  let currentZone = "";
  // Pendant une téléportation, le HUD affiche directement la destination (pas les zones traversées)
  let teleportLock: string | null = null;
  let teleportTimer = 0;

  function setCurrentZone(zone: string) {
    if (zone === currentZone) return;
    currentZone = zone;
    teleports.forEach((btn) => {
      if (btn.dataset.teleport === zone) btn.setAttribute("aria-current", "true");
      else btn.removeAttribute("aria-current");
    });
  }

  function updateCurrentZone(x: number) {
    if (teleportLock) return;
    // La zone courante est celle sous l'avatar (20 % de la largeur)
    const probe = -x + viewportWidth() * 0.2;
    setCurrentZone([...zoneOrder].reverse().find((z) => z.start <= probe)?.hash ?? zoneOrder[0]?.hash ?? "");
  }

  function lockTeleport(hash: string) {
    teleportLock = hash;
    setCurrentZone(hash);
    window.clearTimeout(teleportTimer);
    const release = () => {
      teleportLock = null;
      window.clearTimeout(teleportTimer);
    };
    scroller?.addEventListener("scrollend", release, { once: true });
    window.addEventListener("scrollend", release, { once: true });
    teleportTimer = window.setTimeout(release, 1200);
  }

  function render(p: number, x = -p * distance()) {
    moveWorld(x);
    moveLayers(x);
    setProgress(p);
    updateCurrentZone(x);
    updateProximityEffects();
    updateGauges();
    if (scrollHint) scrollHint.style.opacity = p > 0.02 ? "0" : "1";
    checkpoints.forEach((cp) => {
      const r = screenBox(cp);
      const on = onScreen({ left: r.left, right: r.left });
      cp.style.background = on ? "var(--color-sign)" : "rgb(255 255 255 / 0.2)";
    });
    projectCards.forEach((card) => {
      const on = onScreen(screenBox(card));
      const light = card.querySelector<HTMLElement>("[data-checkpoint-light]");
      if (!light) return;
      light.style.background = on ? "var(--color-sign)" : "rgb(255 255 255 / 0.2)";
      light.style.outline = "none";
    });
  }

  let horizontalScrollHandler: (() => void) | null = null;
  let wheelHandler: ((e: WheelEvent) => void) | null = null;
  let nativeScrollHandler: (() => void) | null = null;
  let lastScrollLeft = 0;
  let lastScrollTime = 0;

  function buildHorizontal() {
    if (!scroller) return;

    const onScroll = () => {
      const max = maxScroll();
      const p = Math.min(Math.max(scroller.scrollLeft / max, 0), 1);
      const now = performance.now();
      const dl = scroller.scrollLeft - lastScrollLeft;
      const dt = Math.max(now - lastScrollTime, 1);
      render(p);
      applyAvatarFromVelocity(dl >= 0 ? 1 : -1, Math.abs((dl / dt) * 16));
      lastScrollLeft = scroller.scrollLeft;
      lastScrollTime = now;
    };

    if (horizontalScrollHandler) scroller.removeEventListener("scroll", horizontalScrollHandler);
    horizontalScrollHandler = onScroll;
    scroller.addEventListener("scroll", onScroll, { passive: true });

    // Molette verticale → défilement horizontal, avec passage au footer aux extrémités
    const onWheel = (e: WheelEvent) => {
      if (staticMode()) return;
      const max = maxScroll();
      const atStart = scroller.scrollLeft <= 0;
      const atEnd = scroller.scrollLeft >= max - 1;
      const dominantY = Math.abs(e.deltaY) > Math.abs(e.deltaX);
      if (!dominantY) return;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      e.preventDefault();
      scroller.scrollLeft += e.deltaY;
    };
    if (wheelHandler) scroller.removeEventListener("wheel", wheelHandler);
    wheelHandler = onWheel;
    scroller.addEventListener("wheel", onWheel, { passive: false });

    lastScrollLeft = scroller.scrollLeft;
    lastScrollTime = performance.now();
    onScroll();
  }

  function buildNative() {
    // Fallback vertical empilé : pas de pin, pas de translation horizontale
    const onScroll = () => {
      const top = window.scrollY + world.getBoundingClientRect().top;
      const total = Math.max(world.offsetHeight - window.innerHeight, 1);
      const p = Math.min(Math.max((window.scrollY - top) / total, 0), 1);
      render(p, 0);
    };
    if (nativeScrollHandler) window.removeEventListener("scroll", nativeScrollHandler);
    nativeScrollHandler = onScroll;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Téléportation (data-teleport="hash")
  const teleportHandlers: Array<[HTMLElement, () => void]> = [];
  teleports.forEach((btn) => {
    const handler = () => {
      const hash = btn.dataset.teleport;
      if (!hash) return;
      const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
      lockTeleport(hash);
      if (staticMode()) {
        const zone = world.querySelector<HTMLElement>(`[data-zone="${hash}"]`);
        zone?.scrollIntoView({ behavior, block: "start" });
        return;
      }
      if (!scroller) return;
      const worldDistance = distance();
      const ratio = worldDistance > 0 ? (zoneOffsets[hash] ?? 0) / worldDistance : 0;
      scroller.scrollTo({ left: ratio * maxScroll(), behavior });
    };
    btn.addEventListener("click", handler);
    teleportHandlers.push([btn, handler]);
  });

  function teardownHandlers() {
    if (scroller && horizontalScrollHandler) {
      scroller.removeEventListener("scroll", horizontalScrollHandler);
      horizontalScrollHandler = null;
    }
    if (scroller && wheelHandler) {
      scroller.removeEventListener("wheel", wheelHandler);
      wheelHandler = null;
    }
    if (nativeScrollHandler) {
      window.removeEventListener("scroll", nativeScrollHandler);
      nativeScrollHandler = null;
    }
  }

  function setup() {
    teardownHandlers();
    syncViewportWidth();
    if (staticMode()) {
      world.style.height = "auto";
      moveWorld(0);
      measure();
      buildNative();
      return;
    }
    world.style.height = "";
    measure();
    buildHorizontal();
  }

  setup();
  // Les polices et images peuvent décaler la mise en page après le premier rendu
  window.addEventListener("load", measure, { once: true });
  document.fonts?.ready.then(measure);

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => setup(), 200);
  };
  window.addEventListener("resize", onResize);

  return () => {
    window.clearTimeout(resizeTimer);
    window.removeEventListener("resize", onResize);
    teardownHandlers();
    teleportHandlers.forEach(([btn, handler]) => btn.removeEventListener("click", handler));
    avatar.destroy();
  };
}
