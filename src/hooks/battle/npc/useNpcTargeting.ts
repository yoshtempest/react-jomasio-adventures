import { useRef } from "react";

export function useNpcTargeting() {
  const npcAiHpRef = useRef(0);
  const npcAiMaxHpRef = useRef(0);

  const npcBlockedRef = useRef(false);
  const npcBlockTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const onBeforeNpcHitRef = useRef<() => boolean>(() => false);

  return {
    npcAiHpRef,
    npcAiMaxHpRef,
    npcBlockedRef,
    npcBlockTimerRef,
    onBeforeNpcHitRef,
  };
}
