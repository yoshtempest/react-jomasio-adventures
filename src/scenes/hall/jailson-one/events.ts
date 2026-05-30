import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const jailsonOneEvents: SceneEvent[] = [
    {
        type: "conditional",
        condition: { notHasQuest: "give_orange_juice" },
        then: [
            { type: "addItem", itemId: "jorjao_map"},
            { type: "giveQuest", questId: "give_orange_juice" },
        ],
    },
    {
        type: "conditional",
        condition: {
            hasItem: "orange_juice",
            hasQuest: "give_orange_juice"
        },
        then: [
            { type: "removeItem", itemId: "orange_juice" },
            { type: "giveQuest", questId: "create_map" },
            { type: "progressQuest", id: "give_orange_juice", value: 1 },
        ],
    },
    {
        type: "conditional",
        condition: { hasQuest: "create_map", hasItem: "desired_gear" },
        then: [
            { type: "removeItem", itemId: "desired_gear" },
            { type: "addItem", itemId: "jorjao_map" },
            { type: "progressQuest", id: "create_map", value: 1 },
        ],
    },
];