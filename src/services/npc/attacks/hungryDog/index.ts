import { NpcAttack } from "@/services/npc/npcAttack";
import { NPC_MELEE_COOLDOWN } from "@/data/cooldowns";
import { chasePlayer, getBehindPlayerX } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import { BATTLE_LIMITS } from "@/gameRules/movement/constants";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import {
  BEHIND_OFFSET,
  DIG_DIG_MS,
  DIG_ENTERING_MS,
  DIG_TOTAL_MS,
  EMERGE_HOP_HEIGHT,
  EMERGE_LEAP_MS,
  FLEE_MS,
  INTRO_MS,
  INTRO_SUMMON_COUNT,
  MELEE_RANGE,
  SPECIAL_FIRST_DELAY_MS,
  SPECIAL_MAX,
  SPECIAL_RECHARGE_MS,
  SPECIAL_REUSE_COOLDOWN_MS,
  UNDERGROUND_MS,
  initHungryDogAi,
  type HungryDogAI,
} from "./state";

const FLEE_STEP = 7;
const FLEE_HOP_MS = 500;
const FLEE_HOP_HEIGHT = 40;

function clampX(x: number): number {
  return Math.max(BATTLE_LIMITS.minX, Math.min(BATTLE_LIMITS.maxX, x));
}

export class HungryDogAttack extends NpcAttack {
  constructor() {
    super("hungryDog");
  }

  execute(ctx: BehaviorContext): BehaviorResult {
    if (ctx.isAlfa) return this.executeAlfa(ctx);
    return this.executeNormal(ctx);
  }

  private executeNormal(ctx: BehaviorContext): BehaviorResult {
    const { npc, targetX, targetY, lastAttackRef, onMeleeHit } = ctx;

    const { x } = chasePlayer(npc, targetX, targetY, 1, MELEE_RANGE);

    tryMeleeAttack({
      npcX: npc.x,
      npcY: npc.y,
      playerX: targetX,
      playerY: targetY,
      range: MELEE_RANGE,
      cooldown: NPC_MELEE_COOLDOWN,
      lastAttackRef,
      onHit: onMeleeHit,
    });

    return { x, y: npc.y };
  }

  private rechargeSpecial(ai: HungryDogAI, now: number): void {
    if (ai.specialGauge >= SPECIAL_MAX) return;
    if (ai.lastRecharge === 0) ai.lastRecharge = now;
    while (ai.lastRecharge <= now && ai.specialGauge < SPECIAL_MAX) {
      ai.lastRecharge += SPECIAL_RECHARGE_MS;
      ai.specialGauge += 1;
    }
  }

  private executeAlfa(ctx: BehaviorContext): BehaviorResult {
    const { npc } = ctx;
    const ai = (npc.ai ??= {});
    if (!ai.hungryDog) ai.hungryDog = initHungryDogAi();
    const state = ai.hungryDog;
    const now = Date.now();

    if (state.phaseStart === 0) {
      state.phaseStart = now;
      state.lastRecharge = now;
    }

    switch (state.phase) {
      case "intro":
        return this.handleIntro(ctx, state, now);
      case "chase":
        return this.handleChase(ctx, state, now);
      case "dig":
        return this.handleDig(ctx, state, now);
      case "underground":
        return this.handleUnderground(ctx, state, now);
      case "emerge":
        return this.handleEmerge(ctx, state, now);
      case "flee":
        return this.handleFlee(ctx, state, now);
    }
  }

  private handleIntro(
    ctx: BehaviorContext,
    ai: HungryDogAI,
    now: number,
  ): BehaviorResult {
    if (now - ai.phaseStart >= INTRO_MS) {
      ai.phase = "chase";
      ai.phaseStart = now;
      ai.introEnd = now;
      return { x: ctx.npc.x, y: ctx.npc.y, state: "idle", hidden: false };
    }

    if (!ai.introSummoned) {
      ai.introSummoned = true;
      for (let i = 0; i < INTRO_SUMMON_COUNT; i += 1) {
        ctx.onSummonFromRight?.("hungryDog");
      }
    }

    return { x: ctx.npc.x, y: ctx.npc.y, state: "invoking", hidden: false };
  }

