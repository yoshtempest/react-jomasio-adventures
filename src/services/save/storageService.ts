import LZString from "lz-string";

/** Backend mínimo de KV necessário para persistência (localStorage-compatible). */
export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  key: (index: number) => string | null;
  readonly length: number;
};

/**
 * Persistência comprimida em KV. O backend é injetado no constructor —
 * em produção é o localStorage; em testes pode ser um Map.
 */
export class StorageService {
  private readonly backend: StorageLike;

  constructor(backend: StorageLike) {
    this.backend = backend;
  }

  saveCompressed(key: string, data: unknown): void {
    try {
      const json = JSON.stringify(data);
      const compressed = LZString.compressToUTF16(json);
      this.backend.setItem(key, compressed);
    } catch {
      this.backend.setItem(key, JSON.stringify(data));
    }
  }

  loadCompressed<T>(key: string): T | null {
    try {
      const raw = this.backend.getItem(key);
      if (!raw) return null;

      if (raw.startsWith("[") || raw.startsWith("{")) {
        return JSON.parse(raw) as T;
      }

      const json = LZString.decompressFromUTF16(raw);
      if (!json) return null;
      return JSON.parse(json) as T;
    } catch {
      try {
        const raw = this.backend.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    }
  }

  removeKey(key: string): void {
    this.backend.removeItem(key);
  }
}

function getDefaultBackend(): StorageLike {
  return localStorage;
}

export const storage = new StorageService(getDefaultBackend());

export const saveCompressed = (key: string, data: unknown): void =>
  storage.saveCompressed(key, data);

export const loadCompressed = <T,>(key: string): T | null =>
  storage.loadCompressed<T>(key);

export const removeKey = (key: string): void => storage.removeKey(key);
