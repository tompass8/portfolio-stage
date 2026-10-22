import type { APIRoute } from "astro";
import { resumeData } from "../../data/resumeData";

export const prerender = false;

const CONTACT_EMAIL = "tompasserman5@gmail.com";

function buildMailto(name: string, email: string, message: string) {
  const subject = `Candidature — ${name}`;
  const body = `${message}\n\n—\nRéponse attendue à : ${email}`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const POST: APIRoute = async ({ request }) => {
  let body: { name?: unknown; email?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Requête JSON invalide." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ ok: false, error: "Champs requis manquants." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      ok: false,
      status: 501,
      error:
        "Envoi direct non configuré sur cet hébergement. Utilisez le lien mailto ci-dessous.",
      mailto: buildMailto(name, email, message),
      contact: resumeData.contact.channels.find((c) => c.label === "Email")?.value ?? CONTACT_EMAIL,
    }),
    { status: 501, headers: { "Content-Type": "application/json" } }
  );
};
