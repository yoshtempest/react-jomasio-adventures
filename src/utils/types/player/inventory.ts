export type InventoryItem = {
  id: ItemId;
  qty?: number;
};

/**
 * Segundo parâmetro opcional de `addItem`.
 *
 * `showToast` emite a notificação de recompensa (ícone do item + texto) e é
 * reservado à coleta no chão do explore — tile pickup, lápide e loot bag.
 * Recompensas de quest/batalha/baú chamam `addItem` sem a flag e ficam mudas
 * de propósito.
 */
export type AddItemOptions = {
  showToast?: boolean;
};
