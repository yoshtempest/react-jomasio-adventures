import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const cantinaOneEvents: SceneEvent[] = [
    {
        type: "conditional",
        condition: { notHasQuest: "director_escape" },
        then: [
          { type: "navigate", to: "/director/one" }
        ],
    },
    {
        type: "conditional",
        condition: {
          hasQuest: "director_escape",
          notHasQuest: "x1_jhowsimar",
        },
        then: [
          { type: "giveQuest", questId: "x1_jhowsimar" },
          { type: "navigate", to: "/cantina/battle" }
        ],
    },
    {
        type: "conditional",
        condition: {
          hasQuest: "x1_jhowsimar",
          notHasFlag: "cantina_battle_done",
        },
        then: [
          { type: "navigate", to: "/cantina/battle" }
        ],
    },
    {
        type: "conditional",
        condition: {
          hasQuest: "x1_jhowsimar",
          hasFlag: "cantina_battle_done",
        },
        then: [
          { type: "progressQuest", id: "x1_jhowsimar", value: 1 },
          { type: "giveQuest", questId: "explore_jorjao" },
          { type: "navigate", to: "/cantina/two" }
        ],
    },
];