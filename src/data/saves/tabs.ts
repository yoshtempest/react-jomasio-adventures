export type SaveTab = "saves" | "replays";

export const SAVE_TABS: SaveTab[] = ["saves", "replays"];
export const SAVE_TAB_COUNT = SAVE_TABS.length;

export const SAVE_TAB_LABELS: Record<SaveTab, string> = {
  saves: "Saves",
  replays: "Replays",
};
