import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const cafeteriaTwoEvents: SceneEvent[] = [
    { type: "giveQuest", questId: "denis_sausage", },
    { type: "navigate", to: "/cafeteria/three" }
];