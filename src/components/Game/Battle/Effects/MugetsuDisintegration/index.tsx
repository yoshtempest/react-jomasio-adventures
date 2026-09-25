import { useEffect, useRef, useState } from "react";
import { getViewportSize } from "@/utils/viewport";
import {
  getBossSizeMultiplier,
  getNpcSpriteYOffset,
  getSpritePath,
} from "@/utils/npc/getSpritePath";
import { ProjectileConstants } from "@/data/projectile";
import {
  DOMAIN_EXPANSION_DISINTEGRATION_MS,
  type MugetsuDisintegrationTarget,
  type MugetsuSweep,
} from "@/hooks/battle/player/characters/marshadow/useDomainExpansion";

type Props = {
  targets: MugetsuDisintegrationTarget[];
  /** Varredura ativa (null após chegar na ponta — todo alvo já coberto). */
  sweep: MugetsuSweep | null;
  TILE_SIZE: number;
};

const GRID_COLS = 12;
const GRID_ROWS = 12;

/** PRNG determinístico por célula: mesmo destino de pó em todos os frames. */
function cellRand(
  id: string,
  col: number,
  row: number,
  salt: string,
): number {
  let h = 2166136261;
  const s = `${id}:${col}:${row}:${salt}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

type TargetProps = {
  target: MugetsuDisintegrationTarget;
  sweep: MugetsuSweep | null;
  TILE_SIZE: number;
};

/**
 * Desintegração de um alvo tocado pela varredura (3s): o sprite é renderizado
 * num canvas e picotado numa grade de pixels; conforme o mugetsuEffect passa,
 * os pixels viram pretos; quando o alvo é engolido por inteiro, os pixels saem
 * voando (vento da varredura + subida) e somem como pó.
 */
function MugetsuTargetDisintegration({ target, sweep, TILE_SIZE }: TargetProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dustStartRef = useRef<number | null>(null);
  const idleTriedRef = useRef(false);
  const rafRef = useRef(0);
  const sweepRef = useRef(sweep);
  sweepRef.current = sweep;

  const [src, setSrc] = useState(() =>
    getSpritePath(target.npcType, target.state, target.npcPhase, target.isAlfa),
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scaleX = getViewportSize().width / ProjectileConstants.MAP_WIDTH;
    const sizeMultiplier = getBossSizeMultiplier(
      target.npcType,
      target.npcPhase,
      target.isAlfa,
    );
    const w = TILE_SIZE * sizeMultiplier;
    const canvasSize = w * 8;
    const margin = (canvasSize - w) / 2;

    canvas.width = Math.round(canvasSize * dpr);
    canvas.height = Math.round(canvasSize * dpr);
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;

    const logicWidth = w / scaleX;
    const cellW = w / GRID_COLS;
    const cellH = w / GRID_ROWS;
    const wind = target.direction === "right" ? 1 : -1;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      const now = Date.now();
      const elapsed = now - target.startedAt;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      if (elapsed < 0 || elapsed >= DOMAIN_EXPANSION_DISINTEGRATION_MS) return;

      // Sprite original inteiro por baixo (células ainda não cobertas).
      const img = imageRef.current;
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, margin, margin, w, w);
      }

      const frontX = sweepRef.current?.x ?? null;
      const left = target.x - logicWidth / 2;
      const right = target.x + logicWidth / 2;

      const fullyEngulfed =
        frontX == null
          ? true
          : target.direction === "right"
            ? frontX >= right
            : frontX <= left;

      if (!fullyEngulfed) {
        dustStartRef.current = null;
      } else if (dustStartRef.current == null) {
        dustStartRef.current = now;
      }

      const dustAt = dustStartRef.current;
      const dustRemaining =
        dustAt == null
          ? 0
          : Math.max(
              0,
              DOMAIN_EXPANSION_DISINTEGRATION_MS - (dustAt - target.startedAt),
            );

      for (let col = 0; col < GRID_COLS; col++) {
        for (let row = 0; row < GRID_ROWS; row++) {
          const cellCenterX = left + ((col + 0.5) / GRID_COLS) * logicWidth;
          const covered =
            frontX == null
              ? true
              : target.direction === "right"
                ? frontX >= cellCenterX
                : frontX <= cellCenterX;
          if (!covered) continue;

          const x = margin + col * cellW;
          const y = margin + row * cellH;

          if (dustAt == null) {
            // Célula escurecida: a passagem do mugetsuEffect deixou o pixel preto.
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = "#000000";
            ctx.fillRect(x, y, cellW, cellH);
            ctx.globalAlpha = 1;
            continue;
          }

          // Pó: o pixel preto sai voando (vento + subida) e desvanece.
          const delay = cellRand(target.id, col, row, "delay") * 180;
          const t = now - dustAt - delay;
          if (t <= 0) {
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = "#000000";
            ctx.fillRect(x, y, cellW, cellH);
            ctx.globalAlpha = 1;
            continue;
          }

          const k = Math.min(1, t / Math.max(1, dustRemaining));
          const speed = cellRand(target.id, col, row, "speed");
          const rise = cellRand(target.id, col, row, "rise");
          // Velocidade proporcional ao tamanho do sprite: o pó voa até ~3.5w
          // sem passar da margem do canvas (que é w * 8).
          const ax = (wind * ((0.4 + speed * 0.7) * w)) / 1000;
          const ay = -(((0.3 + rise * 0.6) * w) / 1000);
          const driftX = ax * (t / 1000);
          const driftY = ay * (t / 1000);
          const shrink = 1 - 0.35 * k;

          ctx.save();
          ctx.globalAlpha = Math.max(0, 1 - k * k);
          ctx.fillStyle = "#000000";
          ctx.fillRect(
            x + driftX + (cellW * (1 - shrink)) / 2,
            y + driftY + (cellH * (1 - shrink)) / 2,
            cellW * shrink,
            cellH * shrink,
          );
          ctx.restore();
        }
      }
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [src, target, TILE_SIZE]);

  const scaleX = getViewportSize().width / ProjectileConstants.MAP_WIDTH;
  const scaleY = getViewportSize().height / ProjectileConstants.MAP_HEIGHT;
  const sizeMultiplier = getBossSizeMultiplier(
    target.npcType,
    target.npcPhase,
    target.isAlfa,
  );
  const yOffset = getNpcSpriteYOffset(target.npcType);
  const w = TILE_SIZE * sizeMultiplier;
  const canvasSize = w * 8;
  const margin = (canvasSize - w) / 2;
  const spriteScreenX = target.x * scaleX;
  const spriteScreenY = target.y * scaleY;

  return (
    <div
      style={{
        position: "absolute",
        left: spriteScreenX - w / 2 - margin,
        top: spriteScreenY - w + yOffset * w - margin,
        width: canvasSize,
        height: canvasSize,
        zIndex: 9,
        pointerEvents: "none",
      }}
    >
      {/* Canvas maior que o sprite: o pó tem espaço para voar e desvanecer. */}
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      {/* Carregador (e fallback idle) do sprite do alvo. */}
      <img
        ref={imageRef}
        src={src}
        alt=""
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onError={() => {
          if (idleTriedRef.current) return;
          idleTriedRef.current = true;
          setSrc(
            getSpritePath(
              target.npcType,
              "idle",
              target.npcPhase,
              target.isAlfa,
            ),
          );
        }}
        style={{ display: "none" }}
      />
    </div>
  );
}

/**
 * Camada visual da desintegração da Expansão de Domínio: todos os alvos
 * tocados (NPC principal + summons) viram pixels pretos → pó assoprado.
 */
export function MugetsuDisintegration({ targets, sweep, TILE_SIZE }: Props) {
  if (targets.length === 0) return null;

  return (
    <>
      {targets.map((target) => (
        <MugetsuTargetDisintegration
          key={target.id}
          target={target}
          sweep={sweep}
          TILE_SIZE={TILE_SIZE}
        />
      ))}
    </>
  );
}