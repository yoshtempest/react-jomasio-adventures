import {
  AIR_SPECIAL_STATES,
  AIRBORNE_STATES,
  CROUCHED_STATES,
  DASH_STATES,
  GENKI_DAMA_STATES,
  unionOf,
} from "@/gameRules/battle/playerStates";

/**
 * Jogador protegido do laser de varredura do maugrelo (fase 2): agachado,
 * no ar, dash, special aéreo ou flutuando na Genki Dama.
 */
const PROTECTED_STATES = unionOf(
  CROUCHED_STATES,
  DASH_STATES,
  AIRBORNE_STATES,
  AIR_SPECIAL_STATES,
  GENKI_DAMA_STATES,
);

export function isPlayerProtected(playerState: PlayerState): boolean {
  return PROTECTED_STATES.has(playerState);
}
