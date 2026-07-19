import { useRef } from "react";

export function useNpcTargeting() {
  const npcTargetIsPetRef = useRef(false);
  const petXRef = useRef(0);
  const petYRef = useRef(0);
  const hasPetRef = useRef(false);

  const npcAiHpRef = useRef(0);
  const npcAiMaxHpRef = useRef(0);

  const npcBlockedRef = useRef(false);
  const npcBlockTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const onBeforeNpcHitRef = useRef<() => boolean>(() => false);

  return {
    npcTargetIsPetRef,
    petXRef,
    petYRef,
    hasPetRef,
    npcAiHpRef,
    npcAiMaxHpRef,
    npcBlockedRef,
    npcBlockTimerRef,
    onBeforeNpcHitRef,
  };
}
