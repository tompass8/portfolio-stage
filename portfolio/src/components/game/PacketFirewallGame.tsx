import { useCallback, useEffect, useRef, useState } from "react";

type Kind = "good" | "bad" | "crit";
type Phase = "idle" | "running" | "paused" | "over";

interface Packet {
  x: number;
  y: number;
  speed: number;
  label: string;
  kind: Kind;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Engine {
  paddleX: number;
  frame: number;
  elapsed: number;
  score: number;
  integrity: number;
  wave: number;
  combo: number;
  waveFlash: number;
  spawnCount: number;
  packets: Packet[];
  particles: Particle[];
}

const GOOD = ["HTTPS 200", "JWT Valid", "RGPD OK", "Backup OK", "API GET", "OAuth 2.0"];
const BAD = ["Fuite PII", "SQL Inject", "XSS Attack", "Port 22 Open", "Malware C2", "Brute Force"];
const CRIT = ["RANSOMWARE", "APT-29", "ZERO-DAY"];
const COLORS: Record<Kind, string> = { good: "#00e5ff", bad: "#ef4444", crit: "#a855f7" };

const W = 640;
const H = 320;

function createEngine(): Engine {
  return {
    paddleX: W / 2 - 55,
    frame: 0,
    elapsed: 0,
    score: 0,
    integrity: 100,
    wave: 1,
    combo: 0,
    waveFlash: 90,
    spawnCount: 0,
    packets: [],
    particles: Array.from({ length: 80 }, () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, color: "" })),
  };
}

