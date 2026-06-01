import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const hellroomTwoEvents: SceneEvent[] = [
    {
        type: "conditional",
        condition: { hasItem: "turkey" },
        then: [
          { type: "giveQuest", questId: "x1_maugrelo" },
          { type: "navigate", to: "/hellroom/battle" },
        ],
    },
];