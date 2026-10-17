import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
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
        ok: true,
        timestamp: new Date().toISOString(),
        ack: `Message de ${name} enregistré par le Worker Cloudflare.`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Requête JSON invalide." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
};