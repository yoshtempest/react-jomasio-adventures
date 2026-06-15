
export const cafeteriaOneEvents: SceneEvent[] = [
  {
    type: "conditional",
    condition: { notHasFlag: "deise" },
    then: [
      { type: "giveQuest", questId: "x1_deise" },
      { type: "navigate", to: "/cafeteria/battle" },
    ],
  },
  {
    type: "conditional",
    condition: {
      hasQuest: "x1_deise",
      hasFlag: "deise",
    },
    then: [
      { type: "giveQuest", questId: "return_to_remedinha" },
      { type: "giveQuest", questId: "encounter_deise" },
      { type: "progressQuest", id: "x1_deise", value: 1 },
      { type: "navigate", to: "/cafeteria/two" },
    ],
  },
];