export default function PacketFirewallGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [wave, setWave] = useState(1);
  const [combo, setCombo] = useState(0);
  const [integrity, setIntegrity] = useState(100);
  const [statusMsg, setStatusMsg] = useState("Bloque les paquets rouges & violets, laisse passer les flux cyan vers le serveur.");

  useEffect(() => {
    const v = Number(localStorage.getItem("waf-best") ?? 0);
    if (v > 0) setBest(v);
  }, []);

  useEffect(() => {
    if (phase !== "running" || !engineRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const st = engineRef.current;
    const paddleW = 110;
    const paddleH = 14;
    const paddleY = H - 52;
    let animId = 0;
    const keys = new Set<string>();

    const burst = (x: number, y: number, color: string) => {
      for (let n = 0; n < 10; n++) {
        const p = st.particles.find((q) => q.life <= 0);
        if (!p) break;
        p.x = x;
        p.y = y;
        p.vx = (Math.random() - 0.5) * 4;
        p.vy = (Math.random() - 0.5) * 4;
        p.life = 24;
        p.color = color;
      }
    };

    const spawn = () => {
      st.spawnCount++;
      const kind: Kind = st.spawnCount % 14 === 0 ? "crit" : Math.random() < 0.48 ? "bad" : "good";
      const list = kind === "good" ? GOOD : kind === "bad" ? BAD : CRIT;
      st.packets.push({
        x: 60 + Math.random() * (W - 120),
        y: -18,
        speed: 1.5 + st.wave * 0.22 + Math.random() * 1.2,
        label: list[Math.floor(Math.random() * list.length)],
        kind,
      });
    };

    const pointer = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const rel = ((clientX - rect.left) / rect.width) * W;
      st.paddleX = Math.max(10, Math.min(W - paddleW - 10, rel - paddleW / 2));
    };
    const onMove = (e: MouseEvent) => pointer(e.clientX);
    const onTouch = (e: TouchEvent) => { if (e.touches[0]) pointer(e.touches[0].clientX); };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") { keys.add(e.key); e.preventDefault(); }
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key);

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("keyup", onKeyUp);

    const loop = () => {
      st.frame++;
      st.elapsed++;
      if (st.frame % Math.max(20, 50 - st.wave * 4) === 0) spawn();

      const nextWave = 1 + Math.floor(st.elapsed / 600);
      if (nextWave !== st.wave) {
        st.wave = nextWave;
        st.waveFlash = 90;
        setWave(st.wave);
      }
      if (st.waveFlash > 0) st.waveFlash--;

      if (keys.has("ArrowLeft")) st.paddleX = Math.max(10, st.paddleX - 7);
      if (keys.has("ArrowRight")) st.paddleX = Math.min(W - paddleW - 10, st.paddleX + 7);

      ctx.fillStyle = "#05060d";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(168, 85, 247, 0.07)";
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }

      // Scanlines + faisceau de scan
      ctx.fillStyle = "rgba(255,255,255,0.015)";
      for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);
      const beamY = ((st.frame * 1.1) % (H + 90)) - 45;
      ctx.fillStyle = "rgba(0,229,255,0.035)";
      ctx.fillRect(0, beamY, W, 26);

      // Rack serveur en bas avec LEDs
      const hpColor = st.integrity > 60 ? "#22c55e" : st.integrity > 30 ? "#f59e0b" : "#ef4444";
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(10, H - 20, W - 20, 14);
      ctx.fillStyle = hpColor;
      ctx.shadowColor = hpColor;
      ctx.shadowBlur = 8;
      ctx.fillRect(10, H - 20, (W - 20) * (st.integrity / 100), 14);
      ctx.shadowBlur = 0;
      for (let d = 0; d < 4; d++) {
        const on = Math.sin(st.frame * 0.12 + d * 1.7) > 0;
        ctx.fillStyle = on ? "#22c55e" : "rgba(34,197,94,0.15)";
        ctx.beginPath();
        ctx.arc(18 + d * 12, H - 13, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px monospace";
      ctx.fillText("SRV — BASE DE DONNÉES SI", 70, H - 25);

      ctx.fillStyle = "#a855f7";
      ctx.shadowColor = "#a855f7";
      ctx.shadowBlur = 14;
      ctx.fillRect(st.paddleX, paddleY, paddleW, paddleH);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#e5e7eb";
      ctx.font = "10px monospace";
      ctx.fillText("WAF / BOUCLIER RGPD", st.paddleX + 6, paddleY + 11);

      for (let i = st.packets.length - 1; i >= 0; i--) {
        const p = st.packets[i];
        p.y += p.speed;

        // Marqueur d'apparition en haut
        if (p.y < 8) {
          const pulse = 0.5 + 0.5 * Math.sin(st.frame * 0.25);
          ctx.fillStyle =
            p.kind === "good"
              ? `rgba(0,229,255,${0.35 + pulse * 0.55})`
              : p.kind === "bad"
                ? `rgba(239,68,68,${0.35 + pulse * 0.55})`
                : `rgba(168,85,247,${0.35 + pulse * 0.55})`;
          ctx.beginPath();
          ctx.moveTo(p.x - 6, 2);
          ctx.lineTo(p.x + 6, 2);
          ctx.lineTo(p.x, 11);
          ctx.fill();
        }

        ctx.fillStyle = COLORS[p.kind];
        if (p.kind === "crit") { ctx.shadowColor = COLORS.crit; ctx.shadowBlur = 10; }
        ctx.beginPath();
        ctx.roundRect(p.x - 44, p.y - 12, 88, 22, 5);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#05060d";
        ctx.font = "bold 10px monospace";
        ctx.fillText(p.label, p.x - 38, p.y + 3);

        const hit = p.y + 10 >= paddleY && p.y - 10 <= paddleY + paddleH && p.x >= st.paddleX - 22 && p.x <= st.paddleX + paddleW + 22;

        if (hit) {
          const mult = Math.min(4, 1 + Math.floor(st.combo / 4));
          if (p.kind === "good") {
            st.combo = 0;
            st.score = Math.max(0, st.score - 5);
            setStatusMsg(`⚠ Flux légitime bloqué : ${p.label} (-5)`);
            burst(p.x, p.y, "#f59e0b");
          } else {
            st.combo++;
            const pts = (p.kind === "crit" ? 50 : 15) * mult;
            st.score += pts;
            setStatusMsg(`${p.label} bloqué (+${pts}${mult > 1 ? ` ×${mult}` : ""})`);
            burst(p.x, p.y, COLORS[p.kind]);
          }
          setScore(st.score);
          setCombo(st.combo);
          st.packets.splice(i, 1);
          continue;
        }

        if (p.y > H) {
          if (p.kind !== "good") {
            st.integrity = Math.max(0, st.integrity - (p.kind === "crit" ? 40 : 25));
            st.combo = 0;
            setCombo(0);
            setIntegrity(st.integrity);
            setStatusMsg(`✖ INTRUSION : ${p.label} a atteint la base de données !`);
            if (st.integrity <= 0) {
              setPhase("over");
              setStatusMsg("Audit terminé : la SI est tombée. bats-toi sur le score en relançant !");
              setBest((b) => {
                const nb = Math.max(b, st.score);
                localStorage.setItem("waf-best", String(nb));
                return nb;
              });
              return;
            }
          } else {
            st.score += 10;
            setScore(st.score);
          }
          st.packets.splice(i, 1);
        }
      }

      for (const pt of st.particles) {
        if (pt.life <= 0) continue;
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        ctx.globalAlpha = pt.life / 24;
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x - 1.5, pt.y - 1.5, 3, 3);
        ctx.globalAlpha = 1;
      }

      if (st.waveFlash > 0) {
        ctx.fillStyle = `rgba(0,229,255,${(st.waveFlash / 90) * 0.9})`;
        ctx.font = "bold 26px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`WAVE ${st.wave}`, W / 2, 70);
        ctx.textAlign = "left";
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("keyup", onKeyUp);
    };
  }, [phase]);

  const start = useCallback(() => {
    engineRef.current = createEngine();
    setScore(0);
    setIntegrity(100);
    setWave(1);
    setCombo(0);
    setStatusMsg("Souris, tactile ou flèches ←/→ pour piloter le bouclier. Bloque les rouges & violets !");
    setPhase("running");
  }, []);

  return (
    <div className="mt-8 rounded-2xl border border-neon-violet/30 bg-surface/90 p-5 sm:p-6 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-xs text-neon-blue">EASTER EGG INTERACTIF // MINI-JEU</span>
          <h3 className="font-sans text-lg font-bold text-white">
            Simulateur WAF — Défendez la base de données SI
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <span className="rounded-lg bg-black/50 px-3 py-1.5 text-neon-blue">SCORE <strong>{score}</strong></span>
          <span className="rounded-lg bg-black/50 px-3 py-1.5 text-slate-300">WAVE <strong>{wave}</strong></span>
          <span className="rounded-lg bg-black/50 px-3 py-1.5 text-neon-violet">COMBO <strong>×{Math.min(4, 1 + Math.floor(combo / 4))}</strong></span>
          <span className="rounded-lg bg-black/50 px-3 py-1.5 text-slate-300">BEST <strong>{best}</strong></span>
          <span className="rounded-lg bg-black/50 px-3 py-1.5 text-ok">
            INTÉGRITÉ <strong>{integrity}%</strong>
            <span className="ml-2 inline-block h-1.5 w-16 overflow-hidden rounded-full bg-white/10 align-middle">
              <span
                className="block h-full rounded-full transition-all duration-300"
                style={{ width: `${integrity}%`, background: integrity > 60 ? "#22c55e" : integrity > 30 ? "#f59e0b" : "#ef4444" }}
              />
            </span>
          </span>
          <button
            type="button"
            onClick={() => setPhase(phase === "running" ? "paused" : "running")}
            disabled={phase === "idle" || phase === "over"}
            className="rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-slate-200 transition hover:border-neon-blue hover:text-neon-blue cursor-pointer disabled:opacity-40"
          >
            {phase === "running" ? "PAUSE" : "REPRENDRE"}
          </button>
        </div>
      </div>

      <p className="mt-3 font-mono text-xs text-slate-300">{statusMsg}</p>

      <div className="relative mt-3 overflow-hidden rounded-xl border border-white/10 bg-bg">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          tabIndex={0}
          aria-label="Mini-jeu WAF : déplacez le bouclier avec la souris ou les flèches du clavier"
          className="aspect-[2/1] w-full cursor-crosshair touch-none block focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue"
        />
        {phase !== "running" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 p-4 text-center backdrop-blur-xs">
            {phase === "idle" && (
              <p className="max-w-md font-mono text-xs text-slate-300">
                Bloque les paquets <strong className="text-red-400">ROUGES</strong> (intrusions) et les
                <strong className="text-neon-violet"> VIOLETS</strong> (menaces critiques ×50), laisse passer les
                <strong className="text-neon-blue"> CYAN</strong> vers le serveur. Enchaîne les blocages pour un combo ×4 !
              </p>
            )}
            {phase === "paused" && <p className="font-mono text-sm text-neon-blue">SIMULATION EN PAUSE</p>}
            {phase === "over" && (
              <div>
                <p className="font-mono text-sm text-red-400">✖ SI COMPROMISE — WAVE {wave}</p>
                <p className="mt-1 font-mono text-xs text-slate-300">
                  Score final : <strong className="text-white">{score}</strong> — Record : <strong className="text-neon-blue">{best}</strong>
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={phase === "paused" ? () => setPhase("running") : start}
              className="mt-4 rounded-lg border border-neon-blue bg-neon-blue/15 px-5 py-2.5 font-mono text-xs font-semibold text-neon-blue transition hover:bg-neon-blue hover:text-bg cursor-pointer"
            >
              {phase === "over" ? "↻ RELANCER L'AUDIT" : phase === "paused" ? "▶ REPRENDRE" : "▶ LANCER LA SIMULATION"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
