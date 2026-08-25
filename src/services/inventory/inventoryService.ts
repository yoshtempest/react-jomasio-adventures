import type { SoundId } from "@/contexts/SoundEffectsContext";
import type { InventoryItem } from "@/utils/types/player/inventory";

/** Slots reservados para moedas na mochila. */
export const CURRENCY_SLOT_COUNT = 2;

export type AddItemResult = {
  items: InventoryItem[];
  /** true apenas quando o item ocupa um slot novo (semântica legada). */
  added: boolean;
  sound: SoundId | null;
};

export type RemoveItemResult = {
  items: InventoryItem[];
  /** true sempre que uma unidade foi consumida, mesmo sobrando pilha. */
  removed: boolean;
  sound: SoundId | null;
};

/**
 * Regras puras da mochila: empilhamento, capacidade e sons associados.
 * Nenhum estado interno — os métodos recebem e devolvem o array de items,
 * então o contexto React só aplica o resultado.
 */
export class InventoryService {
  private readonly maxSlots: number;
  private readonly currencySlots: number;

  constructor(maxSlots: number, currencySlots: number = CURRENCY_SLOT_COUNT) {
    this.maxSlots = maxSlots;
    this.currencySlots = currencySlots;
  }

  get usableSlots(): number {
    return this.maxSlots - this.currencySlots;
  }

  addItem(items: InventoryItem[], item: InventoryItem): AddItemResult {
    const existing = items.find((i) => i.id === item.id);

    if (existing) {
      return {
        items: items.map((i) =>
          i.id === item.id ? { ...i, qty: (i.qty ?? 1) + (item.qty ?? 1) } : i,
        ),
        added: false,
        sound: "receivedItem",
      };
    }

    if (items.length >= this.usableSlots) {
      return { items, added: false, sound: null };
    }

    return {
      items: [...items, { id: item.id, qty: item.qty ?? 1 }],
      added: true,
      sound: "receivedItem",
    };
  }

  /**
   * Consome uma unidade de `id`.
   *
   * `removed` reflete o consumo da unidade, não o desaparecimento do
   * slot: tirar 1 de uma pilha de 3 conta como remoção. Comparar o
   * tamanho do array antes e depois só enxergava o último item de cada
   * pilha, então gastar item empilhado não emitia som nenhum.
   */
  removeItem(items: InventoryItem[], id: ItemId): RemoveItemResult {
    const found = items.find((i) => i.id === id);
    if (!found) {
      return { items, removed: false, sound: null };
    }

    const next = items
      .map((i): InventoryItem | null => {
        if (i.id !== id) return i;
        const nextQty = (i.qty ?? 1) - 1;
        return nextQty <= 0 ? null : { ...i, qty: nextQty };
      })
      .filter((i): i is InventoryItem => i !== null);

    return {
      items: next,
      removed: true,
      sound: "usedItem",
    };
  }
}
