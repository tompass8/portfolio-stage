// src/scripts/cv-avatar.ts — machine à états du sprite de l'avatar (CV gamifié)
import type { SpriteState } from "../data/resumeData";

const STATE_CLASS: Record<SpriteState, string> = {
  idle: "sprite--idle",
  "run-left": "sprite--run",
  "run-right": "sprite--run",
  jump: "sprite--jump",
  use: "sprite--use",
};

export interface Avatar {
  setState: (state: SpriteState) => void;
  getState: () => SpriteState;
  idleIn: (ms: number) => void;
  destroy: () => void;
}

export function createAvatar(root: HTMLElement): Avatar {
  const shell = root.querySelector<HTMLElement>("[data-avatar-shell]")!;
  const sprite = root.querySelector<HTMLElement>("[data-avatar-sprite]")!;
  let current: SpriteState = "idle";
  let idleTimer = 0;

  function apply(state: SpriteState) {
    if (state === current) return;
    current = state;
    sprite.classList.remove(...Object.values(STATE_CLASS));
    sprite.classList.add(STATE_CLASS[state]);
    if (state === "run-left") shell.classList.add("is-left");
    else if (state === "run-right") shell.classList.remove("is-left");
    if (state === "jump") shell.classList.remove("is-left");
  }

  function idleIn(ms: number) {
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => apply("idle"), ms);
  }

  return {
    setState: apply,
    getState: () => current,
    idleIn,
    destroy: () => window.clearTimeout(idleTimer),
  };
}
