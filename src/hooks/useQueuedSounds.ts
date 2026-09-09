import { useCallback, useEffect, useRef } from "react";

/**
 * Fila de sons que é descarregada em um effect.
 *
 * Usado pelos contextos que precisam enfileirar sons durante um state
 * updater (sem efeito colateral dentro dele): os sons vão para o ref e o
 * effect dispara assim que o estado (dependência) muda.
 */
export function useQueuedSounds<T>(
  playSound: (sound: T) => void,
  dependency: unknown,
) {
  const pendingSoundsRef = useRef<T[]>([]);

  useEffect(() => {
    const sounds = pendingSoundsRef.current.splice(0);
    sounds.forEach((s) => playSound(s));
  }, [dependency, playSound]);

  const push = useCallback((sound: T) => {
    pendingSoundsRef.current.push(sound);
  }, []);

  const pushIf = useCallback((sound: T | null | undefined) => {
    if (sound) pendingSoundsRef.current.push(sound);
  }, []);

  const clear = useCallback(() => {
    pendingSoundsRef.current = [];
  }, []);

  return { push, pushIf, clear };
}
