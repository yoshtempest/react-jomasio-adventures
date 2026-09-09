import { useSyncExternalStore } from "react";

export type ExternalStore<T> = {
  useValue: () => T;
  emitChange: () => void;
};

/**
 * Cria um mini store externo para o React (padrão useSyncExternalStore).
 *
 * `read` é a única fonte de verdade: o snapshot fica cacheado no module e
 * é recalculado a cada `emitChange()`. Usado por settings e áudio, que
 * leem várias chaves de localStorage de uma vez.
 */
export function createExternalStore<T>(read: () => T): ExternalStore<T> {
  let cached = read();

  const listeners = new Set<() => void>();

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function emitChange(): void {
    cached = read();
    for (const l of listeners) l();
  }

  return {
    useValue: () => useSyncExternalStore(subscribe, () => cached),
    emitChange,
  };
}
