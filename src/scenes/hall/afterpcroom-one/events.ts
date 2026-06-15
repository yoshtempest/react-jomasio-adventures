
export const afterPcRoomOneEvents: SceneEvent[] = [
  {
    type: "conditional",
    condition: { hasItem: "aura_letter" },
    then: [
      { type: "progressQuest", id: "letter_delivery", value: 1 },
      { type: "removeItem", itemId: "aura_letter" },
      { type: "giveQuest", questId: "search_packaging" },
    ],
  },
  {
    type: "conditional",
    condition: { hasItem: "package_01" },
    then: [
      { type: "removeItem", itemId: "package_01" },
      { type: "addItem", itemId: "good_powder" },
      { type: "progressQuest", id: "search_packaging", value: 1 },
    ],
  },
  {
    type: "conditional",
    condition: {
      hasItem: "good_powder",
      notHasQuest: "go_cafeteria",
    },
    then: [{ type: "giveQuest", questId: "go_cafeteria" }],
  },
  {
    type: "conditional",
    condition: { hasQuest: "return_to_remedinha", notHasQuest: "help_jailson" },
    then: [
      { type: "progressQuest", id: "encounter_deise", value: 1 },
      { type: "progressQuest", id: "return_to_remedinha", value: 1 },
      { type: "giveQuest", questId: "help_jailson" },
    ],
  },
  {
    type: "conditional",
    condition: { hasQuest: "x1_slimita", notHasQuest: "go_to_hell" },
    then: [
      { type: "progressQuest", id: "help_jailson", value: 1 },
      { type: "giveQuest", questId: "go_to_hell" },
    ],
  },
  {
    type: "conditional",
    condition: { hasQuest: "x1_maugrelo", notHasQuest: "go_to_brodiclass" },
    then: [{ type: "giveQuest", questId: "go_to_brodiclass" }],
  },
];
