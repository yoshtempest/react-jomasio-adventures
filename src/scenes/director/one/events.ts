import type { SceneEvent } from "@/utils/types/maps/sceneEvents";

export const directorEvents: SceneEvent[] = [
    {
        type: "conditional",
        condition: { notHasQuest: "director_escape" },
        then: [
          { type: "giveQuest", questId: "director_escape" },
          { type: "navigate", to: "/director/two"}
        ],
    },
];