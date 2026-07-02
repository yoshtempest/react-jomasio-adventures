import { createItems } from "@/utils/items/createItem";

export const COMMON = createItems({
  aura_letter: {
    image: "/assets/items/aura_letter.svg",
    name: "Carta de muita aura",
    description: "Uma carta com uma aura misteriosa. Melhor não ler em voz alta.",
    type: "none",
  },
  package_01: {
    image: "/assets/items/package_01.svg",
    name: "Embalagem com surpresinha",
    description: "Um pacote suspeito. Quem sabe o que tem dentro?",
    type: "none",
  },
  desired_gear: {
    image: "/assets/items/desired_gear.svg",
    name: "Peça desejada",
    description: "Era essa a peça que o Jailson queria?",
    type: "none",
  },
  orange_juice: {
    image: "/assets/items/orange_juice.svg",
    name: "Suco de laranja",
    description: "Suco natural, geladinho. Refrescante. Perfeito para relaxar...",
    type: "none",
  },
  sausage: {
    image: "/assets/items/sausage.svg",
    name: "Linguição Grosso",
    description: "Uma linguiça enorme e suculenta. Dá até água na boca.",
    type: "none",
  },
  turkey: {
    image: "/assets/items/peru.svg",
    name: "Peru Comprido",
    description: "Um peru bem avantajado. O pai do protagonista ficaria orgulhoso.",
    type: "none",
  },
  suspect_milk: {
    image: "/assets/items/suspect_milk.svg",
    name: "Leite Bovino",
    description: "Um leite suspeito. Venceu mês passado.",
    type: "none",
  },
  skool: {
    image: "/assets/items/skool.svg",
    name: "Latinha de Cerveja",
    description: "Uma Skool gelada. Não é a melhor, mas quebra o galho.",
    type: "none",
  },
} as const);
