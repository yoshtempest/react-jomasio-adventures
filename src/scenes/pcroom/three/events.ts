import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const pcRoomThreeEvents: SceneEvent[] = [
  { type: "giveQuest", questId: "x1_vandinha" },
  { type: "navigate", to: "/pcroom/battle/two" },
];
