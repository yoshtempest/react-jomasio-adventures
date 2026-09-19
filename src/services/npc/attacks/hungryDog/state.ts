import {
  FOUR_HUNDRED_MS,
  ONE_HUNDRED_MS,
  ONE_THOUSAND_TWO_HUNDRED_MS,
  SIX_HUNDRED_MS,
  THREE_THOUSAND_MS,
  TWO_THOUSAND_MS,
} from "@/data/ms";

/**
 * Máquina de estados do Alfa Cão-hambúrguer (hungryDog alfa).
 *
 * - `intro`: animação de invocação (`invoking.svg`) por 2s com a câmera
 *   focada no alfa e o jogador travado; os aliados entram correndo pela
 *   direita (fora da vista).
 * - `chase`: comportamento padrão (perseguir + melee).
 * - `dig`: special — cava (`dig.svg` → `entering.svg` → `entered.svg`) e
 *   desaparece.
 * - `underground`: 3s oculto (fade-out), depois surge atrás do jogador.
 * - `emerge`: pulo (`jump.svg`) até o jogador; se ele não der parry, o alfa
 *   arrasta o jogador em x e y durante o pulo, causando dano.
 * - `flee`: foge do jogador recarregando o special a 1% a cada 100ms.
 */
export type HungryDogAI = {
  phase: "intro" | "chase" | "dig" | "underground" | "emerge" | "flee";
  phaseStart: number;
  introEnd: number;
  lastSpecialEnd: number;
  lastRecharge: number;
  specialGauge: number;
  emergeFromX: number;
  emergeBaseY: number;
  introSummoned: boolean;
};

export function initHungryDogAi(): HungryDogAI {
  return {
    phase: "intro",
    phaseStart: 0,
    introEnd: 0,
    lastSpecialEnd: 0,
    lastRecharge: 0,
    specialGauge: 100,
    emergeFromX: 0,
    emergeBaseY: 0,
    introSummoned: false,
  };
}

/** Quantos aliados o alfa invoca durante a intro. */
export const INTRO_SUMMON_COUNT = 2;

/** Duração da animação de invocação (câmera foca no alfa, jogador travado). */
export const INTRO_MS = TWO_THOUSAND_MS;

/** Sub-fases do special `dig.svg` → `entering.svg` → `entered.svg`. */
export const DIG_DIG_MS = FOUR_HUNDRED_MS;
export const DIG_ENTERING_MS = FOUR_HUNDRED_MS;
export const DIG_ENTERED_MS = FOUR_HUNDRED_MS;
export const DIG_TOTAL_MS = DIG_DIG_MS + DIG_ENTERING_MS + DIG_ENTERED_MS;

/** Tempo oculto (fade-out) até surgir atrás do jogador. */
export const UNDERGROUND_MS = THREE_THOUSAND_MS;

/** Duração do pulo (`emerge`) até alcançar o jogador. */
export const EMERGE_LEAP_MS = SIX_HUNDRED_MS;
export const EMERGE_HOP_HEIGHT = 130;

/** Duração da fuga após o special. */
export const FLEE_MS = ONE_THOUSAND_TWO_HUNDRED_MS;

/** Recarga do special: 1% a cada 100ms. */
export const SPECIAL_RECHARGE_MS = ONE_HUNDRED_MS;
export const SPECIAL_MAX = 100;

/** Espera mínima após a intro antes do primeiro special. */
export const SPECIAL_FIRST_DELAY_MS = THREE_THOUSAND_MS;
/** Cooldown entre um special e outro após o primeiro. */
export const SPECIAL_REUSE_COOLDOWN_MS = ONE_THOUSAND_TWO_HUNDRED_MS;

/** Recuo para surgir "atrás" do jogador (lado oposto ao que ele vira). */
export const BEHIND_OFFSET = 130;

export const MELEE_RANGE = 40;