  private handleChase(
    ctx: BehaviorContext,
    ai: HungryDogAI,
    now: number,
  ): BehaviorResult {
    const { npc, targetX, targetY, lastAttackRef, onMeleeHit } = ctx;

    this.rechargeSpecial(ai, now);

    const { x } = chasePlayer(npc, targetX, targetY, 1, MELEE_RANGE);

    tryMeleeAttack({
      npcX: npc.x,
      npcY: npc.y,
      playerX: targetX,
      playerY: targetY,
      range: MELEE_RANGE,
      cooldown: NPC_MELEE_COOLDOWN,
      lastAttackRef,
      onHit: onMeleeHit,
    });

    if (
      ai.specialGauge >= SPECIAL_MAX &&
      now - ai.introEnd >= SPECIAL_FIRST_DELAY_MS &&
      now - ai.lastSpecialEnd >= SPECIAL_REUSE_COOLDOWN_MS
    ) {
      ai.phase = "dig";
      ai.phaseStart = now;
      ai.specialGauge = 0;
      ai.lastSpecialEnd = now;
      ai.lastRecharge = now;
    }

    return { x, y: npc.y };
  }

  private handleDig(
    ctx: BehaviorContext,
    ai: HungryDogAI,
    now: number,
  ): BehaviorResult {
    const { npc } = ctx;
    const elapsed = now - ai.phaseStart;

    if (elapsed >= DIG_TOTAL_MS) {
      ai.phase = "underground";
      ai.phaseStart = now;
      return { x: npc.x, y: npc.y, state: "entered", hidden: true };
    }

    if (elapsed < DIG_DIG_MS) {
      return { x: npc.x, y: npc.y, state: "dig" };
    }

    if (elapsed < DIG_DIG_MS + DIG_ENTERING_MS) {
      return { x: npc.x, y: npc.y, state: "entering" };
    }

    return { x: npc.x, y: npc.y, state: "entered" };
  }

  private handleUnderground(
    ctx: BehaviorContext,
    ai: HungryDogAI,
    now: number,
  ): BehaviorResult {
    const { npc, playerX, playerDirection } = ctx;
    const elapsed = now - ai.phaseStart;

    if (elapsed >= UNDERGROUND_MS) {
      ai.phase = "emerge";
      ai.phaseStart = now;
      ai.emergeFromX = clampX(
        getBehindPlayerX(playerX, playerDirection, BEHIND_OFFSET),
      );
      ai.emergeBaseY = npc.y;
      return {
        x: ai.emergeFromX,
        y: ai.emergeBaseY - EMERGE_HOP_HEIGHT,
        state: "jumping",
        hidden: false,
      };
    }

    return { x: npc.x, y: npc.y, state: "entered", hidden: true };
  }

  private handleEmerge(
    ctx: BehaviorContext,
    ai: HungryDogAI,
    now: number,
  ): BehaviorResult {
    const { playerX } = ctx;
    const elapsed = now - ai.phaseStart;
    const progress = Math.min(elapsed / EMERGE_LEAP_MS, 1);
    const eased = 1 - (1 - progress) * (1 - progress);

    const fromX = ai.emergeFromX;
    const endX = clampX(playerX);
    const x = fromX + (endX - fromX) * eased;
    const y = ai.emergeBaseY - Math.sin(progress * Math.PI) * EMERGE_HOP_HEIGHT;

    if (progress >= 1) {
      const parrying = ctx.isPlayerParrying?.() ?? false;

      if (!parrying) {
        ctx.onDragPlayer?.(x, y);
      }

      ai.phase = "flee";
      ai.phaseStart = now;
      // A recarga do special (1%/100ms) só conta a partir da fuga; o tempo
      // cavando/submerso não acumula.
      ai.lastRecharge = now;
      return { x, y: ai.emergeBaseY, state: "run", hidden: false };
    }

    return { x, y, state: "jumping", hidden: false };
  }

  private handleFlee(
    ctx: BehaviorContext,
    ai: HungryDogAI,
    now: number,
  ): BehaviorResult {
    const { npc, playerX } = ctx;
    const elapsed = now - ai.phaseStart;

    this.rechargeSpecial(ai, now);

    const dirAway = npc.x >= playerX ? 1 : -1;
    const nextX = clampX(npc.x + dirAway * FLEE_STEP);

    const hop =
      elapsed < FLEE_HOP_MS
        ? -Math.sin((elapsed / FLEE_HOP_MS) * Math.PI) * FLEE_HOP_HEIGHT
        : 0;

    if (elapsed >= FLEE_MS) {
      ai.phase = "chase";
      ai.phaseStart = now;
      return { x: nextX, y: npc.y, state: "walk" };
    }

    return { x: nextX, y: npc.y + hop, state: "run" };
  }
}