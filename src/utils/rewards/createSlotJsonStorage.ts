import { slotKey } from "@/services/save/slotManager";
import type { SlotScopedKey } from "@/services/save/slotManager";

/**
 * Cria um par load/save para dados JSON armazenados por slot.
 *
 * Ambos já tratam JSON.parse/setItem com try/catch e resolvem a chave
 * escopada ao slot ativo em cada chamada (para acompanhar troca de slot) —
 * padrão compartilhado pelos utilitários de recompensas.
 */
export function createSlotJsonStorage<T>(
  key: SlotScopedKey,
  createDefault: () => T,
) {
  return {
    load(): T {
      try {
        const raw = localStorage.getItem(slotKey(key));
        if (!raw) return createDefault();
        return JSON.parse(raw) as T;
      } catch {
        return createDefault();
      }
    },
    save(data: T): void {
      try {
        localStorage.setItem(slotKey(key), JSON.stringify(data));
      } catch {}
    },
  };
}
