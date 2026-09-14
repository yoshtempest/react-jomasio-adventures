import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import {
  HONORED_ONE_DURATION_MS,
  HONORED_ONE_RISE_MS,
} from "@/gameRules/battle/cursedEnergy";
import type { BattleManaApi } from "@/contexts/BattleManaContext";
import type { SoundId } from "@/contexts/SoundEffectsContext";
import type { useBattleRefs } from "@/hooks/battle/utilities/useRefs";

type Props = {
  enabled: boolean;
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  playSound: (sound: SoundId, loop?: boolean, volumeOverride?: number) => void;
  refs: ReturnType<typeof useBattleRefs>;
  setTimeScale: (scale: number) => void;
  resetTimeScale: () => void;
  battleManaRef: RefObject<BattleManaApi | null>;
  honoredRiseStartRef: RefObject<number>;
  honoredRiseStartYRef: RefObject<number>;
  honoredFallRef: RefObject<boolean>;
};

export function useHonoredOne({
  enabled,
  player,
  setPlayer,
  playSound,
  refs,
  setTimeScale,
  resetTimeScale,
  battleManaRef,
  honoredRiseStartRef,
  honoredRiseStartYRef,
  honoredFallRef,
}: Props) {
  const honoredOneUsedRef = useRef(false);
  const honoredOneActiveRef = useRef(false);
  const [honoredOneActive, setHonoredOneActive] = useState(false);
  /** Regeneração passiva de energia amaldiçoada (10/s) valendo pelo resto da batalha. */
  const [honoredRegenActive, setHonoredRegenActive] = useState(false);
  /** Janela da sequência "O Mais Honrado": congela toda a batalha. */
  const [mostHonoredFreeze, setMostHonoredFreeze] = useState(false);
  const mostHonoredFreezeRef = useLatestRef(mostHonoredFreeze);
  const honoredOneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Durante a sequência, os inimigos recuam até ficarem a >=300px em x. */
  const honoredFleeRef = useRef(false);

  const activateHonoredOne = useCallback(() => {
    honoredOneActiveRef.current = true;
    setHonoredOneActive(true);
  }, []);

  const resetHonoredOne = useCallback(() => {
    honoredOneUsedRef.current = false;
    honoredOneActiveRef.current = false;
    setHonoredOneActive(false);
    setHonoredRegenActive(false);
    setMostHonoredFreeze(false);
    honoredRiseStartRef.current = 0;
    honoredFleeRef.current = false;
    honoredFallRef.current = false;
    if (honoredOneTimerRef.current) {
      clearTimeout(honoredOneTimerRef.current);
      honoredOneTimerRef.current = null;
    }
  }, [honoredRiseStartRef, honoredFleeRef, honoredFallRef, honoredOneTimerRef]);

  /**
   * Passiva O Abençoado do riquelme: o primeiro golpe letal em uma batalha não
   * mata — o personagem sobrevive com 1 de vida. A batalha congela (NPCs,
   * projéteis, controles e fluxo) e o sprite troca para mostHonored.svg com a
   * seguinte coreografia:
   * 1. ~~5s: o riquelme sobe 400px em y girando ~90° enquanto os inimigos
   *    próximos recuam até ficarem a >=300px em x;
   * 2. a rotação volta a 0° e ele cai do alto com falling.svg;
   * 3. ao aterrissar vira idleCrounched.svg e só então a batalha volta ao
   *    normal — a energia amaldiçoada regenera 100%/1s e o botão de conversão
   *    vira o blink.
   */
  const surviveLethalHitRef = useLatestRef(() => {
    if (!enabled || honoredOneUsedRef.current) return false;
    honoredOneUsedRef.current = true;

    honoredRiseStartRef.current = Date.now();
    honoredRiseStartYRef.current = player.y;
    honoredFleeRef.current = true;
    setHonoredRegenActive(true);
    // TEMP-DEBUG honored-regen
    console.log(
      "[honored-regen] sequence start: setHonoredRegenActive(true), mana=",
      battleManaRef.current?.playerMana,
    );
    setPlayer((p) => ({ ...p, state: "mostHonored", velY: 0 }));
    refs.hitstopRef.current = Date.now() + HONORED_ONE_DURATION_MS;
    setTimeScale(0.01);
    setMostHonoredFreeze(true);
    playSound("honoredOne");

    if (honoredOneTimerRef.current) {
      clearTimeout(honoredOneTimerRef.current);
    }

    // Fim da fase de subida/rotação: o riquelme cai do alto; a física cuida da
    // queda e o pouso em `idleCrounched` destrava a batalha (ver efeito abaixo).
    honoredOneTimerRef.current = setTimeout(() => {
      honoredOneTimerRef.current = null;
      honoredFallRef.current = true;
      setPlayer((p) => ({
        ...p,
        state: "falling",
        velY: 2,
        y: Math.max(0, p.y + 2),
      }));
    }, HONORED_ONE_RISE_MS);

    return true;
  });

  /**
   * Fim da coreografia honored-one: ao aterrissar (estado `idleCrounched`
   * vindo da queda), a batalha volta ao normal de uma vez.
   */
  useEffect(() => {
    if (!honoredFallRef.current) return;
    if (player.state !== "idleCrounched") return;

    honoredFallRef.current = false;
    honoredRiseStartRef.current = 0;
    honoredFleeRef.current = false;
    refs.hitstopRef.current = 0;
    setMostHonoredFreeze(false);
    resetTimeScale();
    activateHonoredOne();
  }, [
    player.state,
    honoredFallRef,
    honoredRiseStartRef,
    honoredFleeRef,
    refs,
    setMostHonoredFreeze,
    resetTimeScale,
    activateHonoredOne,
  ]);

  useEffect(() => {
    return () => {
      if (honoredOneTimerRef.current) {
        clearTimeout(honoredOneTimerRef.current);
        honoredOneTimerRef.current = null;
      }
      honoredRiseStartRef.current = 0;
      honoredFleeRef.current = false;
      honoredFallRef.current = false;
      resetTimeScale();
    };
  }, [resetTimeScale, honoredRiseStartRef, honoredFleeRef, honoredFallRef]);

  return {
    honoredOneUsedRef,
    honoredOneActiveRef,
    honoredOneActive,
    setHonoredOneActive,
    honoredRegenActive,
    setHonoredRegenActive,
    mostHonoredFreeze,
    setMostHonoredFreeze,
    mostHonoredFreezeRef,
    honoredOneTimerRef,
    honoredFleeRef,
    activateHonoredOne,
    resetHonoredOne,
    surviveLethalHitRef,
  };
}
