// src/scripts/cv-contact.ts — formulaire de la borne arcade (CV gamifié)
// POST /api/contact + overlay LEVEL COMPLETE
interface ContactResponse {
  ok: boolean;
  error?: string;
  mailto?: string;
  contact?: string;
}

export function initCvContact() {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (!form) return;

  const errorEl = form.querySelector<HTMLElement>("[data-form-error]");
  const mailtoEl = form.querySelector<HTMLAnchorElement>("[data-form-mailto]");
  const overlay = document.querySelector<HTMLElement>("[data-level-complete]");
  const submit = form.querySelector<HTMLButtonElement>("button[type=submit]");

  function showError(msg: string) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.classList.remove("hidden");
  }

  function hideError() {
    errorEl?.classList.add("hidden");
  }

  function showMailto(href: string) {
    if (!mailtoEl) return;
    mailtoEl.href = href;
    mailtoEl.classList.remove("hidden");
  }

  function hideMailto() {
    mailtoEl?.classList.add("hidden");
  }

  // Le clic sur le lien mailto = remise effective du message au client mail
  mailtoEl?.addEventListener("click", () => {
    showComplete();
  });

  function showComplete() {
    if (!overlay) return;
    overlay.classList.remove("opacity-0", "pointer-events-none");
    overlay.classList.add("opacity-100");
    overlay.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      overlay.classList.add("opacity-0");
      overlay.classList.remove("opacity-100");
      overlay.setAttribute("aria-hidden", "true");
      window.setTimeout(() => overlay.classList.add("pointer-events-none"), 500);
    }, 2600);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const missing: string[] = [];
    if (!name) missing.push("Nom");
    if (!email) missing.push("Email");
    if (!message) missing.push("Message");
    if (missing.length) {
      showError(`✖ Veuillez remplir les champs requis : ${missing.join(", ")}.`);
      return;
    }

    hideError();
    hideMailto();
    if (submit) {
      submit.disabled = true;
      submit.textContent = "Transmission…";
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const json = (await res.json()) as ContactResponse;
      if (res.ok && json.ok) {
        form.reset();
        showComplete();
      } else {
        showError(`✖ [${res.status}] ${json.error ?? "Échec de l'envoi."}`);
        if (json.mailto) showMailto(json.mailto);
      }
    } catch {
      showError("✖ Erreur réseau lors de l'appel à /api/contact.");
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = "Envoyer";
      }
    }
  });
}
