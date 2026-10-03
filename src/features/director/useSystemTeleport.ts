import { useCallback, useEffect, useState } from "react";

import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { npcPath } from "@/utils/paths";

import styles from "./styles.module.css";

/**
 * O System não entra andando na cela: ele é uma janela que se materializa de
 * um feixe de teleport. `appear` roda na montagem da cena; `leave` é disparado
 * pela última fala do diálogo, e a cena só redireciona para a sala do diretor
 * depois que o piscar terminou (o `delay` do evento `navigate`).
 *
 * `gone` é o estado inicial e o final: sprite fora do mapa. `idle` é o único
 * estado em que ele fica parado e visível.
 */
type SystemState =
  "gone" | "idle" | "appearBeam" | "appearIn" | "leaveOut" | "leaveBeam";

/**
 * Duração de cada passo, em ms. Espelha as durações das classes globais em
 * `src/styles/teleport.css`.
 */
const STEPS: Record<SystemState, { next: SystemState; ms: number } | null> = {
  gone: null,
  idle: null,
  appearBeam: { next: "appearIn", ms: 420 },
  appearIn: { next: "idle", ms: 320 },
  leaveOut: { next: "leaveBeam", ms: 240 },
  leaveBeam: { next: "gone", ms: 420 },
};

/** Os dois estados em que o feixe está aceso — o `blink` entra junto com eles. */
const BEAM_STATES: readonly SystemState[] = ["appearBeam", "leaveBeam"];

export const SISTEMA_SPRITE = npcPath("/system/default.svg");
const SISTEMA_BEAM = npcPath("/system/teleport.svg");

/**
 * Classe de animação por estado. A parte global (`teleportSpawn`,
 * `teleportBeamIn`, …) vem de `src/styles/teleport.css` — não pode estar no
 * CSS Module porque o postcss-modules reescreve o nome do `@keyframes`
 * referenciado e a animação deixaria de casar com o keyframe global.
 */
const LOOK: Record<SystemState, { src: string; className?: string }> = {
  gone: { src: SISTEMA_SPRITE },
  idle: { src: SISTEMA_SPRITE },
  appearBeam: { src: SISTEMA_BEAM, className: `teleportBeamIn ${styles.beam}` },
  appearIn: { src: SISTEMA_SPRITE, className: "teleportSpawn" },
  leaveOut: { src: SISTEMA_SPRITE, className: "teleportDissolve" },
  leaveBeam: {
    src: SISTEMA_BEAM,
    className: `teleportBeamOut ${styles.beamOut}`,
  },
};

export type SystemTeleport = {
  /** Sprite a desenhar no NPC do mapa. */
  src: string;
  /** Classe de animação da fase, ou nada quando ele está parado. */
  className?: string;
  /** `true` enquanto ele não está no mapa. */
  hidden: boolean;
  /** Materializa o System na cena. */
  appear: () => void;
  /** Faz o System piscar fora. */
  leave: () => void;
};

export function useSystemTeleport(): SystemTeleport {
  const { playSound } = useSoundEffects();
  const [state, setState] = useState<SystemState>("gone");

  useEffect(() => {
    const step = STEPS[state];
    if (!step) return;

    const timer = setTimeout(() => setState(step.next), step.ms);
    return () => clearTimeout(timer);
  }, [state]);

  const isBeam = BEAM_STATES.includes(state);

  // O som entra junto com o feixe: os dois passos de feixe trocam o sprite
  // pelo `teleport.svg`, então o `blink` casa com a arte sem listener extra.
  useEffect(() => {
    if (isBeam) {
      playSound("blink");
    }
  }, [isBeam, playSound]);

  // Estáveis de propósito: o feature as injeta no diálogo e no efeito de
  // montagem, e nenhum dos dois deve reiniciar a cena.
  const appear = useCallback(() => setState("appearBeam"), []);
  const leave = useCallback(() => setState("leaveOut"), []);

  return {
    ...LOOK[state],
    hidden: state === "gone",
    appear,
    leave,
  };
}
