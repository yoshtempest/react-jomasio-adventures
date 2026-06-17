export const cafeteriaThreeEvents: SceneEvent[] = [
  {
    type: "conditional",
    condition: { hasItem: "sausage" },
    then: [
      { type: "progressQuest", id: "denis_sausage", value: 1 },
      { type: "navigate", to: "/cafeteria/four" },
      { type: "removeItem", itemId: "sausage" },
    ],
  },
];
