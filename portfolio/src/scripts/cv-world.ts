// src/scripts/cv-world.ts — moteur du CV gamifié (side-scrolling 2D)
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { createAvatar } from "./cv-avatar";
import { prefersReducedMotion } from "../lib/motion";
import type { SpriteState } from "../data/resumeData";

gsap.registerPlugin(ScrollToPlugin);

const LAYER_SPEED: Record<string, number> = {
  sky: 0.1,
  far: 0.3,
  mid: 0.6,
};

const isStacked = () =>
  window.matchMedia("(max-width: 1023px), (max-height: 640px)").matches;

export function initCvWorld() {
  const worldEl = document.querySelector<HTMLElement>("[data-world]");
  if (!worldEl) return;
  const world = worldEl;

  const viewport = world.querySelector<HTMLElement>("[data-viewport]")!;
  const container = world.querySelector<HTMLElement>("[data-world-container]")!;
  const avatarRoot = world.querySelector<HTMLElement>("[data-avatar]")!;
  const layers = Array.from(world.querySelectorAll<HTMLElement>("[data-layer]"));
  const progressBars = Array.from(document.querySelectorAll<HTMLElement>("[data-progress-bar]"));
  const progressLabel = document.querySelector<HTMLElement>("[data-progress-label]");
  const scrollHint = document.querySelector<HTMLElement>("[data-scroll-hint]");
  const checkpoints = Array.from(world.querySelectorAll<HTMLElement>("[data-checkpoint-dot]"));
  const projectCards = Array.from(world.querySelectorAll<HTMLElement>("[data-project]"));
  const avatar = createAvatar(avatarRoot);

  const staticMode = () => isStacked() || prefersReducedMotion();
  const distance = () => Math.max(container.offsetWidth - window.innerWidth, 0);

  function setProgress(p: number) {
    progressBars.forEach((b) => (b.style.width = `${p * 100}%`));
    if (progressLabel) progressLabel.textContent = `${Math.round(p * 100)}%`;
  }

  function moveWorld(x: number) {
    gsap.set(container, { x });
  }

  function moveLayers(x: number) {
    layers.forEach((layer) => {
      const speed = LAYER_SPEED[layer.dataset.layer ?? ""] ?? 0.3;
      gsap.set(layer, { x: x * speed });
    });
  }

  function applyAvatarFromVelocity(direction: number, velocity: number) {
    if (jumping || using) return;
    if (Math.abs(velocity) > 5) {
      const next: SpriteState = direction < 0 ? "run-left" : "run-right";
      avatar.setState(next);
      avatar.idleIn(150);
    }
  }

  // Zones déclenchant une action de l'avatar quand elles passent près de lui (left:20%)
  const jumpProps = Array.from(world.querySelectorAll<HTMLElement>("[data-jump-prop], [data-jump-platform]"));
  const useTargets = Array.from(world.querySelectorAll<HTMLElement>("[data-avatar-use-target]"));

  function nearAvatar(el: HTMLElement, tolerance = 80) {
    const r = el.getBoundingClientRect();
    const avatarX = window.innerWidth * 0.2;
    return Math.abs(r.left + r.width / 2 - avatarX) < tolerance;
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
  const gauges = Array.from(world.querySelectorAll<HTMLElement>("[data-energy-gauge]"));
  const gaugeActive = new Map<HTMLElement, boolean>();

  function updateGauges() {
    gauges.forEach((gauge) => {
      const inView = nearViewportCenter(gauge);
      const active = gaugeActive.get(gauge) ?? false;
      if (inView && !active) {
        gaugeActive.set(gauge, true);
        const segs = Array.from(gauge.querySelectorAll<HTMLElement>("[data-seg]"));
        segs.forEach((seg, i) => {
          const lit = seg.dataset.lit === "1";
          window.setTimeout(() => {
            seg.style.background = lit
              ? "linear-gradient(180deg, #fbbf24, #f59e0b)"
              : "rgba(255,255,255,0.05)";
            seg.style.boxShadow = lit ? "0 0 6px rgba(251,191,36,0.7)" : "none";
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
      }
    });
  }

  function nearViewportCenter(el: HTMLElement) {
    const r = el.getBoundingClientRect();
    const cx = window.innerWidth / 2;
    return r.left < cx && r.right > 0;
  }

  let st: ScrollTrigger | undefined;
  let teleportOffsets: Record<string, number> = {};

  function buildPinned() {
    // Téléportation : position monde de la zone → position de scroll correspondante
    const zoneOffsets: Record<string, number> = {};
    let acc = 0;
    world.querySelectorAll<HTMLElement>("[data-zone]").forEach((zone) => {
      const w = Number(zone.dataset.zoneWidth ?? 0);
      zoneOffsets[zone.dataset.zone ?? ""] = acc;
      acc += w;
    });

    const total = distance();

    st = ScrollTrigger.create({
      trigger: world,
      start: "top top",
      end: () => `+=${distance()}`,
      pin: viewport,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const x = -self.progress * distance();
        moveWorld(x);
        moveLayers(x);
        setProgress(self.progress);
        applyAvatarFromVelocity(self.direction, self.getVelocity());
        updateProximityEffects();
        updateGauges();
        if (scrollHint) scrollHint.style.opacity = self.progress > 0.02 ? "0" : "1";
        checkpoints.forEach((cp) => {
          const r = cp.getBoundingClientRect();
          const on = r.left > 0 && r.left < window.innerWidth;
          cp.style.background = on ? "#fbbf24" : "rgba(255,255,255,0.15)";
          cp.style.boxShadow = on ? "0 0 12px rgba(251,191,36,0.9)" : "none";
        });
        projectCards.forEach((card) => {
          const r = card.getBoundingClientRect();
          const on = r.left < window.innerWidth && r.right > 0;
          const light = card.querySelector<HTMLElement>("[data-checkpoint-light]");
          if (!light) return;
          light.style.background = on ? "#fbbf24" : "rgba(255,255,255,0.2)";
          light.style.boxShadow = on ? "0 0 8px rgba(251,191,36,0.9)" : "none";
        });
      },
    });

    // Sauvegarde des offsets pour la téléportation
    teleportOffsets = zoneOffsets;
    return total;
  }

  let nativeScrollHandler: (() => void) | null = null;

  function buildNative() {
    const track = world.querySelector<HTMLElement>("[data-scroll-track]")!;
    const stacked = staticMode();
    if (stacked) {
      track.style.display = "none";
      track.style.height = "0px";
    } else {
      track.style.display = "";
      track.style.height = `${Math.max(distance(), window.innerHeight * 2)}px`;
    }
    const onScroll = () => {
      let p = 0;
      let x = 0;
      if (stacked) {
        const top = window.scrollY + world.getBoundingClientRect().top;
        const total = Math.max(world.offsetHeight - window.innerHeight, 1);
        p = Math.min(Math.max((window.scrollY - top) / total, 0), 1);
      } else {
        const max = Math.max(track.offsetHeight - window.innerHeight, 1);
        p = Math.min(Math.max(window.scrollY / max, 0), 1);
        x = -p * distance();
      }
      moveWorld(x);
      moveLayers(x);
      setProgress(p);
      updateProximityEffects();
      updateGauges();
      if (scrollHint) scrollHint.style.opacity = p > 0.02 ? "0" : "1";
    };
    if (nativeScrollHandler) {
      window.removeEventListener("scroll", nativeScrollHandler);
    }
    nativeScrollHandler = onScroll;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Téléportation (data-teleport="hash")
  const teleportHandlers: Array<[HTMLElement, () => void]> = [];
  document.querySelectorAll<HTMLElement>("[data-teleport]").forEach((btn) => {
    const handler = () => {
      const hash = btn.dataset.teleport;
      if (!hash) return;
      const offset = teleportOffsets[hash] ?? 0;
      const worldDistance = distance();
      const ratio = worldDistance > 0 ? offset / worldDistance : 0;
      if (staticMode()) {
        const zone = world.querySelector<HTMLElement>(`[data-zone="${hash}"]`);
        zone?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        return;
      }
      const y = world.offsetTop + ratio * worldDistance;
      gsap.to(window, { scrollTo: { y, autoKill: false }, duration: 0.8, ease: "power2.inOut" });
    };
    btn.addEventListener("click", handler);
    teleportHandlers.push([btn, handler]);
  });

  function setup() {
    ScrollTrigger.getAll().forEach((t) => {
      if (t.trigger === world) t.kill();
    });
    st?.kill();
    st = undefined;

    if (staticMode()) {
      // fallback vertical natif : pas de pin
      world.style.height = "auto";
      buildNative();
      return;
    }

    buildPinned();
  }

  setup();

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
      setup();
    }, 200);
  };
  const onLoad = () => ScrollTrigger.refresh();
  window.addEventListener("resize", onResize);
  window.addEventListener("load", onLoad);

  return () => {
    window.clearTimeout(resizeTimer);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("load", onLoad);
    if (nativeScrollHandler) {
      window.removeEventListener("scroll", nativeScrollHandler);
      nativeScrollHandler = null;
    }
    teleportHandlers.forEach(([btn, handler]) => btn.removeEventListener("click", handler));
    st?.kill();
    st = undefined;
    avatar.destroy();
  };
}
