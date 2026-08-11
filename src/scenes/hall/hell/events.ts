export const hellEvents: SceneEvent[] = [
  {
    type: "conditional",
    condition: {
      hasQuest: "go_to_hell",
      notHasQuest: "x1_maugrelo"
    },
    then: [
      { type: "navigate", to: "/hellroom/one" },
      { type: "progressQuest", id: "go_to_hell", value: 1 }
    ],
  },
];
