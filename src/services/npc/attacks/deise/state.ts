import {
  STAFF_COOLDOWN,
  SUMMON_COOLDOWN,
  MIN_ACTION_GAP,
} from "@/data/cooldowns";
import {
  SIX_HUNDRED_MS,
  THREE_THOUSAND_MS,
  TWO_HUNDRED_FIFTY_MS,
} from "@/data/ms";

export { STAFF_COOLDOWN, SUMMON_COOLDOWN, MIN_ACTION_GAP };

export const CLOSE_RANGE = 200;

/** Duração da arrancada (pitch) antes do dash na fase 2. */
export const DASH_WIND_UP_MS = SIX_HUNDRED_MS;
/** Duração total do trajeto do dash, de um lado ao outro da arena. */
export const DASH_DURATION_MS = THREE_THOUSAND_MS;
/** Distância de contato em que a Deise empurra/causa dano no jogador. */
export const DASH_CONTACT_RANGE = 60;
/** Intervalo de tentativa de dano enquanto o contato com o jogador persiste. */
export const DASH_DAMAGE_INTERVAL_MS = TWO_HUNDRED_FIFTY_MS;
/** Gap à frente da Deise onde o jogador é arrastado no contato. */
export const DASH_PUSH_GAP = 40;
/** Tempo ocioso sem atacar depois de chegar na outra ponta (janela de dano). */
export const DASH_POST_IDLE_MS = THREE_THOUSAND_MS;
/** Cooldown entre um dash e o próximo. */
export const DASH_COOLDOWN = THREE_THOUSAND_MS;

export type DeiseAI = {
  knownPhase: number;
  lastStaffThrow: number;
  lastSummon: number;
  lastAction: number;
  dashState: "idle" | "windUp" | "dashing" | "postDash";
  dashStart: number;
  dashStartX: number;
  dashDirection: "left" | "right";
  dashEndX: number;
  lastDash: number;
  lastDashDamage: number;
  postDashStart: number;
};

export function initDeiseAi(npcPhase: number): DeiseAI {
  const now = Date.now();
  return {
    knownPhase: npcPhase,
    lastStaffThrow: now - STAFF_COOLDOWN,
    lastSummon: now,
    lastAction: now - MIN_ACTION_GAP,
    dashState: "idle",
    dashStart: 0,
    dashStartX: 0,
    dashDirection: "left",
    dashEndX: 0,
    lastDash: now,
    lastDashDamage: 0,
    postDashStart: 0,
  };
}

export function handlePhaseChange(ai: DeiseAI, npcPhase: number): DeiseAI {
  ai.knownPhase = npcPhase;
  ai.lastStaffThrow = 0;
  ai.lastSummon = 0;
  ai.lastAction = 0;
  ai.dashState = "idle";
  ai.dashStart = 0;
  ai.dashStartX = 0;
  ai.lastDash = 0;
  ai.lastDashDamage = 0;
  ai.postDashStart = 0;
  return ai;
}