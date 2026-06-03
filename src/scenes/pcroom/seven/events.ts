import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const pcRoomSevenEvents: SceneEvent[] = [
    {
        type: "conditional",
        condition: { notHasFlag: "hungryking_battle_won" },
        then: [
            { type: "giveQuest", questId: "x1_hungry_king" },
            { type: "navigate", to: "/pcroom/battle/three" }
        ],
    },
    {
        type: "conditional",
        condition: { hasFlag: "hungryking_battle_won" },
        then: [
            { type: "navigate", to: "/pcroom/six" }
        ],
    },
];