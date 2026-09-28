export const FILTER_LABELS: {
  type: string;
  label: string;
  src: string;
  separator?: boolean;
}[] = [
  { type: "all", label: "Todos", src: "all.svg" },
  { type: "chest", label: "Baús", src: "chests.svg" },
  { type: "key", label: "Chaves", src: "keys.svg" },
  {
    type: "consumable",
    label: "Poções",
    src: "potions.svg",
  },
  { type: "food", label: "Comidas", src: "foods.svg" },
  {
    type: "material",
    label: "Materiais",
    src: "materials.svg",
  },
  { type: "none", label: "Outros", src: "others.svg" },
  {
    type: "teleport",
    label: "Teletransportes",
    src: "teleports.svg",
  },
  { type: "card", label: "Cartas", src: "cards.svg" },
  { type: "map", label: "Mapas", src: "maps.svg" },
  {
    type: "prof_alchemist",
    label: "Alquimista",
    src: "alchemist.svg",
    separator: true,
  },
  {
    type: "prof_chef",
    label: "Cozinheiro",
    src: "chef.svg",
  },
  {
    type: "prof_lumberjack",
    label: "Lenhador",
    src: "farmer.svg",
  },
  {
    type: "prof_farmer",
    label: "Agricultor",
    src: "farmer.svg",
  },
  {
    type: "prof_fisher",
    label: "Pescador",
    src: "fisher.svg",
  },
  {
    type: "prof_butcher",
    label: "Açougueiro",
    src: "butcher.svg",
  },
  {
    type: "prof_bodyBuilder",
    label: "BodyBuilder",
    src: "bodyBuilder.svg",
  },
  {
    type: "prof_mechanic",
    label: "Mecânico",
    src: "mechanic.svg",
  },
  {
    type: "prof_miner",
    label: "Mineiro",
    src: "miner.svg",
  },
];
