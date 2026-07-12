export const cantinaOneEvents: SceneEvent[] = [
  {
    type: "conditional",
    condition: {
      notHasFlag: "jhowsimar",
      notHasQuest: "director_escape",
    },
    then: [
      {
        type: "playSound",
        src: "public/assets/songs/soundEffects/npc/jhowsimar/getTheLapada.mp3",
        volume: 1,
      },
      { type: "navigate", to: "/director/one" },
    ],
  },
  {
    type: "conditional",
    condition: {
      hasQuest: "director_escape",
      notHasFlag: "jhowsimar",
    },
    then: [
      { type: "giveQuest", questId: "x1_jhowsimar" },
      { type: "navigate", to: "/cantina/battle" },
    ],
  },
  {
    type: "conditional",
    condition: { hasFlag: "jhowsimar" },
    then: [
      { type: "progressQuest", id: "x1_jhowsimar", value: 1 },
      { type: "giveQuest", questId: "explore_jorjao" },
      { type: "navigate", to: "/cantina/two" },
    ],
  },
];
