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
 * Marca todo payload comprimido escrito por esta versão.
 *
 * Sem ela, a leitura tinha que adivinhar o formato pelo primeiro
 * caractere — e `compressToUTF16` emite code points a partir de 32, o
 * que inclui `[` (91) e `{` (123). Um payload comprimido podia começar
 * com um deles e ser lido como JSON.
 */
const COMPRESSED_PREFIX = "lz1:";

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
      this.backend.setItem(key, COMPRESSED_PREFIX + compressed);
    } catch {
      this.backend.setItem(key, JSON.stringify(data));
    }
  }

  /**
   * Lê `key`, aceitando os três formatos que podem estar gravados.
   *
   * Payload novo carrega `COMPRESSED_PREFIX` e é decidido sem
   * ambiguidade. Sem o prefixo, o valor veio de uma versão anterior e o
   * formato precisa ser adivinhado — mas aí cada palpite tem o outro
   * como alternativa, em vez de a falha do primeiro derrubar a leitura
   * inteira. Era esse o caminho que perdia save: um payload comprimido
   * começando com `[` ou `{` ia para o `JSON.parse`, estourava, e o
   * fallback tentava exatamente o mesmo parse de novo.
   */
  loadCompressed<T>(key: string): T | null {
    const raw = this.backend.getItem(key);
    if (!raw) return null;

    if (raw.startsWith(COMPRESSED_PREFIX)) {
      return this.decompress<T>(raw.slice(COMPRESSED_PREFIX.length));
    }

    if (raw.startsWith("[") || raw.startsWith("{")) {
      return this.parse<T>(raw) ?? this.decompress<T>(raw);
    }

    return this.decompress<T>(raw) ?? this.parse<T>(raw);
  }

  private parse<T>(json: string): T | null {
    try {
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  }

  private decompress<T>(payload: string): T | null {
    try {
      const json = LZString.decompressFromUTF16(payload);
      return json ? this.parse<T>(json) : null;
    } catch {
      return null;
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
