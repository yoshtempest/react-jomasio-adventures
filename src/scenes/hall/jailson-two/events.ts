export const jailsonTwoEvents = [
    {
        type: "conditional",
        condition: { notHasFlag: "slimita_battle_won" },
        then: [
          { type: "giveQuest", questId: "x1_slimita" },
          { type: "navigate", to: "/hall/jailson/battle" }
        ],
    },
    {
        type: "conditional",
        condition: {
          hasQuest: "x1_slimita",
          hasFlag: "slimita_battle_won"
        },
        then: [
          { type: "giveQuest", questId: "give_orange_juice" },
          { type: "progressQuest", id: "x1_slimita", value: 1 },
          { type: "navigate", to: "/hall/jailson-one" }
        ],
    },
];