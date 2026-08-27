import type { CSSProperties } from "react";
import { npcPath } from "@/utils/paths";

export type PetStarVisual = {
  auraColor: string;
  auraGlow: string;
  brightness: number;
  scale: number;
  saturate: number;
};

const STAR_VISUALS: Record<number, PetStarVisual> = {
  1: {
    auraColor: "#9ca3af",
    auraGlow: "0 0 6px rgba(156, 163, 175, 0.55)",
    brightness: 1,
    scale: 1,
    saturate: 0.9,
  },
  2: {
    auraColor: "#4ade80",
    auraGlow: "0 0 10px rgba(74, 222, 128, 0.75)",
    brightness: 1.08,
    scale: 1.05,
    saturate: 1.05,
  },
  3: {
    auraColor: "#38bdf8",
    auraGlow: "0 0 14px rgba(56, 189, 248, 0.85)",
    brightness: 1.16,
    scale: 1.1,
    saturate: 1.12,
  },
  4: {
    auraColor: "#c084fc",
    auraGlow: "0 0 20px rgba(192, 132, 252, 0.95)",
    brightness: 1.25,
    scale: 1.16,
    saturate: 1.2,
  },
  5: {
    auraColor: "#fbbf24",
    auraGlow:
      "0 0 10px rgba(251, 191, 36, 0.95), 0 0 26px rgba(251, 191, 36, 0.8)",
    brightness: 1.35,
    scale: 1.22,
    saturate: 1.3,
  },
};

export function getPetStarVisual(stars: number): PetStarVisual {
  const clamped = Math.min(Math.max(Math.floor(stars), 1), 5);
  return STAR_VISUALS[clamped] ?? STAR_VISUALS[1]!;
}

export function petStarStyle(stars: number): CSSProperties {
  const v = getPetStarVisual(stars);
  return {
    filter: `brightness(${v.brightness}) saturate(${v.saturate}) drop-shadow(${v.auraGlow})`,
    transform: `scale(${v.scale})`,
  };
}

export function petNpcType(entry: {
  id: string;
  dropNpc?: string | null;
}): string {
  return entry.dropNpc ?? entry.id.replace("pet_", "");
}

export function petImagePath(petNpc: string, stars = 1): string {
  return npcPath(`/${petNpc}/default-${stars}.svg`);
}

export function petFallbackImagePath(petNpc: string): string {
  return npcPath(`/${petNpc}/default.svg`);
}
