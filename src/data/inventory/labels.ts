export const FILTER_LABELS: {
  type: string;
  label: string;
  src: string;
  separator?: boolean;
}[] = [
  { type: "all", label: "Todos", src: "/all.svg" },
  { type: "chest", label: "Baús", src: "/filter/chests.svg" },
  { type: "key", label: "Chaves", src: "/filter/keys.svg" },
  {
    type: "consumable",
    label: "Poções",
    src: "/filter/potions.svg",
  },
  { type: "food", label: "Comidas", src: "/filter/foods.svg" },
  {
    type: "material",
    label: "Materiais",
    src: "/filter/materials.svg",
  },
  { type: "none", label: "Outros", src: "/filter/others.svg" },
  {
    type: "teleport",
    label: "Teletransportes",
    src: "/filter/teleports.svg",
  },
  { type: "card", label: "Cartas", src: "/filter/cards.svg" },
  { type: "map", label: "Mapas", src: "/filter/maps.svg" },
  {
    type: "prof_alchemist",
    label: "Alquimista",
    src: "/alchemist.svg",
    separator: true,
  },
  {
    type: "prof_chef",
    label: "Cozinheiro",
    src: "/pastryChef.svg",
  },
  {
    type: "prof_lumberjack",
    label: "Lenhador",
    src: "/farmer.svg",
  },
  {
    type: "prof_farmer",
    label: "Agricultor",
    src: "/farmer.svg",
  },
  {
    type: "prof_fisher",
    label: "Pescador",
    src: "/fisher.svg",
  },
  {
    type: "prof_butcher",
    label: "Açougueiro",
    src: "/butscher.svg",
  },
  {
    type: "prof_bodyBuilder",
    label: "BodyBuilder",
    src: "/bodyBuilder.svg",
  },
  {
    type: "prof_mechanic",
    label: "Mecânico",
    src: "/mechanic.svg",
  },
  {
    type: "prof_miner",
    label: "Mineiro",
    src: "/miner.svg",
  },
];
