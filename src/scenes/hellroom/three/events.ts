import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const hellroomThreeEvents: SceneEvent[] = [
    {
        type: "conditional",
        condition: { hasQuest: "x1_maugrelo" },
        then: [
          { type: "navigate", to: "/hall/hell" },
        ],
    },
];