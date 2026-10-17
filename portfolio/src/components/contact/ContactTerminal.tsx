import React, { useState } from "react";

export default function ContactTerminal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [log, setLog] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLog(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (data.ok) {
        setLog(`✔ [200 OK] ${data.ack}`);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setLog(`✖ [400 ERROR] ${data.error}`);
      }
    } catch {
      setLog("✖ Erreur réseau lors de l'appel à /api/contact.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Colonne récapitulatif Candidature A2Ω */}
      <div className="lg:col-span-2 flex flex-col justify-between rounded-2xl border border-white/10 bg-surface/85 p-6 backdrop-blur-md">
        <div>
          <span className="font-mono text-xs text-neon-blue">SYNTHÈSE CANDIDATURE</span>
          <h3 className="mt-1 font-sans text-xl font-bold text-white">
            Prêt à démarrer chez Alpha to Omega
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            Basé à Toulouse, disponible immédiatement pour un stage de 2 à 6 mois (35h/semaine, 9h30-18h30), avec perspective d'alternance.
          </p>

          <dl className="mt-5 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <dt className="text-slate-400">Candidat</dt>
              <dd className="text-white font-semibold">Tom Passerman</dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <dt className="text-slate-400">Formation</dt>
              <dd className="text-white">Bachelor Info — Ynov Toulouse</dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <dt className="text-slate-400">Stages précédents</dt>
              <dd className="text-neon-blue">Orange (IT) · ITL (Réseau)</dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <dt className="text-slate-400">Anglais technique</dt>
              <dd className="text-ok">Niveau C1 (TOEIC 940/990)</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5 font-mono text-xs">
          <a
            href="https://github.com/tompass8"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/15 bg-black/40 px-3.5 py-2 text-white hover:border-neon-blue hover:text-neon-blue transition"
          >
            GitHub (@tompass8) ↗
          </a>
          <a
            href="mailto:candidatures@alpha2omegaconsulting.com?subject=Candidature%20Stage%20Web%20IA%20Gouvernance%20-%20Tom%20Passerman"
            className="rounded-lg border border-neon-violet/40 bg-neon-violet/10 px-3.5 py-2 text-neon-violet hover:bg-neon-violet hover:text-white transition"
          >
            Contacter François Rodriguez ↗
          </a>
        </div>
      </div>

      {/* Formulaire Terminal relié à la route API SSR */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-3 rounded-2xl border border-white/10 bg-surface/90 p-6 font-mono text-xs backdrop-blur-md"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-slate-300">POST /api/contact — Cloudflare Worker SSR</span>
          <span className="text-ok">● ONLINE</span>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-slate-400 mb-1">&gt; Nom / Organisation :</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="François Rodriguez — Alpha to Omega"
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3.5 py-2.5 text-white placeholder:text-slate-600 focus:border-neon-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">&gt; Email de réponse :</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidatures@alpha2omegaconsulting.com"
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3.5 py-2.5 text-white placeholder:text-slate-600 focus:border-neon-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">&gt; Message / Proposition d'entretien :</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Bonjour Tom, discutons de votre stage chez Alpha to Omega à Toulouse..."
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3.5 py-2.5 text-white placeholder:text-slate-600 focus:border-neon-blue focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-neon-blue py-3 font-semibold text-bg transition hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] cursor-pointer"
          >
            {loading ? "Exécution de la requête..." : "$ curl -X POST /api/contact --send"}
          </button>

          {log && (
            <p className="rounded-lg border border-white/10 bg-black/50 p-3 text-ok">
              {log}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}