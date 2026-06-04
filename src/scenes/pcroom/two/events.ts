import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const pcRoomTwoEvents: SceneEvent[] = [
    {
        type: "conditional",
        condition: { notHasFlag: "hungryDeath" },
        then: [
            { type: "giveQuest", questId: "x1_hungry" },
            { type: "navigate", to: "/pcroom/battle/one" }
        ],
    },
    {
        type: "conditional",
        condition: { hasFlag: "hungryDeath" },
        then: [
            { type: "progressQuest", id: "x1_hungry", value: 1 },
            { type: "navigate", to: "/pcroom/three" }
        ],
    },
];