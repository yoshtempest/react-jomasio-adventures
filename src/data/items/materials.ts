import { createItems } from "@/utils/items/createItem";
import { WOODS } from "./woods";

export const MATERIALS = createItems({
  hungry_essence: {
    image: "/assets/items/hungry_essence.svg",
    name: "Essência de Morto",
    description: "A essência de um morto-vivo comum. Fraca, mas serve.",
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
  alchemy_flask: {
    image: "/assets/items/alchemy_flask.svg",
    name: "Frasco de Alquimia",
    description: "Essência alquímica para evoluir o Caldeirão.",
    type: "material",
  },
  secret_ingredient: {
    image: "/assets/items/secret_ingredient.svg",
    name: "Tempero Secreto",
    description: "Tempero raro usado para evoluir a Panela.",
    type: "material",
  },
  prof_mat_lumberjack: {
    image: "/assets/items/prof_mat_lumberjack.svg",
    name: "Casca de Carvalho Ancestral",
    description: "Casca valiosa para evoluir o Machado.",
    type: "material",
  },
  prof_mat_farmer: {
    image: "/assets/items/prof_mat_farmer.svg",
    name: "Semente Mágica",
    description: "Semente encantada para evoluir a Enxada.",
    type: "material",
  },
  prof_mat_fisher: {
    image: "/assets/items/prof_mat_fisher.svg",
    name: "Peixe Dourado",
    description: "Um peixe raro e dourado para evoluir a Vara de Pesca.",
    type: "material",
  },
  prof_mat_pastryChef: {
    image: "/assets/items/prof_mat_pastryChef.svg",
    name: "Açúcar de Cristal",
    description: "Açúcar refinado para evoluir o Rolo de Massa.",
    type: "material",
  },
  prof_mat_butcher: {
    image: "/assets/items/prof_mat_butcher.svg",
    name: "Carne Nobre",
    description: "Corte nobre para evoluir o Cutelo.",
    type: "material",
  },
  prof_mat_bodyBuilder: {
    image: "/assets/items/prof_mat_bodyBuilder.svg",
    name: "Proteína Extrema",
    description: "Suplemento poderoso para evoluir o Halter.",
    type: "material",
  },
  prof_mat_mechanic: {
    image: "/assets/items/prof_mat_mechanic.svg",
    name: "Parafuso Especial",
    description: "Parafuso raro para evoluir a Chave Inglesa.",
    type: "material",
  },
  prof_mat_miner: {
    image: "/assets/items/prof_mat_miner.svg",
    name: "Minério Raro",
    description: "Minério valioso para evoluir a Picareta.",
    type: "material",
  },
  prof_mat_painter: {
    image: "/assets/items/prof_mat_painter.svg",
    name: "Tinta Rara",
    description: "Tinta especial para evoluir o Pincel.",
    type: "material",
  },
  ...WOODS,
} as const);