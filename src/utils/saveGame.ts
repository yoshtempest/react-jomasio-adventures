import type { InventoryItem } from "@/utils/types/player/inventory";
import { saveCompressed, loadCompressed, removeKey } from "@/utils/storage";

export type SaveData = {
  lastRoute: string;
  inventory: InventoryItem[];
  quests: Quest[];
  playerClass: PlayerClass;
  character: string;
  hyperCoins?: number;
};

const SAVE_KEY = "game_save";

export function saveGame(data: SaveData) {
  saveCompressed(SAVE_KEY, data);
}

export function loadGame(): SaveData | null {
  return loadCompressed<SaveData>(SAVE_KEY);
}

export function hasSave() {
  return !!localStorage.getItem(SAVE_KEY);
}

export function deleteSave() {
  removeKey(SAVE_KEY);
}
