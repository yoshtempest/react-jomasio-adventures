import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const afterPcRoomOneEvents: SceneEvent[] = [
    {
        type: "conditional",
        condition: { hasItem: "aura_letter" },
        then: [
            { type: "progressQuest", id: "letter_delivery", value: 1 },
            { type: "removeItem", itemId: "aura_letter" },
            { type: "giveQuest", questId: "search_packaging" },
        ],
    },
    {
        type: "conditional",
        condition: { hasItem: "package_01" },
        then: [
            { type: "removeItem", itemId: "package_01" },
            { type: "addItem", itemId: "good_powder" },
            { type: "progressQuest", id: "search_packaging", value: 1 }
        ],
    },
    {
        type: "conditional",
        condition: {
            hasItem: "good_powder",
            notHasQuest: "go_cafeteria"
        },
        then: [
            { type: "giveQuest", questId: "go_cafeteria" }
        ]
    },
    {
        type: "conditional",
        condition: { hasQuest: "return_to_remedinha" },
        then: [
            { type: "progressQuest", id: "encounter_deise", value: 1 },
            { type: "progressQuest", id: "return_to_remedinha", value: 1 },
            { type: "giveQuest", questId: "help_jailson" }
        ],
    },
]