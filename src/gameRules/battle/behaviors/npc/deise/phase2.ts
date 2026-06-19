import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { DeiseAI } from "./state";
import {
  SPEAR_RAIN_COOLDOWN,
  SPEAR_RAIN_WARNING_DURATION,
  SPEAR_FALL_SPEED,
  OFFSCREEN_BOTTOM,
  MIN_ACTION_GAP,
  generateSpearPositions,
} from "./state";

type Phase2Result = {
  x: number;
  y: number;
  state?: "pitch" | "walk" | "attack";
};

export function deisePhase2(
  ctx: BehaviorContext,
  ai: DeiseAI,
): Phase2Result {
  const {
    npc, playerX, playerY,
    projectile, setProjectile,
    lastAttackRef, onMeleeHit,
    onProjectileHit,
  } = ctx;

  const now = Date.now();
  const isInPitch = now < ai.phase2PitchEnd;
  const canAct = now - ai.lastAction >= MIN_ACTION_GAP;

  // ── 1. Opening sequence (pitch + initial spear throw) ──
  if (!ai.phase2OpeningDone) {
    if (isInPitch) {
      return { x: npc.x, y: npc.y, state: "pitch" };
    }

    if (!projectile) {
      setProjectile({
        x: npc.x - 40,
        y: npc.y + 100,
        startX: npc.x - 40,
        startY: npc.y + 600,
        dirX: 0,
        dirY: -1,
        sprite: "spear",
        createdAt: now,
        state: "idle",
        fallTargetX: playerX,
        spear: { phase: "rising" },
      });

      ai.lastStaffThrow = now;
      ai.lastAction = now;
      ai.phase2PitchEnd = now;
      ai.phase2OpeningDone = true;
      return { x: npc.x, y: npc.y, state: "pitch" };
    }

    // Opening spear in flight — chase during this period
    const { x } = chasePlayer(npc, playerX, playerY);
    const meleeHit = tryMeleeAttack({
      npcX: npc.x, npcY: npc.y,
      playerX, playerY,
      range: 200, cooldown: 2000,
      lastAttackRef, onHit: onMeleeHit,
    });
    if (meleeHit) {
      return { x, y: npc.y, state: "attack" };
    }
    return { x, y: npc.y, state: "walk" };
  }

  // ── 2. Spear rain cycle (only when no projectile active) ──
  if (!projectile) {
    // 2a. Update falling spears
    if (ai.spearRainPhase === "falling") {
      const spears = npc.fallingSpears;
      if (spears && spears.length > 0) {
        let allDone = true;
        for (const s of spears) {
          s.y += SPEAR_FALL_SPEED;
          if (s.y < OFFSCREEN_BOTTOM) {
            allDone = false;
            if (!s.hit && s.y >= 550 && s.y <= OFFSCREEN_BOTTOM) {
              const dx = Math.abs(playerX - s.x);
              if (dx < 60) {
                s.hit = true;
                onProjectileHit();
              }
            }
          }
        }
        if (allDone) {
          npc.fallingSpears = undefined;
          ai.spearRainPhase = "idle";
        }
      } else {
        ai.spearRainPhase = "idle";
      }
    }

    // 2b. Start new spear rain warning
    if (
      ai.spearRainPhase === "idle" &&
      canAct &&
      now - ai.lastSpearRain >= SPEAR_RAIN_COOLDOWN
    ) {
      const positions = generateSpearPositions(playerX);
      npc.dangerZones = positions.map((x) => ({ x, startTime: now }));
      ai.spearRainPhase = "warning";
      ai.spearRainWarningStart = now;
      ai.spearRainPositions = positions;
      ai.lastSpearRain = now;
      ai.lastAction = now;
    }

    // 2c. Transition warning → falling
    if (
      ai.spearRainPhase === "warning" &&
      now - ai.spearRainWarningStart >= SPEAR_RAIN_WARNING_DURATION
    ) {
      npc.fallingSpears = ai.spearRainPositions.map((x) => ({
        x,
        y: -50,
      }));
      npc.dangerZones = undefined;
      ai.spearRainPhase = "falling";
    }
  }

  // ── 3. Movement & melee ──
  if (
    ai.spearRainPhase === "idle" ||
    ai.spearRainPhase === "warning" ||
    (ai.phase2OpeningDone && projectile != null)
  ) {
    const { x } = chasePlayer(npc, playerX, playerY);
    const meleeHit = tryMeleeAttack({
      npcX: npc.x, npcY: npc.y,
      playerX, playerY,
      range: 200, cooldown: 2000,
      lastAttackRef, onHit: onMeleeHit,
    });
    if (meleeHit) {
      return { x, y: npc.y, state: "attack" };
    }
    return { x, y: npc.y, state: "walk" };
  }

  // Standing still during falling phase
  return { x: npc.x, y: npc.y, state: "attack" };
}
