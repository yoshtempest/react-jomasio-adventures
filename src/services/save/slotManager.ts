import type { StorageLike } from "./storageService";

const ACTIVE_SLOT_KEY = "active_save_slot";

export type SlotIndex = 0 | 1;

/**
 * Gerencia os slots de save. O backend é injetado no constructor.
 * Funções standalone abaixo mantêm a API antiga de módulo, delegando
 * à instância padrão (localStorage).
 */
export class SlotManager {
  private readonly storage: StorageLike;

  constructor(storage: StorageLike) {
    this.storage = storage;
  }

  getActiveSlot(): SlotIndex {
    const raw = this.storage.getItem(ACTIVE_SLOT_KEY);
    if (raw === "0") return 0;
    if (raw === "1") return 1;
    return 0;
  }

  setActiveSlot(slot: SlotIndex) {
    this.storage.setItem(ACTIVE_SLOT_KEY, String(slot));
  }

  slotKey(key: string): string {
    return this.slotKeyFor(this.getActiveSlot(), key);
  }

  slotKeyFor(slot: SlotIndex, key: string): string {
    return `${key}_${slot}`;
  }

  getSlotCount(): number {
    const slot0 = this.storage.getItem(this.slotKeyFor(0, "game_save"));
    const slot1 = this.storage.getItem(this.slotKeyFor(1, "game_save"));
    return (slot0 ? 1 : 0) + (slot1 ? 1 : 0);
  }

  isSlotUsed(slot: SlotIndex): boolean {
    return !!this.storage.getItem(this.slotKeyFor(slot, "game_save"));
  }

  getAvailableSlots(): SlotIndex[] {
    const available: SlotIndex[] = [];
    if (!this.isSlotUsed(0)) available.push(0);
    if (!this.isSlotUsed(1)) available.push(1);
    return available;
  }

  getUsedSlots(): SlotIndex[] {
    const used: SlotIndex[] = [];
    if (this.isSlotUsed(0)) used.push(0);
    if (this.isSlotUsed(1)) used.push(1);
    return used;
  }

  hasAnySave(): boolean {
    return this.isSlotUsed(0) || this.isSlotUsed(1);
  }

  /**
   * Every slot-scoped storage key, i.e. every key ever passed through
   * `slotKey()`. `clearSlot` erases exactly this list, so a key that is
   * written per slot but missing here survives a deletion and leaks into
   * the next save started on that slot. Container keys are not listed:
   * they share the `container_` prefix and are swept separately.
   *
   * When you add a `slotKey(...)` call site, add its key here too.
   */
  clearSlot(slot: SlotIndex) {
    GAME_STATE_KEYS.forEach((key) => {
      this.storage.removeItem(this.slotKeyFor(slot, key));
    });

    const containerPrefix = "container_";
    const containerSuffix = `_${slot}`;
    const keysToRemove: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (
        key &&
        key.startsWith(containerPrefix) &&
        key.endsWith(containerSuffix)
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => this.storage.removeItem(key));
  }

  clearActiveSlot() {
    this.clearSlot(this.getActiveSlot());
  }
}

/**
 * Every slot-scoped storage key, i.e. every key ever passed through
 * `slotKey()`. See SlotManager.clearSlot.
 */
export const GAME_STATE_KEYS = [
  "game_save",
  "jomasio_inventory",
  "jomasio_quests",
  "dailyQuestDate",
  "weeklyQuestDate",
  "characters_progress",
  "flags",
  "jomasio_equipment",
  "titles_data",
  "bestiary",
  "coins",
  "hyperCoins",
  "character",
  "player_class",
  "scene_return_positions",
  "battle_stats",
  "deaths",
  "streak_stats",
  "blocks",
  "npc_class_kills",
  "rewards",
  "monthly_pass",
  "daily_reward_last_claim",
  "daily_chest_last_open",
  "play_time",
  "library_return_position",
  "cafeteria_return_position",
  "pet_progress",
  "jeso_food_last_delivery",
  "char_unlock_dates",
  "difficulty",
  "replays",
  "visitedLocations",
  "tombstones",
] as const;

export const slotManager = new SlotManager(
  lazilyResolvedDefaultStorage(),
);

function lazilyResolvedDefaultStorage(): StorageLike {
  return localStorage;
}

export const getActiveSlot = () => slotManager.getActiveSlot();
export const setActiveSlot = (slot: SlotIndex) => slotManager.setActiveSlot(slot);
export const slotKey = (key: string) => slotManager.slotKey(key);
export const slotKeyFor = (slot: SlotIndex, key: string) =>
  slotManager.slotKeyFor(slot, key);
export const getSlotCount = () => slotManager.getSlotCount();
export const isSlotUsed = (slot: SlotIndex) => slotManager.isSlotUsed(slot);
export const getAvailableSlots = () => slotManager.getAvailableSlots();
export const getUsedSlots = () => slotManager.getUsedSlots();
export const hasAnySave = () => slotManager.hasAnySave();
export const clearSlot = (slot: SlotIndex) => slotManager.clearSlot(slot);
export const clearActiveSlot = () => slotManager.clearActiveSlot();
