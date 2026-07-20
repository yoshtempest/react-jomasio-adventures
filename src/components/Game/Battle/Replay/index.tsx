import { useState, useEffect, useRef, useCallback } from "react";
import { asset } from "@/utils/paths";
import { getSpritePath } from "@/utils/npc/getSpritePath";
import { formatDuration } from "@/utils/formatDuration";
import type { ReplayData, ReplayFrame } from "@/utils/types/replay";
import styles from "./styles.module.css";

type Props = {
  replay: ReplayData;
  onClose: () => void;
};

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 600;

const CROUCH_STATES: Record<string, string> = {
  idleCrounched: "idleCrounched",
  walkCrounched: "walkCrounched",
};

function resolvePlayerState(state: string): string {
  return CROUCH_STATES[state] ?? (state === "charging" ? "idle" : state);
}

function HealthBar({
  hp,
  maxHp,
  reversed,
}: {
  hp: number;
  maxHp: number;
  reversed?: boolean;
}) {
  const pct = maxHp > 0 ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 0;
  const color = pct > 70 ? "limegreen" : pct > 30 ? "orange" : "red";
  return (
    <div className={styles.healthBarOuter}>
      <div
        className={styles.healthBarInner}
        style={{
          width: `${pct}%`,
          backgroundColor: color,
          ...(reversed ? { marginLeft: "auto" } : {}),
        }}
      />
      <span className={styles.healthText}>
        {Math.round(hp)} / {maxHp}
      </span>
    </div>
  );
}

function DamageNumberDisplay({
  dmg,
  sx,
  sy,
}: {
  dmg: ReplayFrame["dmg"];
  sx: number;
  sy: number;
}) {
  return (
    <>
      {dmg.map((d, i) => (
        <div
          key={i}
          className={`${styles.dmgNumber} ${d.c ? styles.dmgCrit : ""}`}
          style={{
            left: d.x * sx,
            top: d.y * sy - 80,
          }}
        >
          {d.c ? "CRIT " : ""}
          {d.v > 0 ? `-${d.v}` : "0"}
        </div>
      ))}
    </>
  );
}

export function ReplayPlayer({ replay, onClose }: Props) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!viewportRef.current) return;
    const el = viewportRef.current;
    const obs = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setViewportSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const sx = viewportSize.w > 0 ? viewportSize.w / BASE_WIDTH : 0;
  const sy = viewportSize.h > 0 ? viewportSize.h / BASE_HEIGHT : 0;

  const PLAYER_SIZE = 600 * 0.35;
  const SCALE = PLAYER_SIZE / BASE_HEIGHT;
  const WIDTH = BASE_WIDTH * SCALE;
  const HEIGHT = BASE_HEIGHT * SCALE;

  const TILE_SIZE = 64 * Math.min(sx, sy, 1);

  const frame = replay.frames[frameIndex];
  const totalFrames = replay.frames.length;
  const progress = totalFrames > 1 ? (frameIndex / (totalFrames - 1)) * 100 : 0;

  const step = useCallback(
    (delta: number) => {
      setFrameIndex((prev) => {
        const next = prev + delta;
        if (next >= totalFrames) {
          setIsPlaying(false);
          return totalFrames - 1;
        }
        if (next < 0) return 0;
        return next;
      });
    },
    [totalFrames],
  );

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPlaying && frameIndex < totalFrames - 1) {
      intervalRef.current = setInterval(() => step(1), 100 / speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, frameIndex, totalFrames, step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
      if (e.key === "ArrowRight") step(5);
      if (e.key === "ArrowLeft") step(-5);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  if (!frame) return null;

  const isCrouching =
    frame.ps === "idleCrounched" || frame.ps === "walkCrounched";
  const isFallen = frame.ps === "fallen";
  const playerSrc = asset(
    `assets/player/${replay.playerCharacter}/inFight/${resolvePlayerState(frame.ps)}.svg`,
  );
  const npcSrc = asset(getSpritePath(replay.npcType, frame.ns, 1));
  const bgUrl = replay.background ? asset(replay.background) : "";

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>
            Replay — {replay.npcType} nv.{replay.npcLevel}
          </span>
          <span className={styles.time}>
            {formatDuration(frame.t)} / {formatDuration(replay.duration)}
          </span>
        </div>

        <div
          ref={viewportRef}
          className={styles.viewport}
          style={
            bgUrl
              ? { backgroundImage: `url(${bgUrl})`, backgroundSize: "cover" }
              : undefined
          }
        >
          {sx > 0 && (
            <>
              <div className={styles.dmgLayer}>
                <DamageNumberDisplay dmg={frame.dmg} sx={sx} sy={sy} />
              </div>

              <img
                src={playerSrc}
                className={styles.entity}
                style={{
                  width: WIDTH,
                  height: HEIGHT,
                  left: frame.px * sx,
                  top: frame.py * sy,
                  transform: `
                    translate(-50%, -100%)
                    scaleX(${frame.pd === "left" ? -1 : 1})
                    ${isCrouching ? "scale(0.7)" : isFallen ? "scale(0.7) translate(0, 20%)" : ""}
                  `,
                }}
              />

              <img
                src={npcSrc}
                className={styles.entity}
                style={{
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  left: frame.nx * sx,
                  top: frame.ny * sy,
                  transform: "translate(-50%, -100%)",
                }}
              />

              {frame.sm.map((s, i) => {
                const summonSrc = asset(getSpritePath(s.t, "idle", 1));
                return (
                  <img
                    key={i}
                    src={summonSrc}
                    className={styles.entity}
                    style={{
                      width: TILE_SIZE * 0.8,
                      height: TILE_SIZE * 0.8,
                      left: s.x * sx,
                      top: s.y * sy,
                      transform: "translate(-50%, -100%)",
                      opacity: 0.8,
                    }}
                  />
                );
              })}
            </>
          )}
        </div>

        <div className={styles.bars}>
          <div>
            <span className={styles.barLabel}>Jogador</span>
            <HealthBar hp={frame.php} maxHp={frame.pmaxhp} />
          </div>
          <div>
            <span className={styles.barLabel}>Inimigo</span>
            <HealthBar hp={frame.nhp} maxHp={frame.nmaxhp} reversed />
          </div>
        </div>

        {frame.cc > 0 && (
          <div className={styles.comboBadge}>
            Combo {frame.cc}x — {frame.cr}
          </div>
        )}

        <div className={styles.controls}>
          <button
            className={styles.ctrlBtn}
            onClick={() => {
              setFrameIndex(0);
              setIsPlaying(true);
            }}
          >
            ⟳
          </button>
          <button className={styles.ctrlBtn} onClick={() => step(-5)}>
            ◀◀
          </button>
          <button
            className={styles.ctrlBtn}
            onClick={() => setIsPlaying((p) => !p)}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className={styles.ctrlBtn} onClick={() => step(5)}>
            ▶▶
          </button>
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
          <button className={styles.ctrlBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.progressOuter}>
          <div
            className={styles.progressInner}
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={totalFrames - 1}
            value={frameIndex}
            onChange={(e) => {
              setFrameIndex(Number(e.target.value));
              setIsPlaying(false);
            }}
            className={styles.slider}
          />
        </div>
      </div>
    </div>
  );
}
