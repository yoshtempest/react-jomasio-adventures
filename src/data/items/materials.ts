import { createItems } from "@/utils/items/createItem";

export const MATERIALS = createItems({
  hungry_essence: {
    image: "/assets/items/hungry_essence.svg",
    name: "Essência de Morto",
    description: "A essência de um morto-vivo comum. Fraca, mas serve.",
    type: "material",
  },
  oak_wood: {
    image: "/assets/items/woods/oak.svg",
    name: "Madeira de Carvalho",
    description: "Madeira de carvalho, boa para fazer casas facilmente incendiáveis",
    type: "material",
  },
  eucalyptus_wood: {
    image: "/assets/items/woods/eucalyptus.svg",
    name: "Madeira de Eucalipto",
    description: "Ótima para uma casa na árvore",
    type: "material",
  },
  birch_wood: {
    image: "/assets/items/woods/birch.svg",
    name: "Madeira de Bétula",
    description: "Quem é essa mesmo?",
    type: "material",
  },
  jungle_wood: {
    image: "/assets/items/woods/jungle.svg",
    name: "Madeira Selvagem",
    description: "Madeira selvagem diretamente da floresta amazônica",
    type: "material",
  },
  cherry_wood: {
    image: "/assets/items/woods/cherry.svg",
    name: "Madeira de Cerejeira",
    description: "Oxe, estamos entrando em um anime de romance?",
    type: "material",
  },
  goat_horn: {
    image: "/assets/items/goat_horn.svg",
    name: "Chifre de Cabra",
    description: "Um chifre retorcido de cabra. Ainda tem um pouco de sangue.",
    type: "material",
  },
  figurant_totem: {
    image: "/assets/items/figurant_totem.svg",
    name: "Totem de Figurante",
    description: "Um totem tosco esculpido por figurantes de culto.",
    type: "material",
  },
  rare_scale: {
    image: "/assets/items/rare_scale.svg",
    name: "Escama Rara",
    description: "Uma escama brilhante de uma criatura rara. Muito valiosa.",
    type: "material",
  },
  epic_core: {
    image: "/assets/items/epic_core.svg",
    name: "Núcleo Épico",
    description: "O núcleo pulsante de um ser épico. Energia pura.",
    type: "material",
  },
  boss_soul: {
    image: "/assets/items/boss_soul.svg",
    name: "Alma de Chefão",
    description: "A alma de um chefão derrotado. Poderosa e rara.",
    type: "material",
  },
  legendary_fragment: {
    image: "/assets/items/legendary_fragment.svg",
    name: "Fragmento Lendário",
    description: "Um fragmento de poder lendário. Dizem que reúne os sete.",
    type: "material",
  },
} as const);
