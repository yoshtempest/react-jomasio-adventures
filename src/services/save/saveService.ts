import type { CharactersProgress } from "@/data/characters/defaultProgress";
import type { InventoryItem } from "@/utils/types/player/inventory";
import { storage } from "./storageService";
import { slotManager, slotKeyFor, type SlotIndex } from "./slotManager";

export type SaveData = {
  lastRoute: string;
  inventory: InventoryItem[];
  quests: Quest[];
  playerClass: PlayerClass;
  character: string;
  progress?: CharactersProgress;
};

type TokenProvider = () => string | null;

/**
 * Snapshot de save (rota + inventário + quests + personagem) e sync na
 * nuvem. Dependências injetadas no constructor; wrappers standalone no
 * fim do arquivo mantêm a API antiga de módulo.
 */
export class SaveService {
  private readonly apiBase: string;
  private readonly tokenProvider: TokenProvider;

  constructor(
    apiBase: string = "/api",
    tokenProvider: TokenProvider = () => localStorage.getItem("jomasio_token"),
  ) {
    this.apiBase = apiBase;
    this.tokenProvider = tokenProvider;
  }

  // --- Local storage ---

  saveGame(data: SaveData) {
    storage.saveCompressed(slotManager.slotKey("game_save"), data);
  }

  loadGame(): SaveData | null {
    return storage.loadCompressed<SaveData>(slotManager.slotKey("game_save"));
  }

  hasSave() {
    return slotManager.hasAnySave();
  }

  deleteSave() {
    storage.removeKey(slotManager.slotKey("game_save"));
  }

  loadGameForSlot(slot: SlotIndex): SaveData | null {
    return storage.loadCompressed<SaveData>(
      slotManager.slotKeyFor(slot, "game_save"),
    );
  }

  getPlayTimeForSlot(slot: SlotIndex): number {
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

  async saveGameToCloud(data: SaveData): Promise<void> {
    try {
      await this.request("PUT", "/save", { data });
    } catch (err) {
      console.warn("Falha ao salvar na nuvem:", err);
    }
  }

  async loadGameFromCloud(): Promise<SaveData | null> {
    try {
      const res = await this.request<{ data: unknown }>("GET", "/save");
      if (!res.data) return null;
      return res.data as SaveData;
    } catch {
      return null;
    }
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const token = this.tokenProvider();
    if (!token) throw new Error("Não autenticado");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const res = await fetch(`${this.apiBase}${path}`, {
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
}

export const saveService = new SaveService();

export const saveGame = (data: SaveData): void => saveService.saveGame(data);
export const loadGame = (): SaveData | null => saveService.loadGame();
export const hasSave = (): boolean => saveService.hasSave();
export const deleteSave = (): void => saveService.deleteSave();
export const loadGameForSlot = (slot: SlotIndex): SaveData | null =>
  saveService.loadGameForSlot(slot);
export const getPlayTimeForSlot = (slot: SlotIndex): number =>
  saveService.getPlayTimeForSlot(slot);
export const saveGameToCloud = async (data: SaveData): Promise<void> =>
  saveService.saveGameToCloud(data);
export const loadGameFromCloud = (): Promise<SaveData | null> =>
  saveService.loadGameFromCloud();
