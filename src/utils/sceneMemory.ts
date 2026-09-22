import { SCENE_MEMORIES_KEY } from "@/data/storageKeys";
import { SCENE_MEMORIES } from "@/data/dialogues/sceneMemories";
import { slotKey } from "@/services/save/slotManager";

function loadSeenRoutes(): string[] {
  try {
    const raw = localStorage.getItem(slotKey(SCENE_MEMORIES_KEY));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function hasSeenSceneMemory(route: string): boolean {
  return loadSeenRoutes().includes(route);
}

export function markSceneMemorySeen(route: string): void {
  const seen = loadSeenRoutes();
  if (seen.includes(route)) return;
  seen.push(route);
  localStorage.setItem(slotKey(SCENE_MEMORIES_KEY), JSON.stringify(seen));
}

export function getSceneMemory(route: string): Dialogue[] | undefined {
  return SCENE_MEMORIES[route];
}