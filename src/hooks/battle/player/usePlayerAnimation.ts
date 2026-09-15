import { useEffect } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import {
  animationFlow,
  getSpecialFlowOverride,
} from "@/data/battle/animationFlow";
import { EMANUEL_AIR_LAUNCH_MS } from "@/data/characters/emanuel";
import { logPlay } from "@/utils/replay/audioEventLog";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { FIVE_HUNDRED_MS } from "@/data/ms";
import type { EmanuelComboApi } from "@/hooks/battle/player/characters/ematron/useEmanuelCombo";

const STUN_BASE_DURATION = FIVE_HUNDRED_MS;

export function usePlayerAnimation(
  player: Player,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  battleTenacityRef?: React.RefObject<number>,
  canRun?: boolean,
  timeScaleRef?: React.RefObject<number>,
  emanuelCombo?: EmanuelComboApi,
) {
  const tenacityRef = useLatestRef(battleTenacityRef);
  const canRunRef = useLatestRef(canRun);
  const timeScaleInternalRef = useLatestRef(timeScaleRef);
  const emanuelComboRef = useLatestRef(emanuelCombo);
  const { playSound } = useSoundEffects();

  // Sequência aérea do combo do emanuel: o windup aéreo em `jump` é replicado
  // em `airGrab` após um breve impulso (o dano já foi aplicado no press).
  useEffect(() => {
    if (
      player.state !== "jump" ||
      player.character !== "emanuel" ||
      player.mode !== "battle"
    )
      return;
    const combo = emanuelComboRef.current;
    if (!combo?.airActiveRef.current) return;

    const timer = setTimeout(() => {
      combo.airActiveRef.current = false;
      setPlayer((p) =>
        p.state === "jump" && p.character === "emanuel"
          ? { ...p, state: "airGrab" }
          : p,
      );
    }, EMANUEL_AIR_LAUNCH_MS);

    return () => clearTimeout(timer);
  }, [player.state, player.character, player.mode, setPlayer, emanuelComboRef]);

  useEffect(() => {
    if (player.state === "jump" || player.state === "falling") return;

    const defaultStep = animationFlow[player.state];
    if (!defaultStep) return;

    const override = getSpecialFlowOverride(player.character);
    let step = defaultStep;

    // Combo do emanuel: o windup `preAttack` resolve para o golpe atual do
    // combo (punch/hook/lowKick) em vez do `attack` genérico.
    const comboStep =
      player.character === "emanuel" && player.mode === "battle"
        ? emanuelComboRef.current?.steps[
            emanuelComboRef.current.stepIndexRef.current
          ]
        : undefined;
    if (
      comboStep &&
      player.state === "preAttack" &&
      comboStep.windupState === "preAttack"
    ) {
      step = { ...defaultStep, next: comboStep.state };
    }

    if (override) {
      if (player.state === "preSpecial") {
        if (player.character === "marcelo") {
          playSound("marshadowSpecial");
          logPlay("marshadowSpecial");
        }

        if (player.character === "riquelme") {
          playSound("natsukiSpecial");
          logPlay("natsukiSpecial");
        }
        step = { ...defaultStep, ...override.preSpecial };
      } else if (player.state === "preSpecial2") {
        step = { ...defaultStep, ...override.preSpecial2 };
      } else if (player.state === "special" && override.special) {
        step = { ...defaultStep, ...override.special };
      }
    }

    let gameDuration = step.duration;
    // O ataque do artur não auto-avança: o hold (ORA) em useArturOraPunch é o
    // único responsável por sair da pose de ataque (300ms após o último click).
    if (
      player.state === "attack" &&
      player.character === "artur" &&
      player.mode === "battle"
    ) {
      return;
    }
    if (player.state === "stun" && tenacityRef.current?.current != null) {
      gameDuration = Math.round(
        STUN_BASE_DURATION * (1 - tenacityRef.current.current),
      );
    }

    const scale = timeScaleInternalRef.current?.current ?? 1;
    const realDuration = Math.round(gameDuration / scale);

    const timer = setTimeout(() => {
      const wantsToRun = step.next === "preRun" || step.next === "run";
      if (wantsToRun && canRunRef != null && !canRunRef.current) return;

      setPlayer((p) => ({
        ...p,
        state: step.next,
      }));
    }, realDuration);

    return () => clearTimeout(timer);
  }, [
    player.state,
    player.character,
    player.mode,
    setPlayer,
    playSound,
    tenacityRef,
    canRun,
    canRunRef,
    timeScaleInternalRef,
    emanuelComboRef,
  ]);
}
