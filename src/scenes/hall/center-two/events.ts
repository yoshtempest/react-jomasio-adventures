import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const hallCenterTwoEvents: SceneEvent[] = [
    { type: "navigate", to: "/hall/center" },
    { type: "giveQuest", questId: "x1_planetary_sisters" },
]