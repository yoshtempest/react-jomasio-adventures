import { useEffect, useState } from "react";

import { resolveBattleSprite } from "@/utils/paths";

import { resolvePlayerSprite } from "../utils/resolvePlayerSprite";

interface UseBattleSpriteParams {
  character: CharacterId;
  state: PlayerState;
  weapon?: LucasWeapon;
  form?: "vastolordForm";
  transformationFrame?: number | null;
  teleportSprite: boolean;
  preAtomic: boolean;
}

export function useBattleSprite({
  character,
  state,
  weapon,
  form,
  transformationFrame,
  teleportSprite,
  preAtomic,
}: UseBattleSpriteParams) {
  const resolvedState =
    state === "idleCrounched" || state === "walkCrounched"
      ? state
      : state === "charging"
        ? "idle"
        : state;

  const baseSrc = resolvePlayerSprite({
    character,
    state,
    weapon,
    form,
    transformationFrame,
    teleportSprite,
    preAtomic,
  });

  const [src, setSrc] = useState(baseSrc);

  useEffect(() => {
    setSrc(baseSrc);
  }, [baseSrc]);

  const handleSpriteError = () => {
    const fallbackState =
      resolvedState === "preRun"
        ? "run"
        : resolvedState === "preJump"
          ? "jump"
          : null;

    if (!fallbackState) {
      return;
    }

    setSrc(resolveBattleSprite(character, fallbackState, weapon, form));
  };

  return {
    src,
    handleSpriteError,
    resolvedState,
  };
}
