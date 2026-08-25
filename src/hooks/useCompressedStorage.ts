import { useState, useEffect, useRef } from "react";
import { saveCompressed, loadCompressed } from "@/services/save/storageService";
import { slotKey } from "@/services/save/slotManager";

const WRITE_DELAY_MS = 1000;

/**
 * Estado persistido comprimido, escopado no slot ativo.
 *
 * A escrita é adiada em {@link WRITE_DELAY_MS} e coalescida: comprimir e
 * gravar acontecia a cada mudança de `data`, e estado que muda rápido —
 * `characters_progress` durante o regen escreve uma vez por segundo —
 * pagava LZString mais `localStorage` síncrono na main thread nessa
 * mesma cadência.
 *
 * Nada fica pendente sem rede de proteção: a última versão é gravada no
 * unmount e em `pagehide`, que é o evento que dispara também quando a
 * aba vai para o bfcache no mobile.
 */
export function useCompressedStorage<T>(
  key: string,
  defaultValue: T,
  normalize?: (data: T) => T,
) {
  const [data, setData] = useState<T>(() => {
    const saved = loadCompressed<T>(slotKey(key));
    if (!saved) return defaultValue;
    try {
      return normalize ? normalize(saved) : saved;
    } catch {
      return defaultValue;
    }
  });

  const pendingRef = useRef<T>(data);
  pendingRef.current = data;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const flush = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      saveCompressed(slotKey(key), pendingRef.current);
    };

    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [key]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      saveCompressed(slotKey(key), data);
    }, WRITE_DELAY_MS);
  }, [data, key]);

  return [data, setData] as const;
}
