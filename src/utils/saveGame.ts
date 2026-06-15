import type { InventoryItem } from "@/utils/types/player/inventory";
import type { Quest } from "@/utils/types/player/quest";
import type { PlayerClass } from "@/utils/types/player/player";

type SaveData = {
  lastRoute: string;

  inventory: InventoryItem[];
  quests: Quest[];

  playerClass: PlayerClass;
  character: string;

  hyperCoins?: number;
};

const SAVE_KEY = "game_save";

export function saveGame(data: SaveData) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function loadGame(): SaveData | null {
  const save = localStorage.getItem(SAVE_KEY);

  if (!save) return null;

  try {
    return JSON.parse(save);
  } catch {
    return null;
  }
}

export function hasSave() {
  return !!localStorage.getItem(SAVE_KEY);
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}
