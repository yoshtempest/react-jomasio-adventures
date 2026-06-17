export const hellEvents: SceneEvent[] = [
  {
    type: "conditional",
    condition: { hasQuest: "go_to_hell" },
    then: [{ type: "navigate", to: "/hellroom/one" }],
  },
];
