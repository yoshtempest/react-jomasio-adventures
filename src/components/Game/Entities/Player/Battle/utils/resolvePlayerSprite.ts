import {
  resolveBattleSprite,
  playerPath,
  playerPathMarshadowHabilities,
} from "@/utils/paths";

import { TRANSFORMATION_FRAMES } from "../constants";

interface ResolvePlayerSpriteParams {
  character: CharacterId;
  state: PlayerState;
  weapon?: LucasWeapon;
  form?: "vastolordForm";
  transformationFrame?: number | null;
  teleportSprite: boolean;
  preAtomic: boolean;
}

export function resolvePlayerSprite({
  character,
  state,
  weapon,
  form,
  transformationFrame,
  teleportSprite,
  preAtomic,
}: ResolvePlayerSpriteParams): string {
  const resolvedState =
    state === "idleCrounched" || state === "walkCrounched"
      ? state
      : state === "charging"
        ? "idle"
        : state;

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
