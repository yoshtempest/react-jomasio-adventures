import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import {
  isPlayerFrozen,
  isPlayerParalyzed,
} from "@/gameRules/battle/status/statusEffects";
import {
  EMANUEL_KI_CHARGE_PER_TICK,
  EMANUEL_KI_CHARGE_TICK_MS,
} from "@/data/characters/emanuel";
import type { BattleManaApi } from "@/contexts/BattleManaContext";

type Props = {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  battleManaRef: RefObject<BattleManaApi | null>;
  freezeActionsUntilRef: RefObject<number>;
  isPausedRef: RefObject<boolean>;
  /** true quando os controles gerais de batalha estão desabilitados (pause, transição de fase, throw). */
  disabledRef: RefObject<boolean>;
  battleEndedRef: RefObject<boolean>;
};

/**
 * Carga de Ki do Emanuel: segurar o botão deixa o personagem parado no sprite
 * `chargingKi.svg` e restaura +1 de Ki a cada 100ms. Enquanto segurado, todas
 * as ações ficam congeladas (freezeActionsUntilRef = Infinity). Ao soltar,
 * volta para idle e o congelamento termina.
 */
export function useEmanuelKiCharge({
  player,
  setPlayer,
  battleManaRef,
  freezeActionsUntilRef,
  isPausedRef,
  disabledRef,
  battleEndedRef,
}: Props) {
  const activeRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const setPlayerRef = useLatestRef(setPlayer);

  const canUse =
    player.character === "emanuel" &&
    player.mode === "battle" &&
    player.state === "idle" &&
    Math.abs(player.y - player.groundY) < 1 &&
    !isPlayerFrozen(player) &&
    !isPlayerParalyzed(player) &&
    freezeActionsUntilRef.current <= Date.now();
  const canUseRef = useLatestRef(
    canUse &&
      !disabledRef.current &&
      !isPausedRef.current &&
      !battleEndedRef.current,
  );

  const shouldCancelRef = useLatestRef(
    () =>
      disabledRef.current ||
      isPausedRef.current ||
      battleEndedRef.current,
  );

  const release = useCallback(() => {
    if (!activeRef.current) return;
    activeRef.current = false;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    freezeActionsUntilRef.current = Date.now();
    setPlayerRef.current((p) =>
      p.mode !== "battle" || p.state !== "chargingKi"
        ? p
        : { ...p, state: "idle" },
    );
  }, [freezeActionsUntilRef, setPlayerRef]);

  const releaseRef = useLatestRef(release);

  const press = useCallback(() => {
    if (activeRef.current) return;
    if (!canUseRef.current) return;

    activeRef.current = true;
    freezeActionsUntilRef.current = Infinity;

    setPlayerRef.current((p) =>
      p.mode !== "battle" ? p : { ...p, state: "chargingKi" },
    );

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (shouldCancelRef.current()) {
        releaseRef.current();
        return;
      }
      battleManaRef.current?.restoreMana(EMANUEL_KI_CHARGE_PER_TICK);
    }, EMANUEL_KI_CHARGE_TICK_MS);
  }, [
    battleManaRef,
    canUseRef,
    freezeActionsUntilRef,
    releaseRef,
    shouldCancelRef,
    setPlayerRef,
  ]);

  useEffect(() => {
    const release = releaseRef.current;
    return () => {
      release();
    };
  }, [releaseRef]);

  return {
    press,
    release,
    canUse: canUseRef.current,
  };
}