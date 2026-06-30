export const hellroomEvents: SceneEvent[] = [
  {
    type: "conditional",
    condition: { hasItem: "turkey" },
    then: [{ type: "navigate", to: "/hellroom/two" }],
  },
];
