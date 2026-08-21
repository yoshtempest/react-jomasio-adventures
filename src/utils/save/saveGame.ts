import type { InventoryItem } from "@/utils/types/player/inventory";
import {
  saveCompressed,
  loadCompressed,
  removeKey,
} from "@/utils/save/storage";
import {
  slotKey,
  slotKeyFor,
  hasAnySave,
  type SlotIndex,
} from "@/utils/save/slotManager";
import type { CharactersProgress } from "@/data/characters/defaultProgress";

export type SaveData = {
  lastRoute: string;
  inventory: InventoryItem[];
  quests: Quest[];
  playerClass: PlayerClass;
  character: string;
  progress?: CharactersProgress;
};

const SAVE_KEY = () => slotKey("game_save");
const API_BASE = "/api";

function getToken(): string | null {
  try {
    return localStorage.getItem("jomasio_token");
  } catch {
    return null;
  }
}

// --- Local storage ---

export function saveGame(data: SaveData) {
  saveCompressed(SAVE_KEY(), data);
}

export function loadGame(): SaveData | null {
  return loadCompressed<SaveData>(SAVE_KEY());
}

export function hasSave() {
  return hasAnySave();
}

export function deleteSave() {
  removeKey(SAVE_KEY());
}

export function loadGameForSlot(slot: SlotIndex): SaveData | null {
  return loadCompressed<SaveData>(slotKeyFor(slot, "game_save"));
}

export function getPlayTimeForSlot(slot: SlotIndex): number {
  try {
    const raw = localStorage.getItem(slotKeyFor(slot, "play_time"));
    if (!raw) return 0;
    const data = JSON.parse(raw) as { playTime?: Record<string, number> };
    if (!data.playTime) return 0;
    return Object.values(data.playTime).reduce((sum, t) => sum + (t ?? 0), 0);
  } catch {
    return 0;
  }
}

// --- Cloud sync ---

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = getToken();
  if (!token) throw new Error("Não autenticado");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = (await res.json()) as T;

  if (!res.ok) {
    const err = json as { error?: string };
    throw new Error(err.error || "Erro na requisição");
  }

  return json;
}

export async function saveGameToCloud(data: SaveData): Promise<void> {
  try {
    await request("PUT", "/save", { data });
  } catch (err) {
    console.warn("Falha ao salvar na nuvem:", err);
  }
}

export async function loadGameFromCloud(): Promise<SaveData | null> {
  try {
    const res = await request<{ data: unknown }>("GET", "/save");
    if (!res.data) return null;
    return res.data as SaveData;
  } catch {
    return null;
  }
}
