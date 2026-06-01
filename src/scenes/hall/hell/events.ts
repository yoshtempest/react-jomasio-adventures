import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const hellEvents: SceneEvent[] = [
    {
        type: "conditional",
        condition: { hasQuest: "go_to_hell" },
        then: [
             { type: "navigate", to: "/hellroom/one" }
        ],
    },
];