import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const pcRoomTwoEvents: SceneEvent[] = [
    {
        type: "conditional",
        condition: { notHasQuest: "x1_hungry" },
        then: [
            { type: "giveQuest", questId: "x1_hungry" },
            { type: "navigate", to: "/pcroom/battle/one" }
        ],
    },
    {
        type: "conditional",
        condition: { hasFlag: "hungry_battle_won" },
        then: [
            { type: "progressQuest", id: "x1_hungry", value: 1 },
            { type: "navigate", to: "/pcroom/three" }
        ],
    },
];