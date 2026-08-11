const ACTIVE_SLOT_KEY = "active_save_slot";

export type SlotIndex = 0 | 1;

export function getActiveSlot(): SlotIndex {
  const raw = localStorage.getItem(ACTIVE_SLOT_KEY);
  if (raw === "0") return 0;
  if (raw === "1") return 1;
  return 0;
}

export function setActiveSlot(slot: SlotIndex) {
  localStorage.setItem(ACTIVE_SLOT_KEY, String(slot));
}

export function slotKey(key: string): string {
  const slot = getActiveSlot();
  return `${key}_${slot}`;
}

export function slotKeyFor(slot: SlotIndex, key: string): string {
  return `${key}_${slot}`;
}

export function getSlotCount(): number {
  const slot0 = localStorage.getItem(slotKeyFor(0, "game_save"));
  const slot1 = localStorage.getItem(slotKeyFor(1, "game_save"));
  return (slot0 ? 1 : 0) + (slot1 ? 1 : 0);
}

export function isSlotUsed(slot: SlotIndex): boolean {
  return !!localStorage.getItem(slotKeyFor(slot, "game_save"));
}

export function getAvailableSlots(): SlotIndex[] {
  const available: SlotIndex[] = [];
  if (!isSlotUsed(0)) available.push(0);
  if (!isSlotUsed(1)) available.push(1);
  return available;
}

export function getUsedSlots(): SlotIndex[] {
  const used: SlotIndex[] = [];
  if (isSlotUsed(0)) used.push(0);
  if (isSlotUsed(1)) used.push(1);
  return used;
}

export function hasAnySave(): boolean {
  return isSlotUsed(0) || isSlotUsed(1);
}

const GAME_STATE_KEYS = [
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
];

export function clearSlot(slot: SlotIndex) {
  GAME_STATE_KEYS.forEach((key) => {
    localStorage.removeItem(slotKeyFor(slot, key));
  });

  const containerPrefix = "container_";
  const containerSuffix = `_${slot}`;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key &&
      key.startsWith(containerPrefix) &&
      key.endsWith(containerSuffix)
    ) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

export function clearActiveSlot() {
  clearSlot(getActiveSlot());
}
