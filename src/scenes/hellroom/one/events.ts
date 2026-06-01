import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const hellroomEvents: SceneEvent[] = [
    {
        type: "conditional",
        condition: { notHasItem: "turkey" },
        then: [
          { type: "addItem", itemId: "turkey" },
        ],
    },
    {
        type: "conditional",
        condition: { hasItem: "turkey" },
        then: [
          { type: "navigate", to: "/hellroom/two"}
        ],
    },
];