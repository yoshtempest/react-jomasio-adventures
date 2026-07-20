import { useState, useEffect, useRef, useCallback } from "react";
import { asset } from "@/utils/paths";
import { getSpritePath, getBossSizeMultiplier } from "@/utils/npc/getSpritePath";
import { formatDuration } from "@/utils/formatDuration";
import type { ReplayData } from "@/utils/types/replay";
import styles from "./styles.module.css";

type Props = {
  replay: ReplayData;
  onClose: () => void;
};

const BASE_W = 1280;
const BASE_H = 600;
const MAP_COLS = 17;
const MAP_ROWS = 13;
const SCALE_FIX = 1.4;

function getLayout(w: number, h: number) {
  const cw = w * 0.74;
  const ch = h;
  const TILE = Math.min(cw / MAP_COLS, ch / MAP_ROWS) * SCALE_FIX;
  const ox = (cw - MAP_COLS * TILE) / 2;
  const oy = (ch - MAP_ROWS * TILE) / 2;
  const PLAYER = TILE * 1.4;
  const sx = w / BASE_W;
  const sy = h / BASE_H;
  return { TILE, ox, oy, PLAYER, sx, sy };
}

const CROUCH: Record<string, string> = {
  idleCrounched: "idleCrounched",
  walkCrounched: "walkCrounched",
};

function resolvePlayerState(s: string): string {
  return CROUCH[s] ?? (s === "charging" ? "idle" : s);
}

const RANK_COLORS: Record<string, string> = {
  F: "#888",
  E: "#8b8b00",
  D: "#cd7f32",
  C: "#c0c0c0",
  B: "var(--gold)",
  A: "#ff6b35",
  S: "#ff0044",
  "S+": "#ff00ff",
  SS: "#00ffff",
};

