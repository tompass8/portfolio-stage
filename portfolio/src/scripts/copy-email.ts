// src/scripts/copy-email.ts — bouton « Copier l'adresse », affiché seulement si le presse-papiers est disponible
export function initCopyEmail() {
  if (!navigator.clipboard) return;
  document.querySelectorAll<HTMLElement>("[data-copy-wrap]").forEach((wrap) => {
    const btn = wrap.querySelector<HTMLButtonElement>("[data-copy-email]");
    const label = wrap.querySelector<HTMLElement>("[data-copy-label]");
    const status = wrap.querySelector<HTMLElement>("[data-copy-status]");
    if (!btn || !label) return;
    wrap.hidden = false;
    let timer = 0;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copyEmail ?? "");
        label.textContent = "Adresse copiée";
        if (status) status.textContent = "Adresse e-mail copiée dans le presse-papiers";
      } catch {
        label.textContent = "Copie impossible : sélectionnez l'adresse à gauche";
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        label.textContent = "Copier l'adresse";
        if (status) status.textContent = "";
      }, 2500);
    });
  });
}
