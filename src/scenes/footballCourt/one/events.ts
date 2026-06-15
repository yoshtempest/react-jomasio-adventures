
export const footballCourtOneEvents: SceneEvent[] = [
  {
    type: "conditional",
    condition: { notHasFlag: "neimito" },
    then: [
      { type: "giveQuest", questId: "x1_neimito" },
      { type: "navigate", to: "/footballcourt/one" },
    ],
  },
  {
    type: "conditional",
    condition: { hasFlag: "neimito" },
    then: [
      { type: "progressQuest", id: "x1_neimito", value: 1 },
      { type: "navigate", to: "/footballcourt/two" },
    ],
  },
];