export function ReplayPlayer({ replay, onClose }: Props) {
  const [fi, setFi] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const vpRef = useRef<HTMLDivElement>(null);
  const [vpSize, setVpSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!vpRef.current) return;
    const el = vpRef.current;
    const obs = new ResizeObserver((entries) => {
      const e = entries[0];
      if (e) setVpSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { TILE, PLAYER, sx, sy } = getLayout(vpSize.w, vpSize.h);

  const f = replay.frames[fi];
  const total = replay.frames.length;
  const pct = total > 1 ? (fi / (total - 1)) * 100 : 0;

  const step = useCallback(
    (d: number) => {
      setFi((p) => {
        const n = p + d;
        if (n >= total) { setPlaying(false); return total - 1; }
        if (n < 0) return 0;
        return n;
      });
    },
    [total],
  );

  useEffect(() => {
    if (ivRef.current) clearInterval(ivRef.current);
    if (playing && fi < total - 1) {
      ivRef.current = setInterval(() => step(1), 100 / speed);
    }
    return () => { if (ivRef.current) clearInterval(ivRef.current); };
  }, [playing, speed, fi, total, step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
      if (e.key === "ArrowRight") step(5);
      if (e.key === "ArrowLeft") step(-5);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  if (!f || sx === 0) return null;

  const isCrouching = f.ps === "idleCrounched" || f.ps === "walkCrounched";
  const isFallen = f.ps === "fallen";

  const playerSrc = asset(`assets/player/${f.pchar}/inFight/${resolvePlayerState(f.ps)}.svg`);
  const npcSize = TILE * getBossSizeMultiplier(replay.npcType, f.npcPhase);
  const npcSrc = asset(getSpritePath(replay.npcType, f.ns, f.npcPhase));
  const bgUrl = replay.background ?? "";

  const pPct = f.pmaxhp > 0 ? Math.max(0, Math.min(100, (f.php / f.pmaxhp) * 100)) : 0;
  const nPct = f.nmaxhp > 0 ? Math.max(0, Math.min(100, (f.nhp / f.nmaxhp) * 100)) : 0;
  const pColor = pPct > 70 ? "limegreen" : pPct > 30 ? "orange" : "red";
  const nColor = nPct > 70 ? "limegreen" : nPct > 30 ? "orange" : "red";
  const delPct = f.hits > 0 ? Math.min(100, (f.del / f.hits) * 100) : 0;
  const delFull = f.del >= f.hits;

  return (
    <div className={styles.overlay}>
      <div className={styles.outer}>
        <div className={styles.header}>
          <span className={styles.title}>
            Replay — {replay.npcType} nv.{replay.npcLevel}
          </span>
          <span className={styles.time}>
            {formatDuration(f.t)} / {formatDuration(replay.duration)}
          </span>
        </div>

        <div ref={vpRef} className={styles.vp}>
          {bgUrl && (
            <div
              className={styles.vpBg}
              style={{ backgroundImage: `url(${bgUrl})` }}
            />
          )}

          <div
            className={styles.gameLayer}
            style={{
              width: BASE_W,
              height: BASE_H,
              transform: `scale(${Math.min(sx, sy)})`,
              transformOrigin: "top left",
            }}
          >
            {/* NPC */}
            <img
              src={npcSrc}
              className={styles.sprite}
              style={{
                width: npcSize,
                height: npcSize,
                left: f.nx,
                top: f.ny,
                transform: `translate(-50%, -100%) scaleX(${f.ndir === "right" ? -1 : 1})`,
                zIndex: 5,
              }}
            />

            {/* Summons */}
            {f.sm.map((s) => {
              const sSrc = asset(getSpritePath(s.t, s.st, 1));
              return (
                <img
                  key={s.id}
                  src={sSrc}
                  className={styles.sprite}
                  style={{
                    width: TILE,
                    height: TILE,
                    left: s.x,
                    top: s.y,
                    transform: `translate(-50%, -100%) scaleX(${s.dir === "right" ? -1 : 1})`,
                    zIndex: 6,
                  }}
                />
              );
            })}

            {/* Pet */}
            {f.pettype && f.petx != null && f.pety != null && (
              <img
                src={asset(getSpritePath(f.pettype, f.petst ?? "idle", 1))}
                className={styles.sprite}
                style={{
                  width: TILE * 0.8,
                  height: TILE * 0.8,
                  left: f.petx,
                  top: f.pety,
                  transform: `translate(-50%, -100%) scaleX(${f.petdir === "right" ? -1 : 1})`,
                  zIndex: 7,
                }}
              />
            )}

            {/* Player */}
            <img
              src={playerSrc}
              className={styles.sprite}
              style={{
                width: PLAYER,
                height: PLAYER,
                left: f.px,
                top: f.py,
                transform: `
                  translate(-50%, -100%)
                  scaleX(${f.pd === "left" ? -1 : 1})
                  ${isCrouching ? "scale(0.7)" : isFallen ? "scale(0.7) translate(0, 20%)" : ""}
                `,
                zIndex: 10,
              }}
            />

            {/* Damage Numbers */}
            {f.dmg.map((d, i) => (
              <div
                key={i}
                className={`${styles.dmgNum} ${d.c ? styles.dmgCrit : ""} ${d.ty === "miss" ? styles.dmgMiss : ""} ${d.ty === "blocked" ? styles.dmgBlocked : ""}`}
                style={{
                  left: d.x,
                  top: d.y - 80,
                  zIndex: 100,
                }}
              >
                {d.ty === "blocked"
                  ? "BLOCKED!"
                  : d.ty === "miss"
                    ? "MISS!"
                    : d.c
                      ? `CRIT -${d.v}`
                      : d.v > 0
                        ? `-${d.v}`
                        : "0"}
              </div>
            ))}

            {/* ─── HUD: Player Panel (bottom-left) ─── */}
            <div className={styles.hudPlayer}>
              <div className={styles.hudRow}>
                <div className={styles.hudBarOuter}>
                  <div className={styles.hudBarFill} style={{ width: `${pPct}%`, background: pColor }} />
                  <span className={styles.hudBarText}>{Math.round(f.php)} / {f.pmaxhp}</span>
                </div>
              </div>
              {f.pshield > 0 && (
                <div className={styles.shieldTrack}>
                  <div className={styles.shieldFill} style={{ width: `${Math.min(100, (f.pshield / 100) * 100)}%` }} />
                </div>
              )}
              <div className={styles.hudRow}>
                <span className={styles.hudLabel}>Delícia</span>
                <div className={styles.delTrack}>
                  <div
                    className={styles.delFill}
                    style={{
                      width: `${delPct}%`,
                      background: delFull ? "var(--gold)" : "#ff6b35",
                    }}
                  />
                </div>
                <span className={styles.delText}>
                  {Math.round(f.del)} / {f.hits}
                </span>
              </div>
              {f.pettype && f.petphp != null && f.petpmaxhp != null && (
                <div className={styles.hudRow}>
                  <span className={styles.hudLabel}>Pet</span>
                  <div className={styles.hudBarOuter}>
                    <div
                      className={styles.hudBarFill}
                      style={{
                        width: `${f.petpmaxhp > 0 ? (f.petphp / f.petpmaxhp) * 100 : 0}%`,
                        background: "#44ff44",
                      }}
                    />
                    <span className={styles.hudBarText}>
                      {Math.round(f.petphp)} / {f.petpmaxhp}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ─── HUD: NPC Panel (top-right) ─── */}
            <div className={styles.hudNpc}>
              <span className={styles.npcName}>
                {replay.npcType} — nv.{replay.npcLevel}
              </span>
              <div className={styles.hudBarOuter}>
                <div
                  className={styles.hudBarFill}
                  style={{
                    width: `${nPct}%`,
                    background: nColor,
                    marginLeft: `${100 - nPct}%`,
                  }}
                />
                <span className={styles.hudBarText}>
                  {Math.round(f.nhp)} / {f.nmaxhp}
                </span>
              </div>
            </div>

            {/* ─── Combo Display (right side) ─── */}
            {f.cc > 0 && (
              <div className={styles.comboBox}>
                <div className={styles.comboHeader}>
                  <span
                    className={styles.comboRank}
                    style={{ color: RANK_COLORS[f.cr] ?? "#fff" }}
                  >
                    {f.cr}
                  </span>
                  <span className={styles.comboCount}>{f.cc}</span>
                </div>
                {f.cnext && (
                  <div className={styles.comboProgOuter}>
                    <div
                      className={styles.comboProgFill}
                      style={{ width: `${f.cprog * 100}%` }}
                    />
                    <span className={styles.comboNextLabel}>{f.cnext}</span>
                  </div>
                )}
              </div>
            )}

            {/* ─── Combo Action (left side, when triggered) ─── */}
            {f.comboAction && (
              <div className={styles.comboActionBox}>
                <div className={styles.comboActionBtn}>
                  <img
                    src={asset(`assets/player/${f.pchar}/inFight/${f.comboAction}`)}
                    alt="Combo"
                    draggable={false}
                  />
                  <h3>L</h3>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.controls}>
          <button className={styles.ctrlBtn} onClick={() => { setFi(0); setPlaying(true); }}>⟳</button>
          <button className={styles.ctrlBtn} onClick={() => step(-5)}>◀◀</button>
          <button className={styles.ctrlBtn} onClick={() => setPlaying((p) => !p)}>
            {playing ? "⏸" : "▶"}
          </button>
          <button className={styles.ctrlBtn} onClick={() => step(5)}>▶▶</button>
          <div className={styles.speedGroup}>
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                className={`${styles.speedBtn} ${speed === s ? styles.speedActive : ""}`}
                onClick={() => setSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
          <button className={styles.ctrlBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.progOuter}>
          <div className={styles.progFill} style={{ width: `${pct}%` }} />
          <input
            type="range"
            min={0}
            max={total - 1}
            value={fi}
            onChange={(e) => { setFi(Number(e.target.value)); setPlaying(false); }}
            className={styles.slider}
          />
        </div>
      </div>
    </div>
  );
}
