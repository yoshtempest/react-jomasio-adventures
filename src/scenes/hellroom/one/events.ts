export const hellroomEvents: SceneEvent[] = [
  {
    type: "conditional",
    condition: { hasFlag: "chose_peru" },
    then: [{ type: "navigate", to: "/hellroom/two" }],
  },
];
