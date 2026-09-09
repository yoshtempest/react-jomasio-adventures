import { BLOCKS_KEY } from "@/data/storageKeys";
import { createSlotJsonStorage } from "@/utils/rewards/createSlotJsonStorage";

export type BlockData = {
  total: number;
  perCharacter: Record<string, number>;
};

const blocksStorage = createSlotJsonStorage(BLOCKS_KEY, (): BlockData => ({
  total: 0,
  perCharacter: {},
}));

export function incrementBlockCount(character: string): void {
  const data = blocksStorage.load();
  data.total += 1;
  data.perCharacter[character] = (data.perCharacter[character] ?? 0) + 1;
  blocksStorage.save(data);
}

export function getBlockCount(): BlockData {
  return blocksStorage.load();
}
