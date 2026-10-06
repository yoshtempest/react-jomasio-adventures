import {
  resolveBattleSprite,
  playerPath,
  playerPathMarshadowHabilities,
} from "@/utils/paths";
import { resolveSpriteState } from "@/gameRules/battle/playerStates";

import { TRANSFORMATION_FRAMES } from "@/components/Game/Entities/Player/Battle/constants";

interface ResolvePlayerSpriteParams {
  character: CharacterId;
  state: PlayerState;
  weapon?: LucasWeapon;
  form?: "vastolordForm";
  transformationFrame?: number | null;
  teleportSprite: boolean;
  preAtomic: boolean;
  outroExpression?: "victory" | "defeat" | null;
}

export function resolvePlayerSprite({
  character,
  state,
  weapon,
  form,
  transformationFrame,
  teleportSprite,
  preAtomic,
  outroExpression = null,
}: ResolvePlayerSpriteParams): string {
  const resolvedState = resolveSpriteState(state);

  // Fim da batalha: o sprite na arena vira o mesmo retrato que o BattleOutro
  // exibe (`expressions/victory|defeat.svg`). Vence qualquer outro override
  // porque, com o resultado definido, nada mais está em andamento.
  if (outroExpression) {
    return playerPath(`/${character}/expressions/${outroExpression}.svg`);
  }

  if (preAtomic && character === "marcelo" && state === "idle") {
    return playerPathMarshadowHabilities("/atomic/starting.svg");
  }

  if (form === "vastolordForm" && transformationFrame != null) {
    const frame = TRANSFORMATION_FRAMES[transformationFrame] ?? "screamOne";

    return playerPath(
      `/marcelo/inFight/vastolordForm/transformating/${frame}.svg`,
    );
  }

  if (teleportSprite && character === "emanuel") {
    return playerPath("/emanuel/inFight/attacks/teleport.svg");
  }

  return resolveBattleSprite(character, resolvedState, weapon, form);
}
