import React, { useEffect, useRef, useState } from "react";

interface Packet {
  x: number;
  y: number;
  speed: number;
  label: string;
  isMalicious: boolean;
}

const GOOD_PACKETS = ["HTTPS 200", "Astro Island", "JWT Valid", "RGPD Consent", "Backup OK"];
const BAD_PACKETS = ["Fuite PII", "SQL Inject", "Token Expiré", "Cookie Tiers", "Port 22 Open"];

export default function PacketFirewallGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [integrity, setIntegrity] = useState(100);
  const [statusMsg, setStatusMsg] = useState("Intercepte les menaces rouges, laisse passer les flux bleus légitimes !");

  useEffect(() => {
    if (!running) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = 640);
    const height = (canvas.height = 280);
    let paddleX = width / 2 - 55;
    const paddleW = 110;
    const paddleH = 12;
    const packets: Packet[] = [];
    let frame = 0;
    let localScore = 0;
    let localIntegrity = 100;

    const spawnPacket = () => {
      const isMalicious = Math.random() < 0.48;
      const list = isMalicious ? BAD_PACKETS : GOOD_PACKETS;
      packets.push({
        x: Math.random() * (width - 100) + 50,
        y: -20,
        speed: 1.6 + Math.random() * 1.4,
        label: list[Math.floor(Math.random() * list.length)],
        isMalicious,
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * width;
      paddleX = Math.max(10, Math.min(width - paddleW - 10, relX - paddleW / 2));
    };

    canvas.addEventListener("mousemove", onMouseMove);

    const loop = () => {
      frame++;
      if (frame % 48 === 0) spawnPacket();

      ctx.fillStyle = "#05060d";
      ctx.fillRect(0, 0, width, height);

      // Grille cyber
      ctx.strokeStyle = "rgba(168, 85, 247, 0.08)";
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Bouclier Firewall (Joueur)
      ctx.fillStyle = "#a855f7";
      ctx.shadowColor = "#a855f7";
      ctx.shadowBlur = 12;
      ctx.fillRect(paddleX, height - 34, paddleW, paddleH);
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#e5e7eb";
      ctx.font = "10px monospace";
      ctx.fillText("WAF / BOUCLIER RGPD", paddleX + 4, height - 10);

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.y += p.speed;

        ctx.fillStyle = p.isMalicious ? "#ef4444" : "#00e5ff";
        ctx.beginPath();
        ctx.roundRect(p.x - 42, p.y - 12, 84, 22, 5);
        ctx.fill();

        ctx.fillStyle = "#05060d";
        ctx.font = "bold 10px monospace";
        ctx.fillText(p.label, p.x - 36, p.y + 3);

        // Collision avec le bouclier
        const hitPaddle =
          p.y + 10 >= height - 34 &&
          p.y - 10 <= height - 22 &&
          p.x >= paddleX - 20 &&
          p.x <= paddleX + paddleW + 20;

        if (hitPaddle) {
          if (p.isMalicious) {
            localScore += 15;
            setScore(localScore);
            setStatusMsg(`✔ Menace bloquée : ${p.label} (+15 pts)`);
          } else {
            localScore = Math.max(0, localScore - 5);
            setScore(localScore);
            setStatusMsg(`⚠ Flux légitime bloqué par erreur : ${p.label} (-5 pts)`);
          }
          packets.splice(i, 1);
          continue;
        }

        // Arrivé au serveur (en bas)
        if (p.y > height) {
          if (p.isMalicious) {
            localIntegrity = Math.max(0, localIntegrity - 20);
            setIntegrity(localIntegrity);
            setStatusMsg(`✖ INTRUSION : ${p.label} a atteint la base de données !`);
            if (localIntegrity <= 0) {
              setRunning(false);
              setStatusMsg("Audit terminé ! Clique sur Relancer pour rejouer.");
            }
          } else {
            localScore += 10;
            setScore(localScore);
          }
          packets.splice(i, 1);
        }
      }

      if (localIntegrity > 0) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [running]);

  const startGame = () => {
    setScore(0);
    setIntegrity(100);
    setStatusMsg("Bouge ta souris dans l'écran pour intercepter uniquement les paquets ROUGES !");
    setRunning(true);
  };

  return (
    <div className="mt-8 rounded-2xl border border-neon-violet/30 bg-surface/90 p-5 sm:p-6 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-xs text-neon-blue">EASTER EGG INTERACTIF // MINI-JEU</span>
          <h3 className="font-sans text-lg font-bold text-white">
            Simulateur WAF &amp; Filtrage RGPD en temps réel
          </h3>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="rounded-lg bg-black/50 px-3 py-1.5 text-neon-blue">
            SCORE : <strong>{score}</strong>
          </span>
          <span className="rounded-lg bg-black/50 px-3 py-1.5 text-ok">
            INTÉGRITÉ SI : <strong>{integrity}%</strong>
          </span>
          <button
            type="button"
            onClick={() => (running ? setRunning(false) : startGame())}
            className="rounded-lg bg-neon-violet px-4 py-1.5 font-semibold text-white transition hover:opacity-90 cursor-pointer"
          >
            {running ? "PAUSE" : "PRESS START"}
          </button>
        </div>
      </div>

      <p className="mt-3 font-mono text-xs text-slate-300">{statusMsg}</p>

      <div className="relative mt-3 overflow-hidden rounded-xl border border-white/10 bg-bg">
        <canvas
          ref={canvasRef}
          width={640}
          height={280}
          className="h-60 w-full cursor-crosshair block"
        />
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 p-4 text-center backdrop-blur-xs">
            <p className="max-w-md font-mono text-xs text-slate-300">
              Déplace le bouclier avec ta souris : bloque les paquets <strong className="text-red-400">ROUGES (Fuites PII, SQLi)</strong> et laisse passer les paquets <strong className="text-neon-blue">BLEUS (HTTPS, Consentement RGPD)</strong> vers le serveur.
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-4 rounded-lg border border-neon-blue bg-neon-blue/15 px-5 py-2.5 font-mono text-xs font-semibold text-neon-blue hover:bg-neon-blue hover:text-bg transition cursor-pointer"
            >
              ▶ LANCER LA SIMULATION INTERACTIVE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}