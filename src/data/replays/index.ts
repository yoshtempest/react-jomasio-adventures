import type { ReplayData } from "@/utils/types/replay";
import { saveCompressed, loadCompressed } from "@/utils/save/storage";
import { slotKey } from "@/utils/save/slotManager";

const MAX_REPLAYS = 10;
const REPLAYS_KEY = "replays";

function getReplaysKey(): string {
  return slotKey(REPLAYS_KEY);
}

export function loadReplays(): ReplayData[] {
  return loadCompressed<ReplayData[]>(getReplaysKey()) ?? [];
}

export function saveReplay(replay: ReplayData): boolean {
  const replays = loadReplays();
  if (replays.length >= MAX_REPLAYS) return false;
  replays.push(replay);
  saveCompressed(getReplaysKey(), replays);
  return true;
}

export function deleteReplay(id: string): void {
  const replays = loadReplays().filter((r) => r.id !== id);
  saveCompressed(getReplaysKey(), replays);
}

export function getReplayById(id: string): ReplayData | null {
  return loadReplays().find((r) => r.id === id) ?? null;
}

export { MAX_REPLAYS };
