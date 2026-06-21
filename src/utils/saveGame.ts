import type { InventoryItem } from "@/utils/types/player/inventory";
import { saveCompressed, loadCompressed, removeKey } from "@/utils/storage";
import type { CharactersProgress } from "@/data/characters/defaultProgress";

export type SaveData = {
  lastRoute: string;
  inventory: InventoryItem[];
  quests: Quest[];
  playerClass: PlayerClass;
  character: string;
  hyperCoins?: number;
  coins?: number;
  progress?: CharactersProgress;
};

const SAVE_KEY = "game_save";
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

// --- Cloud sync ---

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
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

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "Erro na requisição");
  }

  return json as T;
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
