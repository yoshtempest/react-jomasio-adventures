export const QUEST_ROUTES: Partial<Record<string, string>> = {
  letter_delivery: "/hall/afterpcroom-one",
  help_jailson: "/hall/afterpcroom-one",
  search_packaging: "/library/one",
  go_cafeteria: "/cafeteria/one",
  return_to_remedinha: "/hall/afterpcroom-one",
  encounter_secret_passages: "/library/secret-passage",
  denis_sausage: "/cafeteria/two",
  encounter_deise: "/cafeteria/one",
  go_to_hell: "/hall/hell",
  go_to_brodiclass: "/hall/thirdclass",
  go_to_pandemony: "/hall/pandemony",
  jomasio_investigate: "/hall/jailson-one",
  explore_jorjao: "/pcroom/one",
  director_escape: "/cantina/one",
  save_ematron: "/footballcourt/one",
  save_samurion: "/hall/center-front",
  like_peru: "/hellroom/one",
  kill_goats: "/hall/one",
};

export const QUEST_NPC_POSITIONS: Record<
  string,
  Array<{ gridX: number; gridY: number }>
> = {
  "/hall/afterpcroom-one": [{ gridX: 4, gridY: 7 }],
  "/cantina/one": [{ gridX: 11, gridY: 3 }],
  "/cafeteria/one": [{ gridX: 14, gridY: 5 }],
  "/pcroom/one": [{ gridX: 8, gridY: 8 }],
  "/hall/jailson-one": [{ gridX: 8, gridY: 3 }],
  "/hall/jailson-two": [
    { gridX: 8, gridY: 3 },
    { gridX: 8, gridY: 4 },
  ],
  "/hall/center-two": [
    { gridX: 8, gridY: 3 },
    { gridX: 9, gridY: 3 },
  ],
  "/hall/hell": [{ gridX: 11, gridY: 6 }],
  "/hall/pandemony": [{ gridX: 8, gridY: 3 }],
  "/footballcourt/one": [
    { gridX: 9, gridY: 4 },
    { gridX: 10, gridY: 4 },
  ],
};
