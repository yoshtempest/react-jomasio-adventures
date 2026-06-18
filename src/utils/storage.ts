import LZString from "lz-string";

export function saveCompressed(key: string, data: unknown): void {
  try {
    const json = JSON.stringify(data);
    const compressed = LZString.compressToUTF16(json);
    localStorage.setItem(key, compressed);
  } catch {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export function loadCompressed<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    if (raw.startsWith("[") || raw.startsWith("{")) {
      return JSON.parse(raw) as T;
    }

    const json = LZString.decompressFromUTF16(raw);
    if (!json) return null;
    return JSON.parse(json) as T;
  } catch {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
}

export function removeKey(key: string): void {
  localStorage.removeItem(key);
}
