import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  enabled: boolean;
  cooldownMs: number;
  isPaused: boolean;
  onTrigger: () => void;
};

export function usePetSkillCooldown({
  enabled,
  cooldownMs,
  isPaused,
  onTrigger,
}: Props) {
  const [remaining, setRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const readyAtRef = useRef(0);
  const cooldownMsRef = useRef(cooldownMs);
  cooldownMsRef.current = cooldownMs;
  const onTriggerRef = useRef(onTrigger);
  onTriggerRef.current = onTrigger;

  useEffect(() => {
    if (!enabled) {
      readyAtRef.current = 0;
      setRemaining(0);
      setIsActive(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const id = setInterval(() => {
      const left = Math.max(
        0,
        Math.ceil((readyAtRef.current - Date.now()) / 1000),
      );
      setRemaining(left);
      if (left <= 0) setIsActive(false);
    }, 200);

    return () => clearInterval(id);
  }, [isActive, isPaused]);

  const trigger = useCallback(() => {
    if (!enabled || Date.now() < readyAtRef.current) return;
    readyAtRef.current = Date.now() + cooldownMsRef.current;
    setRemaining(Math.ceil(cooldownMsRef.current / 1000));
    setIsActive(true);
    onTriggerRef.current();
  }, [enabled]);

  const reset = useCallback(() => {
    readyAtRef.current = 0;
    setRemaining(0);
    setIsActive(false);
  }, []);

  return {
    remaining,
    ready: enabled && !isActive,
    trigger,
    reset,
  };
}
