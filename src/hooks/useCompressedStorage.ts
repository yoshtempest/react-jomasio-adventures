import { useState, useEffect, useRef } from "react";
import { saveCompressed, loadCompressed } from "@/services/save/storageService";
import { slotKey, type SlotScopedKey } from "@/services/save/slotManager";
import { ONE_THOUSAND_MS } from "@/data/ms";

const WRITE_DELAY_MS = ONE_THOUSAND_MS;

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
 *
 * A chave completa é resolvida **uma vez**, junto com a leitura inicial,
 * e não a cada escrita. `slotKey()` consulta o slot ativo no instante da
 * chamada, e a troca de save muda esse slot antes de recarregar a
 * página: resolver na hora de gravar faria o flush despejar o estado do
 * slot de origem por cima do slot de destino.
 */
export function useCompressedStorage<T>(
  key: SlotScopedKey,
  defaultValue: T,
  normalize?: (data: T) => T,
) {
  const storageKeyRef = useRef(slotKey(key));

  const [data, setData] = useState<T>(() => {
    const saved = loadCompressed<T>(storageKeyRef.current);
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
    storageKeyRef.current = slotKey(key);
  }, [key]);

  useEffect(() => {
    const flush = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      saveCompressed(storageKeyRef.current, pendingRef.current);
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
      saveCompressed(storageKeyRef.current, data);
    }, WRITE_DELAY_MS);
  }, [data, key]);

  return [data, setData] as const;
}
