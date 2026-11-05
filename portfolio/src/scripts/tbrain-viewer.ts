// src/scripts/tbrain-viewer.ts — la vue 3D ne capte la molette qu'après un clic, pour ne pas piéger le défilement.
// Sans JavaScript, l'iframe reste directement utilisable : le calque n'existe que s'il est créé ici.
export function initTbrainViewer() {
  document.querySelectorAll<HTMLElement>("[data-tbrain-viewer]").forEach((viewer) => {
    const frame = viewer.querySelector<HTMLIFrameElement>("[data-tbrain-frame]");
    if (!frame) return;

    const cover = document.createElement("button");
    cover.type = "button";
    cover.className = "absolute inset-0 grid cursor-pointer place-items-center bg-ink/35";
    cover.innerHTML =
      '<span class="rounded-[6px] bg-sign px-5 py-3 text-xl font-semibold text-ink">Cliquer pour explorer</span>';
    cover.setAttribute("aria-label", "Explorer la vue 3D (souris, molette et clic dans le système solaire)");

    const exit = document.createElement("button");
    exit.type = "button";
    exit.className = "press absolute right-3 top-3 min-h-12 rounded-[6px] bg-ink px-4 text-lg font-semibold text-sign";
    exit.textContent = "Quitter l'exploration";
    exit.hidden = true;

    // inert : ni molette ni clic ni focus clavier n'entrent dans l'iframe tant qu'elle est fermée
    const lock = () => {
      frame.inert = true;
      cover.hidden = false;
      exit.hidden = true;
    };
    const unlock = (withExit: boolean) => {
      frame.inert = false;
      cover.hidden = true;
      exit.hidden = !withExit;
      frame.focus();
    };

    // À la souris, sortir de la vue suffit à la refermer ; au doigt ou au clavier, un bouton le fait.
    cover.addEventListener("click", (e) => unlock((e as PointerEvent).pointerType !== "mouse"));
    viewer.addEventListener("pointerleave", (e) => {
      if (e.pointerType === "mouse" && cover.hidden) lock();
    });
    exit.addEventListener("click", () => {
      lock();
      cover.focus();
    });

    viewer.append(cover, exit);
    lock();
  });
}
