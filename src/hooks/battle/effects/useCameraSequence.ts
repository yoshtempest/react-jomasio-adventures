import { useEffect, useRef, useState } from "react";
import { THREE_THOUSAND_MS } from "@/data/ms";

export type CameraFocus = {
  entity: "npc" | "player";
  zoom: number;
} | null;

type Props = {
  npcPhase: number;
  vastolordActive: boolean;
  enabled?: boolean;
};

const CAMERA_FOCUS_MS = THREE_THOUSAND_MS;
const TRANSFORM_ZOOM = 1.2;

/**
 * Sequência de foco da câmera durante a batalha:
 * - Quando o boss entra em outra fase, a câmera acompanha o boss e a batalha
 *   congela por `CAMERA_FOCUS_MS`; ao fim, a câmera volta para o jogador.
 * - Quando o jogador se transforma (ex: marshadow -> vastolord), o mesmo foco
 *   acontece com um leve zoom de `TRANSFORM_ZOOM`.
 */
export function useCameraSequence({
  npcPhase,
  vastolordActive,
  enabled = true,
}: Props) {
  const [focus, setFocus] = useState<CameraFocus>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevNpcPhaseRef = useRef(npcPhase);
  const prevVastolordRef = useRef(vastolordActive);

  const scheduleEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setFocus(null);
    }, CAMERA_FOCUS_MS);
  };

  useEffect(() => {
    if (!enabled) {
      prevNpcPhaseRef.current = npcPhase;
      prevVastolordRef.current = vastolordActive;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        setFocus(null);
      }
      return;
    }

    if (npcPhase > prevNpcPhaseRef.current && npcPhase > 1) {
      prevNpcPhaseRef.current = npcPhase;
      setFocus({ entity: "npc", zoom: 1 });
      scheduleEnd();
      return;
    }
    prevNpcPhaseRef.current = npcPhase;

    if (vastolordActive && !prevVastolordRef.current) {
      prevVastolordRef.current = vastolordActive;
      setFocus({ entity: "player", zoom: TRANSFORM_ZOOM });
      scheduleEnd();
      return;
    }
    prevVastolordRef.current = vastolordActive;
  }, [npcPhase, vastolordActive, enabled]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { focus, isFrozen: focus != null } as const;
}