import { BLOCKS_KEY } from "@/data/storageKeys";
import { slotKey } from "@/utils/save/slotManager";

export type BlockData = {
  total: number;
  perCharacter: Record<string, number>;
};

function createDefault(): BlockData {
  return { total: 0, perCharacter: {} };
}

function loadBlocks(): BlockData {
  try {
    const raw = localStorage.getItem(slotKey(BLOCKS_KEY));
    if (!raw) return createDefault();
    return JSON.parse(raw) as BlockData;
  } catch {
    return createDefault();
  }
}

function saveBlocks(data: BlockData): void {
  try {
    localStorage.setItem(slotKey(BLOCKS_KEY), JSON.stringify(data));
  } catch {}
}

export function incrementBlockCount(character: string): void {
  const data = loadBlocks();
  data.total += 1;
  data.perCharacter[character] = (data.perCharacter[character] ?? 0) + 1;
  saveBlocks(data);
}

export function getBlockCount(): BlockData {
  return loadBlocks();
}
