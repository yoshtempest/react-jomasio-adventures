export const FILTER_LABELS: {
  type: string;
  label: string;
  src: string;
  separator?: boolean;
}[] = [
  { type: "all", label: "Todos", src: "/assets/items/all.svg" },
  { type: "chest", label: "Baús", src: "/assets/items/filter/chests.svg" },
  { type: "key", label: "Chaves", src: "/assets/items/filter/keys.svg" },
  {
    type: "consumable",
    label: "Poções",
    src: "/assets/items/filter/potions.svg",
  },
  { type: "food", label: "Comidas", src: "/assets/items/filter/foods.svg" },
  {
    type: "material",
    label: "Materiais",
    src: "/assets/items/filter/materials.svg",
  },
  { type: "none", label: "Outros", src: "/assets/items/filter/others.svg" },
  {
    type: "teleport",
    label: "Teletransportes",
    src: "/assets/items/filter/teleports.svg",
  },
  { type: "card", label: "Cartas", src: "/assets/items/filter/cards.svg" },
  { type: "map", label: "Mapas", src: "/assets/items/filter/maps.svg" },
  {
    type: "prof_alchemist",
    label: "Alquimista",
    src: "/assets/badges/professions/alchemist.svg",
    separator: true,
  },
  {
    type: "prof_chef",
    label: "Cozinheiro",
    src: "/assets/badges/professions/pastryChef.svg",
  },
  {
    type: "prof_lumberjack",
    label: "Lenhador",
    src: "/assets/badges/professions/farmer.svg",
  },
  {
    type: "prof_farmer",
    label: "Agricultor",
    src: "/assets/badges/professions/farmer.svg",
  },
  {
    type: "prof_fisher",
    label: "Pescador",
    src: "/assets/badges/professions/fisher.svg",
  },
  {
    type: "prof_pastryChef",
    label: "Confeiteiro",
    src: "/assets/badges/professions/pastryChef.svg",
  },
  {
    type: "prof_butcher",
    label: "Açougueiro",
    src: "/assets/badges/professions/butscher.svg",
  },
  {
    type: "prof_bodyBuilder",
    label: "BodyBuilder",
    src: "/assets/badges/professions/bodybuilder.svg",
  },
  {
    type: "prof_mechanic",
    label: "Mecânico",
    src: "/assets/badges/professions/mechanic.svg",
  },
  {
    type: "prof_miner",
    label: "Mineiro",
    src: "/assets/badges/professions/miner.svg",
  },
  {
    type: "prof_painter",
    label: "Pintor",
    src: "/assets/badges/professions/painter.svg",
  },
];
