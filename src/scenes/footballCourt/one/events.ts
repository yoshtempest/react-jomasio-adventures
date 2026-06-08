import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const footballCourtOneEvents: SceneEvent[] = [
    {
        type: "conditional",
        condition: { notHasFlag: "neimito" },
        then: [
          { type: "navigate", to: "/footballcourt/one" }
        ],
    },
    {
        type: "conditional",
        condition: { hasFlag: "neimito" },
        then: [
          { type: "progressQuest", id: "x1_neimito", value: 1 },
          { type: "navigate", to: "/footballcourt/two" }
        ],
    },
];