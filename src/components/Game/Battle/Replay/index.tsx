import { useState, useEffect, useRef, useCallback } from "react";
import { asset } from "@/utils/paths";
import {
  getSpritePath,
  getBossSizeMultiplier,
} from "@/utils/npc/getSpritePath";
import type { ReplayData } from "@/utils/types/replay";
import { ReplayHeader } from "./ReplayHeader";
import { HudPlayer } from "./HudPlayer";
import { HudNpc } from "./HudNpc";
import { ComboDisplay } from "./ComboDisplay";
import { ComboAction } from "./ComboAction";
import { ReplayControls } from "./ReplayControls";
import { ReplayProgress } from "./ReplayProgress";
import styles from "./styles.module.css";
import { ProjectileConstants } from "@/data/projectile";

type Props = {
  replay: ReplayData;
  onClose: () => void;
};

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
  const sx = w / ProjectileConstants.MAP_WIDTH;
  const sy = h / ProjectileConstants.MAP_HEIGHT;
  return { TILE, ox, oy, PLAYER, sx, sy };
}

const CROUCH: Record<string, string> = {
  idleCrounched: "idleCrounched",
  walkCrounched: "walkCrounched",
};

function resolvePlayerState(s: string): string {
  return CROUCH[s] ?? (s === "charging" ? "idle" : s);
}

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
        if (n >= total) {
          setPlaying(false);
          return total - 1;
        }
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
    return () => {
      if (ivRef.current) clearInterval(ivRef.current);
    };
  }, [playing, speed, fi, total, step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
      if (e.key === "ArrowRight") step(5);
      if (e.key === "ArrowLeft") step(-5);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  if (!f) return null;

  const isCrouching = f.ps === "idleCrounched" || f.ps === "walkCrounched";
  const isFallen = f.ps === "fallen";

  const playerSrc = asset(
    `assets/player/${f.pchar}/inFight/${resolvePlayerState(f.ps)}.svg`,
  );
  const npcSize = TILE * getBossSizeMultiplier(replay.npcType, f.npcPhase);
  const npcSrc = getSpritePath(replay.npcType, f.ns, f.npcPhase);
  const bgUrl = replay.background ?? "";

  return (
    <div className={styles.overlay}>
      <div className={styles.outer}>
        <ReplayHeader
          npcType={replay.npcType}
          npcLevel={replay.npcLevel}
          currentTime={f.t}
          duration={replay.duration}
        />

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
              width: ProjectileConstants.MAP_WIDTH,
              height: ProjectileConstants.MAP_HEIGHT,
              transform: `scale(${Math.min(sx, sy)})`,
              transformOrigin: "top left",
            }}
          >
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

            {f.sm.map((s) => (
              <img
                key={s.id}
                src={getSpritePath(s.t, s.st, 1)}
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
            ))}

            {f.pettype && f.petx != null && f.pety != null && (
              <img
                src={getSpritePath(f.pettype, f.petst ?? "idle", 1)}
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

            <div
              className={styles.sprite}
              style={{
                position: "absolute",
                width:
                  PLAYER *
                  (ProjectileConstants.MAP_WIDTH /
                    ProjectileConstants.MAP_HEIGHT),
                height: PLAYER,
                left: f.px,
                top: f.py,
                transform: "translate(-50%, -100%)",
                zIndex: 10,
                overflow: "visible",
              }}
            >
              <img
                src={playerSrc}
                style={{
                  position: "absolute",
                  width: "auto",
                  height: "100%",
                  left: "50%",
                  bottom: 0,
                  transform: `
                    translateX(-50%)
                    scaleX(${f.pd === "left" ? -1 : 1})
                    ${isCrouching ? "scale(0.7)" : isFallen ? "scale(0.7) translate(0, 20%)" : ""}
                  `,
                  pointerEvents: "none",
                }}
              />
            </div>

            {f.dmg.map((d, i) => (
              <div
                key={i}
                className={`${styles.dmgNum} ${d.c ? styles.dmgCrit : ""} ${d.ty === "miss" ? styles.dmgMiss : ""} ${d.ty === "blocked" ? styles.dmgBlocked : ""}`}
                style={{ left: d.x, top: d.y - 80, zIndex: 100 }}
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

            <ComboDisplay
              count={f.cc}
              rank={f.cr}
              progress={f.cprog}
              nextRank={f.cnext}
            />

            {f.comboAction && (
              <ComboAction action={f.comboAction} charId={f.pchar} />
            )}
          </div>

          <HudPlayer
            pchar={f.pchar}
            php={f.php}
            pmaxhp={f.pmaxhp}
            pshield={f.pshield}
            del={f.del}
            hits={f.hits}
            blockGauge={f.blockGauge}
            blockLimit={f.blockLimit}
            pettype={f.pettype}
            petphp={f.petphp}
            petpmaxhp={f.petpmaxhp}
          />

          <HudNpc
            npcType={replay.npcType}
            npcLevel={replay.npcLevel}
            nhp={f.nhp}
            nmaxhp={f.nmaxhp}
          />
        </div>

        <ReplayControls
          isPlaying={playing}
          speed={speed}
          onRestart={() => {
            setFi(0);
            setPlaying(true);
          }}
          onStepBack={() => step(-5)}
          onTogglePlay={() => setPlaying((p) => !p)}
          onStepForward={() => step(5)}
          onClose={onClose}
          onSpeedChange={setSpeed}
        />

        <ReplayProgress
          currentFrame={fi}
          totalFrames={total}
          pct={pct}
          onSeek={(frame) => {
            setFi(frame);
            setPlaying(false);
          }}
        />
      </div>
    </div>
  );
}
